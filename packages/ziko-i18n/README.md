# @zikojs/i18n

<!-- [![ziko-i18n banner](https://raw.githubusercontent.com/zakarialaoui10/@zikojs/i18n/606f5caf87b1d41184c7989c11e5272c68a375ab/assets/banner.svg)](https://github.com/zakarialaoui10/zikojs) -->

Reactive internalization provider for zikojs 


## Install 
```bash
npm i @zikojs/i18n

```

## API Design 

- *`createI18nProvider(lang, locals, target?)`* : intitialize once.
- *`const [t, setLang] = useTranslation()`* : use anywherr, with : 
    - `t(key)` : reactive translation
    - `setLang(lang, rtl = false)` : change language globally


## Usage

```js
import { tags } from 'ziko/dom'
import {createI18NProvider, createI18NProvider} from '@zikojs/i18n'
import locals from './locals.json'

createI18nProvider('en', locals)

const App = () =>{
    const {div, p, button}= tags
    const [t, setLang] = useTranslation();
    return div(
        p(t('p1')),
        p(t('p2')),
        button("EN").onClick(()=> setLang('en')),
        button("FR").onClick(()=> setLang('fr')),
        button("AR").onClick(()=> setLang('ar', true)) // true to make the the direction rtl 
    )
}
```

## Features

- Reactivity
- Simple Architechture
- No Nesting 
- No Wrapping components
- Automatically updates `lang` attribut
- Handle directions
- Lightweight

 

# Licence
This projet is licensed under the terms of MIT License 
