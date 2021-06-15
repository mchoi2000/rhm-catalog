import prodData1 from '../data/products/1.json';
import prodData2 from '../data/products/2.json';
import prodData3 from '../data/products/3.json';

let p1 = prodData1.data.allProducts.products;
let p2 = prodData2.data.allProducts.products;
let p3 = prodData3.data.allProducts.products;

const allItems = [...p1, ...p2, ...p3];

export const GetProducts = () => {
  const products = allItems.filter(
    i => i.primaryCategory.categoryPageName !== 'datasets'
  );

  return [products, products.length, allItems.length];
};

export const GetDatasets = () => {
  const datasets = allItems.filter(
    i => i.primaryCategory.categoryPageName === 'datasets'
  );

  return [datasets];
};
