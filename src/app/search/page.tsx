"use client";

import { useSearchParams } from 'next/navigation';
import { ContentCard } from '@/components/content-card';
import { getContent } from '@/lib/data';
import { useEffect, useState } from 'react';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState(() => query ? getContent({ query }) : []);

  useEffect(() => {
    if (query) {
        setResults(getContent({ query }));
    } else {
        setResults([]);
    }
  }, [query]);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
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
    </div>
  );
}
