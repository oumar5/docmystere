
"use client";

import { useState, useEffect } from "react";
import { GameState } from "@/types/game";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Lightbulb, Send, Loader2 } from "lucide-react";
import {
  generateClueSuggestions,
  ClueGenerationInput,
} from "@/ai/flows/clue-generation-assistant";
import { Badge } from "../ui/badge";

type CluePhaseProps = {
  gameState: GameState;
  onClueSubmit: (clue: string, playerId: string) => void;
};

export default function CluePhase({ gameState, onClueSubmit }: CluePhaseProps) {
  const [clue, setClue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const you = gameState.players.find((p) => p.isYou)!;
  const yourClueSubmitted = gameState.clues.some((c) => c.player === you.name);
  
  const activePlayers = gameState.players.filter((p) => !p.isEliminated);
  const currentPlayerTurn = activePlayers[gameState.clues.length];

  useEffect(() => {
    // Mock turn-based clue giving for other players
    const activePlayers = gameState.players.filter(p => !p.isEliminated);
    if(gameState.clues.length < activePlayers.length) {
        const currentPlayer = activePlayers[gameState.clues.length];
        if (currentPlayer && !currentPlayer.isYou) {
            const timeout = setTimeout(() => {
                onClueSubmit(`Indice ${gameState.clues.length + 1}`, currentPlayer.id);
            }, 2000 + Math.random() * 2000);
            return () => clearTimeout(timeout);
        }
    }
  }, [gameState.clues, gameState.players, onClueSubmit]);


  const handleSuggestion = async () => {
    setIsLoadingSuggestions(true);
    const input: ClueGenerationInput = {
      role: you.role,
      word: you.word ?? undefined,
      otherClues: gameState.clues.map((c) => c.clue),
      specialty: gameState.specialty,
    };
    try {
      const result = await generateClueSuggestions(input);
      setSuggestions(result.suggestions);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clue.trim() && !yourClueSubmitted) {
      onClueSubmit(clue.trim(), you.id);
      setClue("");
      setSuggestions([]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">
          Tour {gameState.round} : Les indices
        </CardTitle>
        <CardDescription className="text-lg">
          {yourClueSubmitted
            ? "Attendez que tout le monde ait donné son indice."
            : currentPlayerTurn?.isYou
            ? "C'est votre tour de donner un indice."
            : `Au tour de ${currentPlayerTurn?.name}...`}
        </CardDescription>
        <Badge variant="secondary" className="mx-auto mt-2">{gameState.specialty}</Badge>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 min-h-[80px]">
          {gameState.clues.map((c, i) => (
            <div
              key={i}
              className="p-4 bg-muted rounded-lg text-center flex flex-col justify-center animate-in fade-in"
            >
              <p className="font-semibold text-lg">{c.clue}</p>
              <p className="text-sm text-muted-foreground">{c.player}</p>
            </div>
          ))}
        </div>

        {!yourClueSubmitted && currentPlayerTurn?.isYou && (
          <div className="space-y-4 pt-4 border-t">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={clue}
                onChange={(e) => setClue(e.target.value)}
                placeholder="Votre mot-indice..."
                className="text-lg h-12"
                disabled={yourClueSubmitted}
              />
              <Button
                type="submit"
                size="icon"
                className="h-12 w-12"
                disabled={!clue.trim() || yourClueSubmitted}
              >
                <Send />
              </Button>
            </form>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={handleSuggestion}
                disabled={isLoadingSuggestions || yourClueSubmitted}
              >
                {isLoadingSuggestions ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lightbulb className="mr-2 h-4 w-4" />
                )}
                Obtenir des suggestions
              </Button>
              {suggestions.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {suggestions.map((s, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                      onClick={() => setClue(s)}
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
