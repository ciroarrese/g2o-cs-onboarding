# Grow2on Design System

Faithful design system extracted from the live Grow2on website, **https://grow2on.com/** (Shopify, theme asset `/cdn/shop/t/6/assets/theme.css`). Every colour, radius, shadow, animation and font file in this project was read out of that stylesheet or downloaded from that CDN — nothing here is invented.

## The company

Grow2on is an Argentine/Spanish B2B SaaS **integrador de canales de venta**: it connects a merchant's ERP, warehouses and sales channels into one catalogue, then syncs stock, prices and orders automatically. Marketing claims on the site: +400 companies, 4.2M in average monthly sales processed, 99.9% SLA, "up to 80% less time spent on manual work". Offices in Córdoba (AR) and Madrid (ES). The app itself lives at `integrador.grow2on.com` (login-walled — **not** recreated here).

**Products / surfaces**
- **Marketing website** (grow2on.com) — the only publicly readable surface, and the source of this system. Recreated in `ui_kits/website/`.
- **Integrador** (the logged-in product) — referenced by the header "Log in" link. No public code or screenshots; deliberately not recreated. The laptop hero image (`assets/brand/laptop-home-g2o.png`) is the only glimpse of it.

**Sources used**
- https://grow2on.com/ , /pages/funcionalidades , /pages/integraciones , /pages/sos-un-erp , /pages/hablemos , /blogs/news — copy, structure, all imagery
- https://grow2on.com/cdn/shop/t/6/assets/theme.css — the complete token + component CSS (mirrored at `_source/theme.css`, pretty-printed at `_source/theme.pretty.css`)
- https://grow2on.com/cdn/shop/t/6/assets/theme.js — behaviour reference (mirrored at `_source/theme.js`)
- Geist OTF files from the same CDN → `assets/fonts/`

No Figma file, no repository and no slide deck were provided.

---

## Content fundamentals

**Language.** Rioplatense Spanish (Argentina), *voseo* throughout. Imperatives take the vos form and carry an accent on the last syllable: **Centralizá, Sincronizá, Publicá, Pedí, Vendé, Conectá, Contanos, Arrancá, Empezá, Dejá, Mirá, Sumate**. Never *centraliza / sincroniza* (tuteo) and never *centralice* (usted). Spain-facing pages keep the same voice.

**Person.** Second person singular, always addressing one operations lead: *"¿Tu equipo pierde horas cargando lo mismo en cada canal?"*, *"tu ERP, tus depósitos y tus canales"*. The company speaks as **nosotros** only when describing what it does *for* you: *"Vinculamos tu ERP, tus depósitos y tus canales de venta."* Never "I".

**Structure of a headline.** Short declaratives separated by full stops, often three beats: *"Centralizá tu catálogo. Vendé en todos tus canales. Sin errores."* Section headings are either a pain-point question (*"¿Tu equipo pierde horas cargando lo mismo en cada canal?"*) or a plain promise (*"Todo lo que Grow2on hace por tu negocio"*). Fragments are fine; exclamation marks are not.

**Body copy** is one or two sentences, concrete, quantified where possible: *"ahorrá hasta 80% del tiempo que hoy perdés en gestión manual"*, *"Cada venta genera automáticamente su nota de pedido en tu sistema de gestión."* Feature descriptions are ≤ 15 words and always describe the outcome, not the mechanism: *"Tus productos se actualizan solos, sin que nadie tenga que tocar nada."*

**Casing.** Sentence case everywhere — headings, buttons, nav, form labels. The only uppercase is footer column labels (PRODUCTO, HABLEMOS, AYUDA, REDES SOCIALES), the eyebrow labels above section headings, and the legal line (© GROW2ON 2026).

**CTAs** are first-person-of-the-user or imperative, and they name the reward, not the action: "Pedí tu demo gratis", "Pedí tu consultoría gratis →", "Quiero verlo en acción", "Hablemos", "Ver todas las funcionalidades →", "Ver cómo funciona ↓". Arrows are literal Unicode → and ↓ characters appended to the label.

**Emoji: never.** Not in copy, not in cards, not in the nav. The playfulness comes from the gradient and the 3D illustrations, never from emoji.

**Vibe.** Calm, practical, a little relieved — "your team can stop doing this by hand". It sells time back, not technology. Product nouns stay in Spanish (*publicaciones, stock, pedidos, canales, planillas*) while platform names stay verbatim (Mercado Libre, Tiendanube, WooCommerce, SAP ERP). One quirk worth keeping: line breaks are baked into feature titles ("Sincronización / de stock y precios") so the two-line rag is intentional.

