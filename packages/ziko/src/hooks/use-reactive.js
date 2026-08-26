import { mapfun } from '../math/utils/mapfun.js'
import { useState } from './use-state.js'

const useReactive = (nested_value) => mapfun(
    n => {
        const state = useState(n)
        return {
            get : state[0],
            set : state[1],
        }
    }, 
    nested_value
)
export{
    useReactive
}