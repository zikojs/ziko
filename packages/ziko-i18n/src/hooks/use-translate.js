import { useState } from 'ziko/hooks';

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

