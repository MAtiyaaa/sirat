import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Swords, Shield, Users, Flame, Mountain, Flag } from "lucide-react";

type TBattle = {
  icon: any;
  nameAr: string;
  nameEn: string;
  yearAr: string;
  yearEn: string;
  locationAr: string;
  locationEn: string;
  descAr: string;
  descEn: string;
  resultAr: string;
  resultEn: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
};

const IslamicBattles = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const battles: TBattle[] = [
    {
      icon: Swords,
      nameAr: "غزوة بدر الكبرى",
      nameEn: "Battle of Badr",
      yearAr: "17 رمضان 2هـ / 13 مارس 624م",
      yearEn: "17 Ramadan 2 AH / 13 March 624 CE",
      locationAr: "بدر، الحجاز",
      locationEn: "Badr, Hejaz",
      descAr: "أول معركة فاصلة بين المسلمين (313 مقاتل) وقريش (1000 مقاتل). قال الله تعالى: {وَلَقَدْ نَصَرَكُمُ اللَّهُ بِبَدْرٍ وَأَنتُمْ أَذِلَّةٌ}. قُتل من صناديد قريش سبعون وأُسر سبعون، ولم يُقتل من المسلمين إلا أربعة عشر. كانت نقطة تحول في تثبيت الدولة الإسلامية.",
      descEn: "First decisive battle between Muslims (313 fighters) and Quraysh (1,000 fighters). Allah said: {And already had Allah given you victory at Badr while you were few}. Seventy Quraysh leaders were killed and seventy captured, while only fourteen Muslims were martyred. Turning point in establishing the Islamic state.",
      resultAr: "نصر حاسم للمسلمين، تثبيت السلطة في المدينة",
      resultEn: "Decisive Muslim victory, authority established in Madinah",
      gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Mountain,
      nameAr: "غزوة أحد",
      nameEn: "Battle of Uhud",
      yearAr: "شوال 3هـ / مارس 625م",
      yearEn: "Shawwal 3 AH / March 625 CE",
      locationAr: "جبل أُحد، المدينة",
      locationEn: "Mount Uhud, Madinah",
      descAr: "خرجت قريش للثأر من هزيمتها في بدر بثلاثة آلاف مقاتل. انتصر المسلمون في بداية المعركة، لكن عصيان بعض الرماة لأمر النبي ﷺ بترك مواقعهم أدى إلى انقلاب الموقف. استُشهد سبعون من الصحابة منهم حمزة بن عبد المطلب رضي الله عنه. كانت درساً في الطاعة والثبات.",
      descEn: "Quraysh came seeking revenge for Badr with three thousand fighters. Muslims were winning initially, but disobedience of some archers who left their positions caused a reversal. Seventy companions were martyred including Hamza ibn Abd al-Muttalib. A lesson in obedience and steadfastness.",
      resultAr: "درس في الطاعة، ثبات المسلمين رغم الخسارة",
      resultEn: "Lesson in obedience, Muslim resilience despite setback",
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Shield,
      nameAr: "غزوة الخندق (الأحزاب)",
      nameEn: "Battle of the Trench (Ahzab)",
      yearAr: "شوال 5هـ / مارس 627م",
      yearEn: "Shawwal 5 AH / March 627 CE",
      locationAr: "المدينة المنورة",
      locationEn: "Madinah",
      descAr: "حاصر الأحزاب (قريش وغطفان وحلفاؤهم) المدينة بعشرة آلاف مقاتل. بمشورة سلمان الفارسي رضي الله عنه، حفر المسلمون خندقاً حول المدينة أربك الأعداء. استمر الحصار قرابة شهر، ثم أرسل الله ريحاً وجنوداً لم يروها ففشل الحصار وانسحب الأحزاب. قال تعالى: {وَرَدَّ اللَّهُ الَّذِينَ كَفَرُوا بِغَيْظِهِمْ لَمْ يَنَالُوا خَيْرًا}.",
      descEn: "The Confederates (Quraysh, Ghatafan and allies) besieged Madinah with ten thousand fighters. Following Salman al-Farsi's advice, Muslims dug a trench that confused the enemy. After a month-long siege, Allah sent a wind and unseen soldiers, causing the siege to fail. Allah said: {And Allah repelled those who disbelieved in their rage, not having obtained any good}.",
      resultAr: "فشل الحصار، نهاية تهديد قريش العسكري",
      resultEn: "Siege failed, end of Quraysh military threat",
      gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Flag,
      nameAr: "صلح الحديبية",
      nameEn: "Treaty of Hudaybiyyah",
      yearAr: "ذو القعدة 6هـ / مارس 628م",
      yearEn: "Dhu al-Qi'dah 6 AH / March 628 CE",
      locationAr: "الحديبية، قرب مكة",
      locationEn: "Hudaybiyyah, near Makkah",
      descAr: "خرج النبي ﷺ مع 1400 صحابي للعمرة، فصدّتهم قريش. تم توقيع معاهدة صلح لمدة عشر سنين. رغم أن بنودها بدت في ظاهرها صعبة على المسلمين، إلا أنها كانت فتحاً مبيناً كما سماها الله، إذ أتاحت للإسلام الانتشار بسلام ودخل الناس في دين الله أفواجاً. بعد سنتين فُتحت مكة.",
      descEn: "The Prophet ﷺ went with 1,400 companions for Umrah but Quraysh blocked them. A ten-year peace treaty was signed. Though terms seemed difficult for Muslims outwardly, Allah called it a clear victory, as it allowed Islam to spread peacefully and people entered Allah's religion in multitudes. Two years later, Makkah was conquered.",
      resultAr: "فتح مبين، انتشار الإسلام بالدعوة السلمية",
      resultEn: "Clear victory, spread of Islam through peaceful dawah",
      gradient: "from-green-500/20 via-emerald-400/20 to-teal-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Swords,
      nameAr: "فتح مكة",
      nameEn: "Conquest of Makkah",
      yearAr: "20 رمضان 8هـ / 11 يناير 630م",
      yearEn: "20 Ramadan 8 AH / 11 January 630 CE",
      locationAr: "مكة المكرمة",
      locationEn: "Makkah",
      descAr: "نقضت قريش صلح الحديبية، فسار النبي ﷺ بعشرة آلاف مقاتل لفتح مكة. دخلها سلماً وأماناً، وقف على باب الكعبة وقال: \"اذهبوا فأنتم الطلقاء\"، وعفا عن أهلها. حطّم الأصنام حول الكعبة وقرأ: {وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ}. دخل الناس في دين الله أفواجاً بعد الفتح.",
      descEn: "Quraysh broke the Hudaybiyyah treaty, so the Prophet ﷺ marched with ten thousand fighters to conquer Makkah. He entered peacefully and safely, stood at the Kaaba door and said: \"Go, you are free.\" He forgave its people. He destroyed idols around the Kaaba and recited: {Say: Truth has come and falsehood has perished}. People entered Allah's religion in multitudes after the conquest.",
      resultAr: "فتح مكة سلماً، نهاية الوثنية في الجزيرة",
      resultEn: "Peaceful conquest of Makkah, end of paganism in Arabia",
      gradient: "from-yellow-500/20 via-amber-400/20 to-orange-500/20",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: Flame,
      nameAr: "معركة اليرموك",
      nameEn: "Battle of Yarmouk",
      yearAr: "15 رجب 15هـ / 20 أغسطس 636م",
      yearEn: "15 Rajab 15 AH / 20 August 636 CE",
      locationAr: "وادي اليرموك، الشام",
      locationEn: "Yarmouk Valley, Levant",
      descAr: "معركة فاصلة بين المسلمين (40,000 مقاتل بقيادة خالد بن الوليد) والبيزنطيين (240,000 مقاتل). استمرت ستة أيام، وانتصر المسلمون رغم قلة عددهم. كانت من أعظم المعارك في التاريخ، أدت إلى فتح الشام بأكملها وإنهاء الحكم البيزنطي فيها.",
      descEn: "Decisive battle between Muslims (40,000 fighters led by Khalid ibn al-Walid) and Byzantines (240,000 fighters). Lasted six days; Muslims won despite being outnumbered. One of history's greatest battles, led to the conquest of all of Levant and ended Byzantine rule there.",
      resultAr: "نصر ساحق، فتح الشام، انهيار القوة البيزنطية",
      resultEn: "Crushing victory, conquest of Levant, collapse of Byzantine power",
      gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: Users,
      nameAr: "معركة القادسية",
      nameEn: "Battle of al-Qadisiyyah",
      yearAr: "15 شعبان 15هـ / نوفمبر 636م",
      yearEn: "15 Sha'ban 15 AH / November 636 CE",
      locationAr: "القادسية، العراق",
      locationEn: "Al-Qadisiyyah, Iraq",
      descAr: "معركة حاسمة بين المسلمين بقيادة سعد بن أبي وقاص (30,000 مقاتل) والفرس بقيادة رستم (120,000 مقاتل). استمرت أربعة أيام شديدة، انتهت بهزيمة ساحقة للفرس ومقتل رستم. فتحت الطريق لفتح العراق وفارس بأكملها وإنهاء الإمبراطورية الساسانية.",
      descEn: "Decisive battle between Muslims led by Sa'd ibn Abi Waqqas (30,000 fighters) and Persians led by Rostam (120,000 fighters). Lasted four intense days, ended with crushing defeat of Persians and death of Rostam. Opened the way to conquer all of Iraq and Persia, ending the Sassanid Empire.",
      resultAr: "نصر حاسم، فتح العراق وفارس، سقوط الساسانيين",
      resultEn: "Decisive victory, conquest of Iraq and Persia, fall of Sassanids",
      gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Shield,
      nameAr: "معركة نهاوند",
      nameEn: "Battle of Nahavand",
      yearAr: "21هـ / 642م",
      yearEn: "21 AH / 642 CE",
      locationAr: "نهاوند، فارس",
      locationEn: "Nahavand, Persia",
      descAr: "آخر معركة كبرى ضد الساسانيين، سُميت \"فتح الفتوح\". قاد المسلمون النعمان بن مقرن، وجمع الفرس جيشاً ضخماً لاستعادة ملكهم. انتصر المسلمون انتصاراً ساحقاً وقُتل يزدجرد الثالث لاحقاً. بعدها لم تقم للفرس قائمة، وانتشر الإسلام في خراسان وما وراء النهر.",
      descEn: "Last major battle against Sassanids, called \"Victory of victories.\" Muslims were led by al-Nu'man ibn Muqarrin; Persians gathered a huge army to reclaim their kingdom. Muslims won decisively and Yazdegerd III was later killed. After this, Persia never rose again militarily; Islam spread throughout Khurasan and Transoxiana.",
      resultAr: "فتح الفتوح، نهاية الإمبراطورية الساسانية",
      resultEn: "Victory of victories, end of Sassanid Empire",
      gradient: "from-indigo-500/20 via-purple-400/20 to-violet-500/20",
      iconBg: "bg-indigo-500/10",
      iconColor: "text-indigo-600 dark:text-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
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
            {ar ? "المعارك الإسلامية الكبرى" : "Major Islamic Battles"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "معارك فاصلة غيّرت مجرى التاريخ وأسست لانتشار الإسلام في العالم"
            : "Decisive battles that changed history and established the spread of Islam"}
        </p>

        <div className="grid gap-4">
          {battles.map((battle, i) => {
            const Icon = battle.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${battle.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                />
                <Card className="relative glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${battle.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                      <Icon className={`h-6 w-6 ${battle.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {ar ? battle.nameAr : battle.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {ar ? battle.yearAr : battle.yearEn} • {ar ? battle.locationAr : battle.locationEn}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ar ? battle.descAr : battle.descEn}
                      </p>

                      <div className="rounded-lg bg-background/60 border border-border/40 p-3">
                        <div className="text-foreground/80 font-medium mb-1 text-sm">
                          {ar ? "النتيجة" : "Result"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ar ? battle.resultAr : battle.resultEn}
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

export default IslamicBattles;