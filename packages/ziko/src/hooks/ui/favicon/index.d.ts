import type {
    StateGetter,
    SetStateAction
} from '../../state/index.js';

export type FavIconChangeCallback = (href: string) => void;

export type FavIconChangeListener = (
    callback: FavIconChangeCallback
) => void;

export type FavIconStateSetter = (
    newValue: SetStateAction<string>
) => void;

export type UseFavIconResult = [
    href: StateGetter<string>,
    setHref: FavIconStateSetter
];

export type UseFavIconResultWithEmitter = [
    href: StateGetter<string>,
    setHref: FavIconStateSetter,
    onChange: FavIconChangeListener
];

export declare function useFavIcon(
    href?: string,
    withEmitter?: true
): UseFavIconResultWithEmitter;

export declare function useFavIcon(
    href: string | undefined,
    withEmitter: false
): UseFavIconResult;

export declare function useFavIcon(
    href?: string,
    withEmitter?: boolean
): UseFavIconResult | UseFavIconResultWithEmitter;