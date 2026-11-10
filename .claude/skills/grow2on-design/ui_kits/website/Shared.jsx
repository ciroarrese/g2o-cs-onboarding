const A='../../assets/';
const PLATFORMS=[
 ['mercadolibre','Mercado Libre'],['shopify','Shopify'],['tiendanube','Tiendanube'],['woocommerce','WooCommerce'],
 ['vtex','VTEX'],['prestashop','PrestaShop'],['odoo','Odoo'],['zeus','ZEUS ERP & POS'],['flexxus','Flexxus'],
 ['magento','Magento'],['bas','BAS Buenos Aires Software'],['datisa','DATISA'],['stelorder','Stel Order'],
 ['bilder','Bilder'],['fravega','Frávega'],['oncity','On City']
].map(([id,name])=>({id,name,src:A+'platforms/platform-'+id+'.png'}));
PLATFORMS.push({id:'provincia',name:'Provincia Compras',src:A+'platforms/platform-provincia.webp'});
PLATFORMS.push({id:'sap',name:'SAP ERP',src:A+'platforms/platform-sap.webp'});

const CUSTOMERS=['logo-cco.png','logo-farmacia-zentner.png','logo-infoandina.png','logo-libella.png','logo-bonitopie.webp','logo-digital-smart.webp','logo-fernandez-iluminacion.png','logo-gamma-hogar.webp','logo-handicap-deportes.png','logo-nassuti-autopartes.png'].map(n=>A+'customers/'+n);

const FEATURES=[
 {t:'Sincronización de stock y precios',d:'Tus productos se actualizan solos, sin que nadie tenga que tocar nada.',img:A+'illustrations/feature-sync-stock.png'},
 {t:'Publicación de artículos',d:'Publicá en todos tus canales desde un solo lugar, en minutos.',img:A+'illustrations/feature-publicacion-articulos.png'},
 {t:'Sincronización de pedidos',d:'Cada venta genera automáticamente su nota de pedido en tu sistema de gestión.',img:A+'illustrations/feature-sync-pedidos.png'},
 {t:'Stock de seguridad',d:'Pausá publicaciones antes de llegar al quiebre de stock.',img:A+'illustrations/feature-stock-seguridad.png'},
 {t:'Precios diferenciados por canal',d:'Aplicá recargos o descuentos distintos según dónde vendas.',img:A+'illustrations/feature-precios-diferenciados.png'},
 {t:'Múltiples publicaciones por artículo',d:'Un mismo producto, vinculado a varios canales, siempre sincronizado.',img:A+'illustrations/feature-multiples-publicaciones.png'}
];

const ALL_FUNCS=['Publicación de artículos','Vinculación de publicaciones','Sincronización de precios y stock','Sincronización de pedidos','Stock de seguridad','Diferentes precios por publicación','Precios diferenciados por canal','Vinculación de variantes','Múltiples publicaciones','Creación de pedidos','Equivalencia de talles','Reporte de vinculaciones','Sincronización ventas full','Asistente de moderaciones y exposición MeLi'];

const NAV=[
 {label:'Funcionalidades',page:'funcionalidades',items:ALL_FUNCS.slice(0,6).map(l=>({label:l}))},
 {label:'Integraciones',page:'integraciones',items:PLATFORMS.slice(0,6).map(p=>({label:p.name}))},
 {label:'Blog',page:'blog'},
 {label:'¿Sos un ERP?',page:'erp'}
];

const FOOTER={
 columns:[
  {title:'PRODUCTO',links:[{label:'Funcionalidades'},{label:'Integraciones'},{label:'Blog'},{label:'¿Sos un ERP?'}]},
  {title:'AYUDA',links:[{label:'Mapa de sitio'},{label:'Políticas de privacidad'}]},
  {title:'HABLEMOS',links:[{label:'info@grow2on.com'}]}
 ],
 offices:[
  {country:'Argentina',flag:A+'icons/flag-argentina.png',address:'Humberto Primo 843\n5000 Córdoba, Argentina\n+54 9 3516528589'},
  {country:'España',flag:A+'icons/flag-espana.png',address:'P.º de la Castellana, 194,\nChamartín, 28046 Madrid, España.\n+34 910053755'}
 ]
};

const SOCIALS=['facebook','instagram','youtube','linkedin'].map(n=>A+'icons/icon-'+n+'.png');

Object.assign(window,{A,PLATFORMS,CUSTOMERS,FEATURES,ALL_FUNCS,NAV,FOOTER,SOCIALS});

