import { useCallback, useEffect, useMemo, useState } from "react";

export const useToggle = (num1: number, num2: number): [number, () => void] => {
  const [current, setCurrent] = useState(num1);

  useEffect(() => setCurrent(num1), [num1]);

  const other = useMemo(
    () => (current === num1 ? num2 : num1),
    [current, num1, num2]
  );

  const toggle = useCallback(() => setCurrent(other), [other]);

  return [current, toggle];
};
