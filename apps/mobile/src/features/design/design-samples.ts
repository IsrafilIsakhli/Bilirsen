import type { DuelStage, DuelStageDisplay } from '../duel/duel-stage';
import type { StandingDisplay } from '../leaderboard/standings-content';

// Explicit presentation samples, used only in the development design viewer.
// These do not enter query caches, session state, game commands or rank ledgers.
export function sampleDuel(stage: DuelStage): DuelStageDisplay {
  return {
    stage,
    self: { name: 'Nərmin', score: stage === 'defeat' ? 200 : stage === 'question' ? 75 : 240 },
    opponent: {
      name: 'Rauf',
      score: stage === 'defeat' ? 230 : stage === 'question' ? 80 : stage === 'victory' ? 225 : 240,
    },
    secondsLabel: stage === 'search' ? '00:12' : stage === 'faceoff' ? '3' : '18 san',
    rankDeltaLabel: stage === 'victory' ? '+25 xal' : '−25 xal',
    questionNumber: 4,
    totalQuestions: 10,
    question: {
      text: 'Bir musiqi əsərinin sürətini ifadə edən termin hansıdır?',
      points: 25,
      options: [
        { key: 'A', text: 'Tembr' },
        { key: 'B', text: 'Tempo' },
        { key: 'C', text: 'Tonallıq' },
        { key: 'D', text: 'Akkord' },
      ],
    },
  };
}
export const sampleStandings: readonly StandingDisplay[] = [
  { position: 1, name: 'Nərmin', points: '8.000', rankLabel: 'Əllamə I' },
  { position: 2, name: 'Rauf', points: '6.500', rankLabel: 'Əllamə I' },
  { position: 3, name: 'Aysel', points: '6.000', rankLabel: 'Əllamə I' },
  { position: 4, name: 'Kənan', points: '5.820', rankLabel: 'Əllamə I' },
  { position: 5, name: 'Ləman', points: '5.760', rankLabel: 'Əllamə I' },
];
export const sampleStandingSelf: StandingDisplay = {
  position: 42,
  name: 'Sən',
  points: '172',
  rankLabel: 'Şagird II',
};
