import type { PropsWithChildren } from 'react';
import { useId, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, Ellipse, LinearGradient as Gradient, Path, Stop } from 'react-native-svg';
import { spacing } from '../theme/tokens';

// Scenic panels belong to the play invitation and matchup, never to forms or errors.
export function StagePanel({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  const id = `stage-panel-${useId().replace(/:/g, '')}`;
  const [size, setSize] = useState({ width: 350, height: 240 });
  return (
    <LinearGradient
      colors={['#203b51', '#132b3f', '#0c1d2d']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      onLayout={({ nativeEvent: { layout } }) =>
        setSize((previous) =>
          previous.width === layout.width && previous.height === layout.height
            ? previous
            : { width: layout.width, height: layout.height },
        )
      }
      style={[styles.panel, style]}
    >
      <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
        <Svg width={size.width} height={size.height} viewBox={`0 0 ${size.width} ${size.height}`}>
          <Defs>
            <Gradient id={id}>
              <Stop stopColor="#efbf69" stopOpacity="0" />
              <Stop offset="0.55" stopColor="#efbf69" stopOpacity="0.45" />
              <Stop offset="1" stopColor="#a3c6df" stopOpacity="0.08" />
            </Gradient>
          </Defs>
          <Ellipse
            cx={size.width * 0.74}
            cy={size.height + 25}
            rx={size.width * 0.7}
            ry="90"
            fill="#0a1826"
            stroke={`url(#${id})`}
          />
          <Ellipse
            cx={size.width * 0.74}
            cy={size.height + 39}
            rx={size.width * 0.78}
            ry="98"
            fill="none"
            stroke="#9cb7cb"
            strokeOpacity="0.09"
          />
          <Path d={`M20 1 H${size.width - 20}`} stroke={`url(#${id})`} />
        </Svg>
      </View>
      {children}
    </LinearGradient>
  );
}
const styles = StyleSheet.create({
  panel: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5a6a69',
    padding: spacing.xl,
    gap: spacing.xl,
    overflow: 'hidden',
  },
});
