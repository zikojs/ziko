
## ziko anatomy
The ziko package is the core of ZikoJS. It is organized into a set of focused modules, each providing a fundamental part of the framework.

```mermaid
treeView-beta
    ziko :::highlight ## The core package
        math
            const
            aithmetic
            mapfun
            utils
        mini-dom ##
            mixins
            text
            UINode
            UIElement
        dom ##
            tags
            web-component
            UIElement
        hooks
        router
        string
        time
        components
```
<!-- # Zikojs

ZikoJS is organized as a collection of focused packages around ziko, the core package. Each package has a specific role in the ecosystem:

```mermaid
treeView-beta
    ziko :::highlight ## The core package
    create-ziko ## Scaffolder
    @zikojs/jsx ## Jsx transformer
    @zikojs/vite-plugin-jsx
    @zikojs/html ## HTML Transformer
    @zikojs/vite-plugin-html
    @zikojs/browser
    @zikojs/i18n
    @zikojs/document
```

`ziko` is the foundation of the ecosystem. It provides the core APIs used to build applications and is intentionally kept independent from the higher-level tooling and integrations.

The other packages extend ziko with additional capabilities such as JSX and HTML transformations, Vite integrations, browser APIs, internationalization, and document handling.

## ziko Anatomy  -->
