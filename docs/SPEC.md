# onlybots.cam — Project Specification

> A satirical art-activism website disguised as an AI companion platform, delivering a hard-hitting critique of the webcam industry.

---

## 1. Concept

### 1.1 Elevator Pitch

**onlybots.cam** is a Trojan Horse website. Visitors arrive expecting an AI girlfriend / webcam bot platform — instead they're confronted with the brutal reality of the webcam industry: exploitation, depression, suicide statistics, and trafficking data. It's ethical bait-and-switch as digital art.

### 1.2 Core Mechanism

| Phase | What the user expects | What actually happens |
|-------|----------------------|----------------------|
| **Discovery** | "Oh cool, another AI companion site" | Domain name + `.cam` TLD triggers curiosity |
| **Landing** | Glossy OnlyFans-style interface | Familiar dark UI with profile cards, "Subscribe" buttons |
| **The Switch** | Clicking "Enter" / "Subscribe" | Content morphs into statistics, testimonies, and hard truths |
| **The Aftermath** | Closing the tab | The user carries the cognitive dissonance with them |

### 1.3 Target Audiences

1. **HN / Tech Twitter** — the primary viral vector. They'll appreciate the craft and the commentary
2. **Reddit** (r/InternetIsBeautiful, r/webdev, r/antiwork) — secondary distribution
3. **Accidental visitors** — people who googled "onlybots" expecting AI companions
4. **Journalists** — covering the AI girlfriend / digital exploitation beat

---

## 2. Content Strategy

### 2.1 Key Statistics to Feature

All sourced data has been compiled in **[RESEARCH.md](RESEARCH.md)** — covering:

- Depression rates among webcam models vs. general population
- Suicide rates in the adult entertainment industry
- Average career length and post-career outcomes
- Trafficking statistics related to the webcam industry
- Financial exploitation (platform cuts, studio coercion)
- Mental health impact: PTSD, anxiety, substance abuse
- Age demographics (how young people enter the industry)

> **Action item:** All statistics MUST link to peer-reviewed studies, investigative journalism, or NGO reports. No unsourced claims. See [RESEARCH.md](RESEARCH.md) for the full source index.

### 2.2 Content Sections (Post-Switch)

1. **"The Real Cost"** — headline statistics in large typography
2. **"Behind the Screen"** — anonymized testimonies from former webcam workers
3. **"The Machine"** — how platforms profit (revenue breakdowns)
4. **"The Numbers"** — interactive data visualization of industry harm
5. **"What You Can Do"** — links to organizations fighting trafficking and exploitation
6. **"Further Reading"** — curated list of investigative articles and studies

### 2.3 Tone

- **Not preachy.** Let the data speak.
- **Not shaming the viewer.** The target is the *industry*, not the consumer.
- **Clinical + emotional.** Statistics paired with human stories.
- **No graphic content.** The horror is in the numbers, not in images.

---

## 3. Design & UX

### 3.1 Phase 1: The Bait (Landing State)

Visual language that parodies OnlyFans / webcam platforms:

