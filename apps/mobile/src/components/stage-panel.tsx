import type { PropsWithChildren } from 'react';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, spacing } from '../theme/tokens';

export function PanelInk({
  fill = colors.panel,
  edge = colors.brass,
  highlight = true,
}: {
  fill?: string;
  edge?: string;
  highlight?: boolean;
}) {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const { width, height } = size;
  const inset = 1;
  const x = width - inset;
  const y = height - inset;
  const c = Math.min(12, x / 4, y / 4);
  return (
    <View
      style={[StyleSheet.absoluteFill, styles.decorative]}
      onLayout={({ nativeEvent: { layout } }) => {
        if (width !== layout.width || height !== layout.height)
          setSize({ width: layout.width, height: layout.height });
      }}
    >
      {width > 2 && height > 2 && (
        <Svg width={width} height={height}>
          <Path
            d={`M${c} 1 H${x - c} L${x} ${c} V${y - c} L${x - c} ${y} H${c} L1 ${y - c} V${c} Z`}
            fill={fill}
            stroke={edge}
          />
          {highlight && width > 40 && (
            <Path d={`M18 5 H${x - 18}`} stroke={edge} strokeOpacity={0.7} />
          )}
        </Svg>
      )}
    </View>
  );
}

export function StagePanel({
  children,
  style,
}: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return (
    <View style={[styles.panel, style]}>
      <PanelInk />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  decorative: { pointerEvents: 'none' },
  panel: { padding: spacing.xl, gap: spacing.lg, position: 'relative' },
});
