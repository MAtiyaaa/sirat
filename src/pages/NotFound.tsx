import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Home,
  Sparkles,
  Book,
  MessageSquare,
  BookMarked,
  Hand,
  CircleDot,
  Moon,
  Calculator,
  Scroll,
  Bookmark,
  MapPin,
} from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  // Subtle starfield
  const starsRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = starsRef.current;
    if (!el) return;
    const count = 60;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const s = document.createElement("div");
      s.className = "absolute w-[2px] h-[2px] rounded-full bg-white/50";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.opacity = String(0.2 + Math.random() * 0.6);
      s.style.animation = `floatStar ${5 + Math.random() * 7}s ease-in-out ${Math.random() * 3}s infinite`;
      frag.appendChild(s);
    }
    el.appendChild(frag);
    return () => { el.innerHTML = ""; };
  }, []);

  const ui = useMemo(
    () => ({
      title: ar ? "الصفحة غير موجودة" : "Page Not Found",
      sub: ar
        ? "يبدو أنك وصلت إلى طريق غير مألوف. اختر وجهتك."
        : "Looks like you’ve ventured off the path. Choose your destination.",
      home: ar ? "الذهاب للرئيسية" : "Go Home",
      back: ar ? "رجوع" : "Back",
      curated: ar ? "وجهات مقترحة" : "Suggested Destinations",
      basmala: "بِسْمِ ٱللَّٰهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
    }),
    [ar]
  );

  // Items: exact gradients you gave
  const items: Array<{
    icon: any;
    title: { ar: string; en: string };
    link: string;
    gradient: string; // "from-x-500 to-y-500"
  }> = [
    { icon: Book,          title: { ar: "القرآن",     en: "Quran" },      link: "/quran",          gradient: "from-blue-500 to-cyan-500" },
    { icon: MessageSquare, title: { ar: "قلم",        en: "Qalam" },      link: "/qalam",          gradient: "from-purple-500 to-pink-500" },
    { icon: BookMarked,    title: { ar: "الأحاديث",   en: "Hadith" },     link: "/hadith",         gradient: "from-green-500 to-emerald-500" },
    { icon: Hand,          title: { ar: "الأدعية",    en: "Duas" },       link: "/duas",           gradient: "from-orange-500 to-amber-500" },
    { icon: CircleDot,     title: { ar: "التسبيح",    en: "Tasbih" },     link: "/tasbih",         gradient: "from-teal-500 to-cyan-500" },
    { icon: Moon,          title: { ar: "الصلاة",     en: "Prayer" },     link: "/prayer",         gradient: "from-sky-500 to-blue-500" },
    { icon: Calculator,    title: { ar: "الزكاة",     en: "Zakat" },      link: "/zakat",          gradient: "from-amber-500 to-yellow-500" },
    { icon: Scroll,        title: { ar: "تعليم",      en: "Education" },  link: "/education",      gradient: "from-indigo-500 to-purple-500" },
    { icon: Bookmark,      title: { ar: "المحفوظات",  en: "Bookmarks" },  link: "/bookmarks",      gradient: "from-rose-500 to-pink-500" },
    // adjust if your route is /mosques instead
    { icon: MapPin,        title: { ar: "المساجد",    en: "Mosques" },    link: "/mosquelocator",  gradient: "from-violet-500 to-purple-500" },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-background" />

      {/* Aurora layers */}
      <div className="pointer-events-none absolute inset-x-0 -top-1/3 h-[60vh] blur-3xl opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_40%,rgba(16,185,129,0.35),rgba(16,185,129,0)_60%)] animate-[pulse_10s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-[radial-gradient(55%_65%_at_55%_45%,rgba(59,130,246,0.35),rgba(59,130,246,0)_60%)] animate-[pulse_12s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-[radial-gradient(45%_55%_at_45%_35%,rgba(14,165,233,0.35),rgba(14,165,233,0)_60%)] animate-[pulse_14s_ease-in-out_infinite]" />
      </div>

      {/* Stars */}
      <div ref={starsRef} className="pointer-events-none absolute inset-0" />

      {/* Basmala watermark */}
      <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center opacity-15">
        <div className="text-2xl md:text-3xl font-semibold select-none tracking-wide">
          {ui.basmala}
        </div>
      </div>

      {/* Local animations */}
      <style>{`
        @keyframes floatStar { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity: .7 } 50% { transform: scale(1.06); opacity: .9 } }
        @keyframes glowPulse {
          0%,100% { text-shadow: 0 0 0px rgba(34,197,94,0), 0 0 0px rgba(59,130,246,0) }
          50% { text-shadow: 0 0 22px rgba(34,197,94,.25), 0 0 36px rgba(59,130,246,.18) }
        }
      `}</style>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-6 py-12 md:py-20">
        {/* Top row */}
        <div className="mb-6 w-full flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="neomorph hover:neomorph-pressed gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {ui.back}
          </Button>
          {/* Removed the “crafted with excellence” chip */}
          <div />
        </div>

        {/* Hero 404 (responsive clamp to avoid overflow) */}
        <div className="relative text-center">
          <div
            className="font-black bg-clip-text text-transparent
                       bg-gradient-to-br from-primary via-emerald-400 to-cyan-400
                       animate-[glowPulse_3s_ease-in-out_infinite] leading-none"
            style={{
              letterSpacing: "-0.04em",
              fontSize: "clamp(64px, 14vw, 136px)",
            }}
          >
            404
          </div>
          <div className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            <h1
              className="font-semibold"
              style={{ fontSize: "clamp(20px, 3.4vw, 32px)", lineHeight: 1.2 }}
            >
              {ui.title}
            </h1>
            <p className="mt-2" style={{ fontSize: "clamp(14px, 2.2vw, 18px)" }}>
              {ui.sub}
            </p>
          </div>

          {/* Big Home CTA */}
          <div className="mt-6">
            <Button
              size="lg"
              onClick={() => navigate("/")}
              className="neomorph hover:neomorph-pressed gap-2 px-6 py-6 text-base"
            >
              <Home className="h-5 w-5" />
              {ui.home}
            </Button>
          </div>
        </div>

        {/* Divider flair */}
        <div className="mt-10 w-full max-w-5xl">
          <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        </div>

        {/* Curated grid */}
        <div className="mt-8 w-full max-w-5xl">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{ui.curated}</div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {items.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="relative overflow-hidden group">
                  {/* Gradient glow on hover using exact gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-2xl opacity-0 group-hover:opacity-40 smooth-transition`}
                  />
                  <Card
                    className="relative cursor-pointer p-5 neomorph hover:neomorph-inset smooth-transition backdrop-blur-xl"
                    onClick={() => navigate(item.link)}
                  >
                    <div className="flex items-center gap-4">
                      {/* Icon with the same gradient (stroke/“text” gradient) */}
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl bg-primary/5 group-hover:scale-105 smooth-transition`}
                      >
                        <Icon className={`h-6 w-6 text-transparent bg-clip-text bg-gradient-to-r ${item.gradient}`} />
                      </div>
                      <div className="min-w-0">
                        <div
                          className="font-semibold truncate break-words"
                          style={{ fontSize: "clamp(14px, 2.4vw, 16px)" }}
                          title={ar ? item.title.ar : item.title.en}
                        >
                          {ar ? item.title.ar : item.title.en}
                        </div>
                        {/* Removed subtext: just icon + name */}
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        <div className="h-10" />
      </div>
    </div>
  );
};

export default NotFound;
