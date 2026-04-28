# Massive Mobile-First UI Overhaul

A craftsmanship pass across the highest-traffic pages — built mobile-first, art-driven, with strict no-overflow rules and Lucide icons replacing every emoji.

## 0. Global Mobile Hygiene (root fix for "page swipes right")

The horizontal scroll on mobile is caused by full-bleed `-mx-4` rows, `min-w-[…]` tiles, and `whitespace-nowrap` text inside narrow containers.

- Add `overflow-x-hidden` on `body` and `#root` in `src/index.css`.
- In `PageTemplate.QuickActionsRow`: keep horizontal scroll *inside* the container (remove `-mx-4 px-4`, replace with internal padding so it never extends past viewport). Reduce `min-w-[120px]` → `min-w-[104px]`.
- Audit Home/Quran/Surah pages: any `flex` row with `whitespace-nowrap` children gets `overflow-x-auto scrollbar-hide` on the parent and `min-w-0` on flex children that hold text. Long Surah/Ayah labels switch from `truncate` to `break-words` where they need to wrap (Qalam suggestions, prophet titles).
- Add a new utility `.no-x-overflow { @apply overflow-x-hidden; max-width: 100vw; }` and apply to top-level page wrappers.

## 1. Home Page (`src/pages/Home.tsx`) — mobile masterpiece

Treat the home as a vertical "morning brief" composition, dense with art, breathable on a 375px screen.

- **Hero**: rebuild as a layered scene — soft islamic-gold orb (top-right), emerald orb (bottom-left), Islamic SVG pattern at 25% opacity, a hairline ornamental frame inside `premium-card`. Greeting auto-switches by time of day (Sun/CloudSun/Sunset/Moon icon + Arabic + English). Username in display weight, gradient text. On mobile: stacked, no side padding wasted.
- **Next Prayer strip**: full-width glass tile under hero with live countdown, location pill, prayer-progress bar (gradient gold→primary). One-tap navigates to `/wudu`.
- **Quote of the Day**: ornamental card — Arabic centerpiece in Amiri, hairline divider, English below in italic small-caps, reference as a chip. Add a subtle parallax animated geometry background.
- **Continue Reading**: hero card showing Surah name (Arabic + English), ayah marker, circular progress ring, Resume CTA. If empty, show "Begin your journey" with Surah of the Day.
- **Quick Apps grid**: redesign — 3-col on mobile, 4-col sm+, each a `press-tile` with gradient icon badge, label below, micro hover-lift. Replace flat row with `aspect-square` tiles for a clean grid (Quran, Qalam, Tasbih, Duas, Hadith, Names, Bookmarks, Zakat, More).
- **"Today" rail**: horizontally scrollable insight cards (Hijri date, Islamic event countdown if Ramadan/Eid near, Qibla shortcut). Snap-x, no page overflow.
- **Quran in Numbers** strip: refined stat tiles with iconography (Book, Star, Clock, Hand) and gold underlines.
- All sections wrapped in `PageSection` for consistent labels & dividers.

## 2. Prayer Page (`src/pages/Wudu.tsx`) — sacred dashboard

- New **PrayerHero**: countdown reimagined with concentric rings (animated SVG arc tracking time-to-next-prayer), large numeric timer, prayer name + Arabic, location chip with `MapPin`, sunrise/sunset mini-icons.
- **PrayerTimesGrid**: convert into a clean vertical timeline on mobile (icon | name | time | bar showing position in day) and a 5-column row on `sm+`. Active prayer glows with golden ring.
- **QuickAccessGrid**: tighten spacing, give each tile a unique gradient (Qibla=emerald, Hijri=gold, Events=blue, Wudu=teal, Mosques=primary).
- **QiblaCard**: bigger compass, animated needle pulse, degree readout in Arabic numerals when language=ar, pattern background.
- **HijriCalendarCard**: redesign month header with ornate divider, today's date as a glowing chip, weekend/event days marked.
- **IslamicEventsCard**: cards-in-row layout with countdown chip and event icon (Moon for Ramadan, Star for Eid).
- **WuduStepsCard**: numbered steps with subtle illustrations/icons, step-progress dots.
- Add `QuickActionsRow` at top: Qibla, Hijri, Events, Wudu, Mosques (anchored scroll).

## 3. Quran Index (`src/pages/Quran.tsx`)

- New header: huge "Quran" wordmark (gradient), Arabic "القرآن" beneath as a watermark behind, "Continue reading" hero card.
- **Mode tabs** (Surah / Juz / Bookmarks): pill segmented control, no horizontal overflow on mobile (use `flex-1` not `min-w` per tab).
- **Search bar**: glass input with search icon, voice-style placeholder, sticky on scroll.
- **Filter chips**: row stays inside container; chips use compact padding on mobile.
- **Surah list**: redesign each row as a card with — circular Arabic numeral medallion (gold gradient border), Surah name English bold + transliteration small, Arabic name large on right, ayah count + Meccan/Medinan badge + revelation order chip. Touch-target ≥56px.
- **Juz list**: parallel treatment with Roman numeral + Arabic ordinal.
- Empty/loading states: shimmer skeletons matching the card silhouette.

## 4. Surah Detail (`src/pages/SurahDetail.tsx`) — reader as artwork

