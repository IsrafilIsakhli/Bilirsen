import { useId, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, {
  Defs,
  Ellipse,
  LinearGradient as Gradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';

// Static scenic lighting keeps the centre quiet and does not compete with game motion.
export type StageAtmosphere = 'stage' | 'quiet' | 'question';
export function StageBackground({ atmosphere = 'stage' }: { atmosphere?: StageAtmosphere }) {
  const id = useId().replace(/:/g, '');
  const [size, setSize] = useState({ width: 420, height: 900 });
  return (
    <View
      style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}
      onLayout={({ nativeEvent: { layout } }) =>
        setSize((previous) =>
          previous.width === layout.width && previous.height === layout.height
            ? previous
            : { width: layout.width, height: layout.height },
        )
      }
    >
      <LinearGradient colors={['#050d17', '#0b1c2c', '#050f1b']} style={StyleSheet.absoluteFill} />
      <Svg
        style={[
          StyleSheet.absoluteFill,
          { opacity: atmosphere === 'quiet' ? 0.32 : atmosphere === 'question' ? 0.6 : 0.85 },
        ]}
        width={size.width}
        height={size.height}
        viewBox="0 0 420 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <Defs>
          <RadialGradient id={`${id}-wall`} cx="50%" cy="38%" rx="70%" ry="65%">
            <Stop stopColor="#386d97" stopOpacity={0.32} />
            <Stop offset="1" stopColor="#061321" stopOpacity="0" />
          </RadialGradient>
          <Gradient id={`${id}-edge`} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop stopColor="#84b8db" stopOpacity="0" />
            <Stop offset={0.3} stopColor="#79a6c7" stopOpacity={0.45} />
            <Stop offset={0.75} stopColor="#d1ad70" stopOpacity={0.25} />
            <Stop offset="1" stopColor="#79a6c7" stopOpacity="0" />
          </Gradient>
          <RadialGradient id={`${id}-lamp`}>
            <Stop stopColor="#d5e9f4" stopOpacity={0.38} />
            <Stop offset={0.28} stopColor="#87adc8" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#87adc8" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`${id}-haze`}>
            <Stop stopColor="#a8c4d9" stopOpacity={0.16} />
            <Stop offset={0.35} stopColor="#83a7c2" stopOpacity={0.09} />
            <Stop offset={1} stopColor="#83a7c2" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`${id}-warm-haze`}>
            <Stop stopColor="#e3c894" stopOpacity={0.1} />
            <Stop offset={0.35} stopColor="#bfa273" stopOpacity={0.04} />
            <Stop offset={1} stopColor="#bfa273" stopOpacity="0" />
          </RadialGradient>
          <RadialGradient id={`${id}-floor`} cx="50%" cy="50%" rx="50%" ry="50%">
            <Stop stopColor="#44779c" stopOpacity={0.35} />
            <Stop offset="1" stopColor="#0d2033" stopOpacity="0" />
          </RadialGradient>
          <Gradient id={`${id}-rail`}>
            <Stop stopColor="#385d78" stopOpacity="0" />
            <Stop offset={0.3} stopColor="#7395ac" stopOpacity={0.42} />
            <Stop offset={0.5} stopColor="#d6b578" stopOpacity={0.46} />
            <Stop offset={0.7} stopColor="#7395ac" stopOpacity={0.42} />
            <Stop offset="1" stopColor="#385d78" stopOpacity="0" />
          </Gradient>
          <RadialGradient id={`${id}-shade`} cx="50%" cy="45%" rx="60%" ry="65%">
            <Stop stopColor="#04101c" stopOpacity={0.42} />
            <Stop offset={0.7} stopColor="#04101c" stopOpacity={0.12} />
            <Stop offset="1" stopColor="#020912" stopOpacity={0.35} />
          </RadialGradient>
        </Defs>
        <Rect width="420" height="900" fill={`url(#${id}-wall)`} />
        <Path
          d="M0 85 L20 110 V790 L0 835 Z M420 85 L400 110 V790 L420 835 Z"
          fill="#1d3a50"
          opacity={0.22}
        />
        <Path
          d="M0 5 Q210 32 420 5 M0 13 Q210 41 420 13"
          stroke={`url(#${id}-rail)`}
          strokeWidth={1}
          fill="none"
        />
        <Path d="M20 110 V790 M400 110 V790" stroke={`url(#${id}-edge)`} strokeWidth={1} />
        {[130, 210, 290].map((x) => (
          <Path key={x} d={`M${x} 18 v9`} stroke="#7792a7" strokeOpacity={0.18} />
        ))}
        {[54, 128, 292, 366].map((lamp) => (
          <StageSpotlight key={lamp} x={lamp} id={id} warm={lamp === 128 || lamp === 292} />
        ))}
        <Rect width="420" height="900" fill={`url(#${id}-shade)`} />
        <Path d="M0 788 Q210 715 420 788 V900 H0 Z" fill="#060f18" opacity={0.42} />
        <Ellipse cx="210" cy="840" rx="250" ry="100" fill={`url(#${id}-floor)`} />
        <Ellipse
          cx="210"
          cy="940"
          rx="262"
          ry="118"
          fill="none"
          stroke={`url(#${id}-rail)`}
          strokeWidth={1.4}
        />
        <Ellipse
          cx="210"
          cy="953"
          rx="283"
          ry="127"
          fill="none"
          stroke="#4c7595"
          strokeOpacity={0.18}
        />
        <Path
          d="M-30 940 Q210 832 450 940"
          stroke={`url(#${id}-rail)`}
          strokeWidth={1.4}
          fill="none"
        />
        <Path
          d="M40 900 L118 800 M380 900 L302 800 M210 900 V822"
          stroke="#35516a"
          strokeOpacity={0.13}
          strokeWidth={1}
        />
      </Svg>
    </View>
  );
}

function StageSpotlight({ x, id, warm }: { x: number; id: string; warm: boolean }) {
  const center = x < 210 ? (warm ? 235 : 150) : warm ? 185 : 270;
  const beamCenter = (x + center) / 2;
  const angle = (-Math.atan2(center - x, 665) * 180) / Math.PI;
  return (
    <>
      <Ellipse
        cx={beamCenter}
        cy="380"
        rx="65"
        ry="340"
        fill={`url(#${id}-${warm ? 'warm-haze' : 'haze'})`}
        transform={`rotate(${angle} ${beamCenter} 380)`}
      />
      <Ellipse cx={x} cy="54" rx="28" ry="17" fill={`url(#${id}-lamp)`} />
      <Rect x={x - 3} y="29" width="6" height="12" rx="2" fill="#1f3445" />
      <Path
        d={`M${x - 12} 42 h24 l-3 11 h-18 Z`}
        fill="#263a49"
        stroke="#638096"
        strokeOpacity={0.25}
      />
      <Ellipse cx={x} cy="54" rx="7" ry="2" fill="#bad5e7" opacity={0.55} />
    </>
  );
}
