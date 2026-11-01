import {
    useState,
    useEffect
} from '../../state/index.js';
import { useEventEmitter } from '../../communication/event-emitter/index.js';
export const useOnline = (withEmitter = true) => {
    const [isOnline, setOnline] = useState(navigator.onLine);
    let emitter;
    const EVENT = Symbol.for('ziko:online-changed');
    if (withEmitter) emitter = useEventEmitter();
    useEffect(() => {
        const handleOnline = () => setOnline(true);
        const handleOffline = () => setOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    useEffect(
        ([online]) => {
            emitter?.emit(EVENT, online);
        },
        [isOnline]
    );
    const onChange = (callback) => emitter.on(EVENT, callback);
    const res = [isOnline, () => setOnline(navigator.onLine)];
    if (withEmitter) res.push(onChange);
    return res;
};