import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Label, Icon, ErrorNotice, layout, Button } from '../../components/studio';
import { SectionHeading, EmptyStage, StudioNotice } from '../../components/studio-elements';
import { SegmentedControl } from '../../components/segmented-control';
import { PageHeader } from '../../components/page-header';
import { keys, useHistory } from '../../services/http/queries';
import { useScreenRefresh } from '../../hooks/use-screen-refresh';
import { errorMessage } from '../../services/http/client';
import { colors, displayFamily } from '../../theme/tokens';
import { StudioLoading } from '../../components/studio-loading';

type Filter = 'all' | 'completed' | 'abandoned';
const historyQueries = [keys.history];
const filters = [
  { value: 'all', label: 'Hamısı' },
  { value: 'completed', label: 'Tamamlanan' },
  { value: 'abandoned', label: 'Bağlanan' },
] as const;

function matchDate(value: string): string {
  const date = new Date(value);
  const twoDigits = (number: number) => String(number).padStart(2, '0');
  return `${twoDigits(date.getDate())}.${twoDigits(date.getMonth() + 1)}.${date.getFullYear()} · ${twoDigits(date.getHours())}:${twoDigits(date.getMinutes())}`;
}

export default function History() {
  const history = useHistory();
  const refresh = useScreenRefresh(historyQueries);
  const [filter, setFilter] = useState<Filter>('all');
  const visible = history.data?.filter((item) => filter === 'all' || item.result.reason === filter);
  return (
    <Screen atmosphere="quiet" {...refresh}>
      <PageHeader title="Oyun tarixçəsi" />
      <SectionHeading title="Son yarışlar" note="Son 20 solo turu" />
      <SegmentedControl value={filter} items={filters} onChange={setFilter} />
      {!!visible?.length && <Text style={styles.count}>{visible.length} yarış göstərilir</Text>}
      {history.isPending && <StudioLoading message="Nəticələrin hazırlanır…" />}
      {history.error && (
        <ErrorNotice
          message={errorMessage(history.error)}
          onRetry={() => {
            void history.refetch();
          }}
        />
      )}
      {visible?.length === 0 && (
        <View style={{ gap: 16 }}>
          <EmptyStage
            icon="reader-outline"
            title={
              history.data?.length === 0
                ? 'İlk nəticən burada görünəcək'
                : 'Bu bölmədə hələ nəticə yoxdur'
            }
            description={
              history.data?.length === 0
                ? 'Səhnəyə çıx və ilk turunu tamamla.'
                : 'Başqa filtr seçərək qalan yarışlarına baxa bilərsən.'
            }
          />
          {history.data?.length === 0 && (
            <Button title="İlk turuna başla" onPress={() => router.push('/solo-ready')} />
          )}
        </View>
      )}
      {visible?.map((item) => {
        const result = item.result;
        const completed = result.reason === 'completed';
        return (
          <Pressable
            key={item.id}
            accessibilityRole="button"
            accessibilityLabel={'Yarış nəticəsi: ' + result.score + ' xal'}
            onPress={() => router.push({ pathname: '/solo', params: { id: item.id } })}
            style={({ pressed }) => [styles.entry, pressed && styles.pressed]}
          >
            <View style={[layout.row, { flexWrap: 'wrap', rowGap: 8 }]}>
              <Icon
                name={completed ? 'checkmark-circle-outline' : 'flag-outline'}
                size={24}
                color={completed ? colors.green : colors.muted}
              />
              <View style={{ flex: 1, gap: 4 }}>
                <Label>Tək oyun</Label>
                <Text style={styles.date}>{matchDate(result.finishedAt)}</Text>
              </View>
              <Text style={[styles.status, { color: completed ? colors.green : colors.muted }]}>
                {completed ? 'Tamamlandı' : 'Bağlandı'}
              </Text>
              <Icon name="chevron-forward" size={16} color={colors.muted} />
            </View>
            <View style={[layout.between, { flexWrap: 'wrap', rowGap: 8 }]}>
              <Text style={styles.score}>
                {result.score} <Text style={styles.date}>yarış xalı</Text>
              </Text>
              <Text
                style={{
                  color:
                    result.actualDelta < 0
                      ? colors.red
                      : result.actualDelta > 0
                        ? colors.green
                        : colors.muted,
                  fontWeight: '700',
                  fontSize: 13,
                }}
              >
                {result.actualDelta >= 0 ? '+' : ''}
                {result.actualDelta} rank
              </Text>
            </View>
            <View style={[layout.between, { flexWrap: 'wrap', rowGap: 8 }]}>
              <Text style={styles.detail}>
                {result.correct}/{result.totalQuestions} düzgün
              </Text>
              <Text style={styles.detail}>
                {result.rank.name} {result.rank.division}
              </Text>
            </View>
          </Pressable>
        );
      })}
      <StudioNotice>
        Yarış xalı və rank xalı ayrı hesablanır. Nəticəni açaraq turun yekununa baxa bilərsən.
      </StudioNotice>
    </Screen>
  );
}

const styles = StyleSheet.create({
  count: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  entry: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderColor: colors.brass,
    backgroundColor: '#0b1c31',
    gap: 14,
  },
  pressed: { backgroundColor: '#182e49' },
  date: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 19,
    fontWeight: '400',
  },
  status: {
    fontSize: 12,
    lineHeight: 18,
    borderWidth: 1,
    borderColor: '#50638170',
    paddingVertical: 4,
    paddingHorizontal: 7,
  },
  score: {
    color: colors.goldLight,
    fontFamily: displayFamily,
    fontSize: 38,
    lineHeight: 46,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  detail: { color: colors.muted, fontSize: 14, lineHeight: 21 },
});
