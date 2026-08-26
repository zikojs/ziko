
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const banner= `
/*
  Project: ziko.js
  Author: Zakaria Elalaoui
  Date : ${new Date()}
  Git-Repo : https://github.com/zakarialaoui10/ziko.js
  Git-Wiki : https://github.com/zakarialaoui10/ziko.js/wiki
  Released under MIT License
*/
`
const isProduction = process.env.NODE_ENV === 'production';

const output = [
  {
    file: 'dist/ziko.mjs',
    format: 'es',
    banner,
    exports: "named",
    inlineDynamicImports: true,
  },
  {
    file: 'dist/ziko.js',
    format: 'umd',
    name:"Ziko",
    banner,
    exports: "named",
    inlineDynamicImports: true,
  },
]
isProduction && output.push(
  {
    file: 'dist/ziko.cjs',
    format: 'cjs',
    banner,
    exports: "named",
    inlineDynamicImports: true,
  },
  {
    file: 'dist/ziko.min.js',
    format: 'umd',
    name:"Ziko",
    banner,
    exports: "named",
    inlineDynamicImports: true,
    plugins:[terser({
      output: {
        comments: (node, { type, value }) => type === 'comment2' && value.includes('Author'),
      },
    })]
  }
)

export default {
  input: 'src/index.js',
  output,
   plugins: [
    resolve(), 
    //commonjs(),
  ],
}