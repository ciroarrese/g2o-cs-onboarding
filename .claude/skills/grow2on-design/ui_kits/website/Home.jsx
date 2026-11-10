const {Button,Card,CardVisual,GradientText,Container,Section,CloudBackground,StatCard,StepItem,IntegrationTile,Marquee,CtaBanner,Tooltip,BarChart,Gauge,ParticleField,ValueChip,PlatformHub}=window.Grow2onDesignSystem_f54f37;

function Hero({go}){
  return (
    <Section style={{overflow:'hidden',paddingTop:48}}>
      <Container style={{position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:48,alignItems:'center'}}>
        <div>
          <div style={{display:'inline-flex',alignItems:'center',gap:8,height:32,padding:'0 16px',borderRadius:'var(--radius-pill)',background:'var(--g2o-pink)',color:'#fff',fontSize:13,fontWeight:600,whiteSpace:'nowrap',marginBottom:20}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{flexShrink:0}}><circle cx="12" cy="12" r="11" fill="#fff"/><path d="M7.5 12.4l3 3 6-6.4" stroke="var(--g2o-pink)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            +400 empresas ya centralizaron su catálogo
          </div>
          <h1 style={{margin:'0 0 16px',fontSize:44,lineHeight:1.15,fontWeight:600,color:'var(--g2o-black)'}}>
            Centralizá tu catálogo.<br/><GradientText>Vendé en todos tus canales.</GradientText><br/>Sin errores.
          </h1>
          <p style={{margin:'0 0 28px',fontSize:18,lineHeight:1.5,maxWidth:520}}>
            Grow2on conecta tu ERP, tus depósitos y tus canales de venta en un solo lugar. Sincronizá stock, precios y pedidos automáticamente y ahorrá hasta 80% del tiempo que hoy perdés en gestión manual.
          </p>
          <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
            <Button onClick={()=>go('hablemos')}>Pedí tu demo gratis</Button>
            <Button variant="outline" iconRight="↓" onClick={()=>go('funcionalidades')}>Ver cómo funciona</Button>
          </div>
        </div>
        <div style={{position:'relative'}}>
          <img src={A+'brand/somos-partner-badge.png'} alt="Somos Partner — Tiendanube Evolución — App Certified Silver" style={{position:'relative',zIndex:2,display:'block',width:'100%',maxWidth:500,height:'auto',margin:'-85px 0 20px auto'}}/>
          <img src={A+'brand/hero-graphic.png'} alt="" style={{position:'absolute',inset:'-18% -12%',width:'124%',maxWidth:'none',opacity:.85,animation:'g2o-spin 46s linear infinite'}}/>
          <img src={A+'brand/laptop-home-g2o.png'} alt="Plataforma Grow2on" style={{position:'relative',width:'100%',animation:'g2o-hero-float-y 7s ease-in-out infinite',filter:'drop-shadow(0 18px 40px rgba(20,20,40,.18))'}}/>
        </div>
      </Container>
      <Container style={{marginTop:64,position:'relative',zIndex:1}}>
        <Marquee logos={CUSTOMERS}/>
      </Container>
    </Section>
  );
}

