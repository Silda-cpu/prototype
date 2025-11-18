# Empowered Insight — Design System

A bold, movement-driven look fused with credible, data-forward UI.

**Identity blend**: 🔥 Activist energy + 💼 Smart consumer calm.

---

## Color Palette

### Primary Colors
- **Rose**: `#E11D48` (rose-600) - Primary brand color, activist energy
- **Slate Dark**: `#0F172A` (slate-900) - Trust and credibility
- **Rose Dark**: `#9F1239` (rose-800) - Darker primary variant

### Accent Colors
- **Orange**: `#F97316` (orange-500) - Energy and action
- **Emerald**: `#22C55E` (emerald-500) - Positive impact
- **Blue**: `#3B82F6` (blue-500) - Data and trust

### Neutrals
- `slate-50` (#F8FAFC) - Light background
- `slate-100` (#F1F5F9) - Subtle backgrounds
- `slate-200` (#E2E8F0) - Borders and hairlines
- `slate-300` (#CBD5E1) - Inactive states
- `slate-600` (#475569) - Secondary text
- `slate-700` (#334155) - Primary text on light
- `slate-800` (#1E293B) - Dark text
- `slate-900` (#0F172A) - Trust dark

### Semantic Colors
- **Support/High Score**: `emerald-500` (#22C55E), `emerald-600` (#16A34A)
- **Neutral/Mid Score**: `amber-500` (#F59E0B), `amber-600` (#D97706)
- **Boycott/Low Score**: `rose-500` (#F43F5E), `rose-600` (#E11D48)

### Gradients
- **CTA Gradient**: Rose-600 → Orange-500 (for primary buttons and calls-to-action)
  - `bg-gradient-to-r from-rose-600 to-orange-500`
- **Data Gradient**: Slate-900 → Indigo-900 (for data sections and headers)
  - `bg-gradient-to-r from-slate-900 to-indigo-900`

---

## Typography

### Fonts
- **Headings**: `Inter` (bold, tight tracking for impact)
  - Use `font-heading` class
  - Font weights: 600 (semibold), 700 (bold), 900 (black)
  - Letter spacing: tight (`tracking-tight`)
- **Body**: `Nunito` (legible, friendly)
  - Use `font-body` class
  - Font weights: 400 (regular), 600 (semibold)

### Type Scale
- **Heading 1**: `text-4xl sm:text-5xl font-black tracking-tight` (36px/48px)
- **Heading 2**: `text-2xl sm:text-3xl font-heading font-bold` (24px/30px)
- **Heading 3**: `text-xl font-heading font-semibold` (20px)
- **Heading 4**: `text-lg font-heading font-semibold` (18px)
- **Body Large**: `text-lg` (18px)
- **Body**: `text-base` (16px)
- **Body Small**: `text-sm` (14px)
- **Caption**: `text-xs` (12px)

### Uppercase Usage
- Use UPPERCASE with `uppercase tracking-wide` for:
  - Primary button labels
  - Section labels
  - Small CTAs

---

## Layout & Spacing

### Container
- Max width: `max-w-7xl`
- Padding: `px-6` horizontal, `py-10` vertical rhythm

### Grid System
- **Desktop**: 12 columns (`md:grid-cols-3`, `lg:grid-cols-4`)
- **Tablet**: 6 columns (`md:grid-cols-2`, `md:grid-cols-3`)
- **Mobile**: 2 columns (`grid-cols-2`)

### Spacing Scale
Base unit: 8px. Use multiples: 8, 12, 16, 24, 32, 40, 48, 64

- **Component gaps**: `gap-4` (16px), `gap-6` (24px), `gap-8` (32px)
- **Section padding**: `py-10` (40px), `py-14` (56px), `py-24` (96px)
- **Card padding**: `p-5` (20px), `p-6` (24px)

### Cards
- Border radius: `rounded-2xl` (16px)
- Shadow: `shadow-md` default, `shadow-xl` on hover
- Border: 1px hairline in `slate-200`
- Padding: `p-5` or `p-6` depending on content density

### Contrast Blocks
- Alternate light and dark sections to segment content
- Use `.gradient-data` for dark hero sections
- Use `bg-slate-50` for light section backgrounds

---

## Components

### Buttons

#### Primary Button
- **Gradient**: Rose → Orange (`.gradient-cta`)
- **Rounded**: `rounded-2xl`
- **Padding**: `px-5 py-3`
- **Font**: `font-heading text-sm uppercase tracking-wide`
- **Shadow**: `shadow-card`
- **Focus**: `ring-2 ring-rose-400`
- **Disabled**: `opacity-60`

```tsx
<button className="gradient-cta rounded-2xl px-5 py-3 font-heading text-sm uppercase tracking-wide shadow-card focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-60">
  Explore brands
</button>
```

#### Ghost/Secondary Button
- **Background**: White with slate border
- **Rounded**: `rounded-2xl`
- **Padding**: `px-5 py-3`
- **Border**: `border border-slate-300`
- **Hover**: `bg-slate-50`
- **Focus**: `ring-2 ring-slate-400`

```tsx
<button className="rounded-2xl px-5 py-3 font-heading text-sm uppercase tracking-wide border border-slate-300 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400">
  Back
</button>
```

### Score Badges
- **Shape**: Circular with ring border
- **Placement**: Grid centered
- **Sizes**:
  - Small: `w-9 h-9 text-xs`
  - Medium: `w-12 h-12 text-sm`
  - Large: `w-16 h-16 text-lg`
- **Color Coding**:
  - High (≥70): `ring-emerald-400 text-emerald-600`
  - Mid (40-69): `ring-amber-400 text-amber-600`
  - Low (<40): `ring-rose-400 text-rose-600`
  - No data: `ring-slate-300 text-slate-500`

```tsx
// High score example
<div className="grid place-items-center rounded-full ring-4 ring-emerald-400 bg-white w-12 h-12">
  <div className="font-heading font-semibold text-emerald-600">85</div>
</div>
```

### Tags / Chips
- **Background**: `bg-slate-100`
- **Border**: `border-slate-200`
- **Rounded**: `rounded-xl`
- **Padding**: `px-3 py-1`
- **Text**: `text-xs text-slate-700`

```tsx
<span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1 text-xs text-slate-700 border border-slate-200">
  Worker Fairness
</span>
```

### Cards

#### Standard Card
```tsx
<div className="card p-5">
  {/* Content */}
</div>
```

#### Card with Hover Effect
```tsx
<div className="card card-hover p-5">
  {/* Content */}
</div>
```

#### Hairline Divider
```tsx
<div className="hairline" />
```

---

## Iconography

- **Library**: Lucide React
- **Style**: Outline icons by default
- **Hover**: Subtle fills on interactive icons
- **Sizes**: 
  - `size-4` (16px) - Small icons, inline with text
  - `size-5` (20px) - Standard icons
  - `size-6` (24px) - Large icons

---

## Motion & Animation

### Timing
- **Fast**: 150ms - Page transitions, fades
- **Medium**: 200ms - Card hovers, button presses  
- **Slow**: 220ms - Modal entries

### Effects
- **Card hover**: `transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl`
- **Button press**: Scale to `0.98` for 100ms
- **Page enter**: Fade in (150ms)
- **Modal enter**: Scale in (180ms)
- **Loading**: Shimmer animation for skeleton states

### Accessibility
- Respect `prefers-reduced-motion` for users with motion sensitivity
- Disable intense animations when reduced motion is preferred

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Utility Classes

### Custom Utilities (defined in index.css)

```css
.gradient-cta { 
  @apply bg-gradient-to-r from-rose-600 to-orange-500 text-white; 
}

.gradient-data { 
  @apply bg-gradient-to-r from-slate-900 to-indigo-900 text-white; 
}

.card { 
  @apply bg-white border border-slate-200 rounded-2xl shadow-md; 
}

.card-hover { 
  @apply transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-xl; 
}

.hairline { 
  @apply border border-slate-200/60; 
}
```

---

## Microcopy & Labels

### Global
- **Search**: "Search brands or categories"
- **Empty state**: "Your first pick could spark change."
- **Save action**: "Save" → "Saved"

### Home Page
- **Hero title**: "Buy with Power. Back it with Data."
- **Hero subtitle**: "Discover how brands treat people and the planet. Make every purchase a vote for change."
- **Primary CTA**: "Explore brands"

### Browse/Explore
- **Header**: "Explore categories"
- **Tile helper**: "Top brands ranked by impact"
- **Search placeholder**: "Search brands or categories"

### Brand/Store Detail
- **Sections**: "Score breakdown", "Evidence", "Take action"
- **Actions**: "Support", "Avoid", "Share this brand"
- **Score label**: "Independent Impact Score, updated quarterly"
- **CTA**: "View impact"

### Request Modal
- **Step 1**: "Who needs the spotlight?"
- **Step 2**: "Why does it matter?"
- **Step 3**: "Review & send"
- **Submit CTA**: "Submit request"

### Favorites
- **Empty**: "Your first pick could spark change. Save brands to build your impact list."
- **CTA**: "Find brands"
- **Header**: "Your saved brands"
- **Subheader**: "Track and share your favorites."

---

## Page Layouts

### Home / Hero
- **Dark gradient header** (`.gradient-data`)
- **Large statement headline** (`text-4xl font-black`)
- **Single primary CTA** button
- **Max width container** (`max-w-7xl`)

### Explore / Browse
- **Big tappable category tiles**
- **Prominent search bar** at top
- **Grid layout** (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`)
- **Filter button** in header

### Brand Detail
- **Full gradient header** with large score badge
- **Two-column layout** on desktop (content + actions sidebar)
- **Progress bars** for score breakdown
- **Evidence cards** with external link icons

---

## Accessibility Standards

### Contrast
- **Body text**: Minimum 4.5:1 contrast ratio
- **Large headlines**: Minimum 3:1 contrast ratio
- **Interactive elements**: Clear focus states with `ring-2`

### Screen Readers
- Always provide `sr-only` labels for icon-only buttons
- Include aria-labels for score badges
- Use semantic HTML structure (header, nav, main, section, etc.)

### Touch Targets
- **Minimum size**: 44px × 44px on mobile
- **Adequate spacing**: Between tappable elements (minimum 8px)

### Typography
- **Body font size**: Minimum 16px on mobile (prevents zoom on input focus)
- **Line height**: 1.5 for body text, 1.2-1.3 for headings
- **Paragraph width**: Max 75 characters for readability

---

## Implementation Notes

### Priority Order
1. **Colors and gradients** (index.css variables)
2. **Typography** (fonts loaded, utility classes)
3. **Component primitives** (buttons, badges, cards)
4. **Page layouts** (Home, Browse, Detail)
5. **Motion and polish**

### Custom Shadow
Add to tailwind.config.ts:
```ts
boxShadow: {
  card: "0 8px 24px -8px rgba(2,6,23,0.2)",
}
```

### Font Loading
Load Inter and Nunito from Google Fonts or use system alternatives:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@600;700;900&family=Nunito:wght@400;600&display=swap" rel="stylesheet">
```

### Testing Checklist
- [ ] All text meets contrast requirements
- [ ] Focus states visible on all interactive elements  
- [ ] Mobile tap targets adequate (≥44px)
- [ ] Reduced motion preference respected
- [ ] Gradients render correctly across browsers
- [ ] Cards have proper hover states
- [ ] Score badges color-coded correctly
- [ ] Fonts loaded and applied correctly
