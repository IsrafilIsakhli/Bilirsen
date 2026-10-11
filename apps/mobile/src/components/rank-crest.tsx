import { useId } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Ellipse, LinearGradient, Path, Stop } from 'react-native-svg';
import { Icon } from './studio';
import { rankIcon } from '../features/ranks/rank-presentation';

export function RankCrest({ name, size = 116 }: { name: string; size?: number }) {
  const id = 'crest-' + useId().replace(/:/g, '');
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 120 120" style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop stopColor="#ffe6ae" />
            <Stop offset={0.45} stopColor="#c39447" />
            <Stop offset={0.7} stopColor="#f7d28d" />
            <Stop offset={1} stopColor="#956927" />
          </LinearGradient>
        </Defs>
        <Circle cx={60} cy={60} r={57} fill="none" stroke="#c3944740" strokeWidth={0.8} />
        <Circle cx={60} cy={60} r={44} fill="#0a1c2d" stroke={`url(#${id})`} strokeWidth={2} />
        <Circle cx={60} cy={60} r={39} fill="none" stroke="#d9b46d30" strokeWidth={0.7} />
        <Path
          d="M28 103 Q2 77 15 43 M92 103 Q118 77 105 43"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={1.1}
        />
        {[0, 1, 2, 3, 4].map((leaf) => (
          <ViewLeaves key={leaf} index={leaf} color={`url(#${id})`} />
        ))}
        <Path
          d="M60 4 L63 10 L60 16 L57 10 Z M60 104 L64 110 L60 116 L56 110 Z"
          fill={`url(#${id})`}
        />
      </Svg>
      <Icon name={rankIcon(name)} size={size * 0.35} />
    </View>
  );
}

function ViewLeaves({ index, color }: { index: number; color: string }) {
  const y = 51 + index * 10;
  const x = 12 + index * 2;
  return (
    <>
      <Ellipse
        cx={x}
        cy={y}
        rx={3.1}
        ry={7}
        fill={color}
        opacity={0.82}
        transform={`rotate(-35 ${x} ${y})`}
      />
      <Ellipse
        cx={120 - x}
        cy={y}
        rx={3.1}
        ry={7}
        fill={color}
        opacity={0.82}
        transform={`rotate(35 ${120 - x} ${y})`}
      />
    </>
  );
}
