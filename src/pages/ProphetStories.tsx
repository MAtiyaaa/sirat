import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { Book, Heart, Users, Mountain, Ship, Star, Scroll, CloudRain, Wind, Zap, Flame, Baby, Crown, Fish, TreePine, Sun, Moon, ArrowLeft } from 'lucide-react';
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
}

const ProphetStories = () => {
  const { settings } = useSettings();
  const [selectedStory, setSelectedStory] = React.useState<Story | null>(null);
  const navigate = useNavigate();

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
      icon: Ship,
      nameAr: 'نوح عليه السلام',
      nameEn: 'Prophet Nuh (AS)',
      descriptionAr: 'صانع السفينة والداعي إلى الله',
      descriptionEn: 'Builder of the Ark',
      storyAr: 'دعا نوح قومه إلى عبادة الله وحده تسعمائة وخمسين سنة، لكنهم أصروا على الكفر والعناد. أمر الله نوحاً ببناء سفينة عظيمة، فبناها وحمل فيها من كل زوجين اثنين ومن آمن معه. أرسل الله الطوفان فأغرق الكافرين جميعاً، ونجى نوحاً ومن معه في السفينة. استقرت السفينة على جبل الجودي، وأصبح نوح أباً ثانياً للبشرية.',
      storyEn: 'Prophet Nuh (AS) called his people to worship Allah alone for 950 years, but they persisted in disbelief and stubbornness. Allah commanded Nuh to build a great ark, so he built it and loaded pairs of every species and those who believed with him. Allah sent the flood which drowned all the disbelievers, and saved Nuh and those with him in the ark. The ark settled on Mount Judi, and Nuh became a second father to mankind.'
    },
    {
      id: 3,
      icon: Mountain,
      nameAr: 'إبراهيم عليه السلام',
      nameEn: 'Prophet Ibrahim (AS)',
      descriptionAr: 'خليل الرحمن وأبو الأنبياء',
      descriptionEn: 'Friend of Allah and Father of Prophets',
      storyAr: 'حطم إبراهيم الأصنام ودعا قومه إلى التوحيد. ألقاه قومه في النار فجعلها الله برداً وسلاماً عليه. هاجر إلى الشام ثم إلى مصر. رزقه الله بإسماعيل من هاجر وإسحاق من سارة. أمره الله ببناء الكعبة مع ابنه إسماعيل. ابتلاه الله بذبح ابنه فاستجاب، ففداه الله بكبش عظيم. كان إبراهيم قدوة في التوحيد والتوكل على الله.',
      storyEn: 'Ibrahim (AS) destroyed the idols and called his people to monotheism. His people threw him into fire, but Allah made it cool and safe for him. He migrated to Sham then to Egypt. Allah blessed him with Ismail from Hajar and Ishaq from Sarah. Allah commanded him to build the Kaaba with his son Ismail. Allah tested him with sacrificing his son, and he responded, so Allah ransomed him with a great ram. Ibrahim was a role model in monotheism and trust in Allah.'
    },
    {
      id: 4,
      icon: Star,
      nameAr: 'يوسف عليه السلام',
      nameEn: 'Prophet Yusuf (AS)',
      descriptionAr: 'الصديق وصاحب الرؤيا',
      descriptionEn: 'The Truthful and Interpreter of Dreams',
      storyAr: 'رأى يوسف رؤيا أن أحد عشر كوكباً والشمس والقمر يسجدون له. حسده إخوته فألقوه في البئر. بيع عبداً في مصر، وراودته امرأة العزيز فأبى فسجن. فسر رؤيا الملك فأخرج من السجن وصار عزيز مصر. جاءه إخوته يطلبون الطعام فعفا عنهم. جمع الله شمله بأبيه يعقوب وتحققت رؤياه.',
      storyEn: 'Yusuf (AS) saw a dream that eleven stars, the sun and the moon were prostrating to him. His brothers envied him and threw him in a well. He was sold as a slave in Egypt, and the wife of Al-Aziz tried to seduce him but he refused and was imprisoned. He interpreted the king\'s dream and was released from prison and became the minister of Egypt. His brothers came to him seeking food and he forgave them. Allah reunited him with his father Yaqub and his dream came true.'
    },
    {
      id: 5,
      icon: Scroll,
      nameAr: 'موسى عليه السلام',
      nameEn: 'Prophet Musa (AS)',
      descriptionAr: 'كليم الله وصاحب التوراة',
      descriptionEn: 'The One Who Spoke to Allah',
      storyAr: 'ولد موسى في زمن فرعون الذي كان يقتل الأطفال. ألقته أمه في اليم فالتقطه آل فرعون. كلمه الله من الشجرة وأرسله إلى فرعون بالآيات التسع. أنجاه الله وقومه من فرعون بشق البحر. أنزل الله عليه التوراة في الطور. قاد بني إسرائيل أربعين سنة في التيه.',
      storyEn: 'Musa (AS) was born during the time of Pharaoh who was killing children. His mother cast him into the river and Pharaoh\'s family picked him up. Allah spoke to him from the tree and sent him to Pharaoh with nine signs. Allah saved him and his people from Pharaoh by parting the sea. Allah revealed the Torah to him at Mount Sinai. He led the Children of Israel for forty years in the wilderness.'
    },
    {
      id: 6,
      icon: Wind,
      nameAr: 'عيسى عليه السلام',
      nameEn: 'Prophet Isa (AS)',
      descriptionAr: 'المسيح ابن مريم',
      descriptionEn: 'The Messiah, Son of Mary',
      storyAr: 'ولد عيسى من مريم العذراء بمعجزة من الله بلا أب. تكلم في المهد وأيده الله بالمعجزات: يحيي الموتى ويبرئ الأكمه والأبرص بإذن الله. أنزل الله عليه الإنجيل. حاول اليهود قتله فرفعه الله إليه وألقى شبهه على غيره. سينزل في آخر الزمان ويحكم بشريعة محمد صلى الله عليه وسلم.',
      storyEn: 'Isa (AS) was born to Virgin Mary as a miracle from Allah without a father. He spoke in the cradle and Allah supported him with miracles: he brought the dead to life and healed the blind and leper by Allah\'s permission. Allah revealed the Gospel to him. The Jews tried to kill him but Allah raised him to Himself and cast his likeness on another. He will descend at the end of time and rule by the law of Muhammad (peace be upon him).'
    },
    {
      id: 7,
      icon: Moon,
      nameAr: 'محمد صلى الله عليه وسلم',
      nameEn: 'Prophet Muhammad (ﷺ)',
      descriptionAr: 'خاتم الأنبياء والمرسلين',
      descriptionEn: 'The Final Prophet and Messenger',
      storyAr: 'ولد في مكة يتيماً، وكان يلقب بالصادق الأمين. نزل عليه الوحي في غار حراء وهو في الأربعين من عمره. دعا إلى التوحيد فعذبه قومه، فهاجر إلى المدينة. نصره الله في بدر وفتح مكة. أنزل الله عليه القرآن معجزة خالدة. توفي بعد أن أكمل الله الدين وأتم النعمة.',
      storyEn: 'He was born in Makkah as an orphan and was known as Al-Sadiq Al-Amin (The Truthful, The Trustworthy). Revelation came to him in Cave Hira when he was forty years old. He called to monotheism and his people tortured him, so he migrated to Madinah. Allah gave him victory at Badr and he conquered Makkah. Allah revealed the Quran to him as an eternal miracle. He passed away after Allah completed the religion and perfected His favor.'
    },
    {
      id: 8,
      icon: Heart,
      nameAr: 'أيوب عليه السلام',
      nameEn: 'Prophet Ayyub (AS)',
      descriptionAr: 'صاحب الصبر والابتلاء',
      descriptionEn: 'The Patient One',
      storyAr: 'كان أيوب نبياً غنياً صاحب مال وأولاد. ابتلاه الله بفقدان ماله وأولاده ثم بمرض شديد استمر سنوات طويلة. صبر أيوب صبراً جميلاً ولم يشتك إلا إلى الله. دعا ربه فاستجاب له وشفاه ورد عليه ماله وأولاده ومثلهم معهم. ضرب الله به المثل في الصبر على البلاء.',
      storyEn: 'Ayyub (AS) was a wealthy prophet with property and children. Allah tested him with the loss of his wealth and children, then with severe illness that lasted many years. Ayyub was patient and only complained to Allah. He called upon his Lord who answered him, healed him, and restored his wealth and children and doubled them. Allah made him an example of patience in adversity.'
    },
    {
      id: 9,
      icon: Fish,
      nameAr: 'يونس عليه السلام',
      nameEn: 'Prophet Yunus (AS)',
      descriptionAr: 'صاحب الحوت',
      descriptionEn: 'Companion of the Whale',
      storyAr: 'دعا يونس قومه فلم يؤمنوا، فتركهم غاضباً قبل أن يأذن الله له. ركب سفينة فألقوه في البحر فالتقمه الحوت. سبح الله في بطن الحوت: "لا إله إلا أنت سبحانك إني كنت من الظالمين". استجاب الله دعاءه فنجاه وألقاه على الساحل. رجع إلى قومه فوجدهم قد آمنوا.',
      storyEn: 'Yunus (AS) called his people but they did not believe, so he left them in anger before Allah permitted him. He boarded a ship and they threw him into the sea where a whale swallowed him. He glorified Allah in the belly of the whale: "There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers." Allah answered his prayer, saved him, and cast him on the shore. He returned to his people and found they had believed.'
    },
    {
      id: 10,
      icon: Crown,
      nameAr: 'سليمان عليه السلام',
      nameEn: 'Prophet Sulaiman (AS)',
      descriptionAr: 'النبي الملك',
      descriptionEn: 'The Prophet King',
      storyAr: 'ورث سليمان الملك والنبوة من أبيه داود. علمه الله منطق الطير وسخر له الجن والريح. بنى المسجد الأقصى. أتته ملكة سبأ بعد أن دعاها للإسلام فأسلمت. كان يحكم بالعدل ويشكر الله على نعمه. سأل الله ملكاً لا ينبغي لأحد من بعده فأعطاه الله ذلك.',
      storyEn: 'Sulaiman (AS) inherited kingship and prophethood from his father Dawud. Allah taught him the language of birds and subjected to him the jinn and the wind. He built Al-Aqsa Mosque. The Queen of Sheba came to him after he invited her to Islam and she accepted. He ruled with justice and thanked Allah for His blessings. He asked Allah for a kingdom that no one after him would have, and Allah granted him that.'
    },
    {
      id: 11,
      icon: Book,
      nameAr: 'داود عليه السلام',
      nameEn: 'Prophet Dawud (AS)',
      descriptionAr: 'صاحب الزبور',
      descriptionEn: 'Recipient of the Psalms',
      storyAr: 'كان داود راعياً ثم أصبح ملكاً ونبياً. قتل جالوت الجبار وهو فتى صغير. أنزل الله عليه الزبور وأعطاه صوتاً جميلاً يسبح به. كانت الجبال والطير تسبح معه. ألان الله له الحديد فكان يصنع الدروع. حكم بالعدل بين الناس وكان كثير العبادة والتسبيح.',
      storyEn: 'Dawud (AS) was a shepherd then became a king and prophet. He killed the giant Goliath when he was a young boy. Allah revealed the Psalms to him and gave him a beautiful voice to glorify with. The mountains and birds would glorify with him. Allah made iron soft for him so he could make armor. He ruled with justice among people and was devoted to worship and glorification.'
    },
    {
      id: 12,
      icon: TreePine,
      nameAr: 'زكريا عليه السلام',
      nameEn: 'Prophet Zakariya (AS)',
      descriptionAr: 'والد يحيى عليه السلام',
      descriptionEn: 'Father of Yahya (AS)',
      storyAr: 'كان زكريا نبياً كبير السن وزوجته عاقر. رأى كرامة مريم فدعا الله أن يرزقه ولداً صالحاً. استجاب الله دعاءه وبشره بيحيى. جعل الله له آية ألا يكلم الناس ثلاثة أيام إلا رمزاً. رزقه الله بيحيى في شيخوخته فشكر الله وحمده.',
      storyEn: 'Zakariya (AS) was an elderly prophet and his wife was barren. He saw the miracle of Maryam and prayed to Allah to grant him a righteous child. Allah answered his prayer and gave him glad tidings of Yahya. Allah made it a sign for him that he would not speak to people for three days except by gesture. Allah blessed him with Yahya in his old age, so he thanked and praised Allah.'
    }
  ];

  if (selectedStory) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSelectedStory(null)}
          className="fixed top-6 left-6 z-50 rounded-full w-10 h-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="text-center space-y-4 pt-8">
          {React.createElement(selectedStory.icon, { className: "h-16 w-16 mx-auto text-primary mb-4" })}
          <h1 className="text-4xl md:text-5xl font-bold">
            {settings.language === 'ar' ? selectedStory.nameAr : selectedStory.nameEn}
          </h1>
          <p className="text-muted-foreground text-lg">
            {settings.language === 'ar' ? selectedStory.descriptionAr : selectedStory.descriptionEn}
          </p>
        </div>

        <div className="glass-effect rounded-3xl p-8 border border-border/30 backdrop-blur-xl">
          <p className={`text-lg leading-relaxed ${settings.language === 'ar' ? 'text-right' : ''}`}>
            {settings.language === 'ar' ? selectedStory.storyAr : selectedStory.storyEn}
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
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      <div className="text-center space-y-4 pt-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {settings.language === 'ar' ? 'قصص الأنبياء' : 'Prophet Stories'}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light">
          {settings.language === 'ar'
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
                    {settings.language === 'ar' ? story.nameAr : story.nameEn}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {settings.language === 'ar' ? story.descriptionAr : story.descriptionEn}
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
