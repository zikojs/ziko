// import Ease from "./ease.js";
const wait=(delayInMS)=>{
    return new Promise((resolve) => setTimeout(resolve, delayInMS));
}
const timeTaken = callback => {
    console.time('timeTaken');
    const r = callback();
    console.timeEnd('timeTaken');
    return r;
}
export{
    wait,
    timeTaken,
    // Ease
}
export * from "./performance.js";
export * from "./ui.js"