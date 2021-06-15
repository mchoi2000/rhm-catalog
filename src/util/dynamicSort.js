const dynamicSort = property => {
  var sortOrder = 1;

  if (property[0] === '-') {
    sortOrder = -1;
    property = property.substr(1);
  }

  return (a, b) => {
    if (property === 'startingAtPrice') {
      if (!a.startingAtPrice) a.startingAtPrice = 1000000000;
      if (!b.startingAtPrice) b.startingAtPrice = 1000000000;

      return a.startingAtPrice - b.startingAtPrice;
    } else {
      if (sortOrder === -1)
        return b[property].toString().localeCompare(a[property]);
      return a[property].toString().localeCompare(b[property]);
    }
  };
};

export default dynamicSort;
