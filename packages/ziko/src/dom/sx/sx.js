import { throttle } from "../../time/throttle/index.js"
import { 
  ALIASES, 
  BREAKPOINTS,
  BREAKPOINTS_MAP,
  // BREAKPOINTS_STYLES_MAP
} from "./consts.js";
import{
  createBreakpointsStyleMap
} from './providers.js'
import { 
  isResponsiveValue,
  transformValue,
} from "./utils.js";

export function sx(item, obj = {}, THROTTLE_DELAY = 30) {
    const BASE_STYLES = {};
    const RESPONSIVE_PROPS = {};

    for (let key in obj) {
      const prop = ALIASES[key] ?? key;
      const value = obj[key];
      if(isResponsiveValue(value)){
        const transformed = {}
          for(let key in value) 
            transformed[key] = transformValue(prop, value[key])
          RESPONSIVE_PROPS[prop] = transformed 
      }
      else BASE_STYLES[prop] = transformValue(prop, value);
    }
    item.style(BASE_STYLES);

    const BREAKPOINTS_STYLES_MAP = createBreakpointsStyleMap()

    for(let prop in RESPONSIVE_PROPS){
      for(let bp of BREAKPOINTS){
        BREAKPOINTS_STYLES_MAP[bp][prop] = RESPONSIVE_PROPS[prop][bp] ?? RESPONSIVE_PROPS[prop]['base'] ?? ''
      }
    }
    
    item.onResizeView(
        throttle(()=>{
          const w = item.element.clientWidth;
          for(let bp of BREAKPOINTS){
            if(BREAKPOINTS_STYLES_MAP[bp] && w < BREAKPOINTS_MAP[bp]){
              return item.style(BREAKPOINTS_STYLES_MAP [bp])
            } 
          }
      }, THROTTLE_DELAY)
    )
    // console.log({BREAKPOINTS, BREAKPOINTS_MAP, BREAKPOINTS_STYLES_MAP})
  }

// export class ZextraUI extends UIElement {
  
// }