// ——— Real copy read from grow2on.com/pages/funcionalidades ———
const FUNC_DETAIL=[
 {t:'Publicación de artículos',lead:'Publicá tus productos en cualquier canal en minutos, no en horas.',d:'Seleccioná qué artículos publicar y en qué canales, sin cargar la misma información dos veces. Grow2on toma los datos de tu catálogo (ERP, ecommerce u otra fuente) y los distribuye listos para vender.'},
 {t:'Vinculación de publicaciones',lead:'¿Ya tenés publicaciones activas? Las sincronizamos sin duplicar nada.',d:'Si ya vendés en un marketplace o ecommerce, vinculamos esas publicaciones directo con tu catálogo para que empiecen a sincronizarse automáticamente, sin perder historial ni ventas.'},
 {t:'Sincronización de precios y stock',lead:'Actualizás una vez, se refleja en todos lados.',d:'Cada cambio de precio o stock en tu catálogo se actualiza automáticamente en todos los canales conectados, en tiempo real. Se acabó el ir canal por canal repitiendo el mismo cambio.'},
 {t:'Sincronización de pedidos',lead:'Cada venta, registrada sola, en el lugar correcto.',d:'Por cada venta realizada en cualquier canal, se genera automáticamente el pedido correspondiente en tu sistema de gestión o plataforma de origen, con los datos del cliente ya cargados.'},
 {t:'Stock de seguridad',lead:'Nunca más un quiebre de stock que te agarre desprevenido.',d:'Definí un margen de stock de seguridad para que tus publicaciones se pausen automáticamente antes de llegar a cero, evitando sobreventa.'},
 {t:'Diferentes precios por publicación',lead:'',d:'Posibilidad de aplicar un coeficiente de recargo o descuento sobre el precio de lista del ERP para que cada publicación vinculada tenga un precio diferente.'},
 {t:'Precios diferenciados por canal',lead:'Cada canal, con el precio que mejor te conviene.',d:'Aplicá un coeficiente de recargo o descuento distinto por canal, manteniendo un único precio base en tu catálogo.'},
 {t:'Vinculación de variantes',lead:'Talles, colores o modelos, todos sincronizados.',d:'Vinculá las variantes de una publicación a los artículos individuales correspondientes, para que cada una mantenga su stock actualizado de forma independiente.'},
 {t:'Múltiples publicaciones',lead:'Un mismo producto, en varios canales, siempre coordinado.',d:'Vinculá más de una publicación a un mismo artículo y mantené stock y precios sincronizados en todas ellas de forma simultánea.'},
 {t:'Creación de pedidos',lead:'',d:'Por cada venta realizada en la plataforma, se genera automáticamente una nota de pedido en el Software de Gestión con los datos del cliente.'},
 {t:'Equivalencia de talles',lead:'',d:'Configurá tus equivalencias de talles para actualizarlas masivamente, así tus productos y pedidos sincronizan correctamente.'},
 {t:'Reporte de vinculaciones',lead:'',d:'Generá y descargá un reporte con el detalle de vinculaciones de todos tus canales activos.'},
 {t:'Sincronización ventas full',lead:'',d:'Seleccioná un depósito especial para insertar las ventas Full y tener mayor control del stock de esos productos.'},
 {t:'Asistente de moderaciones y exposición MeLi',lead:'',d:'Permite realizar manejo de precios por cantidad de acuerdo a las políticas de Mercado Libre.'}
];

const FUNC_EXTRAS=[
 {t:'Inserción automática de pagos (solo Flexxus)',d:'Sincronizá automáticamente los pagos con cada pedido y factura masivamente.',bullets:['Facturación más rápida.','Menos errores administrativos.'],isos:['flexxus-favicon-48']},
 {t:'Vinculador masivo (Tiendanube / Flexxus / Datisa / SAP / Stel Order)',d:'Vinculá masivamente los últimos productos publicados.',bullets:['Ahorro de tiempo.','Menos errores.','Catálogo siempre actualizado.'],isos:['tiendanube','flexxus-favicon-48','datisa','sap','stelorder']},
 {t:'Reglas de Precios (Mercado Libre)',d:'Aplicá reglas automáticas de actualización de precios según criterios configurables.',bullets:['Coherencia comercial.','Mayor rentabilidad.','Respuesta rápida al mercado.'],isos:['mercadolibre']},
 {t:'SYNC2GROW (para todos los canales)',d:'Actualizá simultáneamente todos los canales y el ERP.',bullets:['Menos sobreventas.','Información unificada.','Sincronización en hasta 15 minutos.'],isos:['flexxus-favicon-48','mercadolibre','tiendanube','woocommerce','vtex','prestashop','shopify']}
];

