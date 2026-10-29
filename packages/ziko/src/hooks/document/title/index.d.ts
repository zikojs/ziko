import type {
    StateGetter,
    SetStateAction
} from '../../state/index.js';

export type TitleChangeCallback = (title: string) => void;

export type TitleChangeListener = (
    callback: TitleChangeCallback
) => void;

export type TitleStateSetter = (
    newValue: SetStateAction<string>
) => void;

export type UseTitleResult = [
    title: StateGetter<string>,
    setTitle: TitleStateSetter
];

export type UseTitleResultWithEmitter = [
    title: StateGetter<string>,
    setTitle: TitleStateSetter,
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