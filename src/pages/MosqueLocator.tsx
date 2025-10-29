// src/pages/MosqueLocator.tsx
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
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
  List,
} from "lucide-react";

// --- React Leaflet ---
// ADD THESE DEPENDENCIES:
// npm install react-leaflet leaflet
// npm install @types/leaflet --save-dev
// ---------------------
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet"; // Import L
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

// ---------- lightweight helpers ----------

/**
 * Calculates the Haversine distance between two points on Earth.
 */
function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3; // Earth radius in meters
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/**
 * Creates a debounced version of a function.
 */
function debounce<T extends (...args: any[]) => void>(fn: T, ms: number) {
  let t: number | undefined;
  return (...args: Parameters<T>) => {
    window.clearTimeout(t);
    t = window.setTimeout(() => fn(...args), ms);
  };
}

/**
 * Creates a custom MapPin icon for Leaflet.
 */
function pinIcon(options?: { color?: string; fill?: string }) {
  const color = options?.color ?? "#10b981"; // emerald stroke
  const fill = options?.fill ?? "#10b981"; // emerald fill
  const svg = `
    <svg viewBox="0 0 24 24" width="28" height="28" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="12" cy="22" rx="5.5" ry="2" fill="rgba(0,0,0,0.18)"></ellipse>
      <path d="M12 22c-4.2-4.3-6-7.5-6-10a6 6 0 1 1 12 0c0 2.5-1.8 5.7-6 10Z"
            fill="${fill}" stroke="${color}" stroke-width="1.5" />
      <circle cx="12" cy="11" r="2.5" fill="white" stroke="${color}" stroke-width="1.5"/>
    </svg>
  `.trim();
  return L.divIcon({
    className: "pin-icon", // Kept for hover style
    html: svg,
    iconSize: [28, 28],
    iconAnchor: [14, 26],
    popupAnchor: [0, -26],
  });
}

/**
 * Creates a custom "You" marker icon for Leaflet.
 */
