import type { PropsWithChildren } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import stage from '../../assets/backgrounds/stage.jpg';
import foyer from '../../assets/backgrounds/foyer.jpg';
import duel from '../../assets/backgrounds/duel.jpg';
import rank from '../../assets/backgrounds/rank.jpg';
import { colors } from '../theme/tokens';

const sceneImages = { stage, foyer, duel, rank };
export type StudioScene = keyof typeof sceneImages;
export type StageAtmosphere = 'stage' | 'quiet' | 'question' | 'duel' | 'rank';

export function SceneImage({ scene }: { scene: StudioScene }) {
  return (
    <Image accessible={false} source={sceneImages[scene]} resizeMode="cover" style={styles.image} />
  );
}

export function SceneBanner({
  scene,
  children,
  style,
}: PropsWithChildren<{
  scene: StudioScene;
  style?: StyleProp<ViewStyle>;
}>) {
  return (
    <View style={[styles.banner, style]}>
      <View style={[StyleSheet.absoluteFill, styles.decorative]}>
        <SceneImage scene={scene} />
        <LinearGradient
          colors={['#06102100', '#06102112', '#061021e8']}
          style={StyleSheet.absoluteFill}
        />
      </View>
      {children}
    </View>
  );
}

export function StageBackground({ atmosphere = 'stage' }: { atmosphere?: StageAtmosphere }) {
  const scene = atmosphere === 'quiet' ? 'foyer' : atmosphere === 'question' ? 'stage' : atmosphere;
  const full = atmosphere === 'stage' || atmosphere === 'question';
  return (
    <View style={[styles.background, styles.decorative]}>
      <View style={full ? StyleSheet.absoluteFill : styles.header}>
        <SceneImage scene={scene} />
        <LinearGradient
          colors={
            atmosphere === 'stage'
              ? ['#03091460', '#03091410', '#061021dc', colors.background]
              : atmosphere === 'question'
                ? ['#03091440', '#06102162', '#061021ee', colors.background]
                : ['#030914a0', '#061021a8', '#061021e6', colors.background]
          }
          locations={[0, 0.35, 0.76, 1]}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  decorative: { pointerEvents: 'none' },
  background: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: colors.background,
  },
  header: { width: '100%', height: 330 },
  image: { width: '100%', height: '100%' },
  banner: {
    minHeight: 188,
    justifyContent: 'flex-end',
    padding: 12,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderColor: colors.brass,
  },
});