- **Surah header**: ornate card — Surah name in Arabic huge (Amiri), English transliteration small caps, meta strip (ayahs · Meccan/Medinan · revelation order), Bismillah in calligraphic centered card with hairline frame (skipped for At-Tawbah).
- **Reading toolbar**: sticky condensed bar on scroll — play all, font size, translation toggle, bookmark, more. Mobile: icons only with tooltips, never overflows.
- **Ayah cards**: redesign — ayah number inside an 8-point Islamic star medallion (gold), Arabic right-aligned with proper line-height, transliteration italic muted, translation in body weight. Word-by-word mode keeps rendering tokens but with consistent baseline. Each card has hover/tap glow, action row (play, bookmark, copy, ask Qalam) hidden until tap.
- **Audio mini-bar**: bottom inline player with waveform shimmer, current-ayah highlight scrolls into view.
- **Page break / juz markers**: ornamental dividers between sections.
- Fix any current `whitespace-nowrap` on translation chips that pushes width — wrap or shrink on mobile.

## 5. Qalam (`src/pages/Qalam.tsx`) — remove emojis, massive UX

- **Replace emojis** in suggested prompts with Lucide icons: 🕌→`Building2`, 📖→`BookOpen`, 👥→`Users`. Render icon in a gradient badge instead of inline emoji glyph. Audit the rest of the file for any other emoji.
- **Empty state**: serene welcome — circular avatar with `Sparkles` icon glowing, "Assalamu Alaikum, {firstName}" greeting, short tagline, then a 2-col grid of suggestion cards (icon badge + question, tap to send). Add a "private mode" pill and "history" pill.
- **Conversation surface**: messages get distinct bubble styling — assistant uses glass-card with gold left border + small `Sparkles` avatar; user uses primary-tinted bubble right-aligned. Arabic auto-RTL per message. Long surah quotes get a special inline card (Amiri + reference chip).
- **Composer**: redesign as a floating glass bar — multiline auto-grow textarea, attach context chip (current surah/ayah if reading), send button as gradient circular FAB with `Send` icon, mic placeholder for future. Sticky at bottom above nav, safe-area-inset-bottom respected.
- **Header**: title + private/history controls collapse into icon buttons on mobile to prevent overflow.
- Keep Qalam's existing personalization rules (first name, full surah names, no email).

## 6. Names of Muhammad ﷺ → "Titles of the Prophet ﷺ"

- File: `src/pages/NamesOfMuhammad.tsx`. Rename heading to **"Titles of the Prophet ﷺ"** (Arabic: **"ألقاب النبي ﷺ"**). Update route label, breadcrumbs, and any link text in `StoriesAndNames.tsx` referencing this page.
- Update card layouts: each title gets an ornate medallion, Arabic title large, transliteration, English meaning, source reference chip. Grid: 1-col mobile, 2-col sm+.
- Add quick alphabet/jump rail.

(Names of Allah page stays "Names of Allah" — that one is doctrinally "Names" / Asma'.)

## 7. Cross-page polish

- **NavigationCard**: tighten padding, ensure long titles wrap (`break-words`, `min-w-0`).
- **MoreDialog**: reorder for mobile thumb-reach.
- **Layout audio player**: ensure expanded sheet never exceeds viewport width on 360px.
- **Focus states**: keep current `.focus-ring` everywhere.
- Add small `animate-fade-in` stagger on lists for premium feel.

## Visual Language (applied everywhere)

- Surfaces: `glass-card` / `premium-card` with hairline gold borders.
- Accents: `from-primary to-islamic-gold` gradients on icon medallions and headings.
- Dividers: `ornate-divider` between every major section.
- Pattern: `islamic-pattern-bg` at 30–40% opacity behind heroes only.
- Motion: `animate-fade-in` (staggered), `animate-glow-pulse` on next-prayer/active states, `press-tile` on every tap target.
- Typography: Arabic in Amiri for verses/titles, system display for English headings, gradient text on primary headlines.
- Icons: Lucide only, never emojis. Inside gradient rounded-square badges (icon size 16–18, badge 32–40).

## Files Touched

- `src/index.css` — overflow guards, new utilities
- `src/components/PageTemplate.tsx` — overflow-safe QuickActionsRow
- `src/pages/Home.tsx` — full rebuild
- `src/pages/Wudu.tsx` + `src/components/prayer/*` — full pass on PrayerHero, PrayerTimesGrid, QuickAccessGrid, QiblaCard, HijriCalendarCard, IslamicEventsCard, WuduStepsCard
- `src/pages/Quran.tsx` — index redesign
- `src/pages/SurahDetail.tsx` — reader redesign + overflow fixes
- `src/pages/Qalam.tsx` — emoji removal, empty state, composer, bubbles
- `src/pages/NamesOfMuhammad.tsx` — rename to "Titles of the Prophet ﷺ" + redesign
- `src/pages/StoriesAndNames.tsx` — update link/label
- `src/components/Layout.tsx`, `NavigationCard.tsx`, `MoreDialog.tsx` — mobile polish

## Out of Scope (this round)

- Backend/data model changes
- New routes or features beyond rename
- Settings/Auth pages (kept stable)

Approve and I'll execute the full pass.
