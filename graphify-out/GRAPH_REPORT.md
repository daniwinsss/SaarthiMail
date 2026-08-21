# Graph Report - SaarthiMail  (2026-08-21)

## Corpus Check
- Corpus is ~20,388 words - fits in a single context window. You may not need a graph.

## Summary
- 400 nodes · 588 edges · 31 communities (27 shown, 4 thin omitted)
- Extraction: 90% EXTRACTED · 9% INFERRED · 1% AMBIGUOUS · INFERRED: 53 edges (avg confidence: 0.85)
- Token cost: 227,654 input · 40,178 output

## Community Hubs (Navigation)
- Mock Data and AI UI Widgets
- Deployment and Design Rationale
- Express App and Mail Controller
- App Shell and Client Routing
- Gmail Fetch and Summarization
- Frontend Build Toolchain
- Client Runtime Dependencies
- Server Bootstrap and DB Models
- Server Runtime Dependencies
- Server Package Scripts
- AI Prompt and LLM Clients
- Social Link Icon Sprites
- Hero Image Visual Language
- App Icon Sparkle Design
- Demo Login and Auth Routes
- Calendar Event Creation
- Brand Logo Mark
- Google and OpenAI SDKs
- Favicon Gradient Design
- React Template Assets
- Vite Template Assets
- Vercel Rewrite Config
- Motion and Accessibility
- Passport Auth Strategy
- Command Palette Concept

## God Nodes (most connected - your core abstractions)
1. `cn()` - 32 edges
2. `api` - 9 edges
3. `getOwnerEmail()` - 8 edges
4. `AIInsightPanel()` - 7 edges
5. `Calendar()` - 7 edges
6. `mapEmail()` - 7 edges
7. `AI Processing Pipeline` - 7 edges
8. `mapEmails()` - 6 edges
9. `priorityMeta()` - 6 edges
10. `parseGmailEmail()` - 6 edges

## Surprising Connections (you probably didn't know these)
- `Mocked-Data-First MVP Scope` --semantically_similar_to--> `Idempotent Demo Inbox Seeding (npm run seed:demo)`  [INFERRED] [semantically similar]
  designdoc.md → DEPLOY.md
- `AI Insights Side Panel` --semantically_similar_to--> `AI Panel Component`  [INFERRED] [semantically similar]
  README.md → designdoc.md
- `Omni Platform Design System (palette, radii, 4px spacing rhythm)` --conceptually_related_to--> `Client HTML Shell (#root mount, Inter font, logos.svg favicon)`  [AMBIGUOUS]
  designdoc.md → client/index.html
- `Future Improvements Roadmap (RAG memory, vector DB, semantic search, agents)` --conceptually_related_to--> `Saarthi Mail Deployment Guide`  [INFERRED]
  README.md → DEPLOY.md
