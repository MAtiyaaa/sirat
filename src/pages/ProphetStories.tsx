import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import {
  Book,
  Heart,
  Users,
  Mountain,
  Ship,
  Star,
  Scroll,
  CloudRain,
  Wind,
  Zap,
  Flame,
  Baby,
  Crown,
  Fish,
  TreePine,
  Sun,
  Moon,
  ArrowLeft,
  Leaf,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Story {
  id: number;
  icon: any;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  storyAr: string;
  storyEn: string;
  birthAr: string;
  birthEn: string;
  deathAr: string;
  deathEn: string;
  ageAtDeathAr: string;
  ageAtDeathEn: string;
}

const ProphetStories = () => {
  const { settings } = useSettings();
  const [selectedStory, setSelectedStory] = React.useState<Story | null>(null);
  const navigate = useNavigate();
  const ar = settings.language === 'ar';

  const stories: Story[] = [
    {
      id: 1,
      icon: Users,
      nameAr: 'آدم عليه السلام',
      nameEn: 'Prophet Adam (AS)',
      descriptionAr: 'أبو البشر وأول الأنبياء، خُلق من تراب ونُفخ فيه من روح الله',
      descriptionEn: 'Father of mankind and first prophet; created from clay and given life by Allah',
      storyAr:
        'خلق الله آدم عليه السلام من تراب ثم نفخ فيه الروح، وعلّمه الأسماء كلها، وأمر الملائكة بالسجود له فسجدوا إلا إبليس استكبر وكان من الكافرين. أسكنه الله الجنة مع زوجه حواء، ونهاهما عن شجرة معينة فوسوس لهما الشيطان فأكلا منها، فأنزلهما الله إلى الأرض لحكمة بالغة، وتابا توبة نصوحاً فتاب الله عليهما. جعله الله خليفة في الأرض، فعبد ربّه وعلّم ذريته التوحيد والعبادة، وقيل: كان أول من أسس قواعد البيت الحرام. عاش حياة طويلة في طاعة الله ونصح بنيه، وتوفي بعد أن ترك إرث الإيمان والصلاح.',
      storyEn:
        'Allah created Adam (AS) from clay, breathed into him the spirit, taught him all the names, and commanded the angels to prostrate to him. They prostrated except Iblis who was arrogant and became a disbeliever. Allah placed Adam and his wife Hawwa in Paradise and forbade them one tree. Satan whispered and they ate, so they were sent down to earth by divine wisdom. They repented sincerely and Allah accepted their repentance. Adam became Allah’s vicegerent on earth, worshipped his Lord, taught his descendants tawhid and worship, and—according to reports—laid the foundations of the Sacred House. He lived long in obedience and counsel and passed away leaving the legacy of faith.',
      birthAr: 'خُلِق من تراب بأمر الله (ليس له تاريخ ميلاد بشري)',
      birthEn: 'Created from clay by Allah (no human birth date)',
      deathAr: 'توفي في الأرض بعد هبوطه من الجنة (التاريخ الدقيق غير معلوم)',
      deathEn: 'Died on earth after descent from Paradise (exact date unknown)',
      ageAtDeathAr: 'حوالي 960 سنة (ورد في بعض الروايات)',
      ageAtDeathEn: 'Around 960 years (mentioned in classical narrations)',
    },
    {
      id: 2,
      icon: Scroll,
      nameAr: 'شِيث عليه السلام',
      nameEn: 'Prophet Shith (AS)',
      descriptionAr: 'ابن آدم ووارث وصاياه، نبي بعده',
      descriptionEn: 'Son of Adam and inheritor of his guidance; a prophet after him',
      storyAr:
        'شِيث عليه السلام هو ابن آدم الذي آتاه الله الحكمة والعلم بعد أبيه، وقيل: أنزلت عليه صحف علم ووصايا، فقام على تعليم التوحيد والعبادة وعمارة الأرض بالحق. ثبت على نهج أبيه في محاربة الفساد وحفظ الدين، ونقل الهداية للأجيال من بعده. لم تُحفظ تفاصيل كثيرة عن حياته بدقة، لكن أهل العلم يذكرونه في سِلْسِلة الأنبياء الأوائل.',
      storyEn:
        'Shith (AS), son of Adam, was granted wisdom and knowledge after his father. Reports mention that scriptures/scrolls of guidance were given to him. He taught tawhid, upright worship, and maintained order upon truth, preserving the religion and passing guidance on to later generations. Details of his life are limited, but scholars mention him among the earliest prophets.',
      birthAr: 'غير معلوم يقيناً (الله أعلم)',
      birthEn: 'Unknown with certainty (Allah knows best)',
      deathAr: 'غير معلوم يقيناً (الله أعلم)',
      deathEn: 'Unknown with certainty (Allah knows best)',
      ageAtDeathAr: 'حوالي 912 سنة (تُنقل في بعض الآثار)',
      ageAtDeathEn: 'Approximately 912 years (reported in some traditions)',
    },
    {
      id: 3,
      icon: Star,
      nameAr: 'إدريس عليه السلام',
      nameEn: 'Prophet Idris (AS)',
      descriptionAr: 'نبيٌّ صِدِّيق رَفَعَهُ الله مكاناً عليّاً',
      descriptionEn: 'A truthful prophet whom Allah raised to a high station',
      storyAr:
        'إدريس عليه السلام من أوائل الأنبياء بعد آدم وشِيث، وصفه الله بأنه صِدِّيق نبي، وأنه رفعه مكاناً عليّاً. اشتهر بالعلم والصبر والعمل الصالح، وبتعليم الناس الصناعة والكتابة والخياطة، وأمرهم بطاعة الله واجتناب المعاصي. قصته في القرآن مجملة، وفي الأخبار أنه دعا قومه إلى عبادة الله وحده والثبات على التقوى.',
      storyEn:
        'Idris (AS) was among the earliest prophets after Adam and Shith. Allah describes him as truthful and a prophet, and that He raised him to a high station. He is associated with knowledge, patience, and righteous deeds, teaching people crafts and writing, and calling them to obey Allah and avoid sins. His story is concise in the Qur’an; reports indicate he called his people to steadfastness and piety.',
      birthAr: 'غير معلوم يقيناً',
      birthEn: 'Unknown with certainty',
      deathAr: 'غير معلوم يقيناً (ذكر رفعه في القرآن)',
      deathEn: 'Unknown with certainty (Qur’an mentions he was raised)',
      ageAtDeathAr: 'الله أعلم (اختلفت الروايات)',
      ageAtDeathEn: 'Allah knows best (reports differ)',
    },
    {
      id: 4,
      icon: Ship,
      nameAr: 'نوح عليه السلام',
      nameEn: 'Prophet Nuh (AS)',
      descriptionAr: 'شيخ المرسلين، دعا قومه قروناً وصنع السفينة',
      descriptionEn: 'Elder of the messengers; called his people for centuries and built the Ark',
      storyAr:
        'دعا نوح عليه السلام قومه ليلاً ونهاراً إلى إخلاص العبادة لله وترك الأصنام تسعمائة وخمسين سنة، فآمن معه قليل وكذّبه أكثرهم. أوحى الله إليه بصنع السفينة، فبناها على اليابسة وسخر منه قومه. لما جاء وعد الله فاضت العيون وانهمر المطر وطغى الماء، فحمل نوح من كل زوجين اثنين والمؤمنين معه، وأُغرق المكذّبون، حتى ابنه الذي آثر الكفر. استقرّت السفينة على الجودي، وكان ممن بقيت بهم الذرية.',
      storyEn:
        'Nuh (AS) called his people day and night to pure worship of Allah and abandonment of idols for 950 years. Few believed; most denied him. Allah inspired him to build the Ark on land while his people mocked. When the decree came, springs burst forth and rain poured down; he carried pairs of creatures and the believers, and the deniers—including his own son who refused faith—were drowned. The Ark settled on Mount Judi, and humanity continued from those saved.',
      birthAr: 'غير معلوم يقيناً',
      birthEn: 'Unknown with certainty',
      deathAr: 'غير معلوم يقيناً',
      deathEn: 'Unknown with certainty',
      ageAtDeathAr: 'أكثر من 950 سنة (مدة الدعوة وحدها) – الله أعلم بعمره كاملاً',
      ageAtDeathEn: 'More than 950 years (da’wah duration alone) – exact lifespan known only to Allah',
    },
    {
      id: 5,
      icon: Wind,
      nameAr: 'هود عليه السلام',
      nameEn: 'Prophet Hud (AS)',
      descriptionAr: 'نبي قوم عاد الذين أهلكهم الله بريح صرصر',
      descriptionEn: 'Prophet sent to the people of ‘Ad, destroyed by a violent wind',
      storyAr:
        'بُعث هود عليه السلام إلى عاد، قومٍ أشدّاء مغترّين بقوتهم، يدّعون منازل في الجبال ويبنون قصوراً ويتكبرون. دعاهم إلى توحيد الله وترك البغي، فكذبوه. توعّدهم الله، فأرسل عليهم ريحاً صرصراً عاتية سبع ليالٍ وثمانية أيام حسوماً، فقطعت دابرهم ونجّى الله هوداً ومن آمن معه.',
      storyEn:
        'Hud (AS) was sent to the people of ‘Ad, a powerful nation arrogant in their might. He called them to tawhid and to abandon transgression, but they denied him. Allah sent upon them a furious, bitter wind for seven nights and eight days, cutting them off entirely, while saving Hud and the believers.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'غير معلوم يقيناً',
      ageAtDeathEn: 'Unknown with certainty',
    },
    {
      id: 6,
      icon: Mountain,
      nameAr: 'صالح عليه السلام',
      nameEn: 'Prophet Salih (AS)',
      descriptionAr: 'نبي ثمود وآية الناقة، دعاهم إلى التوحيد',
      descriptionEn: 'Prophet sent to Thamud; the she-camel was a sign',
      storyAr:
        'أُرسل صالح عليه السلام إلى ثمود الذين نحتوا الجبال بيوتاً، فطلبوا آية، فأخرج الله لهم ناقة من الصخرة آية مبصرة، وأمرهم أن يكون لها شِربٌ معلوم وألا يمسوها بسوء. فعَقَروها بغياً، فأخذتهم الصيحة والرجفة فأصبحوا في ديارهم جاثمين، ونجّى الله صالحاً والذين آمنوا.',
      storyEn:
        'Salih (AS) was sent to Thamud, who carved homes in mountains. They demanded a sign; Allah brought forth a she-camel from rock as a clear sign and commanded that she have her share of water and be unharmed. They hamstrung her in defiance, so a blast and an earthquake seized them, leaving them lifeless in their dwellings, while Allah saved Salih and the believers.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'غير معلوم يقيناً',
      ageAtDeathEn: 'Unknown with certainty',
    },
    {
      id: 7,
      icon: Mountain,
      nameAr: 'إبراهيم عليه السلام',
      nameEn: 'Prophet Ibrahim (AS)',
      descriptionAr: 'خليل الرحمن وأبو الأنبياء، حطّم الأصنام وبنى الكعبة',
      descriptionEn: 'Friend of Allah and father of prophets; destroyer of idols, builder of the Kaaba',
      storyAr:
        'دعا إبراهيم قومه للتوحيد وناظرهم بالحجج، فكسر أصنامهم ليُبطل باطلهم، فألقوه في النار فجعلها الله عليه برداً وسلاماً. هاجر إلى الأرض المباركة، ورُزق بإسماعيل من هاجر وبإسحاق من سارة. أمره الله أن يرفع القواعد من البيت مع إسماعيل، وابتلاه برؤيا الذبح فاستسلم لأمر ربه ففداه الله بذبح عظيم. كان إماماً للحنفاء، وصبرت أسرته على الطاعة، فكانت قدوة للعالمين.',
      storyEn:
        'Ibrahim (AS) called his people to tawhid, argued with them using clear proofs, and shattered their idols to expose falsehood. They cast him into fire but Allah made it cool and safe. He migrated to the blessed land; Allah blessed him with Ismail from Hajar and Ishaq from Sarah. He raised the foundations of the Kaaba with Ismail, and when tested with the vision of sacrifice, he submitted and Allah ransomed his son with a great sacrifice. He was an imam for monotheists, and his family exemplified steadfast obedience.',
      birthAr: 'غير معلوم يقيناً (قبل موسى بقرون)',
      birthEn: 'Unknown with certainty (centuries before Musa)',
      deathAr: 'غير معلوم يقيناً',
      deathEn: 'Unknown with certainty',
      ageAtDeathAr: 'حوالي 175 سنة (تُنقل في بعض الروايات)',
      ageAtDeathEn: 'Around 175 years (reported in some narrations)',
    },
    {
      id: 8,
      icon: Flame,
      nameAr: 'لوط عليه السلام',
      nameEn: 'Prophet Lut (AS)',
      descriptionAr: 'نبي دعا قومه للفطرة فأنكروه فأُهلكوا',
      descriptionEn: 'Prophet who called his people back to natural morality; they were destroyed',
      storyAr:
        'أُرسل لوط عليه السلام إلى قومٍ فشا فيهم الفاحشة المنكرة، فدعاهم إلى العفاف وترك الخبائث، فكذبوه وهددوه وتطاولوا على ضيوفه. أتى أمر الله فقُلِبَت ديارهم وجُعل عاليها سافلها وأمطِروا حجارة من سجيل، ونجّى الله لوطاً وبناته إلا امرأته كانت من الغابرين.',
      storyEn:
        'Lut (AS) called his people to abandon their heinous immorality and return to chastity. They denied him, threatened him, and transgressed against his guests. Allah’s decree came: their towns were overturned and rained upon with stones of baked clay. Allah saved Lut and his daughters, except his wife who was among those who perished.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'غير معلوم',
      ageAtDeathEn: 'Unknown',
    },
    {
      id: 9,
      icon: Baby,
      nameAr: 'إسماعيل عليه السلام',
      nameEn: 'Prophet Ismail (AS)',
      descriptionAr: 'الذبيح وباني الكعبة مع أبيه، صادق الوعد',
      descriptionEn: 'The one offered in sacrifice; co-builder of the Kaaba; true to his promise',
      storyAr:
        'تركه أبوه إبراهيم بأمر الله في وادٍ غير ذي زرع مع أمه هاجر، فانفجر زمزم تحت قدمه رحمة من الله. شبّ على التوحيد والصدق وصبر على البلاء، وشارك أباه في رفع قواعد البيت، وامتثل لأمر الله في قصة الذبح. كان داعيةً في العرب وبِذُرّيته جاء خاتم النبيين محمد صلى الله عليه وسلم.',
      storyEn:
        'By Allah’s command, Ibrahim left Ismail with his mother Hajar in a barren valley; Zamzam sprang by Allah’s mercy. He grew upon tawhid, truthfulness, and patience, helped raise the Kaaba’s foundations, and submitted in the test of sacrifice. He called his people and from his progeny came the Final Prophet, Muhammad (ﷺ).',
      birthAr: 'غير معلوم يقيناً',
      birthEn: 'Unknown with certainty',
      deathAr: 'غير معلوم يقيناً',
      deathEn: 'Unknown with certainty',
      ageAtDeathAr: 'حوالي 137 سنة (نُقل في بعض الأخبار)',
      ageAtDeathEn: 'Approximately 137 years (reported in some narrations)',
    },
    {
      id: 10,
      icon: Sun,
      nameAr: 'إسحاق عليه السلام',
      nameEn: 'Prophet Ishaq (AS)',
      descriptionAr: 'ابن إبراهيم من سارة، نبيّ كريم ومن المهاجرين',
      descriptionEn: 'Son of Ibrahim from Sarah; a noble prophet and emigrant',
      storyAr:
        'بشّر الله إبراهيم وسارة بإسحاق بعد كِبَر، وجعله نبياً، ومن نسله يعقوب والسبط. دعا إلى عبادة الله، وثبت على ملة أبيه إبراهيم في التوحيد والطهارة. كان من سلالة مباركة امتد منها أنبياء كثيرون.',
      storyEn:
        'Allah gave Ibrahim and Sarah glad tidings of Ishaq in their old age and made him a prophet. From his lineage came Yaqub and many of the Children of Israel. He upheld his father’s monotheistic creed and purity, calling to worship of Allah alone.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'حوالي 180 سنة (تُنقل بعض الأخبار)',
      ageAtDeathEn: 'Approximately 180 years (reported in some traditions)',
    },
    {
      id: 11,
      icon: Book,
      nameAr: 'يعقوب عليه السلام',
      nameEn: 'Prophet Yaqub (AS)',
      descriptionAr: 'إسرائيل، أبو الأسباط، مثال الصبر والحكمة',
      descriptionEn: 'Israel; father of the tribes; exemplar of patience and wisdom',
      storyAr:
        'يعقوب عليه السلام ابن إسحاق، اصطفاه الله، ورُزق بيوسف وإخوته. ابتُلي بفقد يوسف فصبَر جميلاً وتوجّه إلى الله بالرجاء حتى جمع الله شمله به. أوصى أبناءه قبل موته بالتوحيد والثبات على ملة إبراهيم وإسحاق.',
      storyEn:
        'Yaqub (AS), son of Ishaq, was chosen by Allah and blessed with Yusuf and his brothers. He was tested by the loss of Yusuf and responded with beautiful patience, hoping in Allah until they were reunited. Before his death, he counseled his children to remain firm upon the creed of Ibrahim and Ishaq.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'حوالي 147 سنة (تُنقل بعض الروايات)',
      ageAtDeathEn: 'Approximately 147 years (reported in some narrations)',
    },
    {
      id: 12,
      icon: Moon,
      nameAr: 'يوسف عليه السلام',
      nameEn: 'Prophet Yusuf (AS)',
      descriptionAr: 'الصديق الكريم، صاحب الرؤيا والتأويل',
      descriptionEn: 'The noble truthful one; gifted with dreams and interpretation',
      storyAr:
        'رأى يوسف رؤيا السجود فحسده إخوته فألقوه في الجبّ فالتقطه بعض السيارة وبِيع في مصر. ابتُلِيَ بفتنة النساء فاستعصم وصبر فكان السجن أحبّ إليه مما يدعون. برز في السجن بتعبير الرؤى، ثم خرج وولاّه الملك خزائن الأرض، فجاءه إخوته في المجاعة فعفا وصفح، وجمع الله شمله بأبيه يعقوب وتحققت رؤياه.',
      storyEn:
        'Yusuf (AS) saw a vision of celestial bodies prostrating to him. His brothers envied him and cast him into a well; he was taken to Egypt and sold. Tested by the seduction of women, he chose patience and prison over sin. He became known for interpreting dreams, was released, entrusted with the storehouses, and when famine struck, his brothers came seeking provision. He forgave them, was reunited with his father, and his vision was fulfilled.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'حوالي 110 سنوات (تُنقل بعض الأخبار)',
      ageAtDeathEn: 'Approximately 110 years (reported in some narrations)',
    },
    {
      id: 13,
      icon: TreePine,
      nameAr: 'شعيب عليه السلام',
      nameEn: "Prophet Shu'ayb (AS)",
      descriptionAr: 'نبي مدين وأصحاب الأيكة، دعا للعدل وترك التطفيف',
      descriptionEn: 'Prophet to Midian and the People of the Thicket; called to justice and fair measure',
      storyAr:
        'بعث الله شعيباً إلى مدين وأصحاب الأيكة يحذّرهم من بخس الميزان والتلاعب بأموال الناس، ويأمرهم بعبادة الله وحده. كذبوه واستهزؤوا، فأخذتهم الرجفة والصيحة وعذاب يوم الظلة، ونجّى الله شعيباً والذين آمنوا معه.',
      storyEn:
        'Allah sent Shu’ayb (AS) to Midian and the People of the Thicket, warning them against fraud and injustice, and calling them to worship Allah alone. They denied and mocked him; then a quake, a cry, and the punishment of the covering cloud seized them, while Allah saved Shu’ayb and the believers.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'غير معلوم',
      ageAtDeathEn: 'Unknown',
    },
    {
      id: 14,
      icon: Heart,
      nameAr: 'أيوب عليه السلام',
      nameEn: 'Prophet Ayyub (AS)',
      descriptionAr: 'ضرب الله به مثلاً في الصبر على البلاء',
      descriptionEn: 'An example of patience and endurance in trials',
      storyAr:
        'كان أيوب عليه السلام ذا مال وولد وصحة، فابتلاه ربه في جسده وماله وأهله سنين طويلة، فلم يجزع ولم يشتكُ إلا إلى الله، بل قال: "أني مسّني الضر وأنت أرحم الراحمين". فأمره الله أن يركض برجله فانفجر ماء فاغتسل وشرب فذهب عنه الضر، ورد الله عليه أهله ومثلهم معهم. فكان نبراساً للصابرين.',
      storyEn:
        'Ayyub (AS) had wealth, children, and health. Allah tested him severely in body, wealth, and family for many years. He did not despair nor complain except to Allah, saying, “Indeed, adversity has touched me, and You are the Most Merciful.” Allah commanded him to strike the ground; water gushed forth—he bathed and drank, his health was restored, and Allah returned his family and doubled them. He became a beacon of patience.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'غير معلوم',
      ageAtDeathEn: 'Unknown',
    },
    {
      id: 15,
      icon: Zap,
      nameAr: 'ذو الكفل عليه السلام',
      nameEn: 'Dhul-Kifl (AS)',
      descriptionAr: 'نبي أو عبد صالح، عُرف بالثبات والقيام بالعهود',
      descriptionEn: 'A prophet or righteous servant known for steadfastness and fulfilling covenants',
      storyAr:
        'ذكره الله مع الصابرين، واختلف هل هو نبي أم عبد صالح، والمشهور عند كثير من أهل العلم أنه نبي. اشتهر بقيامه بالعهود وتحمله للأمانات وصبره على الأذى، فكان مثالاً للثبات على الطاعة.',
      storyEn:
        'Mentioned by Allah among the patient; scholars differ whether he was a prophet or a righteous man—many hold he was a prophet. He is known for fulfilling covenants, bearing responsibilities, and enduring with patience—an emblem of steadfast obedience.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'غير معلوم',
      ageAtDeathEn: 'Unknown',
    },
    {
      id: 16,
      icon: Scroll,
      nameAr: 'موسى عليه السلام',
      nameEn: 'Prophet Musa (AS)',
      descriptionAr: 'كليم الله، صاحب الآيات والتوراة، قائد بني إسرائيل',
      descriptionEn: 'Spoke to Allah; bearer of clear signs and the Torah; leader of the Children of Israel',
      storyAr:
        'ولد موسى في زمن طاغية يقتل الذكور، فأوحى الله إلى أمه أن تقذفه في اليم فالتقطه آلُ الطاغية وربّته زوجته على عفة وطهر. كلّمه الله من جانب الطور وأرسله بمعجزات: العصا واليد والسنين والدم والطوفان والجراد والقمل والضفادع، فاستكبر الطاغية حتى أغرقه الله، وشقّ لموسى البحر فنجا المؤمنون. أنزل الله عليه التوراة، وسار بقومه، فابتُلوا بالعجل والتيه، وصابر موسى وعلّمهم.',
      storyEn:
        'Musa (AS) was born under a tyrant who killed newborn males. Allah inspired his mother to cast him into the river; he was taken in and raised in the tyrant’s household. Allah spoke to him at Mount Sinai and sent him with signs—the staff, the shining hand, years of hardship, blood, flood, locusts, lice, frogs—yet the tyrant remained arrogant and was drowned, while the sea was parted for the believers. The Torah was revealed to Musa; he led his people who were tried with the calf and the wilderness, and he taught them steadfastly.',
      birthAr: 'غير معلوم يقيناً',
      birthEn: 'Unknown with certainty',
      deathAr: 'توفي قبل دخول الأرض المقدسة (التاريخ غير معلوم يقيناً)',
      deathEn: 'Died before entry into the Holy Land (exact date unknown)',
      ageAtDeathAr: 'حوالي 120 سنة (تُنقل روايات)',
      ageAtDeathEn: 'Approximately 120 years (reported in narrations)',
    },
    {
      id: 17,
      icon: Leaf,
      nameAr: 'هارون عليه السلام',
      nameEn: 'Prophet Harun (AS)',
      descriptionAr: 'أخ موسى ووزيره، نبيٌّ صدّيق بليغ',
      descriptionEn: 'Brother and minister of Musa; a truthful and eloquent prophet',
      storyAr:
        'جعل الله هارون وزيراً لموسى يشدّ عضده، وكان أفصح لساناً. شارك في دعوة فرعون وقومه وصبر مع موسى على أذى بني إسرائيل وفتنة العجل، وكان مثالاً للصدق واللين مع الثبات.',
      storyEn:
        'Allah appointed Harun (AS) as a minister to Musa to strengthen him; he was more eloquent in speech. He joined in calling Pharaoh’s people, endured the trials of the calf with Musa, and exemplified truthfulness, gentleness, and firmness.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'حوالي 123 سنة (تُنقل روايات)',
      ageAtDeathEn: 'Approximately 123 years (reported in narrations)',
    },
    {
      id: 18,
      icon: Book,
      nameAr: 'داود عليه السلام',
      nameEn: 'Prophet Dawud (AS)',
      descriptionAr: 'ملك نبي، أوتي الزبور وصوتاً حسناً وأُلين له الحديد',
      descriptionEn: 'Prophet-king; given the Psalms, a beautiful voice, and softened iron',
      storyAr:
        'كان داود راعياً ثم آتاه الله مُلكاً ونبوة بعد أن قتل جالوت بإذن الله. أوتي الزبور وصوتاً يسبّح به الجبال والطير، وألان الله له الحديد فصنع الدروع. ضرب مثلاً في العدل والإنابة وكثرة العبادة.',
      storyEn:
        'Dawud (AS) moved from shepherding to kingship and prophethood after slaying Goliath by Allah’s leave. He was given the Psalms and a voice with which mountains and birds glorified Allah, and iron was softened for him to fashion armor. He is a model of justice, repentance, and abundant worship.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'حوالي 100 سنة (تُنقل روايات)',
      ageAtDeathEn: 'Approximately 100 years (reported in narrations)',
    },
    {
      id: 19,
      icon: Crown,
      nameAr: 'سليمان عليه السلام',
      nameEn: 'Prophet Sulaiman (AS)',
      descriptionAr: 'النبي الملك، سُخّرت له الجنّ والريح وفهم منطق الطير',
      descriptionEn: 'Prophet-king; the jinn and the wind were subjected to him; understood the speech of birds',
      storyAr:
        'ورث من أبيه داود النبوة والملك، وشكر نعمة الله وسأله مُلكاً لا ينبغي لأحد من بعده، فاستجاب له ربه. بنى بيت المقدس، وساس ملكه بالعدل والحكمة، وجادله الهدهد في خبر سبأ فدعا ملكتها إلى الإسلام فأسلمت لله رب العالمين.',
      storyEn:
        'He inherited prophethood and kingship from his father Dawud, thanked Allah, and asked for a unique dominion—Allah granted it. He built Al-Aqsa, ruled with justice and wisdom, received news from the hoopoe of Sheba, and invited its queen to Islam; she submitted to Allah.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'حوالي 52 سنة (تُنقل روايات)',
      ageAtDeathEn: 'Approximately 52 years (reported in narrations)',
    },
    {
      id: 20,
      icon: Sun,
      nameAr: 'إلياس عليه السلام',
      nameEn: 'Prophet Ilyas (AS)',
      descriptionAr: 'نبي دعا قومه لترك عبادة بعل والثبات على التوحيد',
      descriptionEn: 'Prophet who called his people to abandon Baal and hold to tawhid',
      storyAr:
        'أرسل إلى قوم يعبدون بعل، فدعاهم إلى عبادة الله وحده وذكّرهم بنعم الله، فكذّبه معظمهم. قصته موجزة في القرآن، والعبرة فيها الثبات على التوحيد وإن قلّ الناصر.',
      storyEn:
        'Sent to a people worshipping Baal, he called them to worship Allah alone and reminded them of His favors. The Qur’an narrates his story briefly; its lesson is steadfast monotheism even when supporters are few.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'غير معلوم',
      ageAtDeathEn: 'Unknown',
    },
    {
      id: 21,
      icon: CloudRain,
      nameAr: 'اليسع عليه السلام',
      nameEn: 'Prophet Al-Yasa’ (AS)',
      descriptionAr: 'نبي من أنبياء بني إسرائيل بعد إلياس',
      descriptionEn: 'Prophet among the Children of Israel after Ilyas',
      storyAr:
        'ذكره الله في عداد المصطفين الأخيار. تابع مسيرة الدعوة بعد إلياس، وأُوتي من الآيات ما يؤيد به دعوته. قصته موجزة ولكنها شاهدة على استمرار النبوة في بني إسرائيل.',
      storyEn:
        'Mentioned by Allah among the elect. He continued the mission after Ilyas and was supported by signs. His concise story attests to the continuity of prophethood among the Children of Israel.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'غير معلوم',
      ageAtDeathEn: 'Unknown',
    },
    {
      id: 22,
      icon: Fish,
      nameAr: 'يونس عليه السلام',
      nameEn: 'Prophet Yunus (AS)',
      descriptionAr: 'صاحب الحوت، نادى بالتوحيد فعاد تائباً',
      descriptionEn: 'Companion of the whale; called to tawhid and returned repentant',
      storyAr:
        'دعا قومه فلم يؤمنوا، فخرج مغاضباً قبل إذن ربه، فكان من المسبّحين في بطن الحوت وقال: "لا إله إلا أنت سبحانك إني كنت من الظالمين" فنجّاه الله وطرحه بالساحل، ثم عاد إلى قومه فآمنوا فمتعهم الله إلى حين.',
      storyEn:
        'He called his people who initially rejected him; he departed in anger before leave was granted. In the belly of the whale he glorified Allah: “There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers,” and Allah saved him, cast him ashore, and he returned—his people then believed and were granted respite.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم',
      deathEn: 'Unknown',
      ageAtDeathAr: 'غير معلوم',
      ageAtDeathEn: 'Unknown',
    },
    {
      id: 23,
      icon: TreePine,
      nameAr: 'زكريا عليه السلام',
      nameEn: 'Prophet Zakariya (AS)',
      descriptionAr: 'نبيٌّ صالح دعا ربّه بالولد فبُشِّر بيحيى',
      descriptionEn: 'Righteous prophet who prayed for a child and received glad tidings of Yahya',
      storyAr:
        'كان زكريا كبير السن وزوجه عاقراً، فدعا ربّه دعاءً خاشعاً طالباً الذرية الطيبة، فاستجاب الله وبشّره بيحيى، وجعل آيته ألا يكلّم الناس ثلاثة أيام إلا رمزاً. كان قائماً على كفالة مريم ويشهد كراماتها، وثبت على الدعوة والعبادة.',
      storyEn:
        'Zakariya (AS), elderly and with a barren wife, supplicated humbly for righteous offspring. Allah answered with glad tidings of Yahya and made his sign that he would not speak to people for three days except by gesture. He cared for Maryam and witnessed her miracles, remaining firm in devotion and calling.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'غير معلوم (ذُكرت روايات في استشهاده)',
      deathEn: 'Unknown (reports mention martyrdom)',
      ageAtDeathAr: 'غير معلوم',
      ageAtDeathEn: 'Unknown',
    },
    {
      id: 24,
      icon: Leaf,
      nameAr: 'يحيى عليه السلام',
      nameEn: 'Prophet Yahya (AS)',
      descriptionAr: 'سيدٌ وحصور ونبي من الصالحين، بُشِّر به زكريا',
      descriptionEn: 'Noble, chaste, and a prophet among the righteous; granted to Zakariya',
      storyAr:
        'آتاه الله الحكم صبياً، وكان تقياً زاهداً عفيفاً يأمر بالمعروف وينهى عن المنكر. ابتُلي بالظالمين حتى استُشهد، فكان مثال الطهر والثبات على الحق منذ صغره.',
      storyEn:
        'Granted wisdom in youth, Yahya (AS) was devout, chaste, and ascetic, commanding good and forbidding evil. He was tried by tyrants and martyred, remaining pure and steadfast upon truth from a young age.',
      birthAr: 'غير معلوم',
      birthEn: 'Unknown',
      deathAr: 'استُشهد على يد ظالم (التاريخ غير معلوم)',
      deathEn: 'Martyred by a tyrant (exact date unknown)',
      ageAtDeathAr: 'حوالي 30-35 سنة (تقديري)',
      ageAtDeathEn: 'Approximately 30–35 years (estimate)',
    },
    {
      id: 25,
      icon: Star,
      nameAr: 'عيسى عليه السلام',
      nameEn: 'Prophet Isa (AS)',
      descriptionAr: 'المسيح ابن مريم، كلمة الله وروح منه، آتاه الله المعجزات',
      descriptionEn:
        'The Messiah, son of Mary; a word from Allah and a spirit from Him; granted miracles',
      storyAr:
        'وُلد عيسى من مريم البتول بلا أب آيةً من الله، وتكلم في المهد مدافعاً عن طهارة أمه، وأُوتي من المعجزات إحياء الموتى وشفاء الأكمه والأبرص بإذن الله، وأنزل الله عليه الإنجيل. تآمر الكافرون على قتله، فرفعه الله إليه وطُبِّه لهم الشبه على غيره، وسيعود في آخر الزمان حكماً عدلاً متّبعاً لشريعة محمد صلى الله عليه وسلم.',
      storyEn:
        'Isa (AS) was born to the virgin Maryam without a father as a sign from Allah. He spoke in the cradle, defended his mother’s honor, and was granted miracles—reviving the dead and healing the blind and leper by Allah’s permission. Allah revealed the Gospel to him. The disbelievers plotted, but Allah raised him and his likeness was cast on another. He will descend near the end of time as a just ruler, following the law of Muhammad (ﷺ).',
      birthAr: 'ولد من غير أب بمعجزة من الله (التاريخ غير معلوم)',
      birthEn: 'Born miraculously without a father (exact date unknown)',
      deathAr: 'لم يمت، بل رُفع إلى السماء (وسيموت بعد نزوله آخر الزمان)',
      deathEn: 'He did not die; he was raised to the heavens (he will die after his descent at the end of times)',
      ageAtDeathAr: 'لم يمت بعد (الله أعلم)',
      ageAtDeathEn: 'Has not died yet (Allah knows best)',
    },
    {
      id: 26,
      icon: Moon,
      nameAr: 'محمد صلى الله عليه وسلم',
      nameEn: 'Prophet Muhammad (ﷺ)',
      descriptionAr: 'خاتم الأنبياء والمرسلين، أرسل رحمة للعالمين',
      descriptionEn: 'The final prophet and messenger; sent as a mercy to the worlds',
      storyAr:
        'ولد في عام الفيل بمكة، واشتهر بالصادق الأمين. نزل عليه جبريل بالوحي في غار حراء وهو ابن أربعين، فدعا إلى التوحيد وصبر على أذى قريش، وهاجر إلى المدينة فأقام دولة الإسلام. نصره الله ببدر والخندق وفتح مكة، وأكمل الله به الدين وأنزل القرآن معجزة خالدة. كان أعظم الناس خُلُقاً وعبادة وقيادة، وتوفي بعد أن بلّغ الرسالة وأدى الأمانة.',
      storyEn:
        'Born in the Year of the Elephant in Makkah, known as Al-Sadiq Al-Amin. Revelation descended via Jibril in Cave Hira at age forty. He called to tawhid, bore persecution, migrated to Madinah, and established the Islamic state. Allah granted victories—Badr, the Trench, the conquest of Makkah—and completed the religion through him. The Qur’an was revealed as an everlasting miracle. He was the best in character, worship, and leadership, and he passed away after conveying the message.',
      birthAr: 'عام الفيل (حوالي 570م)',
      birthEn: 'Year of the Elephant (c. 570 CE)',
      deathAr: '11 هـ / 632م في المدينة المنورة',
      deathEn: '11 AH / 632 CE in Madinah',
      ageAtDeathAr: '63 سنة',
      ageAtDeathEn: '63 years',
    },
  ];

  if (selectedStory) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedStory(null)}
          className="fixed top-6 left-6 z-50 rounded-full w-10 h-10"
          aria-label={ar ? 'رجوع' : 'Back'}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="text-center space-y-4 pt-8">
          {React.createElement(selectedStory.icon, {
            className: 'h-16 w-16 mx-auto text-primary mb-4',
          })}
          <h1 className="text-4xl md:text-5xl font-bold">
            {ar ? selectedStory.nameAr : selectedStory.nameEn}
          </h1>
          <p className="text-muted-foreground text-lg">
            {ar ? selectedStory.descriptionAr : selectedStory.descriptionEn}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-effect rounded-2xl p-4 border border-border/30 backdrop-blur-xl">
            <div className="text-xs uppercase text-muted-foreground">
              {ar ? 'الميلاد' : 'Birth'}
            </div>
            <div className="text-sm mt-1">
              {ar ? selectedStory.birthAr : selectedStory.birthEn}
            </div>
          </div>
          <div className="glass-effect rounded-2xl p-4 border border-border/30 backdrop-blur-xl">
            <div className="text-xs uppercase text-muted-foreground">
              {ar ? 'الوفاة' : 'Death'}
            </div>
            <div className="text-sm mt-1">
              {ar ? selectedStory.deathAr : selectedStory.deathEn}
            </div>
          </div>
          <div className="glass-effect rounded-2xl p-4 border border-border/30 backdrop-blur-xl">
            <div className="text-xs uppercase text-muted-foreground">
              {ar ? 'العمر عند الوفاة' : 'Age at Death'}
            </div>
            <div className="text-sm mt-1">
              {ar ? selectedStory.ageAtDeathAr : selectedStory.ageAtDeathEn}
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-8 border border-border/30 backdrop-blur-xl">
          <p className={`text-lg leading-relaxed ${ar ? 'text-right' : ''}`}>
            {ar ? selectedStory.storyAr : selectedStory.storyEn}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10"
        aria-label={ar ? 'رجوع' : 'Back'}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="text-center space-y-4 pt-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {ar ? 'قصص الأنبياء' : 'Prophet Stories'}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          {ar
            ? 'تعلم من قصص الرسل والأنبياء عليهم السلام'
            : 'Learn from the stories of the Prophets and Messengers'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {stories.map((story) => {
          const Icon = story.icon;
          return (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story)}
              className="glass-effect rounded-3xl p-6 border border-border/30 hover:border-primary/40 backdrop-blur-xl smooth-transition group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 smooth-transition">
                  <Icon className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary smooth-transition">
                    {ar ? story.nameAr : story.nameEn}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ar ? story.descriptionAr : story.descriptionEn}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ProphetStories;
