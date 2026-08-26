import { defineParamsGetter } from './params.js';
import { __UI__ } from './__ui__.js';
import { __Config__ } from './__config__.js';
import { __HYDRATION__ } from './__hydration__.js';
import { __CACHE__ } from './__cache__.js';
import { __State__ } from './__state__.js';
export function __init__global__(){
    if ( !globalThis?.__Ziko__ ){
        globalThis.__Ziko__ = {
                    __UI__,
                    __HYDRATION__,
                    __State__,
                    __Config__,
                    __CACHE__,
                    __PROVIDERS__: {}
                };
        defineParamsGetter(__Ziko__)
    }
}
export { UIStore } from './__ui__.js'
