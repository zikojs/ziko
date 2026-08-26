export function define_wc(name, UI_Constructor, props = {}, { mode = 'open'} = {}) {
    if (globalThis.customElements?.get(name)) {
        console.warn(`Custom element "${name}" is already defined`);
        return;
    }
    if(name.search('-') === -1){
        console.warn(`"${name}" is not a valid custom element name`);
        return; 
    }
    globalThis.customElements?.define(
        name,
        class extends HTMLElement {
            static get observedAttributes() {
                return ['style', ...Object.keys(props)];
            }

            constructor() {
                super();
                this.attachShadow({ mode });
                this.props = {};
                this.mask = {
                    ...props,
                    // style: { type: Object }
                };
            }

            connectedCallback() {
                this.render();
            }

            render() {
                this.shadowRoot.innerHTML = '';
                const item = UI_Constructor(this.props);
                if(item instanceof Array) item.forEach(n => n.mount(this.shadowRoot)) 
                else item.mount(this.shadowRoot)
            }

            attributeChangedCallback(name, _, newValue) {
                Object.assign(this.props, {
                    [name]: this.mask[name].type(newValue)
                });
                this.render();
            }
        }
    );
}
