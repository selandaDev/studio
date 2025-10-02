
"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { addContent } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  type: z.enum(["movie", "series", "music"], { required_error: "Debes seleccionar un tipo." }),
  title: z.string().min(1, "El título es obligatorio."),
  description: z.string().min(1, "La descripción es obligatoria."),
  genre: z.string().min(1, "El género es obligatorio."),
  year: z.coerce.number().min(1800, "El año debe ser válido.").max(new Date().getFullYear(), "El año no puede ser en el futuro."),
  artist: z.string().optional(),
  path: z.string().optional(),
  url: z.string().url("Debe ser una URL válida.").optional().or(z.literal('')),
});

type FormValues = z.infer<typeof FormSchema>;

export default function AddContentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      year: new Date().getFullYear(),
      artist: "",
      path: "",
      url: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const { path, ...contentData } = data; // 'path' is just for simulation, not added to data
    const newContent = addContent(contentData);
    toast({
      title: "¡Éxito!",
      description: `"${newContent.title}" ha sido añadido a tu biblioteca.`,
    });
    router.push(`/player/${newContent.id}`);
  };

  const contentType = form.watch("type");

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Añadir Nuevo Contenido</CardTitle>
              <CardDescription>Completa el formulario para añadir una nueva película, serie o álbum de música a tu biblioteca.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contenido</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo de contenido" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="movie">Película</SelectItem>
                        <SelectItem value="series">Serie de TV</SelectItem>
                        <SelectItem value="music">Álbum de Música</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="ej., La Gran Aventura" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {contentType === 'music' && (
                <FormField
                  control={form.control}
                  name="artist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artista</FormLabel>
                      <FormControl>
                        <Input placeholder="ej., Los Increíbles" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Un breve resumen del contenido." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="genre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Género</FormLabel>
                      <FormControl>
                        <Input placeholder="ej., Ciencia Ficción" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Año de Lanzamiento</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="ej., 2024" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                  control={form.control}
                  name="path"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ruta del Archivo o Carpeta</FormLabel>
                    <FormControl>
                      <Input placeholder="/ruta/a/tu/archivo/multimedia" {...field} />
                    </FormControl>
                     <p className="text-sm text-muted-foreground">
                        Esto es una simulación. En una aplicación real, buscarías un archivo.
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    O
                  </span>
                </div>
              </div>
              
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL del Contenido (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://www.youtube.com/watch?v=..." {...field} />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                        ej., YouTube, Vimeo, o un enlace directo a un archivo (.mp4, .mp3).
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto">Añadir a la Biblioteca</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
