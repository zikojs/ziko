import Delay from "@components/Delay";

export default function Page({ delay = 1000 } = {}) {

  console.log(delay)

  return Delay({
    delay,
    fallback: "Loading...",
    children: `This appears after ${delay} ms.`
  });
}