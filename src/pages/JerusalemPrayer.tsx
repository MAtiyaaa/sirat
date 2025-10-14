import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Hand, Heart, BookOpen, Clock } from "lucide-react";

const JerusalemPrayer = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const etiquette = [
    { icon: Hand, titleAr: "الأدب والسكينة", titleEn: "Composure & Courtesy",
      descAr: "خفض الصوت، احترام المصلين، الحفاظ على نظافة الساحات والمصليات.",
      descEn: "Lower voice, respect worshippers, and keep spaces clean." },
    { icon: Heart, titleAr: "النية والخشوع", titleEn: "Intention & Presence",
      descAr: "استحضار النية، والتبتّل في الدعاء، واستشعار بركة المكان.",
      descEn: "Bring sincere intention, focus, and feel the site’s blessing." },
    { icon: BookOpen, titleAr: "قراءة وذكر", titleEn: "Recitation & Dhikr",
      descAr: "اغتنم الوقت بالذكر وقراءة القرآن وتعلّم العلم.",
      descEn: "Fill time with dhikr, Qur’an recitation, and learning." },
    { icon: CheckCircle2, titleAr: "اتباع التنظيم", titleEn: "Follow Guidance",
      descAr: "الالتزام بتنبيهات المشرفين وتعليمات السلامة.",
      descEn: "Adhere to stewards’ announcements and safety guidance." },
  ];

  const tips = [
    { icon: Clock, titleAr: "توقيت الصلاة", titleEn: "Prayer Timing",
      descAr: "احرص على معرفة مواقيت الصلاة المحلية قبل القدوم.",
      descEn: "Check local prayer times in advance." },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 neomorph hover:neomorph-pressed" aria-label={back}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">{ar ? "الزيارة والصلاة في الأقصى" : "Visiting & Prayer at Al-Aqsa"}</h1>
        </div>
        <p className="text-muted-foreground">
          {ar ? "إرشادات مختصرة لزيارة روحانية منضبطة ومثمرة."
              : "Concise guidance for a spiritually rich and orderly visit."}
        </p>

        <section className="grid gap-4">
          {etiquette.map((e, i) => {
            const Icon = e.icon;
            return (
              <Card key={i} className="neomorph hover:neomorph-inset smooth-transition p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{ar ? e.titleAr : e.titleEn}</h3>
                    <p className="text-sm text-muted-foreground">{ar ? e.descAr : e.descEn}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <section className="grid gap-4">
          {tips.map((t, i) => {
            const Icon = t.icon;
            return (
              <Card key={i} className="neomorph hover:neomorph-inset smooth-transition p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{ar ? t.titleAr : t.titleEn}</h3>
                    <p className="text-sm text-muted-foreground">{ar ? t.descAr : t.descEn}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default JerusalemPrayer;
