import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, BrainCircuit, User, Users } from "lucide-react";

export default function PlayPage() {
  const gameModes = [
    {
      title: "Doc Mystère",
      description:
        "Démasquez les imposteurs parmi les médecins. Un jeu de déduction sociale.",
      href: "/create-game",
      icon: Users,
      enabled: true,
    },
    {
      title: "Diagnostic en solo",
      description:
        "Entraînez-vous seul à résoudre des cas cliniques complexes.",
      href: "/solo-game",
      icon: User,
      enabled: true,
    },
    {
      title: "Défi tournant",
      description: "Affrontez vos amis dans un mode de jeu rapide et compétitif.",
      href: "/challenge-game",
      icon: BrainCircuit,
      enabled: true,
    },
  ];

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-background">
      <div className="w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold font-headline mb-2 text-primary">
          Choix du Mode de Jeu
        </h1>
        <p className="text-lg text-muted-foreground mb-12">
          Sélectionnez une expérience pour commencer.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {gameModes.map((mode) => (
            <Card
              key={mode.title}
              className={`flex flex-col transition-all duration-300 ${
                mode.enabled
                  ? "hover:shadow-lg hover:-translate-y-2"
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <mode.icon className="w-12 h-12 text-accent" />
                </div>
                <CardTitle className="text-2xl font-headline">
                  {mode.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription>{mode.description}</CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                <Button asChild disabled={!mode.enabled} className="w-full">
                  <Link href={mode.enabled ? mode.href : "#"}>
                    Sélectionner <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
