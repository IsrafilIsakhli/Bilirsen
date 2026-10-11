import type { Rank } from '@azquiz/contracts';

const tiers = [
  { name: 'Şagird', start: 0, span: 100 },
  { name: 'Tədqiqatçı', start: 300, span: 150 },
  { name: 'Alim', start: 750, span: 200 },
  { name: 'Müdrik', start: 1350, span: 250 },
  { name: 'Əllamə', start: 2100, span: 300 },
] as const;
const divisions = ['III', 'II', 'I'] as const;

export function describeRank(points: number): Rank {
  if (!Number.isSafeInteger(points) || points < 0) throw new RangeError('Invalid rank balance');
  const tier = [...tiers].reverse().find((entry) => points >= entry.start);
  if (!tier) throw new Error('Rank configuration is incomplete');
  const index = Math.min(2, Math.floor((points - tier.start) / tier.span));
  const division = divisions[index];
  if (!division) throw new Error('Rank division is incomplete');
  const final = tier.name === 'Əllamə' && index === 2;
  return {
    points,
    name: tier.name,
    division,
    progress: Math.min(tier.span, points - tier.start - index * tier.span),
    span: tier.span,
    nextAt: final ? null : tier.start + (index + 1) * tier.span,
  };
}
