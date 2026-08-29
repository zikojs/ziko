export function createI18nProvider(lang, locals){
    if(!globalThis.__Ziko__.__PROVIDERS__) globalThis.__Ziko__.__PROVIDERS__ = {}
    globalThis.__Ziko__.__PROVIDERS__.i18n = {
        lang, 
        locals,
    }  
}