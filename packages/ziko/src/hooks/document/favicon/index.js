import {
    useState,
    useEffect
} from '../../state/index.js';

import { useEventEmitter } from '../../use-event-emitter.js';

export const useFavicon = (
    href,
    withEmitter = true
) => {
    // Resolve the favicon element once
    let link = document.querySelector('link[rel~="icon"]');

    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    const [_href, setHref] = useState(href ?? link.href ?? '');
    const emitter = withEmitter ? useEventEmitter() : undefined;

    const EVENT = Symbol.for('ziko:favicon-changed');

    useEffect(
        ([newHref]) => {
            link.href = newHref;
            emitter?.emit(EVENT, newHref);
        },
        [_href]
    );

    const onChange = (callback) => emitter.on(EVENT, callback);

    const res = [_href, setHref];

    if (withEmitter) res.push(onChange);

    return res;
};