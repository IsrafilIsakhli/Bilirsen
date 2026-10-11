import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Screen, Card, Label, Icon, ErrorNotice, layout, Button } from '../../components/studio';
import { SectionHeading, EmptyStage, StudioNotice } from '../../components/studio-elements';
import { SegmentedControl } from '../../components/segmented-control';
import { PageHeader } from '../../components/page-header';
import { useHistory } from '../../services/http/queries';
import { errorMessage } from '../../services/http/client';
import { colors } from '../../theme/tokens';
import { StudioLoading } from '../../components/studio-loading';

type Filter = 'all' | 'completed' | 'abandoned';
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
  const [filter, setFilter] = useState<Filter>('all');
  const visible = history.data?.filter((item) => filter === 'all' || item.result.reason === filter);
  return (
    <Screen atmosphere="quiet">
      <PageHeader title="Oyun tarixçəsi" />
      <SectionHeading title="Son yarışlar" note="Son 20 solo turu" />
      <SegmentedControl value={filter} items={filters} onChange={setFilter} />
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
          >
            <Card style={{ padding: 16, gap: 12, borderWidth: 0 }}>
              <View style={[layout.row, { flexWrap: 'wrap', rowGap: 8 }]}>
                <Icon
                  name={completed ? 'checkmark-circle-outline' : 'flag-outline'}
                  size={24}
                  color={completed ? colors.green : colors.muted}
                />
                <View style={{ flex: 1, gap: 4 }}>
                  <Label>Tək oyun</Label>
                  <Text style={{ color: colors.muted, fontSize: 12 }}>
                    {matchDate(result.finishedAt)}
                  </Text>
                </View>
                <Text style={{ color: completed ? colors.green : colors.muted, fontSize: 12 }}>
                  {completed ? 'Tamamlandı' : 'Bağlandı'}
                </Text>
                <Icon name="chevron-forward" size={16} color={colors.muted} />
              </View>
              <View style={{ height: 1, backgroundColor: colors.line }} />
              <View style={[layout.between, { flexWrap: 'wrap', rowGap: 8 }]}>
                <Text style={{ color: colors.text, fontSize: 21, fontWeight: '700' }}>
                  {result.score}{' '}
                  <Text style={{ color: colors.muted, fontSize: 12, fontWeight: '400' }}>
                    yarış xalı
                  </Text>
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
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {result.correct}/{result.totalQuestions} düzgün
                </Text>
                <Text style={{ color: colors.muted, fontSize: 12 }}>
                  {result.rank.name} {result.rank.division}
                </Text>
              </View>
            </Card>
          </Pressable>
        );
      })}
      <StudioNotice>
        Yarış xalı və rank xalı ayrı hesablanır. Nəticəni açaraq turun yekununa baxa bilərsən.
      </StudioNotice>
    </Screen>
  );
}
