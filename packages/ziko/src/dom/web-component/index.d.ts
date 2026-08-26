import { UIElement } from "../constructors/UIElement";

export interface WCPropDefinition {
    type: (value: any) => any; // function to convert attribute string to prop value
}

export declare function define_wc(
    name: `${string}-${string}`,
    UI_Constructor: (props: Record<string, any>) => UIElement | UIElement[],
    props?: Record<string, WCPropDefinition>,
    options?: {
        mode? : ShadowRootMode
    }
): void;
