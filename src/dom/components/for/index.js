import { Fragment, UIFragment } from "../Fragment/index.js";

class UIFor extends UIFragment{
    constructor({each, fallback, mapFn = () => {}} = {}){
        super()
        this.config = {
            each,
            fallback,
            mapFn
        }
        this.append(
            ...this.config.each.map((n,i) => this.config.mapFn(n, i))
        )
    }
}

export const For = ({each, fallback, mapFn} = {}) => new UIFor({each, fallback, mapFn})