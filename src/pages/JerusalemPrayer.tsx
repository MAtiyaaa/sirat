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
      descEn: "Bring sincere intention, focus, and feel the site's blessing." },
    { icon: BookOpen, titleAr: "قراءة وذكر", titleEn: "Recitation & Dhikr",
      descAr: "اغتنم الوقت بالذكر وقراءة القرآن وتعلّم العلم.",
      descEn: "Fill time with dhikr, Qur'an recitation, and learning." },
    { icon: CheckCircle2, titleAr: "اتباع التنظيم", titleEn: "Follow Guidance",
      descAr: "الالتزام بتنبيهات المشرفين وتعليمات السلامة.",
      descEn: "Adhere to stewards' announcements and safety guidance." },
    { icon: Clock, titleAr: "توقيت الصلاة", titleEn: "Prayer Timing",
      descAr: "احرص على معرفة مواقيت الصلاة المحلية قبل القدوم.",
      descEn: "Check local prayer times in advance." },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="shrink-0 glass-effect hover:glass-effect-hover" aria-label={back}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {ar ? "الزيارة والصلاة في الأقصى" : "Visiting & Prayer at Al-Aqsa"}
          </h1>
        </div>
        <p className="text-muted-foreground text-base md:text-lg">
          {ar ? "إرشادات مختصرة لزيارة روحانية منضبطة ومثمرة."
              : "Concise guidance for a spiritually rich and orderly visit."}
        </p>

        <div className="grid gap-4">
          {etiquette.map((e, i) => {
            const Icon = e.icon;
            return (
              <Card key={i} className="glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-semibold text-lg">{ar ? e.titleAr : e.titleEn}</h3>
                    <p className="text-sm text-muted-foreground">{ar ? e.descAr : e.descEn}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JerusalemPrayer;