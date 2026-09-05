import { UILayout } from '../Layout/index.js';

export function Page(options, ...ui){
    return () => new UILayout(options, ...ui)
}