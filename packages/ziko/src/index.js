export * from "./math/index.js";
export * from "./dom/index.js";
export * from "./time/index.js";
export * from "./data/index.js";
// export * from "./reactivity/index.js"
export * from "./app/index.js";
export * from './hooks/index.js';
// export * from './use/index.js'

export * from "./events/index.js";

if(globalThis?.document){
    document?.addEventListener("DOMContentLoaded", __Ziko__.__Config__.init());
}

import './math/functions/proxy.js'


