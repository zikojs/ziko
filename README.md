# ZikoJS

This repository hosts the main packages of the ZikoJS ecosystem. It contains the core framework, essential tooling, and primary integrations.

The ZikoJS ecosystem also includes additional packages that are maintained independently in other repositories.

![NPM Version](https://img.shields.io/npm/v/ziko?label=ziko)
![NPM Version](https://img.shields.io/npm/v/create-ziko?label=create-ziko)
![NPM Version](https://img.shields.io/npm/v/@zikojs/jsx?label=@zikojs/jsx)
![NPM Version](https://img.shields.io/npm/v/@zikojs/vite-plugin-jsx?label=@zikojs/vite-plugin-jsx)
![NPM Version](https://img.shields.io/npm/v/@zikojs/html?label=@zikojs/html)

## install 
```bash
npm i ziko
```

## Quick start
```
nox create-ziko
```

## ziko anatomy
The `ziko` package is the core of ZikoJS. It is organized into a set of focused modules, each providing a fundamental part of the framework.

```mermaid
treeView-beta
    ziko :::highlight ## The core package
        math ## Mathematical utilities and operations
            const
            aithmetic
            mapfun
            utils
        mini-dom ## Lightweight, composable DOM primitives
            mixins
            text
            UINode
            UIElement
        dom ## Full DOM APIs built on top of the DOM primitives
            tags
            web-component
            UIElement
        hooks ## Reactivity and lifecycle hooks
        router
        string
        time
        components ## Built-in UI components and primitives
```

The modules are designed to be focused and composable, allowing applications to use only the functionality they need.


## Ecosystem
Several official projects are maintained outside of this repository. These projects extend the ZikoJS ecosystem with integrations, authoring tools, and additional functionality.

### Addons

- [Integrations](https://github.com/zikojs/integrations) : 
`@zikojs/astro`, `@zikojs/react`, `@zikojs/svelte`, `@zikojs/solid`, `@zikojs/preact`, `@zikojs/vue`
- [Zextra]() : 
    `zextra`, `zikojs/atropos`, `zikojs/lottie`
- [Mdx]() : 
`@zikojs/mdx`, `@zikojs/vite-plugin-mdx`
- [Server]()
- [Three]()
- [P5js]()
- [Animations]() : 
`@zikojs/gsap`, `@zikojs/motion`
- [Icons]() : 
    `@zikojs/lucide`

### Successors 

- [Numz](https://github.com/zakarialaoui10/numz)
- [Ufbr](https://github.com/zakarialaoui10/ufbr)


