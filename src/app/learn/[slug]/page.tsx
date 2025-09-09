import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Mock data for learning sheets
const learningData: Record<string, { title: string; content: string[] }> = {
  sinusite: {
    title: "La Sinusite",
    content: [
      "La sinusite est une inflammation des sinus de la face. Elle est le plus souvent d'origine virale et guérit spontanément en quelques jours.",
      "Les principaux symptômes sont une douleur faciale pulsatile, une congestion nasale, un écoulement nasal (rhinorrhée) et parfois de la fièvre.",
      "Le diagnostic est principalement clinique. Une radiographie des sinus n'est généralement pas nécessaire, sauf en cas de suspicion de complication.",
      "Le traitement de la sinusite virale est symptomatique : lavage de nez, antalgiques, anti-inflammatoires. Les antibiotiques ne sont indiqués qu'en cas de surinfection bactérienne avérée (fièvre persistante, douleur unilatérale intense, etc.).",
    ],
  },
};

export default function LearningPage({ params }: { params: { slug: string } }) {
  const data = learningData[params.slug];

  if (!data) {
    notFound();
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-3xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Link>
        </Button>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <BookOpen className="w-10 h-10 text-primary" />
              <div>
                <CardTitle className="text-3xl font-headline">
                  {data.title}
                </CardTitle>
                <CardDescription>Fiche Pédagogique</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 text-lg">
            {data.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
