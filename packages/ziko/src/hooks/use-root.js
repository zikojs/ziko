class UseRoot {
    constructor(PropsMap, { namespace = 'Ziko', ValidateCssProps = false } = {}) {
        this.currentPropsMap = PropsMap;
        this.namespace = namespace;
        this.ValidateCssProps = ValidateCssProps;
        this.use(PropsMap);
    }

    use(PropsMap) {
        if (this.ValidateCssProps) ValidateCssPropsFn(PropsMap);
        this.currentPropsMap = PropsMap;
        this.#maintain();
        return this;
    }

    #maintain() {
        const root = globalThis?.document?.documentElement?.style;
        for (const prop in this.currentPropsMap) {
            const cssProp = this.namespace ? `--${this.namespace}-${prop}` : `--${prop}`;
            root.setProperty(cssProp, this.currentPropsMap[prop]);

            Object.defineProperty(this, prop, {
                value: `var(${cssProp})`,
                writable: true,
                configurable: true,
                enumerable: false
            });
        }
    }
}

function ValidateCssPropsFn(PropsMap) {
    const validProps = new Set(Object.keys(document.documentElement.style));
    for (const key in PropsMap) {
        if (!validProps.has(key)) {
            throw new Error(`Invalid CSS property: "${key}"`);
        }
    }
}

const useRoot = (PropsMap, options = {}) => new UseRoot(PropsMap, options);

export { 
    UseRoot, 
    useRoot
};


// Usage 

/*
const Styles = {
 S1 : {
  background : 'white',
  color : 'darkblue'
  border : '2px darkblue solid"'
 },
 S2 : {
  background : 'darkblue',
  color : 'white'
  border : '2px green solid"'
 }
}
const {use, border, background, color} = useRoot(Style.S1)

tags.p("Test useRoot ").style({
  border,
  color,
  background,
  padding : '10px'
})

*/