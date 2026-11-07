import Lenis from './vendor/lenis.mjs';

const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
let scrolling;
function configureScrolling(){
  scrolling?.destroy();
  scrolling=null;
  if(reducedMotion.matches)return;
  scrolling=new Lenis({
    autoRaf:true,
    smoothWheel:true,
    lerp:0.085,
    wheelMultiplier:0.9,
    syncTouch:false,
    anchors:false,
    allowNestedScroll:true,
    prevent:node=>Boolean(node.closest?.('dialog'))||node.tagName==='SELECT'
  });
}
configureScrolling();
reducedMotion.addEventListener('change',configureScrolling);

document.addEventListener('click',event=>{
  const anchor=event.target.closest?.('a[href^="#"]');
  if(!anchor||event.defaultPrevented||event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
  const hash=anchor.getAttribute('href');
  if(!hash||hash==='#')return;
  const target=document.getElementById(hash.slice(1));
  if(!target)return;
  event.preventDefault();
  scrollToElement(target);
  history.replaceState(null,'',hash);
});

export function settleScroll(){scrolling?.scrollTo(scrollY,{immediate:true});}

export function scrollToElement(target,{block='start'}={}){
  const element=typeof target==='string'?document.querySelector(target):target;
  if(!element)return;
  const rect=element.getBoundingClientRect();
  const offset=block==='center'?Math.max(24,(innerHeight-rect.height)/2):24;
  const top=Math.max(0,scrollY+rect.top-offset);
  if(scrolling){scrolling.resize();scrolling.scrollTo(top,{duration:1.1});}
  else window.scrollTo({top,behavior:'instant'});
}

export function animateSearchFields(element){
  element.getAnimations().forEach(animation=>animation.cancel());
  if(!reducedMotion.matches)element.animate(
    [{opacity:0,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],
    {duration:420,easing:'cubic-bezier(.22,1,.36,1)'}
  );
}

// Scroll-linked, reversible shades. Cards in the same row share their progress.
// Native touch scrolling and Lenis both emit scroll events; no scroll hijacking.
const destinationGrid=document.querySelector('.destination-grid');
if(destinationGrid){
  const windows=[...destinationGrid.querySelectorAll('.destination-window')].map(element=>({element,progress:null}));
  let frame=0;
  let previousTime=0;
  const clamp=value=>Math.min(1,Math.max(0,value));
  function drawWindows(time){
    frame=0;
    const elapsed=previousTime?Math.min(time-previousTime,64):16.67;
    previousTime=time;
    const blend=1-Math.exp(-elapsed/70);
    const viewportHeight=document.documentElement.clientHeight;
    // Read all geometry before applying transforms, avoiding layout thrashing.
    const targets=windows.map(({element})=>reducedMotion.matches?1:clamp(
      (viewportHeight*.94-element.getBoundingClientRect().top)/(viewportHeight*.66)
    ));
    let moving=false;
    windows.forEach((window,index)=>{
      const target=targets[index];
      window.progress=window.progress===null||reducedMotion.matches?target:window.progress+(target-window.progress)*blend;
      if(Math.abs(target-window.progress)<.0005)window.progress=target;
      else moving=true;
      window.element.style.setProperty('--window-open',window.progress.toFixed(5));
    });
    if(moving)frame=requestAnimationFrame(drawWindows);
    else previousTime=0;
  }
  function requestWindowFrame(){if(!frame)frame=requestAnimationFrame(drawWindows);}
  addEventListener('scroll',requestWindowFrame,{passive:true});
  addEventListener('resize',requestWindowFrame,{passive:true});
  addEventListener('pageshow',requestWindowFrame);
  reducedMotion.addEventListener('change',requestWindowFrame);
  new ResizeObserver(requestWindowFrame).observe(document.body);
  requestWindowFrame();
}

// The aircraft travels from right to left as the invitation enters the viewport.
const takeoff=document.querySelector('.takeoff');
if(takeoff){
  const scene=takeoff.querySelector('.takeoff-scene');
  const flight=takeoff.querySelector('.takeoff-flight');
  let flightFrame=0;
  let flightProgress=null;
  let flightTime=0;
  function drawFlight(time){
    flightFrame=0;
    const rect=scene.getBoundingClientRect();
    const viewportHeight=document.documentElement.clientHeight;
    const target=reducedMotion.matches?1:Math.min(1,Math.max(0,
      (viewportHeight*.97-rect.top)/(viewportHeight*.55)
    ));
    const elapsed=flightTime?Math.min(time-flightTime,64):16.67;
    flightTime=time;
    flightProgress=flightProgress===null||reducedMotion.matches?target:flightProgress+(target-flightProgress)*(1-Math.exp(-elapsed/85));
    const moving=Math.abs(target-flightProgress)>.0005;
    if(!moving)flightProgress=target;
    flight.style.setProperty('--takeoff-x',((1-flightProgress)*Math.max(320,rect.width*.56)).toFixed(2)+'px');
    if(moving)flightFrame=requestAnimationFrame(drawFlight);
    else flightTime=0;
  }
  function requestFlightFrame(){if(!flightFrame)flightFrame=requestAnimationFrame(drawFlight);}
  new IntersectionObserver(([entry])=>{
    takeoff.classList.toggle('is-in-view',entry.isIntersecting&&!reducedMotion.matches);
    requestFlightFrame();
  },{rootMargin:'40px'}).observe(takeoff);
  reducedMotion.addEventListener('change',()=>{
    const rect=takeoff.getBoundingClientRect();
    takeoff.classList.toggle('is-in-view',!reducedMotion.matches&&rect.bottom>0&&rect.top<innerHeight);
    requestFlightFrame();
  });
  addEventListener('scroll',requestFlightFrame,{passive:true});
  addEventListener('resize',requestFlightFrame,{passive:true});
  addEventListener('pageshow',requestFlightFrame);
  new ResizeObserver(requestFlightFrame).observe(document.body);
  requestFlightFrame();
}
