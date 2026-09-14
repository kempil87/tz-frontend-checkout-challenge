import type { Sandbox } from '@checkout/contracts';

type SandboxCard = Sandbox['cards'][number];

export const getSelectedSandboxCard = (cards: SandboxCard[], selectedId: string) => {
  if (!cards.length) {
    return undefined;
  }

  if (!selectedId) {
    return cards[0];
  }

  for (const card of cards) {
    if (card.id === selectedId) {
      return card;
    }
  }

  return cards[0];
};
