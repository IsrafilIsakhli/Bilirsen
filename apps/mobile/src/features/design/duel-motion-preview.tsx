import { useCallback, useState } from 'react';
import { AppState, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import { Body, Button } from '../../components/studio';
import { DuelStageContent } from '../duel/duel-stage';
import { sampleDuel } from './design-samples';

const stages = ['faceoff', 'overtime', 'victory'] as const;
export function DuelMotionPreview() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const reduced = useReducedMotion();
  useFocusEffect(
    useCallback(() => {
      if (!playing || reduced) return;
      let timer: ReturnType<typeof setInterval> | undefined;
      function stop() {
        if (timer) clearInterval(timer);
        timer = undefined;
      }
      function start() {
        stop();
        timer = setInterval(() => setIndex((previous) => (previous + 1) % stages.length), 2500);
      }
      if (AppState.currentState === 'active') start();
      const subscription = AppState.addEventListener('change', (state) =>
        state === 'active' ? start() : stop(),
      );
      return () => {
        stop();
        subscription.remove();
      };
    }, [playing, reduced]),
  );
  const stage = stages[index];
  if (!stage) throw new Error('Unknown motion preview stage.');
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 8, alignItems: 'stretch' }}>
        <View style={{ flex: 1 }}>
          <Button
            title={playing ? 'Hərəkəti dayandır' : 'Hərəkəti başlat'}
            disabled={reduced}
            onPress={() => setPlaying(!playing)}
            quiet
          />
        </View>
        <View style={{ flex: 1 }}>
          <Button
            title="Növbəti keçidi göstər"
            onPress={() => {
              setPlaying(false);
              setIndex((previous) => (previous + 1) % stages.length);
            }}
            quiet
          />
        </View>
      </View>
      {reduced && (
        <Body>Telefonunda azaldılmış hərəkət aktivdir. Keçidləri düymə ilə göstərə bilərsən.</Body>
      )}
      <DuelStageContent display={sampleDuel(stage)} />
    </View>
  );
}
