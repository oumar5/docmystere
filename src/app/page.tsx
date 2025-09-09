import { Stethoscope } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { JoinGameDialog } from "@/components/home/join-game-dialog";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center items-center gap-4">
          <Stethoscope className="h-12 w-12 md:h-16 md:w-16 text-primary" />
          <h1 className="text-4xl md:text-6xl font-bold font-headline text-primary">
            Doc Mystère
          </h1>
        </div>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Le jeu de déduction médicale où votre diagnostic est votre meilleure
          arme.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/play">Jouer</Link>
          </Button>
          <JoinGameDialog />
        </div>
      </div>
      <footer className="absolute bottom-4 text-sm text-muted-foreground">
        <p>Une version sans authentification du jeu.</p>
      </footer>
    </div>
  );
}
