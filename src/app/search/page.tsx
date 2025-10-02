
"use client";

import { useSearchParams } from 'next/navigation';
import { ContentCard } from '@/components/content-card';
import { getContent, Content } from '@/lib/data';
import { useEffect, useState, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (query) {
      getContent({ query }).then(data => {
        setResults(data);
        setLoading(false);
      });
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="space-y-2">
                <Skeleton className="aspect-[2/3] w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
            </div>
        ))}
      </div>
    );
  }


  return (
    <>
      {query ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight mb-8">
            Resultados para &quot;{query}&quot;
          </h1>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {results.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No se encontraron resultados.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Busca en tu biblioteca</h1>
            <p className="text-lg text-muted-foreground">Introduce un término en la barra de búsqueda para encontrar películas, series y música.</p>
        </div>
      )}
    </>
  );
}

export default function SearchPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <Suspense fallback={<div>Cargando...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}

