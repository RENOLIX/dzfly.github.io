const copy={
  en:{
    sloganOrigin:'An Algerian brand,',sloganAmbition:'an international ambition.',
    back:'Back to home',login:'Sign in',register:'Register',loginTitle:'Sign in',signupTitle:'Create an account',
    loginLead:'Find your itineraries and plan your next departure.',signupLead:'A space to find your itineraries and plan your next trips.',
    lastName:'Last name',firstName:'First name',lastNamePlaceholder:'Your last name',firstNamePlaceholder:'Your first name',
    email:'Email address',phone:'Phone number',password:'Password',submitLogin:'Sign in',preview:'Preview: accounts will be activated soon.',
    already:'Already have an account?',newHere:'New to DZ FLY?',emailExample:'you@example.com',navLabel:'Traveller account',
    signupPreview:'Preview: this button opens the verification demo. No account will be created.',
    backToSignup:'Back to registration',verificationStep:'Registration · Step 2 of 2',verificationTitle:'Verify my email',
    verificationLead:'Enter the six-digit code. It will be checked automatically.',verificationLabel:'Six-digit code',
    verificationDemo:'Demo mode · No email sent',verificationTry:'Try this code:',verificationResend:'Resend code',verificationNext:'Continue to sign in'
  },
  ar:{
    sloganOrigin:'علامة جزائرية،',sloganAmbition:'بطموح عالمي.',
    back:'العودة إلى الصفحة الرئيسية',login:'تسجيل الدخول',register:'التسجيل',loginTitle:'تسجيل الدخول',signupTitle:'إنشاء حساب',
    loginLead:'اعثر على مساراتك وخطّط لرحلتك القادمة.',signupLead:'مساحة للاطلاع على مساراتك والتخطيط لرحلاتك القادمة.',
    lastName:'اللقب',firstName:'الاسم',lastNamePlaceholder:'لقبك',firstNamePlaceholder:'اسمك',
    email:'البريد الإلكتروني',phone:'رقم الهاتف',password:'كلمة المرور',submitLogin:'تسجيل الدخول',preview:'معاينة: ستُفعّل الحسابات قريبًا.',
    already:'هل لديك حساب؟',newHere:'هل أنت جديد على DZ FLY؟',emailExample:'you@example.com',navLabel:'حساب المسافر',
    signupPreview:'معاينة: يفتح الزر تجربة التحقق. لن يُنشأ أي حساب.',
    backToSignup:'العودة إلى التسجيل',verificationStep:'التسجيل · الخطوة ٢ من ٢',verificationTitle:'التحقق من بريدي الإلكتروني',
    verificationLead:'أدخل الرمز المكوّن من ستة أرقام. سيُتحقق منه تلقائيًا.',verificationLabel:'رمز من ستة أرقام',
    verificationDemo:'وضع تجريبي · لم يُرسل أي بريد',verificationTry:'جرّب هذا الرمز:',verificationResend:'إعادة إرسال الرمز',verificationNext:'متابعة تسجيل الدخول'
  }
};
let lang='fr';
try{lang=JSON.parse(localStorage.getItem('dzfly-language'))||'fr';}catch{}
export const accountLanguage=lang==='en'||lang==='ar'?lang:'fr';
if(accountLanguage!=='fr'){
  const translation=copy[accountLanguage];
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==='ar'?'rtl':'ltr';
  for(const node of document.querySelectorAll('[data-copy]')){
    if(translation[node.dataset.copy])node.textContent=translation[node.dataset.copy];
  }
  for(const input of document.querySelectorAll('[data-placeholder]')){
    if(translation[input.dataset.placeholder])input.placeholder=translation[input.dataset.placeholder];
  }
  document.querySelector('.account-tabs')?.setAttribute('aria-label',translation.navLabel);
  document.querySelector('.account-brand').setAttribute('aria-label','DZ FLY — '+translation.back);
  const email=document.querySelector('#account-email');
  if(email)email.placeholder=translation.emailExample;
  document.title=document.querySelector('#account-title').textContent+' — DZ FLY';
}
