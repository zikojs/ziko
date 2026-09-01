import {
    add,
    sub, 
    mul, 
    div,
    modulo
} from '../functions/arithmetic/index.js'
import {
    map,
    lerp, 
    clamp, 
    norm 
} from '../functions/utils/index.js'
import { Complex } from "../complex/index.js";
// import { arr2str } from "../../data/index.js";
import { 
    matrix_constructor,
    maintain_indexes,
    matrix_inverse,
    matrix_det,
    hstack,
    vstack
} from "./helpers/index.js";
import { mapfun } from '../functions/index.js';
import { Random } from '../random/index.js';
class Matrix{
    constructor(rows, cols, element = [] ) {
        [
            this.rows, 
            this.cols, 
            this.arr
        ] = matrix_constructor(Matrix, rows, cols, element);
        maintain_indexes(this)
    }
    isMatrix(){
        return true
    }
    clone() {
        return new Matrix(this.rows, this.cols, this.arr.flat(1));
    }
    toComplex(){
        this.arr = mapfun(
            x => x?.isComplex?.() ? x : new Complex(x, 0),
            ...this.arr
        )
        maintain_indexes(this)
        return this;
    }
    [Symbol.iterator]() {
      return this.arr[Symbol.iterator]();
    }
    get size() {
        return this.rows * this.cols;
    } 
    get shape() {
        return [this.rows, this.cols];
    }
    // toString(){
    //     return arr2str(this.arr,false);
    // }
    at(i = 0, j = undefined) {
        if(i < 0) i += this.rows;
        if(i < 0 || i >= this.rows) throw new Error('Row index out of bounds');
        if(j === undefined) return this.arr[i];
        if(j < 0) j += this.cols;
        if(j < 0 || j >= this.cols) throw new Error('Column index out of bounds');
        return this.arr[i][j];
    }
    slice(r0=0, c0=0, r1 = this.rows-1, c1 = this.cols-1) {
        if(r1 < 0) r1 = this.rows + r1
        if(c1 < 0 ) c1 = this.cols + c1
        let newRow = r1 - r0,
            newCol = c1 - c0;
        let newArr = new Array(newCol);
        for (let i = 0; i < newRow; i++) {
            newArr[i] = [];
            for (let j = 0; j < newCol; j++) 
                newArr[i][j] = this.arr[i + r0][j + c0];
        }
        this.arr = newArr;
        maintain_indexes(this.rows)
        this.rows = newRow;
        this.cols = newCol;
        return this;
    }
    reshape(newRows, newCols) {
        if(!(newRows * newCols === this.rows * this.cols)) throw Error('size not matched');
        const oldRows = this.rows;
        Object.assign(this, new Matrix(newRows, newCols, this.arr.flat(1)));
        maintain_indexes(oldRows);
        return this;
    }
    get T() {
        let transpose = [];
        for (let i = 0; i < this.arr[0].length; i++) {
            transpose[i] = [];
            for (let j = 0; j < this.arr.length; j++) 
                transpose[i][j] = this.arr[j][i];
        }
        return new Matrix(this.cols, this.rows, transpose.flat(1));
    }
    get det() {
        return matrix_det(this)
    }
    get inv() {
        return matrix_inverse(this)
    }
    // normalize names
    static eye(size) {
        let result = new Matrix(size, size);
        for (let i = 0; i < size; i++) 
            for (let j = 0; j < size; j++) i === j ? (result.arr[i][j] = 1) : (result.arr[i][j] = 0);
        return result;
    }
    static zeros(rows, cols) {
        let result = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++) 
            for (var j = 0; j < cols; j++) result.arr[i][j] = 0;
        return result;
    }
    static ones(rows, cols) {
        let result = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++) 
            for (let j = 0; j < cols; j++) result.arr[i][j] = 1;
        return result;
    }
    static nums(rows, cols, number) {
        let result = new Matrix(rows, cols);
        for (let i = 0; i < rows; i++) 
            for (let j = 0; j < cols; j++) result.arr[i][j] = number;
        return result;
    }
    static get random(){
        return {
            int : (r, c, a, b)=> new Matrix(
                r,
                c,
                Random.sample.int(r*c, a, b)
            ),
            float : (r, c, a,)=> new Matrix(
                r,
                c,
                Random.sample.float(r*c, a, b)
            ),
        }
    }
    get range(){
        return {
            map : (xmin, xmax, ymin, ymax) => {
                this.arr = map(this.arr, xmin, xmax, ymin, ymax);
                return this;
            },
            norm : (min, max) => {
                this.arr = norm(this.arr, min, max);
                return this;
            },
            lerp : (min, max) => {
                this.arr = lerp(this.arr, min, max);
                return this;
            },
            clamp : (min, max) => {
                this.arr = clamp(this.arr, min, max);
                return this;
            },

        }
    }
    hstack(...matrices) {
        const M=[this, ...matrices].reduce((a,b)=>hstack(a, b));
        Object.assign(this, M);
        maintain_indexes(this);
        return this;
    }
    vstack(...matrices){
        const M=[this, ...matrices].reduce((a,b)=>vstack(a, b));
        Object.assign(this, M);
        maintain_indexes(this);
        return this;
    }
    hqueue(...matrices){
        const M=[this, ...matrices].reverse().reduce((a,b)=>hstack(a, b));
        Object.assign(this, M);
        maintain_indexes(this);
        return this;
    }
    vqueue(...matrices){
        const M=[this,...matrices].reverse().reduce((a, b)=>vstack(a, b));
        Object.assign(this, M);
        maintain_indexes(this);
        return this;
    }
    forEach(fn){
        this.arr.flat(1).forEach(fn);
        return this;
    }
    forEachRow(fn){
        this.arr.forEach(fn);
        return this;
    }
    forEachCol(fn){
        this.clone().T.forEachRow(fn);
        return this
    }
    map(fn){
        const arr = this.arr.flat(1).map(fn)
        return new Matrix(
            this.rows, 
            this.cols,
            arr
        )
    }
    mapRows(fn = ()=>{}){
        this.arr = this.arr.map(fn)
        return this;
    }
    mapCols(fn){
        return this.clone().T.mapRows(fn).T;
    }
    sort(fn = ()=>{}){
        const arr = this.arr.flat(1).sort(fn)
        return new Matrix(
            this.rows, 
            this.cols,
            arr
        )  
    }
    shuffle(){
        return this.sort(() => 0.5-Math.random())
    }
    sortRows(fn = ()=>{}){
        this.arr = this.arr.map(row => row.sort(fn))
        return this;
    }
    shuffleRows(){
        return this.sortRows(() => 0.5-Math.random())
    }
    sortCols(fn){
        return this.clone().T.sortRows(fn).T;
    }
    shuffleCols(){
        return this.sortCols(() => 0.5-Math.random())
    }
    reduce(fn, initialValue){
        const value = initialValue 
            ? this.arr.flat(1).reduce(fn, initialValue) 
            : this.arr.flat(1).reduce(fn);
        return new Matrix([[value]])
    }
    reduceRows(fn, initialValue){
        const values = initialValue 
            ? this.arr.map(row => row.reduce(fn, initialValue)) 
            : this.arr.map(row => row.reduce(fn)) 
        return new Matrix(1, this.cols, values)
    }
    reduceCols(fn, initialValue){
        return this.T.reduceRows(fn, initialValue).T
    }
    filterRows(fn){
        const mask = this.arr.map(n => n.some(m => fn(m)));
        const arr = [];
        let i;
        for(i = 0; i < mask.length; i++)
            if(mask[i]) arr.push(this.arr[i])
        return new Matrix(arr)
    }
    filterCols(fn){
        const arr = this.T.filterRows(fn);
        return new Matrix(arr).T
    }
    every(fn){
        return this.arr.flat(1).every(fn)
    }
    everyRow(fn){
        return this.arr.map(n => n.every(fn))
    }
    everyCol(fn){
        return this.T.arr.map(n => n.every(fn))
    }
    some(fn){
        return this.arr.flat(1).some(fn)
    }
    someRow(fn){
        return this.arr.map(n => n.some(fn))
    }
    someCol(fn){
        return this.T.arr.map(n => n.some(fn))
    }
    // Checkers
    get isSquare() {
        return this.rows === this.cols;
    }
    get isSym() {
        if (!this.isSquare) return false;
        for (let i = 0; i < this.rows; i++) {
            for (let j = i + 1; j < this.cols; j++) {
                if (this.arr[i][j] !== this.arr[j][i]) return false;
            }
        }
        return true;
    }
    get isAntiSym() {
        if (!this.isSquare) return false;
        const n = this.rows;
        for (let i = 0; i < n; i++) {
            if (this.arr[i][i] !== 0) return false;
            for (let j = i + 1; j < n; j++) {
                if (this.arr[i][j] !== -this.arr[j][i]) return false;
            }
        }
        return true;
    }
    get isDiag() {
        if (!this.isSquare) return false;
        const n = this.rows;
        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (this.arr[i][j] !== 0 || this.arr[j][i] !== 0) return false;
            }
        }
        return true;
    }
    get isOrtho() {
        if (!this.isSquare) return false;
        return this.isDiag && (this.det == 1 || this.det == -1);
    }
    get isIdemp() {
        if (!this.isSquare) return false;
        const n = this.rows;
        const A = this.arr;
        // Compute A * A
        const MM = [];
        for (let i = 0; i < n; i++) {
            MM[i] = [];
            for (let j = 0; j < n; j++) {
                let sum = 0;
                for (let k = 0; k < n; k++) {
                    sum += A[i][k] * A[k][j];
                }
                MM[i][j] = sum;
            }
        }
        // Check if A * A == A
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (MM[i][j] !== A[i][j]) return false;
            }
        }
        return true;
    }

    get isUpperTri() {
        if (!this.isSquare) return false;
        const n = this.rows;
        for (let i = 1; i < n; i++) {
            for (let j = 0; j < i; j++) {
                if (this.arr[i][j] !== 0) return false;
            }
        }
        return true;
    }
    get isLowerTri() {
        if (!this.isSquare) return false;
        const n = this.rows;
        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                if (this.arr[i][j] !== 0) return false;
            }
        }
        return true;
    }
    toPrecision(p) {
        for (let i = 0; i < this.cols; i++) 
            for (let j = 0; j < this.rows; j++) 
                this.arr[i][j] = +this.arr[i][j].toPrecision(p);
        return this;
    }
    toFixed(p) {
        for (let i = 0; i < this.cols; i++) 
            for (let j = 0; j < this.rows; j++) 
                this.arr[i][j] = +this.arr[i][j].toFixed(p);
        return this;
    }
    // max2min() {
    //     let newArr = this.arr.flat(1).max2min;
    //     return new Matrix(this.rows, this.cols, newArr);
    // }
    // min2max() {
    //     let newArr = this.arr.flat(1).min2max;
    //     return new Matrix(this.rows, this.cols, newArr);
    // }
    // count(n) {
    //     return this.arr.flat(1).count(n);
    // }
    splice(r0,c0,deleteCount,...items){
        
    }
    getRows(ri, rf = ri + 1) {
        return this.slice(ri, 0, rf, this.cols);
    }
    getCols(ci, cf = ci + 1) {
        return this.slice(0, ci, this.rows, cf);
    }
    #arithmetic(fn, ...matr){
        for (let k = 0; k < matr.length; k++) {
            if (typeof matr[k] == "number" || matr[k]?.isComplex?.()) matr[k] = Matrix.nums(this.rows, this.cols, matr[k]);
            for (let i = 0; i < this.rows; i++) 
                for (var j = 0; j < this.cols; j++) 
                    this.arr[i][j] = fn(this.arr[i][j], matr[k].arr[i][j]);
        }
        return new Matrix(this.rows, this.cols, this.arr.flat(1));  
    }
    add(...matr) {
        return this.#arithmetic(add, ...matr)
    }
    sub(...matr) {
        return this.#arithmetic(sub, ...matr)
    }
    mul(...matr) {
        return this.#arithmetic(mul, ...matr)
    }
    div(...matr) {
        return this.#arithmetic(div, ...matr)
    }
    modulo(...matr) {
        return this.#arithmetic(modulo, ...matr)
    }
    dot(matrix) {
        var res = [];
        for (var i = 0; i < this.arr.length; i++) {
            res[i] = [];
            for (var j = 0; j < matrix.arr[0].length; j++) {
                res[i][j] = 0;
                for (var k = 0; k < this.arr[0].length; k++) {
                    res[i][j] = add(
                        res[i][j],
                        mul(this.arr[i][k],matrix.arr[k][j])
                        )
                }
            }
        }
        return new Matrix(this.arr.length, matrix.arr[0].length, res.flat(1));
    }
    pow(n) {
        let a = this.clone(),
            p = this.clone();
        for (let i = 0; i < n - 1; i++) p = p.dot(a);
        return p;
    }
    sum(){
        let S = 0;
        for (let i = 0; i < this.rows; i++) 
            for (let j = 0; j < this.cols; j++) 
                S = add(S, this.arr[i][j]);
        return S;
    }
    prod(){
        let S = 1;
        for (let i = 0; i < this.rows; i++) 
            for (let j = 0; j < this.cols; j++) 
                S = mul(S, this.arr[i][j]);
        return S;
    }
    hasComplex(){
        return this.arr.flat(Infinity).some((n) => n instanceof Complex);
    }
    get min() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        let minRow = [];
        for (let i = 0; i < this.rows; i++) 
            minRow.push(Math.min(...this.arr[i]));
        return Math.min(...minRow);
    }
    get max() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        let maxRow = [];
        for (let i = 0; i < this.rows; i++) 
            maxRow.push(Math.max(...this.arr[i]));
        return Math.max(...maxRow);
    }
    get minRows() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        let minRow = [];
        for (let i = 0; i < this.rows; i++) 
            minRow.push(Math.min(...this.arr[i]));
        return minRow;
    }
    get maxRows() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        let maxRow = [];
        for (let i = 0; i < this.rows; i++) 
            maxRow.push(Math.max(...this.arr[i]));
        return maxRow;
    }
    get minCols() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        return this.T.minRows;
    }
    get maxCols() {
        if (this.hasComplex()) console.error("Complex numbers are not comparable");
        return this.T.maxRows;
    }
    static fromVector(v) {
        return new Matrix(v.length, 1, v);
    }
    serialize() {
        const arr = mapfun(x => x.serialize?.() || x, ...this.arr)
        return JSON.stringify({
            type : 'matrix',
            data : {
                rows : this.rows,
                cols : this.cols,
                arr,
            }
        });
    }
    static deserialize(json) {
        if (typeof json == "string") json = JSON.parse(json);
        const {type, data} = json;
        if(type !== 'matrix') return TypeError('Not a valid Matrix')
        let {arr} = data;
        arr = mapfun(x => {
            if(typeof x === 'string') {
                const x_obj = JSON.parse(x);
                const {type} = x_obj
                if(type === 'complex') return Complex.deserialize(x_obj)
            }
            return x
        }, ...arr)
        return new Matrix(arr)
    }
    flip(){
        return this.flipeH().flipeV()
    }
    flipeH(){
        this.arr = this.arr.map(row => [...row].reverse());
        maintain_indexes(this);
        return this;
    }
    flipeV(){
        this.arr = this.arr.reverse();
        maintain_indexes(this);
        return this;
    }
}


const matrix=(r, c, element)=>new Matrix(r, c, element);
const matrix2=(...element)=>new Matrix(2, 2, element);
const matrix3=(...element)=>new Matrix(3, 3, element);
const matrix4=(...element)=>new Matrix(4, 4, element);
export{
    Matrix,
    matrix,
    matrix2,
    matrix3,
    matrix4
}