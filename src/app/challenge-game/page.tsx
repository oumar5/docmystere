"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BrainCircuit, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChallengeGamePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-2xl">
         <Button variant="ghost" asChild className="mb-4">
          <Link href="/play">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au choix du mode
          </Link>
        </Button>
        <Card className="w-full text-center">
          <CardHeader>
             <div className="flex justify-center items-center gap-4 mb-4">
                <BrainCircuit className="w-12 h-12 text-accent" />
                <CardTitle className="text-3xl font-headline text-primary">
                Défi tournant
                </CardTitle>
            </div>
            <CardDescription className="text-lg">
             Affrontez vos amis dans un mode de jeu rapide et compétitif.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">Ce mode de jeu est en cours de développement.</p>
            <Button disabled>Bientôt disponible</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
