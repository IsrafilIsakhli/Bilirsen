import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const sounds = path.join(root, 'apps/mobile/assets/sounds');
const approvedBackground = '0ea8fbdece94cf7649b817d9b85eea19a4f6a3bdfe7a3cbb91e575ece1867ee1';
const backgroundSha256 = createHash('sha256')
  .update(await readFile(path.join(sounds, 'tick.wav')))
  .digest('hex');
assert.equal(
  backgroundSha256,
  approvedBackground,
  'Corrected background master must match the verified version',
);
const verdicts = [];
const timers = [];
// Detect audible clock transients from the WAV itself, independently of the generator.
function clockTransients(samples, duration) {
  const windows = [];
  const frameSamples = 441;
  const alpha = 1 - Math.exp((-2 * Math.PI * 700) / 44100);
  let low = 0;
  let energy = 0;
  let count = 0;
  for (let index = 0; index < samples.length; index += 4) {
    const value = samples.readInt16LE(index) / 32768;
    low += alpha * (value - low);
    energy += (value - low) ** 2;
    if (++count === frameSamples) {
      windows.push(Math.sqrt(energy / count));
      count = 0;
      energy = 0;
    }
  }
  const peak = Math.max(...windows);
  const floor = [...windows].sort((a, b) => a - b)[Math.floor(windows.length * 0.5)];
  const prominenceDb = 20 * Math.log10(peak / Math.max(1e-8, floor));
  const threshold = peak * 0.25;
  const beats = [];
  let inBeat = false;
  for (let index = 0; index < windows.length; index++) {
    const loud = windows[index] >= threshold;
    if (loud && !inBeat) beats.push(index * 0.01);
    inBeat = loud;
  }
  const firstQuarter = beats.filter((time) => time < duration / 4).length;
  const lastQuarter = beats.filter((time) => time >= duration * 0.75).length;
  assert.ok(prominenceDb >= 12, 'Clock transients must stand out from the sustained bed');
  assert.ok(beats.length >= 40, 'Clock ticks must be present throughout the question');
  assert.ok(lastQuarter >= firstQuarter * 2, 'Clock ticks must become denser near the deadline');
  return { detectedTicks: beats.length, prominenceDb, firstQuarter, lastQuarter };
}
const previous = JSON.parse(
  await readFile(
    path.join(root, 'output/testing/studio-atmosphere-2026-10-06/audio-before/hashes.json'),
    'utf8',
  ),
);
for (const [cue, duration] of [
  ['tick', 30],
  ['tick-20', 20],
  ['tick-25', 25],
  ['correct', 0.85],
  ['wrong', 0.7],
]) {
  const buffer = await readFile(path.join(sounds, `${cue}.wav`));
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF');
  assert.equal(buffer.toString('ascii', 8, 12), 'WAVE');
  let format;
  let samples;
  for (let offset = 12; offset + 8 <= buffer.length;) {
    const name = buffer.toString('ascii', offset, offset + 4);
    const bytes = buffer.readUInt32LE(offset + 4);
    if (name === 'fmt ') format = buffer.subarray(offset + 8, offset + 8 + bytes);
    if (name === 'data') samples = buffer.subarray(offset + 8, offset + 8 + bytes);
    offset += 8 + bytes + (bytes % 2);
  }
  assert.ok(format && samples, 'WAV must contain format and sample chunks');
  assert.equal(format.readUInt16LE(0), 1, 'PCM');
  assert.equal(format.readUInt16LE(2), 2, 'Stereo');
  assert.equal(format.readUInt32LE(4), 44100);
  assert.equal(format.readUInt16LE(14), 16);
  const measuredDuration = samples.length / (44100 * 4);
  assert.ok(Math.abs(measuredDuration - duration) < 0.001);
  let peak = 0;
  let squares = 0;
  for (let index = 0; index < samples.length; index += 2) {
    const sample = samples.readInt16LE(index) / 32768;
    peak = Math.max(peak, Math.abs(sample));
    squares += sample * sample;
  }
  const peakDbFS = 20 * Math.log10(peak);
  const rmsDbFS = 20 * Math.log10(Math.sqrt(squares / (samples.length / 2)));
  assert.ok(peakDbFS <= (cue.startsWith('tick') ? -6 : -3), 'Audio must leave safe peak headroom');
  assert.equal(samples.readInt16LE(0), 0);
  assert.equal(samples.readInt16LE(samples.length - 2), 0);
  if (cue.startsWith('tick'))
    timers.push({
      cue,
      duration: measuredDuration,
      peakDbFS,
      rmsDbFS,
      ...clockTransients(samples, measuredDuration),
    });
  else {
    assert.equal(
      createHash('sha256').update(buffer).digest('hex'),
      previous[cue + '.wav'],
      'Verdict must remain unchanged',
    );
    verdicts.push({ cue, duration: measuredDuration, peakDbFS, rmsDbFS });
  }
}
assert.ok(Math.abs(verdicts[0].rmsDbFS - verdicts[1].rmsDbFS) < 0.5, 'Verdict loudness must match');
const output = path.join(root, 'output/testing/studio-polish');
await mkdir(output, { recursive: true });
await writeFile(
  path.join(output, 'audio-verification.json'),
  JSON.stringify(
    { backgroundSha256, backgroundUpdated: true, verdictsUnchanged: true, timers, verdicts },
    null,
    2,
  ) + '\n',
);
console.log(
  'Three natural-speed timer masters and unchanged verdicts: duration, RMS and peak headroom passed.',
);
