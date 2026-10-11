import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ReduceMotion } from 'react-native-reanimated';
import type { GameSnapshot } from '@azquiz/contracts';
import { Badge, Body, Button, Card, Icon, Label, layout } from '../../components/studio';
import { AvatarMedallion, Eyebrow, StudioNotice } from '../../components/studio-elements';
import { QuestionFrame } from '../../components/question-frame';
import { AnswerOption } from '../solo/answer-option';
import { colors } from '../../theme/tokens';

export type DuelStage = 'search' | 'faceoff' | 'question' | 'overtime' | 'victory' | 'defeat';
export interface DuelPlayerDisplay {
  name: string;
  score: number;
}
export interface DuelStageDisplay {
  stage: DuelStage;
  self: DuelPlayerDisplay;
  opponent: DuelPlayerDisplay;
  secondsLabel: string;
  rankDeltaLabel: string;
  questionNumber: number;
  totalQuestions: number;
  question: Pick<NonNullable<GameSnapshot['question']>, 'text' | 'options' | 'points'>;
}
const reveal = FadeIn.duration(220).reduceMotion(ReduceMotion.System);

// This component only presents supplied data. Matchmaking, deadlines and settlement
// must come from the duel service before these views can become live game screens.
export function DuelStageContent({ display }: { display: DuelStageDisplay }) {
  const { stage, self, opponent } = display;
  return (
    <Animated.View key={stage} entering={reveal} style={{ gap: stage === 'question' ? 12 : 16 }}>
      {stage === 'search' ? (
        <>
          <Hero
            title="Rəqibin axtarılır…"
            description="Sənə yaxın ranklı oyunçu ilə eyni səhnəyə çıxacaqsan."
          />
          <View style={styles.searchOrbit}>
            <View style={styles.innerOrbit}>
              <AvatarMedallion name={self.name} size={82} />
            </View>
          </View>
          <View style={layout.center}>
            <Label>{self.name}</Label>
            <TimePill label={display.secondsLabel} />
            <Body>İki rəqib. Eyni suallar.</Body>
          </View>
          <UnavailableAction title="Axtarışı dayandır" />
        </>
      ) : stage === 'faceoff' ? (
        <>
          <Hero title="Səhnə hazırdır." description="Eyni suallar. Bərabər şans." />
          <Players self={self} opponent={opponent} />
          <Card style={layout.center}>
            <Eyebrow>YARIŞ BAŞLAYIR</Eyebrow>
            <Text style={styles.countdown}>{display.secondsLabel}</Text>
            <Body>Son cavaba qədər diqqətli ol.</Body>
          </Card>
          <StudioNotice>Solo və duel rankı ayrıdır.</StudioNotice>
        </>
      ) : stage === 'question' ? (
        <>
          <Card style={{ padding: 12 }}>
            <View style={layout.between}>
              <ScorePlayer player={self} />
              <Eyebrow>DUEL</Eyebrow>
              <ScorePlayer player={opponent} />
            </View>
          </Card>
          <View style={layout.between}>
            <Eyebrow>
              SUAL {display.questionNumber} / {display.totalQuestions}
            </Eyebrow>
            <TimePill label={display.secondsLabel} />
          </View>
          <QuestionFrame
            text={display.question.text}
            caption={`${display.question.points} XALLIQ SUAL`}
          />
          <View style={{ gap: 10 }}>
            {display.question.options.map((option) => (
              <AnswerOption
                key={option.key}
                option={option}
                state="neutral"
                disabled
                onPress={() => undefined}
              />
            ))}
          </View>
          <Card style={{ padding: 12 }}>
            <View style={layout.row}>
              <Icon name="lock-closed-outline" size={18} color={colors.muted} />
              <Body>Rəqibin seçimi sual bağlananda açılır.</Body>
            </View>
          </Card>
        </>
      ) : stage === 'overtime' ? (
        <>
          <Hero
            title="Hələ bitmədi."
            description="Xallar bərabərdir. Səhnə üç yeni sualla davam edir."
          />
          <View style={layout.center}>
            <Badge icon="people-outline" duel />
          </View>
          <Card gold>
            <View style={layout.between}>
              <ScorePlayer player={self} />
              <Text style={styles.equal}>=</Text>
              <ScorePlayer player={opponent} />
            </View>
          </Card>
          <View style={styles.extra}>
            {[1, 2, 3].map((n) => (
              <View key={n} style={styles.extraTile}>
                <Text style={styles.extraNumber}>{n}</Text>
              </View>
            ))}
          </View>
          <StudioNotice>Yenə bərabərlik olsa, daha 3 sual ilə davam edəcək.</StudioNotice>
        </>
      ) : (
        <>
          <View style={styles.hero}>
            <Eyebrow>{stage === 'victory' ? 'SƏHNƏ SƏNİNDİR' : 'YENİ TUR, YENİ ŞANS'}</Eyebrow>
            <Badge icon={stage === 'victory' ? 'trophy-outline' : 'flag-outline'} large />
            <Text style={styles.title}>{stage === 'victory' ? 'Qələbə!' : 'Bu dəfə alınmadı'}</Text>
            <Body>
              {stage === 'victory'
                ? 'Son cavaba qədər bir addım öndə.'
                : 'Hər yarış növbəti üçün təcrübədir.'}
            </Body>
          </View>
          <Card style={{ gap: 16 }}>
            <ResultPlayer player={self} />
            <View style={styles.line} />
            <ResultPlayer player={opponent} />
            <View style={styles.line} />
            <Eyebrow>DUEL RANK DƏYİŞİKLİYİ</Eyebrow>
            <View style={layout.between}>
              <Text
                style={[styles.delta, { color: stage === 'victory' ? colors.gold : colors.red }]}
              >
                {display.rankDeltaLabel}
              </Text>
              <Icon
                name={stage === 'victory' ? 'trending-up' : 'trending-down'}
                size={28}
                color={stage === 'victory' ? colors.green : colors.red}
              />
            </View>
            <View style={styles.line} />
            <Body>Solo rankın dəyişmir.</Body>
          </Card>
          <UnavailableAction title="Yenidən duel" />
        </>
      )}
    </Animated.View>
  );
}
function Hero({ title, description }: { title: string; description: string }) {
  return (
    <View style={styles.hero}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}
function Players({ self, opponent }: { self: DuelPlayerDisplay; opponent: DuelPlayerDisplay }) {
  return (
    <View style={styles.players}>
      <Player player={self} />
      <Text style={styles.vs}>VS</Text>
      <Player player={opponent} />
    </View>
  );
}
function Player({ player }: { player: DuelPlayerDisplay }) {
  return (
    <View style={styles.player}>
      <AvatarMedallion name={player.name} size={82} />
      <Text style={styles.name}>{player.name}</Text>
    </View>
  );
}
function ScorePlayer({ player }: { player: DuelPlayerDisplay }) {
  return (
    <View style={{ flex: 1, minWidth: 0, alignItems: 'center', gap: 5 }}>
      <Text style={styles.name}>{player.name}</Text>
      <Text style={styles.score}>{player.score}</Text>
    </View>
  );
}
function ResultPlayer({ player }: { player: DuelPlayerDisplay }) {
  return (
    <View style={layout.between}>
      <View style={[layout.row, { flex: 1 }]}>
        <AvatarMedallion name={player.name} size={36} />
        <Text style={[styles.name, { flex: 1 }]}>{player.name}</Text>
      </View>
      <Text style={styles.score}>
        {player.score} <Text style={styles.unit}>xal</Text>
      </Text>
    </View>
  );
}
function TimePill({ label }: { label: string }) {
  return (
    <View style={styles.time}>
      <Icon name="time-outline" size={18} />
      <Text style={styles.timeText}>{label}</Text>
    </View>
  );
}
function UnavailableAction({ title }: { title: string }) {
  return <Button title={title} disabled onPress={() => undefined} />;
}
const styles = StyleSheet.create({
  hero: { alignItems: 'center', gap: 12, paddingVertical: 8 },
  title: {
    color: colors.text,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -0.7,
  },
  description: {
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 23,
    fontSize: 15,
    maxWidth: 300,
  },
  searchOrbit: {
    width: 146,
    height: 146,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#42658a60',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerOrbit: {
    width: 126,
    height: 126,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#e3b96880',
    backgroundColor: '#102337',
    alignItems: 'center',
    justifyContent: 'center',
  },
  players: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 12,
    paddingVertical: 12,
  },
  player: { alignItems: 'center', gap: 12, flex: 1, minWidth: 0 },
  name: { color: colors.text, fontWeight: '600', fontSize: 14, textAlign: 'center' },
  vs: { color: colors.gold, fontSize: 20, fontWeight: '700', letterSpacing: 2 },
  countdown: {
    color: colors.goldLight,
    fontSize: 64,
    fontWeight: '600',
    lineHeight: 76,
    fontVariant: ['tabular-nums'],
  },
  time: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderWidth: 1,
    borderColor: '#d8b56a80',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#112336',
  },
  timeText: { color: colors.gold, fontSize: 14, fontWeight: '700', fontVariant: ['tabular-nums'] },
  score: {
    color: colors.goldLight,
    fontSize: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  unit: { color: colors.muted, fontSize: 12, fontWeight: '400' },
  equal: { color: colors.muted, fontSize: 26 },
  extra: { flexDirection: 'row', justifyContent: 'center', gap: 16 },
  extraTile: {
    width: 52,
    height: 52,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#172b3d',
  },
  extraNumber: { color: colors.gold, fontSize: 26 },
  line: { height: 1, backgroundColor: colors.line },
  delta: { fontSize: 32, fontWeight: '700' },
});
