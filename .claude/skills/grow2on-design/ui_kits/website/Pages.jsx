const {Button,Card,GradientText,Container,Section,CloudBackground,IntegrationTile,IntegrationPill,FilterBar,Accordion,HoverCard,CtaBanner,BlogCard,Select,Marquee,StatCard,StepItem,SpeckleEdge}=window.Grow2onDesignSystem_f54f37;

function Integraciones(){
  const [cat,setCat]=React.useState('Todas');
  const total=INT_CATS.reduce((n,c)=>n+c.ids.length,0);
  const opts=[{label:'Todas',count:total},...INT_CATS.map(c=>({label:c.key==='eCommerce'?'Plataformas de E-commerce':c.key,count:c.ids.length}))];
  const match=c=>cat==='Todas'||cat===(c.key==='eCommerce'?'Plataformas de E-commerce':c.key);
  return <>
    <Section style={{overflow:'hidden'}}>
      <CloudBackground opacity={.35}/>
      <Container style={{position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'1.05fr .95fr',gap:48,alignItems:'center'}}>
        <div>
          <img src={A+'brand/somos-partner-badge.png'} alt="" style={{width:'100%',maxWidth:320,marginBottom:18}}/>
          <h1 style={{margin:'0 0 16px',fontSize:44,fontWeight:600,lineHeight:1.15,color:'var(--g2o-black)'}}>Conectá con las <GradientText>plataformas que ya usás.</GradientText></h1>
          <p style={{margin:0,fontSize:18,lineHeight:1.5}}>Grow2on se conecta a tu ERP, tu ecommerce y tus marketplaces para mantener todo sincronizado, sin integraciones a medida ni desarrollo extra.</p>
        </div>
        <img src={A+'brand/hero-graphic-integraciones.png'} alt="" style={{width:'100%',animation:'g2o-hero-float-y 7s ease-in-out infinite'}}/>
      </Container>
      <Container style={{marginTop:40,position:'relative',zIndex:1}}><Marquee grayscale={false} height={40} logos={INT_MARQUEE}/></Container>
    </Section>
    <Section tight><Container><FilterBar options={opts} value={cat} onChange={setCat}/></Container></Section>
    {INT_CATS.filter(match).map(c=>(
      <Section key={c.key} tight><Container>
        <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:28}}>
          <img src={A+'illustrations/'+c.icon} alt="" style={{height:68,width:'auto',objectFit:'contain',flexShrink:0}}/>
          <div>
            <div style={{fontSize:12,color:'var(--g2o-pink)',fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',marginBottom:8}}>{c.eyebrow}</div>
            <h2 style={{fontSize:30,margin:0,fontWeight:600,color:'var(--color-text-primary)'}}>{c.heading}</h2>
          </div>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(6,1fr)',gap:20}}>
          {c.ids.map(id=><IntegrationTile key={id} src={intSrc(id)} alt={INT_NAMES[id]}/>)}
        </div>
      </Container></Section>
    ))}
    <Section><Container>
      <CtaBanner title="¿No ves tu plataforma en la lista?" body="Contanos qué sistema usás y evaluamos la integración a tu medida." ctaLabel="Contanos tu caso"/>
    </Container></Section>
  </>;
}

