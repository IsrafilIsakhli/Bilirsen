import { useCallback, useEffect, useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import type { GameSnapshot } from '@azquiz/contracts';
import { useSounds } from '../../services/audio/sound-provider';

export function useGameSounds(
  snapshot: GameSnapshot | undefined,
  remaining: number,
  suspended: boolean,
) {
  const { play, stop, syncTimer, timerAvailable } = useSounds();
  const focused = useRef(false);
  const heard = useRef(new Set<string>());
  useFocusEffect(
    useCallback(() => {
      focused.current = true;
      return () => {
        focused.current = false;
        stop();
      };
    }, [stop]),
  );
  useEffect(() => {
    const question = snapshot?.question;
    if (!question) {
      syncTimer(null);
      return;
    }
    if (snapshot.feedback) {
      syncTimer(null);
      if (!heard.current.has(question.id)) {
        stop();
        heard.current.add(question.id);
        if (focused.current && snapshot.feedback.selected !== null)
          play(snapshot.feedback.correct ? 'correct' : 'wrong');
      }
      return;
    }
    if (
      focused.current &&
      !suspended &&
      timerAvailable &&
      snapshot.status === 'question_open' &&
      remaining > 0
    ) {
      syncTimer({
        questionId: question.id,
        durationSeconds: question.durationSeconds,
        remainingSeconds: remaining,
      });
    } else syncTimer(null);
  }, [
    snapshot?.question?.id,
    snapshot?.status,
    snapshot?.feedback,
    remaining,
    suspended,
    timerAvailable,
    syncTimer,
    play,
    stop,
  ]);
  useEffect(() => {
    if (suspended) stop();
  }, [suspended, stop]);
}
