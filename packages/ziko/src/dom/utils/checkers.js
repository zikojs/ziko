import { isStateGetter } from '../../hooks/use-state.js'
import { UIElement } from '../constructors/UIElement.js'

export const is_primitive = (value) => typeof value !== 'object' && typeof value !== 'function' || value === null;
export const is_ui_item = item => {
    return (
        ['string', 'number'].includes(item)
        || isStateGetter(item)
        || item instanceof HTMLElement
        || item instanceof UIElement
    )
}