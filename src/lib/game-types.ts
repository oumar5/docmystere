export type PlayerRole = "Doctor" | "MisguidedDoctor" | "MysteryDoc";

export interface Player {
  id: string;
  name: string;
  role: PlayerRole;
  word: string | null;
  isEliminated: boolean;
  isYou: boolean;
  votes: number;
}

export interface Clue {
  player: string;
  clue: string;
}

export interface GameState {
  phase: "role_reveal" | "clue_giving" | "voting" | "vote_result" | "end_game";
  round: number;
  players: Player[];
  clues: Clue[];
  eliminatedPlayer: Player | null;
  winner?: "Doctors" | "Impostors";
}
