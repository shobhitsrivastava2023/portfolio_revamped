# Changelog

Context and changes made to the portfolio project, in order.

---

## Navbar & project setup

### 1. Fonts and colors
- **Layout (`app/layout.tsx`):** Switched from Geist to **Outfit** (weights 400, 500, 600, 700) and **Urbanist** via `next/font/google`. Body uses both via CSS variables. Updated metadata title/description for the portfolio.
- **Globals (`app/globals.css`):** Added portfolio palette: `#FC6E20` (primary/orange), `#FFE7D0` (background/cream), `#323232` (dark text/divs), `#1B1B1B` (reserved). Set default background to `#FFE7D0`. Added `.font-outfit` utility for Outfit font.

### 2. Navbar component
- **File:** `app/components/Navbar.tsx`
- **Container:** Width 562px, height 76px, top margin 29px, background `#FC6E20`, **border-radius 12px**.
- **“SHOBHIT.”:** Font Outfit (medium), 48px, letter-spacing -10% (`-0.1em`), color `#323232`.
- **Hamburger:** 36×25px, three bars color `#323232`, 2px height, full width; button with `aria-label="Open menu"` for future menu toggle.

### 3. Page integration
- **`app/page.tsx`:** Renders `<Navbar />` at top; page background `#FFE7D0`; main content max-width 562px to align with navbar.

---

## Hero section (“Hey there…” + photo)

### 4. Hero component
- **File:** `app/components/Hero.tsx`
- **Layout:** Two-column grid, total width 562px (aligned with navbar). Section margin-top **40px** below navbar.
- **Left column (281px):** Aligned to navbar left margin.
  - **“hey there!”:** Outfit (medium), 48px, letter-spacing -10%, color `#1B1B1B`.
  - **Gap 23px** then body text: Urbanist (medium), 24px, line-height 22px, color `#323232`: “fellow developer here, this is my portfolio to look into my work.”
  - **Gap 23px** then: “so lets give you an experience shall we?” — same font/size/color.
- **Right column (281px):** Photo aligned to navbar right margin. Image `public/hero.jpg`, **224×272px**, **border-radius 9px**.
- **`app/page.tsx`:** Placeholder content removed; page now renders `<Navbar />` then `<Hero />`.

---

## Cards section (download, Experience, Projects, translation, Contact)

