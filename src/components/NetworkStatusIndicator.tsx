import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { Button } from '@/components/ui/button';

export const NetworkStatusIndicator = () => {
  const { settings } = useSettings();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionQuality, setConnectionQuality] = useState<'good' | 'slow' | 'offline'>('good');
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkConnectionQuality();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setConnectionQuality('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    checkConnectionQuality();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnectionQuality = async () => {
    if (!navigator.onLine) {
      setConnectionQuality('offline');
      return;
    }

    setChecking(true);
    const startTime = Date.now();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      await fetch('https://api.alquran.cloud/v1/surah/1', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-store'
      });
      
      clearTimeout(timeoutId);
      const responseTime = Date.now() - startTime;

      if (responseTime < 1000) {
        setConnectionQuality('good');
      } else {
        setConnectionQuality('slow');
      }
    } catch (error) {
      setConnectionQuality('slow');
    } finally {
      setChecking(false);
    }
  };

  const getStatusColor = () => {
    switch (connectionQuality) {
      case 'good': return 'text-green-500';
      case 'slow': return 'text-yellow-500';
      case 'offline': return 'text-destructive';
    }
  };

  const getStatusBg = () => {
    switch (connectionQuality) {
      case 'good': return 'bg-green-500/10 border-green-500/20';
      case 'slow': return 'bg-yellow-500/10 border-yellow-500/20';
      case 'offline': return 'bg-destructive/10 border-destructive/20';
    }
  };

  const getStatusText = () => {
    if (settings.language === 'ar') {
      switch (connectionQuality) {
        case 'good': return 'الاتصال جيد';
        case 'slow': return 'الاتصال بطيء';
        case 'offline': return 'غير متصل';
      }
    }
    switch (connectionQuality) {
      case 'good': return 'Connection is good';
      case 'slow': return 'Connection is slow';
      case 'offline': return 'You are offline';
    }
  };

  const getGuidanceText = () => {
    if (settings.language === 'ar') {
      switch (connectionQuality) {
        case 'good': 
          return 'جميع الميزات تعمل بشكل طبيعي.';
        case 'slow': 
          return 'قد يستغرق تحميل المحتوى وقتًا أطول. السور المحفوظة مسبقًا متاحة للقراءة.';
        case 'offline': 
          return 'لا يوجد اتصال بالإنترنت. يمكنك قراءة السور المحفوظة مسبقًا فقط.';
      }
    }
    switch (connectionQuality) {
      case 'good': 
        return 'All features are working normally.';
      case 'slow': 
        return 'Content may take longer to load. Previously cached surahs are available for reading.';
      case 'offline': 
        return 'No internet connection. You can only read previously cached surahs.';
    }
  };

  return (
    <div className={`rounded-2xl p-4 border ${getStatusBg()} space-y-3`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {connectionQuality === 'offline' ? (
            <WifiOff className={`h-5 w-5 ${getStatusColor()}`} />
          ) : (
            <Wifi className={`h-5 w-5 ${getStatusColor()}`} />
          )}
          <div>
            <p className={`font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {getGuidanceText()}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={checkConnectionQuality}
          disabled={checking}
          className="shrink-0"
        >
          <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};