function Problem(){
  const items=[
    {img:A+'illustrations/icon-problema-1.png',t:'Carga manual que no escala',d:'Cada nuevo canal significa más horas de trabajo repetido para tu equipo.'},
    {img:A+'illustrations/icon-problema-2.png',t:'Stock que nunca coincide',d:'Vendés de más en un canal y te quedás sin stock en otro. O peor: al revés.'},
    {img:A+'illustrations/icon-problema-3.png',t:'Datos dispersos entre sistemas',d:'ERP, depósitos, proveedores y canales de venta que no se hablan entre sí.'}
  ];
  return (
    <Section background="var(--color-surface-subtle)">
      <Container>
        <h2 style={{margin:'0 0 40px',fontSize:30,fontWeight:600,color:'var(--g2o-black)',maxWidth:620}}>¿Tu equipo pierde horas cargando lo mismo en cada canal?</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
          {items.map(i=>(
            <Card key={i.t} style={{display:'flex',flexDirection:'column',gap:12}}>
              <img src={i.img} alt="" style={{width:'100%',maxWidth:200,height:'auto',objectFit:'contain',flexShrink:0,alignSelf:'flex-start'}}/>
              <h3 style={{margin:0,fontSize:20,fontWeight:600,color:'var(--g2o-black)'}}>{i.t}</h3>
              <p style={{margin:0,fontSize:14,color:'var(--color-text-secondary)'}}>{i.d}</p>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}

function Steps(){
  const steps=[['1','Conectá','Vinculamos tu ERP, tus depósitos y tus canales de venta.'],['2','Centralizá','Toda tu información de producto en un solo lugar.'],['3','Sincronizá','Stock, precios y pedidos se actualizan solos, en tiempo real.'],['4','Vendé más','Tu equipo se enfoca en vender, no en cargar datos.']];
  return (
    <Section>
      <Container>
        <h2 style={{margin:'0 0 40px',fontSize:30,fontWeight:600,color:'var(--g2o-black)',maxWidth:680}}>Con Grow2on, cargá una sola vez y se replica automáticamente.</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24}}>
          {steps.map(([n,t,d],i)=><StepItem key={n} number={n} title={t} body={d} arrow={A+'brand/flecha-pasos.png'} showArrow={i<3}/>)}
        </div>
      </Container>
    </Section>
  );
}

function Features({go}){
  return (
    <Section background="var(--color-surface-subtle)">
      <Container>
        <h2 style={{margin:'0 0 40px',fontSize:30,fontWeight:600,color:'var(--g2o-black)'}}>Todo lo que Grow2on hace por tu negocio</h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
          {FEATURES.map(ft=>(
            <Card key={ft.t} variant="visual">
              <GradientText as="h3" style={{fontSize:22,fontWeight:600,margin:'0 0 6px'}}>{ft.t}</GradientText>
              <p style={{fontSize:14,lineHeight:1.5,color:'var(--color-text-secondary)',margin:0}}>{ft.d}</p>
              <CardVisual src={ft.img}/>
            </Card>
          ))}
        </div>
        <div style={{display:'flex',justifyContent:'center',marginTop:32}}>
          <Button variant="outline" onClick={()=>go('funcionalidades')}>Ver todas las funcionalidades →</Button>
        </div>
      </Container>
    </Section>
  );
}

function Stats(){
  return (
    <Section>
      <Container style={{display:'grid',gridTemplateColumns:'1.4fr 1fr',gap:24}}>
        <StatCard value="400+" label="empresas sincronizando" minHeight={420} style={{gridRow:'1/3'}}>
          <ParticleField count={260}/>
          <ValueChip icon={<img src={A+'platforms/iso-mercadolibre.png'} width="12"/>} style={{position:'absolute',left:'54%',top:'60%'}}>$8.250</ValueChip>
        </StatCard>
        <StatCard value="4.2M" label="de ventas promedio por mes" minHeight={198}>
          <ParticleField count={60}/>
          <BarChart height={96} values={[3,5,4,7,6,9,5,8,6,10,7,9,6,11,8,10,7,12,9,11,8,13,10,12,9,14]}/>
        </StatCard>
        <StatCard value="99.9%" label="SLA" minHeight={198}>
          <ParticleField count={60}/>
          <div style={{display:'flex',justifyContent:'flex-end',alignItems:'flex-end',height:'100%'}}><Gauge value={99.9} size={200} thickness={22}/></div>
        </StatCard>
      </Container>
    </Section>
  );
}

function Hub({go}){
  return (
    <Section background="var(--color-surface-subtle)">
      <Container>
        <h2 style={{margin:'0 0 8px',fontSize:30,fontWeight:600,color:'var(--g2o-black)',textAlign:'center'}}>Conectá con las plataformas que ya usás</h2>
        <p style={{textAlign:'center',margin:'0 0 36px'}}>Mercado Libre, Tiendanube, Shopify y tu ERP, trabajando juntos sin que tengas que tocar una planilla.</p>
        <PlatformHub center={A+'brand/platform-hub-center.png'}
          nodes={PLATFORMS.map(p=>({src:p.src,label:p.name,sub:'Sincronización en tiempo real'}))}/>
        <div style={{display:'flex',justifyContent:'center',marginTop:32}}>
          <Button variant="outline" onClick={()=>go('integraciones')}>Ver todas las integraciones →</Button>
        </div>
      </Container>
    </Section>
  );
}

function Testimonial(){
  return (
    <Section>
      <Container style={{display:'grid',gridTemplateColumns:'.8fr 1.2fr',gap:32,alignItems:'center'}}>
        <StatCard value="80%" label="menos tiempo de gestión" minHeight={150}/>
        <Card style={{padding:32}}>
          <p style={{margin:'0 0 20px',fontSize:20,lineHeight:1.45,color:'var(--g2o-black)'}}>“Grow2on cambió la dinámica de nuestro equipo. Antes necesitábamos 3 personas para mantener el stock actualizado, hoy lo hace el sistema solo.”</p>
          <div style={{display:'flex',alignItems:'center',gap:12}}>
            <img src={A+'brand/ana-martinez.png'} alt="" style={{width:48,height:48,borderRadius:'50%',objectFit:'cover'}}/>
            <div><div style={{fontWeight:600,color:'var(--g2o-black)',fontSize:14}}>Ana Martínez</div><div style={{fontSize:13,color:'var(--color-text-secondary)'}}>Directora de Operaciones, RetailX</div></div>
          </div>
        </Card>
      </Container>
    </Section>
  );
}

function Home({go}){
  return <>
    <Hero go={go}/><Problem/><Steps/><Features go={go}/><Stats/><Hub go={go}/><Testimonial/>
    <Section><Container>
      <CtaBanner title="Dejá de perder tiempo en gestión manual." body="Empezá a centralizar tu catálogo y vender en todos tus canales, sin errores y sin planillas." ctaLabel="Pedí tu consultoría gratis →"/>
    </Container></Section>
  </>;
}

Object.assign(window,{Home});
