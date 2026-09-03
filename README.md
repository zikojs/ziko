# ZikoJS

This repository hosts the main packages of the ZikoJS ecosystem. It contains the core framework, essential tooling, and primary integrations.

The ZikoJS ecosystem also includes additional packages that are maintained independently in other repositories.

|Package|Description|NPM|
|-|-|-|
|`ziko`|The core package of the ecosystem|![NPM Version](https://img.shields.io/npm/v/ziko)|
|`create-ziko`||![NPM Version](https://img.shields.io/npm/v/create-ziko)|
|`@zikojs/jsx`|
|`@zikojs/vite-plugin-jsx`|
|`@zikojs/html`|
|`@zikojs/vite-plugin-html`|
|`@zikojs/document`||
|`@zikojs/i18n`||
|`@zikojs/keymap`||

## Ecosystem
Several official projects are maintained outside of this repository. These projects extend the ZikoJS ecosystem with integrations, authoring tools, and additional functionality.

### Addons

- [integrations](https://github.com/zikojs/integrations) : 
    - `@zikojs/astro`
    - `@zikojs/react`
    - `@zikojs/svelte`
    - `@zikojs/solid`
    - `@zikojs/preact` 
    - `@zikojs/vue`
- [zextra]() : 
    - `zextra`
    - `zikojs/atropos`
    - `zikojs/lottie`
- [mdx]() : 
    - `@zikojs/mdx`
    - `@zikojs/vite-plugin-mdx`
- [server]()
- [three]()
- [p5js]()
- [animations]() : 
    - `@zikojs/gsap`
    - `@zikojs/motion`
- [icons]() : 
    - `@zikojs/lucide`

### Successors 

    [Numz](https://github.com/zakarialaoui10/numze)
    [Ufbr](https://github.com/zakarialaoui10/ufbr)


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