function Funcionalidades(){
  return <>
    <Section style={{overflow:'hidden'}}>
      <CloudBackground opacity={.35}/>
      <Container style={{position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
        <div>
          <img src={A+'brand/somos-partner-badge.png'} alt="Somos Partner — Tiendanube Evolución" style={{width:'100%',maxWidth:320,marginBottom:18}}/>
          <h1 style={{margin:'0 0 16px',fontSize:44,fontWeight:600,lineHeight:1.15,color:'var(--g2o-black)'}}>Todo lo que necesitás para <GradientText>centralizar y sincronizar</GradientText> tu catálogo</h1>
          <p style={{margin:'0 0 28px',fontSize:18,lineHeight:1.5}}>Cada vez hay más canales donde vender, y eso significa más oportunidades, pero también más complejidad. Grow2on centraliza tu catálogo (venga de tu ERP, tu ecommerce o cualquier otra fuente) y lo mantiene sincronizado en todos tus canales, sin trabajo manual.</p>
          <Button>Pedí tu demo gratis</Button>
        </div>
        <img src={A+'brand/hero-graphic-funcionalidades.png'} alt="" style={{width:'100%',animation:'g2o-hero-float-y 7s ease-in-out infinite'}}/>
      </Container>
    </Section>
    <Section tight style={{position:'relative',overflow:'hidden'}}><SpeckleEdge edges={['left','right']} count={220} spread={20}/><Container style={{maxWidth:820,position:'relative',zIndex:1}}>
      <p style={{fontSize:18,lineHeight:1.5,margin:'0 0 12px'}}>La gestión manual de catálogo no escala. Cada canal nuevo, cada publicación, cada cambio de precio, multiplica el trabajo de tu equipo y el margen de error.</p>
      <p style={{fontSize:18,lineHeight:1.5,margin:0,color:'var(--g2o-black)',fontWeight:600}}>Así resuelve Grow2on cada parte de ese proceso:</p>
    </Container></Section>
    <Section><Container>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24}}>
        {FUNC_DETAIL.map(ft=>(
          <Card key={ft.t} variant="fx">
            <GradientText as="h3" style={{fontSize:22,fontWeight:600,margin:'0 0 6px'}}>{ft.t}</GradientText>
            {ft.lead&&<p style={{margin:'0 0 8px',fontSize:15,fontWeight:600,color:'var(--g2o-black)'}}>{ft.lead}</p>}
            <p style={{margin:0,fontSize:14,lineHeight:1.5,color:'var(--color-text-secondary)'}}>{ft.d}</p>
          </Card>
        ))}
      </div>
    </Container></Section>
    <Section background="var(--color-surface-subtle)"><Container>
      <h2 style={{margin:'0 0 32px',fontSize:30,fontWeight:600,color:'var(--g2o-black)'}}>Funcionalidades Extras</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:24}}>
        {FUNC_EXTRAS.map(x=>(
          <Card key={x.t}>
            <div style={{display:'flex',marginBottom:14}}>
              {x.isos.map((i,n)=><span key={i+n} style={{width:36,height:36,borderRadius:7,background:'#fff',border:'1px solid var(--color-border-default)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',padding:3,marginLeft:n?-6:0,flexShrink:0}}><img src={A+'platforms/iso-'+i+'.png'} alt="" style={{maxWidth:'100%',maxHeight:'100%',objectFit:'contain'}}/></span>)}
            </div>
            <h3 style={{margin:'0 0 8px',fontSize:20,fontWeight:600,color:'var(--g2o-black)'}}>{x.t}</h3>
            <p style={{margin:'0 0 12px',fontSize:14,lineHeight:1.5,color:'var(--color-text-secondary)'}}>{x.d}</p>
            <ul style={{margin:0,padding:0,listStyle:'none',display:'grid',gap:6}}>
              {x.bullets.map(b=><li key={b} style={{fontSize:14,color:'var(--color-text-secondary)',display:'flex',gap:8}}><span style={{color:'var(--g2o-pink)',fontWeight:700}}>✓</span>{b}</li>)}
            </ul>
          </Card>
        ))}
      </div>
    </Container></Section>
    <Section><Container>
      <CtaBanner title="¿Querés ver estas funcionalidades en acción?" body="Pedí una demo gratuita y te mostramos cómo Grow2on se adapta a la forma en que ya trabajás." ctaLabel="Pedí tu demo gratis →"/>
    </Container></Section>
  </>;
}

