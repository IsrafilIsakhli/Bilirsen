import { useId } from 'react';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

export function BrandMark({ size = 142 }: { size?: number }) {
  const id = 'brand-' + useId().replace(/:/g, '');
  return (
    <Svg width={size} height={size} viewBox="0 0 160 160" accessibilityLabel="Bilirsən? nişanı">
      <Defs>
        <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop stopColor="#ffdda0" />
          <Stop offset={0.5} stopColor="#efbf69" />
          <Stop offset={1} stopColor="#9b7030" />
        </LinearGradient>
      </Defs>
      <Rect x={2} y={2} width={156} height={156} rx={36} fill="#0a1c30" stroke="#385f8a" />
      <Path
        d="M30 55 80 26 130 55v50l-50 29-50-29Z"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={2}
      />
      <Path
        d="M61 63c0-25 40-25 40 0 0 18-21 15-21 33"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <Circle cx={80} cy={112} r={5} fill="#efbf69" />
    </Svg>
  );
}
