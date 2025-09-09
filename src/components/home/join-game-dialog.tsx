"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export function JoinGameDialog() {
  const [gameCode, setGameCode] = useState("");
  const [nickname, setNickname] = useState("");
  const router = useRouter();

  const handleJoinGame = () => {
    // For this mock, we'll just navigate to the lobby.
    if (gameCode && nickname) {
      router.push(`/lobby/${gameCode}?nickname=${nickname}`);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="text-lg px-8 py-6">
          Rejoindre une partie
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rejoindre une partie</DialogTitle>
          <DialogDescription>
            Entrez le code de la partie et votre pseudonyme pour rejoindre.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="game-code" className="text-right">
              Code
            </Label>
            <Input
              id="game-code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toUpperCase())}
              className="col-span-3"
              placeholder="Ex: ABCDE"
              maxLength={5}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nickname" className="text-right">
              Pseudonyme
            </Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="col-span-3"
              placeholder="Votre pseudo"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleJoinGame}
            disabled={!gameCode || !nickname}
          >
            Rejoindre
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
