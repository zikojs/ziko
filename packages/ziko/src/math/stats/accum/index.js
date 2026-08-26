export const accum_sum = (arr) => {
  let result = [];
  let total = 0;
  for (let x of arr) {
    total += x;
    result.push(total);
  }
  return result;
};

export const accum_product = (arr) => {
  let result = [];
  let prod = 1;
  for (let x of arr) {
    prod *= x;
    result.push(prod);
  }
  return result;
};

export const accum_max = (arr) => {
  let result = [];
  let m = -Infinity;
  for (let x of arr) {
    m = Math.max(m, x);
    result.push(m);
  }
  return result;
};

export const accum_min = (arr) => {
  let result = [];
  let m = Infinity;
  for (let x of arr) {
    m = Math.min(m, x);
    result.push(m);
  }
  return result;
};