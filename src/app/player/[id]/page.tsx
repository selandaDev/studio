

"use client";
import { getContent } from "@/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  Play,
  Pause,
  Rewind,
  FastForward,
  Volume2,
  Maximize,
  Heart,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

    if(contentUrl.match(/\.(mp4|mkv|avi|webm|mov|flv|wmv)$/i)) {
      return (
        <div className="aspect-video bg-black">
          <video controls autoPlay className="w-full h-full" src={contentUrl}>
             Tu navegador no soporta la etiqueta de video.
          </video>
        </div>
      )
    }

    if(contentUrl.match(/\.(mp3|wav|ogg|aac|flac)$/i)) {
      return (
        <div className="bg-black flex flex-col items-center justify-center p-8 h-48">
          <audio controls autoPlay src={contentUrl} className="w-full">
            Tu navegador no soporta el elemento de audio.
          </audio>
        </div>
      )
    }

    // Fallback for unsupported URLs or types for now
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
  const content = getContent({ id: params.id })[0];

  if (!content) {
    notFound();
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
           <div className="mt-4 p-4 rounded-lg bg-card border">
            <p className="text-center text-muted-foreground">Controles de reproducción simulados</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Rewind />
                </Button>
                <Button variant="default" size="icon" className="h-14 w-14">
                  <Play className="h-8 w-8" />
                </Button>
                <Button variant="ghost" size="icon">
                  <FastForward />
                </Button>
              </div>
              <div className="flex-1 mx-4">
                <Slider defaultValue={[33]} max={100} step={1} />
              </div>
              <div className="flex items-center gap-2">
                <Volume2 />
                <Maximize />
              </div>
            </div>
          </div>
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

          <Button size="lg" className="w-full">
            <Heart className="mr-2 h-4 w-4" /> Añadir a Favoritos
          </Button>

          <p className="text-foreground/80 leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
}
