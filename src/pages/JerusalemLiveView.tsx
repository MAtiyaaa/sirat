// src/pages/JerusalemLiveView.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const JerusalemLiveView = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isAr = settings.language === "ar";

  // Primary: Official Al-Aqsa live channel on YouTube (Jerusalem Endowments / Al-Aqsa streams)
  const PRIMARY_URL = "https://www.youtube.com/@livebroadcastal-aqsa3717/live";

  // Muslim-friendly fallbacks that aggregate/relay Al-Aqsa streams
  const ALT_ISLAMICITY = "https://www.islamicity.org/source/live-broadcast-al-aqsa/";
  const ALT_MAKKAHLIVE = "https://makkahlive.net/masjid_al-aqsa.aspx";

  useEffect(() => {
    window.location.href = PRIMARY_URL;
  }, []);

  const content = {
    title: isAr ? "البث المباشر للمسجد الأقصى" : "Al-Aqsa Mosque Live View",
    redirecting: isAr ? "جاري التحويل..." : "Redirecting...",
    back: isAr ? "رجوع" : "Back",
    manual: isAr ? "إذا لم يتم التحويل تلقائياً، اضغط هنا" : "If not redirected automatically, click here",
    alt1: isAr ? "بديل: بث الأقصى عبر Islamicity" : "Fallback: Al-Aqsa via Islamicity",
    alt2: isAr ? "بديل: بث الأقصى عبر MakkahLive" : "Fallback: Al-Aqsa via MakkahLive",
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 neomorph hover:neomorph-pressed"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {content.back}
        </Button>

        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {content.title}
        </h1>

        <p className="text-xl text-muted-foreground mb-8">
          {content.redirecting}
        </p>

        {/* Manual primary link */}
        <Button
          onClick={() => (window.location.href = PRIMARY_URL)}
          className="neomorph hover:neomorph-pressed"
          size="lg"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          {content.manual}
        </Button>

        {/* Fallbacks (Aqsa-only) */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="secondary" className="neomorph hover:neomorph-pressed">
            <a href={ALT_ISLAMICITY} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              {content.alt1}
            </a>
          </Button>
          <Button asChild variant="secondary" className="neomorph hover:neomorph-pressed">
            <a href={ALT_MAKKAHLIVE} target="_blank" rel="noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              {content.alt2}
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JerusalemLiveView;
