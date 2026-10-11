import { useEffect, useRef, useState } from 'react';
import { BackHandler, Modal, Platform, Pressable, View, StyleSheet } from 'react-native';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as Crypto from 'expo-crypto';
import { gameSchema } from '@azquiz/contracts';
import type { OptionKey, GameSnapshot } from '@azquiz/contracts';
import {
  Screen,
  Title,
  Label,
  Body,
  Icon,
  Button,
  ErrorNotice,
  LoadingScreen,
  layout,
} from '../../components/studio';
import { request, errorMessage, ApiError } from '../../services/http/client';
import { ConnectionNotice } from '../../components/connection-notice';
import { keys } from '../../services/http/queries';
import { AnswerOption } from '../../features/solo/answer-option';
import { SoloResult } from '../../features/solo/result';
import { useServerCountdown } from '../../hooks/use-server-countdown';
import { colors } from '../../theme/tokens';
import { QuestionFrame } from '../../components/question-frame';
import { useSounds } from '../../services/audio/sound-provider';
import { useGameSounds } from './use-game-sounds';
import { QuestionStatus } from './question-status';
import { AnswerFeedback } from './answer-feedback';

export default function Solo() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const client = useQueryClient();
  const [confirm, setConfirm] = useState(false);
  const command = useRef<{ commandId: string; questionId: string; option: OptionKey } | null>(null);
  const leaveCommand = useRef(Crypto.randomUUID());
  const game = useQuery({
    queryKey: keys.game(id),
    queryFn: () => request(`/games/${id}`, gameSchema),
    refetchInterval: (query) =>
      query.state.data?.status === 'finished' || query.state.data?.status === 'cancelled_server'
        ? false
        : 700,
    staleTime: 0,
    enabled: Boolean(id),
    structuralSharing: (oldData, newData) => {
      const previous = gameSchema.safeParse(oldData);
      const incoming = gameSchema.parse(newData);
      return previous.success && previous.data.revision > incoming.revision
        ? previous.data
        : incoming;
    },
  });
  function accept(snapshot: GameSnapshot) {
    client.setQueryData<GameSnapshot>(keys.game(id), (previous) =>
      previous && previous.revision > snapshot.revision ? previous : snapshot,
    );
  }
  const answer = useMutation({
    mutationFn: (body: NonNullable<typeof command.current>) =>
      request(`/games/${id}/answers`, gameSchema, { method: 'POST', body }),
    onSuccess: accept,
    onError: () => {
      void game.refetch();
    },
  });
  const leave = useMutation({
    mutationFn: () =>
      request(`/games/${id}/leave`, gameSchema, {
        method: 'POST',
        body: { commandId: leaveCommand.current },
      }),
    onSuccess: (snapshot) => {
      accept(snapshot);
      setConfirm(false);
    },
  });
  const snapshot = game.data;
  const question = snapshot?.question;
  const remaining = useServerCountdown(question?.deadlineAt, snapshot?.serverNow);
  const sounds = useSounds();
  useGameSounds(
    snapshot,
    remaining,
    confirm ||
      answer.isPending ||
      command.current?.questionId === question?.id ||
      Boolean(game.error),
  );
  useEffect(() => {
    command.current = null;
    answer.reset();
  }, [question?.id]);
  useEffect(() => {
    if (snapshot?.status !== 'finished' && snapshot?.status !== 'cancelled_server') return;
    void client.invalidateQueries({ queryKey: keys.profile });
    void client.invalidateQueries({ queryKey: keys.history });
    void client.invalidateQueries({ queryKey: keys.active });
  }, [snapshot?.status, client]);
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (snapshot?.status === 'question_open' || snapshot?.status === 'question_closed') {
        setConfirm(true);
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [snapshot?.status]);
  if (!id)
    return (
      <Screen>
        <ErrorNotice message="Yarış seçilməyib." />
        <Button title="Ana səhifə" onPress={() => router.replace('/(tabs)')} />
      </Screen>
    );
  if (game.isPending) return <LoadingScreen message="Sual hazırlanır…" />;
  if (!snapshot)
    return (
      <Screen>
        <ErrorNotice
          message={errorMessage(game.error)}
          onRetry={() => {
            void game.refetch();
          }}
        />
      </Screen>
    );
  if (snapshot.status === 'finished' && snapshot.result)
    return <SoloResult result={snapshot.result} />;
  if (snapshot.status === 'cancelled_server')
    return (
      <Screen>
        <Title>Yarış dayandırıldı</Title>
        <Body>Serverdəki texniki problemə görə bu tur bağlandı. Rankına təsir edilmədi.</Body>
        <Button title="Ana səhifəyə qayıt" onPress={() => router.replace('/(tabs)')} />
      </Screen>
    );
  if (!question) return <LoadingScreen />;
  const feedback = snapshot.feedback;
  const pendingSelection =
    command.current?.questionId === question.id ? command.current.option : null;
  const disabled =
    feedback !== null ||
    answer.isPending ||
    pendingSelection !== null ||
    remaining === 0 ||
    Boolean(game.error);
  return (
    <>
      <Stack.Screen options={{ gestureEnabled: false }} />
      <Screen atmosphere="question" style={{ gap: 14 }}>
        <View style={layout.between}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Yarışdan çıx"
            onPress={() => setConfirm(true)}
            style={styles.iconControl}
          >
            <Icon name="close" color={colors.text} />
          </Pressable>
          <Label>Tək oyun</Label>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={sounds.preferences.enabled ? 'Səsi söndür' : 'Səsi aç'}
            style={styles.iconControl}
            onPress={() => sounds.update({ enabled: !sounds.preferences.enabled })}
          >
            <Icon
              name={sounds.preferences.enabled ? 'volume-medium-outline' : 'volume-mute-outline'}
              color={colors.gold}
            />
          </Pressable>
        </View>
        <QuestionStatus snapshot={snapshot} remaining={remaining} />
        <QuestionFrame
          key={question.id}
          text={question.text}
          caption={`${question.points} XALLIQ SUAL`}
          state={
            feedback && feedback.selected !== null
              ? feedback.correct
                ? 'correct'
                : 'wrong'
              : 'neutral'
          }
        />
        <View style={{ gap: 10 }}>
          {question.options.map((option) => (
            <AnswerOption
              key={option.key}
              option={option}
              disabled={disabled}
              dimmed={
                feedback !== null &&
                feedback.correctOption !== option.key &&
                feedback.selected !== option.key
              }
              state={
                feedback?.correctOption === option.key
                  ? 'correct'
                  : feedback?.selected === option.key
                    ? 'wrong'
                    : pendingSelection === option.key
                      ? 'pending'
                      : 'neutral'
              }
              onPress={() => {
                const body = {
                  commandId: Crypto.randomUUID(),
                  questionId: question.id,
                  option: option.key,
                };
                command.current = body;
                answer.mutate(body);
              }}
            />
          ))}
        </View>
        <AnswerFeedback feedback={feedback} pending={pendingSelection !== null} />
        {game.error instanceof ApiError && game.error.code === 'network_error' ? (
          <ConnectionNotice
            message={errorMessage(game.error)}
            timedGame
            onRetry={() => {
              void game.refetch();
            }}
          />
        ) : (
          game.error && (
            <ErrorNotice
              message={errorMessage(game.error)}
              onRetry={() => {
                void game.refetch();
              }}
            />
          )
        )}
        {answer.error && !feedback && (
          <ErrorNotice
            message={errorMessage(answer.error)}
            onRetry={
              command.current
                ? () => {
                    if (command.current) answer.mutate(command.current);
                  }
                : undefined
            }
          />
        )}
      </Screen>
      <Modal
        visible={confirm}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!leave.isPending) setConfirm(false);
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={layout.row}>
              <Icon name="exit-outline" color={colors.muted} size={26} />
              <View style={{ flex: 1 }}>
                <Title small>Yarışdan çıxırsan?</Title>
              </View>
            </View>
            <Body>
              Cavab verdiyin sualların rank dəyişiklikləri saxlanacaq. Qalan suallar cavabsız
              qalacaq.
            </Body>
            {leave.error && <ErrorNotice message={errorMessage(leave.error)} />}
            <Button
              title="Oyuna davam et"
              disabled={leave.isPending}
              onPress={() => setConfirm(false)}
            />
            <Button
              title="Turu bağla"
              outline
              loading={leave.isPending}
              onPress={() => leave.mutate()}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  iconControl: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#49698450',
    backgroundColor: '#12273b80',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: '#000b',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#0e2033',
    borderWidth: 1,
    borderColor: '#496883',
    borderRadius: 22,
    padding: 20,
    gap: 16,
    width: '100%',
    maxWidth: 430,
  },
});