---

## Visual foundations

**Colour.** One dominant brand colour — **pink #e7007e** — supported by **orange #f56406** and a rarely-seen **purple #770ce9** that appears only inside blurred background glows. Text is *not* black: body copy is grey **#5c5b5f**, and near-black **#1a1a1c** is reserved for headings. Surfaces are white on white with a **#dcdadd** hairline border; the only alternate background is **#f7f7f8**. Status colours (#1fa25a / #f5a623 / #d7016b) exist in the token set but barely surface in the marketing site. Maximum two background tones per page: white and grey-50.

**The gradient is the brand.** `linear-gradient(90deg,#e7007e,#f56406)` at `background-size:300% auto`, background-clipped to text, panning left↔right on a 3.5s ease-in-out infinite loop. It appears on card titles, stat numbers, and one emphasised phrase per headline. Use it sparingly — one gradient element per screenful.

**Type.** Geist, and only Geist (all 14 OTF weights are shipped in `assets/fonts/`). Real weights used: 400 body, 500 labels, 600 headings/buttons. `--font-weight-bold` is deliberately **600**, not 700 — the brand never sets 700 outside stat numbers. Headings clamp fluidly (h1 30→44px, h2 24→30px); h3 is a fixed 24px, h4 20px. Leading is 1.15 for headings, 1.5 for body. System monospace appears exactly once: 11px uppercase footer column labels at .04em tracking in #b8b6ba.

**Spacing & layout.** A coarse 8-based scale: 16 / 24 / 32 / 48 / 64 / 80. Container is 1160px max with 64px side padding, dropping to 32px under 900px and 20px under 600px. Sections are 64px top and bottom. Grid gap is 24px almost everywhere (32px in the integrations grid, 48px between blog rows). Feature and integration grids are 3- and 6-column, collapsing to 2 then 1. The header is sticky at z-index 50; nothing else is fixed.

**Backgrounds.** No photography, no textures, no repeating patterns. Depth comes from two devices: (1) **cloud blobs** — 3 circles in pink / orange / purple, `filter:blur(56px)`, 50% opacity, drifting 40px over 18–26s behind hero and CTA sections; (2) the **aurora** — the same three colours as radial gradients at 28px blur, 46% opacity, sitting under product screenshots inside cards. Card thumbnails without imagery fall back to a soft `linear-gradient(135deg,#ffe3cf,#ffd6ea,#e9d5ff)` that itself pans on a 6s loop.

**Imagery.** 3D-rendered, softly lit, warm-tinted illustrations (peach/pink/lilac) — the problem icons, the platform hub, and a family of translucent rendered objects: a gradient torus surrounded by iridescent bubbles (funcionalidades hero), the spinning open ring (home hero), the orbit ring (platform hub) and the ERP hero. They are always full-bleed on white with no cast shadow, never recoloured and never redrawn as SVG. A second decorative device is the **speckle**: tiny static pink/purple/orange dots that crowd the page gutters and thin out toward the centre — see `SpeckleEdge`. Product screenshots are UI captures, full-colour, with a `drop-shadow(0 8px 20px rgba(20,20,40,.18))`. Third-party platform logos always appear in their own brand colours on white; customer logos run **grayscale(1) at 60% opacity** in marquees. Never grain, never black & white photography, never stock photos.

**Animation.** Everything loops; nothing bounces. Timing functions are only `ease-in-out` (ambient loops), `ease` / `ease-out` (state changes) and `cubic-bezier(.4,0,.2,1)` (reveals and hover scale). Signature loops: gradient-shift 3.5s, badge-pulse 1.4s, dot-pulse 1.6s, hero-float 4–7s, orbit glow 1.8s, marquee 26s linear, hero backdrop spin 46s linear. Interaction transitions are 150–350ms. There is a full `prefers-reduced-motion` block on the live site — respect it.

