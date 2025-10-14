import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Compass, MapPin, Clock } from "lucide-react";

const JerusalemQiblaChange = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const blocks = [
    { icon: Compass, titleAr: "القبلة الأولى", titleEn: "The First Qibla",
      descAr: "توجّه المسلمون في أوائل العهد المدني إلى بيت المقدس، وبقي ذلك مدة من الزمن.",
      descEn: "In early Madinan period, Muslims faced Bayt al-Maqdis in prayer for a period of time.",
      gradient: "from-sky-500/20 via-cyan-400/20 to-blue-500/20" },
    { icon: MapPin, titleAr: "التحويل إلى مكة", titleEn: "Change Toward Makkah",
      descAr: "نزل الأمر بتحويل القبلة إلى المسجد الحرام، فكان التوجّه الدائم لمكة.",
      descEn: "Revelation ordained the Qibla to the Sacred Mosque in Makkah; it has remained so ever since.",
      gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20" },
    { icon: Clock, titleAr: "دلالات التحويل", titleEn: "Significance",
      descAr: "طاعة الأمر الرباني، ووحدة الاتجاه والقبلة، وربط الأمة بمركز التوحيد.",
      descEn: "Obedience to divine command, unity of direction, and deepened bond to the center of tawhid.",
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20" },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 neomorph hover:neomorph-pressed" aria-label={back}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{ar ? "تحويل القبلة" : "Change of Qibla"}</h1>
        </div>
        <p className="text-muted-foreground">
          {ar ? "ملخص موجز عن القبلة الأولى ثم التحويل إلى المسجد الحرام ودلالاته."
              : "A brief on the first Qibla and the transformation to Makkah—meanings and lessons."}
        </p>

        <div className="grid gap-4">
          {blocks.map((b, i) => {
            const Icon = b.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${b.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`} />
                <Card className="relative neomorph hover:neomorph-inset smooth-transition p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 smooth-transition">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{ar ? b.titleAr : b.titleEn}</h3>
                      <p className="text-sm text-muted-foreground">{ar ? b.descAr : b.descEn}</p>
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

export default JerusalemQiblaChange;
