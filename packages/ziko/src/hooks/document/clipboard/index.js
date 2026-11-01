import {
    useState,
    useEffect
} from '../../state/index.js';

import { useEventEmitter } from '../../communication/event-emitter/index.js';

export const useClipboard = (withEmitter = true) => {
    const [text, setText] = useState('');

    let emitter;
    const EVENT = Symbol.for('ziko:clipboard-changed');

    if (withEmitter) {
        emitter = useEventEmitter();
    }

    const copy = async (value) => {
        await navigator.clipboard.writeText(value);
        setText(value);
        return true;
    };

    const read = async () => {
        const value = await navigator.clipboard.readText();
        setText(value);
        return value;
    };

    useEffect(
        ([value]) => {
            emitter?.emit(EVENT, value);
        },
        [text]
    );

    const onChange = (callback) => emitter.on(EVENT, callback);

    const res = [text, copy, read];

    if (withEmitter) res.push(onChange);

    return res;
};