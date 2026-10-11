import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { PropsWithChildren } from 'react';
import { AppState, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import type { AudioPlayer } from 'expo-audio';
import { z } from 'zod';
import tickSource from '../../../assets/sounds/tick.wav';
import tick20Source from '../../../assets/sounds/tick-20.wav';
import tick25Source from '../../../assets/sounds/tick-25.wav';
import correctSource from '../../../assets/sounds/correct.wav';
import wrongSource from '../../../assets/sounds/wrong.wav';

const preferencesSchema = z.object({ enabled: z.boolean(), timerEnabled: z.boolean() });
type Preferences = z.infer<typeof preferencesSchema>;
export type SoundCue = 'tick' | 'correct' | 'wrong';
export type TimerSoundRequest = {
  questionId: string;
  durationSeconds: number;
  remainingSeconds: number;
};
const key = 'bilirsen.sound.v1';
const defaults: Preferences = { enabled: true, timerEnabled: true };
type SoundControls = {
  preferences: Preferences;
  error: string | null;
  play: (cue: SoundCue) => void;
  stop: () => void;
  syncTimer: (request: TimerSoundRequest | null) => void;
  timerAvailable: boolean;
  update: (change: Partial<Preferences>) => void;
};
const SoundContext = createContext<SoundControls | null>(null);

export function SoundProvider({ children }: PropsWithChildren) {
  const tick = useAudioPlayer(tickSource);
  const tickStatus = useAudioPlayerStatus(tick);
  const tick20 = useAudioPlayer(tick20Source);
  const tick25 = useAudioPlayer(tick25Source);
  const tick20Status = useAudioPlayerStatus(tick20);
  const tick25Status = useAudioPlayerStatus(tick25);
  const correct = useAudioPlayer(correctSource);
  const wrong = useAudioPlayer(wrongSource);
  const players = useMemo(
    () => ({ tick, tick20, tick25, correct, wrong }),
    [tick, tick20, tick25, correct, wrong],
  );
  const timerPlayers = useMemo(
    () => ({ 20: tick20, 25: tick25, 30: tick }),
    [tick, tick20, tick25],
  );
  const [preferences, setPreferences] = useState(defaults);
  const [playbackError, setPlaybackError] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const settings = useRef(defaults);
  const preferenceRevision = useRef(0);
  const active = useRef(AppState.currentState === 'active');
  const configured = useRef(false);
  const [audioReady, setAudioReady] = useState(false);
  const [appActive, setAppActive] = useState(active.current);
  const timerPlayback = useRef<{ key: string; pending: boolean; player: AudioPlayer } | null>(null);
  const generation = useRef(0);
  const writeQueue = useRef(Promise.resolve());
  const stop = useCallback(() => {
    generation.current += 1;
    timerPlayback.current = null;
    for (const player of Object.values(players)) player.pause();
  }, [players]);

  useEffect(() => {
    let mounted = true;
    async function initialize() {
      const initialRevision = preferenceRevision.current;
      let audioReady = false;
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: false,
          allowsRecording: false,
          interruptionMode: 'mixWithOthers',
        });
        audioReady = true;
      } catch {
        if (mounted) setPlaybackError('Səs sistemi açıla bilmədi. Tətbiqi yenidən açıb yoxla.');
      }
      try {
        const stored = Platform.OS === 'web' ? null : await SecureStore.getItemAsync(key);
        if (stored && mounted && preferenceRevision.current === initialRevision) {
          settings.current = preferencesSchema.parse(JSON.parse(stored));
          setPreferences(settings.current);
        }
      } catch {
        if (mounted) setStorageError('Səs ayarları oxunmadı. Standart ayarlar istifadə olunur.');
      }
      if (mounted) {
        configured.current = audioReady;
        setAudioReady(audioReady);
      }
    }
    void initialize();
    const subscription = AppState.addEventListener('change', (state) => {
      active.current = state === 'active';
      setAppActive(active.current);
      if (!active.current) stop();
    });
    return () => {
      mounted = false;
      configured.current = false;
      generation.current += 1;
      subscription.remove();
    };
  }, [stop]);

  const update = useCallback(
    (change: Partial<Preferences>) => {
      const next = preferencesSchema.parse({ ...settings.current, ...change });
      preferenceRevision.current += 1;
      settings.current = next;
      setPreferences(next);
      stop();
      writeQueue.current = writeQueue.current.then(async () => {
        try {
          if (Platform.OS !== 'web') await SecureStore.setItemAsync(key, JSON.stringify(next));
          setStorageError(null);
        } catch {
          setStorageError(
            'Səs ayarı bu dəfə yadda saxlanmadı. Tətbiqi bağlayanda əvvəlki ayar qala bilər.',
          );
        }
      });
    },
    [stop],
  );

  const play = useCallback(
    (cue: SoundCue) => {
      const isTimer = cue === 'tick';
      const allowed = () =>
        configured.current &&
        active.current &&
        settings.current.enabled &&
        (!isTimer || settings.current.timerEnabled);
      if (!allowed()) return;
      const player = players[cue];
      if (!player.isLoaded) {
        setPlaybackError('Səs faylı hələ açılmayıb. Bir az sonra ayarlardan yenidən yoxla.');
        return;
      }
      stop();
      const currentGeneration = generation.current;
      async function replay() {
        try {
          await player.seekTo(0);
          if (currentGeneration !== generation.current || !allowed()) return;
          player.setPlaybackRate(1);
          player.volume = isTimer ? 0.5 : 0.6;
          player.play();
          setPlaybackError(null);
        } catch {
          setPlaybackError(
            'Səs çalınmadı. Telefonun səs səviyyəsini və tətbiqin səs ayarını yoxla.',
          );
        }
      }
      void replay();
    },
    [players, stop],
  );

  const syncTimer = useCallback(
    (request: TimerSoundRequest | null) => {
      const allowed =
        configured.current &&
        active.current &&
        settings.current.enabled &&
        settings.current.timerEnabled;
      if (!request || !allowed || request.remainingSeconds <= 0) {
        // Do not interrupt an answer verdict when repeated feedback stops an already stopped bed.
        if (timerPlayback.current) {
          generation.current += 1;
          timerPlayback.current.player.pause();
          timerPlayback.current = null;
        }
        return;
      }
      const duration = request.durationSeconds;
      if (duration !== 20 && duration !== 25 && duration !== 30) {
        stop();
        setPlaybackError('Sualın vaxtına uyğun fon səsi açıla bilmədi.');
        return;
      }
      const player = timerPlayers[duration];
      if (!player.isLoaded) return; // Loaded status retriggers synchronization.
      const key = request.questionId + ':' + request.durationSeconds;
      const position =
        duration * Math.max(0, Math.min(1, 1 - request.remainingSeconds / request.durationSeconds));
      if (
        timerPlayback.current?.key === key &&
        (timerPlayback.current.pending ||
          (player.playing && Math.abs(player.currentTime - position) < 1.8))
      )
        return;
      stop();
      const currentGeneration = generation.current;
      timerPlayback.current = { key, pending: true, player };
      async function start() {
        try {
          await player.seekTo(position);
          if (
            generation.current !== currentGeneration ||
            !active.current ||
            !settings.current.enabled ||
            !settings.current.timerEnabled
          )
            return;
          // Tempo is authored into each track. No live stretching or pitch processing.
          player.shouldCorrectPitch = false;
          player.setPlaybackRate(1);
          player.volume = 0.5;
          player.play();
          timerPlayback.current = { key, pending: false, player };
          setPlaybackError(null);
        } catch {
          if (generation.current !== currentGeneration) return;
          timerPlayback.current = null;
          setPlaybackError('Fon səsi çalınmadı. Səs ayarlarından yenidən yoxla.');
        }
      }
      void start();
    },
    [timerPlayers, stop],
  );

  const timerAvailable =
    audioReady &&
    tickStatus.isLoaded &&
    tick20Status.isLoaded &&
    tick25Status.isLoaded &&
    appActive &&
    preferences.enabled &&
    preferences.timerEnabled;

  const error = playbackError ?? storageError;
  const controls = useMemo(
    () => ({ preferences, error, play, stop, syncTimer, timerAvailable, update }),
    [preferences, error, play, stop, syncTimer, timerAvailable, update],
  );
  return <SoundContext.Provider value={controls}>{children}</SoundContext.Provider>;
}

export function useSounds(): SoundControls {
  const controls = useContext(SoundContext);
  if (!controls) throw new Error('SoundProvider is required');
  return controls;
}
