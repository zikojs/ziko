// import { preload } from "./preload";

// async function fetchdom(url='https://github.com/zakarialaoui10') {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
//     const html = await response.text();
//     const dom = new DOMParser().parseFromString(html, 'text/html');
//     return dom.documentElement;
//   } catch (err) {
//     console.error('Failed to fetch DOM:', err);
//     throw err;
//   }
// }

// function fetchdomSync(url='https://github.com/zakarialaoui10') {
//   try {
//     const data = preload(url);
//     const dom = new DOMParser().parseFromString(data, 'text/html');
//     return dom.documentElement;
//   } catch (err) {
//     console.error('Failed to fetch DOM synchronously:', err);
//     throw err;
//   }
// }

// export { 
//   fetchdom, 
//   fetchdomSync 
// };
