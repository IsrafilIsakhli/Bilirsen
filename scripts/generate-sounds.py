"""Bilirsen Studio: unchanged v4 suspense bed and compact v5 broadcast verdicts.

No third-party samples or show melodies. Standard-library offline synthesis:
bowed strings, orchestral percussion, low brass, and stereo room reflections.
Runtime only loads the finished WAV files; it never synthesizes on the phone.
"""
from pathlib import Path
import json
import math
import random
import struct
import wave
import argparse
import hashlib

RATE = 44100
OUTPUT = Path(__file__).resolve().parents[1] / "apps/mobile/assets/sounds"
OUTPUT.mkdir(parents=True, exist_ok=True)
TAU = 2 * math.pi


def envelope(time, duration, attack=.012, release=.12):
    return min(1., time / attack) * min(1., max(0., duration - time) / release)


def add_brass(buffer, start, duration, frequency, gain, bend=0., seed=0):
    """A dark, breathy brass layer rather than a sine notification beep."""
    phase = 0.
    detuned = 0.
    rng = random.Random(seed)
    air = 0.
    for index in range(int(duration * RATE)):
        time = index / RATE
        progress = time / duration
        pitch = frequency * (1 + bend * progress + .002 * math.sin(TAU * 5 * time))
        phase += TAU * pitch / RATE
        detuned += TAU * pitch * 1.004 / RATE
        # Opening then closing the spectral envelope mimics an accented brass attack.
        brightness = .9 * math.exp(-time * 3) + .18
        body = 0.
        for harmonic in range(1, 7):
            amplitude = brightness ** (harmonic - 1) / harmonic ** 1.35
            body += amplitude * (math.sin(phase * harmonic) + .30 * math.sin(detuned * harmonic))
        air = .82 * air + .18 * rng.uniform(-1, 1)
        value = gain * envelope(time, duration, .018, .16) * math.exp(-progress * 1.7)
        buffer[int(start * RATE) + index] += value * (body + air * .13)


def add_impact(buffer, start, duration, gain, seed):
    """A phone-audible low-mid drum with a short acoustic strike."""
    rng = random.Random(seed)
    phase = 0.
    low_noise = 0.
    for index in range(int(duration * RATE)):
        time = index / RATE
        phase += TAU * (92 + 90 * math.exp(-time * 34)) / RATE
        noise = rng.uniform(-1, 1)
        low_noise += .21 * (noise - low_noise)
        attack = min(1, time / .003)
        tail = min(1, max(0., duration - time) / .04)
        drum = (math.sin(phase) + .25 * math.sin(phase * 2)) * math.exp(-time * 24)
        strike = (.5 * low_noise + .22 * noise) * math.exp(-time * 100)
        buffer[int(start * RATE) + index] += gain * attack * tail * (drum + strike)


def add_air(buffer, start, duration, gain, seed):
    rng = random.Random(seed)
    low = 0.
    smooth = 0.
    for index in range(int(duration * RATE)):
        time = index / RATE
        noise = rng.uniform(-1, 1)
        low += .025 * (noise - low)
        smooth += .22 * (noise - smooth)
        shaped = smooth - low
        buffer[int(start * RATE) + index] += gain * shaped * math.sin(math.pi * time / duration) ** 2


def add_strings(buffer, start, duration, frequency, gain, tremolo=0., attack=.04):
    """A slowly detuned, bowed ensemble; tremolo controls the nervous pulse."""
    phases = [0., .31, .67]
    for index in range(int(duration * RATE)):
        time = index / RATE
        body = 0.
        for voice, detune in enumerate([.997, 1., 1.003]):
            phases[voice] += TAU * frequency * detune * (1 + .0015 * math.sin(TAU * 4.3 * time + voice)) / RATE
            for harmonic in range(1, 9):
                body += math.sin(phases[voice] * harmonic) * (.72 ** (harmonic - 1)) / harmonic
        pulse = .75 + .25 * math.cos(TAU * tremolo * time) if tremolo else 1.
        shaped = envelope(time, duration, attack, min(.15, duration / 3))
        buffer[int(start * RATE) + index] += gain * shaped * pulse * body / 3


def add_cymbal(buffer, start, duration, gain, seed):
    """A filtered, diffuse orchestral strike rather than a harsh buzzer."""
    rng = random.Random(seed)
    slow = 0.
    fast = 0.
    for index in range(int(duration * RATE)):
        time = index / RATE
        noise = rng.uniform(-1., 1.)
        slow += .04 * (noise - slow)
        fast += .43 * (noise - fast)
        value = (fast - slow) * math.exp(-time * 6)
        buffer[int(start * RATE) + index] += gain * envelope(time, duration, .003, .12) * value


