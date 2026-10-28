import { 
    useState,
    useEffect
} from '../../state/index.js';

import { useEventEmitter } from '../../use-event-emitter.js';


export const useTitle = (title = document.title, withEmitter = true) =>{
    const [_title, setTitle] = useState(title);
    let emiter;
    const EVENT = 'ziko:title-changed';
    if(withEmitter){
        emiter = useEventEmitter()
    }
    useEffect(
        ([newTitle]) => {
            document.title = newTitle;
            emiter?.emit(EVENT, newTitle)
        },
        [_title]
    )

    const onChange = (callback) => emiter.on(EVENT, callback);

    const res = [
        _title,
        setTitle
    ]

    if(withEmitter) res.push(onChange)
    
    return res
}