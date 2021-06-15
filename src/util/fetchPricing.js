import pricingData1 from '../data/pricing/1.json';
import pricingData2 from '../data/pricing/2.json';
import pricingData3 from '../data/pricing/3.json';
import pricingData4 from '../data/pricing/4.json';
import pricingData5 from '../data/pricing/5.json';

let p1 = pricingData1.editions;
let p2 = pricingData2.editions;
let p3 = pricingData3.editions;
let p4 = pricingData4.editions;
let p5 = pricingData5.editions;

const allItems = [...p1, ...p2, ...p3, ...p4, ...p5];

export const GetPricing = () => {
  return allItems;
};
