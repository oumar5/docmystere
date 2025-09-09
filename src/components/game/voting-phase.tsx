import { GameState } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { User, Vote } from "lucide-react";

type VotingPhaseProps = {
  gameState: GameState;
  onVote: (votedPlayerId: string) => void;
};

export default function VotingPhase({ gameState, onVote }: VotingPhaseProps) {
  const you = gameState.players.find((p) => p.isYou)!;
  const availablePlayers = gameState.players.filter(
    (p) => !p.isEliminated && p.id !== you.id
  );

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline">Débat et Vote</CardTitle>
        <CardDescription className="text-lg">
          Discutez avec les autres joueurs, puis votez pour éliminer un
          suspect.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2 text-center">
            Indices du tour :
          </h3>
          <div className="flex flex-wrap gap-2 justify-center">
            {gameState.clues.map((clue, index) => (
              <div
                key={index}
                className="bg-muted px-3 py-1 rounded-full text-sm"
              >
                <span className="font-semibold">{clue.player}:</span> {clue.clue}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
          {availablePlayers.map((player) => (
            <Card
              key={player.id}
              className="text-center p-4 flex flex-col items-center justify-between transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <User className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="font-bold text-lg mb-4">{player.name}</p>
              <Button className="w-full" onClick={() => onVote(player.id)}>
                <Vote className="mr-2 h-4 w-4" />
                Voter
              </Button>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
