import type { StateGetter } from '../state/use-state/index.d.ts';

export type TitleChangeCallback = (title: string) => void;

export type TitleChangeListener = (
    callback: TitleChangeCallback
) => void;

export type UseTitleResult = [
    title: StateGetter<string>,
    setTitle: (newValue: string | ((prev: string) => string)) => void
];

export type UseTitleResultWithEmitter = [
    title: StateGetter<string>,
    setTitle: (newValue: string | ((prev: string) => string)) => void,
    onChange: TitleChangeListener
];

export declare function useTitle(
    title?: string,
    withEmitter?: true
): UseTitleResultWithEmitter;

export declare function useTitle(
    title: string | undefined,
    withEmitter: false
): UseTitleResult;

export declare function useTitle(
    title?: string,
    withEmitter?: boolean
): UseTitleResult | UseTitleResultWithEmitter;