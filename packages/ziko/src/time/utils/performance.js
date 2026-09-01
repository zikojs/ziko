const time_memory_Taken = (callback) => {
    const t0 = Date.now();
    const m0 = performance.memory.usedJSHeapSize;
    const result = callback();
    const t1 = Date.now();
    const m1 = performance.memory.usedJSHeapSize;
    const elapsedTime = t1 - t0;
    const usedMemory = m1 - m0;
    return { 
        elapsedTime,
        usedMemory, 
        result 
    };
  };
export {time_memory_Taken}
    