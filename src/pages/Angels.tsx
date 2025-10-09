import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Angels = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const isArabic = settings.language === 'ar';

  const content = {
    title: isArabic ? 'الملائكة' : 'Angels',
    back: isArabic ? 'رجوع' : 'Back',
    intro: isArabic
      ? 'الملائكة مخلوقات نورانية خلقها الله من نور، لا يعصون الله ما أمرهم ويفعلون ما يؤمرون'
      : 'Angels are beings of light created by Allah from light, who never disobey Allah and do as they are commanded',
  };

  const angels = [
    {
      nameAr: 'جبريل عليه السلام',
      nameEn: 'Jibril (Gabriel)',
      roleAr: 'ملك الوحي',
      roleEn: 'Angel of Revelation',
      descAr: 'أعظم الملائكة، موكل بإنزال الوحي على الأنبياء والرسل',
      descEn: 'The greatest angel, responsible for delivering revelation to prophets and messengers',
    },
    {
      nameAr: 'ميكائيل عليه السلام',
      nameEn: 'Mika\'il (Michael)',
      roleAr: 'ملك الرزق',
      roleEn: 'Angel of Sustenance',
      descAr: 'موكل بإنزال المطر وإنبات النبات والرزق',
      descEn: 'Responsible for bringing rain, plant growth, and provisions',
    },
    {
      nameAr: 'إسرافيل عليه السلام',
      nameEn: 'Israfil',
      roleAr: 'ملك الصور',
      roleEn: 'Angel of the Trumpet',
      descAr: 'موكل بالنفخ في الصور يوم القيامة',
      descEn: 'Tasked with blowing the trumpet on the Day of Judgment',
    },
    {
      nameAr: 'ملك الموت عليه السلام',
      nameEn: 'Malak al-Mawt (Azrael)',
      roleAr: 'ملك الموت',
      roleEn: 'Angel of Death',
      descAr: 'موكل بقبض الأرواح عند الموت',
      descEn: 'Responsible for taking souls at the time of death',
    },
    {
      nameAr: 'رضوان عليه السلام',
      nameEn: 'Ridwan',
      roleAr: 'خازن الجنة',
      roleEn: 'Guardian of Paradise',
      descAr: 'موكل بحراسة أبواب الجنة',
      descEn: 'Guardian of the gates of Paradise',
    },
    {
      nameAr: 'مالك عليه السلام',
      nameEn: 'Malik',
      roleAr: 'خازن النار',
      roleEn: 'Guardian of Hellfire',
      descAr: 'موكل بحراسة جهنم وأهلها',
      descEn: 'Guardian over Hellfire and its inhabitants',
    },
    {
      nameAr: 'منكر ونكير',
      nameEn: 'Munkar and Nakir',
      roleAr: 'ملائكة القبر',
      roleEn: 'Angels of the Grave',
      descAr: 'موكلان بسؤال الميت في قبره',
      descEn: 'Responsible for questioning the deceased in their grave',
    },
    {
      nameAr: 'الكرام الكاتبون',
      nameEn: 'Kiraman Katibin',
      roleAr: 'الحفظة',
      roleEn: 'The Noble Recorders',
      descAr: 'موكلون بكتابة أعمال العباد، عن اليمين والشمال',
      descEn: 'Assigned to record the deeds of humans, one on the right and one on the left',
    },
    {
      nameAr: 'الملائكة الحملة',
      nameEn: 'Hamalat al-Arsh',
      roleAr: 'حملة العرش',
      roleEn: 'Bearers of the Throne',
      descAr: 'ثمانية من الملائكة يحملون عرش الرحمن',
      descEn: 'Eight angels who carry the Throne of the Most Merciful',
    },
    {
      nameAr: 'الزبانية',
      nameEn: 'Az-Zabaniyah',
      roleAr: 'ملائكة العذاب',
      roleEn: 'Angels of Punishment',
      descAr: 'تسعة عشر ملكاً موكلون بتعذيب أهل النار',
      descEn: 'Nineteen angels tasked with punishing the people of Hellfire',
    },
    {
      nameAr: 'ملائكة الرحمة',
      nameEn: 'Angels of Mercy',
      roleAr: 'ملائكة الرحمة',
      roleEn: 'Angels of Mercy',
      descAr: 'ينزلون بالرحمة والبركة على المؤمنين',
      descEn: 'Descend with mercy and blessings upon believers',
    },
    {
      nameAr: 'ملائكة العذاب',
      nameEn: 'Angels of Punishment',
      roleAr: 'ملائكة العذاب',
      roleEn: 'Angels of Punishment',
      descAr: 'ينزلون بالعذاب على الكافرين والعصاة',
      descEn: 'Descend with punishment upon disbelievers and sinners',
    },
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{content.title}</h1>
          </div>
        </div>

        <p className="text-muted-foreground text-center mb-8">{content.intro}</p>

        <div className="grid gap-4">
          {angels.map((angel, index) => (
            <Card key={index} className="hover:shadow-lg smooth-transition">
              <CardHeader>
                <CardTitle className="text-xl">
                  <div className="flex flex-col gap-2">
                    <span className="text-primary">{isArabic ? angel.nameAr : angel.nameEn}</span>
                    <span className="text-sm font-normal text-muted-foreground">
                      {isArabic ? angel.roleAr : angel.roleEn}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{isArabic ? angel.descAr : angel.descEn}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Angels;
