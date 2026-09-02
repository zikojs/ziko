export declare function debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay?: number
): (...args: Parameters<T>) => void;
