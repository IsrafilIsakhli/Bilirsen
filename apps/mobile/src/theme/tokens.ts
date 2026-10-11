export const colors = {
  background: '#061321',
  panel: '#101f32',
  panelLight: '#182a42',
  blue: '#385f8a',
  text: '#f6f7fc',
  muted: '#afc4df',
  gold: '#efbf69',
  goldLight: '#ffdda0',
  green: '#72d6ac',
  red: '#fb7d79',
  line: '#27405e',
} as const;
export const radius = { card: 18, button: 12 } as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, section: 32 } as const;
export const typography = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.6 },
  body: { fontSize: 16, lineHeight: 24 },
  label: { fontSize: 17, lineHeight: 23, fontWeight: '600' },
  note: { fontSize: 12, lineHeight: 18 },
} as const;
