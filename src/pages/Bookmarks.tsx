import React, { useState, useEffect } from "react";
import { useSettings } from "@/contexts/SettingsContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, BookOpen, Trash2, Loader2, ArrowLeft } from "lucide-react";
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
  dua_hash: string;
  title_ar: string | null;
  title_en: string | null;
  arabic: string;
  transliteration: string | null;
  translation: string | null;
  category: string | null;
  source_file: string | null;
  created_at: string;
}

const Bookmarks = () => {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [hadithBookmarks, setHadithBookmarks] = useState<HadithBookmark[]>([]);
  const [duaBookmarks, setDuaBookmarks] = useState<DuaBookmark[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (!session?.user) {
        setLoading(false);
        return;
      }

      const [bookmarksResult, hadithResult, duaResult, surahsData] = await Promise.all([
        supabase.from("bookmarks").select("*").eq("user_id", session.user.id).order("created_at", { ascending: false }),
        supabase
          .from("hadith_bookmarks")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("dua_bookmarks")
          .select("*")
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false }),
        fetchSurahs(),
      ]);

      if (bookmarksResult.data) setBookmarks(bookmarksResult.data as BookmarkData[]);
      if (hadithResult.data) setHadithBookmarks(hadithResult.data as HadithBookmark[]);
      if (duaResult.data) setDuaBookmarks(duaResult.data as DuaBookmark[]);
      setSurahs(surahsData);
    } catch (error) {
      console.error("Error loading bookmarks:", error);
      toast.error(settings.language === "ar" ? "فشل تحميل الإشارات المرجعية" : "Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (bookmarkId: string, isHadith: boolean = false) => {
    try {
      if (isHadith) {
        await supabase.from("hadith_bookmarks").delete().eq("id", bookmarkId);
        setHadithBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      } else {
        await supabase.from("bookmarks").delete().eq("id", bookmarkId);
        setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      }
      toast.success(settings.language === "ar" ? "تمت الإزالة" : "Removed");
    } catch (error) {
      console.error("Error removing bookmark:", error);
      toast.error(settings.language === "ar" ? "فشل الحذف" : "Failed to remove bookmark");
    }
  };

  const removeDuaBookmark = async (bookmarkId: string) => {
    try {
      await supabase.from("dua_bookmarks").delete().eq("id", bookmarkId);
      setDuaBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
      toast.success(settings.language === "ar" ? "تمت الإزالة" : "Removed");
    } catch (error) {
      console.error("Error removing dua bookmark:", error);
      toast.error(settings.language === "ar" ? "فشل الحذف" : "Failed to remove bookmark");
    }
  };

  const getSurahName = (surahNumber: number) => {
    const surah = surahs.find((s) => s.number === surahNumber);
    if (!surah) return "";
    return settings.language === "ar" ? surah.name : surah.englishName;
  };

  const ayahBookmarks = bookmarks.filter((b) => b.bookmark_type === "ayah");
  const surahBookmarks = bookmarks.filter((b) => b.bookmark_type === "surah");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground mb-4">
          {settings.language === "ar" ? "يجب تسجيل الدخول لعرض الإشارات المرجعية" : "Please sign in to view bookmarks"}
        </p>
        <Button onClick={() => navigate("/auth")}>{settings.language === "ar" ? "تسجيل الدخول" : "Sign In"}</Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
            {settings.language === "ar" ? "المحفوظات" : "Bookmarks"}
          </span>
        </h1>
        <p className="text-lg text-muted-foreground">
          {settings.language === "ar"
            ? "الآيات والسور والأحاديث والأدعية المحفوظة"
            : "Your saved ayahs, surahs, hadiths, and duas"}
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="duas" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="duas">
            {settings.language === "ar" ? `الأدعية (${duaBookmarks.length})` : `Duas (${duaBookmarks.length})`}
          </TabsTrigger>
          <TabsTrigger value="ayahs">
            {settings.language === "ar" ? `الآيات (${ayahBookmarks.length})` : `Ayahs (${ayahBookmarks.length})`}
          </TabsTrigger>
          <TabsTrigger value="surahs">
            {settings.language === "ar" ? `السور (${surahBookmarks.length})` : `Surahs (${surahBookmarks.length})`}
          </TabsTrigger>
          <TabsTrigger value="hadiths">
            {settings.language === "ar"
              ? `الأحاديث (${hadithBookmarks.length})`
              : `Hadiths (${hadithBookmarks.length})`}
          </TabsTrigger>
        </TabsList>

        {/* Duas */}
        <TabsContent value="duas" className="space-y-4 mt-6">
          {duaBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {settings.language === "ar" ? "لا توجد أدعية محفوظة" : "No bookmarked duas yet"}
              </p>
            </div>
          ) : (
            duaBookmarks.map((b) => (
              <Card
                key={b.id}
                className="glass-effect p-6 border border-border/50 hover:border-primary/50 smooth-transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {settings.language === "ar" ? b.title_ar || "دعاء" : b.title_en || "Dua"}
                    </h3>
                    <div className="text-xs text-muted-foreground mt-1">
                      {b.category || (settings.language === "ar" ? "عام" : "General")}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDuaBookmark(b.id)}
                    className="text-muted-foreground hover:text-destructive rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <p className="text-xl font-quran leading-relaxed" dir="rtl">
                    {b.arabic}
                  </p>

                  {settings.translationEnabled &&
                    settings.translationSource === "transliteration" &&
                    b.transliteration && <p className="text-sm text-muted-foreground italic">{b.transliteration}</p>}

                  {settings.translationEnabled && settings.translationSource !== "transliteration" && b.translation && (
                    <p className="text-sm text-muted-foreground">{b.translation}</p>
                  )}

                  {b.source_file && (
                    <p className="text-xs text-muted-foreground pt-1">
                      {settings.language === "ar" ? "المصدر: " : "Source: "}
                      {b.source_file}
                    </p>
                  )}
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Ayahs */}
        <TabsContent value="ayahs" className="space-y-4 mt-6">
          {ayahBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {settings.language === "ar" ? "لا توجد آيات محفوظة" : "No bookmarked ayahs yet"}
              </p>
            </div>
          ) : (
            ayahBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                onClick={() => navigate(`/quran/${bookmark.surah_number}`)}
                className="glass-effect rounded-3xl p-6 border border-border/30 hover:border-primary/40 backdrop-blur-xl smooth-transition cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:scale-110 smooth-transition">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{getSurahName(bookmark.surah_number)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {settings.language === "ar"
                            ? `الآية ${bookmark.ayah_number}`
                            : `Ayah ${bookmark.ayah_number}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeBookmark(bookmark.id);
                    }}
                    className="text-muted-foreground hover:text-destructive rounded-full"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </TabsContent>

        {/* Surahs */}
        <TabsContent value="surahs" className="space-y-4 mt-6">
          {surahBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {settings.language === "ar" ? "لا توجد سور محفوظة" : "No bookmarked surahs yet"}
              </p>
            </div>
          ) : (
            surahBookmarks.map((bookmark) => {
              const surah = surahs.find((s) => s.number === bookmark.surah_number);
              return (
                <div
                  key={bookmark.id}
                  onClick={() => navigate(`/quran/${bookmark.surah_number}`)}
                  className="glass-effect rounded-3xl p-6 border border-border/30 hover:border-primary/40 backdrop-blur-xl smooth-transition cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg group-hover:scale-110 smooth-transition">
                        <span className="text-white font-bold text-xl">{bookmark.surah_number}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-xl mb-1">{getSurahName(bookmark.surah_number)}</h3>
                        {surah && (
                          <p className="text-sm text-muted-foreground">
                            {surah.numberOfAyahs} {settings.language === "ar" ? "آية" : "verses"}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBookmark(bookmark.id);
                      }}
                      className="text-muted-foreground hover:text-destructive rounded-full"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </TabsContent>

        {/* Hadiths */}
        <TabsContent value="hadiths" className="space-y-4 mt-6">
          {hadithBookmarks.length === 0 ? (
            <div className="text-center py-12">
              <Bookmark className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                {settings.language === "ar" ? "لا توجد أحاديث محفوظة" : "No bookmarked hadiths yet"}
              </p>
            </div>
          ) : (
            hadithBookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className="glass-effect p-6 border border-border/50 hover:border-primary/50 smooth-transition"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <h3 className="font-semibold">{bookmark.book_name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {settings.language === "ar"
                          ? `حديث رقم ${bookmark.hadith_number}`
                          : `Hadith ${bookmark.hadith_number}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBookmark(bookmark.id, true)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {settings.language === "ar" ? (
                      <>
                        <p className="text-base font-arabic text-right">{bookmark.hadith_arabic}</p>
                        {settings.translationEnabled && (
                          <p className="text-sm text-muted-foreground">{bookmark.hadith_english}</p>
                        )}
                      </>
                    ) : (
                      <>
                        <p className="text-base">{bookmark.hadith_english}</p>
                        {settings.translationEnabled && (
                          <p className="text-sm font-arabic text-right text-muted-foreground">
                            {bookmark.hadith_arabic}
                          </p>
                        )}
                      </>
                    )}
                    <p className="text-xs text-muted-foreground pt-2">
                      {settings.language === "ar" ? "الراوي: " : "Narrator: "}
                      {bookmark.narrator}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Bookmarks;
