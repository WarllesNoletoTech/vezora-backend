/** Cálculos comerciais puros: todas as quantias são centavos inteiros. */
export type Pricing = {
  monthlyPriceCents: number;
  firstMonthPriceCents: number | null;
  additionalProfessionalCents: number;
};
export function priceForSlots(pricing:Pricing,slots:number,firstMonth=false) {
  if (!Number.isSafeInteger(slots)||slots<1||slots>500) throw new Error('Quantidade de profissionais inválida');
  const base=firstMonth ? (pricing.firstMonthPriceCents ?? pricing.monthlyPriceCents) : pricing.monthlyPriceCents;
  const extras=(slots-1)*pricing.additionalProfessionalCents;
  if(!Number.isSafeInteger(base+extras)||base<0||extras<0)throw new Error('Preço de assinatura inválido');
  return {baseCents:base,additionalCents:extras,totalCents:base+extras,slots};
}
/** Resto de ciclo de até 30 dias; 1º minuto pago proporcionalmente, arredondado ao centavo.
 * Se o valor ficar abaixo de R$1 (mínimo operacional do Pix), oferece o restante
 * do período sem cobrança adicional e passa a contar o profissional na renovação.
 */
export function proratedProfessionalCents(monthlyCents:number,now:Date,expiresAt:Date,cycleStartAt?:Date|null){
  if(!Number.isSafeInteger(monthlyCents)||monthlyCents<0)throw new Error('Adicional inválido');
  const remaining=expiresAt.getTime()-now.getTime();
  if(!Number.isFinite(remaining)||remaining<=0||monthlyCents===0)return 0;
  const maxDuration=30*86400000;
  const actualDuration=cycleStartAt ? expiresAt.getTime()-cycleStartAt.getTime() : maxDuration;
  const period=Math.max(1,Math.min(Math.max(1,actualDuration),maxDuration));
  const cents=Math.min(monthlyCents,Math.ceil(monthlyCents*Math.min(remaining,period)/period));
  return cents<100?0:cents;
}
