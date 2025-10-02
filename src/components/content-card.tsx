import Image from 'next/image';
import Link from 'next/link';
import type { Content } from '@/lib/data';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { PlayCircle } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function ContentCard({ content }: { content: Content }) {
  const placeholder = PlaceHolderImages.find(p => p.imageUrl === content.imageUrl);

  return (
    <Link href={`/player/${content.id}`} className="group block">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50">
        <CardContent className="p-0">
          <div className="aspect-[2/3] relative">
            <Image
              src={content.imageUrl}
              alt={content.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={placeholder?.imageHint || 'media poster'}
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
            />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <PlayCircle className="text-white h-16 w-16" />
            </div>
          </div>
        </CardContent>
        <CardHeader className="p-3">
          <p className="font-semibold truncate text-foreground">{content.title}</p>
          {content.artist && (
             <p className="text-sm text-muted-foreground truncate">{content.artist}</p>
          )}
          <p className="text-xs text-muted-foreground">{content.genre} &bull; {content.year}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}
