const powerSet=originalSet=>{
    const subSets = [];
    const NUMBER_OF_COMBINATIONS = 2 ** originalSet.length;
    for (let i = 0; i < NUMBER_OF_COMBINATIONS; i += 1) {
        const subSet = [];
        for (let j = 0; j < originalSet.length; j += 1) {
            if (i & (1 << j)) {
                subSet.push(originalSet[j]);
            }
        }
        subSets.push(subSet);
    }
    return subSets;
}
export{powerSet}