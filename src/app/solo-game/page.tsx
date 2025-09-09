
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User, ArrowLeft, Send, Lightbulb, Loader2, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Textarea } from "@/components/ui/textarea";
import {
  generateSoloCase,
  evaluateSoloCase,
  SoloCase,
  SoloCaseEvaluation,
} from "@/ai/flows/solo-case-assistant";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";


interface Specialty {
  id: string;
  label: string;
  parentId?: string | null;
  childrenIds?: string[];
}

export default function SoloGamePage() {
  const [caseState, setCaseState] = useState<"idle" | "loading" | "loaded">("idle");
  const [evaluationState, setEvaluationState] = useState<"idle" | "loading" | "loaded">("idle");
  const [clinicalCase, setClinicalCase] = useState<SoloCase | null>(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [evaluation, setEvaluation] = useState<SoloCaseEvaluation | null>(null);
  
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [selectedSpecialtyValue, setSelectedSpecialtyValue] = useState<string>("");
  const [selectedSubSpecialtyValue, setSelectedSubSpecialtyValue] = useState<string>("");

  useEffect(() => {
    const specialtiesRef = ref(database, 'specialties');
    onValue(specialtiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const specialtiesList: Specialty[] = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setSpecialties(specialtiesList);
      }
    });
  }, []);

  const mainSpecialties = specialties.filter((spec) => !spec.parentId);
  const selectedSpecialty = specialties.find(s => s.id === selectedSpecialtyValue);
  const subSpecialties = selectedSpecialty?.childrenIds?.map(id => specialties.find(s => s.id === id)).filter(Boolean) as Specialty[] || [];

  const handleGenerateCase = async () => {
    const specialtyToUseId = selectedSubSpecialtyValue || selectedSpecialtyValue;
    if (!specialtyToUseId) return;

    const specialtyToUse = specialties.find(s => s.id === specialtyToUseId);
    if (!specialtyToUse) return;

    setCaseState("loading");
    setEvaluation(null);
    setDiagnosis("");
    setEvaluationState("idle");
    try {
      const newCase = await generateSoloCase({ specialty: specialtyToUse.label });
      setClinicalCase(newCase);
      setCaseState("loaded");
    } catch (error) {
      console.error("Error generating case:", error);
      setCaseState("idle");
    }
  };

  const handleSubmitDiagnosis = async () => {
    if (!clinicalCase || !diagnosis) return;
    setEvaluationState("loading");
    try {
      const result = await evaluateSoloCase({
        caseDescription: clinicalCase.caseDescription,
        correctDiagnosis: clinicalCase.diagnosis,
        userDiagnosis: diagnosis,
      });
      setEvaluation(result);
      setEvaluationState("loaded");
    } catch (error) {
      console.error("Error evaluating diagnosis:", error);
      setEvaluationState("idle");
    }
  };
  
  const resetGame = () => {
    setCaseState('idle');
    setSelectedSpecialtyValue("");
    setSelectedSubSpecialtyValue("");
    setClinicalCase(null);
    setEvaluation(null);
  }


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-3xl">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/play">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au choix du mode
          </Link>
        </Button>
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <User className="w-12 h-12 text-accent" />
              <CardTitle className="text-3xl font-headline text-primary">
                Diagnostic en solo
              </CardTitle>
            </div>
            <CardDescription className="text-lg">
              Entraînez-vous seul à résoudre des cas cliniques complexes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {caseState === "idle" && (
              <div className="text-center space-y-4 max-w-sm mx-auto">
                 <p className="text-muted-foreground">Choisissez une spécialité pour commencer.</p>
                 <div className="space-y-2">
                  <Select onValueChange={(value) => {
                    setSelectedSpecialtyValue(value);
                    setSelectedSubSpecialtyValue("");
                  }} value={selectedSpecialtyValue}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une spécialité..." />
                    </SelectTrigger>
                    <SelectContent>
                      {mainSpecialties.map((spec) => (
                        <SelectItem key={spec.id} value={spec.id}>
                          {spec.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                   {subSpecialties.length > 0 && (
                     <Select onValueChange={setSelectedSubSpecialtyValue} value={selectedSubSpecialtyValue}>
                       <SelectTrigger>
                         <SelectValue placeholder="Choisir une sous-spécialité..." />
                       </SelectTrigger>
                       <SelectContent>
                         {subSpecialties.map((subSpec) => (
                           <SelectItem key={subSpec.id} value={subSpec.id}>
                             {subSpec.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                   )}
                 </div>
                <Button onClick={handleGenerateCase} disabled={!selectedSpecialtyValue}>
                  <Lightbulb className="mr-2"/>
                  Générer un cas clinique
                </Button>
              </div>
            )}
            
            {caseState === "loading" && (
                 <div className="flex justify-center items-center space-x-2 py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-lg text-muted-foreground">Génération du cas en cours...</p>
                 </div>
            )}

            {caseState === "loaded" && clinicalCase && (
              <div className="space-y-6 animate-in fade-in">
                <Card>
                    <CardHeader>
                        <CardTitle>Cas Clinique : {clinicalCase.specialty}</CardTitle>
                        <CardDescription>Lisez attentivement et posez votre diagnostic.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {clinicalCase.caseDescription.split('\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </CardContent>
                </Card>
                
                <div className="space-y-2">
                    <Textarea 
                      placeholder="Entrez votre diagnostic ici..."
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      rows={3}
                      className="text-base"
                      disabled={evaluationState !== 'idle'}
                    />
                     <Button onClick={handleSubmitDiagnosis} disabled={!diagnosis || evaluationState !== 'idle'}>
                      {evaluationState === 'loading' ? <Loader2 className="mr-2 animate-spin"/> : <Send className="mr-2"/> }
                      Soumettre le diagnostic
                    </Button>
                </div>

                {evaluationState === "loading" && (
                    <div className="flex justify-center items-center space-x-2 py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        <p className="text-md text-muted-foreground">Évaluation en cours...</p>
                    </div>
                )}

                {evaluationState === "loaded" && evaluation && (
                   <Card className={`animate-in fade-in ${evaluation.isCorrect ? 'border-green-500' : 'border-red-500'}`}>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                {evaluation.isCorrect ? <CheckCircle className="text-green-500"/> : <XCircle className="text-red-500"/>}
                                Évaluation du diagnostic
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Badge variant={evaluation.isCorrect ? "default" : "destructive"} className={evaluation.isCorrect ? "bg-green-600" : ""}>
                                {evaluation.isCorrect ? "Correct" : "Incorrect"}
                            </Badge>
                            <p>{evaluation.feedback}</p>
                            {!evaluation.isCorrect && (
                                <p><span className="font-semibold">Le bon diagnostic était :</span> {clinicalCase.diagnosis}</p>
                            )}
                        </CardContent>
                   </Card>
                )}

                <div className="pt-4 border-t text-center">
                    <Button onClick={resetGame} variant="outline">
                        Générer un autre cas
                    </Button>
                </div>

              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </main>
  );
}
