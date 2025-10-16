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
import HolyCities from "./pages/HolyCities";
import Makkah from "./pages/Makkah";
import MakkahKaabaSignificance from "./pages/MakkahKaabaSignificance";
import MakkahKaabaHistory from "./pages/MakkahKaabaHistory";
import MakkahLiveView from "./pages/MakkahLiveView";
import MakkahUmrah from "./pages/MakkahUmrah";
import MakkahHajj from "./pages/MakkahHajj";
import Madinah from "./pages/Madinah";
import MadinahSignificance from "./pages/MadinahSignificance";
import MadinahHistory from "./pages/MadinahHistory";
import MadinahLiveView from "./pages/MadinahLiveView";
import Jerusalem from "./pages/Jerusalem";
import JerusalemAqsaSignificance from "./pages/JerusalemAqsaSignificance";
import JerusalemAqsaHistory from "./pages/JerusalemAqsaHistory";
import JerusalemIsraMiraj from "./pages/JerusalemIsraMiraj";
import JerusalemQiblaChange from "./pages/JerusalemQiblaChange";
import JerusalemLiveView from "./pages/JerusalemLiveView";
import JerusalemPrayer from "./pages/JerusalemPrayer";
import JerusalemLandmarksMap from "./pages/JerusalemLandmarksMap";
import MosqueLocator from "./pages/MosqueLocator";
import IslamicEmpires from "./pages/IslamicEmpires";
import RashidunCaliphs from "./pages/RashidunCaliphs";
import UmayyadOverview from "./pages/UmayyadOverview";
import AbbasidOverview from "./pages/AbbasidOverview";
import FatimidOverview from "./pages/FatimidOverview";
import SeljukOverview from "./pages/SeljukOverview";
import AlmohadOverview from "./pages/AlmohadOverview";
import DelhiSultanateOverview from "./pages/DelhiSultanateOverview";
import OttomanOverview from "./pages/OttomanOverview";
import TimuridOverview from "./pages/TimuridOverview";
import SafavidOverview from "./pages/SafavidOverview";
import MughalOverview from "./pages/MughalOverview";
import IslamicHistory from "./pages/IslamicHistory";
import GoldenAgeOfIslam from "./pages/GoldenAgeOfIslam";
import IslamicBattles from "./pages/IslamicBattles";
import IslamicScholars from "./pages/IslamicScholars";
import IslamicConquests from "./pages/IslamicConquests";
import IslamicCrusades from "./pages/IslamicCrusades";

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
                  <Route path="/education" element={<StoriesAndNames />} />
                  <Route path="/prophet-stories" element={<ProphetStories />} />
                  <Route path="/names-of-allah" element={<NamesOfAllah />} />
                  <Route path="/names-of-muhammad" element={<NamesOfMuhammad />} />
                  <Route path="/angels" element={<Angels />} />
                  <Route path="/heaven-levels" element={<DoorsOfHeaven />} />
                  <Route path="/hell-levels" element={<HellLevels />} />
                  <Route path="/holy-cities" element={<HolyCities />} />
                  <Route path="/makkah" element={<Makkah />} />
                  <Route path="/makkah/kaaba-significance" element={<MakkahKaabaSignificance />} />
                  <Route path="/makkah/kaaba-history" element={<MakkahKaabaHistory />} />
                  <Route path="/makkah/live-view" element={<MakkahLiveView />} />
                  <Route path="/makkah/umrah" element={<MakkahUmrah />} />
                  <Route path="/makkah/hajj" element={<MakkahHajj />} />
                  <Route path="/madinah" element={<Madinah />} />
                  <Route path="/madinah/significance" element={<MadinahSignificance />} />
                  <Route path="/madinah/history" element={<MadinahHistory />} />
                  <Route path="/madinah/live-view" element={<MadinahLiveView />} />
                  <Route path="/jerusalem" element={<Jerusalem />} />
                  <Route path="/jerusalem/aqsa-significance" element={<JerusalemAqsaSignificance />} />
                  <Route path="/jerusalem/aqsa-history" element={<JerusalemAqsaHistory />} />
                  <Route path="/jerusalem/isra-miraj" element={<JerusalemIsraMiraj />} />
                  <Route path="/jerusalem/qibla-change" element={<JerusalemQiblaChange />} />
                  <Route path="/jerusalem/live-view" element={<JerusalemLiveView />} />
                  <Route path="/jerusalem/prayer" element={<JerusalemPrayer />} />
                  <Route path="/jerusalem/landmarks-map" element={<JerusalemLandmarksMap />} />
                  <Route path="/mosquelocator" element={<MosqueLocator />} />
                  <Route path="/empires" element={<IslamicEmpires />} />
                  <Route path="/empires/rashidun" element={<RashidunCaliphs />} />
                  <Route path="/empires/umayyad" element={<UmayyadOverview />} />
                  <Route path="/empires/abbasid" element={<AbbasidOverview />} />
                  <Route path="/empires/fatimid" element={<FatimidOverview />} />
                  <Route path="/empires/seljuk" element={<SeljukOverview />} />
                  <Route path="/empires/almohad" element={<AlmohadOverview />} />
                  <Route path="/empires/delhi-sultanate" element={<DelhiSultanateOverview />} />
                  <Route path="/empires/ottoman" element={<OttomanOverview />} />
                  <Route path="/empires/timurid" element={<TimuridOverview />} />
                  <Route path="/empires/safavid" element={<SafavidOverview />} />
                  <Route path="/empires/mughal" element={<MughalOverview />} />
                  <Route path="/islamichistory" element={<IslamicHistory />} />
                  <Route path="/islamichistory/golden-age" element={<GoldenAgeOfIslam />} />
                  <Route path="/islamichistory/battles" element={<IslamicBattles />} />
                  <Route path="/islamichistory/scholars" element={<IslamicScholars />} />
                  <Route path="/islamichistory/conquests" element={<IslamicConquests />} />
                  <Route path="/islamichistory/crusades" element={<IslamicCrusades />} />
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
