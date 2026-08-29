import { SPA } from "./spa.js";
import { tags } from "../dom/index.js";
// import.meta.glob('./src/pages/**/*.js')
async function FileBasedRouting(pages /* use import.meta.glob */){
   const routes = Object.keys(pages)
   const root = findCommonPath(routes)
   const pairs = {}
   for(let i=0; i<routes.length; i++){
      const module = await pages[routes[i]]()
      const component = await module.default
      Object.assign(pairs,{[customPath(routes[i], root)]:component})
   }
   return SPA({
      target : document.body,
      routes : {
         "/" : ()=>{},
         ...pairs
      },
      wrapper : tags.section()
   })   
}
function customPath(inputPath, root = './src/pages', extensions = ['js', 'ts']) {
   if(root.at(-1)==="/") root = root.slice(0, -1)
   const normalizedPath = inputPath.replace(/\\/g, '/').replace(/\[(\w+)\]/g, '$1/:$1');
   const parts = normalizedPath.split('/');
   const rootParts = root.split('/');
   const rootIndex = parts.indexOf(rootParts.at(-1));
   if (rootIndex !== -1) {
       const subsequentParts = parts.slice(rootIndex + 1);
       const lastPart = parts.at(-1);
       const isIndexFile = lastPart === 'index.js' || lastPart === 'index.ts';
    //    console.log({extensions, subsequentParts, lastPart, isIndexFile, rootParts, rootIndex, parts})
       const hasValidExtension = extensions.some(ext => lastPart === `.${ext}` || lastPart.endsWith(`.${ext}`));
       if (isIndexFile) {
           return '/' + (subsequentParts.length > 1 ? subsequentParts.slice(0, -1).join('/') : '');
       }
       if (hasValidExtension) {
           return '/' + subsequentParts.join('/').replace(/\.(js|ts)$/, '');
       }
   }
   return '';
}
function findCommonPath(paths) {
   if (paths.length === 0) return '';
   const splitPaths = paths.map(path => path.split('/'));
   const minLength = Math.min(...splitPaths.map(parts => parts.length));
   let commonParts = [];
   for (let i = 0; i < minLength; i++) {
       const part = splitPaths[0][i]; 
       if (splitPaths.every(parts => parts[i] === part || parts[i].startsWith('['))) {
           commonParts.push(part);
       } else {
           break; 
       }
   }
   const commonPath = commonParts.join('/') + (commonParts.length ? '/' : '');
   return commonPath;
}

// // Example usage
// const inputPaths = [
//    './src/pages/[blog]/[lang]/index.js',
//    './src/pages/[blog]/index.js',
//    './src/pages/about.js',
//    './src/pages/articles/[data]/[color]/index.js',
//    './src/pages/articles/a1.js',
//    './src/pages/index.js',
//    './src/pages/me.js'
// ];

// console.log(findCommonPath(inputPaths)); // Output: './src/pages/'
export{
    FileBasedRouting,
}