import { useCallback, useMemo, useState } from "react";

export default function useToggle(
  num1: number,
  num2: number,
  initial: number // must be either num1 or num2
): [number, () => void] {
  const [current, setCurrent] = useState(initial);

  const other = useMemo(
    () => (current === num1 ? num2 : num1),
    [current, num1, num2]
  );

  const toggle = useCallback(() => setCurrent(other), [other]);

  return [current, toggle];
}
