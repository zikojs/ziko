import { obj2str } from "./object.js";
import { Complex } from "../../math/complex/index.js";
const getMaxDepth = arr=> {
  if (!Array.isArray(arr)) return 0;
  let maxDepth = 1;
  for (const element of arr) {
    if (Array.isArray(element)) {
      const depth = getMaxDepth(element);
      if (depth + 1 > maxDepth) {
        maxDepth = depth + 1;
      }
    }
  }
  return maxDepth;
}
const arr2str = (arr) => {
  let level = 0;
  function arrStringify(arr) {
    let max = getMaxDepth(arr);
    let useIdentation = 0;
    if (arr.some((n) => Array.isArray(n))) {
      level++;
      useIdentation = 1;   
    }
    return (
      "[" +
      arr.map((n, i) => {
        if (["number", "string", "boolean", "bigint"].includes(typeof n))
          return String(n);
        if (n instanceof Complex) return n.toString();
        if (n instanceof Array) {
          return `\n${"  ".repeat(level)}${arrStringify(n)}${i === arr.length - 1 ? "\n" : ""}`;
        }
        if( n instanceof Object) return obj2str(n);
      }) 
      + `${"  ".repeat((max+level+1) * useIdentation)}]` 
    );
  }
  return arrStringify(arr);
};
export{
    arr2str
}