def render(name, duration, build, room, target_rms, peak_limit=.70):
    dry = [0.] * int(duration * RATE)
    build(dry)
    # Early studio-room reflections with a short, diffuse tail. Clock stays centered.
    channels = [dry.copy(), dry.copy()]
    for channel, reflections in zip(channels, [
        [(.027, .15), (.059, .11), (.101, .07), (.157, .04)],
        [(.034, .15), (.073, .10), (.119, .065), (.181, .035)],
    ]):
        for delay, gain in reflections:
            shift = int(delay * RATE)
            for index in range(shift, len(dry)):
                channel[index] += dry[index - shift] * gain * room
    # AC-couple, gentle saturate, loudness match, and leave peak headroom.
    for channel in channels:
        previous_input = 0.
        previous_output = 0.
        for index, value in enumerate(channel):
            filtered = value - previous_input + .996 * previous_output
            previous_input, previous_output = value, filtered
            channel[index] = math.tanh(filtered * .8)
    rms = math.sqrt(sum(value * value for channel in channels for value in channel) / (len(dry) * 2))
    peak = max(abs(value) for channel in channels for value in channel)
    gain = min(target_rms / max(rms, 1e-9), peak_limit / max(peak, 1e-9))
    frames = bytearray()
    final_peak = 0.
    square_sum = 0.
    for index in range(len(dry)):
        fade = min(1., index / 100, (len(dry) - 1 - index) / 400)
        for channel in channels:
            value = channel[index] * gain * fade
            final_peak = max(final_peak, abs(value))
            square_sum += value * value
            frames.extend(struct.pack("<h", round(value * 32767)))
    with wave.open(str(OUTPUT / (name + ".wav")), "wb") as file:
        file.setnchannels(2)
        file.setsampwidth(2)
        file.setframerate(RATE)
        file.writeframes(frames)
    metrics = {
        "cue": name, "durationSeconds": duration,
        "peakDbFS": round(20 * math.log10(final_peak), 2),
        "rmsDbFS": round(20 * math.log10(math.sqrt(square_sum / (len(dry) * 2))), 2),
        "bytes": len(frames) + 44,
    }
    print(json.dumps(metrics))
    return metrics


def correct(buffer):
    # Immediate low-mid orchestral hit; one warm resolution, no bell or fanfare.
    add_impact(buffer, 0., .28, .60, 53)
    add_air(buffer, 0., .12, .10, 51)
    add_cymbal(buffer, .005, .34, .07, 59)
    for frequency, gain in [(146.83, .18), (220., .15), (293.66, .13)]:
        add_brass(buffer, .003, .43, frequency, gain, seed=int(frequency))
        add_strings(buffer, .008, .68, frequency, gain * .72, attack=.009)
    # The major third opens after the impact, then folds into a soft room tail.
    add_strings(buffer, .09, .61, 369.99, .105, attack=.03)
    add_strings(buffer, .12, .56, 440., .040, attack=.04)


def wrong(buffer):
    # Same weight as the positive hit, with a dark falling brass envelope.
    add_impact(buffer, 0., .26, .60, 61)
    add_cymbal(buffer, .005, .25, .05, 67)
    for frequency, gain in [(164.81, .22), (220., .13), (329.63, .065)]:
        add_brass(buffer, .003, .47, frequency, gain, bend=-.28, seed=int(frequency))
    add_strings(buffer, .008, .54, 110., .14, attack=.008)
    add_strings(buffer, .015, .50, 146.83, .08, attack=.009)
    add_air(buffer, 0., .26, .065, 71)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--verdicts-only', action='store_true', help='Preserve the approved timer file (default).')
    parser.parse_args()
    timer_path = OUTPUT / 'tick.wav'
    before = hashlib.sha256(timer_path.read_bytes()).hexdigest() if timer_path.exists() else None
    existing = json.loads((OUTPUT / 'metrics.json').read_text(encoding='utf-8'))
    timers = [item for item in existing if item['cue'].startswith('tick')]
    report = [*timers, render('correct', .85, correct, .42, .15), render('wrong', .70, wrong, .30, .117)]
    after = hashlib.sha256(timer_path.read_bytes()).hexdigest()
    if before != after:
        raise RuntimeError('Approved background changed during verdict generation.')
    print(json.dumps({'backgroundSha256': after, 'unchanged': True}))
    (OUTPUT / 'metrics.json').write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
