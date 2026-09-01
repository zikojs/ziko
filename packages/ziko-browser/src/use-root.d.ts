export declare class UseRoot<PropMap extends Record<string, string>> {
    constructor(PropsMap: PropMap, options?: UseRootOptions);

    currentPropsMap: PropMap;
    namespace: string;
    ValidateCssProps: boolean;

    /** Dynamically created CSS variable references */
    [K in keyof PropMap]: string;

    /**
     * Apply a new set of properties
     */
    use(PropsMap: PropMap): this;
}
