export function get_root(paths) {
   if (paths.length === 0) return '';
   
   // Strip trailing file names (e.g. /index.js or /about.js) to compare directory structures only
   const dirPaths = paths.map(path => {
     const parts = path.split('/');
     parts.pop(); // Remove the filename
     return parts;
   });

   const minLength = Math.min(...dirPaths.map(parts => parts.length));
   let commonParts = [];
   
   for (let i = 0; i < minLength; i++) {
       const part = dirPaths[0][i]; 
       if (dirPaths.every(parts => parts[i] === part || parts[i].startsWith('['))) {
           commonParts.push(part);
       } 
       else break; 
   }
   
   const root = commonParts.join('/') + (commonParts.length ? '/' : '');
   return root;
}