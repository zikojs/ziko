import { useState } from '../../state/use-state/index.js';
export function createI18nProvider(lang, locals){
    if(!globalThis.__Ziko__.__PROVIDERS__) globalThis.__Ziko__.__PROVIDERS__ = {}
    globalThis.__Ziko__.__PROVIDERS__.i18n = {
        lang, 
        locals,
    }  
}
export function useTranslation(
    initialLang = __Ziko__?.__PROVIDERS__?.i18n?.lang, 
    locals = __Ziko__.__PROVIDERS__?.i18n?.locals
) {
    const [lang, _setLang] = useState(initialLang);
    const setLang = (lang, rtl) =>{
        document.documentElement.lang = lang;
        document.documentElement.style.direction = rtl ? 'rtl' : 'ltr'
        _setLang(lang)
    }
    setLang(initialLang)
    function t(key) {
        return () => ({
            value : locals[lang().value][key],
            isStateGetter: () => true,
            _subscribe: (fn) => {
                lang()._subscribe(
                    () => fn(locals[lang().value][key])
                );
            }
        });
    }
    return [t, setLang];
}