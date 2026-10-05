
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

const banner= `
/*
  Project: ziko
  Author: Zakaria Elalaoui
  Date: ${new Date().toISOString().slice(0, 10)}
  Git-Repo : https://github.com/zikojs/ziko
  Git-Wiki : https://github.com/zikojs/ziko/wiki
  Released under MIT License
*/
`
const isProduction = process.env.NODE_ENV === 'production';

const output = [
  {
    file: 'dist/ziko.mjs',
    format: 'es',
    banner,
    exports: 'named',
    inlineDynamicImports: true,
  },
  {
    file: 'dist/ziko.js',
    format: 'umd',
    name:'Ziko',
    banner,
    exports: 'named',
    inlineDynamicImports: true,
  },
]
isProduction && output.push(
  {
    file: 'dist/ziko.cjs',
    format: 'cjs',
    banner,
    exports: 'named',
    inlineDynamicImports: true,
  },
  {
    file: 'dist/ziko.min.js',
    format: 'umd',
    name:'Ziko',
    banner,
    exports: 'named',
    inlineDynamicImports: true,
    sourcemap: true,
    plugins:[terser({
      output: {
        comments: (_, { type, value }) => type === 'comment2' && /Project:|Author:|MIT License/.test(value)
      },
    })]
  }
)

export default {
  input: 'src/index.js',
  output,
   plugins: [
    resolve(), 
    commonjs(),
  ],
}