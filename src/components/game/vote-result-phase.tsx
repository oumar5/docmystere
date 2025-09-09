import { Player } from "@/lib/game-types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { UserX, ShieldCheck, ShieldAlert } from "lucide-react";

type VoteResultPhaseProps = {
  eliminatedPlayer: Player;
  onContinue: () => void;
};

export default function VoteResultPhase({
  eliminatedPlayer,
  onContinue,
}: VoteResultPhaseProps) {
  const isImpostor = eliminatedPlayer.role !== "Doctor";
  const message = isImpostor
    ? "Félicitations, vous avez démasqué un imposteur !"
    : "Mauvais choix... Vous avez éliminé un bon médecin.";

  const RoleIcon = isImpostor ? ShieldAlert : ShieldCheck;

  return (
    <Card className="w-full max-w-md text-center mx-auto">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <UserX className="w-16 h-16 text-destructive" />
        </div>
        <CardTitle className="text-3xl font-headline">
          {eliminatedPlayer.name} a été éliminé(e).
        </CardTitle>
        <CardDescription
          className={`text-lg font-semibold ${
            isImpostor ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-lg flex items-center justify-center gap-4">
          <RoleIcon
            className={`w-8 h-8 ${
              isImpostor ? "text-destructive" : "text-primary"
            }`}
          />
          <div>
            <p className="text-sm text-muted-foreground">Son rôle était :</p>
            <p className="text-xl font-bold">
              {eliminatedPlayer.role === "Doctor"
                ? "Médecin"
                : eliminatedPlayer.role === "MisguidedDoctor"
                ? "Médecin Égaré"
                : "DocMystère"}
            </p>
            {eliminatedPlayer.word && (
              <p className="text-sm">({eliminatedPlayer.word})</p>
            )}
          </div>
        </div>
        <Button onClick={onContinue} size="lg" className="w-full">
          Tour suivant
        </Button>
      </CardContent>
    </Card>
  );
}
