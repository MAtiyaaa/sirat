import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  MapPin,
  Clock,
  HandHeart,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Calendar,
  Moon,
  Target,
  Compass,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

/**
 * Notes:
 * - Minimalist, neutral UI. Subtle borders, reduced glow, tighter transitions (duration-100/150).
 * - Qibla:
 *   - Auto-asks for sensor permission on mount (where supported). No "Enable" button.
 *   - Live mini-indicator remains active even when the section is collapsed.
 *   - Unified heading computation (iOS webkitCompassHeading / Android alpha, screen rotation).
 *   - One listener. Optional light smoothing via RAF.
 * - Prayer times: clear typography, compact chips for fard/sunnah, "Next" callout.
 * - Hijri calendar: weekday header, today highlight, Friday accent.
 * - All labels shown in EN/AR based on settings.language; no emojis; consistent tone.
 */

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface HijriDate {
  date: string;
  month: string;
  monthNumber: number;
  year: string;
  designation: string;
  weekday: string;
}

interface IslamicEvent {
  name: string;
  date: Date;
  hijriDate: string;
  countdown: string;
}

interface HijriCalendarDay {
  day: number;
  gregorianDate: string;
  isToday: boolean;
  weekdayIndex?: number; // 0..6 (Sun..Sat by default locale)
}

