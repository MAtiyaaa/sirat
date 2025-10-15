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
  BookMarked,
  Share2,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";
import { fetchSurahs, Surah } from "@/lib/quran-api";

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

const Bookmarks: React.FC = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [hadithBookmarks, setHadithBookmarks] = useState<HadithBookmark[]>([]);
  const [duaBookmarks, setDuaBookmarks] = useState<DuaBookmark[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const langIsAr = settings.language === "ar";

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (!session?.user) {
          setLoading(false);
          return;
        }
        const [bm, hbm, dbm, surahList] = await Promise.all([
          supabase.from("bookmarks").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
          supabase.from("hadith_bookmarks").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
          supabase.from("dua_bookmarks").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
          fetchSurahs(),
        ]);
        if (bm.data) setBookmarks(bm.data as BookmarkData[]);
        if (hbm.data) setHadithBookmarks(hbm.data as HadithBookmark[]);
        if (dbm.data) setDuaBookmarks(dbm.data as DuaBookmark[]);
        setSurahs(surahList);
      } catch (e) {
        console.error(e);
        toast.error(langIsAr ? "فشل تحميل الإشارات المرجعية" : "Failed to load bookmarks");
      } finally {
        setLoading(false);
      }
    })();
  }, [langIsAr]);

  const ayahBookmarks = useMemo(() => bookmarks.filter(b => b.bookmark_type === "ayah"), [bookmarks]);
  const surahBookmarks = useMemo(() => bookmarks.filter(b => b.bookmark_type === "surah"), [bookmarks]);

  const getSurahName = (surahNumber: number) => {
    const surah = surahs.find(s => s.number === surahNumber);
    if (!surah) return "";
    return langIsAr ? surah.name : surah.englishName;
  };

  const removeBookmark = async (bookmarkId: string, type: "quran" | "hadith" | "dua" = "quran") => {
    const table = type === "hadith" ? "hadith_bookmarks" : type === "dua" ? "dua_bookmarks" : "bookmarks";
    try {
      await supabase.from(table).delete().eq("id", bookmarkId);
      if (type === "hadith") setHadithBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      else if (type === "dua") setDuaBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      else setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      toast.success(langIsAr ? "تمت الإزالة" : "Removed");
    } catch (e) {
      console.error(e);
      toast.error(langIsAr ? "فشل الحذف" : "Failed to remove");
    }
  };

  // Deep links for Share/Copy
  const buildAyahUrl = (s: number, a: number | null) => `${window.location.origin}/quran/${s}${a ? `?ayah=${a}` : ""}`;
  const buildSurahUrl = (s: number) => `${window.location.origin}/quran/${s}`;
  const buildHadithUrl = (slug: string, n: number) => `${window.location.origin}/hadith?book=${slug}&hadith=${n}`;
  const buildDuaUrl = (title: string) => `${window.location.origin}/duas?search=${encodeURIComponent(title)}`;

  const share = async (url: string, title?: string, text?: string) => {
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied");
      }
    } catch {
      await navigator.clipboard.writeText(url);
      toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] relative overflow-x-hidden">
        {/* BG */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
          <div className="absolute left-1/2 -translate-x-1/2 top-[-7rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-50" />
        </div>

        <div className="text-center py-16 px-4">
          <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            {langIsAr ? "يجب تسجيل الدخول لعرض الإشارات المرجعية" : "Please sign in to view bookmarks"}
          </p>
          <Button onClick={() => navigate("/auth")}>
            {langIsAr ? "تسجيل الدخول" : "Sign In"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[100dvh] w-full overflow-x-hidden pb-20" dir={langIsAr ? "rtl" : "ltr"}>
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
        <div className="absolute left-1/2 -translate-x-1/2 top-[-7rem] h-72 w-72 rounded-full bg-primary/20 blur-3xl opacity-50" />
        <div className="absolute right-1/2 translate-x-1/2 bottom-[-7rem] h-80 w-80 rounded-full bg-secondary/20 blur-3xl opacity-40" />
      </div>

      {/* Back */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(-1)}
        className="fixed top-6 left-6 z-50 rounded-full w-10 h-10 bg-background/70 backdrop-blur border"
        aria-label={langIsAr ? "رجوع" : "Back"}
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>

      {/* Header */}
      <div className="text-center space-y-3 pt-16 px-4">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          <span className="bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {langIsAr ? "المحفوظات" : "Bookmarks"}
          </span>
        </h1>
        <p className="text-base md:text-lg text-muted-foreground">
          {langIsAr ? "الآيات والسور والأحاديث والأدعية المحفوظة" : "Your saved ayahs, surahs, hadiths, and duas"}
        </p>
      </div>

      {/* Tabs (sticky) */}
      <div className="px-4 mt-6 sticky top-16 z-30">
        <div className="rounded-2xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 p-2 shadow-sm">
          <Tabs defaultValue="ayahs" className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass-effect rounded-xl">
              <TabsTrigger value="ayahs">
                {langIsAr ? `آيات (${ayahBookmarks.length})` : `Ayahs (${ayahBookmarks.length})`}
              </TabsTrigger>
              <TabsTrigger value="surahs">
                {langIsAr ? `سور (${surahBookmarks.length})` : `Surahs (${surahBookmarks.length})`}
              </TabsTrigger>
              <TabsTrigger value="hadiths">
                {langIsAr ? `أحاديث (${hadithBookmarks.length})` : `Hadiths (${hadithBookmarks.length})`}
              </TabsTrigger>
              <TabsTrigger value="duas">
                {langIsAr ? `أدعية (${duaBookmarks.length})` : `Duas (${duaBookmarks.length})`}
              </TabsTrigger>
            </TabsList>

            {/* AYAH TAB */}
            <TabsContent value="ayahs" className="space-y-4 mt-6">
              {ayahBookmarks.length === 0 ? (
                <EmptyCard text={langIsAr ? "لا توجد آيات محفوظة" : "No bookmarked ayahs yet"} />
              ) : (
                ayahBookmarks.map(b => {
                  const url = buildAyahUrl(b.surah_number, b.ayah_number);
                  return (
                    <div
                      key={b.id}
                      className="group glass-effect rounded-3xl p-6 border border-border/30 hover:border-primary/40 backdrop-blur-xl smooth-transition"
                    >
                      <div className={`flex ${langIsAr ? "flex-row-reverse" : ""} items-start justify-between gap-4`}>
                        <div
                          className="flex-1 cursor-pointer"
                          onClick={() => navigate(`/quran/${b.surah_number}${b.ayah_number ? `?ayah=${b.ayah_number}` : ""}`)}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 smooth-transition">
                              <BookOpen className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-lg">{getSurahName(b.surah_number)}</h3>
                              <p className="text-sm text-muted-foreground">
                                {langIsAr ? `الآية ${b.ayah_number}` : `Ayah ${b.ayah_number}`}
                              </p>
                            </div>
                          </div>
                        </div>

                        <ActionButtons
                          onShare={() => share(url, getSurahName(b.surah_number), langIsAr ? "مشاركة آية" : "Share ayah")}
                          onCopy={() => navigator.clipboard.writeText(url).then(() => toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied"))}
                          onDelete={() => removeBookmark(b.id, "quran")}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>

            {/* SURAH TAB */}
            <TabsContent value="surahs" className="space-y-4 mt-6">
              {surahBookmarks.length === 0 ? (
                <EmptyCard text={langIsAr ? "لا توجد سور محفوظة" : "No bookmarked surahs yet"} />
              ) : (
                surahBookmarks.map(b => {
                  const surah = surahs.find(s => s.number === b.surah_number);
                  const url = buildSurahUrl(b.surah_number);
                  return (
                    <div
                      key={b.id}
                      className="group glass-effect rounded-3xl p-6 border border-border/30 hover:border-primary/40 backdrop-blur-xl smooth-transition"
                    >
                      <div className={`flex ${langIsAr ? "flex-row-reverse" : ""} items-start justify-between gap-4`}>
                        <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => navigate(`/quran/${b.surah_number}`)}>
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 smooth-transition">
                            <span className="text-white font-bold text-xl">{b.surah_number}</span>
                          </div>
                          <div>
                            <h3 className="font-bold text-xl mb-1">{getSurahName(b.surah_number)}</h3>
                            {surah && (
                              <p className="text-sm text-muted-foreground">
                                {surah.numberOfAyahs} {langIsAr ? "آية" : "verses"}
                              </p>
                            )}
                          </div>
                        </div>

                        <ActionButtons
                          onShare={() => share(url, getSurahName(b.surah_number))}
                          onCopy={() => navigator.clipboard.writeText(url).then(() => toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied"))}
                          onDelete={() => removeBookmark(b.id, "quran")}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </TabsContent>

            {/* HADITH TAB */}
            <TabsContent value="hadiths" className="space-y-4 mt-6">
              {hadithBookmarks.length === 0 ? (
                <EmptyCard text={langIsAr ? "لا توجد أحاديث محفوظة" : "No bookmarked hadiths yet"} />
              ) : (
                hadithBookmarks.map(b => {
                  const url = buildHadithUrl(b.book_slug, b.hadith_number);
                  return (
                    <Card key={b.id} className="glass-effect p-6 border border-border/50 hover:border-primary/50 smooth-transition">
                      <div className={`flex ${langIsAr ? "flex-row-reverse" : ""} items-start justify-between gap-4`}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold">{b.book_name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {langIsAr ? `حديث رقم ${b.hadith_number}` : `Hadith ${b.hadith_number}`}
                          </p>

                          {langIsAr ? (
                            <>
                              <p className="text-base font-arabic text-right" dir="rtl">{b.hadith_arabic}</p>
                              {settings.translationEnabled && (
                                <p className="text-sm text-muted-foreground mt-2">{b.hadith_english}</p>
                              )}
                            </>
                          ) : (
                            <>
                              <p className="text-base">{b.hadith_english}</p>
                              {settings.translationEnabled && (
                                <p className="text-sm font-arabic text-right text-muted-foreground mt-2" dir="rtl">
                                  {b.hadith_arabic}
                                </p>
                              )}
                            </>
                          )}
                          <p className="text-xs text-muted-foreground pt-2">
                            {langIsAr ? "الراوي: " : "Narrator: "}{b.narrator}
                          </p>
                        </div>

                        <ActionButtons
                          onShare={() => share(url, `${b.book_name} #${b.hadith_number}`, b.hadith_english?.slice(0, 120))}
                          onCopy={() => navigator.clipboard.writeText(url).then(() => toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied"))}
                          onDelete={() => removeBookmark(b.id, "hadith")}
                        />
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>

            {/* DUAS TAB */}
            <TabsContent value="duas" className="space-y-4 mt-6">
              {duaBookmarks.length === 0 ? (
                <EmptyCard text={langIsAr ? "لا توجد أدعية محفوظة" : "No bookmarked duas yet"} />
              ) : (
                duaBookmarks.map(b => {
                  const url = buildDuaUrl(b.dua_title);
                  return (
                    <Card key={b.id} className="glass-effect p-6 border border-border/50 hover:border-primary/50 smooth-transition">
                      <div className={`flex ${langIsAr ? "flex-row-reverse" : ""} items-start justify-between gap-4`}>
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                              <Bookmark className="h-6 w-6 text-white" />
                            </div>
                            <div className="leading-tight">
                              <h3 className="font-bold text-lg">{b.dua_title}</h3>
                              {b.category && (
                                <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                  {b.category}
                                </span>
                              )}
                            </div>
                          </div>

                          {b.dua_arabic && (
                            <p
                              className={`text-2xl leading-loose text-right ${settings.fontType === "quran" ? "quran-font" : ""}`}
                              dir="rtl"
                            >
                              {b.dua_arabic}
                            </p>
                          )}
                          {b.dua_transliteration && (
                            <p className="text-sm text-muted-foreground italic">{b.dua_transliteration}</p>
                          )}
                          {b.dua_english && <p className="text-base">{b.dua_english}</p>}
                        </div>

                        <ActionButtons
                          onShare={() => share(url, b.dua_title)}
                          onCopy={() => navigator.clipboard.writeText(url).then(() => toast.success(langIsAr ? "تم نسخ الرابط" : "Link copied"))}
                          onDelete={() => removeBookmark(b.id, "dua")}
                        />
                      </div>
                    </Card>
                  );
                })
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

/* ---------- Small UI helpers (Empire actions & empties) ---------- */

const ActionButtons: React.FC<{
  onShare: () => void;
  onCopy: () => void;
  onDelete: () => void;
}> = ({ onShare, onCopy, onDelete }) => {
  return (
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon" className="rounded-full" onClick={onShare} aria-label="Share">
        <Share2 className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon" className="rounded-full" onClick={onCopy} aria-label="Copy link">
        <LinkIcon className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={onDelete}
        className="text-muted-foreground hover:text-destructive rounded-full"
        aria-label="Remove"
        title="Remove"
      >
        <Trash2 className="h-5 w-5" />
      </Button>
    </div>
  );
};

const EmptyCard: React.FC<{ text: string }> = ({ text }) => (
  <div className="text-center py-12 glass-effect rounded-3xl border border-border/30 backdrop-blur-xl">
    <BookMarked className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
    <p className="text-muted-foreground">{text}</p>
  </div>
);

export default Bookmarks;
