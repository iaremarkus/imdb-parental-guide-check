import { useEffect, useRef, useState } from "react";

export const useCaseSwapper = (originalText: string, timeout: number) => {
  const [text, setText] = useState<string>();

  let interval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    interval.current = setInterval(() => {
      setText(
        originalText
          .split("")
          .map(v => (Math.round(Math.random()) ? v.toUpperCase() : v.toLowerCase()))
          .join("")
      );
    }, timeout);

    return () => clearInterval(interval.current);
  }, [originalText, timeout]);

  return text;
};