const Wudu: React.FC = () => {
  const { settings } = useSettings();

  const t = useMemo(() => {
    const ar = settings.language === "ar";
    return {
      prayerTimes: ar ? "أوقات الصلاة" : "Prayer Times",
      next: ar ? "القادمة" : "Next",
      timeTill: ar ? "الوقت المتبقي حتى" : "Time till",
      locationUnavailable: ar ? "الموقع غير متاح" : "Location unavailable",
      qibla: ar ? "اتجاه القبلة" : "Qibla Direction",
      fromNorth: ar ? "من الشمال" : "from North",
      aligned: ar ? "✓ متوافق مع الكعبة" : "✓ Aligned with Kaaba",
      offBy: ar ? "خطأ" : "Off by",
      calibrate: ar ? "المعايرة" : "Calibration",
      calibrationTips: ar ? "إرشادات معايرة" : "Calibration Tips",
      tip1: ar ? "ضع الهاتف أفقيًا (موازيًا للأرض)." : "Hold the phone flat (parallel to the ground).",
      tip2: ar ? "حرّك الهاتف بشكل رقم 8 (∞) في الهواء." : "Move the phone in a figure-eight (∞) motion.",
      tip3: ar ? "ابتعد عن المعادن والأجهزة." : "Keep away from metal and electronics.",
      tip4: ar ? "أدر جسمك ببطء حتى يتجه المؤشر نحو الأعلى." : "Rotate slowly until the Kaaba indicator points up.",
      today: ar ? "اليوم" : "Today",
      hijriCalendar: ar ? "التقويم الهجري" : "Hijri Calendar",
      ramadanEvents: ar ? "رمضان والأعياد" : "Ramadan & Islamic Events",
      suhur: ar ? "السحور" : "Suhur",
      iftar: ar ? "الإفطار" : "Iftar",
      duas: ar ? "الأدعية" : "Dua's",
      visitDuas: ar ? "زيارة صفحة الأدعية للمزيد" : "Visit duas for more",
      fard: ar ? "فرض" : "Fard",
      sunnah: ar ? "سنة" : "Sunnah",
      nextPrayer: ar ? "الصلاة القادمة" : "Next Prayer",
      compassActive: ar ? "البوصلة فعّالة" : "Compass Active",
      yourHeading: ar ? "اتجاهك" : "Your heading",
      passed: ar ? "مضى" : "Passed",
      // Wudu
      wuduSteps: ar ? "خطوات الوضوء" : "Wudu Steps",
      duaAfterWudu: ar ? "دعاء بعد الوضوء" : "Dua After Wudu",
      duaAfterWuduText: ar
        ? "أشهد أن لا إله إلا الله وحده لا شريك له، وأشهد أن محمدًا عبده ورسوله"
        : "I bear witness that there is no deity except Allah alone, without partner, and I bear witness that Muhammad is His servant and Messenger",
      // Labels
      fajr: ar ? "الفجر" : "Fajr",
      dhuhr: ar ? "الظهر" : "Dhuhr",
      asr: ar ? "العصر" : "Asr",
      maghrib: ar ? "المغرب" : "Maghrib",
      isha: ar ? "العشاء" : "Isha",
    };
  }, [settings.language]);

  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeLeft: string; time: string } | null>(null);

  const [isPrayerTimesOpen, setIsPrayerTimesOpen] = useState(false);
  const [isWuduStepsOpen, setIsWuduStepsOpen] = useState(false);
  const [isHijriOpen, setIsHijriOpen] = useState(false);
  const [isRamadanOpen, setIsRamadanOpen] = useState(false);

  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [hijriCalendarDays, setHijriCalendarDays] = useState<HijriCalendarDay[]>([]);
  const [currentHijriMonth, setCurrentHijriMonth] = useState<number>(1);
  const [currentHijriYear, setCurrentHijriYear] = useState<number>(1447);

  const [islamicEvents, setIslamicEvents] = useState<IslamicEvent[]>([]);
  const [suhurTime, setSuhurTime] = useState<string>("");
  const [iftarTime, setIftarTime] = useState<string>("");

  // Qibla
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  // ---- Utilities / Qibla math
  const normalize = (deg: number) => ((deg % 360) + 360) % 360;
  const getScreenAngle = () => {
    const a: any = (screen.orientation && (screen.orientation as any).angle) ?? (window as any).orientation ?? 0;
    return typeof a === "number" ? a : 0;
  };
  function getCompassHeading(e: DeviceOrientationEvent): number | null {
    const webkit = (e as any).webkitCompassHeading;
    let heading: number | null = typeof webkit === "number" ? webkit : null;
    if (heading == null && typeof e.alpha === "number") {
      // Android alpha increases counter-clockwise; convert to clockwise-from-North:
      heading = 360 - e.alpha;
    }
    if (heading == null) return null;
    heading = normalize(heading + getScreenAngle());
    return heading;
  }

  // --- Smoothing via RAF (prevents React thrash & jitter)
  const liveHeadingRef = useRef<number>(0);
  const targetHeadingRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const smooth = () => {
      const prev = liveHeadingRef.current;
      const target = targetHeadingRef.current;
      // Shortest circular interpolation
      let delta = normalize(target - prev);
      if (delta > 180) delta -= 360;
      const next = prev + delta * 0.25; // light smoothing
      liveHeadingRef.current = next;
      setDeviceHeading(normalize(next));
      rafRef.current = requestAnimationFrame(smooth);
    };
    rafRef.current = requestAnimationFrame(smooth);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // --- Auto request orientation permission on mount (iOS needs user gesture in many cases.
  // We still attempt; if denied, we keep rendering the static compass direction and show tips.)
  useEffect(() => {
    (async () => {
      try {
        // Try to ask for permission on supported browsers
        if (typeof (DeviceOrientationEvent as any)?.requestPermission === "function") {
          const res = await (DeviceOrientationEvent as any).requestPermission();
          if (res === "granted") {
            setPermissionGranted(true);
          } else {
            setPermissionGranted(false);
          }
        } else {
          // Android/others usually don't require explicit permission
          setPermissionGranted(true);
        }
      } catch {
        setPermissionGranted(false);
      }
    })();
  }, []);

  // --- Orientation listener (always on if permission granted)
  useEffect(() => {
    if (!permissionGranted) return;
    const evName = "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    const onOrientation = (e: DeviceOrientationEvent) => {
      const h = getCompassHeading(e);
      if (h != null) {
        targetHeadingRef.current = h;
      }
    };
    window.addEventListener(evName as any, onOrientation as any, { passive: true });
    return () => window.removeEventListener(evName as any, onOrientation as any);
  }, [permissionGranted]);

  // --- Data fetching lifecycles
  useEffect(() => {
    fetchPrayerTimes();
    fetchHijriDate();
    fetchIslamicEvents();
    fetchQiblaDirection();
  }, [settings.prayerTimeRegion]);

  // --- Next prayer ticker
  useEffect(() => {
    if (!prayerTimes) return;
    const calc = () => {
      const now = new Date();
      const current = now.getHours() * 60 + now.getMinutes();

      const order: Array<{ key: keyof PrayerTimes; label: string }> = [
        { key: "Fajr", label: t.fajr },
        { key: "Dhuhr", label: t.dhuhr },
        { key: "Asr", label: t.asr },
        { key: "Maghrib", label: t.maghrib },
        { key: "Isha", label: t.isha },
      ];

      for (const p of order) {
        const [h, m] = (prayerTimes[p.key] || "00:00").split(":").map(Number);
        const mins = h * 60 + m;
        if (mins > current) {
          const diff = mins - current;
          setNextPrayer({
            name: p.label,
            timeLeft: `${Math.floor(diff / 60)}h ${diff % 60}m`,
            time: prayerTimes[p.key],
          });
          return;
        }
      }
      // Next Fajr tomorrow
      const [fh, fm] = prayerTimes.Fajr.split(":").map(Number);
      const mins = 24 * 60 - current + (fh * 60 + fm);
      setNextPrayer({
        name: t.fajr,
        timeLeft: `${Math.floor(mins / 60)}h ${mins % 60}m`,
        time: prayerTimes.Fajr,
      });
    };
    calc();
    const id = setInterval(calc, 60_000);
    return () => clearInterval(id);
  }, [prayerTimes, t]);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      let latitude: number, longitude: number;

      if (settings.prayerTimeRegion) {
        [latitude, longitude] = settings.prayerTimeRegion.split(",").map(Number);
      } else {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject),
        );
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      }

      const res = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`,
      );
      const data = await res.json();

      if (data.code === 200) {
        setPrayerTimes({
          Fajr: data.data.timings.Fajr,
          Dhuhr: data.data.timings.Dhuhr,
          Asr: data.data.timings.Asr,
          Maghrib: data.data.timings.Maghrib,
          Isha: data.data.timings.Isha,
        });
        setLocation(`${data.data.meta.timezone}`);
        setSuhurTime(data.data.timings.Fajr);
        setIftarTime(data.data.timings.Maghrib);
      }
    } catch {
      setPrayerTimes({
        Fajr: "05:00",
        Dhuhr: "12:30",
        Asr: "15:45",
        Maghrib: "18:15",
        Isha: "19:30",
      });
      setLocation(t.locationUnavailable);
    } finally {
      setLoading(false);
    }
  };

  const fetchHijriDate = async () => {
    try {
      const res = await fetch("https://api.aladhan.com/v1/gToH");
      const data = await res.json();
      if (data.code === 200) {
        setHijriDate({
          date: data.data.hijri.day,
          month: settings.language === "ar" ? data.data.hijri.month.ar : data.data.hijri.month.en,
          monthNumber: data.data.hijri.month.number,
          year: data.data.hijri.year,
          designation: data.data.hijri.designation.abbreviated,
          weekday: settings.language === "ar" ? data.data.hijri.weekday.ar : data.data.hijri.weekday.en,
        });
      }
    } catch {}
  };

  const fetchHijriCalendar = async (month: number, year: number) => {
    try {
      let latitude: number, longitude: number;
      if (settings.prayerTimeRegion) {
        [latitude, longitude] = settings.prayerTimeRegion.split(",").map(Number);
      } else {
        const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject),
        );
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
      }
      const res = await fetch(
        `https://api.aladhan.com/v1/hijriCalendar/${month}/${year}?latitude=${latitude}&longitude=${longitude}&method=2`,
      );
      const data = await res.json();
      if (data.code === 200) {
        const today = new Date().toISOString().split("T")[0];
        const days: HijriCalendarDay[] = data.data.map((item: any) => {
          const g = item.date.gregorian.date; // yyyy-mm-dd
          const d = new Date(g);
          const weekdayIndex = d.getDay(); // 0..6 (Sun..Sat)
          return {
            day: parseInt(item.date.hijri.day, 10),
            gregorianDate: g,
            isToday: g === today,
            weekdayIndex,
          };
        });
        setHijriCalendarDays(days);
      }
    } catch {}
  };

  useEffect(() => {
    if (!hijriDate) return;
    setCurrentHijriMonth(hijriDate.monthNumber);
    setCurrentHijriYear(parseInt(hijriDate.year, 10));
    fetchHijriCalendar(hijriDate.monthNumber, parseInt(hijriDate.year, 10));
  }, [hijriDate]);

  const navigateHijriMonth = (dir: "prev" | "next") => {
    let m = currentHijriMonth;
    let y = currentHijriYear;
    if (dir === "next") {
      m = m === 12 ? 1 : m + 1;
      y = m === 1 ? y + 1 : y;
    } else {
      m = m === 1 ? 12 : m - 1;
      y = m === 12 ? y - 1 : y;
    }
    setCurrentHijriMonth(m);
    setCurrentHijriYear(y);
    fetchHijriCalendar(m, y);
  };

  const getHijriMonthName = (n: number) => {
    const ar = [
      "محرم",
      "صفر",
      "ربيع الأول",
      "ربيع الثاني",
      "جمادى الأولى",
      "جمادى الآخرة",
      "رجب",
      "شعبان",
      "رمضان",
      "شوال",
      "ذو القعدة",
      "ذو الحجة",
    ];
    const en = [
      "Muharram",
      "Safar",
      "Rabi al-Awwal",
      "Rabi al-Thani",
      "Jumada al-Awwal",
      "Jumada al-Thani",
      "Rajab",
      "Shaban",
      "Ramadan",
      "Shawwal",
      "Dhu al-Qadah",
      "Dhu al-Hijjah",
    ];
    return (settings.language === "ar" ? ar : en)[n - 1];
  };

  const fetchIslamicEvents = async () => {
    try {
      let latitude: number, longitude: number;
      if (settings.prayerTimeRegion) {
        [latitude, longitude] = settings.prayerTimeRegion.split(",").map(Number);
      } else {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject),
          );
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch {
          latitude = 21.4225; // Mecca fallback
          longitude = 39.8262;
        }
      }

      const upcomingDates = [
        { gregorian: "28-02-2026", name: "Ramadan", hijriDay: 1, hijriMonth: "Ramadan" },
        { gregorian: "30-03-2026", name: "Eid al-Fitr", hijriDay: 1, hijriMonth: "Shawwal" },
        { gregorian: "06-06-2026", name: "Eid al-Adha", hijriDay: 10, hijriMonth: "Dhu al-Hijjah" },
      ];

      const events: IslamicEvent[] = [];
      for (const e of upcomingDates) {
        try {
          const url = `https://api.aladhan.com/v1/gToH/${e.gregorian}`;
          const res = await fetch(url);
          const data = await res.json();
          if (data.code === 200) {
            const [d, m, y] = e.gregorian.split("-").map((n) => parseInt(n, 10));
            const date = new Date(y, m - 1, d);
            if (date > new Date()) {
              events.push({
                name: e.name,
                date,
                hijriDate: `${e.hijriDay} ${e.hijriMonth} ${data.data.hijri.year}`,
                countdown: "",
              });
            }
          }
        } catch {}
      }
      setIslamicEvents(events);
    } catch {}
  };

  useEffect(() => {
    if (islamicEvents.length === 0) return;
    const tick = () => {
      const up = islamicEvents.map((evt) => {
        const now = new Date().getTime();
        const diff = evt.date.getTime() - now;
        if (diff <= 0) return { ...evt, countdown: t.passed };
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        return { ...evt, countdown: `${days}d ${hours}h` };
      });
      setIslamicEvents(up);
    };
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [islamicEvents.length, t]);

  // Labels
  const prayerNames = useMemo(
    () => ({
      Fajr: t.fajr,
      Dhuhr: t.dhuhr,
      Asr: t.asr,
      Maghrib: t.maghrib,
      Isha: t.isha,
    }),
    [t],
  );
  const prayerRakaas = {
    Fajr: { fard: 2, sunnah: 2 },
    Dhuhr: { fard: 4, sunnah: 4 },
    Asr: { fard: 4, sunnah: 0 },
    Maghrib: { fard: 3, sunnah: 2 },
    Isha: { fard: 4, sunnah: 2 },
  };

  const fetchQiblaDirection = async () => {
    try {
      let latitude: number, longitude: number;
      if (settings.prayerTimeRegion) {
        [latitude, longitude] = settings.prayerTimeRegion.split(",").map(Number);
      } else {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject),
          );
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
        } catch {
          latitude = 21.4225; // Mecca fallback
          longitude = 39.8262;
        }
      }
      const res = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
      const data = await res.json();
      if (data.code === 200) {
        setQiblaDirection(Math.round(data.data.direction));
      }
    } catch {
      setQiblaDirection(0);
    }
  };

  // --- UI helpers
  const Pill: React.FC<{ label: string }> = ({ label }) => (
    <span className="inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full border border-border/60 text-foreground/80">
      {label}
    </span>
  );

  const Chip: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <span className="inline-flex items-center gap-2 px-2.5 py-1 text-xs font-semibold rounded-md border border-border/60">
      <span className="opacity-70">{label}</span>
      <span className="text-foreground/90">{value}</span>
    </span>
  );

  const Section: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <div className={`rounded-3xl border border-border/60 bg-background/70 backdrop-blur-sm ${className || ""}`}>
      {children}
    </div>
  );

  // --- Render
  return (
    <div className="space-y-8">
      {/* ===================== PRAYER TIMES ===================== */}
      <Collapsible open={isPrayerTimesOpen} onOpenChange={setIsPrayerTimesOpen}>
        <Section className="p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3 min-w-0">
                  <HandHeart className="h-5 w-5 text-primary" />
                  <div className="min-w-0">
                    <h2 className="text-2xl font-semibold tracking-tight">{t.prayerTimes}</h2>
                    {location && (
                      <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground truncate">
                        <MapPin className="h-3.5 w-3.5" />
                        <span className="truncate">{location}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : nextPrayer ? (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">{t.nextPrayer}</div>
                        <div className="text-lg font-semibold text-primary leading-tight">{nextPrayer.name}</div>
                        <div className="text-sm text-foreground/90">{nextPrayer.time}</div>
                      </div>
                      <div className="hidden sm:flex flex-col items-end">
                        <div className="text-xs text-muted-foreground">{t.timeTill}</div>
                        <div className="text-base font-medium">{nextPrayer.timeLeft}</div>
                      </div>
                    </div>
                  ) : null}

                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform duration-150 ${isPrayerTimesOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </div>
            </button>
          </CollapsibleTrigger>

          {/* Always-visible summary grid (compact) */}
          {!isPrayerTimesOpen && prayerTimes && (
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
              {Object.entries(prayerTimes).map(([k, v]) => (
                <div key={k} className="rounded-xl border border-border/50 px-3 py-2.5">
                  <div className="text-xs text-muted-foreground">{prayerNames[k as keyof PrayerTimes]}</div>
                  <div className="mt-0.5 text-base font-semibold">{v}</div>
                </div>
              ))}
            </div>
          )}

          <CollapsibleContent className="mt-6">
            {prayerTimes && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {Object.entries(prayerTimes).map(([prayer, time]) => {
                  const rk = prayerRakaas[prayer as keyof PrayerTimes];
                  return (
                    <Card
                      key={prayer}
                      className="p-4 border border-border/60 hover:border-primary/40 transition-colors rounded-2xl"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium text-muted-foreground">
                          {prayerNames[prayer as keyof PrayerTimes]}
                        </div>
                        <Pill label={time} />
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <Chip label={t.fard} value={rk.fard} />
                        {rk.sunnah > 0 && <Chip label={t.sunnah} value={rk.sunnah} />}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </CollapsibleContent>
        </Section>
      </Collapsible>

      {/* ===================== NEXT PRAYER CALLOUT ===================== */}
      {nextPrayer && (
        <Section className="p-5 border-primary/25 bg-primary/5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-full border border-primary/30 flex items-center justify-center">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">{t.timeTill}</div>
                <div className="text-lg font-semibold text-primary leading-tight">{nextPrayer.name}</div>
              </div>
            </div>
            <div className="text-2xl font-bold text-primary tabular-nums">{nextPrayer.timeLeft}</div>
          </div>
        </Section>
      )}

      {/* ===================== QIBLA (always-live header) ===================== */}
      <Collapsible /* open state not required for live mini compass */>
        <Section className="p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3 min-w-0">
                  <Target className="h-5 w-5 text-primary" />
                  <div className="min-w-0">
                    <h2 className="text-2xl font-semibold tracking-tight">{t.qibla}</h2>
                    {qiblaDirection !== null && (
                      <div className="mt-1 text-sm text-muted-foreground">
                        {qiblaDirection}° {t.fromNorth}
                      </div>
                    )}
                  </div>
                </div>

                {/* Live mini compass (always active if permission granted) */}
                <div className="flex items-center gap-5">
                  <div className="relative w-18 h-18" style={{ width: 72, height: 72 }}>
                    {/* Ring */}
                    <div
                      className="absolute inset-0 rounded-full border border-border/70 transition-transform duration-100"
                      style={{ transform: `rotate(${-deviceHeading}deg)` }}
                      aria-hidden
                    >
                      {[0, 90, 180, 270].map((d) => (
                        <div
                          key={d}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-top"
                          style={{ transform: `rotate(${d}deg) translateY(-50%)`, height: "50%" }}
                        >
                          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-muted-foreground/40 rounded-full" />
                        </div>
                      ))}
                    </div>
                    {/* Arrow to Qibla */}
                    <div
                      className="absolute inset-0 flex items-center justify-center transition-transform duration-100"
                      style={{
                        transform: `rotate(${qiblaDirection != null ? normalize(qiblaDirection - deviceHeading) : 0}deg)`,
                      }}
                      aria-label="Qibla pointer"
                    >
                      <div className="absolute -top-1 w-2 h-2 rounded-full bg-primary" />
                    </div>
                    {/* Center dot */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-foreground/70" />
                    </div>
                  </div>

                  {/* Heading & delta */}
                  <div className="hidden sm:flex flex-col items-end">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Compass className="h-3.5 w-3.5" />
                      <span>{t.compassActive}</span>
                    </div>
                    <div className="mt-0.5 text-sm">
                      <span className="opacity-60">{t.yourHeading}:</span>{" "}
                      <span className="font-medium tabular-nums">{Math.round(deviceHeading)}°</span>
                    </div>
                    {qiblaDirection != null && (
                      <div className="text-sm">
                        <span className="opacity-60">{t.offBy}:</span>{" "}
                        <span className="font-medium tabular-nums">
                          {(() => {
                            const diff = Math.abs(normalize(qiblaDirection - deviceHeading));
                            return Math.round(diff > 180 ? 360 - diff : diff);
                          })()}
                          °
                        </span>
                      </div>
                    )}
                  </div>

                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
            </button>
          </CollapsibleTrigger>

          {/* Expanded: full compass + tips */}
          <CollapsibleContent className="mt-6">
            {qiblaDirection !== null && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Compass */}
                <div className="relative mx-auto aspect-square w-full max-w-[420px]">
                  {/* Frame */}
                  <div className="absolute inset-0 rounded-full border-2 border-border/70" />
                  {/* Rotating ring */}
                  <div
                    className="absolute inset-6 rounded-full border border-border/60 transition-transform duration-100"
                    style={{ transform: `rotate(${-deviceHeading}deg)` }}
                  >
                    {[...Array(12)].map((_, i) => {
                      const degree = i * 30;
                      const isCardinal = degree % 90 === 0;
                      return (
                        <div
                          key={degree}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-top"
                          style={{ transform: `rotate(${degree}deg) translateY(-50%)`, height: "50%" }}
                        >
                          <div
                            className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full ${isCardinal ? "w-1 h-5 bg-foreground/70" : "w-0.5 h-3 bg-muted-foreground/40"}`}
                          />
                          {isCardinal && (
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xs font-semibold text-foreground/80 select-none">
                              {degree === 0 ? "N" : degree === 90 ? "E" : degree === 180 ? "S" : "W"}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Qibla pointer */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-100"
                    style={{ transform: `rotate(${normalize(qiblaDirection - deviceHeading)}deg)` }}
                    aria-hidden
                  >
                    <div className="absolute -top-6 flex flex-col items-center gap-1">
                      <div className="w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-b-[14px] border-b-primary" />
                      <div className="w-1 h-[44%] rounded-full bg-primary/70" />
                    </div>
                  </div>

                  {/* Center readout */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 rounded-full border border-border/60 bg-background/95 flex flex-col items-center justify-center">
                      <div className="text-[11px] text-muted-foreground">{t.qibla}</div>
                      <div className="mt-0.5 text-lg font-semibold tabular-nums">
                        {Math.round(normalize(qiblaDirection - deviceHeading))}°
                      </div>
                    </div>
                  </div>
                </div>

                {/* Calibration tips / status */}
                <div className="rounded-2xl border border-border/60 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Info className="h-4 w-4 text-muted-foreground" />
                    <h3 className="text-base font-semibold">{t.calibrationTips}</h3>
                  </div>
                  <ul className="space-y-2.5 text-sm text-muted-foreground leading-relaxed">
                    <li>• {t.tip1}</li>
                    <li>• {t.tip2}</li>
                    <li>• {t.tip3}</li>
                    <li>• {t.tip4}</li>
                  </ul>
                  {!permissionGranted && (
                    <div className="mt-4 text-xs text-muted-foreground/80">
                      {/* Keep neutral note instead of a button */}
                      {settings.language === "ar"
                        ? "إذا لم يظهر المؤشر مباشرةً، فعّل مستشعر الاتجاه من إعدادات المتصفح ثم أعد فتح الصفحة."
                        : "If the pointer does not update, enable motion/gyro access in your browser settings and reopen this page."}
                    </div>
                  )}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Section>
      </Collapsible>

      {/* ===================== HIJRI CALENDAR ===================== */}
      <Collapsible open={isHijriOpen} onOpenChange={setIsHijriOpen}>
        <Section className="p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold tracking-tight">{t.hijriCalendar}</h2>
                </div>
                {hijriDate ? (
                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">{t.today}</div>
                      <div className="text-lg font-semibold text-primary">
                        {hijriDate.date} {hijriDate.month}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {hijriDate.year} {hijriDate.designation}
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-150 ${isHijriOpen ? "rotate-180" : ""}`}
                    />
                  </div>
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            <div className="rounded-2xl border border-border/60 p-5 bg-background/60">
              {/* Month switcher */}
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => navigateHijriMonth("prev")}
                  className="w-10 h-10 rounded-full border border-border/60 hover:bg-muted/40 transition-colors"
                >
                  <ChevronDown className="h-4 w-4 rotate-90" />
                </button>
                <div className="text-center">
                  <div className="text-xl font-semibold">{getHijriMonthName(currentHijriMonth)}</div>
                  <div className="text-xs text-muted-foreground">
                    {currentHijriYear} {hijriDate?.designation}
                  </div>
                </div>
                <button
                  onClick={() => navigateHijriMonth("next")}
                  className="w-10 h-10 rounded-full border border-border/60 hover:bg-muted/40 transition-colors"
                >
                  <ChevronDown className="h-4 w-4 -rotate-90" />
                </button>
              </div>

              {/* Week header */}
              <div className="grid grid-cols-7 gap-1 text-xs text-muted-foreground mb-2">
                {(settings.language === "ar"
                  ? ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"]
                  : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
                ).map((d, i) => (
                  <div
                    key={i}
                    className={`py-1 text-center ${i === (settings.language === "ar" ? 5 : 5) ? "text-primary" : ""}`}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {hijriCalendarDays.map((day, idx) => {
                  const fridayIndex = 5; // Fri
                  const isFriday = day.weekdayIndex === fridayIndex;
                  return (
                    <div
                      key={idx}
                      className={[
                        "aspect-square rounded-lg border text-sm flex flex-col items-center justify-center",
                        "transition-colors",
                        day.isToday ? "border-primary/50 bg-primary/5" : "border-border/60 hover:bg-muted/30",
                        isFriday ? "text-primary" : "text-foreground",
                      ].join(" ")}
                      title={day.gregorianDate}
                    >
                      <div className="font-medium">{day.day}</div>
                      <div className="text-[10px] text-muted-foreground">{day.gregorianDate.slice(8, 10)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CollapsibleContent>
        </Section>
      </Collapsible>

      {/* ===================== WUDU ===================== */}
      <Collapsible open={isWuduStepsOpen} onOpenChange={setIsWuduStepsOpen}>
        <Section className="p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <HandHeart className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold tracking-tight">{t.wuduSteps}</h2>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-150 ${isWuduStepsOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>
          </CollapsibleTrigger>

          {/* When collapsed, show a slim preview of the first few steps */}
          {!isWuduStepsOpen && (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {getSteps(settings.language)
                .slice(0, 3)
                .map((s, i) => (
                  <div key={i} className="rounded-xl border border-border/60 px-3 py-2.5">
                    <div className="text-xs text-muted-foreground">{`${i + 1}. ${s.title}`}</div>
                    <div className="mt-0.5 text-sm">{s.description}</div>
                  </div>
                ))}
            </div>
          )}

          <CollapsibleContent className="mt-6">
            <div className="space-y-4">
              {getSteps(settings.language).map((step, i) => (
                <div key={i} className="rounded-2xl border border-border/60 p-5">
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5">
                      <div className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center text-sm font-semibold">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold">{step.title}</h3>
                        {step.count && (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold rounded-md border border-border/60">
                            ×{step.count}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div className="rounded-2xl border border-border/60 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <h3 className="text-base font-semibold">{t.duaAfterWudu}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t.duaAfterWuduText}</p>
              </div>
            </div>
          </CollapsibleContent>
        </Section>
      </Collapsible>

      {/* ===================== RAMADAN & EVENTS ===================== */}
      <Collapsible open={isRamadanOpen} onOpenChange={setIsRamadanOpen}>
        <Section className="p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <Moon className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold tracking-tight">{t.ramadanEvents}</h2>
                </div>
                <ChevronDown
                  className={`h-5 w-5 text-muted-foreground transition-transform duration-150 ${isRamadanOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6">
            <div className="space-y-4">
              {islamicEvents.length > 0 ? (
                islamicEvents.map((event, idx) => (
                  <div key={idx} className="rounded-2xl border border-border/60 p-5">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-lg font-semibold">
                        {settings.language === "ar"
                          ? event.name === "Ramadan"
                            ? "رمضان"
                            : event.name === "Eid al-Fitr"
                              ? "عيد الفطر"
                              : "عيد الأضحى"
                          : event.name}
                      </h3>
                      <div className="text-lg font-medium text-primary tabular-nums">{event.countdown}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.date.toLocaleDateString(settings.language === "ar" ? "ar-SA" : "en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground/80">{event.hijriDate}</div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}

              {suhurTime && iftarTime && (
                <div>
                  <h4 className="text-base font-semibold mb-3">
                    {settings.language === "ar" ? "أوقات رمضان" : "Ramadan Times"}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 border border-border/60 rounded-2xl">
                      <div className="text-xs text-muted-foreground">{t.suhur}</div>
                      <div className="mt-1 text-xl font-semibold">{suhurTime}</div>
                    </Card>
                    <Card className="p-4 border border-border/60 rounded-2xl">
                      <div className="text-xs text-muted-foreground">{t.iftar}</div>
                      <div className="mt-1 text-xl font-semibold">{iftarTime}</div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Section>
      </Collapsible>

      {/* ===================== DUAS LINK ===================== */}
      <Link to="/duas" className="block group">
        <div className="relative">
          <div className="rounded-3xl border border-border/60 p-8 bg-background/70 hover:bg-background transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl border border-border/60 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-1">{t.duas}</h3>
                  <p className="text-sm text-muted-foreground">{t.visitDuas}</p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

// ===== Steps (AR/EN) =====
function getSteps(lang: "ar" | "en") {
  const ar = [
    { title: "النية", count: null, description: "انوِ بقلبك الوضوء لله تعالى." },
    { title: "التسمية", count: null, description: "قل: بسم الله الرحمن الرحيم." },
    { title: "اليدين", count: 3, description: "ابدأ باليمنى ثم اليسرى إلى الرسغين." },
    { title: "الفم والأنف", count: 3, description: "تمضمض، ثم استنشق واسمتر بإخراج الماء." },
    { title: "الوجه", count: 3, description: "من منابت الشعر إلى الذقن، ومن الأذن إلى الأذن." },
    { title: "الذراعان", count: 3, description: "اليمنى إلى المرفق، ثم اليسرى إلى المرفق." },
    { title: "مسح الرأس", count: 1, description: "من الأمام إلى الخلف ثم العودة إلى الأمام." },
    { title: "الأذنان", count: 1, description: "داخل الأذنين بالسبابتين وخلفهما بالإبهامين." },
    { title: "القدمان", count: 3, description: "ابدأ باليمنى ثم اليسرى إلى الكعبين." },
  ];
  const en = [
    { title: "Intention", count: null, description: "Intend in your heart to perform wudu for Allah." },
    { title: "Bismillah", count: null, description: "Say: In the name of Allah, the Most Merciful." },
    { title: "Hands", count: 3, description: "Right then left, up to the wrists." },
    { title: "Mouth & Nose", count: 3, description: "Rinse mouth; sniff and expel water gently." },
    { title: "Face", count: 3, description: "From hairline to chin, ear to ear." },
    { title: "Arms", count: 3, description: "Right to the elbow, then left to the elbow." },
    { title: "Head Wipe", count: 1, description: "Front to back, then back to front." },
    { title: "Ears", count: 1, description: "Inside with index fingers; behind with thumbs." },
    { title: "Feet", count: 3, description: "Right then left, up to the ankles." },
  ];
  return lang === "ar" ? ar : en;
}

export default Wudu;
