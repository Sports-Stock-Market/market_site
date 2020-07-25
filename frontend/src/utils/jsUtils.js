// https://coderwall.com/p/_g3x9q/how-to-check-if-javascript-object-is-empty
export function isEmpty(obj) {
  for (let key in obj) {
    if (obj.hasOwnProperty(key))
      return false;
  }
  return true;
}

export function getSampleData(price) {
  let sampleData = {
    '1D': [],
    '1M': [],
    '1W': [],
    'YTD': []
  };
  const nw = new Date(Date.now());
  let beginning_of_day = new Date(nw.getFullYear(), nw.getMonth(), nw.getDate(), 0, 0, 0, 0);
  let beginning_of_year = new Date(nw.getFullYear(), 0, 0, 0, 0, 0, 0);
  let week_ago = new Date(nw.getTime() - (7 * 24 * 60 * 60000));
  let month_ago = new Date(nw.getTime() - (28 * 60 * 60000));
  let newObj;
  while (beginning_of_day <= nw) {
    newObj = {'date': beginning_of_day.toString(), 'price': price};
    sampleData['1D'].push(newObj);
    beginning_of_day = new Date(beginning_of_day.getTime() + (30 * 60000));
  }
  while (beginning_of_year <= nw) {
    newObj = {'date': beginning_of_year.toString(), 'price': price};
    sampleData['YTD'].push(newObj);
    beginning_of_year = new Date(beginning_of_year.getTime() + (7 * 24 * 60 * 60000));
  }
  while (week_ago <= nw) {
    newObj = {'date': week_ago.toString(), 'price': price};
    sampleData['1W'].push(newObj);
    week_ago = new Date(week_ago.getTime() + (24 * 60 * 60000));
  }
  while (month_ago <= nw) {
    newObj = {'date': month_ago.toString(), 'price': price};
    sampleData['1M'].push(newObj);
    month_ago = new Date(month_ago.getTime() + (24 * 60 * 60000));
  }
  return sampleData;
}