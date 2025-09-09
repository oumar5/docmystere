
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
import { User, Copy, Users, Hourglass, Sprout, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { database } from "@/lib/firebase";
import { ref, onValue, set, get } from "firebase/database";
import type { Player } from "@/types/game";


export default function LobbyPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const gameId = params.gameId as string;
  const isHost = searchParams.get("host") === "true";
  const nickname = searchParams.get("nickname");
  const specialty = searchParams.get("specialty");
  const difficulty = searchParams.get("difficulty");

  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (!gameId || !nickname) return;

    const gameRef = ref(database, `games/${gameId}`);
    const playersRef = ref(database, `games/${gameId}/players`);
    const playerRef = ref(database, `games/${gameId}/players/${nickname}`);

    if (isHost) {
        set(gameRef, {
            specialty,
            difficulty,
            phase: 'lobby',
            players: {
                [nickname]: {
                    id: nickname,
                    name: nickname,
                    isHost: true,
                }
            }
        });
    } else {
       set(playerRef, {
            id: nickname,
            name: nickname,
            isHost: false,
        });
    }

    const unsubscribe = onValue(playersRef, (snapshot) => {
        const playersData = snapshot.val();
        if (playersData) {
            setPlayers(Object.values(playersData));
        }
    });

    return () => unsubscribe();

  }, [gameId, nickname, isHost, specialty, difficulty]);


  const copyToClipboard = () => {
    navigator.clipboard.writeText(gameId);
    toast({
      title: "Copié !",
      description: "Le code de la partie a été copié dans le presse-papiers.",
    });
  };

  const startGame = () => {
    const queryParams = new URLSearchParams(searchParams);
    router.push(`/game/${gameId}?${queryParams.toString()}`);
  };

  const difficultyMap: {[key: string]: string} = {
    "1": "Facile",
    "2": "Moyen",
    "3": "Difficile"
  }

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
          <div className="flex flex-wrap justify-center gap-4">
             {specialty && <Badge variant="secondary" className="text-lg p-2 flex items-center gap-2"><Sprout className="h-5 w-5"/>{specialty}</Badge>}
             {difficulty && <Badge variant="secondary" className="text-lg p-2 flex items-center gap-2"><Shield className="h-5 w-5"/>Niveau {difficultyMap[difficulty]}</Badge>}
          </div>

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
                  <span className="font-medium">{player.name}</span>
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
