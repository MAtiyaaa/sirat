import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Book, ArrowRightLeft, Stars, Navigation } from "lucide-react";

const JerusalemIsraMiraj = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const steps = [
    { icon: Navigation, titleAr: "الإسراء", titleEn: "Al-Isra’",
      descAr: "انتقال النبي ﷺ ليلاً من المسجد الحرام إلى المسجد الأقصى بإعجاز رباني.",
      descEn: "The Prophet ﷺ traveled by night from the Sacred Mosque to Al-Aqsa by divine miracle." },
    { icon: Stars, titleAr: "المعراج", titleEn: "Al-Miʿrāj",
      descAr: "العروج من الأقصى إلى السماوات العلا ولِّقاء الأنبياء وفرض الصلوات.",
      descEn: "Ascent from Al-Aqsa through the heavens, meeting prophets; prayers were prescribed." },
    { icon: Book, titleAr: "دلالات", titleEn: "Significations",
      descAr: "تثبيت القلب، مركزية الصلاة، ورابطة الأنبياء ووحدة الرسالات.",
      descEn: "Strengthening the heart, centrality of salah, and unity across prophetic messages." },
    { icon: ArrowRightLeft, titleAr: "العودة", titleEn: "Return",
      descAr: "عاد النبي ﷺ من الرحلة المباركة، وبشّر المؤمنين بفرج ونور.",
      descEn: "The Prophet ﷺ returned, bringing assurance and light to the believers." },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 neomorph hover:neomorph-pressed" aria-label={back}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{ar ? "الإسراء والمعراج" : "Al-Isra’ & Al-Miʿrāj"}</h1>
        </div>
        <p className="text-muted-foreground">
          {ar ? "صفحة تعريفية مُركّزة حول أهم محطات الرحلة المباركة ودلالاتها."
              : "A focused overview of the Night Journey, its phases, and meanings."}
        </p>

        <div className="grid gap-4">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-400/10 to-pink-500/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition" />
                <Card className="relative neomorph hover:neomorph-inset smooth-transition p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 smooth-transition">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{ar ? s.titleAr : s.titleEn}</h3>
                      <p className="text-sm text-muted-foreground">{ar ? s.descAr : s.descEn}</p>
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

export default JerusalemIsraMiraj;
