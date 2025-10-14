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
} from "lucide-react";

// --- helpers -------------------------------------------------
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

// simple debounce
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

type Mosque = {
  id: string | number;
  name: string;
  lat: number;
  lon: number;
  dist: number; // meters
  addr?: string;
};

// --- component -----------------------------------------------
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

  // sorting for table
  const [sortKey, setSortKey] = useState<"name" | "dist">("dist");
  const [sortAsc, setSortAsc] = useState(true);

  // Leaflet CDN (no install needed)
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
  const mosqueMarkersRef = useRef<any[]>([]);

  const ui = useMemo(
    () => ({
      title: ar ? "خريطة مساجد قريبة" : "Nearby Mosques Map",
      subtitle: ar
        ? "نحدّد موقعك تلقائيًا. زُوم للخارج/الداخل لتحميل المزيد حسب عرض الخريطة."
        : "We’ll ask for your location automatically. Zoom/pan to load more based on the current view.",
      locate: ar ? "إعادة تحديد الموقع" : "Refresh my location",
      locating: ar ? "جاري تحديد موقعك..." : "Locating you...",
      openMaps: ar ? "افتح في الخرائط" : "Open in Maps",
      share: ar ? "مشاركة" : "Share",
      meters: ar ? "م" : "m",
      km: ar ? "كم" : "km",
      noResults: ar ? "لا توجد مساجد ضمن هذه المنطقة." : "No mosques in this view.",
      listTitle: ar ? "قائمة المساجد" : "Mosques List",
      nameCol: ar ? "الاسم" : "Name",
      distCol: ar ? "المسافة" : "Distance",
      actionsCol: ar ? "إجراءات" : "Actions",
      close: ar ? "إغلاق" : "Close",
      options: ar ? "خيارات" : "Options",
    }),
    [ar]
  );

  // --- geolocation: ask automatically on mount
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

  // --- Overpass query using current map bounds (loads more as you zoom out)
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

        // Overpass bbox query
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

        // dedupe & normalize
        const centerRef = loc ?? { lat: (south + north) / 2, lon: (west + east) / 2 };
        const next: Mosque[] =
          (json.elements || [])
            .map((el: any) => {
              const center = el.center || el; // nodes have lat/lon
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

        // sort by distance by default
        next.sort((a: Mosque, b: Mosque) => a.dist - b.dist);

        setMosques(next);
      } catch (e) {
        console.error(e);
        setError(ar ? "تعذّر جلب النتائج." : "Failed to fetch results.");
      } finally {
        setLoading(false);
      }
    },
    [ar, loc]
  );

  // --- Initialize & wire map to bounds-based fetching
  useEffect(() => {
    if (!leafletCssReady || !leafletJsReady || !mapDivRef.current) return;
    // @ts-ignore
    const L = (window as any).L as typeof import("leaflet");
    if (!L) return;

    // create map once
    if (!mapRef.current) {
      mapRef.current = L.map(mapDivRef.current, {
        center: loc ? [loc.lat, loc.lon] : [24.7136, 46.6753], // fallback center: Riyadh
        zoom: loc ? 14 : 5,
        zoomControl: false,
      });
      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    // if we have a location later, recenter and put user marker
    if (loc) {
      mapRef.current.setView([loc.lat, loc.lon], 14);

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
    }

    // debounced fetch on move/zoom end
    const debouncedFetch = debounce(() => {
      const b = mapRef.current.getBounds();
      fetchMosquesForBounds(b);
    }, 400);

    mapRef.current.on("moveend zoomend", debouncedFetch);

    // initial fetch for current view
    debouncedFetch();

    return () => {
      mapRef.current?.off("moveend", debouncedFetch);
      mapRef.current?.off("zoomend", debouncedFetch);
    };
  }, [leafletCssReady, leafletJsReady, loc, ar, fetchMosquesForBounds]);

  // --- draw markers whenever list changes
  useEffect(() => {
    // @ts-ignore
    const L = (window as any).L as typeof import("leaflet");
    if (!L || !mapRef.current) return;

    mosqueMarkersRef.current.forEach((m) => m.remove());
    mosqueMarkersRef.current = [];

    mosques.forEach((m) => {
      const icon = L.divIcon({
        className: "mosque-marker",
        html: `<div class="rounded-xl bg-background text-primary border border-primary/30 px-2 py-1 shadow neomorph">${m.name.replace(
          /"/g,
          "&quot;"
        )}</div>`,
        iconSize: [120, 24],
        iconAnchor: [60, 12],
      });
      const marker = L.marker([m.lat, m.lon], { icon }).addTo(mapRef.current);
      marker.on("click", () => setSelected(m));
      mosqueMarkersRef.current.push(marker);
    });
  }, [mosques]);

  const formatDistance = (m: number) =>
    m >= 1000 ? `${(m / 1000).toFixed(1)} ${ui.km}` : `${Math.round(m)} ${ui.meters}`;

  const openMapsFor = (m: Mosque) => {
    const isApple = /iPhone|iPad|Macintosh/i.test(navigator.userAgent);
    const url = isApple
      ? `http://maps.apple.com/?q=${encodeURIComponent(m.name)}&ll=${m.lat},${m.lon}`
      : `https://www.google.com/maps/search/?api=1&query=${m.lat},${m.lon}`;
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

  // sort table
  const sorted = useMemo(() => {
    const copy = [...mosques];
    copy.sort((a, b) => {
      const valA = sortKey === "name" ? a.name.toLowerCase() : a.dist;
      const valB = sortKey === "name" ? b.name.toLowerCase() : b.dist;
      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
    return copy.slice(0, 50); // cap table rows
  }, [mosques, sortKey, sortAsc]);

  const onSort = (key: "name" | "dist") => {
    if (sortKey === key) {
      setSortAsc((s) => !s);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div className="min-h-screen pb-28">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 neomorph hover:neomorph-pressed"
            aria-label={back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{ui.title}</h1>
            <p className="text-muted-foreground">{ui.subtitle}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={getLocation}
            className="neomorph hover:neomorph-pressed gap-2"
            variant="default"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LocateFixed className="h-4 w-4" />
            )}
            {loading ? (ar ? "جاري التحميل..." : "Loading...") : ui.locate}
          </Button>
        </div>

        {/* Map */}
        <Card className="relative neomorph h-[460px] overflow-hidden">
          <div className="absolute inset-0">
            <div ref={mapDivRef} className="w-full h-full" />
            {!leafletJsReady || !leafletCssReady ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{ar ? "جاري تحميل الخريطة..." : "Loading map..."}</span>
                </div>
              </div>
            ) : null}
          </div>
        </Card>

        {/* Table */}
        <div className="relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-400/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition" />
          <Card className="relative neomorph hover:neomorph-inset smooth-transition p-0">
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <h2 className="font-semibold">{ui.listTitle}</h2>
              <div className="text-xs text-muted-foreground">
                {ar ? "يتم تحديثها مع تحريك/تكبير الخريطة" : "Updates as you move/zoom the map"}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-muted-foreground">
                  <tr className="border-b">
                    <th className="text-left px-4 py-2 w-[42px]">#</th>
                    <th
                      className="text-left px-4 py-2 cursor-pointer select-none"
                      onClick={() => onSort("name")}
                    >
                      <div className="inline-flex items-center gap-1">
                        {ui.nameCol} <ArrowUpDown className="h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th
                      className="text-left px-4 py-2 cursor-pointer select-none whitespace-nowrap"
                      onClick={() => onSort("dist")}
                    >
                      <div className="inline-flex items-center gap-1">
                        {ui.distCol} <ArrowUpDown className="h-3.5 w-3.5" />
                      </div>
                    </th>
                    <th className="text-left px-4 py-2">{ui.actionsCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-muted-foreground">
                        {error ? error : ui.noResults}
                      </td>
                    </tr>
                  ) : (
                    sorted.map((m, i) => (
                      <tr key={m.id} className="border-b hover:bg-muted/40 smooth-transition">
                        <td className="px-4 py-2">{i + 1}</td>
                        <td className="px-4 py-2">
                          <div className="font-medium">{m.name}</div>
                          {m.addr && (
                            <div className="text-xs text-muted-foreground truncate max-w-[42ch]">{m.addr}</div>
                          )}
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {formatDistance(m.dist)}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              className="neomorph hover:neomorph-pressed gap-2"
                              onClick={() => setSelected(m)}
                            >
                              <ExternalLink className="h-4 w-4" />
                              {ui.options}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal / Action Sheet — forced on top of Leaflet with a huge z-index */}
      {selected && (
        <div
          className="fixed inset-0 z-[10000] bg-black/40 flex items-end md:items-center md:justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full md:w-[520px] bg-background rounded-t-2xl md:rounded-2xl p-5 neomorph"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold truncate">{selected.name}</h3>
                  <button
                    className="rounded-full p-1 hover:bg-muted smooth-transition"
                    onClick={() => setSelected(null)}
                    aria-label={ui.close}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDistance(selected.dist)} • {selected.lat.toFixed(5)},{selected.lon.toFixed(5)}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                className="neomorph hover:neomorph-pressed gap-2"
                onClick={() => openMapsFor(selected)}
              >
                <Navigation className="h-4 w-4" />
                {ui.openMaps}
              </Button>
              <Button
                variant="secondary"
                className="neomorph hover:neomorph-pressed gap-2"
                onClick={() => shareMosque(selected)}
              >
                <Share2 className="h-4 w-4" />
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
