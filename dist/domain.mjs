export const airports=[
  {code:'ALG',city:'Alger',name:'Houari Boumediene',country:'Algérie'},
  {code:'ORN',city:'Oran',name:'Ahmed Ben Bella',country:'Algérie'},
  {code:'CZL',city:'Constantine',name:'Mohamed Boudiaf',country:'Algérie'},
  {code:'AAE',city:'Annaba',name:'Rabah Bitat',country:'Algérie'},
  {code:'BJA',city:'Béjaïa',name:'Abane Ramdane',country:'Algérie'},
  {code:'TLM',city:'Tlemcen',name:'Messali Hadj',country:'Algérie'},
  {code:'CDG',city:'Paris',name:'Charles de Gaulle',country:'France'},
  {code:'ORY',city:'Paris',name:'Orly',country:'France'},
  {code:'MRS',city:'Marseille',name:'Marseille Provence',country:'France'},
  {code:'LYS',city:'Lyon',name:'Saint-Exupéry',country:'France'},
  {code:'NCE',city:'Nice',name:'Côte d’Azur',country:'France'},
  {code:'IST',city:'Istanbul',name:'Istanbul Airport',country:'Turquie'},
  {code:'SAW',city:'Istanbul',name:'Sabiha Gökçen',country:'Turquie'},
  {code:'DXB',city:'Dubaï',name:'Dubai International',country:'Émirats arabes unis'},
  {code:'DPS',city:'Bali',name:'Ngurah Rai',country:'Indonésie'},
  {code:'KUL',city:'Kuala Lumpur',name:'Kuala Lumpur International',country:'Malaisie'},
  {code:'TUN',city:'Tunis',name:'Carthage',country:'Tunisie'},
  {code:'MAD',city:'Madrid',name:'Adolfo Suárez',country:'Espagne'},
  {code:'BCN',city:'Barcelone',name:'El Prat',country:'Espagne'},
  {code:'FCO',city:'Rome',name:'Fiumicino',country:'Italie'},
  {code:'LHR',city:'Londres',name:'Heathrow',country:'Royaume-Uni'},
  {code:'YUL',city:'Montréal',name:'Pierre-Elliott-Trudeau',country:'Canada'},
  {code:'JED',city:'Djeddah',name:'King Abdulaziz',country:'Arabie saoudite'},
  {code:'DOH',city:'Doha',name:'Hamad',country:'Qatar'}
];
export const airport=code=>airports.find(a=>a.code===code);
export const todayISO=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
export function dateAfter(days,from=todayISO()){const d=new Date(`${from}T12:00:00`);d.setDate(d.getDate()+days);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
export function validateSearch(s,today=todayISO()){
  const validDate=d=>typeof d==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&!Number.isNaN(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
  if(!['flights','stays'].includes(s.service)||!['round','one','multi'].includes(s.trip))return 'airport';
  if(!airport(s.destination)||(s.service==='flights'&&!airport(s.origin)))return 'airport';
  if(s.service==='flights'&&s.origin===s.destination)return 'same';
  if(!validDate(s.departure)||s.departure<today)return 'departure';
  if(!validDate(s.returnDate))return 'return';
  if((s.service==='stays'||s.trip==='round')&&s.returnDate<=s.departure)return 'return';
  if(!['adults','children','infants'].every(k=>Number.isInteger(s[k])&&s[k]>=0)||s.adults<1||s.adults+s.children+s.infants>9||s.infants>s.adults)return 'travelers';
  if(s.service==='stays'&&(!Number.isInteger(s.rooms)||s.rooms<1||s.rooms>5))return 'travelers';
  if(s.trip==='multi'&&s.service==='flights'){
    if(!airport(s.legOrigin)||!airport(s.legDestination)||s.legOrigin===s.legDestination)return 'leg';
    if(!validDate(s.legDate)||s.legDate<s.departure)return 'legDate';
  }return null;
}
export function demoOffers(s){
  // Deliberately synthetic examples; these must never be presented as live inventory.
  const far=['DPS','KUL','YUL','DXB','DOH','JED'].includes(s.destination)||['DPS','KUL','YUL','DXB','DOH','JED'].includes(s.origin);
  const round=s.trip==='round'?1.75:s.trip==='multi'?1.9:1;
  const base=Math.round(((far?63000:19500)+(s.destination.charCodeAt(0)%9)*1100)*round/100)*100;
  return [
    {id:'demo-a',departure:'08:30',arrival:far?'18:45':'11:00',duration:far?'10 h 15':'2 h 30',stops:far?1:0,baggage:true,price:base},
    {id:'demo-b',departure:'13:15',arrival:far?'23:30':'15:55',duration:far?'10 h 15':'2 h 40',stops:far?1:0,baggage:false,price:base-3300},
    {id:'demo-c',departure:'17:40',arrival:far?'09:10 +1':'23:10',duration:far?'15 h 30':'5 h 30',stops:1,baggage:true,price:base-1600}
  ].filter(o=>(!s.direct||o.stops===0)&&(!s.baggage||o.baggage));
}
export function totalFare(offer,s){return Math.round(offer.price*(s.adults+s.children*.75+s.infants*.1));}
export function normalizeSearch(raw){const s={...raw};for(const key of ['adults','children','infants','rooms'])s[key]=Number(s[key]);for(const key of ['direct','baggage'])s[key]=s[key]===true||s[key]==='true';return s;}
