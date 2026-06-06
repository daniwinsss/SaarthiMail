# Saarthi Mail — Frontend Design System Doc

Saarthi Mail is a premium AI-powered email assistant inspired by Gmail and built using the Omni Platform design system. The UI should feel calm, intelligent, modern, and hackathon-winning while maintaining strong usability and smooth motion.

## Design Direction

* Gmail-inspired productivity layout
* Glassy premium surfaces
* Full-bleed grid composition
* AI-native experience
* Minimal but expressive motion
* Strong spacing consistency

## Frontend Stack

* React + Vite (JavaScript)
* Tailwind CSS
* Framer Motion
* React Router
* shadcn/ui
* Lucide Icons

## Core Pages

* `/auth`
* `/inbox`
* `/mail/:id`
* `/priority`
* `/settings`

## Layout Structure

Desktop:

```text
| Sidebar | Email List | Email Detail | AI Panel |
```

Mobile:

* Sidebar drawer
* Bottom navigation
* Fullscreen mail view

## Design System

### Colors

Use Omni palette:

* Primary: #3B82F6
* Secondary: #4ADE80
* Tertiary: #A855F7
* Background: #FFFFFF
* Surface: #FAF5FF
* Text Primary: #171717
* Text Secondary: #737373
* Border: #F5F5F5

### Typography

Use clean system fonts:

* Large headings
* Compact readable email rows
* Strong spacing hierarchy

### Radius System

Allowed radii only:

* 4px
* 6px
* 8px
* 12px
* 16px
* Full pill

### Spacing

Use strict 4px rhythm:

* 4
* 8
* 12
* 16
* 24
* 32

## Surface Style

Use Omni glass-style surfaces:

* Light blur
* Soft borders
* Minimal shadows
* Frosted panel feel

Avoid:

* Heavy shadows
* Dark neumorphism
* Excessive gradients

## Main Components

### Sidebar

Contains:

* Logo
* Inbox
* Priority
* Drafts
* Scheduled
* Settings

Behavior:

* Glass panel
* Animated collapse
* Hover highlights

### Topbar

Contains:

* Search bar
* Command palette trigger
* Notifications
* User profile

### Email List

Each row includes:

* Sender
* Subject
* Snippet
* Timestamp
* Priority indicator
* AI badge

Interactions:

* Hover elevation
* Smooth active transition
* Slide/fade loading

### Email Detail

Contains:

* Full thread
* AI summary
* Suggested replies
* Calendar extraction
* Quick actions

### AI Panel

Displays:

* Inbox insights
* Follow-ups
* Suggested actions
* Meeting extraction
* AI confidence

## Motion System

### Motion Style

Use expressive but controlled motion:

* Fast
* Smooth
* Premium
* Productivity-focused

### Animation Timing

* 150ms
* 300ms

### Motion Usage

Use Framer Motion for:

* Sidebar transitions
* Card reveal animations
* Email selection transitions
* AI insight stagger animations
* Skeleton loading
* Hover interactions

Avoid:

* Bouncy motion
* Over-animated effects
* Long transitions

## Glassmorphism Rules

Use subtle glass only:

* AI panel
* Auth screen
* Floating controls

Do not apply glass everywhere.

## Command Palette

Must support:

* Search emails
* Compose
* Open Inbox
* Archive mail
* Mark important
* Toggle AI panel
* Open settings

## Accessibility

* Keyboard navigation
* Visible focus rings
* Reduced motion support
* High contrast text
* Screen reader labels

## Responsive Behavior

Desktop:

* Full 4-panel workspace

Tablet:

* Collapsible sidebar
* Docked AI panel

Mobile:

* Single-column flow
* Bottom navigation
* Drawer menu

## Folder Structure

```text
src/
 ├── components/
 ├── pages/
 ├── routes/
 ├── hooks/
 ├── data/
 ├── store/
 ├── styles/
 └── utils/
```

## MVP Scope

Build first:

* Auth screen
* Inbox UI
* Email detail screen
* AI insight panel
* Responsive layout
* Motion polish
* Mocked data

Backend integration and Gmail APIs can be added later.

## Success Criteria

Saarthi Mail should:

* Feel premium instantly
* Look polished in demos
* Have smooth interactions
* Feel AI-native
* Maintain calm productivity-focused UX
* Be visually strong enough for hackathons
