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
  Sparkles,
} from "lucide-react";

// ---------- lightweight helpers ----------
function useCdnResource(hrefOrSrc: string, type: "css" | "js") {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const existing =
      type === "js"
        ? Array.from(document.scripts).find((s) => s.src === hrefOrSrc)
        : Array.from(document.querySelectorAll('link[rel="stylesheet"]')).find(
            (l) => (l as HTMLLinkElement).href === hrefOrSrc,
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
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

// Enhanced MapPin icon with glow effect
function pinIcon(options?: { color?: string; fill?: string }) {
  const color = options?.color ?? "#10b981";
  const fill = options?.fill ?? "#10b981";

  const svg = `
    <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <ellipse cx="12" cy="22" rx="5.5" ry="2" fill="rgba(0,0,0,0.2)"></ellipse>
      <path d="M12 22c-4.2-4.3-6-7.5-6-10a6 6 0 1 1 12 0c0 2.5-1.8 5.7-6 10Z"
            fill="${fill}" stroke="${color}" stroke-width="2" filter="url(#glow)" />
      <circle cx="12" cy="11" r="2.5" fill="white" stroke="${color}" stroke-width="1.5"/>
    </svg>
  `.trim();

  // @ts-ignore
  return (window as any).L.divIcon({
    className: "pin-icon",
    html: svg,
    iconSize: [32, 32],
    iconAnchor: [16, 30],
    popupAnchor: [0, -30],
  });
}

type Mosque = {
  id: string | number;
  name: string;
  lat: number;
  lon: number;
  dist: number;
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

  const [sortKey, setSortKey] = useState<"name" | "dist">("dist");
  const [sortAsc, setSortAsc] = useState(true);

  const leafletCssReady = useCdnResource("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "css");
  const leafletJsReady = useCdnResource("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", "js");

  const mapRef = useRef<any>(null);
  const mapDivRef = useRef<HTMLDivElement | null>(null);
  const userMarkerRef = useRef<any>(null);
  const mosqueLayersRef = useRef<any>(null);

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
        ? "نحدّد موقعك تلقائيًا. كَبّر/صغِّر أو حرّك الخريطة لتحميل المزيد حسب عرض الخريطة."
        : "We'll ask for your location automatically. Zoom or pan to load more based on the current view.",
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
      updates: ar ? "تتحدّث القائمة مع تحريك/تكبير الخريطة" : "Live updates as you explore",
    }),
    [ar],
  );

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
            : "Location permission denied or unavailable. Please enable sharing.",
        );
        console.error(err);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  };

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
                el.tags?.["addr:full"] ?? `${el.tags?.["addr:street"] ?? ""} ${el.tags?.["addr:city"] ?? ""}`.trim();
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
    [ar, loc],
  );

  useEffect(() => {
    if (!leafletCssReady || !leafletJsReady || !mapDivRef.current) return;
    // @ts-ignore
    const L = (window as any).L as typeof import("leaflet");
    if (!L) return;

    if (!mapRef.current) {
      mapRef.current = L.map(mapDivRef.current, {
        center: loc ? [loc.lat, loc.lon] : [24.7136, 46.6753],
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
        html: `<div class="user-location-badge">${ar ? "أنت" : "You"}</div>`,
        iconSize: [50, 28],
        iconAnchor: [25, 14],
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
    debouncedFetch();

    return () => {
      mapRef.current?.off("moveend", debouncedFetch);
      mapRef.current?.off("zoomend", debouncedFetch);
    };
  }, [leafletCssReady, leafletJsReady, loc, ar, fetchMosquesForBounds]);

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
    <div className="min-h-screen pb-28 bg-gradient-to-br from-background via-background to-emerald-50/30 dark:to-emerald-950/10">
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); }
        }
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        
        .leaflet-pane, .leaflet-top, .leaflet-bottom { z-index: 1 !important; }
        
        .pin-icon { 
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform;
        }
        .pin-icon:hover { 
          transform: translateY(-4px) scale(1.1);
          filter: drop-shadow(0 4px 12px rgba(16, 185, 129, 0.4));
        }
        
        .user-location-badge {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-size: 11px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
          animation: pulse-glow 2s ease-in-out infinite;
          white-space: nowrap;
        }
        
        .mosque-card-wrapper {
          animation: fadeInUp 0.3s ease-out forwards;
          opacity: 0;
        }
        .mosque-card-wrapper:nth-child(1) { animation-delay: 0.05s; }
        .mosque-card-wrapper:nth-child(2) { animation-delay: 0.1s; }
        .mosque-card-wrapper:nth-child(3) { animation-delay: 0.15s; }
        .mosque-card-wrapper:nth-child(4) { animation-delay: 0.2s; }
        .mosque-card-wrapper:nth-child(5) { animation-delay: 0.25s; }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .shimmer-effect {
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          background-size: 1000px 100%;
          animation: shimmer 2s infinite;
        }
        
        .gradient-border {
          position: relative;
          border-radius: 1rem;
          padding: 2px;
          background: linear-gradient(135deg, #10b981, #06b6d4, #8b5cf6);
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }
        
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .map-container {
          position: relative;
          overflow: hidden;
          border-radius: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }
        
        .map-container::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, #10b981, #06b6d4);
          border-radius: 1.5rem;
          z-index: -1;
          opacity: 0.5;
          filter: blur(10px);
        }
        
        .stats-badge {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(16, 185, 129, 0.2);
        }
        
        .dark .stats-badge {
          background: rgba(0, 0, 0, 0.6);
        }
      `}</style>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 neomorph hover:neomorph-pressed transition-all duration-200"
            aria-label={back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {ui.title}
              </h1>
              <Sparkles className="h-5 w-5 text-emerald-500 animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">{ui.subtitle}</p>
          </div>
        </div>

        {/* Controls with enhanced styling */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={getLocation}
            className="neomorph hover:neomorph-pressed gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow-lg transition-all duration-300"
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            {loading ? (ar ? "جاري التحميل..." : "Loading...") : ui.locate}
          </Button>

          {mosques.length > 0 && (
            <div className="stats-badge px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span>
                {mosques.length} {ar ? "مسجد" : "mosques"}
              </span>
            </div>
          )}
        </div>

        {/* Map with enhanced container */}
        <div className="map-container relative h-[400px] sm:h-[500px] lg:h-[600px]">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none z-10 rounded-3xl" />
          <div ref={mapDivRef} className="w-full h-full rounded-3xl" />
          {(!leafletJsReady || !leafletCssReady) && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-3xl">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <span className="text-sm font-medium">{ar ? "جاري تحميل الخريطة..." : "Loading map..."}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results with stunning design */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 rounded-2xl opacity-20 blur-xl" />
          <Card className="relative neomorph overflow-hidden backdrop-blur-sm bg-background/95">
            {/* Header */}
            <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                    <MapIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">{ui.listTitle}</h2>
                    <p className="text-xs text-muted-foreground">{ui.updates}</p>
                  </div>
                </div>
                {loading && <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />}
              </div>
            </div>

            {/* Content */}
            {isMobile ? (
              <div className="p-4 space-y-3">
                {mosques.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                    <p className="text-muted-foreground">{error || ui.noResults}</p>
                  </div>
                ) : (
                  sorted.map((m, idx) => (
                    <div key={m.id} className="mosque-card-wrapper" style={{ animationDelay: `${idx * 0.05}s` }}>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition duration-300" />
                        <Card className="relative neomorph hover:neomorph-inset p-4 transition-all duration-300">
                          <div className="flex gap-3">
                            <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                              <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h3 className="font-semibold text-base leading-tight">{m.name}</h3>
                                <span className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium shadow">
                                  {formatDistance(m.dist)}
                                </span>
                              </div>
                              {m.addr && <p className="text-sm text-muted-foreground line-clamp-1 mb-3">{m.addr}</p>}
                              <Button
                                size="sm"
                                className="w-full neomorph hover:neomorph-pressed gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow transition-all duration-200"
                                onClick={() => setSelected(m)}
                              >
                                <Navigation className="h-4 w-4" />
                                {ui.options}
                              </Button>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold w-16">#</th>
                      <th
                        className="text-left px-6 py-4 text-sm font-semibold cursor-pointer select-none hover:bg-muted/70 transition-colors"
                        onClick={() => onSort("name")}
                      >
                        <div className="inline-flex items-center gap-2">
                          {ui.nameCol}
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        </div>
                      </th>
                      <th
                        className="text-left px-6 py-4 text-sm font-semibold cursor-pointer select-none hover:bg-muted/70 transition-colors whitespace-nowrap"
                        onClick={() => onSort("dist")}
                      >
                        <div className="inline-flex items-center gap-2">
                          {ui.distCol}
                          <ArrowUpDown className="h-4 w-4 opacity-50" />
                        </div>
                      </th>
                      <th className="text-left px-6 py-4 text-sm font-semibold">{ui.actionsCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <MapPin className="h-12 w-12 mx-auto text-muted-foreground/40 mb-3" />
                          <p className="text-muted-foreground">{error || ui.noResults}</p>
                        </td>
                      </tr>
                    ) : (
                      sorted.map((m, i) => (
                        <tr
                          key={m.id}
                          className="border-b hover:bg-gradient-to-r hover:from-emerald-50/50 hover:to-teal-50/50 dark:hover:from-emerald-950/20 dark:hover:to-teal-950/20 transition-all duration-200 group"
                        >
                          <td className="px-6 py-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-sm font-semibold text-emerald-700 dark:text-emerald-400">
                              {i + 1}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                                <MapPin className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="font-semibold text-base mb-0.5">{m.name}</div>
                                {m.addr && (
                                  <div className="text-xs text-muted-foreground line-clamp-1 max-w-md">{m.addr}</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium shadow">
                              <MapPin className="h-3.5 w-3.5" />
                              {formatDistance(m.dist)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Button
                              size="sm"
                              className="neomorph hover:neomorph-pressed gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0 shadow transition-all duration-200"
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

      {/* Enhanced Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm flex items-end sm:items-center sm:justify-center animate-in fade-in duration-200"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full sm:max-w-lg bg-background rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Gradient border effect */}
            <div className="relative p-6 sm:p-8">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-t-3xl" />

              {/* Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                  <MapPin className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-xl leading-tight">{selected.name}</h3>
                    <button
                      className="shrink-0 rounded-full p-2 hover:bg-muted transition-colors"
                      onClick={() => setSelected(null)}
                      aria-label={ui.close}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium shadow">
                      <MapPin className="h-3.5 w-3.5" />
                      {formatDistance(selected.dist)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selected.lat.toFixed(5)}, {selected.lon.toFixed(5)}
                    </span>
                  </div>
                  {selected.addr && <p className="text-sm text-muted-foreground mt-2">{selected.addr}</p>}
                </div>
              </div>

              {/* Navigation Apps */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {ui.chooseApp}
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => openInApp(selected, "google")}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Navigation className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-xs font-semibold text-white text-center">Google</div>
                  </button>
                  <button
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => openInApp(selected, "apple")}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Navigation className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-xs font-semibold text-white text-center">Apple</div>
                  </button>
                  <button
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                    onClick={() => openInApp(selected, "waze")}
                  >
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Navigation className="h-6 w-6 text-white mx-auto mb-2" />
                    <div className="text-xs font-semibold text-white text-center">Waze</div>
                  </button>
                </div>

                {/* Share Button */}
                <Button
                  variant="outline"
                  className="w-full neomorph hover:neomorph-pressed gap-2 h-12 text-base transition-all duration-200"
                  onClick={() => shareMosque(selected)}
                >
                  <Share2 className="h-5 w-5" />
                  {ui.share}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MosqueLocator;
