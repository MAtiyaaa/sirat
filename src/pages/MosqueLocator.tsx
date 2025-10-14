// src/pages/MosqueLocator.tsx
import { useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";

// Light utility: load a remote script or CSS once
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

// Distance (meters) via haversine
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

type Mosque = {
  id: string | number;
  name: string;
  lat: number;
  lon: number;
  dist: number; // meters
  addr?: string;
};

const MosqueLocator = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const [loc, setLoc] = useState<{ lat: number; lon: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState(3000); // meters
  const [selected, setSelected] = useState<Mosque | null>(null);

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
        ? "حدد موقعك لعرض أقرب المساجد على الخريطة وقائمة مرتبة بالمسافة."
        : "Share your location to view nearby mosques on the map and a distance-sorted list.",
      locate: ar ? "مشاركة الموقع" : "Share location",
      locating: ar ? "جاري تحديد موقعك..." : "Locating you...",
      refresh: ar ? "تحديث النتائج" : "Refresh Results",
      openMaps: ar ? "افتح في الخرائط" : "Open in Maps",
      share: ar ? "مشاركة" : "Share",
      meters: ar ? "م" : "m",
      km: ar ? "كم" : "km",
      noResults: ar ? "لا توجد مساجد قريبة ضمن النطاق." : "No mosques found within range.",
      changeRadius: ar ? "نطاق البحث" : "Search radius",
      cancel: ar ? "إلغاء" : "Cancel",
    }),
    [ar]
  );

  // Get geolocation
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
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Query Overpass API for nearby mosques
  const fetchMosques = async () => {
    if (!loc) return;
    try {
      setLoading(true);
      setError(null);
      const q = `[out:json][timeout:25];
      (
        node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${loc.lat},${loc.lon});
        way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${loc.lat},${loc.lon});
        relation["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${loc.lat},${loc.lon});
      );
      out center 60;`;
      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=UTF-8" },
        body: q,
      });
      const json = await res.json();
      const list: Mosque[] =
        (json.elements || [])
          .map((el: any) => {
            const center = el.center || el; // nodes have lat/lon; ways/relations give center
            if (!center?.lat || !center?.lon) return null;
            const name =
              el.tags?.name ??
              el.tags?.["name:en"] ??
              el.tags?.["name:ar"] ??
              (ar ? "مسجد بدون اسم" : "Unnamed Mosque");
            const addr =
              el.tags?.["addr:full"] ??
              `${el.tags?.["addr:street"] ?? ""} ${el.tags?.["addr:city"] ?? ""}`.trim();
            const d = haversine(loc.lat, loc.lon, center.lat, center.lon);
            return {
              id: el.id,
              name,
              lat: center.lat,
              lon: center.lon,
              dist: d,
              addr: addr || undefined,
            } as Mosque;
          })
          .filter(Boolean)
          .sort((a: Mosque, b: Mosque) => a.dist - b.dist)
          .slice(0, 30) || [];
      setMosques(list);
    } catch (e) {
      console.error(e);
      setError(ar ? "تعذّر جلب النتائج." : "Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  // Initialize Leaflet map after libs + location ready
  useEffect(() => {
    if (!leafletCssReady || !leafletJsReady || !loc || !mapDivRef.current) return;
    // @ts-ignore - Leaflet global from CDN
    const L = (window as any).L as typeof import("leaflet");
    if (!L) return;

    // Create or update map
    if (!mapRef.current) {
      mapRef.current = L.map(mapDivRef.current, {
        center: [loc.lat, loc.lon],
        zoom: 14,
        zoomControl: false,
      });
      L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView([loc.lat, loc.lon], 14);
    }

    // Add/update user marker
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

    // Clear old mosque markers
    mosqueMarkersRef.current.forEach((m) => m.remove());
    mosqueMarkersRef.current = [];

    // Add mosque markers
    mosques.forEach((m) => {
      const icon = L.divIcon({
        className: "mosque-marker",
        html: `<div class="rounded-xl bg-background text-primary border border-primary/30 px-2 py-1 shadow neomorph">${m.name.replace(/"/g, "&quot;")}</div>`,
        iconSize: [100, 24],
        iconAnchor: [50, 12],
      });
      const marker = L.marker([m.lat, m.lon], { icon }).addTo(mapRef.current);
      marker.on("click", () => setSelected(m));
      mosqueMarkersRef.current.push(marker);
    });

    // Fit bounds if we have results
    if (mosques.length) {
      const group = L.featureGroup(
        [userMarkerRef.current, ...mosqueMarkersRef.current].filter(Boolean)
      );
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    }
  }, [leafletCssReady, leafletJsReady, loc, mosques, ar]);

  // Trigger a fresh search when location or radius changes
  useEffect(() => {
    if (loc) fetchMosques();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc, radius]);

  // Helpers
  const formatDistance = (m: number) =>
    m >= 1000 ? `${(m / 1000).toFixed(1)} ${ui.km}` : `${Math.round(m)} ${ui.meters}`;

  const openMapsFor = (m: Mosque) => {
    const isApple = /iPhone|iPad|Macintosh/i.test(navigator.userAgent);
    const url = isApple
      ? `http://maps.apple.com/?q=${encodeURIComponent(m.name)}&ll=${m.lat},${m.lon}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(m.name)}&query_place_id=&query=${m.lat},${m.lon}`;
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
    <div className="min-h-screen pb-24">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
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
            <h1 className="text-3xl font-bold">
              {ar ? "خريطة مساجد قريبة" : "Nearby Mosques Map"}
            </h1>
            <p className="text-muted-foreground">
              {ar
                ? "شارك موقعك لعرض أقرب المساجد بالقائمة والخريطة."
                : "Share your location to see the closest mosques on a map and list."}
            </p>
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
            {loading ? ui.locating : ui.locate}
          </Button>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{ui.changeRadius}:</span>
            <div className="inline-flex rounded-xl overflow-hidden border">
              {[1000, 2000, 3000, 5000].map((r) => (
                <button
                  key={r}
                  onClick={() => setRadius(r)}
                  className={`px-3 py-1 smooth-transition ${
                    radius === r ? "bg-primary text-primary-foreground" : "bg-background hover:bg-muted"
                  }`}
                >
                  {r / 1000} {ui.km}
                </button>
              ))}
            </div>
          </div>

          {loc && (
            <Button
              onClick={fetchMosques}
              variant="secondary"
              className="neomorph hover:neomorph-pressed gap-2"
            >
              <Navigation className="h-4 w-4" />
              {ui.refresh}
            </Button>
          )}
        </div>

        {/* Map + List */}
        <div className="grid md:grid-cols-5 gap-4">
          <Card className="relative neomorph md:col-span-3 h-[420px] overflow-hidden">
            <div className="absolute inset-0">
              {/* Map container (Leaflet injected via CDN) */}
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

          <div className="md:col-span-2 space-y-3">
            {error && (
              <Card className="neomorph p-4">
                <p className="text-destructive">{error}</p>
              </Card>
            )}
            {!loc && !error && (
              <Card className="neomorph p-4">
                <p className="text-muted-foreground">
                  {ui.subtitle}
                </p>
              </Card>
            )}
            {loc && mosques.length === 0 && !loading && (
              <Card className="neomorph p-4">
                <p className="text-muted-foreground">{ui.noResults}</p>
              </Card>
            )}
            {mosques.slice(0, 12).map((m) => (
              <div key={m.id} className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-400/10 to-cyan-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition" />
                <Card className="relative neomorph hover:neomorph-inset smooth-transition p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold truncate">{m.name}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {formatDistance(m.dist)}
                        </span>
                      </div>
                      {m.addr && (
                        <p className="text-sm text-muted-foreground truncate">{m.addr}</p>
                      )}
                      <div className="mt-3 flex items-center gap-2">
                        <Button
                          size="sm"
                          className="neomorph hover:neomorph-pressed gap-2"
                          onClick={() => setSelected(m)}
                        >
                          <ExternalLink className="h-4 w-4" />
                          {ar ? "خيارات" : "Options"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Sheet / Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center md:justify-center"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full md:w-[480px] bg-background rounded-t-2xl md:rounded-2xl p-5 neomorph"
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
                    aria-label="Close"
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
