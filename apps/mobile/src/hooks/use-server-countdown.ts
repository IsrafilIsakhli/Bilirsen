import { useCallback, useEffect, useRef, useState } from 'react';
export function useServerCountdown(deadlineAt: string | undefined, serverNow: string | undefined) {
  const endsAt = useRef(0);
  const readRemaining = useCallback(
    () => Math.max(0, (endsAt.current - performance.now()) / 1000),
    [],
  );
  const [clock, setClock] = useState<{ deadline: string | undefined; remaining: number }>({
    deadline: undefined,
    remaining: 0,
  });
  useEffect(() => {
    if (!deadlineAt || !serverNow) {
      endsAt.current = 0;
      return;
    }
    endsAt.current =
      performance.now() + new Date(deadlineAt).getTime() - new Date(serverNow).getTime();
    const update = () => {
      const remaining = Math.ceil(readRemaining());
      setClock((previous) =>
        previous.deadline === deadlineAt && previous.remaining === remaining
          ? previous
          : { deadline: deadlineAt, remaining },
      );
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [deadlineAt, serverNow, readRemaining]);
  // The first render of a new question must not reuse the preceding question's clock.
  const remaining =
    !deadlineAt || !serverNow
      ? 0
      : clock.deadline === deadlineAt
        ? clock.remaining
        : Math.max(
            0,
            Math.ceil((new Date(deadlineAt).getTime() - new Date(serverNow).getTime()) / 1000),
          );
  return { remaining, readRemaining };
}
