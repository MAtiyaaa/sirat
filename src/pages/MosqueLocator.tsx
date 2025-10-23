// src/pages/MosqueLocator.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  LocateFixed,
  Navigation,
  Loader2,
  ExternalLink,
  Share2,
  X,
  ArrowUpDown,
  Map as MapIcon,
} from "lucide-react";

// ---------- lightweight helpers ----------
function useCdnResource(hrefOrSrc: string, type: "css" | "js") {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const existing =
      type === "js"
        ? Array.from(document.scripts).find((s) => s.src === hrefOrSrc)
        : Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find(
            (l) => (l as HTMLLinkElement).href === hrefOrSrc
          );

    if (existing) {
      setReady(true);
      return;
    }
    if (type === "js") {
      const s = document.createElement("script");
      s.src = hrefOrSrc;
      s.async = true;
      s.onload = () => setReady(true);
      s.onerror = () => setReady(false);
      document.body.appendChild(s);
    } else {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      (l as HTMLLinkElement).href = hrefOrSrc;
      l.onload = () => setReady(true);
      l.onerror = () => setReady(false);
      document.head.appendChild(l);
    }
  }, [hrefOrSrc, type]);
  return ready;
}

function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

// Lucide-style MapPin as an inline SVG icon for Leaflet
function pinIcon(options?: { color?: string; fill?: string }) {
  const color = options?.color ?? "#10b981"; // emerald stroke
  const fill = options?.fill ?? "#10b981";   // emerald fill

  const svg = `
    <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="12" cy="22" rx="5.5" ry="2" fill="rgba(0,0,0,0.18)"></ellipse>
      <path d="M12 22c-4.2-4.3-6-7.5-6-10a6 6 0 1 1 12 0c0 2.5-1.8 5.7-6 10Z"
            fill="${fill}" stroke="${color}" stroke-width="1.5" />
      <circle cx="12" cy="11" r="2.5" fill="white" stroke="${color}" stroke-width="1.5"/>
    </svg>
  `.trim();

  // @ts-ignore
  return (window as any).L.divIcon({
    className: "pin-icon",
    html: svg,
    iconSize: [28, 28],
    iconAnchor: [14, 26],   // tip sits near bottom
    popupAnchor: [0, -26],
  });
}

type Mosque = {
  id: string | number;
  name: string;
  lat: number;
  lon: number;
  dist: number; // meters
  addr?: string;
};

