
"use client";

import { ContentCard } from '@/components/content-card';
import { getContent, Content } from '@/lib/data';
import { useState, useEffect } from 'react';

export default function MusicPage() {
  const [music, setMusic] = useState<Content[]>([]);

  useEffect(() => {
    setMusic(getContent({ type: 'music' }));
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Música</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
        {music.map((album) => (
          <ContentCard key={album.id} content={album} />
        ))}
      </div>
    </div>
  );
}
