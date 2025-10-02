
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function AddContentPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Añadir Nuevo Contenido</CardTitle>
          <CardDescription>Completa el formulario para añadir una nueva película, serie o álbum de música a tu biblioteca.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className="grid gap-3">
                <Label htmlFor="type">Tipo de Contenido</Label>
                <Select>
                    <SelectTrigger id="type" aria-label="Seleccionar tipo de contenido">
                        <SelectValue placeholder="Seleccionar tipo de contenido" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="movie">Película</SelectItem>
                        <SelectItem value="series">Serie de TV</SelectItem>
                        <SelectItem value="music">Álbum de Música</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="title">Título</Label>
                <Input id="title" type="text" placeholder="ej., La Gran Aventura" />
            </div>
            <div className="grid gap-3">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Un breve resumen del contenido." />
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-3">
                    <Label htmlFor="genre">Género</Label>
                    <Input id="genre" type="text" placeholder="ej., Ciencia Ficción" />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="year">Año de Lanzamiento</Label>
                    <Input id="year" type="number" placeholder="ej., 2024" />
                </div>
            </div>
            <div className="grid gap-3">
                <Label htmlFor="path">Ruta del Archivo o Carpeta</Label>
                <Input id="path" type="text" placeholder="/ruta/a/tu/archivo/multimedia" />
                <p className="text-sm text-muted-foreground">
                    Esto es una simulación. En una aplicación real, buscarías un archivo.
                </p>
            </div>
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
            <div className="grid gap-3">
                <Label htmlFor="url">URL del Contenido (Opcional)</Label>
                <Input id="url" type="url" placeholder="https://www.youtube.com/watch?v=..." />
                 <p className="text-sm text-muted-foreground">
                    ej., YouTube, Vimeo, o un enlace directo a un archivo (.mp4, .mp3).
                </p>
            </div>
        </CardContent>
        <CardFooter>
            <Button className="ml-auto">Añadir a la Biblioteca</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
