// Catálogo de archivos de Grow2on para video. Viven en `assets/g2o/` (al lado de los videos; el motor los sirve solos)
// y se copiaron de "G2O Mkt Design System/assets". Se usan con <Imagen src={G2O.marca.logo} ... /> (ver ./Imagen.tsx).
import { asset } from "video-estudio/engine";

const a = (ruta: string) => asset(`g2o/${ruta}`);

/** Nombres de los íconos 3D (assets/g2o/icons-3d/<nombre>.png). */
export const ICONOS_3D = [
  "ahorro-de-tiempo", "aro-base-plataformas", "atencion", "caja-ecommerce", "carrito", "conectividad-wifi", "conexiones-b2c-b2b",
  "datos", "desarrollo", "ecommerce", "erp", "error", "error-1", "error-2", "error-3", "evita-error-humano", "flecha-cursor",
  "flecha-pasos", "gracias", "innovacion-permanente", "interfaz", "lupa", "marketplace", "multicanalidad", "multicanalidad-v2",
  "productividad", "soporte-especializado", "subir-a-la-nube", "virtud-funcionalidades", "web",
] as const;
export type Icono3D = (typeof ICONOS_3D)[number];

/** Plataformas con logo en círculo (assets/g2o/platforms/circle/circle-<nombre>.png). */
export const PLATAFORMAS = [
  "amazon", "bas", "bilder", "datisa", "flexxus", "fravega", "magento", "mercadolibre", "odoo", "oncity", "prestashop",
  "provincia", "sap", "shopify", "stelorder", "tiendanube", "vtex", "woocommerce", "zeus",
] as const;
export type Plataforma = (typeof PLATAFORMAS)[number];

/** Fotos del blog (assets/g2o/photos/). Van a cuadro completo, sin recolorear, con velo oscuro bajo el texto. */
export const FOTOS = [
  "automatizacion-de-pedidos.png", "carga-manual-de-productos.png", "checklist-multicanal.png", "conector-multicanal.png",
  "erp-vs-pim.png", "errores-de-stock.png", "mercado-libre-partner-wide.png", "pim.png", "sincronizacion-de-stock.png",
  "stock-de-seguridad.jpg", "tiendanube-evolucion-partner.png", "tiendanube-vs-mercado-libre-wide.png",
  "user-products-mercado-libre.png", "vende-en-mas-canales.png", "vender-en-amazon.jpg", "venta-multicanal-argentina.png",
  "vincular-tiendanube-mercado-libre.png",
] as const;

export const G2O = {
  marca: {
    /** Logo oficial a color (vector). */
    logo: a("brand/logo.svg"),
    /** Logo blanco, para fondos oscuros o fotos con velo. */
    logoBlanco: a("brand/logo-grow2on-white.png"),
    logoPng: a("brand/logo-grow2on.png"),
    /** Aro 3D con burbujas: el gráfico del cierre. */
    aro: a("brand/hero-graphic.png"),
    /** Aro 3D de la intro de funcionalidades. */
    aroFuncionalidades: a("brand/hero-graphic-funcionalidades.png"),
    aroIntegraciones: a("brand/hero-graphic-integraciones.png"),
    saturno: a("brand/grow2on-saturno.png"),
    hubPlataformas: a("brand/platform-hub-center.png"),
    /** Zócalo de 1920x109 para el pie de una placa (solo sobre blanco). */
    zocalo: a("brand/zocalo-presentaciones.png"),
    somosPartner: a("brand/banner-somos-partner.png"),
    somosPartner2: a("brand/banner-somos-partner-02.png"),
  },
  icono3d: (nombre: Icono3D) => a(`icons-3d/${nombre}.png`),
  plataforma: {
    /** Logo dentro de un círculo. */
    circulo: (nombre: Plataforma) => a(`platforms/circle/circle-${nombre}.png`),
    /** Logo plano (no todas las plataformas lo tienen: ver assets/g2o/platforms/flat). */
    plano: (archivo: string) => a(`platforms/flat/${archivo}`),
    /** Ficha con el logo (platform-<nombre>.png; sap y provincia son .webp). */
    ficha: (archivo: string) => a(`platforms/${archivo}`),
  },
  mockup: {
    laptopFlotante: a("mockups/laptop-flotante-logo.png"),
    laptopFrontal: a("mockups/laptop-frontal-app.png"),
    laptopWeb: a("mockups/laptop-home-web.png"),
    laptopPerspectiva: a("mockups/laptop-perspectiva-logo.png"),
    laptopPlataforma: a("mockups/laptop-plataforma.png"),
    laptopShopify: a("mockups/laptop-shopify.png"),
  },
  foto: (archivo: (typeof FOTOS)[number]) => a(`photos/${archivo}`),
  bandera: { argentina: a("icons/flag-argentina.png"), espana: a("icons/flag-espana.png") },
  /** Cortina sonora del cierre ("Conecta, sincroniza y potencia", 2,9 s). */
  audioCierre: a("audio/cierre-musica.mp3"),
};
