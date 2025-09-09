
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import RoleReveal from "@/components/game/role-reveal";
import CluePhase from "@/components/game/clue-phase";
import VotingPhase from "@/components/game/voting-phase";
import VoteResultPhase from "@/components/game/vote-result-phase";
import { GameState, Player } from "@/types/game";
import { Loader2 } from "lucide-react";
import EndGamePhase from "@/components/game/end-game-phase";
import { mockPlayers } from "@/constants/game";
import { database } from "@/lib/firebase";
import { ref, onValue, set } from "firebase/database";

export default function GamePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const router = useRouter();
  const params = useParams();
  const gameId = params.gameId as string;
  const searchParams = useSearchParams();
  const specialty = searchParams.get("specialty") || "Médecine générale";
  const nickname = searchParams.get("nickname");

  useEffect(() => {
    const gameRef = ref(database, `games/${gameId}`);

    const unsubscribe = onValue(gameRef, (snapshot) => {
        const state = snapshot.val();
        if (state) {
            setGameState(state);
        } else {
            // Initial state for the host
             const initialGameState = {
                phase: "role_reveal",
                round: 1,
                players: mockPlayers.map(p => p.name === 'Vous' ? {...p, id: nickname, name: nickname} : p),
                clues: [],
                eliminatedPlayer: null,
                specialty: specialty,
             };
             set(gameRef, initialGameState);
        }
    });

    return () => unsubscribe();
  }, [gameId, specialty, nickname]);

  const updateGameState = (newState: Partial<GameState>) => {
      const gameRef = ref(database, `games/${gameId}`);
      set(gameRef, { ...gameState, ...newState });
  }

  const nextPhase = () => {
    if (!gameState) return;

    switch (gameState.phase) {
      case "role_reveal":
        updateGameState({ phase: "clue_giving" });
        break;
      case "clue_giving":
        if (gameState.clues.length === gameState.players.filter((p) => !p.isEliminated).length) {
          updateGameState({ phase: "voting" });
        }
        break;
      case "voting":
        const players = [...gameState.players];
        const target = players.find((p) => p.role !== "Doctor" && !p.isEliminated) || players.find((p) => p.name !== nickname && !p.isEliminated);
        if (target) {
          const you = players.find(p => p.name === nickname);
          if (you) you.votes = 1;
          target.votes = 2;

          const eliminatedPlayer = { ...target, isEliminated: true };
          const updatedPlayers = players.map((p) => (p.id === eliminatedPlayer.id ? eliminatedPlayer : p));

          updateGameState({
              phase: "vote_result",
              players: updatedPlayers,
              eliminatedPlayer: eliminatedPlayer,
            }
          );
        }
        break;
      case "vote_result":
        const doctors = gameState.players.filter((p) => p.role === "Doctor" && !p.isEliminated);
        const impostors = gameState.players.filter((p) => (p.role === "MisguidedDoctor" || p.role === "MysteryDoc") && !p.isEliminated);

        if (impostors.length === 0) {
          updateGameState({ phase: "end_game", winner: "Doctors" });
        } else if (impostors.length >= doctors.length) {
          updateGameState({ phase: "end_game", winner: "Impostors" });
        } else {
          updateGameState({
              phase: "clue_giving",
              round: gameState.round + 1,
              clues: [],
              eliminatedPlayer: null,
            }
          );
        }
        break;
      case "end_game":
        router.push(`/`);
        break;
    }
  };

  const handleClueSubmit = (clue: string, playerId: string) => {
    if (!gameState) return;
    const player = gameState.players.find((p) => p.id === playerId);
    if (!player) return;
    const newClue = { player: player.name, clue };
    const updatedClues = [...(gameState.clues || []), newClue];
    
    const newState: Partial<GameState> = { clues: updatedClues };

    const activePlayers = gameState.players.filter((p) => !p.isEliminated);
    if (updatedClues.length === activePlayers.length) {
        setTimeout(() => updateGameState({ phase: 'voting'}), 1000);
    }
    updateGameState(newState);
  };

  const handleVote = (votedPlayerId: string) => {
    console.log(`Voted for ${votedPlayerId}`);
    // Voting logic will be handled server-side or in a more robust client-side way
    nextPhase();
  };

  if (!gameState) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  const player = gameState.players.find((p) => p.name === nickname);
  if (!player) {
     return <div className="text-center p-8">Erreur : joueur non trouvé. Tentative de reconnexion... <Loader2 className="inline-block h-6 w-6 animate-spin text-primary" /></div>;
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