### 5. CardsSection component
- **File:** `app/components/CardsSection.tsx`
- **Layout:** Same two-column grid as Hero (562px, 281+281). Section margin-top 40px. Left column content 271px wide (navbar left); right column content 224px wide, aligned right (navbar right). Column heights aligned so section start/end match (440px content height each).
- **Left column:**
  - **“In a hurry?*”** — small text (14px, -5% letter-spacing, #323232).
  - **Download resume button:** 271×47px, bg #FC6E20, rounded 10px. Urbanist semibold 24px, letter-spacing -5%, color #323232; download icon on right.
  - **Experience card (dropdown):** 271×168px, bg #323232, rounded 10px. Title “Experience” — Outfit regular 64px, -11% letter-spacing, #FFE7D0; chevron top-right. TLDR: 14px, -5%, #FFE7D0 (“Graduating: 2026”, “Worked at: 3 startups”, “Main Domain: Fullstack Developer”). Click toggles timeline placeholder (empty for now).
  - **Projects card (dropdown):** Same as Experience; bg #FC6E20; title and TLDR #323232. TLDR: “github repos: 61”, “contributions: 2 orgs”, “open source: 3 orgs”. Dropdown placeholder empty.
- **Right column:**
  - **Translation banner:** 224×252px, border #323232, no border-radius, bg #FFE7D0. Text: このポートフォリオは 6 言語で利用可能です. Urbanist semibold 36px, -5% letter-spacing, #323232.
  - **Contact card (dropdown):** 224×168px, bg #323232, rounded 10px. “Contact” — Outfit regular 64px, -11%, #FFE7D0; chevron; TLDR 14px #FFE7D0 (gmail, github). No dropdown content yet.
- **Gaps:** 12px after “In a hurry?”, 5px after download (left), 20px between Experience and Projects, 20px between translation banner and Contact (right).
- **`app/page.tsx`:** Renders `<CardsSection />` after `<Hero />`.

---

### 6. Navbar & CardsSection tweaks
- **Navbar:** Whole bar given **border-radius 12px**.
- **CardsSection:** Download button height reverted to **47px** (aligned with translation banner top). "In a hurry?" given `mb-3` so it sits above the button. **Translation banner** border set to **border-2** (bolder). **Chevron** in Experience/Projects/Contact: header layout changed to **grid** `grid-cols-[1fr_auto]` so chevron never sits behind title text. **TLDR** in Experience/Projects: `overflow-hidden`, `leading-none` on title, `leading-tight` + `mt-1.5` on TLDR so content stays inside 168px cards. **Gap** between download button and Experience card set to **20px**.

---

### 7. Hero "in a hurry?"
- **Hero left column:** "in a hurry?" paragraph set to **position: absolute; bottom: 0; left: 0** inside the left column div (parent has `position: relative`) so it sits at the bottom of the div without affecting layout/margins.

---

## Beyond Code block

### 8. BeyondCode component
- **File:** `app/components/BeyondCode.tsx`
- **Placement:** **69px** below previous section. Block **562px** wide, **bg #323232**, **rounded 10px**. Text "BEYOND CODE" — Outfit bold 64px, letter-spacing -5%, #FFE7D0. Rendered after CardsSection.

---

## Listening / Drinking section

### 9. ListeningDrinkingSection component
- **File:** `app/components/ListeningDrinkingSection.tsx`
- **Layout:** Two-column grid 562px (281+281), 40px margin-top. **Left:** "Currently Listening" card **271px** wide, **height 68px**, bg **#1DB954**, rounded 10px. Text: "Currently Listening:" Outfit regular 24px -5% #323232; "of monsters and men : empire" Outfit regular 16px color background (#FFE7D0). **Play button:** User-provided 38×38 SVG, fill #FFE7D0. **Right:** "While Drinking to:" Outfit medium 34px #323232 in a **34px**-tall row; below, **Caramel Macchiato** card 271px wide, **34px** height, bg #FC6E20, rounded 10px — coffee icon (user SVG 24×24) + "Caramel Macchiato" Outfit medium 16px. Rendered after BeyondCode.

---

## Philosophy section

### 10. Philosophy component
- **File:** `app/components/Philosophy.tsx`
- **Placement:** **66px** below previous section. Heading "philosophy" — Outfit medium 128px, letter-spacing -10%, #1B1B1B, centered. **50px** gap to body paragraph. Paragraph: Outfit medium 24px, letter-spacing -5%, #1B1B1B, **text-justify**, max-width 562px. Rendered after ListeningDrinkingSection.

---

## Music Production section

### 11. MusicProduction component
- **File:** `app/components/MusicProduction.tsx`
- **Container:** **562×357px**, margin-top 50px, bg **#323232**, rounded 10px, padding (pl-8 pt-8 pb-8, pr 77px). **Heading:** "Music Production" Outfit medium 72px, -5% letter-spacing, #FFE7D0. **34.06px** below heading. Two columns: left **210×180px** justified text (Outfit medium 16px, #FFE7D0); right: image **public/music.jpg** **176×176** + "spotify" 8px Outfit medium #FFE7D0. **Gaps:** **65px** between left text and image; **77px** from image to right edge. Rendered after Philosophy.

---

## Blogs section

### 12. Blogs component
- **File:** `app/components/Blogs.tsx`
- **Placement:** **69px** below previous section. Heading "Blogs" — Outfit medium 128px, letter-spacing -10%, #1B1B1B. **50px** to list. **List items:** Title Outfit medium 40px, -10% letter-spacing, #323232, **396px** width; **32×32 redirect SVG** (unique pattern IDs per item); border-b between items. Titles: "In this time of AI everything is about building", "The Hidden Cost of Automation Nobody Talks About", "What I Wish I Knew Before Graduating". Rendered after MusicProduction.

---

## Experience card dropdown (full implementation)

### 13. Experience timeline & animation
- **Dependencies:** Added **framer-motion**.
- **Experience card:** **minHeight: 168**; chevron rotates **180°** when open. **AnimatePresence:** TLDR fades out when open; **32px** below "Experience", timeline **fades in** and **slides down** (height 0→auto, opacity, inner y -12→0). **Exit:** height→0, opacity→0. **Timeline:** 10px left of content: vertical line + dots. Each entry: **Company** Outfit regular 18px -11% #FFE7D0; **fixed 81.02px spacer**; **Role** 14px + external link icon; **13px** below: **description** 10px, **letter-spacing normal**, justified. **Data:** Deloitte (Project Intern), curiate solutions (SDE Intern), Pratwear (Developer). **Tweaks:** Consistent company–role gap via 81.02px spacer; description letterSpacing normal; smooth slide-down on expand.

---

## Projects card dropdown

### 14. Projects dropdown content
- **Projects card:** **minHeight: 168**; chevron **rotate={projectsOpen}**. **AnimatePresence:** TLDR fades out; project block fades in and slides down. **Per project:** Name Outfit regular 16px #323232; tagline 12px; external link top-right; image **221×140** rounded; description under image 12px normal letter-spacing.
- **PROJECT_ENTRIES:** (1) **NonLinear Workflows** — tagline "AI-Powered Workflow Automation SaaS", image project1.jpg, description (Composio SDK, 300+ tools, Redis 90% setup reduction, retry 95% success, OAuth/webhooks/rate limiting/queuing). (2) **LEXEL** — tagline "Self Hosted AI voice generative Web App with Live translation", image project2.png, description (TTS/voice-cloning, 23 languages, MOS scores, dark dashboard, R2, self-hosted TTS pipeline). **28px** margin between projects when expanded.

---

*Last updated: All sections and dropdowns documented for context across chats.*
