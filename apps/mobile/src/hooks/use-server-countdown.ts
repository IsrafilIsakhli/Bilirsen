import { useEffect, useState } from 'react';
export function useServerCountdown(
  deadlineAt: string | undefined,
  serverNow: string | undefined,
): number {
  const [clock, setClock] = useState<{ deadline: string | undefined; remaining: number }>({
    deadline: undefined,
    remaining: 0,
  });
  useEffect(() => {
    if (!deadlineAt || !serverNow) return;
    const baseline = performance.now();
    const duration = new Date(deadlineAt).getTime() - new Date(serverNow).getTime();
    const update = () => {
      const remaining = Math.max(0, Math.ceil((duration - (performance.now() - baseline)) / 1000));
      setClock((previous) =>
        previous.deadline === deadlineAt && previous.remaining === remaining
          ? previous
          : { deadline: deadlineAt, remaining },
      );
    };
    update();
    const interval = setInterval(update, 100);
    return () => clearInterval(interval);
  }, [deadlineAt, serverNow]);
  if (!deadlineAt || !serverNow) return 0;
  // The first render of a new question must not reuse the preceding question's clock.
  return clock.deadline === deadlineAt
    ? clock.remaining
    : Math.max(
        0,
        Math.ceil((new Date(deadlineAt).getTime() - new Date(serverNow).getTime()) / 1000),
      );
}
