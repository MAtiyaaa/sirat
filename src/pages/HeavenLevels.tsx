import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

// ——————————————————————————————————————————————————————————
// NOTE: This keeps your original content, fixes, and order.
// Added: click-to-open Dialog with richer details in EN/AR.
// ——————————————————————————————————————————————————————————

const HeavenLevels = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === 'ar';

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const content = {
    title: isArabic ? 'درجات الجنة' : 'Levels of Heaven',
    back: isArabic ? 'رجوع' : 'Back',
    intro: isArabic
      ? 'للجنة درجات بعضها فوق بعض، أعلاها الفردوس الأعلى'
      : 'Paradise has levels, some above others, the highest being Al-Firdaws Al-A\'la',
    more: isArabic ? 'المزيد من التفاصيل' : 'More details',
    close: isArabic ? 'إغلاق' : 'Close',
  };

  // Reordered: lowest first → highest last
  // Fixed earlier: "Dar Al-Khuld" → "Jannat Al-Khuld"; removed duplicate "Jannat Al-Firdaws"
  const levels = [
    {
      key: 'muqamah',
      nameAr: 'دار المقامة',
      nameEn: 'Dar Al-Muqamah (Abode of Residence)',
      descAr: 'دار الإقامة الدائمة التي لا ظعن فيها ولا رحيل',
      descEn: 'The abode of permanent residence with no departure or travel',
    },
    {
      key: 'salam',
      nameAr: 'دار السلام',
      nameEn: 'Dar As-Salam (Abode of Peace)',
      descAr: 'الدار الآمنة الخالية من كل آفة ومنغصات، فيها السلامة من كل بلاء',
      descEn: 'The safe abode free from all calamities and troubles, where there is safety from all afflictions',
    },
    {
      key: 'naim',
      nameAr: 'جنة النعيم',
      nameEn: 'Jannat An-Na\'im (Gardens of Delight)',
      descAr: 'جنة التنعم والسرور والبهجة، فيها أنواع النعيم المختلفة',
      descEn: 'The Garden of delight, joy, and pleasure, containing various types of bliss',
    },
    {
      key: 'mawa',
      nameAr: 'جنة المأوى',
      nameEn: 'Jannat Al-Ma\'wa (Garden of Refuge)',
      descAr: 'جنة المأوى والملجأ، التي يأوي إليها المتقون',
      descEn: 'The Garden of refuge and shelter to which the righteous retreat',
    },
    {
      key: 'adn',
      nameAr: 'جنة عدن',
      nameEn: 'Jannat Adn (Gardens of Eternity)',
      descAr: 'جنة الإقامة الدائمة، وهي مقر الأنبياء والصديقين والشهداء والصالحين',
      descEn: 'The Garden of eternal residence, home to prophets, the truthful, martyrs, and the righteous',
    },
    {
      key: 'khuld',
      nameAr: 'جنة الخلد',
      nameEn: 'Jannat Al-Khuld (Garden of Eternity)',
      descAr: 'جنة الخلد والدوام، لا موت فيها ولا فناء',
      descEn: 'The Garden of eternal permanence, with no death or perishing',
    },
    {
      key: 'firdaws',
      nameAr: 'الفردوس الأعلى',
      nameEn: 'Al-Firdaws Al-A\'la',
      descAr: 'أعلى درجات الجنة ووسطها، وهي أفضل الجنان، سقفها عرش الرحمن، ومنها تتفجر أنهار الجنة',
      descEn: 'The highest and middle level of Paradise, its ceiling is the Throne of the Most Merciful, from which the rivers of Paradise spring forth',
    },
  ];

  // Richer details for the Dialog (EN & AR).
  // Keep it lightweight and accurate; you can extend sources later.
  const details = useMemo(() => ({
    muqamah: {
      ar: {
        title: 'دار المقامة',
        blurb: 'سماها الله ﴿دَارَ الْمُقَامَةِ﴾ أي الإقامة الدائمة بلا ظعن ولا ألم.',
        points: [
          'لا سقم ولا همّ ولا نصب.',
          'إقامة مستقرة لا يعتريها تحول.',
          'نعيم مقيم لا انقطاع له.',
        ],
        refs: ['فاطر 35:35'],
      },
      en: {
        title: 'Dar Al-Muqamah',
        blurb: 'Named by Allah as the “Abode of Permanent Residence”—no departure, no pain.',
        points: [
          'No sickness, grief, or fatigue.',
          'A settled, permanent stay—no moving on.',
          'Uninterrupted, abiding bliss.',
        ],
        refs: ['Fatir 35:35'],
      },
    },
    salam: {
      ar: {
        title: 'دار السلام',
        blurb: 'الله يدعو إلى دار السلام، فهي السلامة التامة من كل مخوف ومكروه.',
        points: [
          'لا خوف ولا حزن.',
          'تحية سلام من الملائكة.',
          'قرب من رحمة الله ورضوانه.',
        ],
        refs: ['يونس 10:25', 'الزمر 39:73'],
      },
      en: {
        title: 'Dar As-Salam',
        blurb: 'Allah calls to the “Abode of Peace”—perfect safety from all harm.',
        points: [
          'No fear, no sorrow.',
          'Angels greet with peace.',
          'Nearness to Allah’s mercy and pleasure.',
        ],
        refs: ['Yunus 10:25', 'Az-Zumar 39:73'],
      },
    },
    naim: {
      ar: {
        title: 'جنة النعيم',
        blurb: 'نعيم ظاهر وباطن، دنيوي وأخروي، لا عين رأت ولا أذن سمعت.',
        points: [
          'نعيم القلب والروح والبدن.',
          'أزواج مطهرة ونظر إلى وجه الله.',
          'سرور دائم بلا انقطاع.',
        ],
        refs: ['لقمان 31:8', 'القلم 68:34'],
      },
      en: {
        title: 'Jannat an-Naʿīm',
        blurb: 'Bliss for body, heart, and soul—beyond what eyes have seen or ears have heard.',
        points: [
          'Inner and outer delights.',
          'Pure spouses and the Vision of Allah.',
          'Endless joy without interruption.',
        ],
        refs: ['Luqman 31:8', 'Al-Qalam 68:34'],
      },
    },
    mawa: {
      ar: {
        title: 'جنة المأوى',
        blurb: 'مأوى المتقين، فيها قرب ومنزلة عند الله.',
        points: [
          'سكن وطمأنينة وملجأ.',
          'يرتادها أهل البر والتقوى.',
          'ذكرت مع سدرة المنتهى.',
        ],
        refs: ['السجدة 32:19', 'النجم 53:15'],
      },
      en: {
        title: 'Jannat al-Maʾwa',
        blurb: 'A refuge for the righteous; a station of nearness and rest.',
        points: [
          'Dwelling, serenity, and shelter.',
          'For people of piety and righteousness.',
          'Mentioned near the Lote Tree of the utmost boundary.',
        ],
        refs: ['As-Sajdah 32:19', 'An-Najm 53:15'],
      },
    },
    adn: {
      ar: {
        title: 'جنة عدن',
        blurb: 'جنات الإقامة والدوام، يدخلها الأنبياء والصديقون والشهداء والصالحون.',
        points: [
          'أنهار تجري من تحتها.',
          'حُليّ وثياب سندس وإستبرق.',
          'اجتماع الأهل والذرية بفضل الله.',
        ],
        refs: ['التوبة 9:72', 'الرعد 13:23', 'فاطر 35:33'],
      },
      en: {
        title: 'Jannat ʿAdn',
        blurb: 'Gardens of lasting residence for the prophets, truthful, martyrs, and righteous.',
        points: [
          'Rivers flow beneath.',
          'Adornments and fine silk garments.',
          'Families reunited by Allah’s grace.',
        ],
        refs: ['At-Tawbah 9:72', 'Ar-Raʿd 13:23', 'Fatir 35:33'],
      },
    },
    khuld: {
      ar: {
        title: 'جنة الخلد',
        blurb: 'خلود لا يفنى ولا يزول، نعيم دائم.',
        points: [
          'لا موت بعد اليوم.',
          'إقامة مؤبدة في كرامة.',
          'زيادة من فضل الله.',
        ],
        refs: ['الفرقان 25:15'],
      },
      en: {
        title: 'Jannat al-Khuld',
        blurb: 'Unending eternity—abiding honor and delight.',
        points: [
          'No death thereafter.',
          'Perpetual residence in honor.',
          'Increase from Allah’s bounty.',
        ],
        refs: ['Al-Furqan 25:15'],
      },
    },
    firdaws: {
      ar: {
        title: 'الفردوس الأعلى',
        blurb: 'أعلى الجنة ووسطها، سقفها العرش، ومنها تفجر الأنهار. أُمرنا أن نسأل الله الفردوس.',
        points: [
          'أفضل الجنان وأعلاها.',
          'أنهار الجنة من أعلاها.',
          'حديث: إذا سألتم الله فاسألوه الفردوس.',
        ],
        refs: ['الكهف 18:107', 'المؤمنون 23:11', 'صحيح البخاري'],
      },
      en: {
        title: 'Al-Firdaws al-Aʿla',
        blurb: 'The highest and middle of Paradise; its roof is the Throne; rivers spring from it. We’re taught to ask Allah for Firdaws.',
        points: [
          'The best and highest Garden.',
          'Rivers of Paradise originate there.',
          'Hadith: “If you ask Allah, ask Him for Firdaws.”',
        ],
        refs: ['Al-Kahf 18:107', 'Al-Mu’minun 23:11', 'Sahih al-Bukhari'],
      },
    },
  }), []);

  const features = {
    titleAr: 'من نعيم الجنة',
    titleEn: 'Blessings of Paradise',
    itemsAr: [
      'لا موت فيها ولا نصب ولا تعب',
      'أنهار من ماء ولبن وعسل وخمر',
      'قصور وخيام من لؤلؤ مجوف',
      'فواكه وطيور ولحم مما يشتهون',
      'حور عين كأمثال اللؤلؤ المكنون',
      'رؤية وجه الله الكريم',
      'لقاء الأنبياء والصالحين',
      'سماع كلام الله تعالى',
    ],
    itemsEn: [
      'No death, fatigue, or weariness',
      'Rivers of water, milk, honey, and wine',
      'Palaces and tents made of hollowed pearls',
      'Fruits, birds, and meat as they desire',
      'Hoor al-Een like protected pearls',
      'Seeing the Noble Face of Allah',
      'Meeting the prophets and righteous',
      'Hearing the speech of Allah',
    ],
  };

  const handleOpen = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const active = activeIndex !== null ? levels[activeIndex] : null;
  const activeDetail = active ? details[active.key as keyof typeof details] : null;

  return (
    <div className="relative min-h-screen pb-24">
      {/* Background: aurora + radial grid */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-sky-500/10" />
        <div className="absolute -top-16 -left-16 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(transparent_1px,rgba(255,255,255,0.02)_1px)] [background-size:20px_20px]" />
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 rounded-2xl backdrop-blur supports-[backdrop-filter]:bg-white/5"
            aria-label={content.back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-white/5 backdrop-blur flex items-center justify-center shadow-sm ring-1 ring-white/10">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-sm">{content.title}</h1>
          </div>
        </div>

        <p className="text-muted-foreground text-center mb-2">{content.intro}</p>

        <div className="grid gap-4 mb-8">
          {levels.map((level, index) => (
            <Card
              key={index}
              role="button"
              tabIndex={0}
              onClick={() => handleOpen(index)}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleOpen(index)}
              className="group hover:shadow-xl smooth-transition rounded-2xl border-white/10 bg-white/60 dark:bg-neutral-900/50 backdrop-blur-md hover:bg-white/70 dark:hover:bg-neutral-900/60 cursor-pointer"
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold shadow-inner">
                      {index + 1}
                    </div>
                    <span className="group-hover:translate-x-0.5 transition-transform">
                      {isArabic ? level.nameAr : level.nameEn}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">
                  {isArabic ? level.descAr : level.descEn}
                </p>
                <div className="mt-3 text-xs text-primary/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  {content.more} →
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl border-white/10 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur">
          <CardHeader>
            <CardTitle className="tracking-tight">
              {isArabic ? features.titleAr : features.titleEn}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(isArabic ? features.itemsAr : features.itemsEn).map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl rounded-2xl border-white/10 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {active ? (isArabic ? active.nameAr : active.nameEn) : ''}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {active ? (isArabic ? active.descAr : active.descEn) : ''}
            </DialogDescription>
          </DialogHeader>

          <Separator className="my-3" />

          <Tabs defaultValue={isArabic ? 'ar' : 'en'} className="w-full">
            <TabsList className="grid grid-cols-2 w-full rounded-xl">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>

            <TabsContent value="en" className="mt-4">
              {activeDetail && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{activeDetail.en.title}</h3>
                  <p className="text-sm text-muted-foreground">{activeDetail.en.blurb}</p>
                  <ul className="list-disc pl-5 space-y-2 text-sm">
                    {activeDetail.en.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                  <div className="text-xs text-primary/80">
                    <span className="font-medium">Refs:</span> {activeDetail.en.refs.join(' • ')}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="ar" className="mt-4">
              {activeDetail && (
                <div className="space-y-4 text-right">
                  <h3 className="text-lg font-semibold">{activeDetail.ar.title}</h3>
                  <p className="text-sm text-muted-foreground">{activeDetail.ar.blurb}</p>
                  <ul className="list-disc rtl:pl-0 rtl:pr-5 space-y-2 text-sm">
                    {activeDetail.ar.points.map((p, i) => (
                      <li key={i} className="rtl:list-[arabic] list-disc">{p}</li>
                    ))}
                  </ul>
                  <div className="text-xs text-primary/80">
                    <span className="font-medium">المراجع:</span> {activeDetail.ar.refs.join(' • ')}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => setOpen(false)} className="rounded-xl">
              {content.close}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HeavenLevels;
