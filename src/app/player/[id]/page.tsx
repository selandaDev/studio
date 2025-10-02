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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
              <div className="aspect-video bg-black flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Play className="h-24 w-24 text-primary" />
                  <p>This is a simulated player.</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <div className="mt-4 p-4 rounded-lg bg-card border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                  <Rewind />
                </Button>
                <Button variant="default" size="icon" className="h-14 w-14">
                  <Pause className="h-8 w-8" />
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
            <Heart className="mr-2 h-4 w-4" /> Add to Favorites
          </Button>

          <p className="text-foreground/80 leading-relaxed">
            {content.description}
          </p>
        </div>
      </div>
    </div>
  );
}
