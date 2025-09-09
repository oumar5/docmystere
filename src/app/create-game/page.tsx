"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const formSchema = z.object({
  nickname: z
    .string()
    .min(2, {
      message: "Le pseudonyme doit contenir au moins 2 caractères.",
    })
    .max(20, {
      message: "Le pseudonyme ne doit pas dépasser 20 caractères.",
    }),
  specialty: z.string({
    required_error: "Veuillez sélectionner une spécialité.",
  }),
  subSpecialty: z.string().optional(),
  difficulty: z.enum(["1", "2", "3"], {
    required_error: "Veuillez sélectionner un niveau de difficulté.",
  }),
});

export default function CreateGamePage() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nickname: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const gameId = Math.random().toString(36).substring(2, 7).toUpperCase();
    console.log("Creating game with settings:", values);
    router.push(`/lobby/${gameId}?host=true&nickname=${values.nickname}`);
  }

  const specialties = [
    { value: "chirurgie", label: "Chirurgie" },
    { value: "cardiologie", label: "Cardiologie" },
    { value: "dermatologie", label: "Dermatologie" },
    { value: "neurologie", label: "Neurologie" },
    { value: "pediatrie", label: "Pédiatrie" },
  ];

  const subSpecialties: Record<string, { value: string; label: string }[]> = {
    chirurgie: [
      { value: "orl", label: "ORL" },
      { value: "orthopedie", label: "Orthopédie" },
      { value: "viscerale", label: "Viscérale" },
    ],
  };

  const selectedSpecialty = form.watch("specialty");

  return (
    <main className="flex items-center justify-center min-h-screen p-4 bg-background">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-headline text-primary">
            Créer une partie
          </CardTitle>
          <CardDescription>
            Configurez votre partie de Mystère Diagnostique.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="nickname"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pseudonyme de l'hôte</FormLabel>
                    <FormControl>
                      <Input placeholder="Dr. House" {...field} />
                    </FormControl>
                    <FormDescription>
                      Ce sera votre nom dans le jeu.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spécialité</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une spécialité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {specialties.map((spec) => (
                            <SelectItem key={spec.value} value={spec.value}>
                              {spec.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subSpecialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sous-spécialité (si applicable)</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={
                          !selectedSpecialty || !subSpecialties[selectedSpecialty]
                        }
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une sous-spécialité" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {selectedSpecialty &&
                            subSpecialties[selectedSpecialty]?.map((subSpec) => (
                              <SelectItem key={subSpec.value} value={subSpec.value}>
                                {subSpec.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Niveau de difficulté</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="1" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Niveau 1 (Facile)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="2" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Niveau 2 (Moyen)
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="3" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Niveau 3 (Difficile)
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full">
                Créer la partie
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
