import {
    useState,
    useEffect
} from '../../state/index.js';
import { useEventEmitter } from '../../communication/event-emitter/index.js';
export const useDocumentVisibility = (withEmitter = true) => {
    const [isVisible, setVisible] = useState(
        document.visibilityState === 'visible'
    );
    let emitter;
    const EVENT = Symbol.for('ziko:visibility-changed');
    if (withEmitter) emitter = useEventEmitter();
    useEffect(() => {
        const handleVisibilityChange = () => {
            setVisible(document.visibilityState === 'visible');
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
        };
    }, []);

    useEffect(
        ([visible]) => {
            emitter?.emit(EVENT, visible);
        },
        [isVisible]
    );
    const onChange = (callback) => emitter.on(EVENT, callback);
    const res = [isVisible];
    if (withEmitter) res.push(onChange);
    return res;
};