function Blog(){
  const [feat,...rest]=POSTS;
  return <>
    <Section><Container>
      <h1 style={{margin:'0 0 8px',fontSize:44,fontWeight:600,lineHeight:1.15,color:'var(--g2o-black)'}}>Blog</h1>
      <p style={{margin:'0 0 40px',fontSize:18}}>Noticias sobre ecommerce y gestión multicanal.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'48px 32px'}}>
        <BlogCard style={{gridColumn:'span 3'}} {...feat}/>
        {rest.map(p=><BlogCard key={p.title} {...p}/>)}
      </div>
      <div style={{display:'flex',justifyContent:'center',marginTop:40}}><Button variant="outline">Siguientes →</Button></div>
    </Container></Section>
    <Section background="var(--color-surface-subtle)"><Container>
      <Marquee logos={CUSTOMERS}/>
    </Container></Section>
  </>;
}

function Hablemos(){
  const [sent,setSent]=React.useState(false);
  return (
    <Section style={{overflow:'hidden'}}>
      <CloudBackground opacity={.35}/>
      <Container style={{position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
        <div>
          <img src={A+'brand/hero-graphic.png'} alt="" style={{width:'70%',maxWidth:320,opacity:.9,animation:'g2o-spin 46s linear infinite',marginBottom:18}}/>
          <h2 style={{margin:'0 0 14px',fontSize:30,fontWeight:600,color:'var(--g2o-black)'}}>Arrancá ahora.</h2>
          <p style={{margin:'0 0 10px',fontSize:18,fontWeight:600,color:'var(--g2o-black)'}}>Centralizá tus canales de venta y eliminá la carga manual con Grow2on.</p>
          <p style={{margin:0}}>Completá el formulario y nos pondremos en contacto a la brevedad.</p>
        </div>
        <Card style={{padding:32}}>
          {sent
            ? <div style={{textAlign:'center',padding:'40px 0'}}>
                <GradientText style={{fontSize:30,fontWeight:700}}>¡Gracias!</GradientText>
                <p style={{marginTop:12}}>Nos pondremos en contacto a la brevedad.</p>
                <Button variant="outline" style={{marginTop:16}} onClick={()=>setSent(false)}>Volver al formulario</Button>
              </div>
            : <div style={{display:'grid',gap:20}}>
                <Select label="País" required options={['Argentina','México','España']} placeholder="Selecciona tu país"/>
                <Select label="Servicio que desea contratar" required options={HABLEMOS_SERVICIOS} placeholder="¿Qué necesitás integrar?"/>
                <Button onClick={()=>setSent(true)}>Enviar</Button>
              </div>}
        </Card>
      </Container>
    </Section>
  );
}

function Erp(){
  return <>
    <Section style={{overflow:'hidden'}}>
      <CloudBackground opacity={.35}/>
      <Container style={{position:'relative',zIndex:1,display:'grid',gridTemplateColumns:'1fr 1fr',gap:48,alignItems:'center'}}>
        <div>
          <img src={A+'brand/somos-partner-badge.png'} alt="" style={{width:'100%',maxWidth:320,marginBottom:18}}/>
          <h1 style={{margin:'0 0 16px',fontSize:44,fontWeight:600,lineHeight:1.15,color:'var(--g2o-black)'}}>Un conector de eCommerce Multicanal para tu ERP <GradientText>con tu marca propia</GradientText></h1>
          <p style={{margin:'0 0 28px',fontSize:18}}>Haz crecer tu negocio y ofrece más valor a tus clientes sin escribir una línea de código.</p>
          <Button iconRight="→">Conoce cómo</Button>
        </div>
        <img src={A+'illustrations/sos-erp-icon-hero.png'} alt="" style={{width:'100%',animation:'g2o-hero-float-y 7s ease-in-out infinite'}}/>
      </Container>
    </Section>
    <Section tight><Container style={{textAlign:'center',maxWidth:760}}>
      <h2 style={{margin:'0 0 20px',fontSize:30,fontWeight:600,color:'var(--g2o-black)'}}>Ofrece a tus clientes un Conector Multicanal. Sincroniza y potencia su mundo online.</h2>
      <Button variant="outline" iconRight="→">Más información</Button>
    </Container></Section>
    <Section><Container>
      <h2 style={{margin:'0 0 8px',fontSize:30,fontWeight:600,color:'var(--g2o-black)'}}>Conecta</h2>
      <p style={{margin:'0 0 32px'}}>Grow2on integra el negocio offline con el online en sitios B2C y B2B.</p>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:24}}>
        {ERP_PILLARS.map(p=>(
          <Card key={p.t}>
            <img src={A+'illustrations/'+p.icon} alt="" style={{height:72,width:'auto',marginBottom:12}}/>
            <h3 style={{margin:'0 0 6px',fontSize:20,fontWeight:600,color:'var(--g2o-black)'}}>{p.t}</h3>
            <p style={{margin:0,fontSize:14,lineHeight:1.5,color:'var(--color-text-secondary)'}}>{p.d}</p>
          </Card>
        ))}
      </div>
    </Container></Section>
    <Section background="var(--color-surface-subtle)"><Container>
      <h2 style={{margin:'0 0 8px',fontSize:30,fontWeight:600,color:'var(--g2o-black)'}}>Sincroniza</h2>
      <p style={{margin:'0 0 28px',maxWidth:720}}>Podrás ofrecer a tus clientes conexión a las principales plataformas y Marketplaces del mercado para simplificarles la gestión de su negocio online y ayudarlos a vender más.</p>
      <div style={{fontSize:12,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:'var(--g2o-pink)',marginBottom:14}}>Canales</div>
      <Marquee grayscale={false} height={44} logos={PLATFORMS.slice(0,11).map(p=>p.src)}/>
    </Container></Section>
    <Section><Container>
      <h2 style={{margin:'0 0 8px',fontSize:30,fontWeight:600,color:'var(--g2o-black)'}}>Potencia</h2>
      <p style={{margin:'0 0 28px'}}>Fideliza a tus clientes con soluciones que responden a las demandas del mercado actual.</p>
      <img src={A+'brand/sos-erp-video-poster.png'} alt="" style={{width:'100%',borderRadius:16,border:'1px solid var(--color-border-default)'}}/>
    </Container></Section>
    <Section background="var(--color-surface-subtle)"><Container>
      <h2 style={{margin:'0 0 40px',fontSize:30,fontWeight:600,color:'var(--g2o-black)'}}>Cómo implementamos Grow2on como Marca Blanca</h2>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:24}}>
        {ERP_STEPS.map(([n,t,d],i)=><StepItem key={n} number={n} title={t} body={d} arrow={A+'brand/flecha-pasos.png'} showArrow={i<3}/>)}
      </div>
    </Container></Section>
    <Section><Container style={{textAlign:'center'}}>
      <h2 style={{margin:'0 0 32px',fontSize:30,fontWeight:600,color:'var(--g2o-black)'}}>¡Animate a crecer más!</h2>
      <div style={{display:'flex',gap:24,justifyContent:'center',marginBottom:32,flexWrap:'wrap'}}>
        {[['sos-erp-icon-ahorro-tiempo.png','Ahorra tiempo'],['sos-erp-icon-error-humano.png','Evita error humano'],['sos-erp-icon-multicanalidad.png','Multicanalidad']].map(([i,t])=>
          <div key={t} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:10,width:180}}>
            <img src={A+'illustrations/'+i} alt="" style={{height:72,width:'auto'}}/>
            <span style={{fontSize:16,fontWeight:600,color:'var(--g2o-black)'}}>{t}</span>
          </div>)}
      </div>
      <Button iconRight="→">Agendá una reunión</Button>
    </Container></Section>
  </>;
}

Object.assign(window,{Integraciones,Funcionalidades,Blog,Hablemos,Erp});
