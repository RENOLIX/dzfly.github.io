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
