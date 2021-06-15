import { GetProducts } from './fetchCatalog.js';

const products = GetProducts()[0];

export const total = () => GetProducts()[2];

export const Editions = () => {
  const editionBinaryCount = [0, 0]; // [no, yes]
  for (let prod of products) {
    let editions = prod.editions.filter(
      e => e.publishedEditionContent !== null
    );
    editions.length > 0 ? editionBinaryCount[0]++ : editionBinaryCount[1]++;
  }

  return editionBinaryCount;
};

export const EditionsDetail = () => {
  const editionCount = [0, 0, 0]; //count per type [buy & try, buy, try]

  for (let prod of products) {
    const editionTypes = []; // ["TRIAL", "PURCHASE", "FREE"]
    const editions = prod.editions.filter(
      e => e.publishedEditionContent !== null
    );

    if (editions.length > 0) {
      for (let edition of editions) {
        const type = edition.publishedEditionContent.planType;
        if (editionTypes.indexOf(type) === -1) editionTypes.push(type);
      }
    }

    // [2] Try only, [1] Buy only
    if (editionTypes.length === 1) {
      const editionValue = editionTypes[0];
      editionValue.indexOf('FREE') > -1 || editionValue.indexOf('TRIAL') > -1
        ? editionCount[2]++
        : editionCount[1]++;
    }
    // [0] Buy & Try
    else if (editionTypes.length > 1) {
      editionTypes.indexOf('FREE') > -1 &&
      editionTypes.indexOf('FREE_TRIAL') > -1
        ? editionCount[2]++
        : editionCount[0]++;
    }
  }

  return editionCount;
};

export const Categories = () => {
  const primCategory = products.map(prod =>
    prod.primaryCategory ? prod.primaryCategory.content.name : 'N/A'
  );
  const allCategories = products.map(prod => prod.categories);

  const allCatNames = [];
  for (let catSet of allCategories) {
    // console.log(catSet);
    for (let cat of catSet) {
      const c = cat.content.name;
      if (allCatNames.indexOf(c) === -1) allCatNames.push(c);
    }
  }

  allCatNames.sort();

  const primCount = [];
  const secoCount = [];
  for (let c of allCatNames) {
    primCount[c] = 0;
    secoCount[c] = 0;
  }

  for (let p of primCategory) {
    primCount[p]++;
  }

  for (let i = 0; i < allCategories.length; i++) {
    for (let cat of allCategories[i]) {
      const c = cat.content.name;
      if (c !== primCategory[i]) secoCount[c]++;
    }
  }

  const pset = [];
  const sset = [];

  for (let i = 0; i < allCatNames.length; i++) {
    pset.push(primCount[allCatNames[i]]);
    sset.push(secoCount[allCatNames[i]]);
  }

  return [allCatNames, pset, sset];
};

export const Levels = () => {
  const levels = new Array(5).fill(0);
  for (let prod of products) {
    const editions =
      prod.editions &&
      prod.editions.filter(
        e =>
          e.publishedEditionContent &&
          (e.publishedEditionContent.packageType !== 'DOWNLOAD' ||
            e.publishedEditionContent.packageType !== 'SAAS')
      );

    if (editions.length > 0) {
      const certification = editions[0].publishedEditionContent.certification;
      const oprlevel = certification && certification.operatorCapabilities;

      levels[oprlevel - 1]++;
    }
  }
  // console.log(levels);
  return levels;
};
