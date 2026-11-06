import test from 'node:test';
import assert from 'node:assert/strict';
import {validateSearch,demoOffers,totalFare,dateAfter,normalizeSearch} from '../dist/domain.mjs';
const valid={service:'flights',origin:'ALG',destination:'IST',trip:'round',departure:'2027-04-10',returnDate:'2027-04-17',adults:1,children:0,infants:0,direct:false,baggage:false};
test('booking dates and route constraints',()=>{
 assert.equal(validateSearch(valid,'2027-04-01'),null);
 assert.equal(validateSearch({...valid,destination:'ALG'},'2027-04-01'),'same');
 assert.equal(validateSearch({...valid,departure:'2027-03-31'},'2027-04-01'),'departure');
 assert.equal(validateSearch({...valid,returnDate:'2027-04-10'},'2027-04-01'),'return');
 assert.equal(validateSearch({...valid,trip:'one'},'2027-04-01'),null);
 assert.equal(validateSearch({...valid,destination:'XXX'},'2027-04-01'),'airport');
});
test('reject malformed dates and invalid passenger numbers from URLs',()=>{
 assert.equal(validateSearch({...valid,departure:'2027-02-30'},'2027-01-01'),'departure');
 assert.equal(validateSearch({...valid,departure:'2027-04-10\" autofocus'},'2027-01-01'),'departure');
 assert.equal(validateSearch({...valid,adults:NaN},'2027-01-01'),'travelers');
 assert.equal(validateSearch({...valid,children:-1},'2027-01-01'),'travelers');
 assert.equal(validateSearch({...valid,service:'stays',rooms:99},'2027-01-01'),'travelers');
});
test('multi-city legs are validated',()=>{
 const multi={...valid,trip:'multi',legOrigin:'IST',legDestination:'CDG',legDate:'2027-04-14'};
 assert.equal(validateSearch(multi,'2027-04-01'),null);
 assert.equal(validateSearch({...multi,legDate:'2027-04-09'},'2027-04-01'),'legDate');
 assert.equal(validateSearch({...multi,legDestination:'IST'},'2027-04-01'),'leg');
});
test('traveler constraints and fare totals',()=>{
 assert.equal(validateSearch({...valid,adults:0},'2027-04-01'),'travelers');
 assert.equal(validateSearch({...valid,infants:2},'2027-04-01'),'travelers');
 assert.equal(validateSearch({...valid,adults:8,children:2},'2027-04-01'),'travelers');
 assert.equal(totalFare({price:20000},{...valid,adults:2,children:1,infants:1}),57000);
});
test('example filters never fabricate direct long-haul offers',()=>{
 assert.ok(demoOffers({...valid,direct:true,baggage:true}).every(o=>o.stops===0&&o.baggage));
 assert.equal(demoOffers({...valid,destination:'DPS',direct:true}).length,0);
});
test('calendar arithmetic and URL normalization',()=>{
 assert.equal(dateAfter(1,'2027-12-31'),'2028-01-01');
 assert.equal(dateAfter(1,'2028-02-28'),'2028-02-29');
 assert.equal(normalizeSearch({...valid,adults:'2',direct:'false',baggage:'true'}).direct,false);
 assert.equal(normalizeSearch({...valid,baggage:'true'}).baggage,true);
});
