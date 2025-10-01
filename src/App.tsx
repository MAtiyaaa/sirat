import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SettingsProvider } from "./contexts/SettingsContext";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Quran from "./pages/Quran";
import SurahDetail from "./pages/SurahDetail";
import Auth from "./pages/Auth";
import Info from "./pages/Info";
import Duas from "./pages/Duas";
import ProphetStories from "./pages/ProphetStories";
import Qalam from "./pages/Qalam";
import ChatHistory from "./pages/ChatHistory";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SettingsProvider>
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
          <Route path="/prophet-stories" element={<ProphetStories />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<Account />} />
          <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </SettingsProvider>
  </QueryClientProvider>
);

export default App;
