import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Scroll, Brain, Star, Globe, Heart } from "lucide-react";

type TScholar = {
  icon: any;
  nameAr: string;
  nameEn: string;
  yearsAr: string;
  yearsEn: string;
  fieldAr: string;
  fieldEn: string;
  descAr: string;
  descEn: string;
  contributionsAr: string[];
  contributionsEn: string[];
  gradient: string;
  iconBg: string;
  iconColor: string;
};

const IslamicScholars = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const scholars: TScholar[] = [
    {
      icon: BookOpen,
      nameAr: "الإمام أبو حنيفة النعمان",
      nameEn: "Imam Abu Hanifa",
      yearsAr: "80-150هـ / 699-767م",
      yearsEn: "80-150 AH / 699-767 CE",
      fieldAr: "الفقه والأصول",
      fieldEn: "Jurisprudence & Usul",
      descAr: "إمام المذهب الحنفي، أحد الأئمة الأربعة. اشتهر بالقياس والرأي والاستنباط الفقهي. تتلمذ على يديه آلاف من العلماء، ومنهم أبو يوسف ومحمد بن الحسن الشيباني. رفض منصب القضاء لئلا يضطر للحكم بغير ما يرى من الحق.",
      descEn: "Founder of Hanafi school, one of the four great imams. Known for analogical reasoning and juristic deduction. Thousands studied under him including Abu Yusuf and Muhammad al-Shaybani. Refused judgeship to avoid compromising his principles.",
      contributionsAr: [
        "تأسيس المذهب الحنفي المنتشر من تركيا إلى الهند",
        "تطوير علم الأصول والقياس والاستحسان",
        "كتاب الفقه الأكبر في العقيدة"
      ],
      contributionsEn: [
        "Founded Hanafi school spread from Turkey to India",
        "Developed usul al-fiqh, qiyas and istihsan",
        "Al-Fiqh al-Akbar in theology"
      ],
      gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Scroll,
      nameAr: "الإمام مالك بن أنس",
      nameEn: "Imam Malik ibn Anas",
      yearsAr: "93-179هـ / 711-795م",
      yearsEn: "93-179 AH / 711-795 CE",
      fieldAr: "الحديث والفقه",
      fieldEn: "Hadith & Jurisprudence",
      descAr: "إمام دار الهجرة وصاحب \"الموطأ\"، أصح كتاب بعد كتاب الله على قول الشافعي. أسس المذهب المالكي المنتشر في المغرب والأندلس وأفريقيا. اعتمد على عمل أهل المدينة والأحاديث النبوية. عُرف بورعه وتقواه وشدته في الحق.",
      descEn: "Imam of Madinah and author of \"al-Muwatta,\" the most authentic book after Quran according to al-Shafi'i. Founded Maliki school spread in Maghreb, Andalusia and Africa. Relied on practice of Madinah people and Prophet's hadith. Known for piety and firmness in truth.",
      contributionsAr: [
        "تأليف الموطأ، أول موسوعة حديثية فقهية",
        "تأسيس المذهب المالكي المنتشر في شمال أفريقيا",
        "الاعتماد على عمل أهل المدينة كأصل"
      ],
      contributionsEn: [
        "Authored al-Muwatta, first hadith-fiqh encyclopedia",
        "Founded Maliki school dominant in North Africa",
        "Established practice of Madinah people as source"
      ],
      gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Star,
      nameAr: "الإمام محمد بن إدريس الشافعي",
      nameEn: "Imam al-Shafi'i",
      yearsAr: "150-204هـ / 767-820م",
      yearsEn: "150-204 AH / 767-820 CE",
      fieldAr: "أصول الفقه والحديث",
      fieldEn: "Usul al-Fiqh & Hadith",
      descAr: "مؤسس علم أصول الفقه، صاحب المذهب الشافعي. جمع بين فقه الحجاز وفقه العراق. ألف \"الرسالة\" و\"الأم\". كان حافظاً للغة العربية، شاعراً فصيحاً، حجة في القراءات. قال عنه أحمد بن حنبل: \"ما أحد مسّ محبرة ولا قلماً إلا وللشافعي في عنقه منّة\".",
      descEn: "Founder of usul al-fiqh science and Shafi'i school. United Hejazi and Iraqi jurisprudence. Authored \"al-Risala\" and \"al-Umm\". Master of Arabic language, eloquent poet, authority in Quranic readings. Ahmad ibn Hanbal said: \"No one touched inkwell or pen except that al-Shafi'i has favor upon him.\"",
      contributionsAr: [
        "تأسيس علم أصول الفقه وكتابة الرسالة",
        "تأسيس المذهب الشافعي المنتشر في مصر وإندونيسيا",
        "الجمع بين مدرستي الرأي والحديث"
      ],
      contributionsEn: [
        "Founded usul al-fiqh and wrote al-Risala",
        "Founded Shafi'i school spread in Egypt and Indonesia",
        "United schools of opinion and hadith"
      ],
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Heart,
      nameAr: "الإمام أحمد بن حنبل",
      nameEn: "Imam Ahmad ibn Hanbal",
      yearsAr: "164-241هـ / 780-855م",
      yearsEn: "164-241 AH / 780-855 CE",
      fieldAr: "الحديث والفقه والعقيدة",
      fieldEn: "Hadith, Fiqh & Theology",
      descAr: "إمام أهل السنة، صاحب المسند الذي جمع فيه أكثر من 27,000 حديث. ثبت في محنة خلق القرآن وعُذّب ولم يتراجع عن الحق. قال الشافعي: \"خرجت من بغداد وما خلّفت فيها أتقى ولا أفقه من أحمد بن حنبل\". اتبعه مذهب أهل الحديث والأثر.",
      descEn: "Imam of Ahlus Sunnah, author of Musnad containing over 27,000 hadith. Remained firm during Mihna (ordeal of created Quran), was tortured but never recanted. Al-Shafi'i said: \"I left Baghdad having left none more pious or learned than Ahmad.\" His school follows hadith and narrations.",
      contributionsAr: [
        "تأليف المسند، أكبر موسوعة حديثية",
        "الثبات في محنة خلق القرآن",
        "تأسيس المذهب الحنبلي المنتشر في الجزيرة"
      ],
      contributionsEn: [
        "Authored Musnad, largest hadith encyclopedia",
        "Steadfastness during Mihna ordeal",
        "Founded Hanbali school in Arabian Peninsula"
      ],
      gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: BookOpen,
      nameAr: "الإمام البخاري",
      nameEn: "Imam al-Bukhari",
      yearsAr: "194-256هـ / 810-870م",
      yearsEn: "194-256 AH / 810-870 CE",
      fieldAr: "الحديث النبوي",
      fieldEn: "Prophetic Hadith",
      descAr: "صاحب أصح كتاب بعد كتاب الله \"الجامع الصحيح\". رحل في طلب الحديث إلى الشام والعراق ومصر والحجاز وخراسان، وجمع أكثر من 600,000 حديث اختار منها 7,275 حديثاً صحيحاً. حفظ القرآن وهو طفل، وكان حافظة زمانه. اشترط في صحيحه أعلى درجات الثقة والاتصال.",
      descEn: "Author of most authentic book after Quran: \"al-Jami' al-Sahih.\" Traveled for hadith to Levant, Iraq, Egypt, Hejaz and Khurasan, collected over 600,000 hadith and selected 7,275 authentic ones. Memorized Quran as child, was the memorizer of his age. Set highest standards of reliability and continuity in his Sahih.",
      contributionsAr: [
        "تأليف صحيح البخاري أصح كتاب بعد القرآن",
        "وضع معايير صارمة لقبول الحديث",
        "الرحلة في طلب العلم عبر العالم الإسلامي"
      ],
      contributionsEn: [
        "Authored Sahih al-Bukhari, most authentic after Quran",
        "Set rigorous standards for hadith acceptance",
        "Traveled across Islamic world seeking knowledge"
      ],
      gradient: "from-green-500/20 via-emerald-400/20 to-teal-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Scroll,
      nameAr: "الإمام مسلم بن الحجاج",
      nameEn: "Imam Muslim ibn al-Hajjaj",
      yearsAr: "204-261هـ / 821-875م",
      yearsEn: "204-261 AH / 821-875 CE",
      fieldAr: "الحديث النبوي",
      fieldEn: "Prophetic Hadith",
      descAr: "صاحب \"صحيح مسلم\"، ثاني أصح كتاب بعد صحيح البخاري. رتّب أحاديثه على الأبواب الفقهية، وجمع طرق الحديث في موضع واحد. كان تلميذاً للبخاري وتأثر به. اشتُهر بدقته في تمييز الرواة والطرق وحسن الترتيب والعرض.",
      descEn: "Author of \"Sahih Muslim,\" second most authentic after Sahih al-Bukhari. Organized hadith by juristic chapters and gathered all narration chains in one place. Was student of al-Bukhari and influenced by him. Known for precision in evaluating narrators, chains, and excellent organization.",
      contributionsAr: [
        "تأليف صحيح مسلم الذي يُقرن بصحيح البخاري",
        "جمع طرق الحديث الواحد في مكان واحد",
        "الدقة في تمييز درجات الصحة"
      ],
      contributionsEn: [
        "Authored Sahih Muslim paired with Sahih al-Bukhari",
        "Gathered all chains of single hadith in one place",
        "Precision in grading authenticity levels"
      ],
      gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Brain,
      nameAr: "الإمام أبو حامد الغزالي",
      nameEn: "Imam al-Ghazali",
      yearsAr: "450-505هـ / 1058-1111م",
      yearsEn: "450-505 AH / 1058-1111 CE",
      fieldAr: "الفقه والفلسفة والتصوف",
      fieldEn: "Fiqh, Philosophy & Sufism",
      descAr: "حجة الإسلام، صاحب \"إحياء علوم الدين\" و\"تهافت الفلاسفة\". جمع بين العلوم الشرعية والعقلية والروحية. ترك التدريس في نظامية بغداد ليعيش حياة الزهد والتعبد. ألف عشرات الكتب في الفقه والعقيدة والتصوف والفلسفة، وأثّر تأثيراً عميقاً في الفكر الإسلامي.",
      descEn: "Proof of Islam, author of \"Revival of Religious Sciences\" and \"Incoherence of Philosophers.\" United Islamic, rational and spiritual sciences. Left teaching at Nizamiyya Baghdad to live life of asceticism and worship. Authored dozens of books in fiqh, theology, Sufism and philosophy; profoundly influenced Islamic thought.",
      contributionsAr: [
        "تأليف إحياء علوم الدين في التزكية والأخلاق",
        "الرد على الفلاسفة وتوضيح حدود العقل",
        "الجمع بين الشريعة والحقيقة والأخلاق"
      ],
      contributionsEn: [
        "Authored Ihya Ulum al-Din on purification and ethics",
        "Refuted philosophers and clarified limits of reason",
        "United law, truth and morality"
      ],
      gradient: "from-violet-500/20 via-purple-400/20 to-indigo-500/20",
      iconBg: "bg-violet-500/10",
      iconColor: "text-violet-600 dark:text-violet-400",
    },
    {
      icon: Globe,
      nameAr: "ابن تيمية",
      nameEn: "Ibn Taymiyyah",
      yearsAr: "661-728هـ / 1263-1328م",
      yearsEn: "661-728 AH / 1263-1328 CE",
      fieldAr: "العقيدة والفقه والجهاد",
      fieldEn: "Theology, Fiqh & Jihad",
      descAr: "شيخ الإسلام، مجدد القرن السابع. حارب البدع والانحرافات العقدية، ودافع عن عقيدة السلف. ألف في كل فنون العلم، وأفتى في النوازل والمستجدات. قاتل التتار وسُجن مراراً لثباته على الحق. أثّر في الحركات الإصلاحية الإسلامية عبر العصور.",
      descEn: "Shaykh al-Islam, renewer of 7th century. Fought innovations and theological deviations, defended creed of predecessors. Authored in all sciences, issued rulings on contemporary issues. Fought Mongols and was imprisoned repeatedly for standing firm on truth. Influenced Islamic reform movements across ages.",
      contributionsAr: [
        "تجديد منهج السلف في العقيدة والفقه",
        "مجموع الفتاوى: 37 مجلداً في كل العلوم",
        "الدفاع عن الأمة ضد التتار والانحرافات"
      ],
      contributionsEn: [
        "Renewed Salafi methodology in theology and fiqh",
        "Majmu' al-Fatawa: 37 volumes in all sciences",
        "Defended ummah against Mongols and deviations"
      ],
      gradient: "from-cyan-500/20 via-sky-400/20 to-blue-500/20",
      iconBg: "bg-cyan-500/10",
      iconColor: "text-cyan-600 dark:text-cyan-400",
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
            {ar ? "العلماء والمفكرون" : "Scholars & Thinkers"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "أئمة الفقه والحديث والفلاسفة والعلماء الذين أثروا الحضارة الإسلامية"
            : "Imams of fiqh, hadith, philosophers and scholars who enriched Islamic civilization"}
        </p>

        <div className="grid gap-4">
          {scholars.map((scholar, i) => {
            const Icon = scholar.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${scholar.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                />
                <Card className="relative glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${scholar.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                      <Icon className={`h-6 w-6 ${scholar.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {ar ? scholar.nameAr : scholar.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {ar ? scholar.yearsAr : scholar.yearsEn} • {ar ? scholar.fieldAr : scholar.fieldEn}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ar ? scholar.descAr : scholar.descEn}
                      </p>

                      <div className="rounded-lg bg-background/60 border border-border/40 p-3">
                        <div className="text-foreground/80 font-medium mb-2 text-sm">
                          {ar ? "المساهمات الرئيسية" : "Key Contributions"}
                        </div>
                        <ul className="list-disc ms-5 text-sm text-muted-foreground space-y-1">
                          {(ar ? scholar.contributionsAr : scholar.contributionsEn).map((c, idx) => (
                            <li key={idx}>{c}</li>
                          ))}
                        </ul>
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

export default IslamicScholars;