**Hover states.** Four patterns, no more: cards **lift** `translateY(-3px)` and deepen their shadow; primary buttons lift `translateY(-1px)`; outline buttons and pills **fill or gain a pink border**; links and nav items **turn pink** (#e7007e → #b8005f for links). Active/selected states use an 8% pink wash `#e7007e14` plus a pink border — never a solid pink fill on a pill.

**Press states.** There are none in the source CSS. Nothing shrinks, darkens or depresses on click; hover carries all the feedback. Don't add `:active` scaling.

**Borders, radii, shadows.** Every surface carries a 1px #dcdadd border — shadows never replace the border. Radii: 6px inputs, 10px menus and FAQ items, 12px inner panels, 16px cards, 20px pills/filters, 999px buttons. Shadows are neutral (#1a1a1c at 6–14% alpha), never coloured — the single exception is the pink glow on the hub nodes and the `g2o-step-glow` pulse. Focus is a pink border colour change only; there is no focus ring.

**Transparency & blur.** Blur is used in three places only: the 56px cloud blur, the 28px aurora blur, and a 10px `backdrop-filter` on the mobile menu backdrop and mobile hub chips. Marquees fade at both edges with a mask gradient rather than a solid protection gradient. Dark tooltips are `#141826` at 92% alpha.

---

## Iconography

Grow2on uses **no icon font and no icon library**. There are exactly three kinds of glyph on the site, and this system copies all three:

1. **Raster PNG brand icons** — social icons (`assets/icons/icon-facebook|instagram|youtube|linkedin.png`) and country flags (`assets/icons/flag-argentina.png`, `flag-espana.png`). Copied verbatim.
2. **Raster PNG platform marks** — 19 full-colour platform logos plus 10 small square "iso" favicons used in mega-menu chips, in `assets/platforms/`. Always used as-is, never recoloured or outlined.
3. **3D-rendered PNG illustrations** — the three problem icons and the six feature screenshots in `assets/illustrations/`, plus the hand-drawn step arrow `assets/brand/flecha-pasos.png` and the rotating hero backdrop `assets/brand/hero-graphic.png`.

The *only* inline SVGs in the source are three utility strokes, reproduced in the components rather than shipped as files: the nav caret / select chevron (`M6 9l6 6 6-6`, 2px stroke, pink), and small circular status dots drawn as CSS. FAQ and mobile-accordion chevrons are the literal character **▾**. Arrows in button labels are the literal characters **→** and **↓**. **Emoji are never used.** No Lucide/Heroicons/Feather substitution was needed — nothing was missing.

---

## Index

| Path | What it is |
| --- | --- |
| `styles.css` | Global entry point — imports only. Link this one file. |
| `tokens/` | `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `radius.css`, `elevation.css`, `motion.css`, `base.css` |
| `assets/fonts/` | Geist, 14 OTF weights (originals from the Grow2on CDN) |
| `assets/brand/` | Logo, partner badge, hero backdrop, step arrow, laptop shot, hub centre, avatar |
| `assets/icons/` | Social icons, country flags |
| `assets/platforms/` | 19 platform logos + 10 square "iso" marks |
| `assets/illustrations/` | 3D problem icons, 6 feature screenshots |
| `assets/customers/` | 10 customer logos for the marquee |
| `components/` | React primitives (below) |
| `guidelines/` | 17 foundation specimen cards (Colors, Type, Spacing, Brand) |
| `components/data/` | Metric visuals: violet bar series, pink→purple SLA gauge, particle field, value chip |
| `components/brand/` | `PlatformHub` (orbit of platform logos) and `SpeckleEdge` (confetti page gutters) |
| `ui_kits/website/` | Click-through recreation of grow2on.com — see its own README |
| `_source/` | Mirrored `theme.css`, pretty-printed copy, and `theme.js` from the live site |
| `SKILL.md` | Agent Skills entry point |

### Components

**`components/core/`** — `Button`, `Badge`, `Card` (+ `CardVisual`), `Container` (+ `Section`), `GradientText`, `CloudBackground`

**`components/forms/`** — `Field`, `Select`, `Pill`, `ProgressSteps`

**`components/navigation/`** — `Header`, `Footer`, `FilterBar`, `MobileAccordion`

**`components/data/`** — `BarChart`, `Gauge`, `ParticleField`, `ValueChip`

**`components/brand/`** — `PlatformHub`, `SpeckleEdge`

**`components/content/`** — `Accordion`, `Marquee`, `StatCard`, `IntegrationTile`, `IntegrationPill`, `HoverCard`, `CtaBanner`, `StepItem`, `Tooltip`, `BlogCard`

Every component has a sibling `.d.ts` (props contract) and `.prompt.md` (one-line what/when + usage example). The inventory maps 1:1 onto the `.g2o-*` class families in the source stylesheet — no primitive was invented.

**Intentional additions:** none. **Intentional omissions:** the WebGL globe canvas (`ParticleField` stands in for its dot cloud) and the marquee-x4 variant. Everything else from the live site — including the orbit platform hub, the violet sales bars and the SLA gauge — is now a component. Their source keyframes are shipped in `tokens/motion.css`.

**Fonts:** the real Geist OTF files were downloaded from the Grow2on CDN. No substitution was made.
