/**
 * UI copy for the site. English only: everything here is written by hand,
 * so keep it in one language instead of machine-translating it.
 */
export const STRINGS = {
  // Nav
  "nav.home": "Home",
  "nav.blogs": "Blogs",
  "nav.drawer": "Drawer",
  "nav.philosophy": "Philosophy",
  "nav.openMenu": "Open menu",
  "nav.closeMenu": "Close menu",
  // Hero
  "hero.intro": "i'm shobhit. i build backends, full-stack apps and AI systems.",
  "hero.cta": "graduated in 2026, looking for my next full-time role.",
  // Status card (right column, next to experience)
  "status.badge": "status",
  "status.text": "open to full-time backend, full-stack and AI roles.",
  "status.where": "remote, or anywhere in india",
  "status.cta": "say hi",
  // Cards
  "cards.inAHurry": "in a hurry?",
  "cards.downloadResume": "download resume",
  "cards.experience": "Experience",
  "cards.experienceAi": "AI Engineering",
  "cards.experienceFullStack": "FullStack Development",
  "cards.experienceDistributed": "Distributed Systems",
  "cards.projects": "Projects",
  "cards.projectsRepos": "github repos: {count}",
  "cards.projectsLeetcode": "leetcode: 1819 (top 7%)",
  "cards.projectsOpenSource": "open source: 3 orgs",
  // Shorter tl;dr lines for phones, where each card is half the screen wide
  "cards.projectsReposShort": "{count} repos",
  "cards.projectsLeetcodeShort": "LeetCode 1819",
  "cards.projectsOpenSourceShort": "3 open source orgs",
  // Project tiles (inside the open Projects card)
  "projects.details": "details",
  "projects.lessDetails": "less",
  "projects.readWriteup": "read the write-up",
  "cards.contact": "Contact",
  "cards.contactTldr": "gmail · github · twitter · linkedin",
  "cards.gmail": "gmail",
  "cards.github": "github",
  "cards.twitter": "twitter",
  "cards.linkedin": "linkedin",
  // Drawer (personal feed at /drawer)
  "drawer.title": "drawer",
  "drawer.intro": "thoughts, photos, clips and songs. unfiltered, newest first.",
  "drawer.empty": "nothing in the drawer yet.",
  "drawer.open": "open the drawer",
  "drawer.pinned": "pinned",
  "drawer.share": "share",
  "drawer.copied": "link copied",
  "drawer.more": "more in the drawer",
  "drawer.untitled": "untitled",
  // Beyond Code
  "beyondCode.title": "BEYOND CODE",
  // Listening / Drinking
  "listening.title": "Currently Listening:",
  "listening.track": "of monsters and men : empire",
  "listening.notListening": "Not listening right now",
  "listening.whileDrinking": "While Drinking to:",
  "listening.drink": "Caramel Macchiato",
  // Proof of Work
  "pow.title": "Proof of Work",
  "pow.summary": "Last {limit} events · {count} shown · older lives in Calendar",
  "pow.activity": "{count} contributions on github in the last {weeks} weeks",
  "pow.openCalendar": "open calendar",
  "pow.calendarUrl": "/api/pow/calendar",
  "pow.empty":
    "No events yet. Once GitHub webhooks are connected, you’ll see commits/PRs/CI here in near real time.",
  // Philosophy
  "philosophy.title": "philosophy",
  "philosophy.body":
    "this part is raw here, a space where i put my thoughts in. my journey has been tough, even though i still need to learn a lot but something that i am a firm believer of, genuine struggle always surpasses luck. I've seen so many of my people getting places for which they didnt prepare or worked hard for, purely based on luck. and i want to prove them wrong.",
  // Music Production
  "music.title": "Music Production",
  "music.body":
    "Given that i am a human, therefore i have hobbies, this one was a really expensive one. But the creativity and innovation it brought to my overall being is immense. and although i didnt make big here, i have learnt something that i am extremely proud of. checkout my pages.",
  "music.spotify": "spotify",
  // Blogs
  "blogs.title": "Blogs",
  // Footer
  "footer.philosophy": "Philosophy",
  "footer.blogs": "Blogs",
  "footer.contact": "Contact",
  // Back
  "back.label": "Back to home",
  // Project detail
  "project.github": "GITHUB",
  "project.live": "LIVE",
  "project.demo": "DEMO",
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey): string {
  return STRINGS[key];
}
