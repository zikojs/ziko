import { base2base } from "../functions/conversions/index.js";
import { accum_sum } from "../stats/index.js";

export class Random {
    static int(a, b){
        return Math.floor(this.float(a, b));
    }
    static float(a, b){
        return b !== undefined
            ? Math.random() * (b - a) + a
            : Math.random() * a;
    }
    static bin(){
        return this.int(2);
    }
    static oct(){
        return this.int(8);
    }
    static dec(){
        return this.int(10);
    }
    static hex(){
        return base2base(this.int(16), 10, 16);
    }
    static char(upperCase = false){
        const i = upperCase
            ? this.int(65, 91)
            : this.int(97, 123);
        return String.fromCharCode(i);
    }
    static bool(){
        return Boolean(this.int(2));
    }
    static get color(){
        return {
            hex : () =>
                `#${this.int(0xffffff).toString(16).padStart(6, '0')}`,

            hexa : () => {
                const [r,g,b,a] = Array.from(
                    {length:4},
                    () => this.int(0xff).toString(16).padStart(2,'0')
                );
                return `#${r}${g}${b}${a}`;
            },
            rgb : () => {
                const [r,g,b] = Array.from({length:3}, () => this.int(0xff));
                return `rgb(${r}, ${g}, ${b})`;
            },
            rgba : () => {
                const [r,g,b] = Array.from({length:3}, () => this.int(0xff));
                const a = Math.random().toFixed(2);
                return `rgba(${r}, ${g}, ${b}, ${a})`;
            },
            hsl : () => {
                const h = this.int(360);
                const s = this.int(100);
                const l = this.int(100);
                return `hsl(${h}, ${s}%, ${l}%)`;
            },
            hsla : () => {
                const h = this.int(360);
                const s = this.int(100);
                const l = this.int(100);
                const a = Math.random().toFixed(2);
                return `hsla(${h}, ${s}%, ${l}%, ${a})`;
            },
            gray : () => {
                const g = this.int(0xff);
                return `rgb(${g}, ${g}, ${g})`;
            }
        };
    }
    static get sample(){
        const R = this;
        return {
            int   : (n, a, b) => Array.from({length:n}, () => R.int(a, b)),
            float : (n, a, b) => Array.from({length:n}, () => R.float(a, b)),
            char  : (n, upper=false) => Array.from({length:n}, () => R.char(upper)),
            bool  : n => Array.from({length:n}, () => R.bool()),
            bin   : n => Array.from({length:n}, () => R.bin()),
            oct   : n => Array.from({length:n}, () => R.oct()),
            dec   : n => Array.from({length:n}, () => R.dec()),
            hex   : n => Array.from({length:n}, () => R.hex()),
            get color(){
                return {
                    hex  : n => Array.from({length:n}, () => R.color.hex()),
                    hexa : n => Array.from({length:n}, () => R.color.hexa()),
                    rgb  : n => Array.from({length:n}, () => R.color.rgb()),
                    rgba : n => Array.from({length:n}, () => R.color.rgba()),
                    hsl  : n => Array.from({length:n}, () => R.color.hsl()),
                    hsla : n => Array.from({length:n}, () => R.color.hsla()),
                    gray : n => Array.from({length:n}, () => R.color.gray())
                };
            },
            choice : (n, choices, p) =>
                Array.from({length:n}, () => R.choice(choices, p))
        };
    }
    static shuffle(arr){
        return [...arr].sort(() => 0.5 - Math.random());
    }
    static choice(choices = [1,2,3], p = new Array(choices.length).fill(1 / choices.length)){
        const acc = accum_sum(...p).map(v => v * 100);
        const pool = new Array(100);
        pool.fill(choices[0], 0, acc[0]);
        for(let i=1;i<choices.length;i++)
            pool.fill(choices[i], acc[i-1], acc[i]);
        return pool[this.int(pool.length)];
    }
}


globalThis.Random = Random

// // (upperCase) => upperCase ? : String.fromCharCode(rand_int(97,120))
// class Random {
//     static string(length,upperCase){
//         return length instanceof Array?
//             new Array(this.int(...length)).fill(0).map(() => this.char(upperCase)).join(""):
//             new Array(length).fill(0).map(() => this.char(upperCase)).join("");
//     }

// }
// export{Random}