import { tags } from 'ziko/dom';
import { useState, useDerived, useEffect } from 'ziko/hooks';

const { div } = tags;

export default function Delay({
  delay = 0,
  fallback = null,
  children,
}) {

    // Should fix use derived 
    
  const [ready, setReady] = useState(delay === 0);
  const getContent = (r) => r ? children : fallback
  const content = useDerived(t => getContent(t) , [ready] );
  
  if (delay > 0) {
    setTimeout(() => {
      setReady(true);
    }, delay);
  }

  useEffect(e=>console.log(e), [content])
  
  return div(content);
}