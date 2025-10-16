import { useNavigate } from "react-router-dom";
import { useSettings } from "@/contexts/SettingsContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Swords, Crown, Castle, Flag, Star } from "lucide-react";

type TCrusade = {
  icon: any;
  nameAr: string;
  nameEn: string;
  yearAr: string;
  yearEn: string;
  descAr: string;
  descEn: string;
  resultAr: string;
  resultEn: string;
  gradient: string;
  iconBg: string;
  iconColor: string;
};

const IslamicCrusades = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const ar = settings.language === "ar";
  const back = ar ? "رجوع" : "Back";

  const crusades: TCrusade[] = [
    {
      icon: Swords,
      nameAr: "الحملة الصليبية الأولى",
      nameEn: "First Crusade",
      yearAr: "489-492هـ / 1096-1099م",
      yearEn: "489-492 AH / 1096-1099 CE",
      descAr: "دعا البابا أوربان الثاني إلى حملة صليبية \"لتحرير القدس\". سار مئات الآلاف من أوروبا، واستولوا على أنطاكية (1098م) ثم القدس (1099م) في مذبحة رهيبة. أسسوا ممالك صليبية: بيت المقدس، أنطاكية، الرها، طرابلس. كان المسلمون منقسمين بين السلاجقة والفاطميين.",
      descEn: "Pope Urban II called for crusade to \"liberate Jerusalem.\" Hundreds of thousands marched from Europe, captured Antioch (1098) then Jerusalem (1099) in terrible massacre. Established Crusader kingdoms: Jerusalem, Antioch, Edessa, Tripoli. Muslims were divided between Seljuks and Fatimids.",
      resultAr: "سقوط القدس وإنشاء الممالك الصليبية",
      resultEn: "Fall of Jerusalem, establishment of Crusader kingdoms",
      gradient: "from-red-500/20 via-orange-400/20 to-rose-500/20",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600 dark:text-red-400",
    },
    {
      icon: Star,
      nameAr: "عماد الدين زنكي وسقوط الرها",
      nameEn: "Imad ad-Din Zengi & Fall of Edessa",
      yearAr: "539هـ / 1144م",
      yearEn: "539 AH / 1144 CE",
      descAr: "عماد الدين زنكي أمير حلب والموصل، أول من بدأ الجهاد الجاد ضد الصليبيين. استعاد الرها (1144م)، أول مملكة صليبية تسقط، وكان هذا بداية التحول. اغتيل بعدها بسنتين، وورثه ابنه نور الدين محمود الذي وحّد الشام تحت راية الجهاد.",
      descEn: "Imad ad-Din Zengi, Emir of Aleppo and Mosul, first to begin serious jihad against Crusaders. Recaptured Edessa (1144), first Crusader state to fall, marking turning point. Assassinated two years later; succeeded by son Nur ad-Din Mahmud who unified Levant under jihad banner.",
      resultAr: "بداية المقاومة المنظمة واستعادة الرها",
      resultEn: "Beginning of organized resistance, recapture of Edessa",
      gradient: "from-emerald-500/20 via-teal-400/20 to-cyan-500/20",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Shield,
      nameAr: "الحملة الصليبية الثانية",
      nameEn: "Second Crusade",
      yearAr: "543-549هـ / 1147-1154م",
      yearEn: "543-549 AH / 1147-1154 CE",
      descAr: "بعد سقوط الرها، دعا البابا لحملة ثانية بقيادة ملوك فرنسا وألمانيا. حاصروا دمشق لكن نور الدين محمود دافع عنها بنجاح. فشلت الحملة فشلاً ذريعاً، وعزز ذلك مكانة نور الدين الذي واصل توحيد الشام ومصر تحت راية واحدة.",
      descEn: "After fall of Edessa, Pope called Second Crusade led by French and German kings. They besieged Damascus but Nur ad-Din successfully defended it. Crusade failed utterly, strengthening Nur ad-Din's position as he continued unifying Levant and Egypt under one banner.",
      resultAr: "فشل الحملة وتعزيز موقف المسلمين",
      resultEn: "Crusade failure, strengthening of Muslim position",
      gradient: "from-blue-500/20 via-indigo-400/20 to-violet-500/20",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: Crown,
      nameAr: "صلاح الدين الأيوبي وتوحيد الأمة",
      nameEn: "Salah ad-Din & Unification of Ummah",
      yearAr: "564-589هـ / 1169-1193م",
      yearEn: "564-589 AH / 1169-1193 CE",
      descAr: "صلاح الدين يوسف بن أيوب وزير نور الدين في مصر، أنهى الدولة الفاطمية (1171م) ووحّد مصر والشام. بنى جيشاً قوياً وأعاد الوحدة للأمة. كان عادلاً رحيماً شجاعاً، أحبه المسلمون والصليبيون على السواء. استعد لتحرير القدس بصبر وحكمة.",
      descEn: "Salah ad-Din Yusuf ibn Ayyub, Nur ad-Din's vizier in Egypt, ended Fatimid state (1171) and unified Egypt and Levant. Built strong army and restored unity to ummah. Just, merciful and brave; loved by Muslims and Crusaders alike. Prepared to liberate Jerusalem with patience and wisdom.",
      resultAr: "توحيد مصر والشام، الاستعداد للجهاد",
      resultEn: "Unification of Egypt and Levant, preparation for jihad",
      gradient: "from-amber-500/20 via-orange-400/20 to-yellow-500/20",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: Swords,
      nameAr: "معركة حطين",
      nameEn: "Battle of Hattin",
      yearAr: "24 ربيع الثاني 583هـ / 4 يوليو 1187م",
      yearEn: "24 Rabi al-Thani 583 AH / 4 July 1187 CE",
      descAr: "معركة فاصلة بين صلاح الدين (30,000 مقاتل) والصليبيين بقيادة ملك القدس (20,000). نصب صلاح الدين كميناً محكماً قرب قرون حطين، ومنع الصليبيين من الماء في صحراء الصيف. انتصر انتصاراً ساحقاً، وأسر الملك وأمراء الصليبيين. فتحت المعركة الطريق لتحرير القدس.",
      descEn: "Decisive battle between Salah ad-Din (30,000 fighters) and Crusaders led by King of Jerusalem (20,000). Salah ad-Din set masterful trap near Horns of Hattin, denied Crusaders water in summer desert. Won crushing victory, captured king and Crusader princes. Battle opened way to liberate Jerusalem.",
      resultAr: "نصر ساحق، الطريق إلى تحرير القدس مفتوح",
      resultEn: "Crushing victory, way to Jerusalem liberation opened",
      gradient: "from-green-500/20 via-emerald-400/20 to-teal-500/20",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600 dark:text-green-400",
    },
    {
      icon: Castle,
      nameAr: "تحرير القدس",
      nameEn: "Liberation of Jerusalem",
      yearAr: "27 رجب 583هـ / 2 أكتوبر 1187م",
      yearEn: "27 Rajab 583 AH / 2 October 1187 CE",
      descAr: "بعد حطين بثلاثة أشهر، حاصر صلاح الدين القدس وفتحها سلماً. عامل أهلها بالرحمة والعدل، عكس ما فعل الصليبيون عند احتلالها. سمح للنصارى بالبقاء أو الرحيل بأمان. طهّر المسجد الأقصى من الصلبان، وأقام فيه صلاة الجمعة بعد 88 عاماً من الاحتلال.",
      descEn: "Three months after Hattin, Salah ad-Din besieged and peacefully liberated Jerusalem. Treated its people with mercy and justice, opposite of Crusader conquest. Allowed Christians to stay or leave safely. Purified Al-Aqsa from crosses; Friday prayer held after 88 years of occupation.",
      resultAr: "تحرير القدس، رحمة وعدل صلاح الدين",
      resultEn: "Liberation of Jerusalem, Salah ad-Din's mercy and justice",
      gradient: "from-yellow-500/20 via-amber-400/20 to-orange-500/20",
      iconBg: "bg-yellow-500/10",
      iconColor: "text-yellow-600 dark:text-yellow-400",
    },
    {
      icon: Flag,
      nameAr: "الحملة الصليبية الثالثة",
      nameEn: "Third Crusade",
      yearAr: "585-588هـ / 1189-1192م",
      yearEn: "585-588 AH / 1189-1192 CE",
      descAr: "رد أوروبا على سقوط القدس: ثلاثة ملوك (إنجلترا وفرنسا وألمانيا) قادوا حملة ضخمة. ريتشارد قلب الأسد واجه صلاح الدين في معارك عدة (أرسوف، يافا). لم يستطع استعادة القدس. انتهت بصلح الرملة: احتفظ صلاح الدين بالقدس، وسُمح للحجاج المسيحيين بزيارتها.",
      descEn: "Europe's response to Jerusalem fall: three kings (England, France, Germany) led massive crusade. Richard the Lionheart faced Salah ad-Din in several battles (Arsuf, Jaffa). Could not recapture Jerusalem. Ended with Treaty of Ramla: Salah ad-Din kept Jerusalem; Christian pilgrims allowed to visit.",
      resultAr: "القدس تبقى إسلامية، معاهدة الرملة",
      resultEn: "Jerusalem remains Islamic, Treaty of Ramla",
      gradient: "from-purple-500/20 via-pink-400/20 to-rose-500/20",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: Shield,
      nameAr: "الحملات اللاحقة ونهاية الحروب الصليبية",
      nameEn: "Later Crusades & End of Crusades",
      yearAr: "600-690هـ / 1204-1291م",
      yearEn: "600-690 AH / 1204-1291 CE",
      descAr: "تتالت حملات صليبية أخرى (الرابعة، الخامسة، السادسة، السابعة، الثامنة)، لكن كلها فشلت. الحملة الرابعة انحرفت ونهبت القسطنطينية المسيحية! الملك الكامل سلّم القدس مؤقتاً للصليبيين (1229-1244م) لكن استُعيدت. الظاهر بيبرس والمنصور قلاوون والأشرف خليل قضوا على آخر معاقل الصليبيين: عكا (1291م).",
      descEn: "More crusades followed (4th-8th), all failed. Fourth Crusade diverted and sacked Christian Constantinople! Al-Kamil temporarily ceded Jerusalem to Crusaders (1229-1244) but it was recaptured. Baybars, Qalawun and Khalil eliminated last Crusader strongholds: Acre (1291).",
      resultAr: "نهاية الحروب الصليبية، تحرير كامل للشام",
      resultEn: "End of Crusades, complete liberation of Levant",
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
            {ar ? "الحروب الصليبية" : "The Crusades"}
          </h1>
        </div>

        <p className="text-muted-foreground text-base md:text-lg">
          {ar
            ? "صلاح الدين الأيوبي، معركة حطين، وتحرير القدس من الصليبيين"
            : "Salah ad-Din al-Ayyubi, Battle of Hattin, and liberation of Jerusalem"}
        </p>

        <div className="grid gap-4">
          {crusades.map((crusade, i) => {
            const Icon = crusade.icon;
            return (
              <div key={i} className="relative overflow-hidden group">
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${crusade.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 smooth-transition`}
                />
                <Card className="relative glass-effect hover:glass-effect-hover smooth-transition p-6 border border-border/30">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${crusade.iconBg} flex items-center justify-center group-hover:scale-105 smooth-transition`}>
                      <Icon className={`h-6 w-6 ${crusade.iconColor}`} />
                    </div>

                    <div className="flex-1 min-w-0 space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">
                          {ar ? crusade.nameAr : crusade.nameEn}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {ar ? crusade.yearAr : crusade.yearEn}
                        </p>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {ar ? crusade.descAr : crusade.descEn}
                      </p>

                      <div className="rounded-lg bg-background/60 border border-border/40 p-3">
                        <div className="text-foreground/80 font-medium mb-1 text-sm">
                          {ar ? "النتيجة" : "Result"}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {ar ? crusade.resultAr : crusade.resultEn}
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

export default IslamicCrusades;