- **Color palette:** Dark background (#0a0a0a), neon accents (hot pink #ff2d87, electric blue #00a2ff)
- **Typography:** Clean sans-serif (Inter or similar), bold headlines
- **Layout:** Grid of "creator" cards with blurred/glitched profile images
- **UI elements:** Fake "Subscribe" buttons, price tags, "Live Now" badges
- **Subtle wrongness:** Profile images are AI-generated but slightly uncanny. Names are obviously synthetic ("Model_4827", "Unit_0093"). Hints that something is off.

### 3.2 Phase 2: The Switch (Reveal State)

Triggered by clicking any interactive element:

- **Transition:** Screen glitches / dissolves. The pink neon drains to grayscale.
- **Cards flip:** Profile cards rotate to show statistics on their backs
- **Typography shift:** From marketing font to monospaced / typewriter (signals "raw truth")
- **Background:** Subtle particle effect — like static / digital noise
- **Content appears:** Statistics scroll in, testimonies fade in
- **No way back:** Once switched, the landing state is gone. The experience is one-way.

### 3.3 Three.js Enhancement (Optional but Recommended)

A 3D element that reinforces the message:

- **Concept: "The Digital Cage"** — a rotating wireframe cage/room with a silhouette inside
- **Alternative: "The Feed"** — floating profile cards in 3D space that crack/shatter on interaction
- **Alternative: "The Counter"** — a real-time counter of estimated active webcam sessions worldwide
- **Keep it minimal.** One strong 3D element > a bloated WebGL scene

### 3.4 Mobile Experience

- Must work flawlessly on mobile (most viral sharing happens on phones)
- Simplified Three.js or CSS-only fallback for low-end devices
- The "switch" transition should be just as impactful on small screens

---

## 4. Technical Architecture

### 4.1 Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Astro or Next.js (static export) | Fast, SEO-friendly, zero JS by default (Astro) |
| **Styling** | Tailwind CSS | Rapid prototyping, dark theme utilities |
| **3D** | Three.js + Drei (if React) | Learning goal + visual impact |
| **Animations** | GSAP or Framer Motion | The "switch" transition is the hero moment |
| **Hosting** | Vercel or Cloudflare Pages | Free tier, edge CDN, fast globally |
| **Analytics** | Plausible or Umami (self-hosted) | Privacy-respecting, no cookies |
| **Domain** | onlybots.cam (already owned) | Perfect TLD for the concept |

### 4.2 Recommended: Astro + Three.js

```
onlybots.cam/
├── public/
│   ├── fonts/
│   ├── images/          # Glitched AI-generated profile pics
│   └── og-image.png     # Critical for social sharing
├── src/
│   ├── components/
│   │   ├── LandingGrid.astro      # Fake profile cards
│   │   ├── ProfileCard.astro      # Individual card (bait state)
│   │   ├── StatCard.astro         # Individual card (reveal state)
│   │   ├── TheSwitch.tsx          # React island for transition logic
│   │   ├── Statistics.astro       # Data visualization section
│   │   ├── Testimonies.astro      # Anonymized stories
│   │   └── Resources.astro        # Links to organizations
│   ├── data/
│   │   ├── statistics.json        # All sourced stats
│   │   ├── testimonies.json       # Anonymized stories
│   │   └── resources.json         # NGO/charity links
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── SPEC.md
```

### 4.3 Performance Requirements

- **Lighthouse score:** 95+ on all metrics
- **First Contentful Paint:** < 1.5s
- **Total page weight:** < 500KB (excluding Three.js, which lazy-loads)
- **Three.js scene:** Lazy-loaded, with CSS fallback during load

---

## 5. SEO & Social Sharing (Critical for Virality)

### 5.1 Open Graph Tags

```html
<meta property="og:title" content="onlybots.cam" />
<meta property="og:description" content="They're always online. They never say no. But at what cost?" />
<meta property="og:image" content="https://onlybots.cam/og-image.png" />
<meta property="og:url" content="https://onlybots.cam" />
<meta name="twitter:card" content="summary_large_image" />
```

> The OG image should be **ambiguous** — visually referencing the "platform" aesthetic but with a subtle glitch or crack. Make people want to click.

### 5.2 Meta Description

> "onlybots.cam — They're always online. They never say no. But someone always pays the price."

### 5.3 Page Title Progression

- Tab title on landing: `onlybots.cam — Coming Soon`
- Tab title after switch: `onlybots.cam — The Real Cost`

---

## 6. Legal Considerations

### 6.1 Trademark Risk

- **OnlyFans** aggressively protects the "Only" prefix. The name "onlybots" is distinct enough but visual parody increases risk.
- **Mitigation:** Add a small disclaimer footer: *"This is a work of satire and social commentary. Not affiliated with any commercial platform."*
- **Defense:** Satire is protected under the First Amendment (US) and similar provisions in the EU. The `.cam` TLD and "bots" suffix clearly distinguish from OnlyFans.
- **Worst case:** A Cease & Desist letter. By then, the project has already gone viral = mission accomplished.

### 6.2 Content Considerations

- **No copyrighted images** from OnlyFans or any real platform
- **No real names** of webcam models or industry figures
- **All statistics sourced** with links to original publications
- **Testimonies anonymized** and with consent (or sourced from public reporting)

---

## 7. Launch Strategy

### 7.1 Pre-Launch (1-2 days before)

- [ ] Deploy to production
- [ ] Test on multiple devices and browsers
- [ ] Prepare HN submission title and text
- [ ] Draft tweets / threads
- [ ] Prepare Reddit posts for target subreddits

### 7.2 HN Submission

**Timing:** Tuesday or Wednesday, 9-11 AM EST (peak HN traffic)

**Title options** (pick the most compelling):
1. `Show HN: I bought onlybots.cam — it's not what you think`
2. `Show HN: onlybots.cam — a Trojan Horse for webcam industry awareness`
3. `Show HN: The website that pretends to sell AI girlfriends`

**Comment strategy:** Post a first comment explaining:
- The concept and why you built it
- The tech stack (HN loves technical details)
- Link to real statistics
- Keep it honest: "I'm not an NGO, I'm a developer who wanted to use code for something meaningful"

### 7.3 Social Media

- **Twitter/X:** Short video screen-recording of the "switch" moment. No explanation, just the URL.
- **Reddit:** r/InternetIsBeautiful (as a cool website), r/webdev (as a technical showcase)
- **Mastodon/Bluesky:** The tech-ethics crowd lives here

### 7.4 Success Metrics

| Metric | Target | Tool |
|--------|--------|------|
| HN front page | Top 30 | Manual check |
| Unique visitors (day 1) | 10,000+ | Plausible |
| Average time on page | > 60 seconds | Plausible |
| Social shares | 500+ | Manual tracking |
| Press mentions | 1+ | Google Alerts |

---

## 8. Monetization (Optional, Ethical Only)

This is NOT a revenue project. But if traffic is significant:

- **Donation button** → directing to anti-trafficking organizations (e.g., Polaris Project, Not For Sale)
- **"Buy me a coffee"** → for development costs only
- **No ads. Ever.** Ads would destroy the message and credibility.

---

## 9. Implementation Plan

### Phase 1: Foundation (Day 1-2)
- [ ] Initialize Astro project with Tailwind CSS
- [ ] Set up deployment pipeline (Vercel / Cloudflare Pages)
- [ ] Create base layout with dark theme
- [ ] Build the landing grid with placeholder profile cards
- [ ] Design and implement the fake "platform" UI

### Phase 2: The Switch (Day 3-4)
- [ ] Implement the transition animation (GSAP)
- [ ] Build the reveal state with statistics components
- [ ] Create the card flip animation
- [ ] Implement the color drain effect (pink → grayscale)
- [ ] Add content: statistics, testimonies, resources

### Phase 3: Polish & 3D (Day 5-6)
- [ ] Add Three.js scene ("Digital Cage" or alternative)
- [ ] Generate AI profile images with deliberate uncanny valley
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Mobile responsive testing and fixes
- [ ] Implement OG tags and social sharing preview

### Phase 4: Content & QA (Day 7)
- [ ] Finalize all statistics with proper sourcing
- [ ] Proofread all copy
- [ ] Cross-browser testing (Chrome, Firefox, Safari, mobile Safari)
- [ ] Accessibility audit (screen reader, keyboard navigation)
- [ ] Lighthouse audit → optimize to 95+

### Phase 5: Launch (Day 8)
- [ ] Final deployment
- [ ] Submit to HN
- [ ] Post to social media
- [ ] Monitor analytics and respond to comments

---

## 10. Recommendations & Suggestions

### ✅ Do

1. **Keep it a single page.** No navigation, no routes. One experience, one message. The constraint forces creative focus.
2. **Invest 80% of effort in "The Switch" moment.** This is the entire project. If the transition from fake-platform to real-statistics isn't emotionally jarring, nothing else matters.
3. **Use real, verified data only.** One wrong statistic and the entire project loses credibility on HN. Fact-check ruthlessly.
4. **Make the OG image ambiguous but clickable.** The social sharing preview is your primary acquisition channel. It needs to make people curious without revealing the twist.
5. **Add a "Share" button post-switch.** Make it frictionless to spread. Pre-fill tweet text with something impactful.
6. **Use the Three.js element sparingly.** One powerful visual > decorative 3D bloat. The "Digital Cage" concept is strong — a wireframe room with a figure inside, slowly rotating.
7. **Include a resources section.** Don't just shock — give people somewhere to direct their newly-activated concern.
8. **Put a human face on it.** Add a small "Why I built this" section at the very bottom with your name and a one-paragraph explanation.
9. **Time the HN post carefully.** Tuesday-Wednesday, morning US East Coast time. Avoid weekends and Mondays.
10. **Prepare for traffic.** Static hosting (Vercel/Cloudflare) can handle viral load, but test under stress.

### ❌ Don't

1. **Don't make it too long.** 3-4 scroll lengths maximum. Respect attention spans.
2. **Don't lecture or moralize.** Present facts, not opinions. Let the reader draw conclusions.
3. **Don't use graphic/triggering imagery.** The power is in the numbers and words, not shock images.
4. **Don't copy OnlyFans' exact layout** pixel-for-pixel. Evoke the aesthetic, don't replicate it. This reduces legal risk and is better design.
5. **Don't add a chatbot or AI interaction.** It would dilute the message and add unnecessary complexity.
6. **Don't spend more than 8-10 days on v1.** Ship it. Iterate if it gets traction.
7. **Don't neglect the emotional toll.** Researching this content is heavy. Set time limits on research sessions.

### 💡 Creative Suggestions

1. **Fake notification counter:** A badge showing "1,247 models online now" that, post-switch, changes to "1,247 reported cases of coercion this year."
2. **Glitch aesthetic for AI portraits:** Use CSS `filter` and `mix-blend-mode` to make profile pictures look slightly corrupted — reinforcing the "something is wrong here" feeling before the explicit reveal.
3. **Sound design (optional):** A subtle ambient hum that shifts to a heartbeat or silence on the switch. Risky (auto-play is hated) but powerful if user-initiated.
4. **Easter egg in source code:** Add HTML comments with statistics. Developers who "View Source" get an extra layer.
5. **Counter at the top:** "While you've been on this page, approximately X webcam sessions have started worldwide" — a live-updating estimate based on industry data.
6. **The "Subscribe" button:** When clicked, instead of a paywall, show: "You were about to pay $9.99/month. She gets $3.20 of that. The rest goes to the platform. Here's what else that money could do:" followed by equivalent donations.

---

## 11. Reference & Inspiration

- **Gun violence counter websites** — similar "shock through data" approach
- **The Fallen of World War II** (fallen.io) — data visualization as emotional storytelling
- **Do Not Track** (donottrack-doc.com) — interactive web documentary about privacy
- **If the Moon Were Only 1 Pixel** — single-page scrolling as storytelling device
- **Slavery Footprint** (slaveryfootprint.org) — personal impact calculator for ethical awareness

---

*Last updated: 2026-02-09*
