/* @ds-bundle: {"format":4,"namespace":"Grow2onDesignSystem_455be5","components":[{"name":"PlatformHub","sourcePath":"components/brand/PlatformHub.jsx"},{"name":"SpeckleEdge","sourcePath":"components/brand/SpeckleEdge.jsx"},{"name":"Accordion","sourcePath":"components/content/Accordion.jsx"},{"name":"BlogCard","sourcePath":"components/content/BlogCard.jsx"},{"name":"CtaBanner","sourcePath":"components/content/CtaBanner.jsx"},{"name":"HoverCard","sourcePath":"components/content/HoverCard.jsx"},{"name":"IntegrationTile","sourcePath":"components/content/IntegrationTile.jsx"},{"name":"IntegrationPill","sourcePath":"components/content/IntegrationTile.jsx"},{"name":"Marquee","sourcePath":"components/content/Marquee.jsx"},{"name":"StatCard","sourcePath":"components/content/StatCard.jsx"},{"name":"StepItem","sourcePath":"components/content/StepItem.jsx"},{"name":"Tooltip","sourcePath":"components/content/Tooltip.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"CardVisual","sourcePath":"components/core/Card.jsx"},{"name":"CloudBackground","sourcePath":"components/core/CloudBackground.jsx"},{"name":"Container","sourcePath":"components/core/Container.jsx"},{"name":"Section","sourcePath":"components/core/Container.jsx"},{"name":"GradientText","sourcePath":"components/core/GradientText.jsx"},{"name":"BarChart","sourcePath":"components/data/BarChart.jsx"},{"name":"Gauge","sourcePath":"components/data/Gauge.jsx"},{"name":"ParticleField","sourcePath":"components/data/ParticleField.jsx"},{"name":"ValueChip","sourcePath":"components/data/ValueChip.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"Pill","sourcePath":"components/forms/Pill.jsx"},{"name":"ProgressSteps","sourcePath":"components/forms/ProgressSteps.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"FilterBar","sourcePath":"components/navigation/FilterBar.jsx"},{"name":"Footer","sourcePath":"components/navigation/Footer.jsx"},{"name":"Header","sourcePath":"components/navigation/Header.jsx"},{"name":"MobileAccordion","sourcePath":"components/navigation/MobileAccordion.jsx"}],"sourceHashes":{"components/brand/PlatformHub.jsx":"370d701b91ac","components/brand/SpeckleEdge.jsx":"ba6ba59056db","components/content/Accordion.jsx":"edcab26e1723","components/content/BlogCard.jsx":"03f59e1dc32c","components/content/CtaBanner.jsx":"0ff204de7d7c","components/content/HoverCard.jsx":"1b845f629565","components/content/IntegrationTile.jsx":"268375118e43","components/content/Marquee.jsx":"dd053a3af057","components/content/StatCard.jsx":"9702ab074f39","components/content/StepItem.jsx":"1feb43ecf377","components/content/Tooltip.jsx":"e8869ece0188","components/core/Badge.jsx":"4ba2df4fc369","components/core/Button.jsx":"3f19556a27b6","components/core/Card.jsx":"20e596977b15","components/core/CloudBackground.jsx":"0d8b25d2cbfc","components/core/Container.jsx":"257d2f2420f8","components/core/GradientText.jsx":"c99c86f9aa6b","components/data/BarChart.jsx":"fcc3da328901","components/data/Gauge.jsx":"ad7e49b19c30","components/data/ParticleField.jsx":"561565b1547b","components/data/ValueChip.jsx":"fc58f8e698bd","components/forms/Field.jsx":"eeab42bc40af","components/forms/Pill.jsx":"74e9dc749fb2","components/forms/ProgressSteps.jsx":"9c3a342af481","components/forms/Select.jsx":"2e6e3d1c623a","components/navigation/FilterBar.jsx":"5aecfa93f87f","components/navigation/Footer.jsx":"9b8aa9441895","components/navigation/Header.jsx":"fd7e4dc289c0","components/navigation/MobileAccordion.jsx":"d53a36aa27e9","ui_kits/website/Home.jsx":"53e824136310","ui_kits/website/Pages.jsx":"32fd76083bcd","ui_kits/website/Shared.jsx":"1df5264c39a1"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.Grow2onDesignSystem_455be5 = window.Grow2onDesignSystem_455be5 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/PlatformHub.jsx
try { (() => {
const RADIUS_X = 44,
  RADIUS_Y = 34,
  CX = 50.3,
  CY = 50;
function PlatformHub({
  center,
  nodes = [],
  startAngle = -100,
  background = 'linear-gradient(160deg,#f6f4fb 0%,#ffffff 45%,#f7f2f8 100%)',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(-1);
  const n = nodes.length || 1;
  const placed = nodes.map((nd, i) => {
    const a = (startAngle + 360 / n * i) * Math.PI / 180;
    return {
      ...nd,
      left: CX + RADIUS_X * Math.cos(a),
      top: CY + RADIUS_Y * Math.sin(a),
      delay: i % 6 * .4
    };
  });
  return React.createElement('div', {
    style: {
      position: 'relative',
      width: '100%',
      maxWidth: 1100,
      aspectRatio: '1350/881',
      margin: '0 auto',
      background,
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      ...style
    },
    ...rest
  }, React.createElement('svg', {
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      overflow: 'visible',
      pointerEvents: 'none'
    },
    viewBox: '0 0 100 100',
    preserveAspectRatio: 'none'
  }, placed.map((p, i) => React.createElement('line', {
    key: i,
    x1: CX,
    y1: CY,
    x2: p.left,
    y2: p.top,
    stroke: 'rgba(120,110,140,.28)',
    strokeWidth: .12
  }))), React.createElement('div', {
    style: {
      position: 'absolute',
      left: CX + '%',
      top: CY + '%',
      width: '27.4%',
      aspectRatio: '1/1',
      transform: 'translate(-50%,-50%)',
      borderRadius: '50%',
      animation: 'orbit-center-glow 1.8s ease-in-out infinite',
      pointerEvents: 'none'
    }
  }), center && React.createElement('img', {
    src: center,
    alt: 'Grow2on',
    style: {
      position: 'absolute',
      left: CX + '%',
      top: CY + '%',
      width: '66.3%',
      aspectRatio: '1173/579',
      transform: 'translate(-49.3%,-50.8%)',
      objectFit: 'contain',
      pointerEvents: 'none'
    }
  }), placed.map((p, i) => React.createElement('a', {
    key: p.label || i,
    href: p.href || '#',
    onMouseEnter: () => setHover(i),
    onMouseLeave: () => setHover(-1),
    style: {
      position: 'absolute',
      left: p.left + '%',
      top: p.top + '%',
      display: 'block',
      width: '10.4%',
      aspectRatio: '1/1',
      transform: 'translate(-50%,-50%)',
      zIndex: hover === i ? 4 : 2
    }
  }, React.createElement('span', {
    style: {
      display: 'block',
      width: '100%',
      height: '100%',
      animation: `orbit-float ${4 + i % 3}s ease-in-out ${p.delay}s infinite`
    }
  }, React.createElement('span', {
    style: {
      display: 'flex',
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      background: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '18%',
      boxSizing: 'border-box',
      cursor: 'pointer',
      boxShadow: hover === i ? 'var(--shadow-node-hover)' : 'var(--shadow-node)',
      transform: hover === i ? 'scale(1.14) translateY(-4px)' : 'scale(1)',
      transition: 'transform .3s cubic-bezier(.4,0,.2,1),box-shadow .3s ease'
    }
  }, React.createElement('img', {
    src: p.src,
    alt: p.label || '',
    style: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain',
      filter: hover === i ? 'grayscale(0) contrast(1.05)' : 'grayscale(.35) opacity(.9)',
      transition: 'filter .3s ease'
    }
  }))), p.label && React.createElement('span', {
    style: {
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%,-8px)',
      background: '#141826eb',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      padding: '6px 12px',
      marginBottom: 6,
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-tooltip)',
      zIndex: 5,
      pointerEvents: 'none',
      opacity: hover === i ? 1 : 0,
      visibility: hover === i ? 'visible' : 'hidden',
      transition: 'opacity .2s ease',
      display: 'block'
    }
  }, p.label, p.sub && React.createElement('span', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 10.5,
      fontWeight: 400,
      color: '#ffffffbf',
      marginTop: 2
    }
  }, React.createElement('i', {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--gradient-brand)',
      display: 'inline-block',
      animation: 'chip-pulse 1.2s ease-in-out infinite',
      fontStyle: 'normal'
    }
  }), p.sub)))));
}
Object.assign(__ds_scope, { PlatformHub });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/PlatformHub.jsx", error: String((e && e.message) || e) }); }

// components/brand/SpeckleEdge.jsx
try { (() => {
const COLORS = ['#e7007e', '#770ce9', '#f56406', '#b8005f', '#9a45f2'];
function SpeckleEdge({
  edges = ['left', 'right'],
  count = 160,
  spread = 26,
  seed = 3,
  style,
  ...rest
}) {
  const dots = React.useMemo(() => {
    let s = seed;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const out = [];
    for (let i = 0; i < count; i++) {
      const edge = edges[i % edges.length];
      // bias inward: dense at the edge, sparse toward the middle
      const d = Math.pow(rnd(), 2.1) * spread;
      const along = rnd() * 100;
      const pos = edge === 'left' ? {
        left: d + '%',
        top: along + '%'
      } : edge === 'right' ? {
        right: d + '%',
        top: along + '%'
      } : edge === 'top' ? {
        top: d + '%',
        left: along + '%'
      } : {
        bottom: d + '%',
        left: along + '%'
      };
      out.push({
        ...pos,
        size: (1 + rnd() * 3).toFixed(1),
        color: COLORS[Math.floor(rnd() * COLORS.length)],
        op: (.25 + rnd() * .65).toFixed(2)
      });
    }
    return out;
  }, [edges.join(), count, spread, seed]);
  return React.createElement('div', {
    'aria-hidden': 'true',
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0,
      ...style
    },
    ...rest
  }, dots.map((d, i) => React.createElement('span', {
    key: i,
    style: {
      position: 'absolute',
      left: d.left,
      right: d.right,
      top: d.top,
      bottom: d.bottom,
      width: d.size + 'px',
      height: d.size + 'px',
      borderRadius: '50%',
      background: d.color,
      opacity: d.op
    }
  })));
}
Object.assign(__ds_scope, { SpeckleEdge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/SpeckleEdge.jsx", error: String((e && e.message) || e) }); }

// components/content/Accordion.jsx
try { (() => {
function Accordion({
  items = [],
  defaultOpen = -1,
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return React.createElement('div', {
    style
  }, items.map((it, i) => React.createElement('div', {
    key: it.q,
    style: {
      background: 'var(--color-surface-card)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
      marginBottom: 12
    }
  }, React.createElement('button', {
    type: 'button',
    onClick: () => setOpen(open === i ? -1 : i),
    style: {
      width: '100%',
      textAlign: 'left',
      background: 'none',
      border: 'none',
      padding: '18px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      cursor: 'pointer',
      fontFamily: 'inherit',
      fontSize: 'var(--text-body)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--g2o-pink)'
    }
  }, it.q, React.createElement('span', {
    style: {
      fontSize: 14,
      color: 'var(--g2o-pink)',
      transition: 'transform .15s ease',
      flexShrink: 0,
      transform: open === i ? 'rotate(180deg)' : 'none'
    }
  }, '▾')), open === i && React.createElement('div', {
    style: {
      padding: '0 20px 18px',
      fontSize: 'var(--text-body)',
      color: 'var(--color-text-secondary)',
      lineHeight: 'var(--leading-body)'
    }
  }, it.a))));
}
Object.assign(__ds_scope, { Accordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Accordion.jsx", error: String((e && e.message) || e) }); }

// components/content/BlogCard.jsx
try { (() => {
function BlogCard({
  title,
  excerpt,
  date,
  tag,
  image,
  href,
  style
}) {
  return React.createElement('a', {
    href: href || '#',
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      color: 'inherit',
      ...style
    }
  }, React.createElement('div', {
    style: {
      aspectRatio: '16/9',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      background: 'var(--gradient-thumb-3)',
      backgroundSize: '200% 200%',
      animation: 'g2o-gradient-shift 6s ease-in-out infinite',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, image && React.createElement('img', {
    src: image,
    alt: '',
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  })), tag && React.createElement('span', {
    style: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: 'var(--tracking-eyebrow)',
      textTransform: 'uppercase',
      color: 'var(--g2o-pink)'
    }
  }, tag), React.createElement('h3', {
    style: {
      margin: 0,
      fontSize: 20,
      color: 'var(--color-text-strong)',
      lineHeight: 1.25
    }
  }, title), excerpt && React.createElement('p', {
    style: {
      margin: 0,
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--color-text-secondary)'
    }
  }, excerpt), date && React.createElement('span', {
    style: {
      fontSize: 'var(--text-caption)',
      color: 'var(--color-text-muted)'
    }
  }, date));
}
Object.assign(__ds_scope, { BlogCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/BlogCard.jsx", error: String((e && e.message) || e) }); }

// components/content/HoverCard.jsx
try { (() => {
function HoverCard({
  front,
  back,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('div', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      background: 'var(--color-surface-card)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-sm)',
      padding: '28px 24px',
      minHeight: 180,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      overflow: 'hidden',
      ...style
    }
  }, React.createElement('div', {
    style: {
      opacity: hover ? 0 : 1,
      transition: 'opacity .2s ease'
    }
  }, front), React.createElement('div', {
    style: {
      position: 'absolute',
      inset: 0,
      margin: 0,
      padding: '28px 22px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--color-text-secondary)',
      background: 'var(--color-surface-card)',
      opacity: hover ? 1 : 0,
      transition: 'opacity .2s ease',
      pointerEvents: 'none'
    }
  }, back));
}
Object.assign(__ds_scope, { HoverCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/HoverCard.jsx", error: String((e && e.message) || e) }); }

// components/content/IntegrationTile.jsx
try { (() => {
function IntegrationTile({
  src,
  alt,
  href,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement(href ? 'a' : 'div', {
    href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      background: 'var(--color-surface-card)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: '1/1',
      boxShadow: hover ? 'var(--shadow-card-hover)' : 'var(--shadow-card-soft)',
      transform: hover ? 'translateY(-3px)' : 'none',
      transition: 'box-shadow .35s ease,transform .25s ease',
      overflow: 'hidden',
      ...style
    },
    ...rest
  }, React.createElement('img', {
    src,
    alt: alt || '',
    style: {
      maxWidth: '80%',
      maxHeight: 60,
      objectFit: 'contain'
    }
  }));
}
function IntegrationPill({
  src,
  alt,
  label,
  href,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement(href ? 'a' : 'div', {
    href,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: 44,
      padding: '8px 12px',
      background: 'var(--color-surface-card)',
      border: '1px solid ' + (hover ? 'var(--g2o-pink)' : 'var(--color-border-default)'),
      borderRadius: 20,
      transition: 'border-color .2s ease',
      ...style
    },
    ...rest
  }, React.createElement('img', {
    src,
    alt: alt || '',
    style: {
      maxWidth: label ? '38%' : '100%',
      maxHeight: '100%',
      objectFit: 'contain'
    }
  }), label && React.createElement('span', {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--color-text-primary)'
    }
  }, label));
}
Object.assign(__ds_scope, { IntegrationTile, IntegrationPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/IntegrationTile.jsx", error: String((e && e.message) || e) }); }

// components/content/Marquee.jsx
try { (() => {
function Marquee({
  logos = [],
  speed = '26s',
  grayscale = true,
  height = 36,
  gap = 56,
  style
}) {
  const loop = [...logos, ...logos];
  return React.createElement('div', {
    style: {
      width: '100%',
      minWidth: 0,
      overflow: 'hidden',
      WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',
      maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)',
      ...style
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap,
      width: 'max-content',
      animation: `g2o-marquee ${speed} linear infinite`
    }
  }, loop.map((l, i) => React.createElement('img', {
    key: i,
    src: l.src || l,
    alt: l.alt || '',
    style: {
      height,
      width: 'auto',
      maxWidth: 170,
      objectFit: 'contain',
      filter: grayscale ? 'grayscale(1)' : 'none',
      opacity: grayscale ? .6 : 1,
      flexShrink: 0
    }
  }))));
}
Object.assign(__ds_scope, { Marquee });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Marquee.jsx", error: String((e && e.message) || e) }); }

// components/content/StepItem.jsx
try { (() => {
function StepItem({
  number,
  title,
  body,
  arrow = 'assets/brand/flecha-pasos.png',
  showArrow = true,
  style
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, React.createElement('div', {
    style: {
      fontSize: 'var(--text-stat)',
      fontWeight: 700,
      lineHeight: 1,
      color: 'var(--g2o-pink)'
    }
  }, number), showArrow && React.createElement('img', {
    src: arrow,
    alt: '',
    style: {
      width: 72,
      height: 72,
      objectFit: 'contain',
      margin: '0 0 8px -8px',
      display: 'block',
      position: 'relative',
      zIndex: 1
    }
  }), React.createElement('h3', {
    style: {
      margin: 0,
      fontSize: 'var(--text-h3)',
      color: 'var(--color-text-strong)'
    }
  }, title), React.createElement('p', {
    style: {
      margin: 0,
      fontSize: 'var(--text-body-sm)',
      lineHeight: 'var(--leading-body)',
      color: 'var(--color-text-secondary)'
    }
  }, body));
}
Object.assign(__ds_scope, { StepItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StepItem.jsx", error: String((e && e.message) || e) }); }

// components/content/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  sub,
  children,
  style
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('span', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      display: 'inline-flex',
      ...style
    }
  }, children, React.createElement('span', {
    style: {
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translate(-50%,-8px)',
      background: '#141826eb',
      color: '#fff',
      borderRadius: 'var(--radius-md)',
      padding: '6px 12px',
      marginBottom: 6,
      fontSize: 12,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      boxShadow: 'var(--shadow-tooltip)',
      zIndex: 5,
      pointerEvents: 'none',
      opacity: hover ? 1 : 0,
      visibility: hover ? 'visible' : 'hidden',
      transition: 'opacity .2s ease',
      display: 'block'
    }
  }, label, sub && React.createElement('span', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      fontSize: 10.5,
      fontWeight: 400,
      color: '#ffffffbf',
      marginTop: 2
    }
  }, React.createElement('i', {
    style: {
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: 'var(--gradient-brand)',
      display: 'inline-block',
      animation: 'chip-pulse 1.2s ease-in-out infinite',
      fontStyle: 'normal'
    }
  }), sub)));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function Badge({
  tone = 'neutral',
  style,
  children,
  ...rest
}) {
  const tones = {
    neutral: {
      background: 'var(--color-border-default)',
      color: 'var(--color-text-secondary)'
    },
    pink: {
      background: 'var(--g2o-pink)',
      color: '#fff'
    },
    success: {
      background: 'var(--g2o-success)',
      color: '#fff'
    },
    warning: {
      background: 'var(--g2o-warning)',
      color: 'var(--g2o-black)'
    },
    error: {
      background: 'var(--g2o-error)',
      color: '#fff'
    }
  };
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 20,
      height: 20,
      padding: '0 6px',
      borderRadius: 999,
      fontSize: 11,
      fontWeight: 700,
      lineHeight: 1,
      ...tones[tone],
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const BASE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  height: 52,
  padding: '0 28px',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-family-base)',
  fontSize: 'var(--text-body)',
  fontWeight: 'var(--font-weight-semibold)',
  cursor: 'pointer',
  border: 'none',
  transition: 'transform .15s ease,box-shadow .15s ease,background .15s ease,color .15s ease',
  whiteSpace: 'nowrap',
  textDecoration: 'none'
};
const SM = {
  height: 44,
  padding: '0 22px',
  fontSize: 'var(--text-body-sm)'
};
function Button({
  variant = 'primary',
  size = 'md',
  as,
  href,
  icon,
  iconRight,
  disabled,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const v = {
    primary: {
      background: 'var(--g2o-pink)',
      color: '#fff',
      boxShadow: 'var(--shadow-md)',
      transform: hover ? 'translateY(-1px)' : 'none'
    },
    pink: {
      background: 'var(--g2o-pink)',
      color: '#fff',
      boxShadow: 'var(--shadow-md)',
      transform: hover ? 'translateY(-1px)' : 'none'
    },
    outline: {
      background: hover ? 'var(--g2o-pink)' : 'transparent',
      color: hover ? '#fff' : 'var(--g2o-pink)',
      border: '1.5px solid var(--g2o-pink)'
    },
    ghost: {
      background: 'transparent',
      color: hover ? 'var(--g2o-pink)' : 'var(--color-text-primary)'
    }
  }[variant] || {};
  const Tag = as || (href ? 'a' : 'button');
  return React.createElement(Tag, {
    href,
    disabled,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...BASE,
      ...(size === 'sm' ? SM : null),
      ...v,
      ...(disabled ? {
        opacity: .45,
        pointerEvents: 'none',
        boxShadow: 'none'
      } : null),
      ...style
    },
    ...rest
  }, icon, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function Card({
  variant = 'base',
  padding,
  hoverLift = false,
  style,
  children,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const variants = {
    base: {
      padding: '28px 24px',
      boxShadow: 'var(--shadow-sm)'
    },
    simple: {
      padding: '28px 24px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      textAlign: 'center',
      minHeight: 130,
      fontSize: 18,
      fontWeight: 'var(--font-weight-semibold)',
      color: 'var(--color-text-primary)'
    },
    visual: {
      padding: 24,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    fx: {
      padding: 24,
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column'
    },
    tile: {
      padding: 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      aspectRatio: '1/1',
      boxShadow: 'var(--shadow-card-soft)',
      overflow: 'hidden'
    }
  };
  return React.createElement('div', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      background: 'var(--color-surface-card)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-lg)',
      position: 'relative',
      transition: 'box-shadow .35s ease,transform .25s ease',
      ...variants[variant],
      ...(padding !== undefined ? {
        padding
      } : null),
      ...(hoverLift && hover ? {
        transform: 'translateY(-3px)',
        boxShadow: 'var(--shadow-card-hover)'
      } : null),
      ...style
    },
    ...rest
  }, children);
}

/** Full-bleed gradient-aurora footer for a "visual" Card — holds a product screenshot. */
function CardVisual({
  src,
  alt = '',
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return React.createElement('div', {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      position: 'relative',
      margin: '16px -24px -24px',
      borderRadius: '0 0 var(--radius-lg) var(--radius-lg)',
      overflow: 'hidden',
      padding: 22,
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      ...style
    },
    ...rest
  }, React.createElement('div', {
    style: {
      content: '""',
      position: 'absolute',
      left: '-20%',
      right: '-20%',
      bottom: -40,
      top: '40%',
      zIndex: 0,
      filter: 'var(--blur-aurora)',
      opacity: .46,
      pointerEvents: 'none',
      background: 'var(--gradient-aurora)'
    }
  }), React.createElement('img', {
    src,
    alt,
    style: {
      position: 'relative',
      zIndex: 1,
      width: '100%',
      height: 'auto',
      filter: 'drop-shadow(0 8px 20px rgba(20,20,40,.18))',
      transition: 'transform .35s ease',
      transform: hover ? 'scale(1.04)' : 'none'
    }
  }));
}
Object.assign(__ds_scope, { Card, CardVisual });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/CloudBackground.jsx
try { (() => {
const DEFAULT = [{
  color: 'var(--g2o-pink)',
  size: '46%',
  left: '6%',
  top: '8%',
  anim: 'g2o-cloud-a 18s ease-in-out infinite'
}, {
  color: 'var(--g2o-orange)',
  size: '38%',
  right: '10%',
  top: '22%',
  anim: 'g2o-cloud-b 22s ease-in-out infinite'
}, {
  color: 'var(--g2o-purple)',
  size: '34%',
  left: '42%',
  bottom: '0%',
  anim: 'g2o-cloud-a 26s ease-in-out infinite'
}];
function CloudBackground({
  blobs = DEFAULT,
  opacity = .5,
  style,
  ...rest
}) {
  return React.createElement('div', {
    style: {
      position: 'absolute',
      inset: '-10%',
      pointerEvents: 'none',
      filter: 'var(--blur-cloud)',
      opacity,
      zIndex: 0,
      ...style
    },
    ...rest
  }, blobs.map((b, i) => React.createElement('span', {
    key: i,
    style: {
      position: 'absolute',
      borderRadius: '50%',
      background: b.color,
      width: b.size,
      height: b.size,
      left: b.left,
      right: b.right,
      top: b.top,
      bottom: b.bottom,
      animation: b.anim
    }
  })));
}
Object.assign(__ds_scope, { CloudBackground });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/CloudBackground.jsx", error: String((e && e.message) || e) }); }

// components/content/CtaBanner.jsx
try { (() => {
function CtaBanner({
  title,
  body,
  ctaLabel,
  ctaHref,
  clouds = true,
  style
}) {
  return React.createElement('div', {
    style: {
      position: 'relative',
      padding: '64px 40px',
      textAlign: 'center',
      background: 'var(--color-surface-card)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      ...style
    }
  }, clouds && React.createElement(__ds_scope.CloudBackground, {
    opacity: .35
  }), React.createElement('h2', {
    style: {
      position: 'relative',
      zIndex: 1,
      margin: '0 0 12px',
      fontSize: 'var(--text-h2)',
      color: 'var(--color-text-strong)'
    }
  }, title), body && React.createElement('p', {
    style: {
      position: 'relative',
      zIndex: 1,
      color: 'var(--color-text-secondary)',
      maxWidth: 520,
      margin: '0 auto 28px'
    }
  }, body), ctaLabel && React.createElement(__ds_scope.Button, {
    variant: 'pink',
    href: ctaHref,
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, ctaLabel));
}
Object.assign(__ds_scope, { CtaBanner });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/CtaBanner.jsx", error: String((e && e.message) || e) }); }

// components/core/Container.jsx
try { (() => {
function Container({
  style,
  children,
  ...rest
}) {
  return React.createElement('div', {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--section-pad-x)',
      ...style
    },
    ...rest
  }, children);
}
function Section({
  tight = false,
  background,
  style,
  children,
  ...rest
}) {
  return React.createElement('section', {
    style: {
      padding: tight ? '32px 0 0' : '64px 0',
      background,
      position: 'relative',
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { Container, Section });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Container.jsx", error: String((e && e.message) || e) }); }

// components/core/GradientText.jsx
try { (() => {
function GradientText({
  as = 'span',
  speed = '3.5s',
  style,
  children,
  ...rest
}) {
  return React.createElement(as, {
    style: {
      background: 'var(--gradient-brand)',
      backgroundSize: '300% auto',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent',
      WebkitTextFillColor: 'transparent',
      animation: `g2o-gradient-shift ${speed} ease-in-out infinite`,
      ...style
    },
    ...rest
  }, children);
}
Object.assign(__ds_scope, { GradientText });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/GradientText.jsx", error: String((e && e.message) || e) }); }

// components/content/StatCard.jsx
try { (() => {
function StatCard({
  value,
  label,
  children,
  minHeight = 198,
  style
}) {
  return React.createElement('div', {
    style: {
      background: 'var(--color-surface-card)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: '24px 24px 0',
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative',
      minHeight,
      ...style
    }
  }, React.createElement(__ds_scope.GradientText, {
    as: 'div',
    style: {
      fontSize: 'var(--text-stat)',
      fontWeight: 700,
      lineHeight: 1,
      position: 'relative',
      zIndex: 2
    }
  }, value), React.createElement('div', {
    style: {
      fontSize: 20,
      fontWeight: 600,
      lineHeight: 1.3,
      color: 'var(--color-text-secondary)',
      marginTop: 6,
      position: 'relative',
      zIndex: 2
    }
  }, label), children && React.createElement('div', {
    style: {
      flex: 1,
      minHeight: 110,
      marginTop: 12,
      position: 'relative'
    }
  }, children));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/data/BarChart.jsx
try { (() => {
function BarChart({
  values = [],
  height = 110,
  gap = 4,
  radius = 3,
  animate = true,
  style,
  ...rest
}) {
  const max = Math.max(...values, 1);
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
      gap,
      height,
      width: '100%',
      ...style
    },
    ...rest
  }, values.map((v, i) => React.createElement('span', {
    key: i,
    style: {
      flex: 1,
      minWidth: 2,
      height: Math.max(6, v / max * height),
      background: 'linear-gradient(180deg,var(--g2o-purple) 0%,#9a45f2 100%)',
      borderRadius: `${radius}px ${radius}px 0 0`,
      transformOrigin: 'bottom',
      animation: animate ? `g2o-bar-grow ${2.4 + i % 5 * .25}s ease-in-out infinite` : 'none',
      animationDelay: animate ? `${i % 7 * .12}s` : undefined
    }
  })));
}
Object.assign(__ds_scope, { BarChart });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/BarChart.jsx", error: String((e && e.message) || e) }); }

// components/data/Gauge.jsx
try { (() => {
function Gauge({
  value = 99.9,
  max = 100,
  size = 200,
  thickness = 22,
  animate = true,
  style,
  ...rest
}) {
  const id = React.useId ? React.useId().replace(/:/g, '') : 'g2ogauge';
  const r = (size - thickness) / 2,
    c = Math.PI * r,
    pct = Math.min(value / max, 1);
  return React.createElement('svg', {
    width: size,
    height: size / 2 + thickness / 2,
    viewBox: `0 0 ${size} ${size / 2 + thickness / 2}`,
    style: {
      display: 'block',
      overflow: 'visible',
      ...style
    },
    ...rest
  }, React.createElement('defs', null, React.createElement('linearGradient', {
    id: 'gr' + id,
    x1: '0',
    y1: '0',
    x2: '1',
    y2: '0'
  }, React.createElement('stop', {
    offset: '0%',
    stopColor: 'var(--g2o-pink)'
  }), React.createElement('stop', {
    offset: '100%',
    stopColor: 'var(--g2o-purple)'
  }))), React.createElement('path', {
    d: `M ${thickness / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - thickness / 2} ${size / 2}`,
    fill: 'none',
    stroke: 'var(--g2o-gray-100)',
    strokeWidth: thickness,
    strokeLinecap: 'round'
  }), React.createElement('path', {
    d: `M ${thickness / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - thickness / 2} ${size / 2}`,
    fill: 'none',
    stroke: `url(#gr${id})`,
    strokeWidth: thickness,
    strokeLinecap: 'round',
    strokeDasharray: c,
    strokeDashoffset: c * (1 - pct),
    style: animate ? {
      transition: 'stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1)'
    } : undefined
  }));
}
Object.assign(__ds_scope, { Gauge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/Gauge.jsx", error: String((e && e.message) || e) }); }

// components/data/ParticleField.jsx
try { (() => {
const COLORS = ['var(--g2o-pink)', 'var(--g2o-orange)', 'var(--g2o-purple)'];
function ParticleField({
  count = 90,
  seed = 7,
  style,
  ...rest
}) {
  const dots = React.useMemo(() => {
    let s = seed;
    const rnd = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    return Array.from({
      length: count
    }, (_, i) => ({
      left: rnd() * 100,
      top: rnd() * 100,
      size: 1.5 + rnd() * 2.5,
      color: COLORS[Math.floor(rnd() * 3)],
      op: .25 + rnd() * .6,
      dur: (2 + rnd() * 3).toFixed(2),
      delay: (rnd() * 3).toFixed(2)
    }));
  }, [count, seed]);
  return React.createElement('div', {
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      ...style
    },
    ...rest
  }, dots.map((d, i) => React.createElement('span', {
    key: i,
    style: {
      position: 'absolute',
      left: d.left + '%',
      top: d.top + '%',
      width: d.size,
      height: d.size,
      borderRadius: '50%',
      background: d.color,
      opacity: d.op,
      animation: `g2o-dot-pulse ${d.dur}s ease-in-out ${d.delay}s infinite`
    }
  })));
}
Object.assign(__ds_scope, { ParticleField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ParticleField.jsx", error: String((e && e.message) || e) }); }

// components/data/ValueChip.jsx
try { (() => {
function ValueChip({
  icon,
  children,
  style,
  ...rest
}) {
  return React.createElement('span', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 9px',
      background: '#fff',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-md)',
      fontSize: 11,
      fontWeight: 600,
      color: 'var(--g2o-black)',
      whiteSpace: 'nowrap',
      ...style
    },
    ...rest
  }, icon, children);
}
Object.assign(__ds_scope, { ValueChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/ValueChip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
const INPUT = {
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  fontSize: 'var(--text-body)',
  padding: '12px 14px',
  borderRadius: 'var(--radius-sm)',
  border: '1.5px solid var(--color-border-default)',
  outline: 'none',
  background: 'var(--color-surface-card)',
  color: 'var(--color-text-primary)'
};
function Field({
  label,
  required,
  as = 'input',
  hint,
  error,
  style,
  inputStyle,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const border = error ? 'var(--g2o-error)' : focus ? 'var(--g2o-pink)' : 'var(--color-border-default)';
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && React.createElement('label', {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-primary)'
    }
  }, label, required && React.createElement('span', {
    style: {
      color: 'var(--g2o-pink)'
    }
  }, ' *')), React.createElement(as, {
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      ...INPUT,
      borderColor: border,
      ...(as === 'textarea' ? {
        minHeight: 120,
        resize: 'vertical'
      } : null),
      ...inputStyle
    },
    ...rest
  }), (hint || error) && React.createElement('span', {
    style: {
      fontSize: 'var(--text-caption)',
      color: error ? 'var(--g2o-error)' : 'var(--color-text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/Pill.jsx
try { (() => {
function Pill({
  active = false,
  icon,
  onClick,
  style,
  children,
  ...rest
}) {
  return React.createElement('button', {
    type: 'button',
    onClick,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: 44,
      padding: '8px 16px',
      background: active ? 'var(--tint-pink-8)' : 'var(--color-surface-card)',
      border: '1px solid ' + (active ? 'var(--g2o-pink)' : 'var(--color-border-default)'),
      borderRadius: 20,
      fontFamily: 'inherit',
      fontSize: 'var(--text-body-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-primary)',
      cursor: 'pointer',
      transition: 'border-color .2s ease,background .2s ease',
      ...style
    },
    ...rest
  }, icon, children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Pill.jsx", error: String((e && e.message) || e) }); }

// components/forms/ProgressSteps.jsx
try { (() => {
function ProgressSteps({
  steps = [],
  current = 0,
  style
}) {
  return React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      ...style
    }
  }, steps.map((s, i) => {
    const done = i < current,
      active = i === current;
    return React.createElement(React.Fragment, {
      key: s
    }, React.createElement('div', {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, React.createElement('span', {
      style: {
        width: 28,
        height: 28,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 600,
        border: '1.5px solid ' + (done || active ? 'var(--g2o-pink)' : 'var(--color-border-default)'),
        background: done ? 'var(--g2o-pink)' : 'transparent',
        color: done ? '#fff' : active ? 'var(--g2o-pink)' : 'var(--color-text-muted)'
      }
    }, done ? '✓' : i + 1), React.createElement('span', {
      style: {
        fontSize: 'var(--text-body-sm)',
        fontWeight: active ? 600 : 400,
        color: active ? 'var(--g2o-pink)' : 'var(--color-text-secondary)'
      }
    }, s)), i < steps.length - 1 && React.createElement('span', {
      style: {
        flex: 1,
        height: 1,
        background: 'var(--color-border-default)',
        minWidth: 24
      }
    }));
  }));
}
Object.assign(__ds_scope, { ProgressSteps });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/ProgressSteps.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
const Chevron = ({
  open
}) => React.createElement('svg', {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  style: {
    flexShrink: 0,
    color: 'var(--g2o-pink)',
    transition: 'transform .15s ease',
    transform: open ? 'rotate(180deg)' : 'none'
  }
}, React.createElement('path', {
  d: 'M6 9l6 6 6-6'
}));
function Select({
  label,
  required,
  options = [],
  value,
  placeholder = 'Seleccioná una opción',
  onChange,
  style
}) {
  const [open, setOpen] = React.useState(false);
  const [internal, setInternal] = React.useState(value);
  const current = value !== undefined ? value : internal;
  const pick = v => {
    setInternal(v);
    setOpen(false);
    onChange && onChange(v);
  };
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && React.createElement('label', {
    style: {
      fontSize: 'var(--text-body-sm)',
      fontWeight: 'var(--font-weight-medium)',
      color: 'var(--color-text-primary)'
    }
  }, label, required && React.createElement('span', {
    style: {
      color: 'var(--g2o-pink)'
    }
  }, ' *')), React.createElement('div', {
    style: {
      position: 'relative'
    }
  }, React.createElement('button', {
    type: 'button',
    onClick: () => setOpen(!open),
    style: {
      width: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      fontFamily: 'inherit',
      fontSize: 'var(--text-body)',
      padding: '12px 14px',
      borderRadius: 'var(--radius-sm)',
      border: '1.5px solid ' + (open ? 'var(--g2o-pink)' : 'var(--color-border-default)'),
      outline: 'none',
      background: 'var(--color-surface-card)',
      color: current ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, React.createElement('span', null, current || placeholder), React.createElement(Chevron, {
    open
  })), open && React.createElement('div', {
    style: {
      position: 'absolute',
      top: 'calc(100% + 6px)',
      left: 0,
      right: 0,
      maxHeight: 240,
      overflowY: 'auto',
      background: 'var(--color-surface-card)',
      border: '1.5px solid var(--color-border-default)',
      borderRadius: 'var(--radius-sm)',
      boxShadow: 'var(--shadow-lg)',
      zIndex: 20
    }
  }, options.map(o => React.createElement('button', {
    key: o,
    type: 'button',
    onClick: () => pick(o),
    style: {
      display: 'block',
      width: '100%',
      textAlign: 'left',
      padding: '10px 14px',
      fontFamily: 'inherit',
      fontSize: 'var(--text-body-sm)',
      background: o === current ? 'var(--color-surface-subtle)' : 'none',
      border: 'none',
      cursor: 'pointer',
      color: o === current ? 'var(--g2o-pink)' : 'var(--color-text-primary)'
    }
  }, o)))));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/navigation/FilterBar.jsx
try { (() => {
function FilterBar({
  options = [],
  value,
  onChange,
  style
}) {
  const [internal, setInternal] = React.useState(value || options[0] && options[0].label);
  const current = value !== undefined ? value : internal;
  const pick = v => {
    setInternal(v);
    onChange && onChange(v);
  };
  return React.createElement('div', {
    style: {
      textAlign: 'center',
      ...style
    }
  }, React.createElement('div', {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: 'var(--color-surface-subtle)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 999,
      padding: 6,
      flexWrap: 'wrap',
      justifyContent: 'center',
      maxWidth: '100%'
    }
  }, options.map(o => {
    const on = o.label === current;
    return React.createElement('button', {
      key: o.label,
      type: 'button',
      onClick: () => pick(o.label),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 38,
        padding: '0 16px',
        borderRadius: 999,
        border: 'none',
        background: on ? '#fff' : 'transparent',
        color: on ? 'var(--g2o-black)' : 'var(--color-text-secondary)',
        boxShadow: on ? 'var(--shadow-sm)' : 'none',
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        transition: 'background .15s ease,color .15s ease'
      }
    }, o.label, o.count !== undefined && React.createElement(__ds_scope.Badge, {
      tone: on ? 'pink' : 'neutral'
    }, o.count));
  })));
}
Object.assign(__ds_scope, { FilterBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/FilterBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Footer.jsx
try { (() => {
function Footer({
  logo = 'assets/brand/logo-grow2on.png',
  blurb,
  columns = [],
  offices = [],
  bottom,
  style
}) {
  return React.createElement('footer', {
    style: {
      background: 'var(--color-surface-subtle)',
      borderTop: '1px solid var(--color-border-default)',
      ...style
    }
  }, React.createElement('div', {
    style: {
      padding: '48px 0 24px'
    }
  }, React.createElement('div', {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0 var(--section-pad-x)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))',
      gap: 32
    }
  }, React.createElement('div', null, React.createElement('img', {
    src: logo,
    alt: 'Grow2on',
    style: {
      height: 34,
      width: 'auto',
      marginBottom: 12
    }
  }), blurb && React.createElement('p', {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--color-text-secondary)',
      margin: 0,
      maxWidth: 260
    }
  }, blurb)), columns.map(c => React.createElement('div', {
    key: c.title
  }, React.createElement('div', {
    style: {
      fontFamily: 'var(--font-family-mono)',
      fontSize: 11,
      color: 'var(--g2o-gray-300)',
      marginBottom: 12,
      letterSpacing: 'var(--tracking-footer-label)'
    }
  }, c.title), c.links.map(l => React.createElement('a', {
    key: l.label,
    href: l.href || '#',
    style: {
      display: 'block',
      color: 'var(--color-text-primary)',
      fontSize: 'var(--text-body-sm)',
      padding: '4px 0'
    }
  }, l.label)))), offices.map(o => React.createElement('div', {
    key: o.country
  }, React.createElement('img', {
    src: o.flag,
    alt: o.country,
    style: {
      height: 16,
      width: 'auto',
      marginBottom: 8
    }
  }), React.createElement('div', {
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--color-text-secondary)',
      lineHeight: 'var(--leading-body)',
      whiteSpace: 'pre-line'
    }
  }, o.address))))), React.createElement('div', {
    style: {
      background: 'var(--g2o-footer-bar)',
      padding: '16px var(--section-pad-x)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      textAlign: 'center',
      fontSize: 'var(--text-caption)',
      color: '#fff'
    }
  }, bottom));
}
Object.assign(__ds_scope, { Footer });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Footer.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Header.jsx
try { (() => {
const Caret = () => React.createElement('svg', {
  width: 10,
  height: 10,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 3,
  style: {
    flexShrink: 0
  }
}, React.createElement('path', {
  d: 'M6 9l6 6 6-6'
}));
function Header({
  logo = 'assets/brand/logo-grow2on.png',
  logoHref = '/',
  links = [],
  loginLabel = 'Log in',
  ctaLabel = 'Hablemos',
  onCta,
  sticky = true,
  style
}) {
  const [open, setOpen] = React.useState(null);
  return React.createElement('header', {
    style: {
      position: sticky ? 'sticky' : 'relative',
      top: 0,
      zIndex: 50,
      background: 'var(--color-surface-page)',
      borderBottom: '1px solid var(--color-border-default)',
      ...style
    }
  }, React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: '14px var(--section-pad-x)',
      maxWidth: 'var(--container-max)',
      margin: '0 auto'
    }
  }, React.createElement('a', {
    href: logoHref
  }, React.createElement('img', {
    src: logo,
    alt: 'Grow2on',
    style: {
      height: 38,
      width: 'auto'
    }
  })), React.createElement('nav', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 28
    }
  }, links.map(l => React.createElement('div', {
    key: l.label,
    style: {
      position: 'relative'
    },
    onMouseEnter: () => setOpen(l.items ? l.label : null),
    onMouseLeave: () => setOpen(null)
  }, React.createElement('a', {
    href: l.href || '#',
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      color: open === l.label ? 'var(--g2o-pink)' : 'var(--color-text-primary)',
      fontSize: 'var(--text-body-sm)'
    }
  }, l.label, l.items && React.createElement(Caret)), l.items && open === l.label && React.createElement('div', {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      marginTop: 8,
      minWidth: 220,
      background: 'var(--color-surface-page)',
      border: '1px solid var(--color-border-default)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      padding: 12,
      zIndex: 30
    }
  }, l.items.map(it => React.createElement('a', {
    key: it.label,
    href: it.href || '#',
    style: {
      display: 'block',
      padding: '8px 10px',
      borderRadius: 'var(--radius-sm)',
      color: 'var(--color-text-primary)',
      fontSize: 'var(--text-body-sm)'
    }
  }, it.label)))))), React.createElement('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, React.createElement('a', {
    href: '#',
    style: {
      fontSize: 'var(--text-body-sm)',
      color: 'var(--color-text-primary)'
    }
  }, loginLabel), React.createElement(__ds_scope.Button, {
    size: 'sm',
    variant: 'primary',
    onClick: onCta
  }, ctaLabel))));
}
Object.assign(__ds_scope, { Header });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Header.jsx", error: String((e && e.message) || e) }); }

// components/navigation/MobileAccordion.jsx
try { (() => {
function MobileAccordion({
  label,
  children,
  defaultOpen = false,
  style
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return React.createElement('div', {
    style: {
      borderBottom: '1px solid var(--color-border-default)',
      ...style
    }
  }, React.createElement('button', {
    type: 'button',
    onClick: () => setOpen(!open),
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
      background: 'none',
      border: 'none',
      padding: '12px 0',
      minHeight: 44,
      fontFamily: 'inherit',
      fontSize: 15,
      color: 'var(--color-text-primary)',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, label, React.createElement('span', {
    style: {
      fontSize: 12,
      color: 'var(--g2o-pink)',
      transition: 'transform .2s ease',
      transform: open ? 'rotate(180deg)' : 'none'
    }
  }, '▾')), open && React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      padding: '0 0 12px 16px',
      maxHeight: '60vh',
      overflowY: 'auto'
    }
  }, children));
}
Object.assign(__ds_scope, { MobileAccordion });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/MobileAccordion.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Home.jsx
try { (() => {
const {
  Button,
  Card,
  CardVisual,
  GradientText,
  Container,
  Section,
  CloudBackground,
  StatCard,
  StepItem,
  IntegrationTile,
  Marquee,
  CtaBanner,
  Tooltip,
  BarChart,
  Gauge,
  ParticleField,
  ValueChip,
  PlatformHub
} = window.Grow2onDesignSystem_f54f37;
function Hero({
  go
}) {
  return /*#__PURE__*/React.createElement(Section, {
    style: {
      overflow: 'hidden',
      paddingTop: 48
    }
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'grid',
      gridTemplateColumns: '1.05fr .95fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      height: 32,
      padding: '0 16px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--g2o-pink)',
      color: '#fff',
      fontSize: 13,
      fontWeight: 600,
      whiteSpace: 'nowrap',
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "15",
    height: "15",
    viewBox: "0 0 24 24",
    fill: "none",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "11",
    fill: "#fff"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M7.5 12.4l3 3 6-6.4",
    stroke: "var(--g2o-pink)",
    strokeWidth: "2.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), "+400 empresas ya centralizaron su cat\xE1logo"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 16px',
      fontSize: 44,
      lineHeight: 1.15,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "Centraliz\xE1 tu cat\xE1logo.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement(GradientText, null, "Vend\xE9 en todos tus canales."), /*#__PURE__*/React.createElement("br", null), "Sin errores."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 28px',
      fontSize: 18,
      lineHeight: 1.5,
      maxWidth: 520
    }
  }, "Grow2on conecta tu ERP, tus dep\xF3sitos y tus canales de venta en un solo lugar. Sincroniz\xE1 stock, precios y pedidos autom\xE1ticamente y ahorr\xE1 hasta 80% del tiempo que hoy perd\xE9s en gesti\xF3n manual."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: () => go('hablemos')
  }, "Ped\xED tu demo gratis"), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    iconRight: "\u2193",
    onClick: () => go('funcionalidades')
  }, "Ver c\xF3mo funciona"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/somos-partner-badge.png',
    alt: "Somos Partner \u2014 Tiendanube Evoluci\xF3n \u2014 App Certified Silver",
    style: {
      position: 'relative',
      zIndex: 2,
      display: 'block',
      width: '100%',
      maxWidth: 500,
      height: 'auto',
      margin: '-85px 0 20px auto'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/hero-graphic.png',
    alt: "",
    style: {
      position: 'absolute',
      inset: '-18% -12%',
      width: '124%',
      maxWidth: 'none',
      opacity: .85,
      animation: 'g2o-spin 46s linear infinite'
    }
  }), /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/laptop-home-g2o.png',
    alt: "Plataforma Grow2on",
    style: {
      position: 'relative',
      width: '100%',
      animation: 'g2o-hero-float-y 7s ease-in-out infinite',
      filter: 'drop-shadow(0 18px 40px rgba(20,20,40,.18))'
    }
  }))), /*#__PURE__*/React.createElement(Container, {
    style: {
      marginTop: 64,
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(Marquee, {
    logos: CUSTOMERS
  })));
}
function Problem() {
  const items = [{
    img: A + 'illustrations/icon-problema-1.png',
    t: 'Carga manual que no escala',
    d: 'Cada nuevo canal significa más horas de trabajo repetido para tu equipo.'
  }, {
    img: A + 'illustrations/icon-problema-2.png',
    t: 'Stock que nunca coincide',
    d: 'Vendés de más en un canal y te quedás sin stock en otro. O peor: al revés.'
  }, {
    img: A + 'illustrations/icon-problema-3.png',
    t: 'Datos dispersos entre sistemas',
    d: 'ERP, depósitos, proveedores y canales de venta que no se hablan entre sí.'
  }];
  return /*#__PURE__*/React.createElement(Section, {
    background: "var(--color-surface-subtle)"
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 40px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)',
      maxWidth: 620
    }
  }, "\xBFTu equipo pierde horas cargando lo mismo en cada canal?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, items.map(i => /*#__PURE__*/React.createElement(Card, {
    key: i.t,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: i.img,
    alt: "",
    style: {
      width: '100%',
      maxWidth: 200,
      height: 'auto',
      objectFit: 'contain',
      flexShrink: 0,
      alignSelf: 'flex-start'
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 20,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, i.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: 'var(--color-text-secondary)'
    }
  }, i.d))))));
}
function Steps() {
  const steps = [['1', 'Conectá', 'Vinculamos tu ERP, tus depósitos y tus canales de venta.'], ['2', 'Centralizá', 'Toda tu información de producto en un solo lugar.'], ['3', 'Sincronizá', 'Stock, precios y pedidos se actualizan solos, en tiempo real.'], ['4', 'Vendé más', 'Tu equipo se enfoca en vender, no en cargar datos.']];
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 40px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)',
      maxWidth: 680
    }
  }, "Con Grow2on, carg\xE1 una sola vez y se replica autom\xE1ticamente."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 24
    }
  }, steps.map(([n, t, d], i) => /*#__PURE__*/React.createElement(StepItem, {
    key: n,
    number: n,
    title: t,
    body: d,
    arrow: A + 'brand/flecha-pasos.png',
    showArrow: i < 3
  })))));
}
function Features({
  go
}) {
  return /*#__PURE__*/React.createElement(Section, {
    background: "var(--color-surface-subtle)"
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 40px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "Todo lo que Grow2on hace por tu negocio"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, FEATURES.map(ft => /*#__PURE__*/React.createElement(Card, {
    key: ft.t,
    variant: "visual"
  }, /*#__PURE__*/React.createElement(GradientText, {
    as: "h3",
    style: {
      fontSize: 22,
      fontWeight: 600,
      margin: '0 0 6px'
    }
  }, ft.t), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--color-text-secondary)',
      margin: 0
    }
  }, ft.d), /*#__PURE__*/React.createElement(CardVisual, {
    src: ft.img
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => go('funcionalidades')
  }, "Ver todas las funcionalidades \u2192"))));
}
function Stats() {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    value: "400+",
    label: "empresas sincronizando",
    minHeight: 420,
    style: {
      gridRow: '1/3'
    }
  }, /*#__PURE__*/React.createElement(ParticleField, {
    count: 260
  }), /*#__PURE__*/React.createElement(ValueChip, {
    icon: /*#__PURE__*/React.createElement("img", {
      src: A + 'platforms/iso-mercadolibre.png',
      width: "12"
    }),
    style: {
      position: 'absolute',
      left: '54%',
      top: '60%'
    }
  }, "$8.250")), /*#__PURE__*/React.createElement(StatCard, {
    value: "4.2M",
    label: "de ventas promedio por mes",
    minHeight: 198
  }, /*#__PURE__*/React.createElement(ParticleField, {
    count: 60
  }), /*#__PURE__*/React.createElement(BarChart, {
    height: 96,
    values: [3, 5, 4, 7, 6, 9, 5, 8, 6, 10, 7, 9, 6, 11, 8, 10, 7, 12, 9, 11, 8, 13, 10, 12, 9, 14]
  })), /*#__PURE__*/React.createElement(StatCard, {
    value: "99.9%",
    label: "SLA",
    minHeight: 198
  }, /*#__PURE__*/React.createElement(ParticleField, {
    count: 60
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
      height: '100%'
    }
  }, /*#__PURE__*/React.createElement(Gauge, {
    value: 99.9,
    size: 200,
    thickness: 22
  })))));
}
function Hub({
  go
}) {
  return /*#__PURE__*/React.createElement(Section, {
    background: "var(--color-surface-subtle)"
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)',
      textAlign: 'center'
    }
  }, "Conect\xE1 con las plataformas que ya us\xE1s"), /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: 'center',
      margin: '0 0 36px'
    }
  }, "Mercado Libre, Tiendanube, Shopify y tu ERP, trabajando juntos sin que tengas que tocar una planilla."), /*#__PURE__*/React.createElement(PlatformHub, {
    center: A + 'brand/platform-hub-center.png',
    nodes: PLATFORMS.map(p => ({
      src: p.src,
      label: p.name,
      sub: 'Sincronización en tiempo real'
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => go('integraciones')
  }, "Ver todas las integraciones \u2192"))));
}
function Testimonial() {
  return /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, {
    style: {
      display: 'grid',
      gridTemplateColumns: '.8fr 1.2fr',
      gap: 32,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    value: "80%",
    label: "menos tiempo de gesti\xF3n",
    minHeight: 150
  }), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 32
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 20px',
      fontSize: 20,
      lineHeight: 1.45,
      color: 'var(--g2o-black)'
    }
  }, "\u201CGrow2on cambi\xF3 la din\xE1mica de nuestro equipo. Antes necesit\xE1bamos 3 personas para mantener el stock actualizado, hoy lo hace el sistema solo.\u201D"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/ana-martinez.png',
    alt: "",
    style: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      objectFit: 'cover'
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      color: 'var(--g2o-black)',
      fontSize: 14
    }
  }, "Ana Mart\xEDnez"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: 'var(--color-text-secondary)'
    }
  }, "Directora de Operaciones, RetailX"))))));
}
function Home({
  go
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Hero, {
    go: go
  }), /*#__PURE__*/React.createElement(Problem, null), /*#__PURE__*/React.createElement(Steps, null), /*#__PURE__*/React.createElement(Features, {
    go: go
  }), /*#__PURE__*/React.createElement(Stats, null), /*#__PURE__*/React.createElement(Hub, {
    go: go
  }), /*#__PURE__*/React.createElement(Testimonial, null), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(CtaBanner, {
    title: "Dej\xE1 de perder tiempo en gesti\xF3n manual.",
    body: "Empez\xE1 a centralizar tu cat\xE1logo y vender en todos tus canales, sin errores y sin planillas.",
    ctaLabel: "Ped\xED tu consultor\xEDa gratis \u2192"
  }))));
}
Object.assign(window, {
  Home
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Home.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Pages.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const {
  Button,
  Card,
  GradientText,
  Container,
  Section,
  CloudBackground,
  IntegrationTile,
  IntegrationPill,
  FilterBar,
  Accordion,
  HoverCard,
  CtaBanner,
  BlogCard,
  Select,
  Marquee,
  StatCard,
  StepItem,
  SpeckleEdge
} = window.Grow2onDesignSystem_f54f37;
function Integraciones() {
  const [cat, setCat] = React.useState('Todas');
  const total = INT_CATS.reduce((n, c) => n + c.ids.length, 0);
  const opts = [{
    label: 'Todas',
    count: total
  }, ...INT_CATS.map(c => ({
    label: c.key === 'eCommerce' ? 'Plataformas de E-commerce' : c.key,
    count: c.ids.length
  }))];
  const match = c => cat === 'Todas' || cat === (c.key === 'eCommerce' ? 'Plataformas de E-commerce' : c.key);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(CloudBackground, {
    opacity: .35
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'grid',
      gridTemplateColumns: '1.05fr .95fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/somos-partner-badge.png',
    alt: "",
    style: {
      width: '100%',
      maxWidth: 320,
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 16px',
      fontSize: 44,
      fontWeight: 600,
      lineHeight: 1.15,
      color: 'var(--g2o-black)'
    }
  }, "Conect\xE1 con las ", /*#__PURE__*/React.createElement(GradientText, null, "plataformas que ya us\xE1s.")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 18,
      lineHeight: 1.5
    }
  }, "Grow2on se conecta a tu ERP, tu ecommerce y tus marketplaces para mantener todo sincronizado, sin integraciones a medida ni desarrollo extra.")), /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/hero-graphic-integraciones.png',
    alt: "",
    style: {
      width: '100%',
      animation: 'g2o-hero-float-y 7s ease-in-out infinite'
    }
  })), /*#__PURE__*/React.createElement(Container, {
    style: {
      marginTop: 40,
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement(Marquee, {
    grayscale: false,
    height: 40,
    logos: INT_MARQUEE
  }))), /*#__PURE__*/React.createElement(Section, {
    tight: true
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(FilterBar, {
    options: opts,
    value: cat,
    onChange: setCat
  }))), INT_CATS.filter(match).map(c => /*#__PURE__*/React.createElement(Section, {
    key: c.key,
    tight: true
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 28
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'illustrations/' + c.icon,
    alt: "",
    style: {
      height: 68,
      width: 'auto',
      objectFit: 'contain',
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: 'var(--g2o-pink)',
      fontWeight: 700,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, c.eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 30,
      margin: 0,
      fontWeight: 600,
      color: 'var(--color-text-primary)'
    }
  }, c.heading))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6,1fr)',
      gap: 20
    }
  }, c.ids.map(id => /*#__PURE__*/React.createElement(IntegrationTile, {
    key: id,
    src: intSrc(id),
    alt: INT_NAMES[id]
  })))))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(CtaBanner, {
    title: "\xBFNo ves tu plataforma en la lista?",
    body: "Contanos qu\xE9 sistema us\xE1s y evaluamos la integraci\xF3n a tu medida.",
    ctaLabel: "Contanos tu caso"
  }))));
}
function Funcionalidades() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(CloudBackground, {
    opacity: .35
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/somos-partner-badge.png',
    alt: "Somos Partner \u2014 Tiendanube Evoluci\xF3n",
    style: {
      width: '100%',
      maxWidth: 320,
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 16px',
      fontSize: 44,
      fontWeight: 600,
      lineHeight: 1.15,
      color: 'var(--g2o-black)'
    }
  }, "Todo lo que necesit\xE1s para ", /*#__PURE__*/React.createElement(GradientText, null, "centralizar y sincronizar"), " tu cat\xE1logo"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 28px',
      fontSize: 18,
      lineHeight: 1.5
    }
  }, "Cada vez hay m\xE1s canales donde vender, y eso significa m\xE1s oportunidades, pero tambi\xE9n m\xE1s complejidad. Grow2on centraliza tu cat\xE1logo (venga de tu ERP, tu ecommerce o cualquier otra fuente) y lo mantiene sincronizado en todos tus canales, sin trabajo manual."), /*#__PURE__*/React.createElement(Button, null, "Ped\xED tu demo gratis")), /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/hero-graphic-funcionalidades.png',
    alt: "",
    style: {
      width: '100%',
      animation: 'g2o-hero-float-y 7s ease-in-out infinite'
    }
  }))), /*#__PURE__*/React.createElement(Section, {
    tight: true,
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(SpeckleEdge, {
    edges: ['left', 'right'],
    count: 220,
    spread: 20
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      maxWidth: 820,
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.5,
      margin: '0 0 12px'
    }
  }, "La gesti\xF3n manual de cat\xE1logo no escala. Cada canal nuevo, cada publicaci\xF3n, cada cambio de precio, multiplica el trabajo de tu equipo y el margen de error."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 18,
      lineHeight: 1.5,
      margin: 0,
      color: 'var(--g2o-black)',
      fontWeight: 600
    }
  }, "As\xED resuelve Grow2on cada parte de ese proceso:"))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 24
    }
  }, FUNC_DETAIL.map(ft => /*#__PURE__*/React.createElement(Card, {
    key: ft.t,
    variant: "fx"
  }, /*#__PURE__*/React.createElement(GradientText, {
    as: "h3",
    style: {
      fontSize: 22,
      fontWeight: 600,
      margin: '0 0 6px'
    }
  }, ft.t), ft.lead && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 8px',
      fontSize: 15,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, ft.lead), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--color-text-secondary)'
    }
  }, ft.d)))))), /*#__PURE__*/React.createElement(Section, {
    background: "var(--color-surface-subtle)"
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 32px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "Funcionalidades Extras"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2,1fr)',
      gap: 24
    }
  }, FUNC_EXTRAS.map(x => /*#__PURE__*/React.createElement(Card, {
    key: x.t
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      marginBottom: 14
    }
  }, x.isos.map((i, n) => /*#__PURE__*/React.createElement("span", {
    key: i + n,
    style: {
      width: 36,
      height: 36,
      borderRadius: 7,
      background: '#fff',
      border: '1px solid var(--color-border-default)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: 3,
      marginLeft: n ? -6 : 0,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'platforms/iso-' + i + '.png',
    alt: "",
    style: {
      maxWidth: '100%',
      maxHeight: '100%',
      objectFit: 'contain'
    }
  })))), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 8px',
      fontSize: 20,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, x.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 12px',
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--color-text-secondary)'
    }
  }, x.d), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'grid',
      gap: 6
    }
  }, x.bullets.map(b => /*#__PURE__*/React.createElement("li", {
    key: b,
    style: {
      fontSize: 14,
      color: 'var(--color-text-secondary)',
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--g2o-pink)',
      fontWeight: 700
    }
  }, "\u2713"), b)))))))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(CtaBanner, {
    title: "\xBFQuer\xE9s ver estas funcionalidades en acci\xF3n?",
    body: "Ped\xED una demo gratuita y te mostramos c\xF3mo Grow2on se adapta a la forma en que ya trabaj\xE1s.",
    ctaLabel: "Ped\xED tu demo gratis \u2192"
  }))));
}
function Blog() {
  const [feat, ...rest] = POSTS;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 8px',
      fontSize: 44,
      fontWeight: 600,
      lineHeight: 1.15,
      color: 'var(--g2o-black)'
    }
  }, "Blog"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 40px',
      fontSize: 18
    }
  }, "Noticias sobre ecommerce y gesti\xF3n multicanal."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: '48px 32px'
    }
  }, /*#__PURE__*/React.createElement(BlogCard, _extends({
    style: {
      gridColumn: 'span 3'
    }
  }, feat)), rest.map(p => /*#__PURE__*/React.createElement(BlogCard, _extends({
    key: p.title
  }, p)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 40
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "outline"
  }, "Siguientes \u2192")))), /*#__PURE__*/React.createElement(Section, {
    background: "var(--color-surface-subtle)"
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement(Marquee, {
    logos: CUSTOMERS
  }))));
}
function Hablemos() {
  const [sent, setSent] = React.useState(false);
  return /*#__PURE__*/React.createElement(Section, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(CloudBackground, {
    opacity: .35
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/hero-graphic.png',
    alt: "",
    style: {
      width: '70%',
      maxWidth: 320,
      opacity: .9,
      animation: 'g2o-spin 46s linear infinite',
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 14px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "Arranc\xE1 ahora."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 10px',
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "Centraliz\xE1 tus canales de venta y elimin\xE1 la carga manual con Grow2on."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0
    }
  }, "Complet\xE1 el formulario y nos pondremos en contacto a la brevedad.")), /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 32
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: '40px 0'
    }
  }, /*#__PURE__*/React.createElement(GradientText, {
    style: {
      fontSize: 30,
      fontWeight: 700
    }
  }, "\xA1Gracias!"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 12
    }
  }, "Nos pondremos en contacto a la brevedad."), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    style: {
      marginTop: 16
    },
    onClick: () => setSent(false)
  }, "Volver al formulario")) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Select, {
    label: "Pa\xEDs",
    required: true,
    options: ['Argentina', 'México', 'España'],
    placeholder: "Selecciona tu pa\xEDs"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Servicio que desea contratar",
    required: true,
    options: HABLEMOS_SERVICIOS,
    placeholder: "\xBFQu\xE9 necesit\xE1s integrar?"
  }), /*#__PURE__*/React.createElement(Button, {
    onClick: () => setSent(true)
  }, "Enviar")))));
}
function Erp() {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Section, {
    style: {
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(CloudBackground, {
    opacity: .35
  }), /*#__PURE__*/React.createElement(Container, {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 48,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/somos-partner-badge.png',
    alt: "",
    style: {
      width: '100%',
      maxWidth: 320,
      marginBottom: 18
    }
  }), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: '0 0 16px',
      fontSize: 44,
      fontWeight: 600,
      lineHeight: 1.15,
      color: 'var(--g2o-black)'
    }
  }, "Un conector de eCommerce Multicanal para tu ERP ", /*#__PURE__*/React.createElement(GradientText, null, "con tu marca propia")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 28px',
      fontSize: 18
    }
  }, "Haz crecer tu negocio y ofrece m\xE1s valor a tus clientes sin escribir una l\xEDnea de c\xF3digo."), /*#__PURE__*/React.createElement(Button, {
    iconRight: "\u2192"
  }, "Conoce c\xF3mo")), /*#__PURE__*/React.createElement("img", {
    src: A + 'illustrations/sos-erp-icon-hero.png',
    alt: "",
    style: {
      width: '100%',
      animation: 'g2o-hero-float-y 7s ease-in-out infinite'
    }
  }))), /*#__PURE__*/React.createElement(Section, {
    tight: true
  }, /*#__PURE__*/React.createElement(Container, {
    style: {
      textAlign: 'center',
      maxWidth: 760
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 20px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "Ofrece a tus clientes un Conector Multicanal. Sincroniza y potencia su mundo online."), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    iconRight: "\u2192"
  }, "M\xE1s informaci\xF3n"))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "Conecta"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 32px'
    }
  }, "Grow2on integra el negocio offline con el online en sitios B2C y B2B."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 24
    }
  }, ERP_PILLARS.map(p => /*#__PURE__*/React.createElement(Card, {
    key: p.t
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'illustrations/' + p.icon,
    alt: "",
    style: {
      height: 72,
      width: 'auto',
      marginBottom: 12
    }
  }), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '0 0 6px',
      fontSize: 20,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, p.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      lineHeight: 1.5,
      color: 'var(--color-text-secondary)'
    }
  }, p.d)))))), /*#__PURE__*/React.createElement(Section, {
    background: "var(--color-surface-subtle)"
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "Sincroniza"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 28px',
      maxWidth: 720
    }
  }, "Podr\xE1s ofrecer a tus clientes conexi\xF3n a las principales plataformas y Marketplaces del mercado para simplificarles la gesti\xF3n de su negocio online y ayudarlos a vender m\xE1s."), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--g2o-pink)',
      marginBottom: 14
    }
  }, "Canales"), /*#__PURE__*/React.createElement(Marquee, {
    grayscale: false,
    height: 44,
    logos: PLATFORMS.slice(0, 11).map(p => p.src)
  }))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 8px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "Potencia"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 28px'
    }
  }, "Fideliza a tus clientes con soluciones que responden a las demandas del mercado actual."), /*#__PURE__*/React.createElement("img", {
    src: A + 'brand/sos-erp-video-poster.png',
    alt: "",
    style: {
      width: '100%',
      borderRadius: 16,
      border: '1px solid var(--color-border-default)'
    }
  }))), /*#__PURE__*/React.createElement(Section, {
    background: "var(--color-surface-subtle)"
  }, /*#__PURE__*/React.createElement(Container, null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 40px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "C\xF3mo implementamos Grow2on como Marca Blanca"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4,1fr)',
      gap: 24
    }
  }, ERP_STEPS.map(([n, t, d], i) => /*#__PURE__*/React.createElement(StepItem, {
    key: n,
    number: n,
    title: t,
    body: d,
    arrow: A + 'brand/flecha-pasos.png',
    showArrow: i < 3
  }))))), /*#__PURE__*/React.createElement(Section, null, /*#__PURE__*/React.createElement(Container, {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: '0 0 32px',
      fontSize: 30,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, "\xA1Animate a crecer m\xE1s!"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      justifyContent: 'center',
      marginBottom: 32,
      flexWrap: 'wrap'
    }
  }, [['sos-erp-icon-ahorro-tiempo.png', 'Ahorra tiempo'], ['sos-erp-icon-error-humano.png', 'Evita error humano'], ['sos-erp-icon-multicanalidad.png', 'Multicanalidad']].map(([i, t]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
      width: 180
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: A + 'illustrations/' + i,
    alt: "",
    style: {
      height: 72,
      width: 'auto'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 600,
      color: 'var(--g2o-black)'
    }
  }, t)))), /*#__PURE__*/React.createElement(Button, {
    iconRight: "\u2192"
  }, "Agend\xE1 una reuni\xF3n"))));
}
Object.assign(window, {
  Integraciones,
  Funcionalidades,
  Blog,
  Hablemos,
  Erp
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Pages.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Shared.jsx
try { (() => {
const A = '../../assets/';
const PLATFORMS = [['mercadolibre', 'Mercado Libre'], ['shopify', 'Shopify'], ['tiendanube', 'Tiendanube'], ['woocommerce', 'WooCommerce'], ['vtex', 'VTEX'], ['prestashop', 'PrestaShop'], ['odoo', 'Odoo'], ['zeus', 'ZEUS ERP & POS'], ['flexxus', 'Flexxus'], ['magento', 'Magento'], ['bas', 'BAS Buenos Aires Software'], ['datisa', 'DATISA'], ['stelorder', 'Stel Order'], ['bilder', 'Bilder'], ['fravega', 'Frávega'], ['oncity', 'On City']].map(([id, name]) => ({
  id,
  name,
  src: A + 'platforms/platform-' + id + '.png'
}));
PLATFORMS.push({
  id: 'provincia',
  name: 'Provincia Compras',
  src: A + 'platforms/platform-provincia.webp'
});
PLATFORMS.push({
  id: 'sap',
  name: 'SAP ERP',
  src: A + 'platforms/platform-sap.webp'
});
const CUSTOMERS = ['logo-cco.png', 'logo-farmacia-zentner.png', 'logo-infoandina.png', 'logo-libella.png', 'logo-bonitopie.webp', 'logo-digital-smart.webp', 'logo-fernandez-iluminacion.png', 'logo-gamma-hogar.webp', 'logo-handicap-deportes.png', 'logo-nassuti-autopartes.png'].map(n => A + 'customers/' + n);
const FEATURES = [{
  t: 'Sincronización de stock y precios',
  d: 'Tus productos se actualizan solos, sin que nadie tenga que tocar nada.',
  img: A + 'illustrations/feature-sync-stock.png'
}, {
  t: 'Publicación de artículos',
  d: 'Publicá en todos tus canales desde un solo lugar, en minutos.',
  img: A + 'illustrations/feature-publicacion-articulos.png'
}, {
  t: 'Sincronización de pedidos',
  d: 'Cada venta genera automáticamente su nota de pedido en tu sistema de gestión.',
  img: A + 'illustrations/feature-sync-pedidos.png'
}, {
  t: 'Stock de seguridad',
  d: 'Pausá publicaciones antes de llegar al quiebre de stock.',
  img: A + 'illustrations/feature-stock-seguridad.png'
}, {
  t: 'Precios diferenciados por canal',
  d: 'Aplicá recargos o descuentos distintos según dónde vendas.',
  img: A + 'illustrations/feature-precios-diferenciados.png'
}, {
  t: 'Múltiples publicaciones por artículo',
  d: 'Un mismo producto, vinculado a varios canales, siempre sincronizado.',
  img: A + 'illustrations/feature-multiples-publicaciones.png'
}];
const ALL_FUNCS = ['Publicación de artículos', 'Vinculación de publicaciones', 'Sincronización de precios y stock', 'Sincronización de pedidos', 'Stock de seguridad', 'Diferentes precios por publicación', 'Precios diferenciados por canal', 'Vinculación de variantes', 'Múltiples publicaciones', 'Creación de pedidos', 'Equivalencia de talles', 'Reporte de vinculaciones', 'Sincronización ventas full', 'Asistente de moderaciones y exposición MeLi'];
const NAV = [{
  label: 'Funcionalidades',
  page: 'funcionalidades',
  items: ALL_FUNCS.slice(0, 6).map(l => ({
    label: l
  }))
}, {
  label: 'Integraciones',
  page: 'integraciones',
  items: PLATFORMS.slice(0, 6).map(p => ({
    label: p.name
  }))
}, {
  label: 'Blog',
  page: 'blog'
}, {
  label: '¿Sos un ERP?',
  page: 'erp'
}];
const FOOTER = {
  columns: [{
    title: 'PRODUCTO',
    links: [{
      label: 'Funcionalidades'
    }, {
      label: 'Integraciones'
    }, {
      label: 'Blog'
    }, {
      label: '¿Sos un ERP?'
    }]
  }, {
    title: 'AYUDA',
    links: [{
      label: 'Mapa de sitio'
    }, {
      label: 'Políticas de privacidad'
    }]
  }, {
    title: 'HABLEMOS',
    links: [{
      label: 'info@grow2on.com'
    }]
  }],
  offices: [{
    country: 'Argentina',
    flag: A + 'icons/flag-argentina.png',
    address: 'Humberto Primo 843\n5000 Córdoba, Argentina\n+54 9 3516528589'
  }, {
    country: 'España',
    flag: A + 'icons/flag-espana.png',
    address: 'P.º de la Castellana, 194,\nChamartín, 28046 Madrid, España.\n+34 910053755'
  }]
};
const SOCIALS = ['facebook', 'instagram', 'youtube', 'linkedin'].map(n => A + 'icons/icon-' + n + '.png');
Object.assign(window, {
  A,
  PLATFORMS,
  CUSTOMERS,
  FEATURES,
  ALL_FUNCS,
  NAV,
  FOOTER,
  SOCIALS
});

// ——— Real copy read from grow2on.com/pages/funcionalidades ———
const FUNC_DETAIL = [{
  t: 'Publicación de artículos',
  lead: 'Publicá tus productos en cualquier canal en minutos, no en horas.',
  d: 'Seleccioná qué artículos publicar y en qué canales, sin cargar la misma información dos veces. Grow2on toma los datos de tu catálogo (ERP, ecommerce u otra fuente) y los distribuye listos para vender.'
}, {
  t: 'Vinculación de publicaciones',
  lead: '¿Ya tenés publicaciones activas? Las sincronizamos sin duplicar nada.',
  d: 'Si ya vendés en un marketplace o ecommerce, vinculamos esas publicaciones directo con tu catálogo para que empiecen a sincronizarse automáticamente, sin perder historial ni ventas.'
}, {
  t: 'Sincronización de precios y stock',
  lead: 'Actualizás una vez, se refleja en todos lados.',
  d: 'Cada cambio de precio o stock en tu catálogo se actualiza automáticamente en todos los canales conectados, en tiempo real. Se acabó el ir canal por canal repitiendo el mismo cambio.'
}, {
  t: 'Sincronización de pedidos',
  lead: 'Cada venta, registrada sola, en el lugar correcto.',
  d: 'Por cada venta realizada en cualquier canal, se genera automáticamente el pedido correspondiente en tu sistema de gestión o plataforma de origen, con los datos del cliente ya cargados.'
}, {
  t: 'Stock de seguridad',
  lead: 'Nunca más un quiebre de stock que te agarre desprevenido.',
  d: 'Definí un margen de stock de seguridad para que tus publicaciones se pausen automáticamente antes de llegar a cero, evitando sobreventa.'
}, {
  t: 'Diferentes precios por publicación',
  lead: '',
  d: 'Posibilidad de aplicar un coeficiente de recargo o descuento sobre el precio de lista del ERP para que cada publicación vinculada tenga un precio diferente.'
}, {
  t: 'Precios diferenciados por canal',
  lead: 'Cada canal, con el precio que mejor te conviene.',
  d: 'Aplicá un coeficiente de recargo o descuento distinto por canal, manteniendo un único precio base en tu catálogo.'
}, {
  t: 'Vinculación de variantes',
  lead: 'Talles, colores o modelos, todos sincronizados.',
  d: 'Vinculá las variantes de una publicación a los artículos individuales correspondientes, para que cada una mantenga su stock actualizado de forma independiente.'
}, {
  t: 'Múltiples publicaciones',
  lead: 'Un mismo producto, en varios canales, siempre coordinado.',
  d: 'Vinculá más de una publicación a un mismo artículo y mantené stock y precios sincronizados en todas ellas de forma simultánea.'
}, {
  t: 'Creación de pedidos',
  lead: '',
  d: 'Por cada venta realizada en la plataforma, se genera automáticamente una nota de pedido en el Software de Gestión con los datos del cliente.'
}, {
  t: 'Equivalencia de talles',
  lead: '',
  d: 'Configurá tus equivalencias de talles para actualizarlas masivamente, así tus productos y pedidos sincronizan correctamente.'
}, {
  t: 'Reporte de vinculaciones',
  lead: '',
  d: 'Generá y descargá un reporte con el detalle de vinculaciones de todos tus canales activos.'
}, {
  t: 'Sincronización ventas full',
  lead: '',
  d: 'Seleccioná un depósito especial para insertar las ventas Full y tener mayor control del stock de esos productos.'
}, {
  t: 'Asistente de moderaciones y exposición MeLi',
  lead: '',
  d: 'Permite realizar manejo de precios por cantidad de acuerdo a las políticas de Mercado Libre.'
}];
const FUNC_EXTRAS = [{
  t: 'Inserción automática de pagos (solo Flexxus)',
  d: 'Sincronizá automáticamente los pagos con cada pedido y factura masivamente.',
  bullets: ['Facturación más rápida.', 'Menos errores administrativos.'],
  isos: ['flexxus-favicon-48']
}, {
  t: 'Vinculador masivo (Tiendanube / Flexxus / Datisa / SAP / Stel Order)',
  d: 'Vinculá masivamente los últimos productos publicados.',
  bullets: ['Ahorro de tiempo.', 'Menos errores.', 'Catálogo siempre actualizado.'],
  isos: ['tiendanube', 'flexxus-favicon-48', 'datisa', 'sap', 'stelorder']
}, {
  t: 'Reglas de Precios (Mercado Libre)',
  d: 'Aplicá reglas automáticas de actualización de precios según criterios configurables.',
  bullets: ['Coherencia comercial.', 'Mayor rentabilidad.', 'Respuesta rápida al mercado.'],
  isos: ['mercadolibre']
}, {
  t: 'SYNC2GROW (para todos los canales)',
  d: 'Actualizá simultáneamente todos los canales y el ERP.',
  bullets: ['Menos sobreventas.', 'Información unificada.', 'Sincronización en hasta 15 minutos.'],
  isos: ['flexxus-favicon-48', 'mercadolibre', 'tiendanube', 'woocommerce', 'vtex', 'prestashop', 'shopify']
}];

// ——— Real copy read from grow2on.com/pages/sos-un-erp ———
const ERP_PILLARS = [{
  icon: 'sos-erp-icon-multicanalidad.png',
  t: 'Multicanalidad',
  d: 'Tus clientes podrán gestionar todos sus canales online desde un solo lugar, mejorando la eficiencia en la gestión.'
}, {
  icon: 'sos-erp-icon-desarrollo.png',
  t: 'Desarrollo',
  d: '¿Cuánto tiempo calculas que tomaría conectar todos los canales a tu ERP? Nosotros podemos hacerlo en menos de 60 días.'
}, {
  icon: 'sos-erp-icon-innovacion.png',
  t: 'Innovación Permanente',
  d: 'Somos un equipo de expertos desarrollando constantemente para lograr la mejor experiencia a nuestros clientes.'
}, {
  icon: 'sos-erp-icon-soporte.png',
  t: 'Soporte especializado',
  d: 'Nuestro foco es la satisfacción del cliente, y trabajamos por SLA para brindar el mejor soporte a ti y a tus clientes.'
}, {
  icon: 'sos-erp-icon-b2c-b2b.png',
  t: 'Conexiones B2C y B2B',
  d: 'Tenemos solución tanto para tus clientes que venden B2C como para aquellos que venden con lógica B2B.'
}];
const ERP_STEPS = [['1', 'Integramos tu ERP a Grow2on', 'Nos das los accesos al ERP y nosotros nos encargamos del desarrollo de conectarlo a Grow2on.'], ['2', 'Adaptamos el diseño a tu marca', 'Trabajamos juntos para que la solución se vea y se sienta como un producto propio tuyo.'], ['3', 'Armamos los mejores procesos', 'Definimos juntos los procesos de marketing, comercial y soporte con los que vamos a trabajar.'], ['4', 'Tus clientes empiezan a usar tu nueva solución', 'Ahora tus clientes son más productivos y pueden simplificar la gestión de su negocio online.']];

// ——— Real posts from grow2on.com/blogs/news ———
const POSTS = [{
  tag: 'Integraciones',
  title: 'Grow2on en la Tienda de Aplicaciones de Tiendanube: integración con Mercado Libre y más',
  date: '02 de septiembre, 2026',
  featured: true
}, {
  tag: 'Integraciones',
  title: 'Grow2on es partner certificado de Mercado Libre: qué significa para tu negocio'
}, {
  title: 'Nuevo modelo de User Products en Mercado Libre: cómo funciona y cómo migrar tus publicaciones desde Grow2on'
}, {
  title: 'Vende en más canales con Grow2on'
}, {
  title: '¿Cómo vincular Tiendanube con Mercado Libre para potenciar tu negocio?'
}, {
  tag: 'Tutoriales',
  title: 'Cómo automatizar la carga de pedidos entre tu ecommerce y tu sistema de gestión'
}];
Object.assign(window, {
  FUNC_DETAIL,
  FUNC_EXTRAS,
  ERP_PILLARS,
  ERP_STEPS,
  POSTS
});

// ——— Real taxonomy + copy from grow2on.com/pages/integraciones ———
const INT_CATS = [{
  key: 'eCommerce',
  icon: 'icon-cat-ecommerce.png',
  eyebrow: 'eCommerce',
  heading: 'Tu tienda online, siempre al día',
  ids: ['shopify', 'tiendanube-int', 'woocommerce', 'vtex', 'prestashop', 'magento-int']
}, {
  key: 'Marketplaces',
  icon: 'icon-cat-marketplace.png',
  eyebrow: 'Marketplaces',
  heading: 'Vendé en más de un lugar, sin duplicar trabajo',
  ids: ['mercadolibre', 'provincia-int', 'fravega-int', 'bilder', 'oncity']
}, {
  key: 'ERPs',
  icon: 'icon-cat-erp.png',
  eyebrow: 'ERPs',
  heading: 'Tu sistema de gestión, hablando con tus canales',
  ids: ['odoo', 'zeus', 'datisa', 'stelorder', 'bas', 'flexxus', 'sap']
}];
const INT_NAMES = {
  shopify: 'Shopify',
  'tiendanube-int': 'Tiendanube',
  woocommerce: 'WooCommerce',
  vtex: 'VTEX',
  prestashop: 'PrestaShop',
  'magento-int': 'Magento',
  mercadolibre: 'Mercado Libre',
  'provincia-int': 'Provincia Compras',
  'fravega-int': 'Frávega',
  bilder: 'Bilder',
  oncity: 'On City',
  odoo: 'Odoo',
  zeus: 'ZEUS ERP & POS',
  datisa: 'DATISA',
  stelorder: 'Stel Order',
  bas: 'BAS Buenos Aires Software',
  flexxus: 'Flexxus',
  sap: 'SAP'
};
const intSrc = id => A + 'platforms/platform-' + id + (id === 'sap' ? '.webp' : '.png');
const INT_MARQUEE = ['mercadolibre', 'provincia-int', 'shopify', 'tiendanube-int', 'woocommerce', 'vtex', 'prestashop', 'magento-int', 'odoo', 'zeus', 'datisa', 'stelorder', 'bas', 'flexxus', 'sap', 'fravega-int', 'bilder', 'oncity'].map(intSrc);
const HABLEMOS_SERVICIOS = ['Mi Mercado Libre', 'Mi Tiendanube', 'Mi Shopify', 'Mi Prestashop', 'Tiendanuebe con Mercadolibre', 'Mi Vtex', 'Mi Woocommerce', 'Mi Magento', 'Mi BAPRO', 'Mi Fravega', 'Un eCommerce B2B'];
Object.assign(window, {
  INT_CATS,
  INT_NAMES,
  intSrc,
  INT_MARQUEE,
  HABLEMOS_SERVICIOS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Shared.jsx", error: String((e && e.message) || e) }); }

__ds_ns.PlatformHub = __ds_scope.PlatformHub;

__ds_ns.SpeckleEdge = __ds_scope.SpeckleEdge;

__ds_ns.Accordion = __ds_scope.Accordion;

__ds_ns.BlogCard = __ds_scope.BlogCard;

__ds_ns.CtaBanner = __ds_scope.CtaBanner;

__ds_ns.HoverCard = __ds_scope.HoverCard;

__ds_ns.IntegrationTile = __ds_scope.IntegrationTile;

__ds_ns.IntegrationPill = __ds_scope.IntegrationPill;

__ds_ns.Marquee = __ds_scope.Marquee;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.StepItem = __ds_scope.StepItem;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.CardVisual = __ds_scope.CardVisual;

__ds_ns.CloudBackground = __ds_scope.CloudBackground;

__ds_ns.Container = __ds_scope.Container;

__ds_ns.Section = __ds_scope.Section;

__ds_ns.GradientText = __ds_scope.GradientText;

__ds_ns.BarChart = __ds_scope.BarChart;

__ds_ns.Gauge = __ds_scope.Gauge;

__ds_ns.ParticleField = __ds_scope.ParticleField;

__ds_ns.ValueChip = __ds_scope.ValueChip;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.ProgressSteps = __ds_scope.ProgressSteps;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.FilterBar = __ds_scope.FilterBar;

__ds_ns.Footer = __ds_scope.Footer;

__ds_ns.Header = __ds_scope.Header;

__ds_ns.MobileAccordion = __ds_scope.MobileAccordion;

})();
