
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { addContent, AddContentPayload, getContent, Content } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";

const FormSchema = z.object({
  type: z.enum(["movie", "series", "music"], { required_error: "Debes seleccionar un tipo." }),
  // Movie fields
  title: z.string(),
  description: z.string(),
  genre: z.string(),
  year: z.coerce.number(),
  imageUrl: z.string().url().or(z.literal('')),
  // Series/Music specific
  seriesId: z.string().optional(),
  albumId: z.string().optional(),
  artist: z.string().optional(),
  episodeTitle: z.string().optional(),
  trackTitle: z.string().optional(),
  url: z.string(), // Now for episode/track/movie url
})
.superRefine((data, ctx) => {
    if (data.type === 'movie') {
        if (!data.title) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El título es obligatorio.", path: ["title"] });
        if (!data.description) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La descripción es obligatoria.", path: ["description"] });
        if (!data.genre) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El género es obligatorio.", path: ["genre"] });
        if (!data.year) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El año es obligatorio.", path: ["year"] });
    }
    if (data.type === 'series') {
        if (!data.seriesId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debes seleccionar una serie o crear una nueva.", path: ["seriesId"] });
        if (data.seriesId === 'new' && !data.title) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El título de la serie es obligatorio.", path: ["title"] });
        if (!data.episodeTitle) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El título del episodio es obligatorio.", path: ["episodeTitle"]});
        if (!data.url) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La URL o ruta del episodio es obligatoria.", path: ["url"] });
    }
    if (data.type === 'music') {
        if (!data.albumId) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Debes seleccionar un álbum o crear uno nuevo.", path: ["albumId"] });
        if (data.albumId === 'new' && !data.title) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El título del álbum es obligatorio.", path: ["title"] });
        if (data.albumId === 'new' && !data.artist) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El artista es obligatorio para un nuevo álbum.", path: ["artist"] });
        if (!data.trackTitle) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El título de la canción es obligatorio.", path: ["trackTitle"] });
        if (!data.url) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La URL o ruta de la canción es obligatoria.", path: ["url"] });
    }
});


type FormValues = z.infer<typeof FormSchema>;

export default function AddContentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [series, setSeries] = useState<Content[]>([]);
  const [albums, setAlbums] = useState<Content[]>([]);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      genre: "",
      year: new Date().getFullYear(),
      artist: "",
      imageUrl: "",
      url: "",
      seriesId: "",
      albumId: "",
      episodeTitle: "",
      trackTitle: "",
    },
  });

  useEffect(() => {
    async function fetchCollections() {
        const [allSeries, allMusic] = await Promise.all([
            getContent({type: 'series'}),
            getContent({type: 'music'})
        ]);
        setSeries(allSeries);
        setAlbums(allMusic);
    }
    fetchCollections();
  }, [])


  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    let payload: AddContentPayload;
    
    const commonData = {
        title: data.title,
        description: data.description,
        genre: data.genre,
        year: data.year,
        imageUrl: data.imageUrl || '',
    };

    if (data.type === 'movie') {
        payload = { ...commonData, type: 'movie', url: data.url };
    } else if (data.type === 'series') {
        payload = {
            ...commonData,
            type: 'series',
            seriesId: data.seriesId!,
            episodeTitle: data.episodeTitle!,
            url: data.url,
        };
    } else if (data.type === 'music') {
        payload = {
            ...commonData,
            type: 'music',
            albumId: data.albumId!,
            artist: data.artist!,
            trackTitle: data.trackTitle!,
            url: data.url,
        };
    } else {
        return; // Should not happen
    }
    
    const newContent = await addContent(payload);

    toast({
      title: "¡Éxito!",
      description: `Contenido añadido a "${newContent.title}".`,
    });
    router.push(`/player/${newContent.id}`);
  };

  const contentType = form.watch("type");
  const seriesId = form.watch("seriesId");
  const albumId = form.watch("albumId");

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle>Añadir Nuevo Contenido</CardTitle>
              <CardDescription>Completa el formulario para añadir contenido a tu biblioteca.</CardDescription>
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
                        <SelectItem value="series">Episodio de Serie</SelectItem>
                        <SelectItem value="music">Canción de Álbum</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

            {/* MOVIE FORM */}
            {contentType === 'movie' && (
                <>
                     <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Título</FormLabel><FormControl><Input placeholder="ej., La Gran Aventura" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea placeholder="Un breve resumen del contenido." {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <div className="grid grid-cols-2 gap-4">
                        <FormField control={form.control} name="genre" render={({ field }) => ( <FormItem><FormLabel>Género</FormLabel><FormControl><Input placeholder="ej., Ciencia Ficción" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        <FormField control={form.control} name="year" render={({ field }) => ( <FormItem><FormLabel>Año</FormLabel><FormControl><Input type="number" placeholder="ej., 2024" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     </div>
                     <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>URL del Póster (Opcional)</FormLabel><FormControl><Input type="url" placeholder="https://ruta/a/imagen.jpg" {...field} /></FormControl><FormDescription>Si se deja en blanco, se usará una imagen por defecto.</FormDescription><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="url" render={({ field }) => (<FormItem><FormLabel>Ruta del Archivo o URL</FormLabel><FormControl><Input placeholder="/files/pelis/mi-video.mp4" {...field} /></FormControl><FormDescription>Ruta local o URL externa.</FormDescription><FormMessage /></FormItem>)} />
                </>
            )}

            {/* SERIES FORM */}
            {contentType === 'series' && (
                <>
                    <FormField control={form.control} name="seriesId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Serie</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar serie existente o crear nueva" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="new">Crear Nueva Serie</SelectItem>
                                    {series.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {seriesId === 'new' && (
                        <div className="p-4 border rounded-lg space-y-4">
                            <h3 className="font-semibold">Detalles de la Nueva Serie</h3>
                            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Título de la Serie</FormLabel><FormControl><Input placeholder="ej., Viaje a las Estrellas" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="genre" render={({ field }) => ( <FormItem><FormLabel>Género</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="year" render={({ field }) => ( <FormItem><FormLabel>Año de Estreno</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             </div>
                            <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>URL del Póster (Opcional)</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    )}
                    <Separator />
                    <h3 className="font-semibold pt-2">Detalles del Episodio</h3>
                     <FormField control={form.control} name="episodeTitle" render={({ field }) => (<FormItem><FormLabel>Título del Episodio</FormLabel><FormControl><Input placeholder="ej., El Encuentro" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="url" render={({ field }) => (<FormItem><FormLabel>Ruta o URL del Episodio</FormLabel><FormControl><Input placeholder="/files/series/mi-episodio.mp4" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </>
            )}

             {/* MUSIC FORM */}
            {contentType === 'music' && (
                <>
                    <FormField control={form.control} name="albumId" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Álbum</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Seleccionar álbum existente o crear nuevo" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    <SelectItem value="new">Crear Nuevo Álbum</SelectItem>
                                    {albums.map(a => <SelectItem key={a.id} value={a.id}>{a.title} - {a.artist}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {albumId === 'new' && (
                        <div className="p-4 border rounded-lg space-y-4">
                            <h3 className="font-semibold">Detalles del Nuevo Álbum</h3>
                            <FormField control={form.control} name="title" render={({ field }) => (<FormItem><FormLabel>Título del Álbum</FormLabel><FormControl><Input placeholder="ej., Noches de Verano" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="artist" render={({ field }) => (<FormItem><FormLabel>Artista</FormLabel><FormControl><Input placeholder="ej., Los Melódicos" {...field} /></FormControl><FormMessage /></FormItem>)} />
                            <FormField control={form.control} name="description" render={({ field }) => (<FormItem><FormLabel>Descripción</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                             <div className="grid grid-cols-2 gap-4">
                                <FormField control={form.control} name="genre" render={({ field }) => ( <FormItem><FormLabel>Género</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                <FormField control={form.control} name="year" render={({ field }) => ( <FormItem><FormLabel>Año de Lanzamiento</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
                             </div>
                            <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><FormLabel>URL de la Portada (Opcional)</FormLabel><FormControl><Input type="url" {...field} /></FormControl><FormMessage /></FormItem>)} />
                        </div>
                    )}
                    <Separator />
                    <h3 className="font-semibold pt-2">Detalles de la Canción</h3>
                     <FormField control={form.control} name="trackTitle" render={({ field }) => (<FormItem><FormLabel>Título de la Canción</FormLabel><FormControl><Input placeholder="ej., Brisa Marina" {...field} /></FormControl><FormMessage /></FormItem>)} />
                     <FormField control={form.control} name="url" render={({ field }) => (<FormItem><FormLabel>Ruta o URL de la Canción</FormLabel><FormControl><Input placeholder="/files/musica/mi-cancion.mp3" {...field} /></FormControl><FormMessage /></FormItem>)} />
                </>
            )}

            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto" disabled={!contentType}>Añadir a la Biblioteca</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
