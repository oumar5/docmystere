import type { Player } from '@/types/game';

export const mockPlayers: Player[] = [
  { id: "1", name: "Vous", role: "Doctor", word: "Sinusite", isEliminated: false, isYou: true, votes: 0 },
  { id: "2", name: "Dr. Cuddy", role: "Doctor", word: "Sinusite", isEliminated: false, isYou: false, votes: 0 },
  { id: "3", name: "Dr. Foreman", role: "MisguidedDoctor", word: "Rhinite allergique", isEliminated: false, isYou: false, votes: 0 },
  { id: "4", name: "Dr. Cameron", role: "MysteryDoc", word: null, isEliminated: false, isYou: false, votes: 0 },
];
