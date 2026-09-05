import {HtmlToZikoJsIR} from './html-to-ziko-ir/index.js'

export const HtmlToZikoJS = html => {
    const {tags, data} = HtmlToZikoJsIR(html)
    const TAGS_IMPORT = `import {${[...tags].join(',')}} from 'ziko/dom';`
    const SCRIPTS = data.filter(n=>n.type === 'script').map(n=>n.content).join('\n')
    const UI = `export default function(){
    ${SCRIPTS}
    }`

    console.log(TAGS_IMPORT, SCRIPTS)
}

// const v = HtmlToZikoJsIR(`
// <style>
// </style>
// <script>
//   const a = "world";
// </script>
// <div class="card">
//   <h1>Hello {a}</h1>
//   <p>World</p>
// </div> 
// <script>
//   const b = "world";
// </script>   
// `)

const Alpine = `
<script>
 const {
    title = "test',
    description
 } = HTML.Props
 const isOpen = true
</script>
<template>
<div x-data="{ open: {isOpen} }">
    <button @click="open = true">Expand</button>
 
    <span x-show="open">
        Content...
    </span>
    <div>Other </div>
</div>
</template>

<style>
 div{
  color : red;
 }
</style>
`

const z = await HtmlToZikoJsIR(Alpine)
// console.log(v)
console.log(z)