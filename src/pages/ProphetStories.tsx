import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Book, Heart, Users, Mountain, Ship, Star, Scroll, CloudRain, Wind, Zap, Flame, Baby, Crown, Fish, TreePine, Sun, Moon } from 'lucide-react';

interface Story {
  id: number;
  icon: any;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  storyAr: string;
  storyEn: string;
}

const ProphetStories = () => {
  const { settings } = useSettings();
  const [selectedStory, setSelectedStory] = React.useState<Story | null>(null);

  const stories: Story[] = [
    {
      id: 1,
      icon: Users,
      nameAr: 'آدم عليه السلام',
      nameEn: 'Prophet Adam (AS)',
      descriptionAr: 'أبو البشر وأول الأنبياء',
      descriptionEn: 'Father of Mankind and First Prophet',
      storyAr: 'خلق الله آدم عليه السلام من تراب، ونفخ فيه من روحه، وعلمه الأسماء كلها، وأمر الملائكة بالسجود له فسجدوا إلا إبليس أبى واستكبر. أسكن الله آدم وزوجه حواء الجنة وأباح لهما كل شيء إلا شجرة واحدة. فوسوس لهما الشيطان حتى أكلا منها، فأنزلهما الله إلى الأرض. تاب آدم إلى الله فتاب الله عليه وجعله خليفة في الأرض، وعلمه كيف يعبد الله. عاش آدم حياته يعبد الله ويعلم ذريته التوحيد والطاعة. كان أول من بنى الكعبة المشرفة. توفي عليه السلام بعد حياة طويلة قضاها في عبادة الله وتعليم البشرية.',
      storyEn: 'Allah created Adam (AS) from clay, breathed His spirit into him, taught him all the names, and commanded the angels to prostrate to him. They all prostrated except Iblis who refused and was arrogant. Allah placed Adam and his wife Hawwa (Eve) in Paradise and allowed them everything except one tree. Satan whispered to them until they ate from it, so Allah sent them down to Earth. Adam repented to Allah, and Allah accepted his repentance and made him His vicegerent on Earth. He taught him how to worship Allah. Adam lived his life worshipping Allah and teaching his descendants monotheism and obedience. He was the first to build the sacred Kaaba. He passed away after a long life dedicated to worshipping Allah and guiding humanity.'
    },
    {
      id: 2,
      icon: Scroll,
      nameAr: 'إدريس عليه السلام',
      nameEn: 'Prophet Idris (AS)',
      descriptionAr: 'أول من خط بالقلم',
      descriptionEn: 'First to Write with the Pen',
      storyAr: 'إدريس عليه السلام من أوائل الأنبياء بعد آدم وشيث عليهما السلام. كان صديقاً نبياً، وهو أول من خط بالقلم وأول من خاط الثياب ولبسها. علم الناس الكتابة والحساب والفلك. دعا قومه إلى عبادة الله وحده ونبذ الشرك. كان عابداً زاهداً، يصوم النهار ويقوم الليل. رفعه الله إلى مكان عال كما ذكر في القرآن: "ورفعناه مكاناً علياً". عاش حياته داعياً إلى الله، محارباً للفساد والظلم. ترك إرثاً عظيماً من العلم والحكمة لمن بعده.',
      storyEn: 'Idris (AS) was among the earliest prophets after Adam and Seth. He was a truthful prophet, the first to write with a pen, and the first to sew and wear clothes. He taught people writing, mathematics, and astronomy. He called his people to worship Allah alone and reject polytheism. He was a devoted worshipper and ascetic who fasted by day and prayed by night. Allah raised him to a high station as mentioned in the Quran: "And We raised him to a high station." He lived his life calling to Allah, fighting corruption and injustice. He left a great legacy of knowledge and wisdom for those after him.'
    },
    {
      id: 3,
      icon: Ship,
      nameAr: 'نوح عليه السلام',
      nameEn: 'Prophet Nuh (AS)',
      descriptionAr: 'أبو البشر الثاني',
      descriptionEn: 'Second Father of Mankind',
      storyAr: 'بعث الله نوحاً عليه السلام إلى قومه الذين كانوا يعبدون الأصنام: وداً وسواعاً ويغوث ويعوق ونسراً. دعاهم إلى التوحيد ليلاً ونهاراً، سراً وجهاراً، لمدة 950 سنة. لم يؤمن معه إلا قليل، وآذاه قومه وسخروا منه. أمره الله ببناء السفينة فبناها، وكان قومه يسخرون منه وهو يبنيها. حمل فيها من كل زوجين اثنين ومن آمن معه. جاء أمر الله وفار التنور، فطغى الماء على كل شيء. غرق ابن نوح الكافر مع الكافرين، ونجى الله نوحاً ومن معه من المؤمنين. استوت السفينة على الجودي، وأمر الله الأرض أن تبلع ماءها والسماء أن تقلع. بارك الله في نوح وذريته وجعلهم أصل البشرية بعد الطوفان.',
      storyEn: 'Allah sent Nuh (AS) to his people who worshipped idols: Wadd, Suwa, Yaghuth, Yauq, and Nasr. He called them to monotheism night and day, secretly and openly, for 950 years. Only a few believed with him, and his people harmed and mocked him. Allah commanded him to build the ark, so he built it while his people ridiculed him. He carried in it a pair of every species and those who believed with him. Allah\'s command came and the oven overflowed, water covered everything. Nuh\'s disbelieving son drowned with the disbelievers, and Allah saved Nuh and the believers with him. The ark settled on Mount Judi, and Allah commanded the earth to swallow its water and the sky to withhold. Allah blessed Nuh and his descendants and made them the origin of humanity after the flood.'
    },
    {
      id: 4,
      icon: Wind,
      nameAr: 'هود عليه السلام',
      nameEn: 'Prophet Hud (AS)',
      descriptionAr: 'نبي قوم عاد',
      descriptionEn: 'Prophet to the People of Ad',
      storyAr: 'أرسل الله هوداً إلى قوم عاد الذين كانوا يسكنون الأحقاف في اليمن. كانوا أقوياء الأجسام، بنوا القصور العظيمة والحصون المنيعة، وكانوا يعبدون الأصنام. دعاهم هود إلى عبادة الله وحده وترك الأصنام، فسخروا منه واستكبروا. قالوا: من أشد منا قوة؟ أنسوا أن الله الذي خلقهم هو أشد منهم قوة. استمر هود في دعوتهم فأصروا على كفرهم. أرسل الله عليهم ريحاً صرصراً عاتية سبع ليال وثمانية أيام، فأهلكتهم وجعلتهم كأعجاز نخل خاوية. نجى الله هوداً ومن آمن معه. بقيت آثار قوم عاد عبرة للمعتبرين.',
      storyEn: 'Allah sent Hud (AS) to the people of Ad who lived in Al-Ahqaf in Yemen. They had strong bodies, built great palaces and fortified fortresses, and worshipped idols. Hud called them to worship Allah alone and abandon idols, but they mocked and were arrogant. They said: "Who is greater than us in strength?" They forgot that Allah who created them is mightier than them. Hud continued calling them but they insisted on their disbelief. Allah sent upon them a fierce wind for seven nights and eight days that destroyed them, making them like hollow palm trunks. Allah saved Hud and those who believed with him. The remains of the people of Ad remain as a lesson for those who take heed.'
    },
    {
      id: 5,
      icon: Mountain,
      nameAr: 'صالح عليه السلام',
      nameEn: 'Prophet Salih (AS)',
      descriptionAr: 'نبي قوم ثمود',
      descriptionEn: 'Prophet to the People of Thamud',
      storyAr: 'أرسل الله صالحاً إلى قوم ثمود الذين كانوا ينحتون من الجبال بيوتاً. كانوا أقوياء ماهرين في البناء، لكنهم كانوا يعبدون الأصنام. دعاهم صالح إلى التوحيد فطلبوا منه آية، فأخرج الله لهم ناقة عظيمة من الصخر كمعجزة. أمرهم الله ألا يمسوها بسوء ولها شرب ولهم شرب يوم معلوم. لكن القوم تآمروا وعقروا الناقة، فأنذرهم صالح بعذاب بعد ثلاثة أيام. جاءت الصيحة فأهلكتهم، وأخذتهم الرجفة فأصبحوا في دارهم جاثمين. نجى الله صالحاً والمؤمنين معه. بقيت مساكنهم المنحوتة في الحجر شاهدة على عاقبة الكافرين.',
      storyEn: 'Allah sent Salih (AS) to the people of Thamud who carved homes from mountains. They were strong and skilled in construction, but worshipped idols. Salih called them to monotheism, so they asked him for a sign. Allah brought forth a great she-camel from the rock as a miracle. Allah commanded them not to harm her, and she had her day to drink. But the people conspired and killed the camel. Salih warned them of punishment after three days. The mighty blast came and destroyed them, and the earthquake seized them, leaving them prostrate in their homes. Allah saved Salih and the believers with him. Their dwellings carved in stone remain as witnesses to the consequence of disbelievers.'
    },
    {
      id: 6,
      icon: Star,
      nameAr: 'إبراهيم عليه السلام',
      nameEn: 'Prophet Ibrahim (AS)',
      descriptionAr: 'خليل الله وأبو الأنبياء',
      descriptionEn: 'Friend of Allah and Father of Prophets',
      storyAr: 'إبراهيم عليه السلام خليل الرحمن وأبو الأنبياء. ولد في بابل زمن النمرود الطاغية. نشأ في قوم يعبدون الأصنام، حتى أبوه آزر كان نحاتاً للأصنام. لم يقبل إبراهيم عبادة الأصنام وبحث عن الحق، فهداه الله إلى التوحيد. حطم الأصنام في غياب قومه وترك الفأس في عنق كبيرهم. واجههم بالحجة والبرهان، فعجزوا عن الرد. أرادوا حرقه انتقاماً، فجمعوا حطباً عظيماً وألقوه في النار، فجعلها الله برداً وسلاماً عليه. هاجر إلى الشام ثم مصر ثم فلسطين. تزوج سارة وهاجر، ورزقه الله إسماعيل من هاجر وإسحاق من سارة. ابتلاه الله بأمر ذبح ابنه إسماعيل، فاستسلم لأمر الله، فلما همّ بالذبح فداه الله بذبح عظيم. بنى الكعبة مع ابنه إسماعيل ودعا للناس أن يحجوا إليها. كان قدوة في التوحيد والتوكل والصبر والإخلاص.',
      storyEn: 'Ibrahim (AS) is the Friend of Allah and Father of Prophets. He was born in Babylon during the time of Nimrod the tyrant. He grew up among people who worshipped idols; even his father Azar was a sculptor of idols. Ibrahim rejected idol worship and searched for truth, and Allah guided him to monotheism. He broke the idols in his people\'s absence and left the axe on the neck of the largest. He confronted them with logic and proof, and they were unable to respond. They wanted to burn him in revenge, so they gathered great firewood and threw him into the fire, but Allah made it cool and safe for him. He migrated to Syria, then Egypt, then Palestine. He married Sarah and Hajar, and Allah blessed him with Ismail from Hajar and Ishaq from Sarah. Allah tested him with the command to sacrifice his son Ismail, and he submitted to Allah\'s command. When he was about to slaughter, Allah ransomed him with a great sacrifice. He built the Kaaba with his son Ismail and called people to pilgrimage to it. He was an example in monotheism, trust, patience, and sincerity.'
    },
    {
      id: 7,
      icon: Flame,
      nameAr: 'لوط عليه السلام',
      nameEn: 'Prophet Lut (AS)',
      descriptionAr: 'نبي قوم سدوم',
      descriptionEn: 'Prophet to the People of Sodom',
      storyAr: 'لوط عليه السلام ابن أخي إبراهيم، أرسله الله إلى أهل سدوم وعمورة. كان قومه أول من أحدث الفاحشة الكبرى: إتيان الرجال شهوة من دون النساء، وقطع الطريق، والمنكرات في ناديهم. دعاهم لوط إلى ترك هذه الفواحش والرجوع إلى الفطرة السليمة، لكنهم أصروا على ضلالهم وهددوه بالإخراج. جاءت ملائكة العذاب في صورة شباب حسان لاختبار القوم. أراد قوم لوط الاعتداء على ضيوفه، فدافع عنهم وقال: "هؤلاء بناتي إن كنتم فاعلين". أخبرته الملائكة بأنهم رسل من الله وأمروه بالخروج بأهله ليلاً ولا يلتفت منهم أحد إلا امرأته. رفع الله قراهم وقلبها عليهم، وأمطر عليهم حجارة من سجيل منضود. نجى الله لوطاً ومن آمن معه.',
      storyEn: 'Lut (AS) was the nephew of Ibrahim, sent by Allah to the people of Sodom and Gomorrah. His people were the first to commit the great obscenity: men approaching men with desire instead of women, highway robbery, and abominations in their gatherings. Lut called them to abandon these obscenities and return to sound nature, but they insisted on their misguidance and threatened to expel him. Angels of punishment came in the form of handsome youths to test the people. Lut\'s people wanted to assault his guests, so he defended them saying: "These are my daughters if you would be doers." The angels told him they were messengers from Allah and commanded him to leave with his family by night, and none should look back except his wife. Allah raised their villages and overturned them, and rained upon them stones of baked clay. Allah saved Lut and those who believed with him.'
    },
    {
      id: 8,
      icon: TreePine,
      nameAr: 'إسماعيل عليه السلام',
      nameEn: 'Prophet Ismail (AS)',
      descriptionAr: 'الذبيح وأبو العرب',
      descriptionEn: 'The Sacrificed and Father of Arabs',
      storyAr: 'إسماعيل عليه السلام البكر من أبناء إبراهيم، ولد من أمه هاجر. تركه أبوه مع أمه في واد غير ذي زرع عند البيت الحرام بأمر من الله. نفد الماء منهما فسعت أمه بين الصفا والمروة سبعة أشواط بحثاً عن الماء، فأنبع الله ماء زمزم تحت قدمي إسماعيل. نشأ إسماعيل في مكة وتعلم العربية من قبيلة جرهم. رأى أبوه إبراهيم في المنام أنه يذبحه، فأخبره بذلك، فقال إسماعيل: "يا أبت افعل ما تؤمر ستجدني إن شاء الله من الصابرين". لما استسلما لأمر الله وأضجعه للذبح، فداه الله بذبح عظيم. ساعد أباه في بناء الكعبة ورفع قواعدها. كان نبياً رسولاً صادق الوعد، أمر أهله بالصلاة والزكاة. من ذريته جاء خاتم الأنبياء محمد صلى الله عليه وسلم.',
      storyEn: 'Ismail (AS) was the firstborn son of Ibrahim, born to his mother Hajar. His father left him with his mother in a barren valley near the Sacred House by Allah\'s command. Their water ran out, so his mother ran between Safa and Marwa seven times searching for water. Allah caused the water of Zamzam to spring beneath Ismail\'s feet. Ismail grew up in Mecca and learned Arabic from the Jurhum tribe. His father Ibrahim saw in a dream that he was sacrificing him, so he told him. Ismail said: "O my father, do as you are commanded. You will find me, if Allah wills, among the patient." When they both submitted to Allah\'s command and he laid him down for sacrifice, Allah ransomed him with a great sacrifice. He helped his father build the Kaaba and raise its foundations. He was a truthful prophet and messenger who kept his promises, commanding his family to prayer and charity. From his descendants came the seal of prophets, Muhammad (peace be upon him).'
    },
    {
      id: 9,
      icon: Book,
      nameAr: 'إسحاق عليه السلام',
      nameEn: 'Prophet Ishaq (AS)',
      descriptionAr: 'ابن إبراهيم وأبو يعقوب',
      descriptionEn: 'Son of Ibrahim and Father of Yaqub',
      storyAr: 'إسحاق عليه السلام ابن إبراهيم من زوجته سارة، ولد بعد أن كبرت سارة وبلغ إبراهيم من الكبر عتياً، فكانت ولادته معجزة من الله. بشرت به الملائكة إبراهيم وسارة عندما جاءوا بالبشرى وبالعذاب لقوم لوط. نشأ في فلسطين وكان نبياً صالحاً يدعو إلى التوحيد. رزقه الله ولدين: عيسو ويعقوب. يعقوب هو إسرائيل الذي جاء من ذريته أنبياء بني إسرائيل. عاش إسحاق حياة مباركة يعبد الله ويعلم الناس، وكان مثالاً في الصبر والطاعة. ذكره الله في القرآن مع الأنبياء المكرمين، وجعله من الصالحين.',
      storyEn: 'Ishaq (AS) was the son of Ibrahim from his wife Sarah, born after Sarah grew old and Ibrahim reached extreme old age, making his birth a miracle from Allah. The angels gave glad tidings of him to Ibrahim and Sarah when they came with glad tidings and with punishment for Lut\'s people. He grew up in Palestine and was a righteous prophet calling to monotheism. Allah blessed him with two sons: Esau and Yaqub. Yaqub is Israel from whose descendants came the prophets of Bani Israel. Ishaq lived a blessed life worshipping Allah and teaching people, and was an example in patience and obedience. Allah mentioned him in the Quran among the honored prophets and made him among the righteous.'
    },
    {
      id: 10,
      icon: Users,
      nameAr: 'يعقوب عليه السلام',
      nameEn: 'Prophet Yaqub (AS)',
      descriptionAr: 'إسرائيل وأبو الأسباط',
      descriptionEn: 'Israel and Father of the Tribes',
      storyAr: 'يعقوب عليه السلام ابن إسحاق بن إبراهيم، ولقبه إسرائيل ومعناه عبد الله. رزقه الله اثني عشر ولداً هم الأسباط، أحبهم إليه يوسف وأخوه بنيامين من أمه راحيل. حسد إخوة يوسف أخاهم فألقوه في البئر وادعوا أن الذئب أكله. حزن يعقوب حزناً شديداً حتى ابيضت عيناه من الحزن فهو كظيم، لكنه صبر واحتسب ولم يفقد الأمل في الله. قال: "إنما أشكو بثي وحزني إلى الله". بعد سنوات طويلة لما صار يوسف عزيز مصر، أمر إخوته بإحضار أبيهم. لما دخلوا على يوسف ألقى قميصه على وجه أبيه فارتد بصيراً. اجتمع شمل الأسرة وسجد يعقوب وبنوه شكراً لله. عاش يعقوب يدعو أبناءه إلى التوحيد حتى آخر لحظة من حياته.',
      storyEn: 'Yaqub (AS) was the son of Ishaq ibn Ibrahim, known as Israel meaning servant of Allah. Allah blessed him with twelve sons who were the tribes, his most beloved being Yusuf and his brother Benjamin from their mother Rachel. Yusuf\'s brothers envied him and threw him in a well, claiming a wolf ate him. Yaqub grieved intensely until his eyes whitened from grief, yet he remained patient and never lost hope in Allah. He said: "I only complain of my suffering and my grief to Allah." After many years when Yusuf became the minister of Egypt, he ordered his brothers to bring their father. When they entered upon Yusuf, he threw his shirt on his father\'s face and his sight returned. The family was reunited and Yaqub and his sons prostrated in gratitude to Allah. Yaqub lived calling his children to monotheism until his last moment.'
    },
    {
      id: 11,
      icon: Heart,
      nameAr: 'يوسف عليه السلام',
      nameEn: 'Prophet Yusuf (AS)',
      descriptionAr: 'الصديق الجميل',
      descriptionEn: 'The Truthful and Beautiful',
      storyAr: 'يوسف عليه السلام ابن يعقوب، أحب أبناء يعقوب إليه. رأى في صغره رؤيا أن أحد عشر كوكباً والشمس والقمر ساجدين له. حسده إخوته فألقوه في البئر، ثم باعوه لقافلة متجهة لمصر. اشتراه عزيز مصر وربي في قصره. راودته امرأة العزيز عن نفسه فاستعصم، فكادت له فسجن بضع سنين. في السجن عبر رؤيا صاحبيه، ثم رؤيا الملك عن سبع سنين خصب وسبع سنين جدب. أخرجه الملك من السجن وولاه على خزائن الأرض. جاءه إخوته يطلبون الطعام في سني الجدب، فعرفهم ولم يعرفوه. أمرهم بإحضار أخيه بنيامين، ثم أظهر لهم حقيقته فاعتذروا. أرسل قميصه لأبيه فارتد بصيراً، وجاء أبوه وإخوته إلى مصر، وخروا له سجداً وتحققت رؤياه. قال: "رب قد آتيتني من الملك وعلمتني من تأويل الأحاديث".',
      storyEn: 'Yusuf (AS) was the son of Yaqub, his most beloved. In his youth he saw a vision of eleven stars, the sun and moon prostrating to him. His brothers envied him and threw him in a well, then sold him to a caravan heading to Egypt. The minister of Egypt bought him and he was raised in his palace. The minister\'s wife tried to seduce him but he remained chaste. She plotted against him and he was imprisoned for several years. In prison he interpreted his companions\' dreams, then the king\'s dream of seven years of plenty and seven of famine. The king released him and put him in charge of the land\'s treasuries. His brothers came seeking food during the famine years. He recognized them but they did not recognize him. He ordered them to bring their brother Benjamin, then revealed his identity and they apologized. He sent his shirt to his father whose sight returned, and his father and brothers came to Egypt. They prostrated to him and his vision came true. He said: "My Lord, You have given me sovereignty and taught me interpretation of dreams."'
    },
    {
      id: 12,
      icon: CloudRain,
      nameAr: 'أيوب عليه السلام',
      nameEn: 'Prophet Ayyub (AS)',
      descriptionAr: 'أعظم الصابرين',
      descriptionEn: 'Most Patient of All',
      storyAr: 'أيوب عليه السلام كان من ذرية إسحاق، رجل صالح غني كثير المال والأهل والولد. ابتلاه الله بفقد ماله وأولاده ثم بمرض شديد في جسده استمر سنوات طويلة، حتى تقرح جلده ونفر منه الناس إلا زوجته الصابرة. لم يشكُ أيوب ولم يتضجر، بل صبر واحتسب وظل يعبد الله ويذكره. لما طال البلاء دعا ربه: "أني مسني الضر وأنت أرحم الراحمين". استجاب الله دعاءه وأمره أن يضرب برجله الأرض، ففجر له عيناً من الماء، فاغتسل منها فشفاه الله. رد الله عليه صحته وماله وأهله وضاعف له ذلك كله. ضرب الله به المثل في الصبر على البلاء. قال الله تعالى: "إنا وجدناه صابراً نعم العبد إنه أواب".',
      storyEn: 'Ayyub (AS) was from the descendants of Ishaq, a righteous man wealthy in property, family and children. Allah tested him with the loss of his wealth and children, then with severe illness in his body that lasted for years, until his skin became ulcerated and people avoided him except his patient wife. Ayyub did not complain or show impatience, but remained patient and continued worshipping and remembering Allah. When the trial lasted long, he called upon his Lord: "Indeed, adversity has touched me, and You are the Most Merciful of the merciful." Allah answered his prayer and commanded him to strike the ground with his foot, and a spring of water gushed forth. He bathed in it and Allah healed him. Allah restored his health, wealth and family and doubled it all. Allah made him an example in patience during trials. Allah said: "Indeed, We found him patient, an excellent servant. Indeed, he was one repeatedly turning back to Allah."'
    },
    {
      id: 13,
      icon: Scroll,
      nameAr: 'شعيب عليه السلام',
      nameEn: 'Prophet Shuayb (AS)',
      descriptionAr: 'خطيب الأنبياء',
      descriptionEn: 'The Eloquent Speaker of Prophets',
      storyAr: 'شعيب عليه السلام أرسله الله إلى أهل مدين وأصحاب الأيكة. كان قومه يطففون الميزان والمكيال، ويقطعون الطريق، ويفسدون في الأرض. دعاهم شعيب إلى عبادة الله وإيفاء المكيال والميزان بالقسط، ونهاهم عن الفساد. قال لهم: "ولا تبخسوا الناس أشياءهم ولا تعثوا في الأرض مفسدين". كان فصيحاً بليغاً، لذلك لُقب بخطيب الأنبياء. سخر منه قومه وهددوه بالرجم والإخراج، واتهموه بالضلال. استمر في دعوته فزادوا في طغيانهم. أرسل الله عليهم عذاب يوم الظلة، وأخذتهم الرجفة فأصبحوا في ديارهم جاثمين. نجى الله شعيباً ومن آمن معه. استضاف موسى عليه السلام فيما بعد وزوجه إحدى ابنتيه.',
      storyEn: 'Shuayb (AS) was sent by Allah to the people of Madyan and the companions of the thicket. His people cheated in measure and weight, robbed travelers, and spread corruption in the land. Shuayb called them to worship Allah and give full measure and weight in justice, forbidding them from corruption. He told them: "And do not deprive people of their due and do not commit abuse on earth, spreading corruption." He was eloquent and articulate, thus called the eloquent speaker of prophets. His people mocked him, threatened him with stoning and expulsion, and accused him of misguidance. He continued his call but they increased in transgression. Allah sent upon them the punishment of the Day of Shadow, and the earthquake seized them, leaving them prostrate in their homes. Allah saved Shuayb and those who believed with him. He later hosted Musa and married him to one of his daughters.'
    },
    {
      id: 14,
      icon: Zap,
      nameAr: 'موسى عليه السلام',
      nameEn: 'Prophet Musa (AS)',
      descriptionAr: 'كليم الله',
      descriptionEn: 'One Who Spoke to Allah',
      storyAr: 'ولد موسى عليه السلام في مصر زمن فرعون الطاغية الذي كان يذبح الأبناء من بني إسرائيل. أوحى الله إلى أمه أن تضعه في تابوت وتلقيه في النهر، فالتقطه آل فرعون وربته زوجة فرعون آسية. رد الله موسى لأمه ليرضع منها. كبر موسى وقتل رجلاً من القبط خطأً فهرب إلى مدين، حيث تزوج ابنة شعيب. في طريق عودته رأى ناراً عند جبل الطور، فكلمه الله وأراه آياته: العصا واليد البيضاء. أرسله الله إلى فرعون يدعوه إلى الإيمان، فادعى فرعون الألوهية. أيد الله موسى بتسع آيات بينات: العصا، اليد، الطوفان، الجراد، القمل، الضفادع، الدم، نقص الثمرات، والسنين. جمع فرعون السحرة ليواجهوا موسى، فألقوا حبالهم وعصيهم، فألقى موسى عصاه فابتلعت ما يأفكون، فسجد السحرة لله. غضب فرعون وتوعدهم لكنهم ثبتوا على الإيمان. أمر الله موسى بالخروج ببني إسرائيل ليلاً، فتبعهم فرعون بجنوده. لما تراءى الجمعان ضرب موسى البحر بعصاه فانفلق اثني عشر طريقاً يابساً. عبر موسى وقومه، ولما دخل فرعون وجنوده أطبق البحر عليهم فغرقوا. طلب بنو إسرائيل من موسى أن يجعل لهم إلهاً كما لغيرهم آلهة، فغضب موسى. ذهب لميقات ربه أربعين ليلة، وفي غيابه عبد قومه العجل الذي صنعه السامري. عاد موسى غاضباً وأخذ برأس أخيه هارون، ثم تاب القوم. أنزل الله عليهم المن والسلوى، وكلم الله موسى تكليماً. توفي في التيه قبل دخول الأرض المقدسة.',
      storyEn: 'Musa (AS) was born in Egypt during the time of the tyrant Pharaoh who slaughtered the sons of Bani Israel. Allah revealed to his mother to place him in a basket and cast it into the river. Pharaoh\'s family found him and Pharaoh\'s wife Asiya raised him. Allah returned Musa to his mother to nurse. Musa grew up and accidentally killed an Egyptian, so he fled to Madyan where he married Shuayb\'s daughter. On his return, he saw fire at Mount Tur, and Allah spoke to him and showed him His signs: the staff and the white hand. Allah sent him to Pharaoh to call him to faith, but Pharaoh claimed divinity. Allah supported Musa with nine clear signs: the staff, hand, flood, locusts, lice, frogs, blood, loss of crops, and years of famine. Pharaoh gathered magicians to face Musa. They threw their ropes and staffs, but Musa threw his staff which swallowed their falsehoods, and the magicians prostrated to Allah. Pharaoh raged and threatened them but they remained firm in faith. Allah commanded Musa to leave with Bani Israel by night. Pharaoh pursued with his army. When the two groups saw each other, Musa struck the sea with his staff and it split into twelve dry paths. Musa and his people crossed, and when Pharaoh and his army entered, the sea closed upon them and they drowned. Bani Israel asked Musa to make them a god like others had gods, and Musa was angry. He went to his Lord\'s appointment for forty nights, and in his absence his people worshipped the calf made by As-Samiri. Musa returned angry and seized his brother Harun\'s head, then the people repented. Allah sent down manna and quails, and Allah spoke directly to Musa. He died in the wilderness before entering the Holy Land.'
    },
    {
      id: 15,
      icon: Book,
      nameAr: 'هارون عليه السلام',
      nameEn: 'Prophet Harun (AS)',
      descriptionAr: 'أخو موسى ووزيره',
      descriptionEn: 'Brother and Minister of Musa',
      storyAr: 'هارون عليه السلام أخو موسى الأكبر، كان فصيحاً بليغاً. طلب موسى من الله أن يجعل هارون وزيراً له يعينه في دعوته، فاستجاب الله دعاءه وجعله نبياً رسولاً. ذهبا معاً إلى فرعون يدعوانه إلى الله. لما ذهب موسى لميقات ربه استخلف هارون على قومه، فعبدوا العجل في غيابهما. حاول هارون منعهم لكنهم لم يسمعوا له وكادوا يقتلونه، فقال: "إني خشيت أن تقول فرقت بين بني إسرائيل ولم ترقب قولي". كان هارون معيناً لموسى في حمل رسالة الله، ومثالاً في الحلم والصبر والحكمة. توفي قبل موسى في التيه.',
      storyEn: 'Harun (AS) was Musa\'s older brother, eloquent and articulate. Musa asked Allah to make Harun his minister to help him in his mission, and Allah answered his prayer and made him a prophet and messenger. They went together to Pharaoh calling him to Allah. When Musa went to his Lord\'s appointment, he left Harun in charge of his people, but they worshipped the calf in their absence. Harun tried to stop them but they would not listen and almost killed him. He said: "Indeed, I feared that you would say you caused division among Bani Israel and did not observe my word." Harun was a helper to Musa in carrying Allah\'s message, and an example in forbearance, patience and wisdom. He died before Musa in the wilderness.'
    },
    {
      id: 16,
      icon: Scroll,
      nameAr: 'ذو الكفل عليه السلام',
      nameEn: 'Prophet Dhul-Kifl (AS)',
      descriptionAr: 'الصابر المجاهد',
      descriptionEn: 'The Patient and Striving',
      storyAr: 'ذو الكفل عليه السلام نبي من أنبياء بني إسرائيل، ذُكر في القرآن مع الصابرين. قيل إنه تكفل بأمر قومه بعد نبي قبله، وتكفل بقيام الليل وصيام النهار والقضاء بين الناس بالعدل من غير غضب. كان عابداً صابراً محتسباً، يحكم بين الناس بالحق. ابتلاه الشيطان ليغضبه فلم يستطع. صبر على الطاعة وعلى دعوة قومه. أدخله الله في زمرة الصالحين وجعله من المصطفين. قال الله تعالى: "وإسماعيل وإدريس وذا الكفل كل من الصابرين".',
      storyEn: 'Dhul-Kifl (AS) was a prophet from the prophets of Bani Israel, mentioned in the Quran among the patient. It is said he took charge of his people\'s affairs after a prophet before him, and pledged to stand in prayer at night, fast during the day, and judge among people with justice without anger. He was a worshipper, patient and devoted, judging among people with truth. Satan tested him to make him angry but could not. He was patient in obedience and in calling his people. Allah placed him among the righteous and made him among the chosen. Allah said: "And Ismail and Idris and Dhul-Kifl - all were of the patient."'
    },
    {
      id: 17,
      icon: Crown,
      nameAr: 'داود عليه السلام',
      nameEn: 'Prophet Dawud (AS)',
      descriptionAr: 'النبي الملك',
      descriptionEn: 'The Prophet King',
      storyAr: 'داود عليه السلام من أنبياء بني إسرائيل، كان راعياً شاباً. خرج مع جيش طالوت لقتال جالوت الجبار، فقتله بحجر من مقلاعه. آتاه الله الملك والنبوة والحكمة والزبور. كان حسن الصوت، إذا قرأ الزبور سبحت معه الجبال والطير. ألان الله له الحديد فكان يصنع الدروع، وعلمه صنعة لبوس لهم. كان عادلاً في حكمه، يقضي بين الناس بالحق. ابتلاه الله بقصة الخصمين اللذين تسورا المحراب، ففهم داود أنها عظة له. سجد وتاب إلى الله فغفر له. كان كثير العبادة يصوم يوماً ويفطر يوماً، ويقوم نصف الليل. أعطاه الله قوة في العبادة والجهاد والحكم.',
      storyEn: 'Dawud (AS) was a prophet of Bani Israel, a young shepherd. He went out with the army of Talut to fight the mighty Jalut, and killed him with a stone from his sling. Allah gave him kingship, prophethood, wisdom and the Psalms. He had a beautiful voice; when he recited the Psalms, the mountains and birds glorified with him. Allah made iron soft for him so he made armor, and taught him the craft of making armor for protection. He was just in his judgment, deciding among people with truth. Allah tested him with the story of two disputants who climbed over the prayer chamber, and Dawud understood it was a lesson for him. He prostrated and repented to Allah, and Allah forgave him. He worshipped abundantly, fasting one day and eating the next, and standing half the night in prayer. Allah gave him strength in worship, striving and judgment.'
    },
    {
      id: 18,
      icon: Sun,
      nameAr: 'سليمان عليه السلام',
      nameEn: 'Prophet Sulayman (AS)',
      descriptionAr: 'النبي الذي سخر له الريح والجن',
      descriptionEn: 'Prophet Who Commanded Wind and Jinn',
      storyAr: 'سليمان عليه السلام ابن داود، ورث عنه الملك والنبوة وهو شاب. آتاه الله ملكاً لم يؤته أحداً من قبله: سخر له الريح تجري بأمره، والشياطين تبني له وتغوص، وعلمه منطق الطير والحيوان. كان عادلاً حكيماً، يشكر الله على نعمه. مر بوادي النمل فسمع نملة تحذر قومها، فتبسم وشكر الله. تفقد الطير فلم يجد الهدهد، فلما جاء أخبره بملكة سبأ وقومها يسجدون للشمس. أرسل إليها كتاباً يدعوها للإسلام، فجاءت مسلمة. طلب من الجن والإنس أن يأتوا بعرشها، فجاء به عفريت من الجن قبل أن يقوم من مقامه. بنى لله مسجداً عظيماً في بيت المقدس. ابتلاه الله بوضع جسد على كرسيه فتاب، وطلب من الله مغفرة وملكاً لا ينبغي لأحد من بعده. توفي وهو متكئ على عصاه، ولم تعلم الجن بموته إلا بعد أن أكلت الأرضة العصا فخر.',
      storyEn: 'Sulayman (AS) was the son of Dawud, inheriting from him kingship and prophethood while young. Allah gave him a kingdom that He gave to no one before: He subjected to him the wind running by his command, the devils building for him and diving, and taught him the language of birds and animals. He was just and wise, thanking Allah for His blessings. He passed by the valley of ants and heard an ant warning her people, so he smiled and thanked Allah. He inspected the birds and did not find the hoopoe. When it came, it told him of the Queen of Sheba and her people prostrating to the sun. He sent her a letter calling her to Islam, and she came submitting. He asked the jinn and humans to bring her throne, and an ifrit of the jinn brought it before he rose from his place. He built a great mosque for Allah in Jerusalem. Allah tested him by placing a body on his throne, so he repented and asked Allah for forgiveness and a kingdom that would not befit anyone after him. He died while leaning on his staff, and the jinn did not know of his death until termites ate the staff and it fell.'
    },
    {
      id: 19,
      icon: Flame,
      nameAr: 'إلياس عليه السلام',
      nameEn: 'Prophet Ilyas (AS)',
      descriptionAr: 'نبي بني إسرائيل',
      descriptionEn: 'Prophet of Bani Israel',
      storyAr: 'إلياس عليه السلام من أنبياء بني إسرائيل، أرسله الله إلى قومه في بعلبك. كان قومه يعبدون صنماً يسمى بعلاً. دعاهم إلياس إلى عبادة الله وحده وترك عبادة الأصنام. قال لهم: "أتدعون بعلاً وتذرون أحسن الخالقين". كذبوه وآذوه واستمروا على كفرهم. صبر على دعوتهم سنوات طويلة لكنهم أصروا على ضلالهم. توعدهم بعذاب الله إن لم يتوبوا. كان قوياً في الحق، لا يخاف في الله لومة لائم. ذكره الله في القرآن وسلم عليه مع النبيين: "سلام على إل ياسين".',
      storyEn: 'Ilyas (AS) was a prophet of Bani Israel, sent by Allah to his people in Baalbek. His people worshipped an idol called Baal. Ilyas called them to worship Allah alone and abandon idol worship. He said to them: "Do you call upon Baal and leave the Best of creators?" They denied him, harmed him, and continued in their disbelief. He was patient in calling them for many years but they insisted on their misguidance. He warned them of Allah\'s punishment if they did not repent. He was strong in truth, not fearing blame for Allah\'s sake. Allah mentioned him in the Quran and sent peace upon him with the prophets: "Peace be upon Ilyas."'
    },
    {
      id: 20,
      icon: TreePine,
      nameAr: 'اليسع عليه السلام',
      nameEn: 'Prophet Al-Yasa (AS)',
      descriptionAr: 'خليفة إلياس',
      descriptionEn: 'Successor of Ilyas',
      storyAr: 'اليسع عليه السلام نبي من أنبياء بني إسرائيل، جاء بعد إلياس وخلفه في دعوة قومه. استمر على نهج إلياس في دعوة الناس إلى التوحيد ونبذ عبادة الأصنام. كان صابراً محتسباً على أذى قومه. أيده الله بالمعجزات والآيات. دعا قومه سنوات طويلة لكن أكثرهم لم يؤمنوا. ذكره الله في القرآن مع الأخيار والمصطفين: "وإسماعيل واليسع ويونس ولوطاً وكلاً فضلنا على العالمين". استمر في رسالته حتى توفاه الله.',
      storyEn: 'Al-Yasa (AS) was a prophet of Bani Israel, coming after Ilyas and succeeding him in calling his people. He continued on Ilyas\'s path in calling people to monotheism and rejecting idol worship. He was patient and devoted despite his people\'s harm. Allah supported him with miracles and signs. He called his people for many years but most did not believe. Allah mentioned him in the Quran among the righteous and chosen: "And Ismail and Al-Yasa and Yunus and Lut - and all We preferred over the worlds." He continued his mission until Allah took him in death.'
    },
    {
      id: 21,
      icon: Fish,
      nameAr: 'يونس عليه السلام',
      nameEn: 'Prophet Yunus (AS)',
      descriptionAr: 'صاحب الحوت وذو النون',
      descriptionEn: 'Companion of the Whale',
      storyAr: 'يونس عليه السلام أرسله الله إلى أهل نينوى في العراق. دعاهم إلى التوحيد فأبوا وكذبوه. غضب يونس وخرج من بينهم قبل أن يأذن الله له، ظاناً أن الله لن يضيق عليه. ركب سفينة في البحر، فثقلت السفينة فاقترعوا ليلقوا أحدهم في البحر، فوقعت القرعة على يونس ثلاث مرات. ألقوه في البحر فالتقمه الحوت، فسبح الله في بطن الحوت: "لا إله إلا أنت سبحانك إني كنت من الظالمين". استجاب الله له ونجاه من الغم، فألقاه الحوت على الساحل سقيماً. أنبت الله عليه شجرة من يقطين. أرسله الله مرة أخرى إلى قومه، فآمنوا جميعاً فمتعهم الله إلى حين. صار مثالاً في التوبة والرجوع إلى الله.',
      storyEn: 'Yunus (AS) was sent by Allah to the people of Nineveh in Iraq. He called them to monotheism but they refused and denied him. Yunus became angry and left them before Allah gave him permission, thinking Allah would not constrain him. He boarded a ship at sea, and when the ship became heavy, they drew lots to throw someone overboard. The lot fell on Yunus three times. They threw him into the sea and a whale swallowed him. He glorified Allah in the whale\'s belly: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." Allah answered him and saved him from distress. The whale cast him on the shore, weak. Allah caused a gourd plant to grow over him. Allah sent him again to his people, and they all believed, so Allah gave them enjoyment for a time. He became an example in repentance and returning to Allah.'
    },
    {
      id: 22,
      icon: Baby,
      nameAr: 'زكريا عليه السلام',
      nameEn: 'Prophet Zakariya (AS)',
      descriptionAr: 'أبو يحيى',
      descriptionEn: 'Father of Yahya',
      storyAr: 'زكريا عليه السلام من أنبياء بني إسرائيل، كان نجاراً يأكل من عمل يده. كفل مريم ابنة عمران، وكلما دخل عليها المحراب وجد عندها رزقاً. تقدم به العمر ولم يكن له ولد، وكانت امرأته عاقراً. دعا الله أن يرزقه ولياً يرثه ويرث من آل يعقوب، فاستجاب الله دعاءه وبشره بيحيى. تعجب زكريا فقال: "أنى يكون لي غلام وكانت امرأتي عاقراً وقد بلغت من الكبر عتياً". قالت الملائكة: "كذلك قال ربك هو علي هين". جعل الله له آية ألا يكلم الناس ثلاث ليال سوياً. كان عابداً خاشعاً يدعو ربه خفية، يسارع في الخيرات. قتله بنو إسرائيل ظلماً في المسجد وهو يصلي.',
      storyEn: 'Zakariya (AS) was a prophet of Bani Israel, a carpenter who ate from his handiwork. He took care of Maryam, daughter of Imran, and whenever he entered the prayer chamber he found provision with her. He grew old and had no child, and his wife was barren. He prayed to Allah to grant him an heir to inherit from him and the family of Yaqub. Allah answered his prayer and gave him glad tidings of Yahya. Zakariya wondered saying: "How can I have a boy when my wife has been barren and I have reached extreme old age?" The angels said: "Thus said your Lord, it is easy for Me." Allah made a sign for him that he would not speak to people for three nights though sound. He was a devoted worshipper calling upon his Lord in secrecy, hastening to good deeds. Bani Israel killed him unjustly in the mosque while he was praying.'
    },
    {
      id: 23,
      icon: Moon,
      nameAr: 'يحيى عليه السلام',
      nameEn: 'Prophet Yahya (AS)',
      descriptionAr: 'سيد الشباب',
      descriptionEn: 'Master of Youth',
      storyAr: 'يحيى عليه السلام ابن زكريا، ولد بمعجزة من الله بعد أن كانت أمه عاقراً وأبوه شيخاً كبيراً. سماه الله يحيى ولم يجعل له من قبل سمياً. آتاه الله الحكم صبياً، وجعله حنوناً وزكياً من لدنه. كان باراً بوالديه، ولم يكن جباراً عصياً. نشأ في العبادة والزهد والورع، وكان سيداً وحصوراً لا يميل إلى النساء. دعا إلى التوحيد وحارب الفساد والمنكر في قومه. أنكر على ملك زمانه زواجه من محرم عليه، فغضبت امرأة الملك وحرضته على قتله. قتل يحيى ظلماً وهو شاب في ريعان شبابه. قال الله تعالى: "وسلام عليه يوم ولد ويوم يموت ويوم يبعث حياً".',
      storyEn: 'Yahya (AS) was the son of Zakariya, born by a miracle from Allah after his mother was barren and his father an old man. Allah named him Yahya and gave him no namesake before. Allah gave him wisdom while still a child, and made him affectionate and pure from Himself. He was dutiful to his parents, neither arrogant nor disobedient. He grew up in worship, asceticism and piety, and was a master and chaste, not inclined to women. He called to monotheism and fought corruption and evil among his people. He denounced the king of his time for marrying someone forbidden to him. The king\'s wife became angry and incited him to kill Yahya. Yahya was killed unjustly as a young man in his prime. Allah said: "And peace be upon him the day he was born and the day he dies and the day he is raised alive."'
    },
    {
      id: 24,
      icon: Heart,
      nameAr: 'عيسى عليه السلام',
      nameEn: 'Prophet Isa (AS)',
      descriptionAr: 'المسيح ابن مريم',
      descriptionEn: 'The Messiah Son of Maryam',
      storyAr: 'عيسى عليه السلام ابن مريم العذراء البتول، خلقه الله من غير أب كما خلق آدم من غير أب ولا أم. بشرت الملائكة مريم وهي في المحراب: "إن الله يبشرك بكلمة منه اسمه المسيح عيسى ابن مريم". نفخ جبريل في جيب مريم فحملت بعيسى، فانتبذت مكاناً قصياً. ولدته تحت النخلة، فناداها من تحتها ألا تحزن وأن تهز جذع النخلة لتساقط رطباً جنياً. جاءت به قومها تحمله، فاتهموها بالفاحشة. أشارت إليه فتكلم في المهد: "إني عبد الله آتاني الكتاب وجعلني نبياً". أيده الله بالمعجزات: يحيي الموتى بإذن الله، ويبرئ الأكمه والأبرص بإذن الله، ويخلق من الطين كهيئة الطير فينفخ فيه فيكون طيراً بإذن الله، وينبئ الناس بما يأكلون وما يدخرون في بيوتهم. دعا بني إسرائيل إلى عبادة الله وحده: "إن الله ربي وربكم فاعبدوه". كذبه أكثرهم وأرادوا قتله، فرفعه الله إليه وشبه لهم، فظنوا أنهم صلبوه وما صلبوه. سينزل آخر الزمان ويحكم بشريعة محمد صلى الله عليه وسلم.',
      storyEn: 'Isa (AS) is the son of the Virgin Maryam, created by Allah without a father just as Adam was created without father or mother. The angels gave glad tidings to Maryam while she was in the prayer chamber: "Indeed, Allah gives you good tidings of a word from Him, whose name will be the Messiah Isa son of Maryam." Jibril breathed into Maryam\'s garment and she conceived Isa, so she secluded herself in a remote place. She gave birth under a palm tree, and it called to her not to grieve and to shake the trunk to cause ripe dates to fall. She came to her people carrying him, and they accused her of immorality. She pointed to him and he spoke from the cradle: "Indeed, I am the servant of Allah. He has given me the Scripture and made me a prophet." Allah supported him with miracles: he gave life to the dead by Allah\'s permission, healed the blind and leper by Allah\'s permission, created from clay the form of a bird then breathed into it and it became a bird by Allah\'s permission, and told people what they ate and stored in their homes. He called Bani Israel to worship Allah alone: "Indeed, Allah is my Lord and your Lord, so worship Him." Most denied him and wanted to kill him, but Allah raised him to Himself and made it appear to them otherwise. They thought they crucified him but they did not. He will descend at the end of time and rule by the law of Muhammad (peace be upon him).'
    },
    {
      id: 25,
      icon: Star,
      nameAr: 'محمد ﷺ',
      nameEn: 'Prophet Muhammad ﷺ',
      descriptionAr: 'خاتم الأنبياء والمرسلين',
      descriptionEn: 'Seal of Prophets and Messengers',
      storyAr: 'محمد صلى الله عليه وسلم خاتم الأنبياء والمرسلين، أرسله الله رحمة للعالمين. ولد في مكة يتيم الأب، وتوفيت أمه وهو صغير. كفله جده عبد المطلب ثم عمه أبو طالب. كان يعرف بالصادق الأمين قبل البعثة. تعبد في غار حراء، فنزل عليه الوحي بسورة العلم وهو ابن أربعين سنة. بدأ الدعوة سراً ثم جهراً، يدعو إلى التوحيد ونبذ عبادة الأصنام. آذاه قومه أشد الإيذاء، فصبر واحتسب. أسلم على يديه أبو بكر وعلي وخديجة وعثمان وغيرهم من السابقين. أمر الله المسلمين بالهجرة إلى الحبشة، ثم هاجر هو إلى المدينة. آخى بين المهاجرين والأنصار، وبنى المسجد النبوي، وأسس دولة الإسلام. غزا وجاهد في سبيل الله، وانتصر في بدر وأحد والخندق وغيرها. فتح مكة في السنة الثامنة للهجرة، ودخل الناس في دين الله أفواجاً. حج حجة الوداع وخطب خطبته الشهيرة. نزلت عليه آخر آية: "اليوم أكملت لكم دينكم". توفي صلى الله عليه وسلم في المدينة ودفن في حجرة عائشة. ترك الأمة على المحجة البيضاء ليلها كنهارها، لا يزيغ عنها إلا هالك.',
      storyEn: 'Muhammad (peace be upon him) is the seal of prophets and messengers, sent by Allah as mercy to all worlds. He was born in Mecca orphaned by his father, and his mother died when he was young. His grandfather Abdul-Muttalib then his uncle Abu Talib cared for him. He was known as the truthful and trustworthy before his mission. He worshipped in the cave of Hira, and revelation descended upon him with Surah Al-Alaq at age forty. He began calling secretly then openly, calling to monotheism and rejecting idol worship. His people harmed him greatly, but he remained patient. Abu Bakr, Ali, Khadijah, Uthman and others from the early Muslims embraced Islam through him. Allah commanded Muslims to migrate to Abyssinia, then he migrated to Medina. He established brotherhood between the Emigrants and Helpers, built the Prophet\'s Mosque, and founded the Islamic state. He fought and strived in Allah\'s way, and was victorious at Badr, Uhud, the Trench and other battles. He conquered Mecca in the eighth year of Hijra, and people entered Allah\'s religion in crowds. He performed the Farewell Pilgrimage and delivered his famous sermon. The last verse was revealed: "This day I have perfected for you your religion." He passed away in Medina and was buried in Aisha\'s chamber. He left the Ummah on a clear path, its night like its day, none deviates from it except the doomed.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center py-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
          {settings.language === 'ar' ? 'قصص الأنبياء' : 'Prophet Stories'}
        </h1>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl mx-auto">
          {settings.language === 'ar' 
            ? 'قصص الأنبياء والرسل عليهم السلام'
            : 'Stories of the Prophets and Messengers (peace be upon them)'}
        </p>
      </div>

      {!selectedStory ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((story) => {
            const Icon = story.icon;
            return (
              <button
                key={story.id}
                onClick={() => setSelectedStory(story)}
                className="glass-effect rounded-2xl p-6 text-left hover:scale-105 smooth-transition apple-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">
                    {settings.language === 'ar' ? story.nameAr : story.nameEn}
                  </h3>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {settings.language === 'ar' ? story.descriptionAr : story.descriptionEn}
                </p>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-6">
          <button
            onClick={() => setSelectedStory(null)}
            className="text-primary hover:underline"
          >
            ← {settings.language === 'ar' ? 'العودة' : 'Back'}
          </button>
          
          <div className="glass-effect rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              {React.createElement(selectedStory.icon, {
                className: "h-12 w-12 text-primary"
              })}
              <div>
                <h2 className="text-3xl font-bold">
                  {settings.language === 'ar' ? selectedStory.nameAr : selectedStory.nameEn}
                </h2>
                <p className="text-muted-foreground">
                  {settings.language === 'ar' ? selectedStory.descriptionAr : selectedStory.descriptionEn}
                </p>
              </div>
            </div>
            
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className={`leading-relaxed ${settings.language === 'ar' ? 'text-right' : 'text-left'}`} dir={settings.language === 'ar' ? 'rtl' : 'ltr'}>
                {settings.language === 'ar' ? selectedStory.storyAr : selectedStory.storyEn}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProphetStories;
