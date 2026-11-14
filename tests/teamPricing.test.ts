import test from 'node:test';
import assert from 'node:assert/strict';
import {priceForSlots,proratedProfessionalCents} from '../src/teamPricing';
test('preço promocional separado da mensalidade e da equipe',()=>{
 const p={monthlyPriceCents:3990,firstMonthPriceCents:990,additionalProfessionalCents:1000};
 assert.deepEqual(priceForSlots(p,3,true),{baseCents:990,additionalCents:2000,totalCents:2990,slots:3});
 assert.equal(priceForSlots(p,3).totalCents,5990);
 assert.equal(priceForSlots({...p,firstMonthPriceCents:null},1,true).totalCents,3990);
});
test('adicional proporcional sem ampliar vencimento',()=>{
 const start=new Date('2026-11-01T00:00:00Z'),end=new Date('2026-12-01T00:00:00Z');
 assert.equal(proratedProfessionalCents(1500,new Date('2026-11-16T00:00:00Z'),end,start),750);
 assert.equal(proratedProfessionalCents(1500,start,end,start),1500);
 assert.equal(proratedProfessionalCents(1500,end,end,start),0);
 assert.equal(proratedProfessionalCents(1500,new Date('2026-11-30T23:00:00Z'),end,start),0);
});
