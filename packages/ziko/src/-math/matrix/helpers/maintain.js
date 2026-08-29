export const maintain_indexes = (Matrix, oldRows) =>{
    for (let i = 0; i < Matrix.arr.length; i++) {
        Object.defineProperty(Matrix, i, {
            value: Matrix.arr[i],
            writable: true,
            configurable: true,
            enumerable: false
        });
    }
    for (let i = Matrix.arr.length; i < oldRows; i++) {
        delete Matrix[i];
    }
}