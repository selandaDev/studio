
"use client";
import { deleteContent, getContent, Content, Episode, Track } from "@/lib/data";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import {
  Trash2,
  Heart,
  PlayCircle,
  Music4,
  ListVideo,
  ListMusic as ListMusicIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState }from "react";
import ReactPlayer from 'react-player/lazy'
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const Player = ({contentUrl}: {contentUrl?: string}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
      return (
          <div className="aspect-video bg-black flex items-center justify-center text-muted-foreground">
              Cargando reproductor...
          </div>
      )
    }
    
    if(!contentUrl) {
        return (
            <div className="aspect-video bg-black flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                    <PlayCircle className="h-24 w-24 text-primary mx-auto mb-4" />
                    <p>No hay una fuente de vídeo o audio para reproducir.</p>
                     <p className="text-sm text-muted-foreground">Selecciona un elemento de la lista.</p>
                </div>
            </div>
        )
    }

    const isAudio = !ReactPlayer.canPlay(contentUrl) || contentUrl.match(/\.(mp3|wav|ogg|aac|flac)$/i);
    const canPlay = ReactPlayer.canPlay(contentUrl) || contentUrl.startsWith('/files/');

    if (canPlay && !isAudio) {
      return (
        <div className="aspect-video bg-black relative">
          <ReactPlayer
              key={contentUrl}
              className="absolute top-0 left-0"
              url={contentUrl}
              playing={false}
              controls={true}
              width="100%"
              height="100%"
              config={{
                  file: {
                      attributes: {
                          controlsList: 'nodownload'
                      },
                      hlsOptions: {}, // Needed for HLS support
                  },
                  cast: {
                      options: {
                          // The default app id below is for the generic media receiver.
                          // You can get your own app id from the Google Cast SDK Developer Console
                          // https://cast.google.com/publish
                          appId: 'CC1AD845',
                      }
                  }
              }}
          />
        </div>
      )
    }
    
    if (isAudio) {
         return (
            <div className="bg-zinc-800/50 aspect-video flex flex-col items-center justify-center p-8 text-center text-foreground">
              <Music4 className="w-24 h-24 text-primary mb-4" />
              <audio key={contentUrl} controls src={contentUrl} className="w-full max-w-md mt-4">
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
  const [content, setContent] = useState<Content | null>(null);
  const [nowPlaying, setNowPlaying] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { toast } = useToast();


  useEffect(() => {
    getContent({ id: params.id }).then(result => {
        if(result.length > 0){
            const currentContent = result[0];
            setContent(currentContent);
            // Set initial playing item
            if (currentContent.type === 'movie' && currentContent.url) {
                setNowPlaying(currentContent.url);
            } else if (currentContent.type === 'series' && currentContent.episodes?.[0]?.url) {
                setNowPlaying(currentContent.episodes[0].url);
            } else if (currentContent.type === 'music' && currentContent.tracks?.[0]?.url) {
                setNowPlaying(currentContent.tracks[0].url);
            }
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
  
  const Playlist = () => {
    if (content.type === 'series' && content.episodes && content.episodes.length > 0) {
      return <PlaylistItemList icon={ListVideo} title="Episodios" items={content.episodes} />
    }
    if (content.type === 'music' && content.tracks && content.tracks.length > 0) {
      return <PlaylistItemList icon={ListMusicIcon} title="Canciones" items={content.tracks} />
    }
    return null;
  }

  const PlaylistItemList = ({icon: Icon, title, items}: {icon: React.ElementType, title: string, items: Episode[] | Track[]}) => (
    <Card>
        <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
                <Icon className="w-5 h-5"/>
                {title}
            </CardTitle>
        </CardHeader>
        <CardContent>
            <ScrollArea className="h-48">
                <div className="space-y-1">
                    {items.map((item, index) => (
                        <button 
                            key={index} 
                            onClick={() => setNowPlaying(item.url)}
                            className={cn(
                                "w-full text-left p-2 rounded-md transition-colors",
                                nowPlaying === item.url ? "bg-primary/20 text-primary" : "hover:bg-muted"
                            )}>
                            <p className="font-medium truncate">{index + 1}. {item.title}</p>
                        </button>
                    ))}
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <Player contentUrl={nowPlaying} />
            </CardContent>
          </Card>
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
           <p className="text-foreground/80 leading-relaxed">
            {content.description}
          </p>
        </div>
        <div className="lg:col-span-1 space-y-6">
            <div className="relative aspect-[2/3] w-full max-w-sm mx-auto">
                 <Image
                    src={content.imageUrl}
                    alt={content.title}
                    fill
                    className="object-cover rounded-lg shadow-lg"
                    sizes="(max-width: 768px) 80vw, 33vw"
                  />
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
            <Playlist />
        </div>
      </div>
    </div>
  );
}
