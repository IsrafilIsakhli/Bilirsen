import { View } from 'react-native';
import { Body, Button, Card, Icon, Label, layout } from './studio';
import { colors } from '../theme/tokens';

export function ConnectionNotice({
  message,
  onRetry,
  timedGame = false,
}: {
  message: string;
  onRetry: () => void;
  timedGame?: boolean;
}) {
  return (
    <Card style={{ borderColor: colors.gold, gap: 12 }}>
      <View style={layout.row}>
        <Icon name="cloud-offline-outline" size={25} />
        <View style={{ flex: 1 }}>
          <Label>Bağlantı zəifdir</Label>
        </View>
      </View>
      <Body>{message}</Body>
      {timedGame && (
        <Body>Vaxt serverdə davam edir. Qoşulanda sualın cari vəziyyəti yenilənəcək.</Body>
      )}
      <Button title="Yenidən qoşul" outline onPress={onRetry} />
    </Card>
  );
}
