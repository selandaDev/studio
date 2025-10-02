
"use client";

import { ContentCard } from '@/components/content-card';
import { getContent, Content } from '@/lib/data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';

function ContentCarousel({ title, items }: { title: string; items: Content[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <ContentCard content={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </section>
  );
}


export default function HomePage() {
  const [movies, setMovies] = useState<Content[]>([]);
  const [series, setSeries] = useState<Content[]>([]);
  const [music, setMusic] = useState<Content[]>([]);
  const [recentlyAdded, setRecentlyAdded] = useState<Content[]>([]);

  useEffect(() => {
    const allMovies = getContent({ type: 'movie' });
    const allSeries = getContent({ type: 'series' });
    const allMusic = getContent({ type: 'music' });
    
    setMovies(allMovies);
    setSeries(allSeries);
    setMusic(allMusic);

    const recent = [...allMovies.slice(-2), ...allSeries.slice(-2), ...allMusic.slice(-2)].sort((a,b) => (b.year > a.year) ? 1: -1);
    setRecentlyAdded(recent);
  }, []);
  
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 space-y-12">
      <ContentCarousel title="Añadido Recientemente" items={recentlyAdded} />
      <Separator />
      <ContentCarousel title="Películas Destacadas" items={movies} />
      <Separator />
      <ContentCarousel title="Series Populares" items={series} />
      <Separator />
      <ContentCarousel title="Nuevos Álbumes" items={music} />
    </div>
  );
}
