import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Star,
  BookOpen,
  FlaskConical,
  Telescope,
  Microscope,
  Globe,
  Map,
  Compass,
  Ship,
  Landmark,
  Building2,
  ScrollText,
  Feather,
  Palette,
  Music,
  PenTool,
  Coins,
  Scale,
  Network,
  GraduationCap,
  Hammer,
  Wrench,
  Hourglass,
  Layers,
  Sigma,
  Binary,
  Shield,
} from "lucide-react";

type TItem = {
  icon: any;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  badgeAr: string;
  badgeEn: string;
  gradient?: string;
};

const GoldenAgeOfIslam = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const items: TItem[] = [
    {
      icon: Star,
      titleAr: "التمهيد والزمن",
      titleEn: "Scope & Timeline",
      descAr:
        "من القرن 2هـ/8م حتى 8هـ/14م تقريبًا؛ مراكز كبرى: بغداد، سمرقند، بخارى، دمشق، القاهرة، قرطبة، طليطلة.",
      descEn:
        "Roughly 8th–14th c.; major hubs included Baghdad, Samarkand, Bukhara, Damascus, Cairo, Córdoba, and Toledo.",
      badgeAr: "إطار",
      badgeEn: "Frame",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: BookOpen,
      titleAr: "بيت الحكمة وحركة الترجمة",
      titleEn: "Bayt al-Hikma & Translation",
      descAr:
        "ترجمة التراث اليوناني والفارسي والهندي وفهرسته؛ نشوء جيل من المترجمين والعلماء المبدعين.",
      descEn:
        "Greek, Persian, and Indian corpora translated and cataloged; a new cadre of translators-scholars emerged.",
      badgeAr: "معرفة",
      badgeEn: "Knowledge",
      gradient: "from-emerald-500/10 via-teal-400/10 to-cyan-500/10",
    },
    {
      icon: Sigma,
      titleAr: "الجبـر",
      titleEn: "Algebra",
      descAr:
        "تقعيد حل المعادلات وصياغة الجبر كحقل مستقل؛ تطبيقات في المواريث والحساب التجاري.",
      descEn:
        "Formalized equation solving and algebra as a field; applied to inheritance law and commerce.",
      badgeAr: "رياضيات",
      badgeEn: "Mathematics",
      gradient: "from-indigo-500/10 via-purple-400/10 to-fuchsia-500/10",
    },
    {
      icon: Layers,
      titleAr: "الحساب والهندسة",
      titleEn: "Arithmetic & Geometry",
      descAr:
        "الأرقام الهندية العربية، الكسور العشرية، الهندسة العملية للمساحة والبناء والقباب.",
      descEn:
        "Indo-Arabic numerals, decimal fractions, and practical geometry for surveying, vaults, and domes.",
      badgeAr: "رياضيات",
      badgeEn: "Mathematics",
      gradient: "from-blue-500/10 via-sky-400/10 to-cyan-500/10",
    },
    {
      icon: Binary,
      titleAr: "المثلثات",
      titleEn: "Trigonometry",
      descAr:
        "جداول جيب/جيب تمام، صيغ قانون الجيب والظل، تطبيقات في علم القبلة والتوقيت.",
      descEn:
        "Sine/cosine tables and laws of sines/tangents; used for qibla finding and timekeeping.",
      badgeAr: "رياضيات",
      badgeEn: "Mathematics",
      gradient: "from-teal-500/10 via-emerald-400/10 to-lime-500/10",
    },
    {
      icon: Telescope,
      titleAr: "الفلك والرصد",
      titleEn: "Astronomy & Observatories",
      descAr:
        "مرصاد مرو وسمرقند وبغداد؛ جداول فلكية محسّنة، نماذج كونية دقيقة لأجرام السماء.",
      descEn:
        "Observatories in Maragha, Samarkand, Baghdad; refined astronomical tables and planetary models.",
      badgeAr: "فلك",
      badgeEn: "Astronomy",
      gradient: "from-cyan-500/10 via-sky-400/10 to-blue-500/10",
    },
    {
      icon: Microscope,
      titleAr: "الطب السريري",
      titleEn: "Clinical Medicine",
      descAr:
        "موسوعات طبية، تفريق الأمراض، تعليم سريري في البيمارستانات، أخلاقيات ممارسة الطب.",
      descEn:
        "Medical encyclopedias, differential diagnosis, hospital-based teaching, and medical ethics.",
      badgeAr: "طب",
      badgeEn: "Medicine",
      gradient: "from-rose-500/10 via-red-400/10 to-orange-500/10",
    },
    {
      icon: FlaskConical,
      titleAr: "الصيدلة والكيمياء",
      titleEn: "Pharmacy & Chemistry",
      descAr:
        "تركيب الأدوية والمراهم، تقطير وتبلور، مختبرات مبكرة وطرائق تجريبية.",
      descEn:
        "Compounding remedies and unguents; distillation and crystallization; proto-laboratories and empirical methods.",
      badgeAr: "علوم",
      badgeEn: "Sciences",
      gradient: "from-green-500/10 via-emerald-400/10 to-teal-500/10",
    },
    {
      icon: Building2,
      titleAr: "البيمارستانات",
      titleEn: "Hospitals (Bīmāristāns)",
      descAr:
        "مؤسسات علاج وتعليم وبحث؛ أجنحة تخصصية وسجلات مرضى وصيدليات مرافقة.",
      descEn:
        "Institutions for care, teaching, and research; specialized wards, patient records, and in-house pharmacies.",
      badgeAr: "طب/مؤسسات",
      badgeEn: "Medicine/Institutions",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Map,
      titleAr: "الجغرافيا والخرائط",
      titleEn: "Geography & Cartography",
      descAr:
        "أطالس ومسوح إقليمية، وصف طرق التجارة والرياح، خرائط نهرية وبحرية.",
      descEn:
        "Atlases and regional surveys; trade routes and wind patterns; riverine and nautical charts.",
      badgeAr: "جغرافيا",
      badgeEn: "Geography",
      gradient: "from-amber-500/10 via-yellow-400/10 to-lime-500/10",
    },
    {
      icon: Compass,
      titleAr: "الملاحة وتحديد القبلة",
      titleEn: "Navigation & Qibla Science",
      descAr:
        "إسطرلابات، أرباع، ساعات شمسية؛ طرائق لحساب القبلة والأوقات بدقة.",
      descEn:
        "Astrolabes, quadrants, sundials; precise methods to compute qibla and prayer times.",
      badgeAr: "ملاحة",
      badgeEn: "Navigation",
      gradient: "from-indigo-500/10 via-violet-400/10 to-fuchsia-500/10",
    },
    {
      icon: Ship,
      titleAr: "اقتصاد المحيط الهندي",
      titleEn: "Indian Ocean Economy",
      descAr:
        "شبكات تجارية من شرق أفريقيا إلى الصين؛ سلع: توابل، منسوجات، لؤلؤ، خزف.",
      descEn:
        "Trade webs from East Africa to China; staples: spices, textiles, pearls, ceramics.",
      badgeAr: "تجارة",
      badgeEn: "Trade",
      gradient: "from-teal-500/10 via-cyan-400/10 to-sky-500/10",
    },
    {
      icon: Coins,
      titleAr: "النقد والأسواق",
      titleEn: "Coinage & Markets",
      descAr:
        "سكّ موحّد، حسابات الدواوين، صيرفة وتبديل، عقود مضاربة وشركات.",
      descEn:
        "Standardized minting, state accounting, money-changing, and profit-sharing contracts (muḍāraba).",
      badgeAr: "اقتصاد",
      badgeEn: "Economy",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Network,
      titleAr: "شبكات العلم",
      titleEn: "Knowledge Networks",
      descAr:
        "رحلات طلب العلم، إسناد، إجازات؛ تواصل بين مدن العالم الإسلامي وما وراءه.",
      descEn:
        "Student travel, isnād chains, ijāzas; scholarly circuits across and beyond the Islamic world.",
      badgeAr: "تعليم",
      badgeEn: "Education",
      gradient: "from-sky-500/10 via-blue-400/10 to-indigo-500/10",
    },
    {
      icon: GraduationCap,
      titleAr: "المدارس والمكتبات",
      titleEn: "Madrasas & Libraries",
      descAr:
        "مناهج فقه وحديث ولغة وفلسفة؛ خزائن كتب ووقف معرفي مستدام.",
      descEn:
        "Curricula in law, hadith, language, philosophy; endowed libraries sustaining learning.",
      badgeAr: "مؤسسات",
      badgeEn: "Institutions",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: ScrollText,
      titleAr: "الفقه والحديث والكلام",
      titleEn: "Law, Hadith & Kalām",
      descAr:
        "تقعيد أصول الفقه، جمع الحديث ونقده، مناظرات عقلية في العقيدة.",
      descEn:
        "Usūl al-fiqh methodologies, hadith compilation and critique, rational debates in theology.",
      badgeAr: "علوم شرعية",
      badgeEn: "Religious Sciences",
      gradient: "from-purple-500/10 via-pink-400/10 to-rose-500/10",
    },
    {
      icon: Feather,
      titleAr: "الأدب والشعر",
      titleEn: "Literature & Poetry",
      descAr:
        "المقامات والرسائل والشعر العربي والفارسي؛ سرد تاريخي وتراجم وأسمار.",
      descEn:
        "Maqāmāt, epistles, Arabic and Persian verse; historiography, biographies, and adab prose.",
      badgeAr: "ثقافة",
      badgeEn: "Culture",
      gradient: "from-fuchsia-500/10 via-rose-400/10 to-pink-500/10",
    },
    {
      icon: Palette,
      titleAr: "الفنون والخط",
      titleEn: "Arts & Calligraphy",
      descAr:
        "خطوط كوفية ونسخ وثُلث؛ زخارف ومنمنمات ومدارس تذوق بصري.",
      descEn:
        "Kufic, Naskh, Thuluth scripts; ornament, miniatures, and distinct visual schools.",
      badgeAr: "فن",
      badgeEn: "Art",
      gradient: "from-blue-500/10 via-indigo-400/10 to-violet-500/10",
    },
    {
      icon: Landmark,
      titleAr: "العمارة والعمران",
      titleEn: "Architecture & Urbanism",
      descAr:
        "قباب وأقبية ومآذن وأسواق وخانات؛ تخطيط مديني ومياه وجسور.",
      descEn:
        "Domes, vaults, minarets; bazaars and caravanserais; urban planning, waterworks, and bridges.",
      badgeAr: "عمران",
      badgeEn: "Architecture",
      gradient: "from-green-500/10 via-emerald-400/10 to-teal-500/10",
    },
    {
      icon: Hammer,
      titleAr: "الهندسة والميكانيكا",
      titleEn: "Engineering & Mechanics",
      descAr:
        "سواقي وطواحين ومضخّات؛ أدوات قياس وموازين دقيقة وحيل هندسية.",
      descEn:
        "Waterwheels, mills, pumps; precision instruments, balances, and ingenious devices.",
      badgeAr: "تقنية",
      badgeEn: "Tech",
      gradient: "from-slate-500/10 via-gray-400/10 to-zinc-500/10",
    },
    {
      icon: Wrench,
      titleAr: "الساعات والآلات",
      titleEn: "Clocks & Automata",
      descAr:
        "ساعات مائية وميكانيكية ومجسّمات متحركة للعرض والتوقيت.",
      descEn:
        "Water and mechanical clocks, animated automata for spectacle and timekeeping.",
      badgeAr: "ابتكار",
      badgeEn: "Innovation",
      gradient: "from-amber-500/10 via-orange-400/10 to-yellow-500/10",
    },
    {
      icon: Music,
      titleAr: "الموسيقى والنظرية",
      titleEn: "Music & Theory",
      descAr:
        "مقامات ونغم، تدوين نظري وآلات، تفاعل فارسي-تركي-عربي-أندلسي.",
      descEn:
        "Maqām theory, instruments, and notation; Persian-Turkish-Arab-Andalusian synthesis.",
      badgeAr: "فن",
      badgeEn: "Art",
      gradient: "from-cyan-500/10 via-sky-400/10 to-blue-500/10",
    },
    {
      icon: PenTool,
      titleAr: "الوراقة وصناعة الكتاب",
      titleEn: "Paper & Book Culture",
      descAr:
        "انتشار الورق، نسخ وتذهيب وتجليد؛ أسواق كتب ونُسّاخ محترفون.",
      descEn:
        "Paper manufacture spread; copying, illumination, binding; bustling book markets and professional scribes.",
      badgeAr: "كتب",
      badgeEn: "Books",
      gradient: "from-yellow-500/10 via-amber-400/10 to-orange-500/10",
    },
    {
      icon: Globe,
      titleAr: "التداخل الحضاري",
      titleEn: "Cross-Civilizational Exchange",
      descAr:
        "تلاقح مع الهند وفارس وبيزنطة والصين؛ مسارات نقل إلى أوروبا عبر الأندلس وصقلية.",
      descEn:
        "Interchange with India, Persia, Byzantium, China; transmission to Europe via al-Andalus and Sicily.",
      badgeAr: "تبادل",
      badgeEn: "Exchange",
      gradient: "from-lime-500/10 via-green-400/10 to-emerald-500/10",
    },
    {
      icon: Scale,
      titleAr: "الأخلاقيات والوقف",
      titleEn: "Ethics & Waqf",
      descAr:
        "تمويل التعليم والصحة بالبِرّ والوقف؛ أعراف مهنية للممارسات العلمية.",
      descEn:
        "Waqf endowments funding schools and hospitals; professional ethics in scholarly practice.",
      badgeAr: "مجتمع",
      badgeEn: "Society",
      gradient: "from-violet-500/10 via-purple-400/10 to-pink-500/10",
    },
    {
      icon: Shield,
      titleAr: "الهوية والاستمرارية",
      titleEn: "Identity & Continuities",
      descAr:
        "حفظ التراث ونقله عبر الأجيال واللغات؛ تراكُم معرفي تتابع في العصور اللاحقة.",
      descEn:
        "Preservation and transmission across languages and generations; cumulative knowledge into later eras.",
      badgeAr: "إرث",
      badgeEn: "Legacy",
      gradient: "from-red-500/10 via-rose-400/10 to-orange-500/10",
    },
    {
      icon: Hourglass,
      titleAr: "نقاط التحوّل",
      titleEn: "Turning Points",
      descAr:
        "صدمات سياسية وغزوات وأوبئة؛ نزوح العلماء وإعادة تشكّل المراكز العلمية.",
      descEn:
        "Political shocks, invasions, and plagues; scholar migrations and reconfiguration of scholarly hubs.",
      badgeAr: "تحولات",
      badgeEn: "Transitions",
      gradient: "from-sky-500/10 via-cyan-400/10 to-blue-500/10",
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
            {ar ? "العصر الذهبي للإسلام" : "Golden Age of Islam"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "لوحة شاملة لأبرز ميادين النهضة العلمية والحضارية: الترجمة، الرياضيات، الفلك، الطب، الجغرافيا، التكنولوجيا، الفن، التعليم، والاقتصاد."
            : "A broad dashboard of the era’s scientific and civilizational brilliance: translation, math, astronomy, medicine, geography, technology, arts, education, and economy."}
        </p>

        <div className="grid gap-4">
          {items.map((t, i) => {
            const Icon = t.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    t.gradient ?? "from-amber-500/10 via-indigo-400/10 to-emerald-500/10"
                  } rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                />
                <Card className="relative glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-105 smooth-transition">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">
                          {ar ? t.titleAr : t.titleEn}
                        </h3>
                        <span className="text-xs rounded-full px-2 py-0.5 bg-primary/10 text-primary">
                          {ar ? t.badgeAr : t.badgeEn}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{ar ? t.descAr : t.descEn}</p>
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

export default GoldenAgeOfIslam;
