import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Globe, Map, Navigation, Flag, Landmark, Compass } from "lucide-react";

type TConquest = {
  icon: any;
  nameAr: string;
  nameEn: string;
  periodAr: string;
  periodEn: string;
  regionAr: string;
  regionEn: string;
  descAr: string;
  descEn: string;
  leadersAr: string[];
  leadersEn: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
};

const IslamicConquests = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const conquests: TConquest[] = [
    {
      icon: Map,
      nameAr: "فتح شبه الجزيرة العربية",
      nameEn: "Conquest of Arabian Peninsula",
      periodAr: "1-11هـ / 622-632م",
      periodEn: "1-11 AH / 622-632 CE",
      regionAr: "الجزيرة العربية",
      regionEn: "Arabian Peninsula",
      descAr: "بدأت مع الهجرة إلى المدينة وتأسيس الدولة الإسلامية. فتح مكة سنة 8هـ كان نقطة التحول الكبرى، ثم دخلت القبائل في دين الله أفواجاً. بحلول وفاة النبي ﷺ كانت الجزيرة كلها تحت راية الإسلام، وتوحدت القبائل لأول مرة في التاريخ.",
      descEn: "Began with Hijra to Madinah and establishment of Islamic state. Conquest of Makkah in 8 AH was major turning point, then tribes entered Islam in multitudes. By Prophet's ﷺ death, entire peninsula was under Islamic banner, uniting tribes for first time in history.",
      leadersAr: ["النبي محمد ﷺ", "خالد بن الوليد", "علي بن أبي طالب"],
      leadersEn: ["Prophet Muhammad ﷺ", "Khalid ibn al-Walid", "Ali ibn Abi Talib"],
      gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Globe,
      nameAr: "فتح بلاد الشام",
      nameEn: "Conquest of Levant (al-Sham)",
      periodAr: "13-20هـ / 634-641م",
      periodEn: "13-20 AH / 634-641 CE",
      regionAr: "سوريا، فلسطين، الأردن، لبنان",
      regionEn: "Syria, Palestine, Jordan, Lebanon",
      descAr: "بدأت في عهد أبي بكر واكتملت في عهد عمر. معركة اليرموك (636م) كانت المعركة الفاصلة التي أنهت الحكم البيزنطي. فُتحت دمشق وحمص وحماة وحلب ثم القدس سلماً سنة 15هـ. عاملت الدولة الإسلامية أهل الذمة بالعدل والإحسان.",
      descEn: "Began under Abu Bakr, completed under Umar. Battle of Yarmouk (636 CE) was decisive, ending Byzantine rule. Damascus, Homs, Hama, Aleppo conquered, then Jerusalem peacefully in 15 AH. Islamic state treated dhimmis with justice and kindness.",
      leadersAr: ["أبو عبيدة بن الجراح", "خالد بن الوليد", "عمرو بن العاص", "شرحبيل بن حسنة"],
      leadersEn: ["Abu Ubayda ibn al-Jarrah", "Khalid ibn al-Walid", "Amr ibn al-As", "Shurahbil ibn Hasana"],
      gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Flag,
      nameAr: "فتح العراق وفارس",
      nameEn: "Conquest of Iraq & Persia",
      periodAr: "12-31هـ / 633-651م",
      periodEn: "12-31 AH / 633-651 CE",
      regionAr: "العراق، إيران، أفغانستان",
      regionEn: "Iraq, Iran, Afghanistan",
      descAr: "بدأت بمعركة ذات السلاسل، ثم القادسية (636م) التي حطمت الجيش الفارسي. فُتحت المدائن عاصمة الساسانيين، ثم نهاوند (642م) \"فتح الفتوح\" التي أنهت الإمبراطورية الساسانية نهائياً. انتشر الإسلام في خراسان وما وراء النهر.",
      descEn: "Began with Battle of Chains, then al-Qadisiyyah (636 CE) which shattered Persian army. Ctesiphon, Sassanid capital, fell, then Nahavand (642 CE) \"victory of victories\" ended Sassanid Empire permanently. Islam spread throughout Khurasan and Transoxiana.",
      leadersAr: ["خالد بن الوليد", "سعد بن أبي وقاص", "المثنى بن حارثة", "النعمان بن مقرن"],
      leadersEn: ["Khalid ibn al-Walid", "Sa'd ibn Abi Waqqas", "al-Muthanna ibn Haritha", "al-Nu'man ibn Muqarrin"],
      gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Landmark,
      nameAr: "فتح مصر وشمال أفريقيا",
      nameEn: "Conquest of Egypt & North Africa",
      periodAr: "18-90هـ / 639-709م",
      periodEn: "18-90 AH / 639-709 CE",
      regionAr: "مصر، ليبيا، تونس، الجزائر، المغرب",
      regionEn: "Egypt, Libya, Tunisia, Algeria, Morocco",
      descAr: "فُتحت مصر بقيادة عمرو بن العاص (640-642م) وأُسست الفسطاط. ثم تقدم المسلمون غرباً إلى برقة وطرابلس. عقبة بن نافع فتح إفريقية وأسس القيروان (670م)، وصل إلى المحيط الأطلسي. موسى بن نصير وطارق بن زياد أكملا فتح المغرب.",
      descEn: "Egypt conquered under Amr ibn al-As (640-642 CE) and Fustat founded. Muslims advanced west to Cyrenaica and Tripoli. Uqba ibn Nafi conquered Ifriqiya, founded Kairouan (670 CE), reached Atlantic Ocean. Musa ibn Nusayr and Tariq ibn Ziyad completed conquest of Maghreb.",
      leadersAr: ["عمرو بن العاص", "عقبة بن نافع", "موسى بن نصير", "حسان بن النعمان"],
      leadersEn: ["Amr ibn al-As", "Uqba ibn Nafi", "Musa ibn Nusayr", "Hassan ibn al-Nu'man"],
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Compass,
      nameAr: "فتح الأندلس (إسبانيا والبرتغال)",
      nameEn: "Conquest of al-Andalus (Spain & Portugal)",
      periodAr: "92-95هـ / 711-714م",
      periodEn: "92-95 AH / 711-714 CE",
      regionAr: "شبه الجزيرة الإيبيرية",
      regionEn: "Iberian Peninsula",
      descAr: "عبر طارق بن زياد المضيق بسبعة آلاف مقاتل، وهزم القوط في معركة وادي لكة (711م). أحرق السفن خلفه قائلاً: \"العدو أمامكم والبحر وراءكم\". فُتحت قرطبة وطليطلة وإشبيلية. ظل المسلمون في الأندلس 800 سنة، وأسسوا حضارة راقية.",
      descEn: "Tariq ibn Ziyad crossed strait with seven thousand fighters, defeated Visigoths at Battle of Guadalete (711 CE). Burned ships behind him saying: \"Enemy before you, sea behind you.\" Córdoba, Toledo, Seville conquered. Muslims remained in Andalus 800 years, established advanced civilization.",
      leadersAr: ["طارق بن زياد", "موسى بن نصير", "عبد العزيز بن موسى"],
      leadersEn: ["Tariq ibn Ziyad", "Musa ibn Nusayr", "Abd al-Aziz ibn Musa"],
      gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: Navigation,
      nameAr: "فتح السند والهند",
      nameEn: "Conquest of Sindh & India",
      periodAr: "89-96هـ / 708-715م",
      periodEn: "89-96 AH / 708-715 CE",
      regionAr: "باكستان، شمال الهند",
      regionEn: "Pakistan, Northern India",
      descAr: "بدأ محمد بن القاسم الثقفي فتح السند بسبعة عشر عاماً، فتح الديبل ثم المولتان. نشر العدل والإحسان، فدخل الناس في الإسلام طوعاً. أسس قاعدة لانتشار الإسلام في شبه القارة الهندية. لاحقاً أسس الغزنويون والمغول والدلهي سلطنات إسلامية.",
      descEn: "Muhammad ibn al-Qasim al-Thaqafi began conquering Sindh at seventeen years old, conquered Debal then Multan. Spread justice and kindness; people entered Islam voluntarily. Established base for Islam's spread in Indian subcontinent. Later Ghaznavids, Mughals and Delhi established Islamic sultanates.",
      leadersAr: ["محمد بن القاسم الثقفي", "الحجاج بن يوسف (الوالي)"],
      leadersEn: ["Muhammad ibn al-Qasim", "al-Hajjaj ibn Yusuf (Governor)"],
      gradient: "from-green-500/20 via-emerald-400/20 to-teal-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Map,
      nameAr: "فتح آسيا الوسطى (ما وراء النهر)",
      nameEn: "Conquest of Central Asia (Transoxiana)",
      periodAr: "86-96هـ / 705-715م",
      periodEn: "86-96 AH / 705-715 CE",
      regionAr: "أوزبكستان، كازاخستان، تركمانستان",
      regionEn: "Uzbekistan, Kazakhstan, Turkmenistan",
      descAr: "فتح قتيبة بن مسلم الباهلي بخارى وسمرقند وخوارزم وفرغانة. واجه مقاومة شرسة من الترك والصينيين، لكنه ثبت ونشر الإسلام. أسس حضارة إسلامية عظيمة أنجبت علماء كالبخاري والترمذي والخوارزمي. صارت المنطقة قلعة للإسلام.",
      descEn: "Qutayba ibn Muslim al-Bahili conquered Bukhara, Samarkand, Khwarezm and Fergana. Faced fierce resistance from Turks and Chinese but persevered and spread Islam. Established great Islamic civilization that produced scholars like al-Bukhari, al-Tirmidhi and al-Khwarizmi. Region became fortress of Islam.",
      leadersAr: ["قتيبة بن مسلم الباهلي", "نصر بن سيار"],
      leadersEn: ["Qutayba ibn Muslim", "Nasr ibn Sayyar"],
      gradient: "from-cyan-500/20 via-sky-400/20 to-blue-500/20",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-600 dark:text-cyan-400",
    },
    {
      icon: Globe,
      nameAr: "فتح الأناضول وأرمينيا",
      nameEn: "Conquest of Anatolia & Armenia",
      periodAr: "18-25هـ / 639-646م",
      periodEn: "18-25 AH / 639-646 CE",
      regionAr: "تركيا، أرمينيا، أذربيجان",
      regionEn: "Turkey, Armenia, Azerbaijan",
      descAr: "فُتحت أرمينيا وأذربيجان في عهد عمر وعثمان رضي الله عنهما. توغل المسلمون في الأناضول، لكن البيزنطيين حافظوا على القسطنطينية. استمرت الحروب قروناً حتى فتح العثمانيون القسطنطينية (1453م). صارت المنطقة جسراً بين العالم الإسلامي وأوروبا.",
      descEn: "Armenia and Azerbaijan conquered under Umar and Uthman. Muslims penetrated Anatolia but Byzantines held Constantinople. Wars continued centuries until Ottomans conquered Constantinople (1453 CE). Region became bridge between Islamic world and Europe.",
      leadersAr: ["عياض بن غنم", "حبيب بن مسلمة", "سلمان بن ربيعة"],
      leadersEn: ["Iyad ibn Ghanm", "Habib ibn Maslama", "Salman ibn Rabi'a"],
      gradient: "from-violet-500/20 via-purple-400/20 to-indigo-500/20",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0 glass-effect hover:glass-effect-hover"
            aria-label={back}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
            {ar ? "الفتوحات الإسلامية" : "Islamic Conquests"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "انتشار الإسلام من الأندلس إلى الهند خلال قرن واحد من الزمان"
            : "Spread of Islam from Andalusia to India within one century"}
        </p>

        <div className="grid gap-4">
          {conquests.map((conquest, i) => {
            const Icon = conquest.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${conquest.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                />
                <Card className="relative glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${conquest.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                      <Icon className={`h-6 w-6 ${conquest.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {ar ? conquest.nameAr : conquest.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {ar ? conquest.periodAr : conquest.periodEn} • {ar ? conquest.regionAr : conquest.regionEn}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ar ? conquest.descAr : conquest.descEn}
                      </p>

                      <div className="rounded-lg bg-background/60 border border-border/40 p-3">
                        <div className="text-foreground/80 font-medium mb-2 text-sm">
                          {ar ? "القادة الرئيسيون" : "Key Leaders"}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(ar ? conquest.leadersAr : conquest.leadersEn).map((leader, idx) => (
                            <span key={idx} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {leader}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IslamicConquests;