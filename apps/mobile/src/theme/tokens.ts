import { Platform } from 'react-native';

export const colors = {
  background: '#061021',
  panel: '#10213c',
  panelLight: '#172d4c',
  blue: '#385f8a',
  text: '#f4f5f8',
  muted: '#b7c5db',
  gold: '#e3b978',
  goldLight: '#f5d9a1',
  brass: '#8b6e44',
  green: '#a1e3b5',
  red: '#ffa99f',
  line: '#506381',
} as const;
export const radius = { card: 3 } as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, section: 32 } as const;
export const displayFamily = Platform.select({
  web: 'Cambria, Georgia, serif',
  ios: 'Georgia',
  default: 'serif',
});
export const typography = {
  title: { fontFamily: displayFamily, fontSize: 32, lineHeight: 38, fontWeight: '700' },
  cue: { fontSize: 11, lineHeight: 16, fontWeight: '700', letterSpacing: 1.1 },
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 17, lineHeight: 23, fontWeight: '600' },
  note: { fontSize: 12, lineHeight: 18 },
} as const;
