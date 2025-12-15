import React, { useState, useEffect } from 'react';
import { Compass, ChevronDown, Loader2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

interface QiblaCardProps {
  prayerTimeRegion?: string;
}

const QiblaCard = ({ prayerTimeRegion }: QiblaCardProps) => {
  const { settings } = useSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);

  const normalize = (deg: number) => ((deg % 360) + 360) % 360;

  const getScreenAngle = () => {
    const a: any = (screen.orientation && (screen.orientation as any).angle) ?? (window as any).orientation ?? 0;
    return typeof a === 'number' ? a : 0;
  };

  function getCompassHeading(e: DeviceOrientationEvent): number | null {
    const webkit = (e as any).webkitCompassHeading;
    let heading: number | null = typeof webkit === 'number' ? webkit : null;

    if (heading == null && typeof e.alpha === 'number') {
      heading = 360 - e.alpha;
    }
    if (heading == null) return null;

    heading = normalize(heading + getScreenAngle());
    return heading;
  }

  useEffect(() => {
    fetchQiblaDirection();
  }, [prayerTimeRegion]);

  useEffect(() => {
    if (isOpen && !permissionGranted && !isCalibrating) {
      requestOrientationPermission();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!permissionGranted) return;

    const onOrientation = (event: DeviceOrientationEvent) => {
      const h = getCompassHeading(event);
      if (h != null) {
        setDeviceHeading(h);
      }
    };

    const evName = 'ondeviceorientationabsolute' in window ? 'deviceorientationabsolute' : 'deviceorientation';
    window.addEventListener(evName as any, onOrientation as any, { passive: true });

    return () => {
      window.removeEventListener(evName as any, onOrientation as any);
    };
  }, [permissionGranted]);

  const fetchQiblaDirection = async () => {
    try {
      let latitude, longitude;

      if (prayerTimeRegion) {
        [latitude, longitude] = prayerTimeRegion.split(',').map(Number);
      } else {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          latitude = position.coords.latitude;
          longitude = position.coords.longitude;
        } catch {
          latitude = 21.4225;
          longitude = 39.8262;
        }
      }

      const response = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
      const data = await response.json();

      if (data.code === 200) {
        setQiblaDirection(Math.round(data.data.direction));
      }
    } catch (error) {
      console.error('Error fetching Qibla direction:', error);
      setQiblaDirection(0);
    }
  };

  const requestOrientationPermission = async () => {
    setIsCalibrating(true);

    try {
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setPermissionGranted(true);
          toast.success(settings.language === 'ar' ? 'تم تفعيل البوصلة' : 'Compass activated');
        } else {
          toast.error(settings.language === 'ar' ? 'تم رفض الإذن' : 'Permission denied');
        }
      } else {
        setPermissionGranted(true);
        toast.success(settings.language === 'ar' ? 'تم تفعيل البوصلة' : 'Compass activated');
      }
    } catch (error) {
      console.error('Error requesting orientation permission:', error);
      toast.error(settings.language === 'ar' ? 'خطأ في تفعيل البوصلة' : 'Error activating compass');
    } finally {
      setTimeout(() => setIsCalibrating(false), 500);
    }
  };

  const angleDiff = qiblaDirection !== null ? Math.abs((qiblaDirection - deviceHeading + 360) % 360) : 0;
  const adjustedDiff = angleDiff > 180 ? 360 - angleDiff : angleDiff;
  const isAligned = adjustedDiff <= 10 && permissionGranted;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative overflow-hidden rounded-3xl">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10" />
        
        <div className="relative glass-effect border border-border/50 p-6">
          <CollapsibleTrigger asChild>
            <button className="w-full">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center">
                    <Compass className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-xl font-bold">
                      {settings.language === 'ar' ? 'اتجاه القبلة' : 'Qibla Direction'}
                    </h2>
                    {qiblaDirection !== null && (
                      <p className="text-sm text-muted-foreground">
                        {qiblaDirection}° {settings.language === 'ar' ? 'من الشمال' : 'from North'}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Mini compass preview */}
                  {qiblaDirection !== null && (
                    <div className="relative w-16 h-16">
                      <div
                        className="absolute inset-0 rounded-full border-2 border-primary/30 smooth-transition"
                        style={{
                          transform: `rotate(${permissionGranted ? -deviceHeading : 0}deg)`,
                          background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.08) 0%, hsl(var(--background) / 0.8) 70%)',
                        }}
                      >
                        {[0, 90, 180, 270].map((degree) => (
                          <div
                            key={degree}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-top"
                            style={{ transform: `rotate(${degree}deg) translateY(-50%)`, height: '50%' }}
                          >
                            <div className="absolute top-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-primary/30 rounded-full" />
                          </div>
                        ))}
                      </div>

                      <div
                        className="absolute inset-0 flex items-center justify-center smooth-transition"
                        style={{
                          transform: `rotate(${permissionGranted ? normalize(qiblaDirection - deviceHeading) : qiblaDirection}deg)`,
                        }}
                      >
                        <div className="absolute -top-0.5">
                          <span className="text-xl">🕋</span>
                        </div>
                      </div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-primary/60" />
                      </div>
                    </div>
                  )}
                  <ChevronDown className={`h-5 w-5 text-muted-foreground smooth-transition ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-6 space-y-6">
            {qiblaDirection !== null && (
              <>
                {/* Alignment Status */}
                {isAligned && (
                  <div className="relative overflow-hidden rounded-2xl animate-pulse">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-emerald-500/20" />
                    <div className="relative glass-effect border-2 border-green-500/50 p-4">
                      <div className="flex items-center justify-center gap-3">
                        <span className="text-3xl">🕋</span>
                        <div className="text-center">
                          <p className="text-lg font-bold text-green-600 dark:text-green-400">
                            {settings.language === 'ar' ? '✓ متوافق مع الكعبة' : '✓ Aligned with Kaaba'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {settings.language === 'ar' ? `خطأ: ${Math.round(adjustedDiff)}°` : `Off by: ${Math.round(adjustedDiff)}°`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Large Compass */}
                <div className="relative mx-auto aspect-square max-w-[320px]">
                  {/* Outer glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent blur-3xl animate-pulse" />

                  {/* Compass background */}
                  <div
                    className="absolute inset-0 rounded-full border-4 border-primary/20"
                    style={{
                      background: 'radial-gradient(circle at center, hsl(var(--primary) / 0.08) 0%, hsl(var(--background)) 70%)',
                      boxShadow: '0 0 40px hsl(var(--primary) / 0.2), inset 0 0 40px hsl(var(--primary) / 0.05)',
                    }}
                  />

                  {/* Rotating compass ring */}
                  <div
                    className="absolute inset-6 rounded-full border-2 border-primary/40 smooth-transition"
                    style={{ transform: `rotate(${permissionGranted ? -deviceHeading : 0}deg)` }}
                  >
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((degree) => {
                      const isCardinal = degree % 90 === 0;
                      return (
                        <div
                          key={degree}
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 origin-top"
                          style={{ transform: `rotate(${degree}deg) translateY(-50%)`, height: '50%' }}
                        >
                          <div className={`absolute top-0 left-1/2 -translate-x-1/2 rounded-full ${
                            isCardinal ? 'w-1 h-4 bg-primary/60' : 'w-0.5 h-2 bg-primary/30'
                          }`} />
                          {isCardinal && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-primary">
                              {degree === 0 ? 'N' : degree === 90 ? 'E' : degree === 180 ? 'S' : 'W'}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Kaaba indicator */}
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none smooth-transition"
                    style={{
                      transform: `rotate(${permissionGranted ? normalize(qiblaDirection - deviceHeading) : qiblaDirection}deg)`,
                    }}
                  >
                    <div className="absolute -top-4 flex flex-col items-center gap-1">
                      <div className="text-4xl drop-shadow-lg" style={{ filter: 'drop-shadow(0 0 10px hsl(var(--primary) / 0.3))' }}>
                        🕋
                      </div>
                      <div
                        className="w-1 h-[40%] rounded-full"
                        style={{
                          background: 'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--primary) / 0.3), transparent)',
                          boxShadow: '0 0 15px hsl(var(--primary) / 0.5)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Center display */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-16 h-16 rounded-full bg-background/95 border-4 border-primary/40 shadow-2xl flex flex-col items-center justify-center"
                      style={{ boxShadow: '0 0 30px hsl(var(--primary) / 0.3)' }}
                    >
                      <div className="text-xs text-muted-foreground font-medium">
                        {settings.language === 'ar' ? 'القبلة' : 'Qibla'}
                      </div>
                      <div className="text-lg font-bold text-primary">
                        {Math.round((qiblaDirection - deviceHeading + 360) % 360)}°
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="glass-effect rounded-2xl p-4 border border-primary/20">
                  {permissionGranted ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {settings.language === 'ar' ? 'البوصلة نشطة' : 'Compass Active'}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-sm text-muted-foreground">
                          {settings.language === 'ar' ? 'اتجاهك: ' : 'Your heading: '}
                          <span className="font-bold text-primary">{Math.round(deviceHeading)}°</span>
                        </span>
                      </div>
                    </div>
                  ) : isCalibrating ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="text-sm font-medium">
                        {settings.language === 'ar' ? 'جاري تفعيل البوصلة...' : 'Activating compass...'}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        {settings.language === 'ar' ? 'البوصلة ستفعل تلقائياً' : 'Compass will activate automatically'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Calibration Instructions */}
                <div className="glass-effect rounded-2xl p-5 border border-border/50">
                  <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <span className="text-xl">📱</span>
                    {settings.language === 'ar' ? 'كيفية المعايرة' : 'How to Calibrate'}
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {(settings.language === 'ar'
                      ? [
                          'امسك هاتفك بشكل مسطح (موازي للأرض)',
                          'حرك هاتفك في حركة رقم ثمانية (∞) في الهواء',
                          'ابتعد عن المعادن والأجهزة الإلكترونية',
                          'أدر جسمك ببطء حتى تشير الكعبة (🕋) للأعلى',
                        ]
                      : [
                          'Hold your phone flat (parallel to the ground)',
                          'Move your phone in a figure-eight (∞) motion in the air',
                          'Stay away from metal objects and electronic devices',
                          'Slowly turn your body until the Kaaba (🕋) points upward',
                        ]
                    ).map((instruction, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-bold text-primary">{idx + 1}</span>
                        </div>
                        <p>{instruction}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};

export default QiblaCard;
