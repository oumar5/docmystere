import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Player } from "@/lib/game-types";
import { User, Brain, HelpCircle, FileText } from "lucide-react";

type RoleRevealProps = {
  player: Player;
  onContinue: () => void;
};

const roleDetails = {
  Doctor: {
    title: "Vous êtes un Médecin",
    description:
      "Votre mission est d'identifier les imposteurs (Médecin Égaré et DocMystère) et de les éliminer.",
    icon: User,
  },
  MisguidedDoctor: {
    title: "Vous êtes un Médecin Égaré",
    description:
      "Votre mot est légèrement différent. Donnez des indices crédibles pour vous faire passer pour un vrai Médecin.",
    icon: Brain,
  },
  MysteryDoc: {
    title: "Vous êtes le DocMystère",
    description:
      "Vous n'avez aucun mot. Improvisez en vous basant sur les indices des autres pour ne pas être démasqué.",
    icon: HelpCircle,
  },
};

export default function RoleReveal({ player, onContinue }: RoleRevealProps) {
  const details = roleDetails[player.role];

  return (
    <Card className="w-full max-w-md text-center mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <details.icon className="w-16 h-16 text-primary" />
        </div>
        <CardTitle className="text-3xl font-headline">{details.title}</CardTitle>
        <CardDescription className="text-lg">
          {details.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {player.word && (
          <div className="p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              Votre diagnostic secret est :
            </p>
            <p className="text-4xl font-bold font-headline text-accent flex items-center justify-center gap-2">
              <FileText className="w-8 h-8" /> {player.word}
            </p>
          </div>
        )}
        <Button onClick={onContinue} size="lg" className="w-full">
          J'ai compris
        </Button>
      </CardContent>
    </Card>
  );
}
