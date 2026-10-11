"""Smooth Studio suspense beds, pre-rendered at the three server durations.

This generator changes only the timer assets. Verdict files remain untouched.
No live pitch correction, saturation, dissonant layer or sample-rate conversion.
"""
from pathlib import Path
import hashlib
import json
import math
import random
import struct
import wave

RATE = 44100
TAU = 2 * math.pi
OUTPUT = Path(__file__).resolve().parents[1] / 'apps/mobile/assets/sounds'


def strike(buffer, start, gain, seed, tock=False):
    rng = random.Random(seed)
    phase = 0.
    smooth_noise = 0.
    duration = .075
    first = round(start * RATE)
    for index in range(min(round(duration * RATE), len(buffer) - first)):
        time = index / RATE
        phase += TAU * (140 if tock else 190) / RATE
        smooth_noise += .35 * (rng.uniform(-1, 1) - smooth_noise)
        frequency = 1390 if tock else 1850
        clock = (math.sin(TAU * frequency * time) + .22 * math.sin(TAU * frequency * 2.1 * time)) * math.exp(-time * 100)
        body = .12 * math.sin(phase) * math.exp(-time * 65)
        attack = min(1., time / .0012)
        release = min(1., (duration - time) / .014)
        buffer[first + index] += gain * attack * release * (clock + body + smooth_noise * .38 * math.exp(-time * 170))


def render(duration):
    samples = [0.] * (duration * RATE)
    for index in range(len(samples)):
        time = index / RATE
        progress = time / duration
        # A stable D/A open harmony: no beating semitone in the final quarter.
        pad = (.70 * math.sin(TAU * 146.83 * time)
               + .30 * math.sin(TAU * 220 * time)
               + .12 * math.sin(TAU * 293.66 * time))
        samples[index] = .070 * min(1., time / .6) * (.75 + .25 * progress) * pad
    bed_peak = max(abs(value) for value in samples)
    beats = []
    start = .12 * duration / 30
    beat = 0
    while start + .12 < duration:
        progress = start / duration
        urgency = max(0., (progress - .25) / .75)
        interval = 60 / (68 + 84 * urgency ** 1.45) * duration / 30
        gain = .38 + .10 * progress
        strike(samples, start, gain, 700 + beat, tock=beat % 2 == 1)
        beats.append(start)
        if progress > .5 and start + interval / 2 + .12 < duration:
            strike(samples, start + interval / 2, gain * (.55 + .15 * urgency), 1700 + beat, tock=beat % 2 == 0)
            beats.append(start + interval / 2)
        start += interval
        beat += 1
    # Linear low-pass/mastering: reserve headroom without nonlinear distortion.
    alpha = 1 - math.exp(-TAU * 4800 / RATE)
    low = 0.
    for index, value in enumerate(samples):
        low += alpha * (value - low)
        time = index / RATE
        fade = min(1., time / .02, (duration - time - 1 / RATE) / .08)
        samples[index] = low * max(0., fade)
    peak = max(abs(value) for value in samples)
    rms = math.sqrt(sum(value * value for value in samples) / len(samples))
    gain = min(.085 / rms, .50 / peak)
    frames = bytearray()
    for value in samples:
        frames.extend(struct.pack('<hh', round(value * gain * 32767), round(value * gain * 32767)))
    name = 'tick' if duration == 30 else f'tick-{duration}'
    with wave.open(str(OUTPUT / f'{name}.wav'), 'wb') as file:
        file.setnchannels(2)
        file.setsampwidth(2)
        file.setframerate(RATE)
        file.writeframes(frames)
    return {'cue': name, 'durationSeconds': duration, 'peakDbFS': round(20 * math.log10(peak * gain), 2),
            'rmsDbFS': round(20 * math.log10(rms * gain), 2), 'bytes': len(frames) + 44,
            'sha256': hashlib.sha256((OUTPUT / f'{name}.wav').read_bytes()).hexdigest(),
            'tickToBedPeakDb': round(20 * math.log10(peak / bed_peak), 2),
            'tickCount': len(beats),
            'firstQuarterTicks': sum(time < duration / 4 for time in beats),
            'lastQuarterTicks': sum(time >= duration * .75 for time in beats)}


def main():
    verdicts = {name: hashlib.sha256((OUTPUT / f'{name}.wav').read_bytes()).hexdigest() for name in ['correct', 'wrong']}
    existing = json.loads((OUTPUT / 'metrics.json').read_text(encoding='utf-8'))
    report = [render(duration) for duration in [30, 20, 25]]
    for name, original in verdicts.items():
        if hashlib.sha256((OUTPUT / f'{name}.wav').read_bytes()).hexdigest() != original:
            raise RuntimeError('Timer generation changed a verdict.')
    combined = [report[0], *[item for item in existing if item['cue'] in verdicts], *report[1:]]
    (OUTPUT / 'metrics.json').write_text(json.dumps(combined, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'timers': report, 'verdictsUnchanged': True}))


if __name__ == '__main__':
    main()
