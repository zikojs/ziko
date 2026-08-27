# ziko-jsx
JSX support for ZikoJS, compiling JSX components to ZikoJS at runtime—no VDOM involved.

[![ziko-jsx banner](https://raw.githubusercontent.com/zikojs/.github/main/assets/banners/ziko-jsx.svg)](https://github.com/zikojs)


## Example

### Input (JSX)

```jsx
import {ExternalComponent} from './ExternalComponent.js'
export default function Hello({ text, value } = {}) {
  return (
    <div class="parent">
      <span>hello {text}</span>
      <custom-element></custom-element>
      <ExternalComponent />
    </div>
  )
}
```

### Output (ZikoJS)
```js
import { tags } from "ziko/domm";
import {ExternalComponent} from './ExternalComponent.js'

export default function Hello({ text, value } = {}) {
  const { div, span, custom_element } = tags;
  return div(
    { class: "parent" },
    span("hello ", text),
    custom_element(),
    ExternalComponent()
  );
}
```
### Notes
- JSX is syntax sugar only, it compiles directly to function calls.
- Lowercase JSX tags are mapped to ZikoJS tag functions via `tags`
- Custom elements (`custom-element`) are normalized to valid identifiers (`custom_element`).
- Capitalized JSX tags are treated as components and invoked directly.
- JSX whitespace semantics are preserved: 
    - Inline text spacing is kept (hello {text} → "hello ", text)
    - Layout/indentation whitespace is ignored

## Install 

```bash
npm i ziko-jsx
```

## Config


## Licence 
MIT 