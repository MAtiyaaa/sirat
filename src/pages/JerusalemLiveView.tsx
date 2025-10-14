import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Eye, Link as LinkIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";

const JerusalemLiveView = () => {
  const { settings } = useSettings();
  const ar = settings.language === "ar";

  const feeds = [
    {
      key: "aqsa",
      titleAr: "ساحة الأقصى",
      titleEn: "Al-Aqsa Courtyard",
      descAr: "مشاهدة مباشرة للساحات (عند توفر رابط بث).",
      descEn: "Live courtyard feed (add a stream URL when available).",
      src: "https://www.youtube.com/embed/?autoplay=0", // placeholder
    },
    {
      key: "dome",
      titleAr: "قبة الصخرة",
      titleEn: "Dome of the Rock",
      descAr: "مشاهدة مباشرة لقبة الصخرة (رابط تجريبي).",
      descEn: "Live view of the Dome of the Rock (placeholder URL).",
      src: "https://www.youtube.com/embed/?autoplay=0",
    },
    {
      key: "panorama",
      titleAr: "جولة بانورامية",
      titleEn: "Panoramic Tour",
      descAr: "أضف رابط جولة 360° عند توفره.",
      descEn: "Add a 360° tour URL when available.",
      src: "https://www.youtube.com/embed/?autoplay=0",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Eye className="h-7 w-7 text-primary" />
            {ar ? "البث المباشر للأقصى" : "Al-Aqsa Live View"}
          </h1>
          <p className="text-muted-foreground">
            {ar
              ? "أدرج روابط بث موثوقة (YouTube، منصات رسمية) لعرض المشاهد المباشرة."
              : "Embed trusted streams (YouTube or official platforms) for live views."}
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          {feeds.map((f) => (
            <Card key={f.key} className="neomorph hover:neomorph-inset smooth-transition p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{ar ? f.titleAr : f.titleEn}</h3>
                <Video className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">{ar ? f.descAr : f.descEn}</p>
              <div className="aspect-video rounded-xl overflow-hidden bg-muted">
                <iframe
                  src={f.src}
                  title={ar ? f.titleAr : f.titleEn}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" className="gap-2" asChild>
                  <a href={f.src} target="_blank" rel="noreferrer">
                    <LinkIcon className="h-4 w-4" />
                    {ar ? "فتح في نافذة جديدة" : "Open in new tab"}
                  </a>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JerusalemLiveView;
