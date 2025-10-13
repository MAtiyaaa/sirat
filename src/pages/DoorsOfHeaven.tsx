import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Sparkles } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const DoorsOfHeaven = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();

  const content = {
    title: settings.language === 'ar' ? 'أبواب الجنة' : 'Doors of Paradise',
    back: settings.language === 'ar' ? 'رجوع' : 'Back',
    description: settings.language === 'ar' 
      ? 'تعرف على الأبواب الثمانية للجنة ومن يدخل منها'
      : 'Learn about the eight doors of Paradise and who enters through them',
    intro: settings.language === 'ar'
      ? 'للجنة ثمانية أبواب، كل باب منها يدخل منه أهل عمل معين من الأعمال الصالحة. ومن كان من أهل عمل من الأعمال دُعي من بابه الذي يناسب عمله.'
      : 'Paradise has eight doors. Each door admits people who excelled in specific righteous deeds. Those who excelled in a deed will be called from the door that matches their actions.',
    details: settings.language === 'ar' ? 'التفاصيل' : 'Details',
    references: settings.language === 'ar' ? 'المراجع' : 'References',
    whoEnters: settings.language === 'ar' ? 'من يدخل منه' : 'Who Enters',
  };

  const doors = [
    {
      nameAr: "باب الصلاة",
      nameEn: "Door of Prayer (Bab as-Salah)",
      whoEnters: {
        ar: "المداومون على الصلوات الخمس في أوقاتها",
        en: "Those who consistently performed the five daily prayers on time"
      },
      description: {
        ar: "باب خاص بأهل الصلاة الذين حافظوا عليها في أوقاتها وأتموا أركانها وخشعوا فيها",
        en: "A special door for those who maintained their prayers on time, completed their pillars, and had humility in them"
      },
      details: {
        ar: "هذا الباب يدخل منه من حافظ على الصلوات الخمس في أوقاتها، وأداها بخشوع وطمأنينة، واستشعر عظمة الله فيها. الصلاة عماد الدين وأول ما يحاسب عليه العبد يوم القيامة، فمن حافظ عليها كانت له نوراً وبرهاناً ونجاةً يوم القيامة.",
        en: "This door admits those who maintained the five daily prayers on time, performed them with humility and tranquility, and felt Allah's greatness in them. Prayer is the pillar of religion and the first thing a servant will be accountable for on the Day of Judgment. Those who maintain it will have light, proof, and salvation on the Day of Judgment."
      },
      references: [
        {
          source: "Hadith",
          reference: "Sahih Muslim",
          text: {
            ar: "من توضأ فأحسن الوضوء، ثم أتى الجمعة فاستمع وأنصت، غفر له ما بينه وبين الجمعة وزيادة ثلاثة أيام",
            en: "Whoever performs ablution perfectly and then goes to Friday prayer, listens attentively, will have his sins between that Friday and the next forgiven, plus three more days"
          }
        }
      ]
    },
    {
      nameAr: "باب الريان",
      nameEn: "Door of Ar-Rayyan",
      whoEnters: {
        ar: "الصائمون",
        en: "Those who fasted"
      },
      description: {
        ar: "باب مخصص للصائمين الذين صاموا رمضان وتطوعاً لله",
        en: "A door designated for those who fasted Ramadan and voluntary fasts for Allah"
      },
      details: {
        ar: "الريان باب من أبواب الجنة لا يدخله إلا الصائمون، فإذا دخلوا أُغلق فلا يدخل منه أحد غيرهم. سُمي الريان لأن الصائمين يصيبهم الظمأ في الدنيا من صيامهم، فيُسقون من هذا الباب حين يدخلونه فلا يظمأون بعده أبداً. وهذا من كرامة الله للصائمين.",
        en: "Ar-Rayyan is a door of Paradise that only those who fasted will enter. When they enter, it will be closed and no one else will enter through it. It's named Ar-Rayyan (the well-watered) because those who fasted experienced thirst in this world from their fasting, so they will be given drink from this door when they enter it and will never thirst after that. This is from Allah's honor for those who fasted."
      },
      references: [
        {
          source: "Hadith",
          reference: "Sahih Bukhari",
          text: {
            ar: "إن في الجنة باباً يقال له الريان، يدخل منه الصائمون يوم القيامة، لا يدخل منه أحد غيرهم",
            en: "There is a gate in Paradise called Ar-Rayyan, through which only those who fasted will enter on the Day of Resurrection, and no one else will enter through it"
          }
        }
      ]
    },
    {
      nameAr: "باب الصدقة",
      nameEn: "Door of Charity (Bab as-Sadaqah)",
      whoEnters: {
        ar: "المتصدقون",
        en: "Those who gave charity"
      },
      description: {
        ar: "باب لأهل الصدقة الذين أنفقوا أموالهم في سبيل الله",
        en: "A door for those of charity who spent their wealth in the way of Allah"
      },
      details: {
        ar: "يدخل من هذا الباب الذين كانوا يتصدقون بأموالهم ابتغاء مرضاة الله، سواء كانت صدقة واجبة كالزكاة أو صدقة تطوع. الصدقة تطفئ الخطيئة كما يطفئ الماء النار، وتظل صاحبها يوم القيامة. والله يضاعف الصدقة لصاحبها أضعافاً كثيرة.",
        en: "Those who gave charity with their wealth seeking Allah's pleasure will enter through this door, whether it was obligatory charity like Zakat or voluntary charity. Charity extinguishes sin as water extinguishes fire, and it will shade its giver on the Day of Judgment. Allah multiplies charity for its giver many times over."
      },
      references: [
        {
          source: "Quran",
          reference: "2:261",
          text: {
            ar: "مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ",
            en: "The example of those who spend their wealth in the way of Allah is like a seed that produces seven ears, in each ear is a hundred grains"
          }
        }
      ]
    },
    {
      nameAr: "باب الحج",
      nameEn: "Door of Hajj (Bab al-Hajj)",
      whoEnters: {
        ar: "الحجاج والمعتمرون",
        en: "Those who performed Hajj and Umrah"
      },
      description: {
        ar: "باب لمن حج واعتمر وأدى النسك خالصاً لله",
        en: "A door for those who performed Hajj and Umrah purely for Allah's sake"
      },
      details: {
        ar: "يدخل من هذا الباب من أدى فريضة الحج أو عمرة مبرورة، وزار بيت الله الحرام تعظيماً لله وطاعةً له. الحج المبرور ليس له جزاء إلا الجنة، وهو من أفضل الأعمال عند الله. من حج فلم يرفث ولم يفسق رجع من ذنوبه كيوم ولدته أمه.",
        en: "Those who fulfilled the obligation of Hajj or performed an accepted Umrah, and visited the Sacred House of Allah in glorification and obedience to Him, will enter through this door. An accepted Hajj has no reward except Paradise, and it is among the best deeds with Allah. Whoever performs Hajj without committing obscenity or sin returns from his sins as the day his mother bore him."
      },
      references: [
        {
          source: "Hadith",
          reference: "Sahih Bukhari",
          text: {
            ar: "من حج فلم يرفث ولم يفسق رجع كيوم ولدته أمه",
            en: "Whoever performs Hajj and does not commit any obscenity or transgression, will return (free from sins) as the day his mother bore him"
          }
        }
      ]
    },
    {
      nameAr: "باب الجهاد",
      nameEn: "Door of Jihad (Bab al-Jihad)",
      whoEnters: {
        ar: "المجاهدون في سبيل الله",
        en: "Those who strived in the way of Allah"
      },
      description: {
        ar: "باب للمجاهدين الذين قاتلوا في سبيل الله لإعلاء كلمته",
        en: "A door for those who fought in Allah's way to elevate His word"
      },
      details: {
        ar: "يدخل منه من جاهد في سبيل الله بالنفس والمال، ونصر دين الله، وأعلى كلمة الله. الجهاد ذروة سنام الإسلام، ومن قاتل لتكون كلمة الله هي العليا فهو في سبيل الله. وللشهداء منزلة عظيمة عند الله، فهم أحياء عند ربهم يرزقون.",
        en: "Those who strived in Allah's way with their lives and wealth, supported Allah's religion, and elevated Allah's word will enter through it. Jihad is the peak of Islam's hump, and whoever fights so that Allah's word is supreme is in Allah's way. Martyrs have a magnificent status with Allah; they are alive with their Lord, receiving provision."
      },
      references: [
        {
          source: "Quran",
          reference: "3:169",
          text: {
            ar: "وَلَا تَحْسَبَنَّ الَّذِينَ قُتِلُوا فِي سَبِيلِ اللَّهِ أَمْوَاتًا ۚ بَلْ أَحْيَاءٌ عِندَ رَبِّهِمْ يُرْزَقُونَ",
            en: "And never think of those who have been killed in the cause of Allah as dead. Rather, they are alive with their Lord, receiving provision"
          }
        }
      ]
    },
    {
      nameAr: "باب الكاظمين الغيظ",
      nameEn: "Door of Those Who Restrain Anger",
      whoEnters: {
        ar: "من كظم غيظه وعفا عن الناس",
        en: "Those who restrained their anger and forgave people"
      },
      description: {
        ar: "باب لمن كظم غيظه وصبر على الأذى وعفا عمن ظلمه",
        en: "A door for those who restrained their anger, were patient with harm, and forgave those who wronged them"
      },
      details: {
        ar: "يدخل من هذا الباب من ملك نفسه عند الغضب، وعفا عن الناس مع قدرته على الانتقام، وصبر على أذى الآخرين ابتغاء مرضاة الله. وقد وصف الله المتقين بأنهم (الْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ)، ووعدهم بأنهم من المحسنين الذين يحبهم الله.",
        en: "Those who controlled themselves when angry, forgave people despite having the power to retaliate, and were patient with others' harm seeking Allah's pleasure will enter through this door. Allah described the righteous as 'those who restrain anger and pardon people,' and promised them they are among the good-doers whom Allah loves."
      },
      references: [
        {
          source: "Quran",
          reference: "3:134",
          text: {
            ar: "الَّذِينَ يُنفِقُونَ فِي السَّرَّاءِ وَالضَّرَّاءِ وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ",
            en: "Who spend in prosperity and adversity, and who restrain anger and pardon people. And Allah loves the doers of good"
          }
        }
      ]
    },
    {
      nameAr: "باب الأيمن",
      nameEn: "Door of the Right (Bab al-Ayman)",
      whoEnters: {
        ar: "أصحاب اليمين",
        en: "The companions of the right"
      },
      description: {
        ar: "باب لأصحاب اليمين الذين يؤتون كتبهم بأيمانهم",
        en: "A door for the companions of the right who will be given their records in their right hands"
      },
      details: {
        ar: "يدخل منه أصحاب اليمين، وهم المؤمنون الصالحون الذين عملوا الخير في الدنيا. سُموا بأصحاب اليمين لأنهم يأخذون كتبهم بأيمانهم يوم القيامة، وهذه علامة السعادة والفلاح. هؤلاء هم الفائزون الذين أعد الله لهم جنات تجري من تحتها الأنهار.",
        en: "The companions of the right will enter through it - they are the righteous believers who did good in this world. They're called companions of the right because they will take their records with their right hands on the Day of Judgment, which is a sign of happiness and success. These are the winners for whom Allah has prepared gardens beneath which rivers flow."
      },
      references: [
        {
          source: "Quran",
          reference: "56:27-28",
          text: {
            ar: "وَأَصْحَابُ الْيَمِينِ مَا أَصْحَابُ الْيَمِينِ ۝ فِي سِدْرٍ مَّخْضُودٍ",
            en: "The companions of the right - what are the companions of the right? [They will be] among thornless lote trees"
          }
        }
      ]
    },
    {
      nameAr: "باب التوبة / باب الذكر",
      nameEn: "Door of Repentance / Door of Remembrance",
      whoEnters: {
        ar: "التائبون والذاكرون",
        en: "Those who repented and remembered Allah"
      },
      description: {
        ar: "باب للتائبين من ذنوبهم والمكثرين من ذكر الله",
        en: "A door for those who repented from their sins and frequently remembered Allah"
      },
      details: {
        ar: "يدخل من هذا الباب من تاب إلى الله توبة نصوحاً، وندم على ما فعل من الذنوب، وعزم على عدم العودة إليها. وكذلك من أكثر من ذكر الله في قلبه ولسانه، فالذكر من أحب الأعمال إلى الله وأيسرها. والتوبة الصادقة تمحو الذنوب مهما عظمت، والله يفرح بتوبة العبد.",
        en: "Those who repented to Allah sincerely, regretted their sins, and resolved not to return to them will enter through this door. Also those who frequently remembered Allah in their hearts and tongues, as remembrance is among the most beloved and easiest deeds to Allah. Sincere repentance erases sins no matter how great, and Allah rejoices at His servant's repentance."
      },
      references: [
        {
          source: "Quran",
          reference: "39:53",
          text: {
            ar: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ ۚ إِنَّ اللَّهَ يَغْفِرُ الذُّنُوبَ جَمِيعًا",
            en: "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins'"
          }
        }
      ]
    }
  ];

  const features = {
    title: settings.language === 'ar' ? 'نعيم الجنة' : 'Blessings of Paradise',
    items: settings.language === 'ar' 
      ? [
          "أنهار من ماء غير آسن وأنهار من لبن ولم يتغير طعمه وأنهار من خمر لذة للشاربين وأنهار من عسل مصفى",
          "حور عين كأمثال اللؤلؤ المكنون",
          "فواكه كثيرة لا مقطوعة ولا ممنوعة",
          "قصور وخيام من درّ مجوف",
          "فرش مرفوعة وأكواب موضوعة ونمارق مصفوفة",
          "لا يسمع فيها لغو ولا تأثيم",
          "لا موت فيها ولا مرض ولا هرم ولا حزن",
          "رضوان الله الأكبر",
        ]
      : [
          "Rivers of pure water, rivers of milk, rivers of wine delicious to drinkers, and rivers of clarified honey",
          "Fair maidens like hidden pearls",
          "Abundant fruits, never ending and never forbidden",
          "Palaces and pavilions of hollow pearls",
          "Raised couches, placed cups, and arranged cushions",
          "No ill speech therein and no sinful discourse",
          "No death, disease, old age, or sorrow",
          "The greatest pleasure: Allah's satisfaction",
        ]
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4 neomorph hover:neomorph-pressed"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          {content.back}
        </Button>

        <div className="text-center space-y-2 mb-8">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {content.title}
            </h1>
          </div>
          <p className={`text-muted-foreground text-lg max-w-2xl mx-auto ${settings.language === 'ar' ? 'text-right arabic-regal' : ''}`}>
            {content.intro}
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {doors.map((door, index) => (
            <AccordionItem key={index} value={`door-${index}`} className="border-none">
              <Card className="neomorph transition-all hover:neomorph-inset">
                <AccordionTrigger className="px-6 hover:no-underline">
                  <CardHeader className="p-0 w-full">
                    <CardTitle className="text-right md:text-left flex flex-col gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {settings.language === 'ar' ? door.nameAr : door.nameEn}
                      </span>
                      <span className="text-sm font-normal text-muted-foreground">
                        {content.whoEnters}: {settings.language === 'ar' ? door.whoEnters.ar : door.whoEnters.en}
                      </span>
                    </CardTitle>
                  </CardHeader>
                </AccordionTrigger>
                <AccordionContent>
                  <CardContent className="pt-4 space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2 text-primary">
                        {settings.language === 'ar' ? 'الوصف' : 'Description'}
                      </h3>
                      <p className={`text-muted-foreground ${settings.language === 'ar' ? 'text-right' : ''}`}>
                        {settings.language === 'ar' ? door.description.ar : door.description.en}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 text-primary">{content.details}</h3>
                      <p className={`text-muted-foreground leading-relaxed ${settings.language === 'ar' ? 'text-right arabic-regal' : ''}`}>
                        {settings.language === 'ar' ? door.details.ar : door.details.en}
                      </p>
                    </div>

                    {door.references && door.references.length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-primary">{content.references}</h3>
                        <div className="space-y-2">
                          {door.references.map((ref, refIndex) => (
                            <Button
                              key={refIndex}
                              variant="outline"
                              className="w-full justify-start text-left h-auto py-3 neomorph hover:neomorph-pressed"
                              onClick={() => {
                                if (ref.source === 'Quran') {
                                  const surahNum = ref.reference.split(':')[0];
                                  navigate(`/quran/${surahNum}`);
                                }
                              }}
                            >
                              <div className="flex flex-col gap-1 w-full">
                                <div className="font-semibold text-sm">
                                  {ref.source} {ref.reference}
                                </div>
                                <div className={`text-xs text-muted-foreground ${settings.language === 'ar' ? 'text-right arabic-regal' : ''}`}>
                                  {settings.language === 'ar' ? ref.text.ar : ref.text.en}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </AccordionContent>
              </Card>
            </AccordionItem>
          ))}
        </Accordion>

        <Card className="neomorph">
          <CardHeader>
            <CardTitle className="text-2xl text-center text-primary">{features.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className={`space-y-3 ${settings.language === 'ar' ? 'text-right arabic-regal' : ''}`}>
              {features.items.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoorsOfHeaven;