function userIcon(label: string) {
  return L.divIcon({
    className: "user-marker",
    html: `<div class="rounded-full bg-primary/90 text-background text-[10px] px-2 py-1 shadow">${label}</div>`,
    iconSize: [40, 20],
    iconAnchor: [20, 10],
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

type SortKey = "name" | "dist";

// ---------- Main Page Component ----------

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
  const [sortKey, setSortKey] = useState<SortKey>("dist");
  const [sortAsc, setSortAsc] = useState(true);

  // Map state
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const mapRef = useRef<L.Map>(null);

  const ui = useMemo(
    () => ({
      title: ar ? "خريطة مساجد قريبة" : "Nearby Mosques Map",
      subtitle: ar ? "نحدّد موقعك. حرّك الخريطة لتحميل المزيد." : "We'll find your location. Pan the map to load more.",
      locate: ar ? "إعادة تحديد الموقع" : "Refresh my location",
      locating: ar ? "جاري تحديد موقعك..." : "Locating you...",
      openMaps: ar ? "افتح في الخرائط" : "Open in Maps",
      share: ar ? "مشاركة" : "Share",
      meters: ar ? "م" : "m",
      km: ar ? "كم" : "km",
      noResults: ar ? "لا توجد مساجد ضمن هذه المنطقة." : "No mosques in this view.",
      listTitle: ar ? "المساجد القريبة" : "Nearby Mosques",
      nameCol: ar ? "الاسم" : "Name",
      distCol: ar ? "المسافة" : "Distance",
      actionsCol: ar ? "إجراءات" : "Actions",
      close: ar ? "إغلاق" : "Close",
      options: ar ? "خيارات" : "Options",
      chooseApp: ar ? "اختر تطبيق الخرائط" : "Choose a maps app",
      google: "Google Maps",
      apple: "Apple Maps",
      waze: "Waze",
      viewList: ar ? "عرض القائمة" : "View List",
    }),
    [ar],
  );

  // --- Data Fetching ---

  const getLocation = useCallback(() => {
    setError(null);
    if (!("geolocation" in navigator)) {
      setError(ar ? "المتصفح لا يدعم تحديد الموقع." : "Geolocation not supported.");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLoc = { lat: latitude, lon: longitude };
        setLoc(newLoc);
        setLoading(false);
        // Pan map to new location
        mapRef.current?.setView(newLoc, 14);
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
  }, [ar]);

  // Overpass query for current map bounds
  const fetchMosquesForBounds = useCallback(
    async (bounds: L.LatLngBounds) => {
      try {
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
        const centerRef = loc ?? {
          lat: (south + north) / 2,
          lon: (west + east) / 2,
        };

        // Use a Map to deduplicate results by ID
        const mosqueMap = new Map<string | number, Mosque>();

        (json.elements || []).forEach((el: any) => {
          const center = el.center || el;
          if (!center?.lat || !center?.lon) return;

          const name =
            el.tags?.name ?? el.tags?.["name:en"] ?? el.tags?.["name:ar"] ?? (ar ? "مسجد بدون اسم" : "Unnamed Mosque");
          const addr =
            el.tags?.["addr:full"] ?? `${el.tags?.["addr:street"] ?? ""} ${el.tags?.["addr:city"] ?? ""}`.trim();
          const d = haversine(centerRef.lat, centerRef.lon, center.lat, center.lon);

          // Add to map, potentially overwriting if a better (e.g., way vs node) result comes
          mosqueMap.set(el.id, {
            id: el.id,
            name,
            lat: center.lat,
            lon: center.lon,
            dist: d,
            addr: addr || undefined,
          });
        });

        const list = Array.from(mosqueMap.values());
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

  // Debounced fetcher
  const debouncedFetch = useMemo(
    () => debounce((bounds) => fetchMosquesForBounds(bounds), 500),
    [fetchMosquesForBounds],
  );

  // Get initial location on mount
  useEffect(() => {
    getLocation();
  }, [getLocation]);

  // Fetch when map bounds change
  useEffect(() => {
    if (mapBounds) {
      debouncedFetch(mapBounds);
    }
  }, [mapBounds, debouncedFetch]);

  // --- Sorting & Formatting ---

  const onSort = (key: SortKey) => {
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
    return copy.slice(0, 100); // Limit to 100 results
  }, [mosques, sortKey, sortAsc]);

  const formatDistance = (m: number) =>
    m >= 1000 ? `${(m / 1000).toFixed(1)} ${ui.km}` : `${Math.round(m)} ${ui.meters}`;

  // --- Event Handlers ---

  const handleMosqueSelect = (m: Mosque) => {
    setSelected(m);
    mapRef.current?.flyTo([m.lat, m.lon], 16);
  };

  /**
   * Component to listen to map events
   */
  const MapEvents = () => {
    const map = useMapEvents({
      moveend() {
        setMapBounds(map.getBounds());
      },
      load() {
        setMapBounds(map.getBounds()); // Initial load
        (map as any)._container.focus(); // Fix for keyboard focus
      },
    });
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen" dir={ar ? "rtl" : "ltr"}>
      {/* Keep pin hover polish */}
      <style>{`
        .leaflet-pane, .leaflet-top, .leaflet-bottom { z-index: 1 !important; }
        .pin-icon { transition: transform 120ms ease, filter 120ms ease; will-change: transform; }
        .pin-icon:hover { transform: translateY(-2px) scale(1.04); filter: drop-shadow(0 2px 4px rgba(0,0,0,0.25)); z-index: 10000 !important; }
        .leaflet-container { outline: none; }
      `}</style>

      {/* Header (As requested) */}
      <div className="flex-shrink-0 max-w-6xl mx-auto p-6 space-y-6 w-full">
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
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={getLocation} className="neomorph hover:neomorph-pressed gap-2" variant="default">
            {loading && !loc ? <Loader2 className="h-4 w-4 animate-spin" /> : <LocateFixed className="h-4 w-4" />}
            {loading && !loc ? ui.locating : ui.locate}
          </Button>
        </div>
      </div>

      {/* --- Main Content (List + Map) --- */}
      <div className="flex-1 overflow-hidden">
        {/*
          DESKTOP LAYOUT: Side-by-Side
          sm:grid shows this on screens > 640px
        */}
        <div className="hidden sm:grid sm:grid-cols-3 h-full">
          {/* Desktop List Sidebar */}
          <div className="col-span-1 h-full overflow-y-auto">
            <MosqueList
              mode="table"
              mosques={sorted}
              loading={loading}
              error={error}
              onSelectMosque={handleMosqueSelect}
              formatDistance={formatDistance}
              sortProps={{ sortKey, sortAsc, onSort }}
              ui={ui}
            />
          </div>
          {/* Desktop Map */}
          <div className="col-span-2 h-full">
            <MapWrapper
              mapRef={mapRef}
              loc={loc}
              mosques={mosques}
              onMosqueClick={setSelected}
              MapEvents={MapEvents}
              userLabel={ar ? "أنت" : "You"}
            />
          </div>
        </div>

        {/*
          MOBILE LAYOUT: Map + Bottom Sheet
          sm:hidden hides this on screens > 640px
        */}
        <div className="sm:hidden h-full w-full relative">
          {/* Mobile Map */}
          <MapWrapper
            mapRef={mapRef}
            loc={loc}
            mosques={mosques}
            onMosqueClick={setSelected}
            MapEvents={MapEvents}
            userLabel={ar ? "أنت" : "You"}
          />

          {/* Mobile Sheet Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] neomorph hover:neomorph-pressed shadow-lg gap-2"
                aria-label={ui.viewList}
              >
                <List className="h-4 w-4" />
                {ui.viewList}
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[75vh] flex flex-col">
              <SheetHeader>
                <SheetTitle>{ui.listTitle}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto">
                <MosqueList
                  mode="card"
                  mosques={sorted}
                  loading={loading}
                  error={error}
                  onSelectMosque={handleMosqueSelect}
                  formatDistance={formatDistance}
                  ui={ui}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* --- Selected Mosque Modal --- */}
      <SelectedMosqueModal
        mosque={selected}
        onClose={() => setSelected(null)}
        formatDistance={formatDistance}
        ui={ui}
        ar={ar}
      />
    </div>
  );
};

// ---------- Sub-Components ----------

/**
 * Renders the Leaflet map and markers.
 */
const MapWrapper = ({
  mapRef,
  loc,
  mosques,
  onMosqueClick,
  MapEvents,
  userLabel,
}: {
  mapRef: React.RefObject<L.Map>;
  loc: { lat: number; lon: number } | null;
  mosques: Mosque[];
  onMosqueClick: (m: Mosque) => void;
  MapEvents: React.FC;
  userLabel: string;
}) => (
  <MapContainer
    // @ts-ignore
    ref={mapRef}
    center={loc ? [loc.lat, loc.lon] : [24.7136, 46.6753]} // Fallback: Riyadh
    zoom={loc ? 14 : 5}
    scrollWheelZoom={true}
    className="w-full h-full z-0"
    zoomControl={false} // We add it manually
  >
    <L.Control.Zoom position="bottomright" />
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      maxZoom={19}
    />
    <MapEvents />

    {/* User's Location Marker */}
    {loc && (
      <Marker
        position={[loc.lat, loc.lon]}
        icon={userIcon(userLabel)}
        zIndexOffset={1000} // Keep on top
      />
    )}

    {/* Mosque Markers */}
    {mosques.map((m) => (
      <Marker
        key={m.id}
        position={[m.lat, m.lon]}
        icon={pinIcon()}
        eventHandlers={{
          click: () => onMosqueClick(m),
        }}
        riseOnHover={true}
      />
    ))}
  </MapContainer>
);

/**
 * Renders the list of mosques, either as cards (mobile) or a table (desktop).
 */
const MosqueList = ({
  mode,
  mosques,
  loading,
  error,
  onSelectMosque,
  formatDistance,
  sortProps,
  ui,
}: {
  mode: "card" | "table";
  mosques: Mosque[];
  loading: boolean;
  error: string | null;
  onSelectMosque: (m: Mosque) => void;
  formatDistance: (m: number) => string;
  sortProps?: {
    sortKey: SortKey;
    sortAsc: boolean;
    onSort: (k: SortKey) => void;
  };
  ui: Record<string, string>;
}) => {
  if (mode === "card") {
    return (
      <div className="p-4 grid gap-3">
        {mosques.length === 0 ? (
          <p className="text-muted-foreground p-4 text-center">{error ? error : ui.noResults}</p>
        ) : (
          mosques.map((m) => (
            <Card
              key={m.id}
              className="neomorph hover:neomorph-inset smooth-transition p-4 cursor-pointer"
              onClick={() => onSelectMosque(m)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-semibold truncate">{m.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary whitespace-nowrap">
                      {formatDistance(m.dist)}
                    </span>
                  </div>
                  {m.addr && <p className="text-sm text-muted-foreground truncate">{m.addr}</p>}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    );
  }

  // mode === 'table'
  return (
    <Card className="neomorph m-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">{ui.listTitle}</CardTitle>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-muted-foreground">
              <tr className="border-b">
                <th
                  className="text-left px-4 py-2 cursor-pointer select-none"
                  onClick={() => sortProps?.onSort("name")}
                >
                  <div className="inline-flex items-center gap-1">
                    {ui.nameCol} <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th
                  className="text-left px-4 py-2 cursor-pointer select-none whitespace-nowrap"
                  onClick={() => sortProps?.onSort("dist")}
                >
                  <div className="inline-flex items-center gap-1">
                    {ui.distCol} <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                </th>
                <th className="text-left px-4 py-2">{ui.actionsCol}</th>
              </tr>
            </thead>
            <tbody>
              {mosques.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-muted-foreground">
                    {error ? error : ui.noResults}
                  </td>
                </tr>
              ) : (
                mosques.map((m) => (
                  <tr key={m.id} className="border-b hover:bg-muted/40 smooth-transition">
                    <td className="px-4 py-3">
                      <div className="font-medium">{m.name}</div>
                      {m.addr && <div className="text-xs text-muted-foreground truncate max-w-[40ch]">{m.addr}</div>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                        {formatDistance(m.dist)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        size="sm"
                        className="neomorph hover:neomorph-pressed gap-2"
                        onClick={() => onSelectMosque(m)}
                      >
                        <MapPin className="h-4 w-4" />
                        {ar ? "عرض" : "View"}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Renders the modal for a selected mosque.
 */
const SelectedMosqueModal = ({
  mosque,
  onClose,
  formatDistance,
  ui,
  ar,
}: {
  mosque: Mosque | null;
  onClose: () => void;
  formatDistance: (m: number) => string;
  ui: Record<string, string>;
  ar: boolean;
}) => {
  if (!mosque) return null;

  const openInApp = (app: "google" | "apple" | "waze") => {
    let url = "";
    const label = encodeURIComponent(mosque.name);
    if (app === "google") {
      url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.lat},${mosque.lon}&travelmode=driving`;
    } else if (app === "apple") {
      url = `http://maps.apple.com/?daddr=${mosque.lat},${mosque.lon}&q=${label}`;
    } else {
      url = `https://waze.com/ul?ll=${mosque.lat},${mosque.lon}&navigate=yes`;
    }
    window.open(url, "_blank");
  };

  const shareMosque = async () => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mosque.lat},${mosque.lon}`;
    if ((navigator as any).share) {
      try {
        await (navigator as any).share({
          title: mosque.name,
          text: `${mosque.name} — ${formatDistance(mosque.dist)}`,
          url: mapsUrl,
        });
        return;
      } catch {}
    }
    try {
      await navigator.clipboard.writeText(`${mosque.name}\n${mapsUrl}`);
      alert(ar ? "تم نسخ الرابط." : "Link copied to clipboard.");
    } catch {
      window.open(mapsUrl, "_blank");
    }
  };

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/40 flex items-end sm:items-center sm:justify-center"
      onClick={onClose}
    >
      <div
        className="w-full sm:w-[520px] bg-background rounded-t-2xl sm:rounded-2xl p-5 neomorph"
        onClick={(e) => e.stopPropagation()}
        dir={ar ? "rtl" : "ltr"}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold truncate">{mosque.name}</h3>
              <button
                className="rounded-full p-1 hover:bg-muted smooth-transition"
                onClick={onClose}
                aria-label={ui.close}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground">
              {formatDistance(mosque.dist)} • {mosque.lat.toFixed(5)},{mosque.lon.toFixed(5)}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          <Button className="neomorph hover:neomorph-pressed gap-2" onClick={() => openInApp("google")}>
            <Navigation className="h-4 w-4" />
            {ui.google}
          </Button>
          <Button
            variant="secondary"
            className="neomorph hover:neomorph-pressed gap-2"
            onClick={() => openInApp("apple")}
          >
            <Navigation className="h-4 w-4" />
            {ui.apple}
          </Button>
          <Button
            variant="secondary"
            className="neomorph hover:neomorph-pressed gap-2"
            onClick={() => openInApp("waze")}
          >
            <Navigation className="h-4 w-4" />
            {ui.waze}
          </Button>
        </div>
        <div className="mt-3">
          <Button variant="ghost" className="w-full neomorph hover:neomorph-pressed gap-2" onClick={shareMosque}>
            <Share2 className="h-4 w-4" />
            {ui.share}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MosqueLocator;
