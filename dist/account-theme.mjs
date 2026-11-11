const copy={
  en:{
    sloganOrigin:'An Algerian brand,',sloganAmbition:'an international ambition.',
    back:'Back to home',login:'Sign in',register:'Register',loginTitle:'Sign in',signupTitle:'Create an account',
    loginLead:'Find your itineraries and plan your next departure.',signupLead:'A space to find your itineraries and plan your next trips.',
    lastName:'Last name',firstName:'First name',lastNamePlaceholder:'Your last name',firstNamePlaceholder:'Your first name',
    email:'Email address',phone:'Phone number',password:'Password',submitLogin:'Sign in',preview:'Preview: accounts will be activated soon.',
    already:'Already have an account?',newHere:'New to DZ FLY?',emailExample:'you@example.com',navLabel:'Traveller account',
    signupClosed:'Registration is not open yet.'
  },
  ar:{
    sloganOrigin:'علامة جزائرية،',sloganAmbition:'بطموح عالمي.',
    back:'العودة إلى الصفحة الرئيسية',login:'تسجيل الدخول',register:'التسجيل',loginTitle:'تسجيل الدخول',signupTitle:'إنشاء حساب',
    loginLead:'اعثر على مساراتك وخطّط لرحلتك القادمة.',signupLead:'مساحة للاطلاع على مساراتك والتخطيط لرحلاتك القادمة.',
    lastName:'اللقب',firstName:'الاسم',lastNamePlaceholder:'لقبك',firstNamePlaceholder:'اسمك',
    email:'البريد الإلكتروني',phone:'رقم الهاتف',password:'كلمة المرور',submitLogin:'تسجيل الدخول',preview:'معاينة: ستُفعّل الحسابات قريبًا.',
    already:'هل لديك حساب؟',newHere:'هل أنت جديد على DZ FLY؟',emailExample:'you@example.com',navLabel:'حساب المسافر',
    signupClosed:'التسجيل غير متاح حاليًا.'
  }
};
const accountTabs=document.querySelector('.account-tabs');
let lang='fr';
try{lang=JSON.parse(localStorage.getItem('dzfly-language'))||'fr';}catch{}
if(lang==='en'||lang==='ar'){
  const translation=copy[lang];
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  for(const node of document.querySelectorAll('[data-copy]')){
    if(translation[node.dataset.copy])node.textContent=translation[node.dataset.copy];
  }
  for(const input of document.querySelectorAll('[data-placeholder]')){
    if(translation[input.dataset.placeholder])input.placeholder=translation[input.dataset.placeholder];
  }
  accountTabs?.setAttribute('aria-label',translation.navLabel);
  document.querySelector('.account-brand').setAttribute('aria-label','DZ FLY — '+translation.back);
  const email=document.querySelector('#account-email');
  if(email)email.placeholder=translation.emailExample;
  document.title=document.querySelector('#account-title').textContent+' — DZ FLY';
}

const otherAccountTab=accountTabs?.querySelector('a:not([aria-current])');
if(document.referrer&&otherAccountTab){
  const previousPage=new URL(document.referrer);
  const otherPage=new URL(otherAccountTab.href);
  if(previousPage.origin===otherPage.origin&&previousPage.pathname===otherPage.pathname){
    accountTabs.classList.add('is-switching');
  }
}
