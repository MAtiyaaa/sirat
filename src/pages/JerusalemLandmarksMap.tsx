import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Map, Landmark, DoorOpen, Building2 } from "lucide-react";

const JerusalemLandmarksMap = () => {
  const { settings } = useSettings();
  const ar = settings.language === "ar";

  const landmarks = [
    {
      icon: Landmark,
      titleAr: "قبة الصخرة",
      titleEn: "Dome of the Rock",
      descAr: "تحفة معمارية بقبّتها الذهبية، تتوسط الحرم.",
      descEn: "An iconic golden-domed masterpiece at the sanctuary’s heart.",
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
    },
    {
      icon: Building2,
      titleAr: "الجامع القبلي",
      titleEn: "Al-Qibli Mosque",
      descAr: "المصلى الرئيس في الجهة الجنوبية للحرم.",
      descEn: "The main prayer hall on the sanctuary’s southern side.",
      gradient: "from-sky-500/20 via-cyan-400/20 to-blue-500/20",
    },
    {
      icon: Building2,
      titleAr: "المصلى المرواني",
      titleEn: "Marwani Prayer Hall",
      descAr: "مصلى واسع أسفل الجهة الشرقية الجنوبية.",
      descEn: "A vast subterranean prayer hall at the south-eastern area.",
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
        <header className="space-y-2">
          <h1 className="text-3xl font-bold">
            {ar ? "معالم الأقصى والخريطة" : "Al-Aqsa Landmarks & Map"}
          </h1>
          <p className="text-muted-foreground">
            {ar
              ? "نظرة سريعة على أبرز المعالم داخل الحرم، مع مساحة لإضافة خريطة تفاعلية لاحقًا."
              : "A quick look at key sites within the sanctuary, with room to embed an interactive map later."}
          </p>
        </header>

        <Card className="neomorph p-0 overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b">
            <Map className="h-5 w-5 text-primary" />
            <span className="font-medium">{ar ? "منطقة عرض الخريطة" : "Map Display Area"}</span>
          </div>
          <div className="aspect-video bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">
              {ar ? "أدرج خريطة تفاعلية (Leaflet/Mapbox/Google Maps) هنا لاحقًا" : "Embed an interactive map (Leaflet/Mapbox/Google Maps) here later"}
            </span>
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-4">
          {landmarks.map((l, i) => {
            const Icon = l.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${l.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                <Card className="relative neomorph hover:neomorph-inset smooth-transition p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 smooth-transition">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{ar ? l.titleAr : l.titleEn}</h3>
                      <p className="text-sm text-muted-foreground">{ar ? l.descAr : l.descEn}</p>
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
