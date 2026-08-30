export const not = x => {
    if(x.isComplex?.()) return new x.constructor(not(x.a), not(x.b))
    if(x.isMatrix?.()) return new x.constructor(x.rows, x.cols, x.arr.flat(1).map(not))
    return + !x;
}
const handle_complex_and_matrix = (x, operation) => {
    if (x.every(n => n.isComplex?.())) {
        const Re = x.map(n => n.a);
        const Im = x.map(n => n.b);
        return new x[0].constructor(
            operation(...Re),
            operation(...Im)
        );
    }

    if (x.every(n => n.isMatrix?.())) {
        if (!x.every(mat => mat.rows === x[0].rows && mat.cols === x[0].cols)) {
            return TypeError('All matrices must have the same shape');
        }

        const { rows, cols } = x[0];
        const Y = Array.from({ length: rows }, (_, i) =>
            Array.from({ length: cols }, (_, j) =>
                operation(...x.map(mat => mat.arr[i][j]))
            )
        );
        return new x[0].constructor(Y);
    }

    return null;  // Return null if no Complex or Matrix found
};

export const and = (...x) => {
    const result = handle_complex_and_matrix(x, and);
    if (result !== null) return result;
    return x.reduce((n, m) => (n &= m), 1);
};

export const or = (...x) => {
    const result = handle_complex_and_matrix(x, or);
    if (result !== null) return result;
    return x.reduce((n, m) => (n |= m), 0);
};

export const xor = (...x) => {
    const result = handle_complex_and_matrix(x, xor);
    if (result !== null) return result;
    return x.reduce((n, m) => (n ^= m), 0);
};

export const nand = (...x) => not(and(...x));
export const nor = (...x) => not(or(...x));
export const xnor = (...x) => not(xor(...x));

