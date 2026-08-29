// import { arr2str } from "../index.js";
// import { Complex, mapfun, Matrix } from "../../math/index.js";

import { Complex } from "../../math/complex/index.js";
import { Matrix } from "../../math/matrix/index.js";
import { mapfun } from "../../math/functions/utils/mapfun.js";

// const obj2str=(object)=>{
//     const recursiveToString = (obj) => {
//       if (Array.isArray(obj)) return arr2str(obj);
//       if (typeof obj === 'object' && obj !== null) {
//         return `{ ${Object.entries(obj)
//           .map(([key, value]) => `${key}:${recursiveToString(value)}`)
//           .join(" , ")} }`;
//       }
//       return String(obj); 
//     };
//     return recursiveToString(object);
//   };
//   const obj2str = (object) => {
//     const recursiveToString = (obj, indentLevel = 0) => {
//       const indent = '  '.repeat(indentLevel);
//       const nextIndent = '  '.repeat(indentLevel + 1);
//       if(Array.isArray(obj)) return arr2str(obj, indentLevel);
//       if(obj instanceof Complex || obj instanceof Matrix) return obj.toString();
//       if (typeof obj === 'object' && obj !== null) {
//         const entries = Object.entries(obj)
//           .map(([key, value]) => `${nextIndent}${key}: ${recursiveToString(value, indentLevel + 1)}`)
//           .join(",\n");
  
//         return `{\n${entries}\n${indent}}`;
//       }
  
//       return String(obj);
//     };
  
//     return recursiveToString(object);
//   };
// const obj2str = (object, useIndentation = true, indentLevel = 0) => {
//     const recursiveToString = (obj, level = 0) => {
//       const indent = useIndentation ? '  '.repeat(level) : '';
//       const nextIndent = useIndentation ? '  '.repeat(level + 1) : '';
//     if (Array.isArray(obj)) return arr2str(obj, false, level);
//     if(obj instanceof Complex || obj instanceof Matrix) return obj.toString();
//     if (typeof obj === 'object' && obj !== null) {
//         const entries = Object.entries(obj)
//           .map(([key, value]) => useIndentation 
//             ? `${nextIndent}${key}: ${recursiveToString(value, level + 1)}` 
//             : `${key}: ${recursiveToString(value, level + 1)}`
//           ).join(useIndentation ? ",\n" : ", ");
  
//         return useIndentation 
//           ? `{\n${entries}\n${indent}}` 
//           : `{${entries}}`;
//       }
  
//       return String(obj);
//     };
  
//     return recursiveToString(object, indentLevel);
//   };

const obj2str=(obj)=>JSON.stringify(
  mapfun(n=>{
    if(["number","string","boolean","bigint"].includes(typeof n)) return String(n);
    if(n instanceof Complex || n instanceof Matrix) return n.toString();
    if(n instanceof Array) return arr2str(n)
  },
  obj), null, "  ")
  .replace(/"([^"]+)":/g, '$1:') // Remove Quotes from Keys 
  .replace(/: "([^"]+)"/g, ': $1'); // Remove Quotes from str values
export{
    obj2str
}