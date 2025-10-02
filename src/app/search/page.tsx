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
            Results for &quot;{query}&quot;
          </h1>
          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {results.map((item) => (
                <ContentCard key={item.id} content={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">No results found.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
            <h1 className="text-3xl font-bold tracking-tight mb-4">Search your library</h1>
            <p className="text-lg text-muted-foreground">Enter a term in the search bar above to find movies, series, and music.</p>
        </div>
      )}
    </div>
  );
}
