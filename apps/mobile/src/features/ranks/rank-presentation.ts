import type { IconName } from '../../components/studio';

export const rankTiers: readonly { name: string; icon: IconName; caption: string }[] = [
  { name: 'Şagird', icon: 'book-outline', caption: 'Bilik yolunun başlanğıcı' },
  { name: 'Tədqiqatçı', icon: 'search-outline', caption: 'Sualların ardınca' },
  { name: 'Alim', icon: 'school-outline', caption: 'Bilikdən əminliyə' },
  { name: 'Müdrik', icon: 'library-outline', caption: 'Dərin düşüncə, dəqiq cavab' },
  { name: 'Əllamə', icon: 'ribbon-outline', caption: 'Bilik yolunun zirvəsi' },
];

export function rankIcon(name: string): IconName {
  return rankTiers.find((tier) => tier.name === name)?.icon ?? 'book-outline';
}
