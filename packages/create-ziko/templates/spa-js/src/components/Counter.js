import { tags } from 'ziko/dom';
import { useState } from 'ziko/hooks'

const { div, span, button } = tags;

  const styles = {
    container: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      width: "fit-content",
    },
    value: {
      minWidth: "50px",
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "600",
    },
    button: {
      width: "36px",
      height: "36px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "20px",
    },
  };

export default function Counter({ start = 0, step = 1 }) {
  const [count, setCount] = useState(start);

  return div(
    button('−').onClick(
        () => setCount(count => count -= step)
    ).style(styles.button),
    span(count).style(styles.value),
    button('+').onClick(
        () => setCount(count => count += step)
    ).style(styles.button)
  ).style(styles.container);
}