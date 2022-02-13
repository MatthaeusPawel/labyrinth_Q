export function argmax(arr){
  if (arr.length === 0) 
    return undefined;

  return arr.reduce( (pre, curr,  i, arr) => curr > arr[pre]? i : pre, 0);
}


export function quantize(x, xmin, xmax, count){
  if (x == xmax)
    return count-1;

  return Math.floor(count*(x - xmin)/(xmax - xmin));
}

export function distance2( arr, arr2 ){
  if (arr.length !== arr2.length)
    throw TypeError('distance2 requires equally-sized arrays');

  return arr.map( (el, i) => (el-arr2[i])**2)
            .reduce( (pre, cur) => pre+cur, 0);
}

export function getRandomNumber(low, upper, rnd = Math.random()){
  if (rnd === 1)
    return upper;
  return Math.floor(rnd*(upper + 1 - low)) + low;
}


export function isUndefined(x){
  return typeof x == "undefined"? true: false;
}

export function initializeMultiDimArray(dimensions, value=0) {
  let prevArray = [];

  if (dimensions.length===1)
    for(let i=0; i<dimensions[0]; ++i)
      prevArray[i] = value;
  else
    for(let i=0; i<dimensions[0]; ++i)
      prevArray[i] = initializeMultiDimArray(dimensions.slice(1));

  return prevArray;
}