// ——— Real copy read from grow2on.com/pages/sos-un-erp ———
const ERP_PILLARS=[
 {icon:'sos-erp-icon-multicanalidad.png',t:'Multicanalidad',d:'Tus clientes podrán gestionar todos sus canales online desde un solo lugar, mejorando la eficiencia en la gestión.'},
 {icon:'sos-erp-icon-desarrollo.png',t:'Desarrollo',d:'¿Cuánto tiempo calculas que tomaría conectar todos los canales a tu ERP? Nosotros podemos hacerlo en menos de 60 días.'},
 {icon:'sos-erp-icon-innovacion.png',t:'Innovación Permanente',d:'Somos un equipo de expertos desarrollando constantemente para lograr la mejor experiencia a nuestros clientes.'},
 {icon:'sos-erp-icon-soporte.png',t:'Soporte especializado',d:'Nuestro foco es la satisfacción del cliente, y trabajamos por SLA para brindar el mejor soporte a ti y a tus clientes.'},
 {icon:'sos-erp-icon-b2c-b2b.png',t:'Conexiones B2C y B2B',d:'Tenemos solución tanto para tus clientes que venden B2C como para aquellos que venden con lógica B2B.'}
];
const ERP_STEPS=[
 ['1','Integramos tu ERP a Grow2on','Nos das los accesos al ERP y nosotros nos encargamos del desarrollo de conectarlo a Grow2on.'],
 ['2','Adaptamos el diseño a tu marca','Trabajamos juntos para que la solución se vea y se sienta como un producto propio tuyo.'],
 ['3','Armamos los mejores procesos','Definimos juntos los procesos de marketing, comercial y soporte con los que vamos a trabajar.'],
 ['4','Tus clientes empiezan a usar tu nueva solución','Ahora tus clientes son más productivos y pueden simplificar la gestión de su negocio online.']
];

// ——— Real posts from grow2on.com/blogs/news ———
const POSTS=[
 {tag:'Integraciones',title:'Grow2on en la Tienda de Aplicaciones de Tiendanube: integración con Mercado Libre y más',date:'02 de septiembre, 2026',featured:true},
 {tag:'Integraciones',title:'Grow2on es partner certificado de Mercado Libre: qué significa para tu negocio'},
 {title:'Nuevo modelo de User Products en Mercado Libre: cómo funciona y cómo migrar tus publicaciones desde Grow2on'},
 {title:'Vende en más canales con Grow2on'},
 {title:'¿Cómo vincular Tiendanube con Mercado Libre para potenciar tu negocio?'},
 {tag:'Tutoriales',title:'Cómo automatizar la carga de pedidos entre tu ecommerce y tu sistema de gestión'}
];

Object.assign(window,{FUNC_DETAIL,FUNC_EXTRAS,ERP_PILLARS,ERP_STEPS,POSTS});

// ——— Real taxonomy + copy from grow2on.com/pages/integraciones ———
const INT_CATS=[
 {key:'eCommerce',icon:'icon-cat-ecommerce.png',eyebrow:'eCommerce',heading:'Tu tienda online, siempre al día',ids:['shopify','tiendanube-int','woocommerce','vtex','prestashop','magento-int']},
 {key:'Marketplaces',icon:'icon-cat-marketplace.png',eyebrow:'Marketplaces',heading:'Vendé en más de un lugar, sin duplicar trabajo',ids:['mercadolibre','provincia-int','fravega-int','bilder','oncity']},
 {key:'ERPs',icon:'icon-cat-erp.png',eyebrow:'ERPs',heading:'Tu sistema de gestión, hablando con tus canales',ids:['odoo','zeus','datisa','stelorder','bas','flexxus','sap']}
];
const INT_NAMES={shopify:'Shopify','tiendanube-int':'Tiendanube',woocommerce:'WooCommerce',vtex:'VTEX',prestashop:'PrestaShop','magento-int':'Magento',mercadolibre:'Mercado Libre','provincia-int':'Provincia Compras','fravega-int':'Frávega',bilder:'Bilder',oncity:'On City',odoo:'Odoo',zeus:'ZEUS ERP & POS',datisa:'DATISA',stelorder:'Stel Order',bas:'BAS Buenos Aires Software',flexxus:'Flexxus',sap:'SAP'};
const intSrc=id=>A+'platforms/platform-'+id+(id==='sap'?'.webp':'.png');
const INT_MARQUEE=['mercadolibre','provincia-int','shopify','tiendanube-int','woocommerce','vtex','prestashop','magento-int','odoo','zeus','datisa','stelorder','bas','flexxus','sap','fravega-int','bilder','oncity'].map(intSrc);
const HABLEMOS_SERVICIOS=['Mi Mercado Libre','Mi Tiendanube','Mi Shopify','Mi Prestashop','Tiendanuebe con Mercadolibre','Mi Vtex','Mi Woocommerce','Mi Magento','Mi BAPRO','Mi Fravega','Un eCommerce B2B'];
Object.assign(window,{INT_CATS,INT_NAMES,intSrc,INT_MARQUEE,HABLEMOS_SERVICIOS});
