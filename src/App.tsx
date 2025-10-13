import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import { AudioProvider } from "./contexts/AudioContext";
import { AuthProvider } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Quran from "./pages/Quran";
import SurahDetail from "./pages/SurahDetail";
import Auth from "./pages/Auth";
import Info from "./pages/Info";
import Duas from "./pages/Duas";
import Hadith from "./pages/Hadith";
import ProphetStories from "./pages/ProphetStories";
import StoriesAndNames from "./pages/StoriesAndNames";
import NamesOfAllah from "./pages/NamesOfAllah";
import NamesOfMuhammad from "./pages/NamesOfMuhammad";
import Angels from "./pages/Angels";
import DoorsOfHeaven from "./pages/DoorsOfHeaven";
import HellLevels from "./pages/HellLevels";
import Qalam from "./pages/Qalam";
import ChatHistory from "./pages/ChatHistory";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Wudu from "./pages/Wudu";
import Bookmarks from "./pages/Bookmarks";
import Tasbih from "./pages/Tasbih";
import Zakat from "./pages/Zakat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SettingsProvider>
        <AudioProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Layout>
              <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quran" element={<Quran />} />
            <Route path="/quran/:surahNumber" element={<SurahDetail />} />
            <Route path="/qalam" element={<Qalam />} />
            <Route path="/chat-history" element={<ChatHistory />} />
            <Route path="/info" element={<Info />} />
            <Route path="/duas" element={<Duas />} />
            <Route path="/hadith" element={<Hadith />} />
            <Route path="/tasbih" element={<Tasbih />} />
            <Route path="/zakat" element={<Zakat />} />
            <Route path="/prayer" element={<Wudu />} />
            <Route path="/wudu" element={<Wudu />} />
            <Route path="/stories-and-names" element={<StoriesAndNames />} />
            <Route path="/prophet-stories" element={<ProphetStories />} />
            <Route path="/names-of-allah" element={<NamesOfAllah />} />
            <Route path="/names-of-muhammad" element={<NamesOfMuhammad />} />
            <Route path="/angels" element={<Angels />} />
            <Route path="/heaven-levels" element={<DoorsOfHeaven />} />
            <Route path="/hell-levels" element={<HellLevels />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/account" element={<Account />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="*" element={<NotFound />} />
              </Routes>
              </Layout>
            </BrowserRouter>
          </TooltipProvider>
        </AudioProvider>
      </SettingsProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
