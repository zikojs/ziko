export class AttrUpdateEvent extends CustomEvent {
    constructor(name, oldValue, newValue) {
        super('attrupdate', {
            bubbles: true
        });

        Object.assign(this, { name, oldValue, newValue });
    }
}

export function registerAttrUpdateEvent(element) {
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type !== 'attributes') continue;

            element.dispatchEvent(new AttrUpdateEvent(
                mutation.attributeName,
                mutation.oldValue,
                element.getAttribute(mutation.attributeName)
            ));
        }
    });

    observer.observe(element, {
        attributes: true,
        attributeOldValue: true
    });

    return () => observer.disconnect();
}