# Zikojs 

A versatile JavaScript library offering a rich set of Hyperscript Based UI components, advanced mathematical utilities, interactivity ,animations, client side routing and more ...
<div align="center">

[![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/zakarialaoui10/zikojs/blob/HEAD/LICENSE) [![npm latest package](https://img.shields.io/npm/v/ziko/latest.svg)](https://www.npmjs.com/package/ziko) [![npm downloads](https://img.shields.io/npm/dy/ziko.svg)](https://www.npmjs.com/package/ziko) 
<!-- [![Average time to resolve an issue](https://isitmaintained.com/badge/resolution/zakarialaoui10/ziko.svg)](https://isitmaintained.com/project/zakarialaoui/ziko 'Average time to resolve an issue') -->

</div>

<!-- 
## Philosophy
Methodes Chaining 
Composition 
 -->
## Demos
- [ Windows entanglement using zikojs and ziko-gl ](https://www.linkedin.com/feed/update/urn:li:activity:7144023650394918913/) 

## 🔥 Features
### 💎 Core
- 🚫 Zero Dependency
- 🌳 Partial Tree Shaking
- 🔢 Rich Math Functions and Utilities
  - <details>
    <summary>Flexible Math Functions</summary>
    ZikoJS offers flexible math utilities, such as the `mapfun` function, which allows mapping standard mathematical operations to complex and nested data structures. 
    For example, the `cos` function in ZikoJS is built on top of mapfun, enabling it to handle multiple arguments with diverse types (numbers, arrays, objects).

    ```js
    import { cos, PI } from "ziko";
    const result = cos(PI, PI / 2, PI / 4, [PI / 6, PI / 3], {
      x: PI / 2,
      y: PI / 4,
      z: [0, PI / 12],
    }
    );
    /*
    result =>
    [
      -1,
      0,
      0.707106781186548,
      [0.866025403784439, 0.5],
      {
        x: 0,
        y: 0.707106781186548,
        z: [1, 0.965925826289068],
      },
    ];
    */
    // console.log(result)

    ```
    You can also built your own flexible Math function using this mapfun util : 
    ```js
    import { mapfun } from "ziko";
    const parabolic_func = (a, b, c, x) => a * x ** 2 + b * x + c;
    const map_parabolic_func =
      (a, b, c) =>
      (...X) =>
        mapfun((n) => parabolic_func(a, b, c, n), ...X);
    const a = -1.5,
      b = 2,
      c = 3;
    const X = [0, 1, 2, 3];
    console.log(parabolic_func(a, b, c)(X));
    // [3,3,1,3]

    ```
    </details>



<!-- - The Math Module supports a new Paradigm  -->
- ✨ Hyperscript-Based Declarative UI (No Template Engines needed)
```js
import {p, text, Random} from 'ziko'
const Hello = name => p(
  text("Hello ", name)
).onClick(e => e.target.style({color : Random.color()}))
```
- 🔄 Built in State Mangement : 
```js
import { tags } from 'ziko/dom'
import {useState, useDerived} from 'ziko/hooks'
const [timer, setTimer] = useState(0);
const converToHMS = seconds => `${Math.floor(seconds / 3600)} : ${Math.floor((seconds % 3600) / 60)} : ${seconds % 60} `
const [time] = useDerived(t => converToHMS(t) , [timer] ) 
tags.p('Elapsed Time : ', time)
let i = 1;
setInterval(()=>{
  setTimer(i);
  i++
}, 1000)
```
- 📱 Single Page Application With File Based Routing
```js
import { FileBasedRouting } from "ziko";
FileBasedRouting(import.meta.glob("./pages/**/*.js"))
```
- 🤝 One Way Interleaving With [Vanjs]()
- ⏰ Time loop and animations support

### 🚀 External : 
- 🧩 Extra UI Components : [Zextra](https://github.com/zakarialaoui10/zextra)
- 🖥️ Server Side Rendering With File Based Routing and Client Side Hydration : [ziko-server](https://github.com/zakarialaoui10/ziko-server)
- 📝 Mdx-Like Markdown Preprocessor : [Mdz](https://github.com/zakarialaoui10/mdz)
- 🔌 Flexible Integration with Popular Frameworks/Libraries : [Ziko-wrapper](https://github.com/zakarialaoui10/ziko-wrapper)
  - 🔄 Bi-directional : `React`, `Preact`, `Solid`, `Svelte`, `Vue` , `Vanjs`
  - ➡️ Uni-directional (ZikoJS → X) : 
    - `Astro` : (SSR + Client Hydration)
- 📦 Growing Add-On Ecosystem : 
    - Ziko-Tgl : WebGL/3D Graphics, Built on Top of [Threejs](https://github.com/zakarialaoui10/ziko-gl)
    - Ziko-Chart 
    - Ziko-Code
    - Ziko-Lottie
    - ...

## Install :
```bash
npm i ziko
```
## Quick Start :
```bash
npx create-ziko-app [app-title]
```
## ⭐️ Show your support <a name="support"></a>

If you appreciate the library, kindly demonstrate your support by giving it a star!<br>
[![Star](https://img.shields.io/github/stars/zakarialaoui10/ziko.js?style=social)](https://github.com/zakarialaoui10/ziko.js)
<!--## Financial support-->


To do
 add component middlware/wrapper 