// ---------- component ----------
const MosqueLocator = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Mosque | null>(null);

  // sorting for desktop table
  const [sortKey, setSortKey] = useState<"name" | "dist">("dist");
  const [sortAsc, setSortAsc] = useState(true);

  // Leaflet via CDN (no installs)
  const leafletCssReady = useCdnResource(
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css",
    "css"
  );
  const leafletJsReady = useCdnResource(
    "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js",
    "js"
  );

  const mapRef = useRef<any>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const userMarkerRef = useRef<any>(null);
  const mosqueLayersRef = useRef<any>(null); // a layer group to manage pins

  // responsive switch for list rendering
  const [isMobile, setIsMobile] = useState<boolean>(() => window.innerWidth < 640);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const ui = useMemo(
    () => ({
      title: ar ? "خريطة مساجد قريبة" : "Nearby Mosques Map",
      subtitle: ar
        ? "نحدّد موقعك تلقائيًا. كَبّر/صغِّر أو حرّك الخريطة لتحميل المزيد حسب عرض الخريطة."
        : "We’ll ask for your location automatically. Zoom or pan to load more based on the current view.",
      locate: ar ? "إعادة تحديد الموقع" : "Refresh my location",
      locating: ar ? "جاري تحديد موقعك..." : "Locating you...",
      openMaps: ar ? "افتح في الخرائط" : "Open in Maps",
      share: ar ? "مشاركة" : "Share",
      meters: ar ? "م" : "m",
      km: ar ? "كم" : "km",
      noResults: ar ? "لا توجد مساجد ضمن هذه المنطقة." : "No mosques in this view.",
      listTitle: ar ? "المساجد" : "Mosques",
      nameCol: ar ? "الاسم" : "Name",
      distCol: ar ? "المسافة" : "Distance",
      actionsCol: ar ? "إجراءات" : "Actions",
      close: ar ? "إغلاق" : "Close",
      options: ar ? "خيارات" : "Options",
      chooseApp: ar ? "اختر تطبيق الخرائط" : "Choose a maps app",
      google: "Google Maps",
      apple: "Apple Maps",
      waze: "Waze",
    }),
    [ar]
  );

  // ask for location automatically on mount
  useEffect(() => {
    getLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLocation = () => {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError(ar ? "المتصفح لا يدعم تحديد الموقع." : "Geolocation not supported.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setLoc({ lat: latitude, lon: longitude });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        setError(
          ar
            ? "تعذّر الحصول على الإذن بالموقع. من فضلك فعّل مشاركة الموقع."
            : "Location permission denied or unavailable. Please enable sharing."
        );
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  };

  // Overpass query for current map bounds
  const fetchMosquesForBounds = useCallback(
    async (bounds: any) => {
      try {
        if (!bounds) return;
        setLoading(true);
        setError(null);

        const south = bounds.getSouth();
        const west = bounds.getWest();
        const north = bounds.getNorth();
        const east = bounds.getEast();

        const q = `[out:json][timeout:25];
        (
          node["amenity"="place_of_worship"]["religion"="muslim"](${south},${west},${north},${east});
          way["amenity"="place_of_worship"]["religion"="muslim"](${south},${west},${north},${east});
          relation["amenity"="place_of_worship"]["religion"="muslim"](${south},${west},${north},${east});
        );
        out center 200;`;

        const res = await fetch("https://overpass-api.de/api/interpreter", {
          method: "POST",
          headers: { "Content-Type": "text/plain;charset=UTF-8" },
          body: q,
        });
        const json = await res.json();

        const centerRef = loc ?? { lat: (south + north) / 2, lon: (west + east) / 2 };
        const list: Mosque[] =
          (json.elements || [])
            .map((el: any) => {
              const center = el.center || el;
              if (!center?.lat || !center?.lon) return null;
              const name =
                el.tags?.name ??
                el.tags?.["name:en"] ??
                el.tags?.["name:ar"] ??
                (ar ? "مسجد بدون اسم" : "Unnamed Mosque");
              const addr =
                el.tags?.["addr:full"] ??
                `${el.tags?.["addr:street"] ?? ""} ${el.tags?.["addr:city"] ?? ""}`.trim();
              const d = haversine(centerRef.lat, centerRef.lon, center.lat, center.lon);
              return {
                id: el.id,
                name,
                lat: center.lat,
                lon: center.lon,
                dist: d,
                addr: addr || undefined,
              } as Mosque;
            })
            .filter(Boolean) || [];

        list.sort((a, b) => a.dist - b.dist);
        setMosques(list);
      } catch (e) {
        console.error(e);
        setError(ar ? "تعذّر جلب النتائج." : "Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    },
    [ar, loc]
  );

  // init map & wire events
  useEffect(() => {
    if (!leafletCssReady || !leafletJsReady || !mapDivRef.current) return;
    // @ts-ignore
    const L = (window as any).L as typeof import("leaflet");
    if (!L) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapDivRef.current, {
        center: loc ? [loc.lat, loc.lon] : [24.7136, 46.6753], // fallback: Riyadh
        zoom: loc ? 14 : 5,
        zoomControl: false,
      });
      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);

      mosqueLayersRef.current = L.layerGroup().addTo(mapRef.current);
    }

    if (loc) {
      const userIcon = L.divIcon({
        className: "user-marker",
        html: `<div class="rounded-full bg-primary/90 text-background text-[10px] px-2 py-1 shadow">${ar ? "أنت" : "You"}</div>`,
        iconSize: [40, 20],
        iconAnchor: [20, 10],
      });
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([loc.lat, loc.lon]);
      } else {
        userMarkerRef.current = L.marker([loc.lat, loc.lon], { icon: userIcon }).addTo(mapRef.current);
      }
      mapRef.current.setView([loc.lat, loc.lon], 14);
    }

    const debouncedFetch = debounce(() => {
      const b = mapRef.current.getBounds();
      fetchMosquesForBounds(b);
    }, 400);

    mapRef.current.on("moveend zoomend", debouncedFetch);
    debouncedFetch(); // initial

    return () => {
      mapRef.current?.off("moveend", debouncedFetch);
      mapRef.current?.off("zoomend", debouncedFetch);
    };
  }, [leafletCssReady, leafletJsReady, loc, ar, fetchMosquesForBounds]);

  // draw real pins (MapPin icon), names stay in the list only
  useEffect(() => {
    // @ts-ignore
    const L = (window as any).L as typeof import("leaflet");
    if (!L || !mapRef.current || !mosqueLayersRef.current) return;

    mosqueLayersRef.current.clearLayers();

    mosques.forEach((m) => {
      const marker = L.marker([m.lat, m.lon], {
        icon: pinIcon({ color: "#10b981", fill: "#10b981" }),
        zIndexOffset: 500,
        keyboard: false,
        riseOnHover: true,
      }).addTo(mosqueLayersRef.current);

      marker.on("click", () => setSelected(m));
    });
  }, [mosques]);

  // sorting/table helpers
  const onSort = (key: "name" | "dist") => {
    if (sortKey === key) setSortAsc((s) => !s);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  const sorted = useMemo(() => {
    const copy = [...mosques];
    copy.sort((a, b) => {
      const valA = sortKey === "name" ? a.name.toLowerCase() : a.dist;
      const valB = sortKey === "name" ? b.name.toLowerCase() : b.dist;
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return copy.slice(0, 50);
  }, [mosques, sortKey, sortAsc]);

  const formatDistance = (m: number) =>
    m >= 1000 ? `${(m / 1000).toFixed(1)} ${ui.km}` : `${Math.round(m)} ${ui.meters}`;

  // app chooser
  const openInApp = (m: Mosque, app: "google" | "apple" | "waze") => {
    let url = "";
    const label = encodeURIComponent(m.name);
    if (app === "google") {
      url = `https://www.google.com/maps/dir/?api=1&destination=${m.lat},${m.lon}&destination_place_id=&travelmode=driving`;
    } else if (app === "apple") {
      url = `http://maps.apple.com/?daddr=${m.lat},${m.lon}&q=${label}`;
    } else {
      url = `https://waze.com/ul?ll=${m.lat},${m.lon}&navigate=yes`;
    }
    window.open(url, "_blank");
  };

  const shareMosque = async (m: Mosque) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lon}`;
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: m.name,
          text: `${m.name} — ${formatDistance(m.dist)}`,
          url: mapsUrl,
        });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(`${m.name}\n${mapsUrl}`);
      alert(ar ? "تم نسخ الرابط." : "Link copied to clipboard.");
    } catch {
      window.open(mapsUrl, "_blank");
    }
  };

  return (
    <div className="min-h-screen pb-28 bg-gradient-to-b from-background via-background to-primary/5">
      {/* Keep other menus/sheets above Leaflet; add pin hover polish */}
      <style>{`
        .leaflet-pane, .leaflet-top, .leaflet-bottom { z-index: 1 !important; }
        .pin-icon { transition: transform 120ms ease, filter 120ms ease; will-change: transform; }
        .pin-icon:hover { transform: translateY(-2px) scale(1.04); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25)); }
      `}</style>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header with enhanced design */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-emerald-500/10 to-primary/10 rounded-2xl blur-2xl opacity-50 group-hover:opacity-70 smooth-transition" />
          <Card className="relative glass-effect border-primary/20 p-4 sm:p-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="shrink-0 h-10 w-10 rounded-xl hover:bg-primary/10 hover:scale-105 smooth-transition"
                aria-label={back}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg">
                    <MapIcon className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary via-emerald-600 to-primary bg-clip-text text-transparent">
                    {ui.title}
                  </h1>
                </div>
                <p className="text-sm text-muted-foreground ml-[52px]">{ui.subtitle}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Controls with better design */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={getLocation}
            disabled={loading}
            className="h-12 px-6 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg hover:shadow-xl smooth-transition gap-2 text-white font-medium"
            variant="default"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            {loading ? (ar ? "جاري التحميل..." : "Loading...") : ui.locate}
          </Button>
          {error && (
            <div className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-destructive/10 text-destructive text-sm border border-destructive/20">
              {error}
            </div>
          )}
        </div>

        {/* Map with enhanced styling */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-70 smooth-transition" />
          <Card className="relative glass-effect border-primary/30 h-[400px] sm:h-[500px] overflow-hidden shadow-2xl">
            <div className="absolute inset-0">
              <div ref={mapDivRef} className="w-full h-full rounded-2xl" />
              {!leafletJsReady || !leafletCssReady ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/95 backdrop-blur-sm">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center animate-pulse">
                    <MapIcon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="text-sm font-medium text-muted-foreground">
                      {ar ? "جاري تحميل الخريطة..." : "Loading map..."}
                    </span>
                  </div>
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        {/* Results with enhanced design */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 smooth-transition" />
          <Card className="relative glass-effect border-primary/30 shadow-xl p-0">
            <div className="px-4 sm:px-6 py-4 border-b border-primary/20 bg-gradient-to-r from-primary/5 to-emerald-500/5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg">
                    <MapIcon className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{ui.listTitle}</h2>
                    <p className="text-xs text-muted-foreground">
                      {mosques.length} {ar ? "مسجد قريب" : "nearby"}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground px-3 py-1.5 rounded-full bg-muted/50 border border-primary/20">
                  {ar ? "تتحدّث القائمة مع تحريك/تكبير الخريطة" : "Updates as you move/zoom"}
                </div>
              </div>
            </div>

            {/* Mobile: cards | Desktop: table */}
            {isMobile ? (
              <div className="p-4 grid gap-3">
                {mosques.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="inline-flex h-16 w-16 rounded-2xl bg-muted items-center justify-center mb-4">
                      <MapIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground">{error ? error : ui.noResults}</p>
                  </div>
                ) : (
                  sorted.map((m) => (
                    <div key={m.id} className="relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-emerald-400/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition" />
                      <Card className="relative glass-effect border-primary/20 hover:border-primary/40 shadow-lg hover:shadow-xl smooth-transition p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-emerald-500/20 flex items-center justify-center border border-primary/30 shadow-md">
                            <MapPin className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <h3 className="font-bold text-base truncate">{m.name}</h3>
                              <span className="text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-primary/20 to-emerald-500/20 text-primary font-semibold whitespace-nowrap border border-primary/30">
                                {formatDistance(m.dist)}
                              </span>
                            </div>
                            {m.addr && (
                              <p className="text-sm text-muted-foreground truncate mb-3">{m.addr}</p>
                            )}
                            <Button
                              size="sm"
                              className="w-full h-9 bg-gradient-to-r from-primary/10 to-emerald-500/10 hover:from-primary/20 hover:to-emerald-500/20 border border-primary/30 gap-2 smooth-transition font-medium"
                              onClick={() => setSelected(m)}
                            >
                              <Navigation className="h-4 w-4" />
                              {ui.options}
                            </Button>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-primary/5 to-emerald-500/5">
                    <tr className="border-b border-primary/20">
                      <th className="text-left px-6 py-3 w-[50px] font-bold text-muted-foreground">#</th>
                      <th className="text-left px-6 py-3 cursor-pointer select-none hover:text-primary smooth-transition font-bold" onClick={() => onSort("name")}>
                        <div className="inline-flex items-center gap-2">
                          {ui.nameCol} <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th
                        className="text-left px-6 py-3 cursor-pointer select-none whitespace-nowrap hover:text-primary smooth-transition font-bold"
                        onClick={() => onSort("dist")}
                      >
                        <div className="inline-flex items-center gap-2">
                          {ui.distCol} <ArrowUpDown className="h-4 w-4" />
                        </div>
                      </th>
                      <th className="text-left px-6 py-3 font-bold text-muted-foreground">{ui.actionsCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <div className="inline-flex h-16 w-16 rounded-2xl bg-muted items-center justify-center mb-4">
                            <MapIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">{error ? error : ui.noResults}</p>
                        </td>
                      </tr>
                    ) : (
                      sorted.map((m, i) => (
                        <tr key={m.id} className="border-b border-primary/10 hover:bg-gradient-to-r hover:from-primary/5 hover:to-emerald-500/5 smooth-transition group">
                          <td className="px-6 py-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm group-hover:bg-primary/20 smooth-transition">
                              {i + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-base mb-0.5">{m.name}</div>
                            {m.addr && (
                              <div className="text-xs text-muted-foreground truncate max-w-[52ch]">{m.addr}</div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-emerald-500/10 text-primary font-semibold border border-primary/30">
                              {formatDistance(m.dist)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              size="sm"
                              className="h-9 px-4 bg-gradient-to-r from-primary/10 to-emerald-500/10 hover:from-primary/20 hover:to-emerald-500/20 border border-primary/30 gap-2 smooth-transition font-medium"
                              onClick={() => setSelected(m)}
                            >
                              <Navigation className="h-4 w-4" />
                              {ui.options}
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* App chooser / Share modal — huge z-index so it stays above the map */}
      {selected && (
        <div
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-end md:items-center md:justify-center animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full md:w-[540px] bg-background/95 backdrop-blur-xl rounded-t-3xl md:rounded-3xl p-6 shadow-2xl border border-primary/30 animate-slide-in-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-emerald-500 flex items-center justify-center shadow-lg">
                <MapPin className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg truncate pr-2">{selected.name}</h3>
                  <button
                    className="rounded-xl p-2 hover:bg-destructive/10 hover:text-destructive smooth-transition"
                    onClick={() => setSelected(null)}
                    aria-label={ui.close}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="font-semibold text-primary">{formatDistance(selected.dist)}</span>
                    <span>•</span>
                    <span className="text-xs">{selected.lat.toFixed(4)}, {selected.lon.toFixed(4)}</span>
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <Button
                  className="h-14 flex-col gap-1 bg-gradient-to-br from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 shadow-lg hover:shadow-xl smooth-transition text-white font-medium"
                  onClick={() => openInApp(selected, "google")}
                >
                  <Navigation className="h-5 w-5" />
                  <span className="text-xs">{ui.google}</span>
                </Button>
                <Button
                  className="h-14 flex-col gap-1 bg-gradient-to-br from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70 shadow-lg hover:shadow-xl smooth-transition font-medium"
                  onClick={() => openInApp(selected, "apple")}
                >
                  <Navigation className="h-5 w-5" />
                  <span className="text-xs">{ui.apple}</span>
                </Button>
                <Button
                  className="h-14 flex-col gap-1 bg-gradient-to-br from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 shadow-lg hover:shadow-xl smooth-transition font-medium"
                  onClick={() => openInApp(selected, "waze")}
                >
                  <Navigation className="h-5 w-5" />
                  <span className="text-xs">{ui.waze}</span>
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full h-12 border-primary/30 hover:bg-primary/5 gap-2 smooth-transition font-medium"
                onClick={() => shareMosque(selected)}
              >
                <Share2 className="h-5 w-5" />
                {ui.share}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MosqueLocator;
