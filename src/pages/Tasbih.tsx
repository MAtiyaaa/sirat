import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Plus,
  Minus,
  RotateCcw,
  Target,
  Sparkles,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------------------------------------------
   Dhikr options (kept your list; both languages)
----------------------------------------------------*/
const dhikrOptions = {
  ar: [
    { value: "subhanallah", label: "سبحان الله", text: "سُبْحَانَ اللَّهِ" },
    { value: "alhamdulillah", label: "الحمد لله", text: "الْحَمْدُ لِلَّهِ" },
    { value: "allahuakbar", label: "الله أكبر", text: "اللَّهُ أَكْبَرُ" },
    { value: "lailahaillallah", label: "لا إله إلا الله", text: "لَا إِلَٰهَ إِلَّا اللَّهُ" },
    { value: "astaghfirullah", label: "أستغفر الله", text: "أَسْتَغْفِرُ اللَّهَ" },
    { value: "astaghfirullah_atubu", label: "أستغفر الله وأتوب إليه", text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ" },
    { value: "subhan_bihamdih", label: "سبحان الله وبحمده", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ" },
    { value: "subhan_alazim", label: "سبحان الله العظيم", text: "سُبْحَانَ اللَّهِ الْعَظِيمِ" },
    { value: "salawat", label: "اللهم صلِّ على محمد", text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ" },
    { value: "hasbunallah", label: "حسبنا الله ونعم الوكيل", text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ" },
    { value: "yunus", label: "دعاء يونس", text: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ" },
    { value: "rabbighfir", label: "رب اغفر لي وتب عليّ", text: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ" },
    { value: "lahaula", label: "لا حول ولا قوة إلا بالله", text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ" },
  ],
  en: [
    { value: "subhanallah", label: "SubhanAllah", text: "سُبْحَانَ اللَّـهِ" },
    { value: "alhamdulillah", label: "Alhamdulillah", text: "الْحَمْدُ لِلَّـهِ" },
    { value: "allahuakbar", label: "Allahu Akbar", text: "اللَّـهُ أَكْبَرُ" },
    { value: "lailahaillallah", label: "La ilaha illallah", text: "لَا إِلَٰهَ إِلَّا اللَّـهُ" },
    { value: "astaghfirullah", label: "Astaghfirullah", text: "أَسْتَغْفِرُ اللَّـهَ" },
    { value: "astaghfirullah_atubu", label: "Astaghfirullah wa atubu ilayh", text: "أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ" },
    { value: "subhan_bihamdih", label: "SubhanAllahi wa bihamdih", text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ" },
    { value: "subhan_alazim", label: "SubhanAllahi al-azim", text: "سُبْحَانَ اللَّهِ الْعَظِيمِ" },
    { value: "salawat", label: "Salawat (Blessings on the Prophet ﷺ)", text: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ" },
    { value: "hasbunallah", label: "HasbunAllahu wa ni‘mal wakeel", text: "حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ" },
    { value: "yunus", label: "Dua of Yunus (AS)", text: "لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ" },
    { value: "rabbighfir", label: "Rabbighfir li wa tub ‘alayya", text: "رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ" },
    { value: "lahaula", label: "La hawla wa la quwwata", text: "لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ" },
  ],
} as const;

/* ---------------------------------------------------
   Copy & Empire UI strings
----------------------------------------------------*/
const copyText = {
  ar: {
    title: "التسبيح",
    subtitle: "عداد الذكر الإلكتروني",
    selectDhikr: "اختر الذكر",
    reset: "إعادة تعيين",
    counter: "العدد",
    target: "الهدف",
    custom: "مخصص",
    back: "رجوع",
    completed: "اكتمل الذكر",
  },
  en: {
    title: "Tasbih",
    subtitle: "Digital Dhikr Counter",
    selectDhikr: "Select Dhikr",
    reset: "Reset",
    counter: "Count",
    target: "Target",
    custom: "Custom",
    back: "Back",
    completed: "Tasbih completed",
  },
};

/* ---------------------------------------------------
   Helpers
----------------------------------------------------*/
const presetTargets = [33, 100, 1000];

const keyFor = (lang: "ar" | "en", dhikr: string) => `tasbih:${lang}:${dhikr}`;

const haptic = (ms = 10) => {
  if ("vibrate" in navigator) {
    try { navigator.vibrate(ms); } catch {}
  }
};

/* ---------------------------------------------------
   Component
----------------------------------------------------*/
const Tasbih: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings } = useSettings();
  const lang: "ar" | "en" = settings.language === "ar" ? "ar" : "en";
  const t = copyText[lang];

  const dhikrList = dhikrOptions[lang];
  const [selectedDhikr, setSelectedDhikr] = useState<string>("subhanallah");

  // per-dhikr persisted state
  const [count, setCount] = useState<number>(0);
  const [target, setTarget] = useState<number>(33);
  const [customOpen, setCustomOpen] = useState<boolean>(false);
  const customInputRef = useRef<HTMLInputElement>(null);

  const currentDhikr = useMemo(
    () => dhikrList.find((d) => d.value === selectedDhikr),
    [dhikrList, selectedDhikr]
  );

  // Deep link (?dhikr=subhanallah)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const d = params.get("dhikr");
    if (d && dhikrList.some((x) => x.value === d)) {
      setSelectedDhikr(d);
    }
  }, [location.search]); // dhikrList is static per language

  // Load/save from localStorage per dhikr
  useEffect(() => {
    const k = keyFor(lang, selectedDhikr);
    const saved = localStorage.getItem(k);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (typeof parsed.count === "number") setCount(parsed.count);
        if (typeof parsed.target === "number") setTarget(parsed.target);
      } catch {}
    } else {
      // default fresh
      setCount(0);
      setTarget(33);
    }
  }, [selectedDhikr, lang]);

  useEffect(() => {
    const k = keyFor(lang, selectedDhikr);
    localStorage.setItem(k, JSON.stringify({ count, target }));
  }, [count, target, selectedDhikr, lang]);

  const increment = () => {
    setCount((prev) => {
      const next = prev + 1;
      haptic();
      return next;
    });
  };
  const decrement = () => setCount((prev) => Math.max(0, prev - 1));
  const reset = () => {
    setCount(0);
    haptic(5);
  };

  // progress
  const progress = Math.min(1, target > 0 ? count / target : 0);
  const done = target > 0 && count >= target;

  // make shareable URL for this dhikr
  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("dhikr", selectedDhikr);
    url.search = params.toString();
    return url.toString();
  }, [selectedDhikr]);

  // ring constants
  const R = 88; // radius
  const C = 2 * Math.PI * R; // circumference
  const strokeDashoffset = C * (1 - progress);

  return (
    <div
      className="min-h-[100dvh] w-full overflow-x-hidden overflow-y-visible pb-20"
      dir={lang === "ar" ? "rtl" : "ltr"}
    >
      {/* Soft BG */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute left-1/2 -translate-x-1/2 top-[-7rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-50" />
        <div className="absolute right-1/2 translate-x-1/2 bottom-[-7rem] h-80 w-80 rounded-full bg-secondary/20 blur-3xl opacity-40" />
      </div>

      {/* Back */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
        aria-label={t.back}
        title={t.back}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Header */}
      <header className="pt-16 md:pt-20 text-center px-4 space-y-3">
        <div className="flex items-center justify-center gap-3">
          <Sparkles className="h-10 w-10 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/60 bg-clip-text text-transparent">
              {t.title}
            </span>
          </h1>
        </div>
        <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
          {t.subtitle}
        </p>
      </header>

      {/* Controls: Dhikr + Target */}
      <section className="mt-8 px-4">
        <div className="rounded-2xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-4 shadow-sm">
          <div className="grid gap-3 md:grid-cols-[1fr_320px]">
            {/* Dhikr select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t.selectDhikr}
              </label>
              <Select
                value={selectedDhikr}
                onValueChange={(v) => {
                  setSelectedDhikr(v);
                  setCount(0);
                }}
              >
                <SelectTrigger className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dhikrList.map((d) => (
                    <SelectItem key={d.value} value={d.value}>
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Target presets */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                {t.target}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {presetTargets.map((p) => (
                  <Button
                    key={p}
                    variant={target === p ? "default" : "outline"}
                    className="h-11 rounded-xl"
                    onClick={() => setTarget(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant={customOpen || (!presetTargets.includes(target) && target > 0) ? "default" : "outline"}
                  className="h-11 rounded-xl"
                  onClick={() => {
                    setCustomOpen((s) => !s);
                    setTimeout(() => customInputRef.current?.focus(), 10);
                  }}
                >
                  {t.custom}
                </Button>
              </div>
              {customOpen && (
                <div className="flex items-center gap-2 mt-2">
                  <input
                    ref={customInputRef}
                    type="number"
                    min={1}
                    inputMode="numeric"
                    className="w-full rounded-xl border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    placeholder="e.g. 500"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        const v = Number((e.target as HTMLInputElement).value);
                        if (Number.isFinite(v) && v > 0) setTarget(v);
                        setCustomOpen(false);
                      }
                    }}
                  />
                  <Button
                    className="rounded-xl"
                    onClick={() => {
                      const v = Number(customInputRef.current?.value);
                      if (Number.isFinite(v) && v > 0) setTarget(v);
                      setCustomOpen(false);
                    }}
                  >
                    <Target className="h-4 w-4 mr-2" />
                    OK
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Tiny meta row */}
          <div className="mt-3 text-xs md:text-sm text-muted-foreground">
            {t.counter}: {count} {target ? `• ${t.target}: ${target}` : ""}
          </div>
        </div>
      </section>

      {/* Main counter card (tap anywhere to +1) */}
      <section className="mt-6 px-4">
        <div
          className="group relative overflow-hidden rounded-3xl border bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-6 md:p-8 shadow-sm cursor-pointer select-none"
          onClick={increment}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              increment();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Increment"
        >
          {/* Accent gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 opacity-70" />

          <div className="relative grid md:grid-cols-[1fr_260px] gap-8 items-center">
            {/* Dhikr text */}
            <div className="text-center md:text-left space-y-4">
              <p
                className={`text-4xl md:text-5xl font-bold ${settings.fontType === "quran" ? "font-quran" : ""}`}
                dir="rtl"
              >
                {currentDhikr?.text}
              </p>
              <p className="text-base md:text-lg text-muted-foreground">
                {currentDhikr?.label}
              </p>
            </div>

            {/* Progress ring + big count */}
            <div className="flex items-center justify-center">
              <div className="relative h-56 w-56">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r={R}
                    stroke="currentColor"
                    className="text-muted"
                    strokeWidth="14"
                    fill="none"
                    opacity={0.25}
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={R}
                    stroke="currentColor"
                    className={`text-primary transition-[stroke-dashoffset] duration-300 ease-out`}
                    strokeWidth="14"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={C}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-5xl md:text-6xl font-extrabold bg-gradient-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                    {count}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed banner */}
          {done && (
            <div className="relative mt-6">
              <div className="rounded-2xl border bg-primary/10 text-primary px-4 py-2 text-center text-sm font-medium">
                {t.completed}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Controls */}
      <section className="mt-4 px-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            onClick={decrement}
            size="lg"
            variant="outline"
            className="h-16 text-xl font-semibold glass-effect hover:scale-[1.02] transition"
          >
            <Minus className="h-7 w-7" />
          </Button>

          <Button
            onClick={increment}
            size="lg"
            className="h-16 text-xl font-semibold hover:scale-[1.02] transition"
          >
            <Plus className="h-7 w-7" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Button
            onClick={() => setCount(0)}
            size="lg"
            variant="outline"
            className="h-12 rounded-xl"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            {t.reset}
          </Button>
          <Button
            onClick={() => setCount((c) => Math.max(0, c - 33))}
            size="lg"
            variant="outline"
            className="h-12 rounded-xl"
          >
            −33
          </Button>
          <Button
            onClick={() => setCount((c) => c + 33)}
            size="lg"
            className="h-12 rounded-xl"
          >
            +33
          </Button>
        </div>

        {/* Share current dhikr link (so friends open same one) */}
        <div className="rounded-2xl border bg-background/60 backdrop-blur p-4 text-xs md:text-sm text-muted-foreground">
          <div className={`flex ${lang === "ar" ? "flex-row-reverse" : ""} items-center justify-between gap-2`}>
            <span className="truncate">
              {shareUrl}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={async () => {
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: t.title,
                        text: currentDhikr?.label,
                        url: shareUrl,
                      });
                      return;
                    } catch {}
                  }
                  await navigator.clipboard.writeText(shareUrl);
                }}
              >
                {lang === "ar" ? "مشاركة" : "Share"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={async () => {
                  await navigator.clipboard.writeText(shareUrl);
                }}
              >
                {lang === "ar" ? "نسخ" : "Copy"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hint */}
      <section className="mt-4 px-4">
        <div className="glass-effect rounded-2xl p-6 border border-border/50 backdrop-blur-xl">
          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            {lang === "ar"
              ? "اضغط في البطاقة الرئيسية للعد. يمكنك اختيار الذكر وتحديد الهدف، ويُحفَظ تقدمك تلقائيًا."
              : "Tap the main card to count. Pick a dhikr and set a target — your progress is saved automatically."}
          </p>
        </div>
      </section>
    </div>
  );
};

export default Tasbih;
