import {accountLanguage} from './account-theme.mjs?v=20261111-verification';

const messages={
  fr:{success:'Code accepté dans la démo.',error:'Code incorrect. Réessayez avec le code de démo affiché.',resent:'Un nouveau code de démo est disponible ci-dessous.'},
  en:{success:'Demo code accepted.',error:'Incorrect code. Try the demo code shown below.',resent:'A new demo code is available below.'},
  ar:{success:'قُبل الرمز في الوضع التجريبي.',error:'الرمز غير صحيح. جرّب الرمز التجريبي المعروض أدناه.',resent:'رمز تجريبي جديد متاح أدناه.'}
}[accountLanguage];

const LENGTH=6, RESEND_SECONDS=30;
const form=document.querySelector('#verification-form');
const row=document.querySelector('#code-slots');
const input=document.querySelector('#verification-code');
const status=document.querySelector('#verification-status');
const example=document.querySelector('#verification-example');
const resend=document.querySelector('#verification-resend');
const timer=document.querySelector('#verification-timer');
const next=document.querySelector('#verification-next');
const slots=[...row.querySelectorAll('.code-slot')];
const digits=slots.map(slot=>slot.firstElementChild);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let demoCode=example.textContent.trim();
let verificationTimeout, clearTimeoutId, resendInterval, resendUntil=0;

const numbers=text=>text.normalize('NFKC').replace(/[٠-٩۰-۹]/g,char=>{
  const point=char.charCodeAt(0);
  return String(point-(point<=0x669?0x660:0x6f0));
}).replace(/\D/g,'');

function showMessage(message='',tone=''){
  status.textContent=message;
  status.dataset.tone=tone;
}

function updateCaret(){
  const active=Math.min(input.selectionStart??input.value.length,LENGTH-1);
  slots.forEach((slot,index)=>slot.classList.toggle('is-active',index===active));
}

function paintDigits(){
  let arrival=0;
  digits.forEach((digit,index)=>{
    const char=input.value[index]??'';
    slots[index].classList.toggle('is-filled',Boolean(char));
    if(digit.textContent===char)return;
    digit.getAnimations().forEach(animation=>animation.cancel());
    digit.textContent=char;
    if(char&&!reduced.matches){
      digit.animate([{transform:'translateY(10px) scale(.94)',opacity:0},{transform:'translateY(0) scale(1)',opacity:1}],{
        duration:280,delay:arrival++*20,easing:'cubic-bezier(.23,1,.32,1)',fill:'backwards'
      });
    }
  });
  updateCaret();
}

function verify(){
  clearTimeout(verificationTimeout);
  if(row.dataset.status!=='idle'||input.value.length!==LENGTH)return;
  digits.forEach(digit=>digit.getAnimations().forEach(animation=>animation.cancel()));
  input.readOnly=true;
  if(input.value===demoCode){
    row.dataset.status='success';
    input.removeAttribute('aria-invalid');
    showMessage(messages.success,'success');
    next.hidden=false;
    resend.hidden=true;
    clearInterval(resendInterval);
    return;
  }
  row.dataset.status='error';
  input.setAttribute('aria-invalid','true');
  showMessage(messages.error,'error');
  clearTimeoutId=setTimeout(resetInput,reduced.matches?0:340);
}

function resetInput(){
  clearTimeout(verificationTimeout);
  clearTimeout(clearTimeoutId);
  input.value='';
  input.readOnly=false;
  row.dataset.status='idle';
  paintDigits();
}

function updateCode(){
  if(input.readOnly)return;
  const typed=input.value;
  const cleaned=numbers(typed).slice(0,LENGTH);
  if(typed!==cleaned){
    const caret=Math.min(numbers(typed.slice(0,input.selectionStart??typed.length)).length,LENGTH);
    input.value=cleaned;
    input.setSelectionRange(caret,caret);
  }
  input.removeAttribute('aria-invalid');
  if(status.dataset.tone==='error')showMessage();
  paintDigits();
  clearTimeout(verificationTimeout);
  if(input.value.length===LENGTH){
    verificationTimeout=setTimeout(verify,reduced.matches?0:240);
  }
}

function updateCountdown(){
  const remaining=Math.max(0,Math.ceil((resendUntil-Date.now())/1000));
  resend.disabled=remaining>0;
  timer.textContent=remaining?'('+String(remaining).padStart(2,'0')+' s)':'';
  if(!remaining)clearInterval(resendInterval);
}

input.addEventListener('input',updateCode);
for(const event of ['focus','keyup','select','selectionchange'])input.addEventListener(event,updateCaret);
input.addEventListener('click',event=>{
  if(input.readOnly||event.detail!==1||input.selectionStart!==input.selectionEnd)return;
  const clicked=slots.findIndex(slot=>event.clientX<=slot.getBoundingClientRect().right);
  const offset=Math.min(clicked===-1?LENGTH-1:clicked,input.value.length);
  input.setSelectionRange(offset,Math.min(offset+1,input.value.length));
  updateCaret();
});
input.addEventListener('paste',event=>{
  if(input.readOnly)return;
  const pasted=numbers(event.clipboardData?.getData('text')??'').slice(0,LENGTH);
  event.preventDefault();
  if(!pasted)return;
  const start=pasted.length===LENGTH?0:input.selectionStart??input.value.length;
  const end=pasted.length===LENGTH?input.value.length:input.selectionEnd??start;
  const accepted=pasted.slice(0,LENGTH-(input.value.length-(end-start)));
  input.setRangeText(accepted,start,end,'end');
  updateCode();
});
form.addEventListener('submit',event=>{event.preventDefault();verify();});

resend.addEventListener('click',()=>{
  if(Date.now()<resendUntil||row.dataset.status==='success')return;
  const candidate=String(100000+Math.floor(Math.random()*900000));
  demoCode=candidate!==demoCode?candidate:String(candidate==='999999'?100000:Number(candidate)+1);
  example.textContent=demoCode;
  resetInput();
  input.removeAttribute('aria-invalid');
  showMessage(messages.resent);
  resendUntil=Date.now()+RESEND_SECONDS*1000;
  updateCountdown();
  resendInterval=setInterval(updateCountdown,250);
  input.focus({preventScroll:true});
});

slots.forEach((slot,index)=>slot.style.setProperty('--code-i',index));
updateCode();
