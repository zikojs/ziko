import { isStateGetter } from '../../hooks/use-state.js'
import { UIElement } from '../UIElement/index.js'
export const is_ui_item = item => {
    return (
        ['string', 'number'].includes(item)
        || isStateGetter(item)
        || item instanceof HTMLElement
        || item instanceof UIElement
    )
}