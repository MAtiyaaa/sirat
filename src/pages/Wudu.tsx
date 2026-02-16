import React, { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { Loader2 } from "lucide-react";

// New modular components
import PrayerHero from "@/components/prayer/PrayerHero";
import PrayerTimesGrid from "@/components/prayer/PrayerTimesGrid";
import QuickAccessGrid from "@/components/prayer/QuickAccessGrid";
import WuduStepsCard from "@/components/prayer/WuduStepsCard";
import HijriCalendarCard from "@/components/prayer/HijriCalendarCard";
import IslamicEventsCard from "@/components/prayer/IslamicEventsCard";
import QiblaCard from "@/components/prayer/QiblaCard";
import RamadanBanner, { isRamadan } from "@/components/RamadanBanner";

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

const Wudu = () => {
  const { settings } = useSettings();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [location, setLocation] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [nextPrayer, setNextPrayer] = useState<{ name: string; timeLeft: string; time: string } | null>(null);
  const [hijriDate, setHijriDate] = useState<HijriDate | null>(null);
  const [suhurTime, setSuhurTime] = useState<string>("");
  const [iftarTime, setIftarTime] = useState<string>("");

  const prayerNames: Record<keyof PrayerTimes, string> = {
    Fajr: settings.language === "ar" ? "الفجر" : "Fajr",
    Dhuhr: settings.language === "ar" ? "الظهر" : "Dhuhr",
    Asr: settings.language === "ar" ? "العصر" : "Asr",
    Maghrib: settings.language === "ar" ? "المغرب" : "Maghrib",
    Isha: settings.language === "ar" ? "العشاء" : "Isha",
  };

  useEffect(() => {
    fetchPrayerTimes();
    fetchHijriDate();
  }, [settings.prayerTimeRegion]);

  useEffect(() => {
    if (!prayerTimes) return;

    const calculateNextPrayer = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const prayers = [
        { name: "Fajr", time: prayerTimes.Fajr },
        { name: "Dhuhr", time: prayerTimes.Dhuhr },
        { name: "Asr", time: prayerTimes.Asr },
        { name: "Maghrib", time: prayerTimes.Maghrib },
        { name: "Isha", time: prayerTimes.Isha },
      ];

      for (const prayer of prayers) {
        const [hours, minutes] = prayer.time.split(":").map(Number);
        const prayerTime = hours * 60 + minutes;

        if (prayerTime > currentTime) {
          const diff = prayerTime - currentTime;
          const hoursLeft = Math.floor(diff / 60);
          const minutesLeft = diff % 60;
          setNextPrayer({
            name: prayerNames[prayer.name as keyof PrayerTimes],
            timeLeft: `${hoursLeft}h ${minutesLeft}m`,
            time: prayer.time,
          });
          return;
        }
      }

      const [fajrHours, fajrMinutes] = prayerTimes.Fajr.split(":").map(Number);
      const fajrTime = fajrHours * 60 + fajrMinutes;
      const diff = 24 * 60 - currentTime + fajrTime;
      const hoursLeft = Math.floor(diff / 60);
      const minutesLeft = diff % 60;
      setNextPrayer({
        name: prayerNames.Fajr,
        timeLeft: `${hoursLeft}h ${minutesLeft}m`,
        time: prayerTimes.Fajr,
      });
    };

    calculateNextPrayer();
    const interval = setInterval(calculateNextPrayer, 60000);
    return () => clearInterval(interval);
  }, [prayerTimes, settings.language]);

  const fetchPrayerTimes = async () => {
    setLoading(true);
    try {
      let latitude, longitude;

      if (settings.prayerTimeRegion) {
        [latitude, longitude] = settings.prayerTimeRegion.split(",").map(Number);
      } else {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      }

      const response = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`
      );
      const data = await response.json();

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
    } catch (error) {
      console.error("Error fetching prayer times:", error);
      setPrayerTimes({
        Fajr: "05:00",
        Dhuhr: "12:30",
        Asr: "15:45",
        Maghrib: "18:15",
        Isha: "19:30",
      });
      setLocation(settings.language === "ar" ? "الموقع غير متاح" : "Location unavailable");
    } finally {
      setLoading(false);
    }
  };

  const fetchHijriDate = async () => {
    try {
      const response = await fetch("https://api.aladhan.com/v1/gToH");
      const data = await response.json();

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
    } catch (error) {
      console.error("Error fetching Hijri date:", error);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Ramadan Banner with Suhoor/Iftar at top */}
      {isRamadan() && prayerTimes && (
        <RamadanBanner variant="prayer" prayerTimes={{ Fajr: prayerTimes.Fajr, Maghrib: prayerTimes.Maghrib }} />
      )}
      {isRamadan() && !prayerTimes && <RamadanBanner variant="prayer" />}

      {/* Hero Section */}
      <PrayerHero nextPrayer={nextPrayer} location={location} loading={loading} />

      {/* Prayer Times Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">
          {settings.language === "ar" ? "أوقات الصلاة" : "Prayer Times"}
        </h2>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : prayerTimes ? (
          <PrayerTimesGrid prayerTimes={prayerTimes} nextPrayerName={nextPrayer?.name} />
        ) : null}
      </div>

      {/* Collapsible Sections */}
      <div className="space-y-4">
        <QiblaCard prayerTimeRegion={settings.prayerTimeRegion} />
        <HijriCalendarCard hijriDate={hijriDate} prayerTimeRegion={settings.prayerTimeRegion} />
        <IslamicEventsCard suhurTime={suhurTime} iftarTime={iftarTime} prayerTimeRegion={settings.prayerTimeRegion} />
        <WuduStepsCard />
      </div>

      {/* Quick Access - Last */}
      <QuickAccessGrid />
    </div>
  );
};

export default Wudu;
