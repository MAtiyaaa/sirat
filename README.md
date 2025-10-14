<div align="center">
  
  <h1>
    <br>
    <a href="https://sir-at.app">
      <img src="https://sir-at.app/sirat_icon.png" alt="Sirat" width="200">
    </a>
    <br>
    صراط • Sirat
    <br>
  </h1>

  <h3>A Modern Gateway to Divine Knowledge</h3>
  
  <p align="center">
    <strong>Read. Reflect. Remember.</strong>
  </p>

  <p align="center">
    <a href="https://sir-at.app">
      <img src="https://img.shields.io/badge/🌐_Live_Demo-sir--at.app-0891b2?style=for-the-badge" alt="Live">
    </a>
    <a href="#features">
      <img src="https://img.shields.io/badge/Features-🌟-f97316?style=for-the-badge" alt="Features">
    </a>
    <a href="#tech-stack">
      <img src="https://img.shields.io/badge/Tech_Stack-⚡-8b5cf6?style=for-the-badge" alt="Tech Stack">
    </a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React">
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase">
    <img src="https://img.shields.io/badge/RTL_Support-✓-22c55e?style=flat-square" alt="RTL Support">
    <img src="https://img.shields.io/badge/Bilingual-AR/EN-ef4444?style=flat-square" alt="Bilingual">
  </p>

  <br>
  
  <p align="center">
    <img src="https://sir-at.app/sirat.png" alt="Sirat Screenshot" width="100%" style="border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">
  </p>
  
</div>

---

<div align="center">
  
  **Sirat** is a meticulously crafted, bilingual Islamic web application that seamlessly blends spiritual devotion with modern technology. Built with React and featuring a stunning aurora-glass UI, it provides Muslims worldwide with instant access to the Qur'an, prayer tools, Islamic knowledge, and community resources—all wrapped in an experience that feels both reverent and delightfully modern.
  
</div>

---

## 🌟 Features

### 📖 **Qur'an Reader**
- **114 Surahs** at your fingertips with beautiful Arabic typography
- **Bilingual display** with seamless Arabic/English switching
- **Smart progress tracking** - pick up right where you left off
- **Personalized experience** with "Surah of the Day" and bookmarks
- **Diacritic-safe rendering** using optimized Arabic fonts

### 🕋 **Holy Cities Explorer**
- **Makkah** - Explore the Kaaba's significance, history, and live views
- **Madinah** - Journey through the Prophet's city with guided content
- **Jerusalem** - Discover Al-Aqsa's importance, Isra & Mi'raj, and landmarks
- **Live streaming** integration for spiritual connection
- **Interactive maps** with key landmarks

### 📿 **Digital Tasbīḥ**
- **Beautiful dhikr counter** with common remembrances
- **Arabic diacritics** perfectly preserved
- **Preset selections** including SubḥānAllāh, Alḥamdulillāh, and more
- **Progress tracking** with increment/decrement controls
- **Auto-reset options** for seamless practice

### 🕌 **Smart Mosque Locator**
- **Zero-friction** mosque discovery using OpenStreetMap
- **Dynamic clustering** for clean map visualization
- **One-tap navigation** to Google Maps, Apple Maps, or Waze
- **Responsive design** optimized for mobile use

### 📚 **Islamic Knowledge Hub**
- **Hadith collection** with authentic narrations
- **Du'as** for daily life and special occasions
- **Prophet stories** and companions' narratives
- **99 Names of Allah** with meanings
- **Educational content** for all ages

### 🛠️ **Utilities & Tools**
- **Zakat calculator** with comprehensive guidance
- **Prayer & Wudu guide** with step-by-step instructions
- **Personal bookmarks** synced across devices
- **User accounts** with Supabase authentication
- **Theme customization** with light/dark modes

## 🎨 Design Philosophy

Sirat features a sense of spiritual elevation:

- 📱 **iOS-inspired icons** for intuitive navigation
- 🎯 **Large touch targets** for accessibility
- 🌙 **Dark mode** for comfortable night reading

## ⚡ Tech Stack

### Frontend
- **React 18.3** - Modern component architecture
- **React Router** - Seamless SPA navigation
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Premium component library
- **Lucide React** - Beautiful, consistent icons

### Backend & Data
- **Supabase** - Authentication & real-time database
- **PostgreSQL** - Robust data persistence
- **AlQuran.cloud API** - Comprehensive Qur'an metadata
- **OpenStreetMap** - Open-source mapping

### Key Features
- **Full RTL support** for authentic Arabic experience
- **Bilingual architecture** (Arabic/English)
- **Context-based state** management
- **Responsive design** from mobile to desktop
- **Performance optimized** for all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (free tier works)
- Modern browser with ES6 support

### Installation

```bash
# Clone the repository
git clone https://github.com/MAtiyaaa/sirat.git
cd sirat

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
sirat/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # shadcn/ui components
│   │   ├── QuranReader/   # Qur'an specific components
│   │   ├── Tasbih/        # Digital counter components
│   │   └── Maps/          # Mosque locator components
│   ├── contexts/          # Global state management
│   │   ├── SettingsContext.jsx
│   │   ├── AuthContext.jsx
│   │   └── AudioContext.jsx
│   ├── pages/            # Route components
│   │   ├── Home/
│   │   ├── Quran/
│   │   ├── HolyCities/
│   │   └── Utilities/
│   ├── lib/              # Utilities & helpers
│   ├── hooks/            # Custom React hooks
│   └── styles/           # Global styles & themes
├── public/               # Static assets
├── supabase/            # Database migrations
└── package.json
```

## 🗺️ Routes Overview

| Route | Description |
|-------|-------------|
| `/` | Home with hero, daily cards, and app grid |
| `/quran` | Surah index with search and filters |
| `/quran/:surahNumber` | Individual surah reader |
| `/tasbih` | Digital dhikr counter |
| `/duas` | Collection of supplications |
| `/hadith` | Curated hadith collections |
| `/mosquelocator` | Interactive mosque finder |
| `/makkah` | Makkah city guide and resources |
| `/madinah` | Madinah city guide |
| `/jerusalem` | Jerusalem and Al-Aqsa content |
| `/account` | User profile and settings |

## 🔄 Database Schema

```sql
-- User's last viewed surah
CREATE TABLE last_viewed_surah (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  surah_number INT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reading progress tracking
CREATE TABLE reading_progress (
  user_id UUID REFERENCES auth.users(id),
  surah_number INT NOT NULL,
  ayah_number INT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, surah_number)
);

-- User bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  surah_number INT NOT NULL,
  ayah_number INT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🤝 Contributing

We welcome contributions that align with Sirat's mission of providing accessible Islamic knowledge with excellence.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows the existing style patterns
- Arabic content is properly reviewed for accuracy
- UI changes maintain the aurora-glass aesthetic
- All features are mobile-responsive
- RTL support is maintained

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **AlQuran.cloud** for comprehensive Qur'an API
- **shadcn/ui** for beautiful component primitives
- **Muslim community** for feedback and support
- All contributors who help make Sirat better

## 💫 Support

If you find Sirat beneficial, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs or suggesting features
- 📖 Contributing translations or content

---

<div align="center">
    
  <p>
    <a href="https://sir-at.app">Website</a> •
    <a href="https://github.com/MAtiyaaa/sirat/issues">Issues</a> •
    <a href="https://github.com/MAtiyaaa/sirat/discussions">Discussions</a>
  </p>
  
  <sub>May this project be a means of guidance and benefit. Ameen.</sub>
  
</div>
