"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import RoleReveal from "@/components/game/role-reveal";
import CluePhase from "@/components/game/clue-phase";
import VotingPhase from "@/components/game/voting-phase";
import VoteResultPhase from "@/components/game/vote-result-phase";
import { GameState, Player } from "@/lib/game-types";
import { Loader2 } from "lucide-react";
import EndGamePhase from "@/components/game/end-game-phase";

const mockPlayers: Player[] = [
  { id: "1", name: "Vous", role: "Doctor", word: "Sinusite", isEliminated: false, isYou: true, votes: 0 },
  { id: "2", name: "Dr. Cuddy", role: "Doctor", word: "Sinusite", isEliminated: false, isYou: false, votes: 0 },
  { id: "3", name: "Dr. Foreman", role: "MisguidedDoctor", word: "Rhinite allergique", isEliminated: false, isYou: false, votes: 0 },
  { id: "4", name: "Dr. Cameron", role: "MysteryDoc", word: null, isEliminated: false, isYou: false, votes: 0 },
];

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId as string;

  useEffect(() => {
    // Initialize game state
    setGameState({
      phase: "role_reveal",
      round: 1,
      players: mockPlayers,
      clues: [],
      eliminatedPlayer: null,
    });
  }, []);

  const nextPhase = () => {
    if (!gameState) return;

    switch (gameState.phase) {
      case "role_reveal":
        setGameState((prev) => (prev ? { ...prev, phase: "clue_giving" } : null));
        break;
      case "clue_giving":
        if (gameState.clues.length === gameState.players.filter((p) => !p.isEliminated).length) {
          setGameState((prev) => (prev ? { ...prev, phase: "voting" } : null));
        }
        break;
      case "voting":
        const players = [...gameState.players];
        const target = players.find((p) => p.role !== "Doctor" && !p.isEliminated) || players.find((p) => !p.isYou && !p.isEliminated);
        if (target) {
          players.find((p) => p.id === "2")!.votes = 1;
          target.votes = 2;

          const eliminatedPlayer = { ...target, isEliminated: true };
          const updatedPlayers = players.map((p) => (p.id === eliminatedPlayer.id ? eliminatedPlayer : p));

          setGameState((prev) => prev ? {
              ...prev,
              phase: "vote_result",
              players: updatedPlayers,
              eliminatedPlayer: eliminatedPlayer,
            } : null
          );
        }
        break;
      case "vote_result":
        const doctors = gameState.players.filter((p) => p.role === "Doctor" && !p.isEliminated);
        const impostors = gameState.players.filter((p) => (p.role === "MisguidedDoctor" || p.role === "MysteryDoc") && !p.isEliminated);

        if (impostors.length === 0) {
          setGameState((prev) => prev ? { ...prev, phase: "end_game", winner: "Doctors" } : null);
        } else if (impostors.length >= doctors.length) {
          setGameState((prev) => prev ? { ...prev, phase: "end_game", winner: "Impostors" } : null);
        } else {
          setGameState((prev) => prev ? {
              ...prev,
              phase: "clue_giving",
              round: prev.round + 1,
              clues: [],
              eliminatedPlayer: null,
            } : null
          );
        }
        break;
      case "end_game":
        router.push(`/`);
        break;
    }
  };

  const handleClueSubmit = (clue: string, playerId: string) => {
    setGameState((prev) => {
      if (!prev) return null;
      const player = prev.players.find((p) => p.id === playerId);
      if (!player) return prev;
      const newClue = { player: player.name, clue };
      const updatedClues = [...prev.clues, newClue];
      const newState = { ...prev, clues: updatedClues };

      const activePlayers = prev.players.filter((p) => !p.isEliminated);
      if (updatedClues.length === activePlayers.length) {
        setTimeout(() => nextPhase(), 1000);
      }
      return newState;
    });
  };

  const handleVote = (votedPlayerId: string) => {
    console.log(`Voted for ${votedPlayerId}`);
    nextPhase();
  };

  if (!gameState) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  const player = gameState.players.find((p) => p.isYou)!;
  if (!player) {
     return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-4xl">
        {gameState.phase === "role_reveal" && (
          <div key="role_reveal" className="animate-in fade-in duration-500">
            <RoleReveal player={player} onContinue={nextPhase} />
          </div>
        )}
        {gameState.phase === "clue_giving" && (
          <div key="clue_giving" className="animate-in fade-in zoom-in-95 duration-500">
            <CluePhase gameState={gameState} onClueSubmit={handleClueSubmit} />
          </div>
        )}
        {gameState.phase === "voting" && (
          <div key="voting" className="animate-in fade-in duration-500">
            <VotingPhase gameState={gameState} onVote={handleVote} />
          </div>
        )}
        {gameState.phase === "vote_result" && gameState.eliminatedPlayer && (
          <div key="vote_result" className="animate-in fade-in zoom-in-95 duration-500">
            <VoteResultPhase eliminatedPlayer={gameState.eliminatedPlayer} onContinue={nextPhase} />
          </div>
        )}
        {gameState.phase === "end_game" && gameState.winner && (
          <div key="end_game" className="animate-in fade-in duration-500">
            <EndGamePhase winner={gameState.winner} players={gameState.players} gameId={gameId} />
          </div>
        )}
      </div>
    </main>
  );
}
