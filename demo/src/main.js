import { createSPAFileBasedRouter } from "ziko/router";
createSPAFileBasedRouter(
    {
        pages : import.meta.glob('./pages/**/*.js'),
        wrapper : (component) => component.style({color : 'red'}),
        base : '/docs'
    }
)

// import {cos} from 'ziko/math'
// import {useChannel, useMediaQuery} from 'ziko/hooks'

// useMediaQuery(
//     [
//     {
//         query: '(min-width: 600px)',
//         callback: () => console.log(1)
//     },
//     {
//         query: '(max-width: 300px)',
//         callback: () => console.log(2)
//     }
//   ]
// )

// cos(1, 2, 3, {a : 1})


// import { Complex, complex, mapfun } from "ziko/math";

// const a = new Complex(1, 1)
// console.log({a})

// const b = complex()

// import { linear } from "ziko/time";

// // linear()


// const aaa = mapfun(Math.cos, [1, 2], { a : 1}, complex(1, 1))

// // aaa

// const cc = mapfun(Math.sin, {b : 3})