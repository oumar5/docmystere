import { Player } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Award, ShieldCheck, ShieldAlert, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type EndGamePhaseProps = {
  winner: "Doctors" | "Impostors";
  players: Player[];
  gameId: string;
};

const roleDisplay = {
  Doctor: { name: "Médecin", icon: ShieldCheck, color: "text-primary" },
  MisguidedDoctor: {
    name: "Médecin Égaré",
    icon: ShieldAlert,
    color: "text-destructive",
  },
  MysteryDoc: {
    name: "DocMystère",
    icon: ShieldAlert,
    color: "text-destructive",
  },
};

export default function EndGamePhase({
  winner,
  players,
  gameId,
}: EndGamePhaseProps) {
  const router = useRouter();

  const winningTeam = winner === "Doctors" ? "Les Médecins" : "Les Imposteurs";
  const secretWord = players.find((p) => p.role === "Doctor")?.word;

  return (
    <Card className="w-full max-w-2xl text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <Award className="w-20 h-20 text-yellow-500" />
        </div>
        <CardTitle className="text-4xl font-headline text-primary">
          Partie terminée !
        </CardTitle>
        <CardDescription className="text-xl">
          <span className="font-bold">{winningTeam}</span> ont gagné !
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            Le diagnostic secret était :
          </p>
          <p className="text-3xl font-bold font-headline text-accent">
            {secretWord}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Récapitulatif des rôles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            {players.map((player) => {
              const display = roleDisplay[player.role];
              return (
                <div
                  key={player.id}
                  className="flex items-start gap-4 p-3 bg-secondary rounded-lg"
                >
                  <display.icon
                    className={`w-6 h-6 mt-1 flex-shrink-0 ${display.color}`}
                  />
                  <div>
                    <p className="font-bold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {display.name}
                    </p>
                    {player.word && player.role !== "Doctor" && (
                      <p className="text-xs italic">({player.word})</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 border-t">
          <Button size="lg" onClick={() => router.push("/")}>
            Retour à l'accueil
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={`/learn/${secretWord?.toLowerCase()}`}>
              <FileText className="mr-2 h-5 w-5" />
              Voir la Fiche Pédagogique
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
