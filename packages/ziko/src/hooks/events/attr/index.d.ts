/**
 * Custom event dispatched when an element's attribute changes.
 *
 * @example
 * element.addEventListener('attrupdate', (event: AttrUpdateEvent) => {
 *     console.log(event.name);     // Attribute name
 *     console.log(event.oldValue); // Previous value
 *     console.log(event.newValue); // Current value
 * });
 */
export class AttrUpdateEvent extends CustomEvent {
    /** Name of the updated attribute. */
    name: string;

    /** Previous attribute value. */
    oldValue: string | null;

    /** New attribute value. */
    newValue: string | null;

    constructor(name: string, oldValue: string | null, newValue: string | null);
}

/**
 * Registers the `attrupdate` custom event on an element.
 *
 * Observes attribute mutations and dispatches an `AttrUpdateEvent`
 * whenever an attribute changes.
 *
 * @param element - The element to observe.
 * @returns A cleanup function that disconnects the observer.
 *
 * @example
 * const destroy = registerAttrUpdateEvent(element);
 *
 * element.addEventListener('attrupdate', event => {
 *     console.log(`${event.name}: ${event.oldValue} → ${event.newValue}`);
 * });
 *
 * // Stop observing
 * destroy();
 */
export function registerAttrUpdateEvent(element: Element): () => void;