
"use client";

import { ContentCard } from '@/components/content-card';
import { getContent, Content } from '@/lib/data';
import { useState, useEffect } from 'react';

export default function MoviesPage() {
  const [movies, setMovies] = useState<Content[]>([]);

  useEffect(() => {
    setMovies(getContent({ type: 'movie' }));
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Películas</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {movies.map((movie) => (
          <ContentCard key={movie.id} content={movie} />
        ))}
      </div>
    </div>
  );
}
