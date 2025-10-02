

"use client";
import { deleteContent, getContent } from "@/lib/data";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import {
  Trash2,
  Heart,
  PlayCircle,
  Music4,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState }from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";



const getYoutubeVideoId = (url: string) => {
  let videoId = null;
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname === 'youtu.be') {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname === 'www.youtube.com' || urlObj.hostname === 'youtube.com') {
      videoId = urlObj.searchParams.get('v');
    }
    return videoId;
  } catch(e) {
    return null;
  }
};

const Player = ({contentUrl}: {contentUrl?: string}) => {
    if(!contentUrl) {
        return (
            <div className="aspect-video bg-black flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <PlayCircle className="h-24 w-24 text-primary mx-auto mb-4" />
                    <p>No hay una fuente de vídeo o audio para reproducir.</p>
                     <p className="text-sm text-muted-foreground">Añade una URL al editar este contenido.</p>
                </div>
            </div>
        )
    }

    const youtubeVideoId = getYoutubeVideoId(contentUrl);

    if (youtubeVideoId) {
        return (
            <div className="aspect-video">
                <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="Reproductor de video de YouTube"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        )
    }
    
    const isVideo = contentUrl.match(/\.(mp4|mkv|avi|webm|mov|flv|wmv|mpeg)$/i) || contentUrl.startsWith('/files/');
    const isAudio = contentUrl.match(/\.(mp3|wav|ogg|aac|flac)$/i);

    if(isVideo && !isAudio) { 
      return (
        <div className="aspect-video bg-black">
          <video controls autoPlay muted className="w-full h-full" src={contentUrl}>
             Tu navegador no soporta la etiqueta de video.
          </video>
        </div>
      )
    }

    if(isAudio) {
      return (
        <div className="bg-zinc-800/50 aspect-video flex flex-col items-center justify-center p-8 text-center text-foreground">
          <Music4 className="w-24 h-24 text-primary mb-4" />
          <audio controls autoPlay src={contentUrl} className="w-full max-w-md mt-4">
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
      )
    }

    return (
        <div className="aspect-video bg-black flex items-center justify-center text-muted-foreground">
            <div className="text-center">
                <p>Tipo de medio o URL no soportado.</p>
                <p className="text-sm break-all">{contentUrl}</p>
            </div>
        </div>
    );
};

export default function PlayerPage({ params }: { params: { id: string } }) {
  const [content, setContent] = useState<Awaited<ReturnType<typeof getContent>>[0] | null>(null);
  const router = useRouter();
  const { toast } = useToast();


  useEffect(() => {
    getContent({ id: params.id }).then(result => {
        if(result.length > 0){
            setContent(result[0]);
        } else {
            notFound();
        }
    })
  }, [params.id]);


  const handleDelete = async () => {
    if (content) {
      const result = await deleteContent(content.id);
      if (result.success) {
        toast({
          title: "Contenido eliminado",
          description: `"${content.title}" ha sido eliminado de tu biblioteca.`,
        });
        router.push('/');
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo eliminar el contenido.",
        });
      }
    }
  };


  if (!content) {
    return <div className="container mx-auto p-4 md:p-8">Cargando...</div>;
  }
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Player contentUrl={content.url} />
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1 space-y-6">
            <div className="relative aspect-[2/3] w-full max-w-sm mx-auto">
                 <Image
                    src={content.imageUrl}
                    alt={content.title}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    sizes="(max-width: 768px) 80vw, 33vw"
                  />
            </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">{content.title}</h1>
            {content.artist && (
              <h2 className="text-2xl text-muted-foreground">{content.artist}</h2>
            )}
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>{content.year}</span>
              <Separator orientation="vertical" className="h-4" />
              <span>{content.genre}</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="capitalize">{content.type}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="lg" className="w-full">
              <Heart className="mr-2 h-4 w-4" /> Añadir a Favoritos
            </Button>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta acción no se puede deshacer. Esto eliminará permanentemente
                    "{content.title}" de tu biblioteca.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>


          <p className="text-foreground/80 leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
}
