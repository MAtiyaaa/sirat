import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

const MakkahLiveView = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  useEffect(() => {
    // Redirect to external live stream
    window.location.href = "https://www.makkah.live/makkah-live";
  }, []);

  const content = {
    title: settings.language === 'ar' ? 'البث المباشر للكعبة' : 'Kaaba Live View',
    redirecting: settings.language === 'ar' ? 'جاري التحويل...' : 'Redirecting...',
    back: settings.language === 'ar' ? 'رجوع' : 'Back',
    manual: settings.language === 'ar' ? 'إذا لم يتم التحويل تلقائياً، اضغط هنا' : 'If not redirected automatically, click here',
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 flex flex-col items-center justify-center">
      <div className="max-w-2xl mx-auto space-y-6 text-center">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 neomorph hover:neomorph-pressed">
          <ChevronLeft className="h-4 w-4 mr-2" />
          {content.back}
        </Button>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
        <p className="text-xl text-muted-foreground mb-8">{content.redirecting}</p>
        <Button 
          onClick={() => window.location.href = "https://www.makkah.live/makkah-live"}
          className="neomorph hover:neomorph-pressed"
          size="lg"
        >
          <ExternalLink className="h-5 w-5 mr-2" />
          {content.manual}
        </Button>
      </div>
    </div>
  );
};

export default MakkahLiveView;
