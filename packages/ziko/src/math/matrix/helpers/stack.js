export function hstack(M1, M2){
    M1 = M1.clone()
    M2 = M2.clone()
    if (M1.rows !== M2.rows) return;
    let newArr = M1.arr;
    for (let i = 0; i < M1.rows; i++) 
        for (let j = M1.cols; j < M1.cols + M2.cols; j++) 
            newArr[i][j] = M2.arr[i][j - M1.cols];
    M1.cols += M2.cols;
    return new M1.constructor(M1.rows, M1.cols, newArr.flat(1));
}

export function vstack(M1, M2){
    M1 = M1.clone()
    M2 = M2.clone()
    if (M1.cols !== M2.cols) return;
    let newArr = M1.arr;
    for (let i = M1.rows; i < M1.rows + M2.rows; i++) {
        newArr[i] = [];
        for (let j = 0; j < M1.cols; j++) newArr[i][j] = M2.arr[i - M1.rows][j];
    }
    M1.rows += M2.rows;
    return new M1.constructor(M1.rows, M1.cols, newArr.flat(1));
}