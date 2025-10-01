import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { Book, Heart, Users, Mountain, Ship, Star } from 'lucide-react';

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
      icon: Ship,
      nameAr: 'نوح عليه السلام',
      nameEn: 'Prophet Noah (AS)',
      descriptionAr: 'قصة النبي نوح والسفينة',
      descriptionEn: 'The story of Prophet Noah and the Ark',
      storyAr: 'بعث الله نوحاً عليه السلام إلى قومه يدعوهم إلى عبادة الله وحده. دعا قومه 950 سنة ولم يؤمن معه إلا قليل. أمره الله ببناء السفينة، فبناها وحمل فيها من كل زوجين اثنين. جاء الطوفان فأهلك الله الكافرين ونجى المؤمنين.',
      storyEn: 'Allah sent Noah (AS) to his people to call them to worship Allah alone. He called his people for 950 years, but only a few believed. Allah commanded him to build the ark, so he built it and carried in it a pair of every species. The flood came and Allah destroyed the disbelievers and saved the believers.'
    },
    {
      id: 2,
      icon: Mountain,
      nameAr: 'إبراهيم عليه السلام',
      nameEn: 'Prophet Abraham (AS)',
      descriptionAr: 'خليل الله',
      descriptionEn: 'The Friend of Allah',
      storyAr: 'إبراهيم عليه السلام خليل الرحمن، حطم الأصنام وواجه قومه بالحق. ألقوه في النار فجعلها الله برداً وسلاماً عليه. أمره الله بذبح ابنه إسماعيل فاستجاب، ففداه الله بكبش عظيم.',
      storyEn: 'Abraham (AS) is the Friend of Allah. He broke the idols and confronted his people with the truth. They threw him into the fire, but Allah made it cool and safe for him. Allah commanded him to sacrifice his son Ishmael, and he responded, so Allah ransomed him with a great sacrifice.'
    },
    {
      id: 3,
      icon: Users,
      nameAr: 'موسى عليه السلام',
      nameEn: 'Prophet Moses (AS)',
      descriptionAr: 'كليم الله',
      descriptionEn: 'The One who spoke to Allah',
      storyAr: 'ولد موسى في زمن فرعون الذي كان يقتل الأطفال. ألقته أمه في النهر فالتقطه آل فرعون. كلمه الله وأرسله إلى فرعون، فكذبه فرعون. أغرقه الله وأنجى موسى ومن معه من المؤمنين.',
      storyEn: 'Moses (AS) was born in the time of Pharaoh who was killing children. His mother cast him into the river and Pharaoh\'s family picked him up. Allah spoke to him and sent him to Pharaoh, but Pharaoh denied him. Allah drowned Pharaoh and saved Moses and the believers with him.'
    },
    {
      id: 4,
      icon: Heart,
      nameAr: 'يوسف عليه السلام',
      nameEn: 'Prophet Joseph (AS)',
      descriptionAr: 'الصديق الجميل',
      descriptionEn: 'The Truthful and Beautiful',
      storyAr: 'كان يوسف أحب أبناء يعقوب إليه. حسده إخوته فألقوه في البئر. بيع عبداً في مصر وابتلي بالسجن ظلماً. صبر واحتسب فجعله الله عزيز مصر وجمعه بأهله.',
      storyEn: 'Joseph (AS) was Jacob\'s most beloved son. His brothers envied him and threw him into a well. He was sold as a slave in Egypt and was imprisoned unjustly. He was patient and Allah made him the minister of Egypt and reunited him with his family.'
    },
    {
      id: 5,
      icon: Book,
      nameAr: 'عيسى عليه السلام',
      nameEn: 'Prophet Jesus (AS)',
      descriptionAr: 'المسيح ابن مريم',
      descriptionEn: 'The Messiah, son of Mary',
      storyAr: 'ولد عيسى من مريم العذراء بمعجزة من الله. تكلم في المهد وهو رضيع. أيده الله بالمعجزات: يحيي الموتى ويبرئ الأكمه والأبرص. رفعه الله إليه ولم يصلبوه.',
      storyEn: 'Jesus (AS) was born to the Virgin Mary by a miracle from Allah. He spoke in the cradle as an infant. Allah supported him with miracles: he gave life to the dead and healed the blind and the leper. Allah raised him up to Him and they did not crucify him.'
    },
    {
      id: 6,
      icon: Star,
      nameAr: 'محمد ﷺ',
      nameEn: 'Prophet Muhammad ﷺ',
      descriptionAr: 'خاتم الأنبياء والمرسلين',
      descriptionEn: 'The Seal of Prophets',
      storyAr: 'محمد صلى الله عليه وسلم خاتم الأنبياء والمرسلين. أرسله الله رحمة للعالمين. نزل عليه القرآن وهو في غار حراء. دعا الناس إلى التوحيد وصبر على الأذى. فتح مكة ونشر الإسلام في الجزيرة العربية.',
      storyEn: 'Muhammad (peace be upon him) is the seal of the prophets. Allah sent him as a mercy to all worlds. The Quran was revealed to him while he was in the cave of Hira. He called people to monotheism and endured harm patiently. He conquered Mecca and spread Islam throughout the Arabian Peninsula.'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-2">
          {settings.language === 'ar' ? 'قصص الأنبياء' : 'Prophet Stories'}
        </h1>
        <p className="text-muted-foreground">
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
