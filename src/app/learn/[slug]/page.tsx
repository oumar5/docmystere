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
import { learningData } from "@/constants/learn";

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