- `Two-Project Vercel Architecture (saarthi-mail + saarthi-mail-api)` --references--> `Client HTML Shell (#root mount, Inter font, logos.svg favicon)`  [INFERRED]
  DEPLOY.md → client/index.html

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Vercel Serverless Deployment Constraints** — deploy_two_project_vercel_architecture, deploy_mongo_session_store, deploy_trust_proxy_secure_cookies, deploy_env_driven_url_configuration, deploy_atlas_open_ip_allowlist, deploy_cold_start_latency [EXTRACTED 1.00]
- **Read-Only Demo Access Flow** — deploy_read_only_demo_login, deploy_demo_write_blocking, deploy_idempotent_demo_seed, readme_google_oauth_session_auth, readme_gmail_sync [EXTRACTED 1.00]
- **Email Intelligence Pipeline Engines** — readme_ai_processing_pipeline, readme_summary_engine, readme_priority_engine, readme_meetings_detector, readme_reply_generation, readme_groq_llm_api [EXTRACTED 1.00]
- **Three-Sparkle Asymmetric Composition on Blue Field** — client_logos_blue_square_background, client_logos_primary_sparkle_glyph, client_logos_lower_left_accent_sparkle, client_logos_upper_right_accent_sparkle [INFERRED 0.85]
- **icons.svg Sprite Symbol Set** — client_public_icons_bluesky_icon, client_public_icons_discord_icon, client_public_icons_documentation_icon, client_public_icons_github_icon, client_public_icons_social_icon, client_public_icons_x_icon [EXTRACTED 1.00]
- **Monochrome (#08060d) Brand Logo Marks** — client_public_icons_bluesky_icon, client_public_icons_discord_icon, client_public_icons_github_icon, client_public_icons_x_icon [INFERRED 0.95]
- **Exploded Isometric Stack Composition** — client_src_assets_hero_wireframe_outline_upper_tile, client_src_assets_hero_solid_base_tile, client_src_assets_hero_dashed_alignment_guides, client_src_assets_hero_isometric_stacked_layers [EXTRACTED 1.00]
- **Hero Brand Visual Language** — client_src_assets_hero_purple_gradient_accent, client_src_assets_hero_minimal_transparent_branding, client_src_assets_hero_landing_page_marketing_asset, client_src_assets_hero_image [INFERRED 0.85]

## Communities (31 total, 4 thin omitted)

### Community 0 - "Mock Data and AI UI Widgets"
Cohesion: 0.08
Nodes (48): AIBadge(), AIInsightPanel(), PriorityTag(), Tabs(), AI_INSIGHTS, AI_SCORES, ATTACHMENTS, CALENDAR_EVENTS (+40 more)

### Community 1 - "Deployment and Design Rationale"
Cohesion: 0.07
Nodes (38): Client HTML Shell (#root mount, Inter font, logos.svg favicon), React + Vite Template Notes, MongoDB Atlas Open IP Allowlist for Vercel, Serverless Cold Start Latency, Demo Write Blocking (blockDemoWrites), DNS_SERVERS Resolver Override, dotenv Working-Directory Pitfall, Env-Driven URL Configuration (CLIENT_URL, VITE_API_BASE_URL, GOOGLE_CALLBACK_URL) (+30 more)

### Community 2 - "Express App and Mail Controller"
Cohesion: 0.10
Nodes (30): app, authroutes, cors, { ensureAuthenticated }, express, gmailRoutes, mailroutes, { MongoStore } (+22 more)

### Community 3 - "App Shell and Client Routing"
Cohesion: 0.11
Nodes (14): App(), MobileNavItem(), AssistButton(), ComposeForm(), ComposeModal(), TONES, Sidebar(), SidebarItem() (+6 more)

### Community 4 - "Gmail Fetch and Summarization"
Cohesion: 0.11
Nodes (19): decodeBase64Url(), Email, fetchEmails, getBodyFromPayload(), getEmailDetails, getGmailEmails(), getGmailMessage(), normalizeMessageBody() (+11 more)

### Community 5 - "Frontend Build Toolchain"
Cohesion: 0.07
Nodes (27): autoprefixer, devDependencies, autoprefixer, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals (+19 more)

### Community 6 - "Client Runtime Dependencies"
Cohesion: 0.08
Nodes (24): dependencies, clsx, framer-motion, lucide-react, react, react-dom, react-router-dom, tailwind-merge (+16 more)

### Community 7 - "Server Bootstrap and DB Models"
Cohesion: 0.09
Nodes (17): app, connectDB, app, applyDnsServers, connectDB, dotenv, mongoose, dns (+9 more)

### Community 8 - "Server Runtime Dependencies"
Cohesion: 0.11
Nodes (19): connect-mongo, cors, dotenv, express, express-session, mongoose, morgan, passport (+11 more)

### Community 9 - "Server Package Scripts"
Cohesion: 0.12
Nodes (16): nodemon, author, description, devDependencies, nodemon, keywords, license, main (+8 more)

### Community 10 - "AI Prompt and LLM Clients"
Cohesion: 0.15
Nodes (9): client, OpenAI, client, extractMeeting(), meetingPrompt, cleanReply(), client, generateReply() (+1 more)

### Community 11 - "Social Link Icon Sprites"
Cohesion: 0.39
Nodes (9): Bluesky Icon, Purple Brand Accent Stroke (#aa3bff), Discord Icon, Documentation Icon, GitHub Icon, Social Icon, Social Platform Link Icons, Icon Sprite Sheet (icons.svg) (+1 more)

### Community 12 - "Hero Image Visual Language"
Cohesion: 0.31
Nodes (9): Dashed Vertical Alignment Guides, SaarthiMail Hero Image, Isometric Stacked Rounded-Square Layers, Landing Page Marketing Asset Role, Layered Abstraction Product Story, Minimal Transparent-Background Brand Visual, Purple/Violet Gradient Edge Accent, Solid Base Tile with Colored Side Faces (+1 more)

### Community 13 - "App Icon Sparkle Design"
Cohesion: 0.36
Nodes (8): AI Sparkle Branding Motif, SaarthiMail App Icon (33x33 SVG), Full-Bleed Blue Square Background (#2764EB), Monochrome Blue Tint Palette, Favicon-Scale Icon Design (33px canvas, no viewBox), Lower-Left Accent Sparkle (#F2F5FD / #487CEE shadow), Primary Four-Point Sparkle Glyph (#F3F6FD), Upper-Right Muted Accent Sparkle (#D7E2FB)

### Community 14 - "Demo Login and Auth Routes"
Cohesion: 0.32
Nodes (6): buildDemoUser(), isDemoLoginEnabled(), { buildDemoUser, isDemoLoginEnabled }, express, passport, router

### Community 15 - "Calendar Event Creation"
Cohesion: 0.39
Nodes (7): createCalendarEvent(), extractMeetingSlots(), formatDateTimeWithOffset(), { google }, MONTHS, parseEmailDateTime(), stripOrdinal()

### Community 16 - "Brand Logo Mark"
Cohesion: 0.43
Nodes (7): AI-Assisted Email Product Identity, Solid Blue Badge Field (#2865EB, 48x38), SaarthiMail Brand Mark (logo.svg), Brand Palette (Royal Blue + Near-White), White Envelope / Card Glyph, Four-Point Sparkle / Star Accent, Public Static Web App Logo Asset

### Community 17 - "Google and OpenAI SDKs"
Cohesion: 0.33
Nodes (5): googleapis, openai, dependencies, googleapis, openai

### Community 18 - "Favicon Gradient Design"
Cohesion: 0.60
Nodes (5): SaarthiMail Favicon Icon, display-p3 Wide-Gamut Color Fallbacks, Double Lightning Bolt / Zigzag Glyph, Alpha Mask with Gaussian-Blurred Ellipse Layers, Purple/Violet Brand Palette (#863bff, #7e14ff, #ede6ff, #47bfff)

### Community 19 - "React Template Assets"
Cohesion: 0.67
Nodes (3): React Framework, React Logo (SVG Brand Mark), Vite Starter Template Asset

### Community 20 - "Vite Template Assets"
Cohesion: 0.67
Nodes (3): Dark Mode Color Scheme Support, Vite Build Tool, Vite Logo

## Ambiguous Edges - Review These
- `Client HTML Shell (#root mount, Inter font, logos.svg favicon)` → `Omni Platform Design System (palette, radii, 4px spacing rhythm)`  [AMBIGUOUS]
  designdoc.md · relation: conceptually_related_to
- `Social Icon` → `Social Platform Link Icons`  [AMBIGUOUS]
  client/public/icons.svg · relation: conceptually_related_to
- `White Envelope / Card Glyph` → `AI-Assisted Email Product Identity`  [AMBIGUOUS]
  client/public/logo.svg · relation: conceptually_related_to
- `Four-Point Sparkle / Star Accent` → `AI-Assisted Email Product Identity`  [AMBIGUOUS]
  client/public/logo.svg · relation: conceptually_related_to
- `Isometric Stacked Rounded-Square Layers` → `Landing Page Marketing Asset Role`  [AMBIGUOUS]
  client/src/assets/hero.png · relation: conceptually_related_to

## Knowledge Gaps
- **123 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+118 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Client HTML Shell (#root mount, Inter font, logos.svg favicon)` and `Omni Platform Design System (palette, radii, 4px spacing rhythm)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Social Icon` and `Social Platform Link Icons`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `White Envelope / Card Glyph` and `AI-Assisted Email Product Identity`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Four-Point Sparkle / Star Accent` and `AI-Assisted Email Product Identity`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Isometric Stacked Rounded-Square Layers` and `Landing Page Marketing Asset Role`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `cn()` connect `Mock Data and AI UI Widgets` to `App Shell and Client Routing`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Frontend Build Toolchain` to `Client Runtime Dependencies`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._