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
  const movies = getContent({ type: 'movie' });
  const series = getContent({ type: 'series' });
  const music = getContent({ type: 'music' });

  // Get a mix of recently added content
  const recentlyAdded = [...movies.slice(0, 4), ...series.slice(0, 4), ...music.slice(0, 4)].sort(() => 0.5 - Math.random());
  
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
