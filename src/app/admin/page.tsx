
"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue, set, push, serverTimestamp } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { List, PlusCircle } from "lucide-react";

interface Specialty {
  id: string;
  label: string;
  parentId?: string | null;
}

const formSchema = z.object({
  label: z.string().min(2, "Le nom doit faire au moins 2 caractères."),
  parentId: z.string().optional().nullable(),
});

export default function AdminPage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      label: "",
      parentId: null,
    },
  });

  useEffect(() => {
    const specialtiesRef = ref(database, "specialties");
    const unsubscribe = onValue(specialtiesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const specialtiesList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setSpecialties(specialtiesList);
      } else {
        setSpecialties([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newSpecialtyRef = push(ref(database, "specialties"));
      await set(newSpecialtyRef, {
        label: values.label,
        parentId: values.parentId || null,
        createdAt: serverTimestamp(),
      });

      toast({
        title: "Succès !",
        description: "La spécialité a été ajoutée.",
      });
      form.reset();
    } catch (error) {
      console.error("Error adding specialty:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter la spécialité.",
        variant: "destructive",
      });
    }
  };

  const mainSpecialties = specialties.filter((s) => !s.parentId);

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-background">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-center font-headline text-primary">
          Panneau d'Administration
        </h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle />
              Ajouter une nouvelle spécialité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom de la spécialité</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Cardiologie" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spécialité Parente (Optionnel)</FormLabel>
                      <Select
                        onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                        value={field.value ?? "none"}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Aucune (Spécialité principale)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">
                            Aucune (Spécialité principale)
                          </SelectItem>
                          {specialties.map((spec) => (
                            <SelectItem key={spec.id} value={spec.id}>
                              {spec.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Laissez vide pour créer une spécialité principale.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit">Ajouter la spécialité</Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <List />
              Liste des spécialités
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mainSpecialties.length > 0 ? (
              <ul className="space-y-2">
                {mainSpecialties.map((mainSpec) => (
                  <li key={mainSpec.id}>
                    <p className="font-bold">{mainSpec.label}</p>
                    <ul className="pl-6 list-disc">
                      {specialties
                        .filter((s) => s.parentId === mainSpec.id)
                        .map((subSpec) => (
                          <li key={subSpec.id}>{subSpec.label}</li>
                        ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                Aucune spécialité trouvée. Ajoutez-en une pour commencer.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
