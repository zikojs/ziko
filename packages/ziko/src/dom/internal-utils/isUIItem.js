import { isStateGetter } from '../../hooks/state/use-state.js'
import { UIElement } from '../UIElement/index.js'
export const isUIItem = item => {
    return (
        ['string', 'number'].includes(item)
        || isStateGetter(item)
        || item instanceof HTMLElement
        || item instanceof UIElement
    )
}