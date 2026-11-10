# UI kit — grow2on.com (marketing website)

Click-through recreation of the public Grow2on site, built entirely from this design system's components.

**Screens**

| Screen | File | Source page |
| --- | --- | --- |
| Home | `Home.jsx` | https://grow2on.com/ |
| Integraciones | `Pages.jsx` → `Integraciones` | /pages/integraciones |
| Funcionalidades | `Pages.jsx` → `Funcionalidades` | /pages/funcionalidades |
| Blog | `Pages.jsx` → `Blog` | /blogs/news |
| Hablemos (single-step form) | `Pages.jsx` → `Hablemos` | /pages/hablemos |
| ¿Sos un ERP? | `Pages.jsx` → `Erp` | /pages/sos-un-erp |

`Shared.jsx` holds the real platform, customer, feature, extra-feature, ERP-partner and blog-post copy read verbatim from the live site. Every screen here was built from a fetched page — home, /pages/funcionalidades, /pages/integraciones, /pages/sos-un-erp, /pages/hablemos, /blogs/news — no invented copy remains.

**Interactions that work:** header nav and CTA routing, the integrations category filter (Todas / Marketplaces / Plataformas de E-commerce / ERPs, with the real counts 18 / 5 / 6 / 7), the two-select lead form with a success state, platform tooltips, logo marquees.

**Deliberately omitted** (present on the live site, not rebuilt here because they are canvas/JS set-pieces rather than design-system components): the WebGL globe in the stats card, the animated orbit "platform hub" with travelling light dots, and the YouTube video embed.
