import React, { useEffect, useMemo, useState } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bookmark,
  BookOpen,
  Trash2,
  Loader2,
  ArrowLeft,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { fetchSurahs, Surah } from "@/lib/quran-api";

/* ===================== Types ===================== */
interface BookmarkData {
  id: string;
  surah_number: number;
  ayah_number: number | null;
  bookmark_type: "ayah" | "surah";
  created_at: string;
}
interface HadithBookmark {
  id: string;
  hadith_number: number;
  book_slug: string;
  book_name: string;
  hadith_english: string;
  hadith_arabic: string;
  narrator: string;
  chapter_english: string;
  chapter_arabic: string;
  created_at: string;
}
interface DuaBookmark {
  id: string;
  dua_title: string;
  dua_arabic: string | null;
  dua_transliteration: string | null;
  dua_english: string | null;
  category: string | null;
  created_at: string;
}

/* ===================== Page ===================== */
const Bookmarks: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const langIsAr = settings.language === "ar";

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [quranBms, setQuranBms] = useState<BookmarkData[]>([]);
  const [hadithBms, setHadithBms] = useState<HadithBookmark[]>([]);
  const [duaBms, setDuaBms] = useState<DuaBookmark[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (!session?.user) return;

        const [bm, hbm, dbm, surahList] = await Promise.all([
          supabase.from("bookmarks").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
          supabase.from("hadith_bookmarks").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
          supabase.from("dua_bookmarks").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
          fetchSurahs(),
        ]);

        if (bm.data) setQuranBms(bm.data as BookmarkData[]);
        if (hbm.data) setHadithBms(hbm.data as HadithBookmark[]);
        if (dbm.data) setDuaBms(dbm.data as DuaBookmark[]);
        setSurahs(surahList);
      } catch (e) {
        console.error(e);
        toast.error(langIsAr ? "فشل تحميل المحفوظات" : "Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    })();
  }, [langIsAr]);

  const ayahBms = useMemo(() => quranBms.filter(b => b.bookmark_type === "ayah"), [quranBms]);
  const surahBms = useMemo(() => quranBms.filter(b => b.bookmark_type === "surah"), [quranBms]);

  const getSurahName = (n: number) => {
    const s = surahs.find(x => x.number === n);
    if (!s) return "";
    return langIsAr ? s.name : s.englishName;
  };

  const remove = async (id: string, type: "quran" | "hadith" | "dua") => {
    const table = type === "hadith" ? "hadith_bookmarks" : type === "dua" ? "dua_bookmarks" : "bookmarks";
    try {
      await supabase.from(table).delete().eq("id", id);
      if (type === "hadith") setHadithBms(prev => prev.filter(b => b.id !== id));
      else if (type === "dua") setDuaBms(prev => prev.filter(b => b.id !== id));
      else setQuranBms(prev => prev.filter(b => b.id !== id));
      toast.success(langIsAr ? "تم الحذف" : "Removed");
    } catch {
      toast.error(langIsAr ? "فشل الحذف" : "Failed to remove");
    }
  };

  const urlAyah = (s: number, a: number | null) => `${window.location.origin}/quran/${s}${a ? `?ayah=${a}` : ""}`;
  const urlSurah = (s: number) => `${window.location.origin}/quran/${s}`;
  const urlHadith = (slug: string, n: number) => `${window.location.origin}/hadith?book=${slug}&hadith=${n}`;
  const urlDua = (title: string) => `${window.location.origin}/duas?search=${encodeURIComponent(title)}`;

  const share = async (url: string, title?: string, text?: string) => {
    try {
      if (navigator.share) await navigator.share({ title, text, url });
      else {
        await navigator.clipboard.writeText(url);
        toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied");
    }
  };

  /* ---------- Loading / Signed-out ---------- */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <Scaffold langIsAr={langIsAr} title={langIsAr ? "المحفوظات" : "Bookmarks"} subtitle={langIsAr ? "سجل دخولك لعرض محفوظاتك" : "Sign in to see your saved items"}>
        <div className="text-center py-12">
          <Bookmark className="h-14 w-14 mx-auto mb-4 text-muted-foreground" />
          <Button onClick={() => navigate("/auth")}>{langIsAr ? "تسجيل الدخول" : "Sign In"}</Button>
        </div>
      </Scaffold>
    );
  }

  /* ---------- Page ---------- */
  return (
    <Scaffold langIsAr={langIsAr} title={langIsAr ? "المحفوظات" : "Bookmarks"} subtitle={langIsAr ? "القرآن • الحديث • الأدعية" : "Quran • Hadith • Duas"}>
      {/* Tabs */}
      <div className="sticky top-16 z-30 px-4">
        <div className="rounded-2xl border border-border/40 bg-background/60 backdrop-blur p-2 shadow-sm">
          <Tabs defaultValue="ayahs" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-xl glass-effect">
              <TabsTrigger value="ayahs">{langIsAr ? `آيات (${ayahBms.length})` : `Ayahs (${ayahBms.length})`}</TabsTrigger>
              <TabsTrigger value="surahs">{langIsAr ? `سور (${surahBms.length})` : `Surahs (${surahBms.length})`}</TabsTrigger>
              <TabsTrigger value="hadiths">{langIsAr ? `أحاديث (${hadithBms.length})` : `Hadiths (${hadithBms.length})`}</TabsTrigger>
              <TabsTrigger value="duas">{langIsAr ? `أدعية (${duaBms.length})` : `Duas (${duaBms.length})`}</TabsTrigger>
            </TabsList>

            {/* AYAH */}
            <TabsContent value="ayahs">
              <Grid>
                {ayahBms.length === 0 ? (
                  <Empty langIsAr={langIsAr} textAr="لا توجد آيات محفوظة" textEn="No bookmarked ayahs yet" />
                ) : (
                  ayahBms.map(b => {
                    const link = urlAyah(b.surah_number, b.ayah_number);
                    return (
                      <ItemCard key={b.id} onClick={() => navigate(`/quran/${b.surah_number}${b.ayah_number ? `?ayah=${b.ayah_number}` : ""}`)}>
                        <Header
                          badgeLeft={<MonoBadge>{b.surah_number}</MonoBadge>}
                          title={getSurahName(b.surah_number)}
                          subtitle={langIsAr ? `الآية ${b.ayah_number}` : `Ayah ${b.ayah_number}`}
                        />
                        <Actions
                          onShare={() => share(link, getSurahName(b.surah_number))}
                          onCopy={() => navigator.clipboard.writeText(link).then(() => toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied"))}
                          onDelete={() => remove(b.id, "quran")}
                        />
                      </ItemCard>
                    );
                  })
                )}
              </Grid>
            </TabsContent>

            {/* SURAH */}
            <TabsContent value="surahs">
              <Grid>
                {surahBms.length === 0 ? (
                  <Empty langIsAr={langIsAr} textAr="لا توجد سور محفوظة" textEn="No bookmarked surahs yet" />
                ) : (
                  surahBms.map(b => {
                    const s = surahs.find(x => x.number === b.surah_number);
                    const link = urlSurah(b.surah_number);
                    return (
                      <ItemCard key={b.id} onClick={() => navigate(`/quran/${b.surah_number}`)}>
                        <Header
                          badgeLeft={<MonoBadge>{b.surah_number}</MonoBadge>}
                          title={getSurahName(b.surah_number)}
                          subtitle={s ? `${s.numberOfAyahs} ${langIsAr ? "آية" : "verses"}` : ""}
                        />
                        <Actions
                          onShare={() => share(link, getSurahName(b.surah_number))}
                          onCopy={() => navigator.clipboard.writeText(link).then(() => toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied"))}
                          onDelete={() => remove(b.id, "quran")}
                        />
                      </ItemCard>
                    );
                  })
                )}
              </Grid>
            </TabsContent>

            {/* HADITH */}
            <TabsContent value="hadiths">
              <Grid>
                {hadithBms.length === 0 ? (
                  <Empty langIsAr={langIsAr} textAr="لا توجد أحاديث محفوظة" textEn="No bookmarked hadiths yet" />
                ) : (
                  hadithBms.map(b => {
                    const link = urlHadith(b.book_slug, b.hadith_number);
                    return (
                      <ItemCard key={b.id}>
                        <Header
                          iconSquare
                          icon={<BookOpen className="h-5 w-5 text-primary" />}
                          title={`${b.book_name}`}
                          subtitle={langIsAr ? `حديث #${b.hadith_number}` : `Hadith #${b.hadith_number}`}
                        />
                        <div className="space-y-2 mt-3">
                          {langIsAr ? (
                            <>
                              <p className="text-base font-arabic text-right" dir="rtl">{b.hadith_arabic}</p>
                              {settings.translationEnabled && (
                                <p className="text-sm text-muted-foreground">{b.hadith_english}</p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="text-base">{b.hadith_english}</p>
                              {settings.translationEnabled && (
                                <p className="text-sm font-arabic text-right text-muted-foreground" dir="rtl">{b.hadith_arabic}</p>
                              )}
                            </>
                          )}
                          <p className="text-xs text-muted-foreground">{langIsAr ? "الراوي: " : "Narrator: "}{b.narrator}</p>
                        </div>
                        <Actions
                          onShare={() => share(link, `${b.book_name} #${b.hadith_number}`, b.hadith_english?.slice(0, 100))}
                          onCopy={() => navigator.clipboard.writeText(link).then(() => toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied"))}
                          onDelete={() => remove(b.id, "hadith")}
                        />
                      </ItemCard>
                    );
                  })
                )}
              </Grid>
            </TabsContent>

            {/* DUAS */}
            <TabsContent value="duas">
              <Grid>
                {duaBms.length === 0 ? (
                  <Empty langIsAr={langIsAr} textAr="لا توجد أدعية محفوظة" textEn="No bookmarked duas yet" />
                ) : (
                  duaBms.map(b => {
                    const link = urlDua(b.dua_title);
                    return (
                      <ItemCard key={b.id}>
                        <Header
                          iconSquare
                          icon={<Bookmark className="h-5 w-5 text-primary" />}
                          title={b.dua_title}
                          subtitle={b.category ?? ""}
                          subtitlePill
                        />
                        <div className="space-y-3 mt-3">
                          {b.dua_arabic && (
                            <p className={`text-2xl leading-loose text-right ${settings.fontType === "quran" ? "quran-font" : ""}`} dir="rtl">
                              {b.dua_arabic}
                            </p>
                          )}
                          {b.dua_transliteration && <p className="text-sm text-muted-foreground italic">{b.dua_transliteration}</p>}
                          {b.dua_english && <p className="text-base">{b.dua_english}</p>}
                        </div>
                        <Actions
                          onShare={() => share(link, b.dua_title)}
                          onCopy={() => navigator.clipboard.writeText(link).then(() => toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied"))}
                          onDelete={() => remove(b.id, "dua")}
                        />
                      </ItemCard>
                    );
                  })
                )}
              </Grid>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Scaffold>
  );
};

/* ===================== UI PRIMITIVES (Empire) ===================== */

const Scaffold: React.FC<{ langIsAr: boolean; title: string; subtitle: string; children: React.ReactNode; }> = ({ langIsAr, title, subtitle, children }) => (
  <div className="relative min-h-[100dvh] w-full overflow-x-hidden pb-20" dir={langIsAr ? "rtl" : "ltr"}>
    {/* background */}
    <div className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute left-1/2 -translate-x-1/2 top-[-7rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-40" />
      <div className="absolute right-1/2 translate-x-1/2 bottom-[-7rem] h-80 w-80 rounded-full bg-secondary/20 blur-3xl opacity-30" />
    </div>

    {/* back */}
    <div className="px-4 pt-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => history.back()}
        aria-label={langIsAr ? "رجوع" : "Back"}
        className="rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
    </div>

    {/* header */}
    <div className="text-center space-y-2 px-4 mt-2 mb-4">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
          {title}
        </span>
      </h1>
      <p className="text-sm md:text-base text-muted-foreground">{subtitle}</p>
    </div>

    {children}
  </div>
);

const Grid: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-4 mt-6">
    <div className="grid gap-4 md:grid-cols-2">{children}</div>
  </div>
);

const ItemCard: React.FC<{ onClick?: () => void; children: React.ReactNode; }> = ({ onClick, children }) => (
  <Card
    onClick={onClick}
    className={`group rounded-3xl p-6 border border-border/40 bg-card/60 backdrop-blur supports-[backdrop-filter]:bg-card/50 
                transition hover:shadow-lg hover:border-primary/40 ${onClick ? "cursor-pointer" : ""}`}
  >
    {children}
  </Card>
);

const Header: React.FC<{
  title: string;
  subtitle?: string;
  subtitlePill?: boolean;
  badgeLeft?: React.ReactNode;
  icon?: React.ReactNode;
  iconSquare?: boolean;
}> = ({ title, subtitle, subtitlePill, badgeLeft, icon, iconSquare }) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-start gap-3 min-w-0">
      {badgeLeft && <div className="shrink-0">{badgeLeft}</div>}
      {icon && (
        <div className={`shrink-0 ${iconSquare ? "w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow" : ""}`}>
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <h3 className="text-lg font-semibold truncate">{title}</h3>
        {subtitle && (
          subtitlePill ? (
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs bg-primary/10 text-primary">{subtitle}</span>
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{subtitle}</p>
          )
        )}
      </div>
    </div>
  </div>
);

const Actions: React.FC<{ onShare: () => void; onCopy: () => void; onDelete: () => void; }> = ({ onShare, onCopy, onDelete }) => (
  <div className="mt-5 flex items-center gap-2 justify-end">
    <Button variant="outline" size="icon" className="rounded-full" onClick={onShare} aria-label="Share">
      <Share2 className="h-4 w-4" />
    </Button>
    <Button variant="outline" size="icon" className="rounded-full" onClick={onCopy} aria-label="Copy link">
      <LinkIcon className="h-4 w-4" />
    </Button>
    <Button variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-destructive" onClick={onDelete} aria-label="Remove">
      <Trash2 className="h-5 w-5" />
    </Button>
  </div>
);

const MonoBadge: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-foreground/90 to-foreground/70 text-background font-bold text-lg flex items-center justify-center shadow-sm">
    {children}
  </div>
);

const Empty: React.FC<{ langIsAr: boolean; textAr: string; textEn: string; }> = ({ langIsAr, textAr, textEn }) => (
  <Card className="rounded-3xl p-10 border border-border/40 bg-card/50 backdrop-blur text-center">
    <p className="text-muted-foreground">{langIsAr ? textAr : textEn}</p>
  </Card>
);

export default Bookmarks;
