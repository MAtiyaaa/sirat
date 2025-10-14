import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Map, Landmark, DoorOpen, Building2, ExternalLink } from "lucide-react";

const JerusalemLandmarksMap = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  // Center: Al-Aqsa / Haram al-Sharif (approx)
  const LAT = 31.7767;
  const LON = 35.2353;

  // Prebuilt OSM embed & full link (no keys, no libs)
  // BBox = [minLon,minLat,maxLon,maxLat]
  const OSM_EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${35.223}%2C${31.768}%2C${35.247}%2C${31.785}&layer=mapnik&marker=${LAT}%2C${LON}`;
  const OSM_LINK = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LON}#map=17/${LAT}/${LON}`;

  const landmarks = [
    {
      icon: Landmark,
      titleAr: "قبة الصخرة",
      titleEn: "Dome of the Rock",
      descAr: "تحفة معمارية بقبّتها الذهبية، تتوسط الحرم.",
      descEn: "Iconic golden-domed masterpiece at the sanctuary’s heart.",
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
    },
    {
      icon: Building2,
      titleAr: "الجامع القبلي",
      titleEn: "Al-Qibli Mosque",
      descAr: "المصلى الرئيس في الجهة الجنوبية للحرم.",
      descEn: "Main prayer hall on the sanctuary’s southern side.",
      gradient: "from-sky-500/20 via-cyan-400/20 to-blue-500/20",
    },
    {
      icon: Building2,
      titleAr: "المصلى المرواني",
      titleEn: "Marwani Prayer Hall",
      descAr: "مصلى واسع أسفل الجهة الشرقية الجنوبية.",
      descEn: "Vast subterranean prayer hall at the south-eastern area.",
      gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20",
    },
    {
      icon: DoorOpen,
      titleAr: "الأبواب والساحات",
      titleEn: "Gates & Courtyards",
      descAr: "أبواب متعددة مؤدية إلى ساحات الحرم الواسعة.",
      descEn: "Multiple gates leading to expansive courtyards.",
      gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header + Back */}
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 neomorph hover:neomorph-pressed"
            aria-label={back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">
            {ar ? "معالم الأقصى والخريطة" : "Al-Aqsa Landmarks & Map"}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {ar
            ? "خريطة تفاعلية مباشرة من OpenStreetMap (بدون إعدادات إضافية)، مع نظرة سريعة على أبرز المعالم."
            : "Interactive OpenStreetMap embed (no setup required), plus a quick look at key landmarks."}
        </p>

        {/* OSM Map (no API key, no deps) */}
        <Card className="neomorph p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Map className="h-5 w-5 text-primary" />
              <span className="font-medium">
                {ar ? "الخريطة التفاعلية" : "Interactive Map"}
              </span>
            </div>
            <Button asChild size="sm" variant="secondary" className="gap-2">
              <a href={OSM_LINK} target="_blank" rel="noreferrer">
                <ExternalLink className="h-4 w-4" />
                {ar ? "فتح الخريطة كاملة" : "Open full map"}
              </a>
            </Button>
          </div>
          <div className="aspect-video bg-muted">
            <iframe
              title={ar ? "خريطة الأقصى" : "Al-Aqsa Map"}
              src={OSM_EMBED}
              style={{ border: 0 }}
              className="w-full h-full"
            />
          </div>
          <div className="p-3 text-center text-xs text-muted-foreground">
            {ar ? "البيانات والخرائط © مساهمو OpenStreetMap" : "Map data © OpenStreetMap contributors"}
          </div>
        </Card>

        {/* Landmark cards */}
        <div className="grid md:grid-cols-2 gap-4">
          {landmarks.map((l, i) => {
            const Icon = l.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${l.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                />
                <Card className="relative neomorph hover:neomorph-inset smooth-transition p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 smooth-transition">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">
                        {ar ? l.titleAr : l.titleEn}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {ar ? l.descAr : l.descEn}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JerusalemLandmarksMap;
