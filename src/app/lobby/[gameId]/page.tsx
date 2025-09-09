"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Copy, Users, Hourglass } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const gameId = params.gameId as string;
  const isHost = searchParams.get("host") === "true";
  const nickname = searchParams.get("nickname");

  const [players, setPlayers] = useState<string[]>([]);

  useEffect(() => {
    // Mock player joining
    if (nickname) {
      setPlayers((prev) => [...new Set([...prev, nickname])]);
    }

    const mockPlayers = ["Dr. Cuddy", "Dr. Foreman", "Dr. Cameron"];
    let playerIndex = 0;
    const interval = setInterval(() => {
      if (players.length < 4 && playerIndex < mockPlayers.length) {
        setPlayers((prev) => [...new Set([...prev, mockPlayers[playerIndex]])]);
        playerIndex++;
      } else {
        clearInterval(interval);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [nickname]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameId);
    toast({
      title: "Copié !",
      description: "Le code de la partie a été copié dans le presse-papiers.",
    });
  };

  const startGame = () => {
    router.push(`/game/${gameId}`);
  };

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-3xl text-center">
        <CardHeader>
          <div className="flex justify-center items-center gap-2">
            <Hourglass className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-headline text-primary">
              Salon d'attente
            </CardTitle>
          </div>
          <CardDescription>
            Partagez le code pour que vos amis rejoignent la partie.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <Label className="text-sm text-muted-foreground">
              Code de la partie
            </Label>
            <div className="flex items-center justify-center gap-2 mt-2">
              <p className="text-4xl font-mono font-bold p-4 bg-muted rounded-lg tracking-widest">
                {gameId}
              </p>
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-6 w-6 text-muted-foreground" />
              <h3 className="text-xl font-semibold">
                Joueurs ({players.length}/8)
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {players.map((player, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-secondary rounded-lg"
                >
                  <User className="h-5 w-5 text-accent" />
                  <span className="font-medium">{player}</span>
                </div>
              ))}
            </div>
          </div>

          {isHost && (
            <Button
              onClick={startGame}
              size="lg"
              className="w-full"
              disabled={players.length < 3}
            >
              {players.length < 3
                ? `Démarrer (${3 - players.length} joueur(s) manquant(s))`
                : "Démarrer la partie"}
            </Button>
          )}
          {!isHost && (
            <p className="text-muted-foreground">
              En attente de l'hôte pour démarrer la partie...
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
