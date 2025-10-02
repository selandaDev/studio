
import { PlaceHolderImages } from './placeholder-images';

export type ContentType = 'movie' | 'series' | 'music';

export interface Content {
  id: string;
  title: string;
  type: ContentType;
  genre: string;
  year: number;
  description: string;
  imageUrl: string;
  imageHint: string;
  artist?: string;
  url?: string;
}

const allContent: Content[] = [
  { id: 'mov1', title: 'Cyber City', type: 'movie', genre: 'Action', year: 2023, description: 'In a neon-soaked future, a lone operative must uncover a corporate conspiracy.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-1')?.imageUrl!, imageHint: 'action movie' },
  { id: 'mov2', title: 'Galaxy\'s Edge', type: 'movie', genre: 'Sci-Fi', year: 2022, description: 'The crew of the starship Wanderer discovers a secret that could change the universe.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-2')?.imageUrl!, imageHint: 'sci-fi space', url: 'https://youtu.be/fb4wdTpkhBs?si=8Nc1HzpaLD5ycY5A' },
  { id: 'mov3', title: 'The Last Clue', type: 'movie', genre: 'Mystery', year: 2021, description: 'A seasoned detective on the verge of retirement takes on one final, baffling case.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-3')?.imageUrl!, imageHint: 'mystery thriller' },
  { id: 'mov4', title: 'Summer Love', type: 'movie', genre: 'Romance', year: 2024, description: 'Two people from different worlds find unexpected love during a summer vacation.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-4')?.imageUrl!, imageHint: 'romance comedy' },
  { id: 'mov5', title: 'Temple of the Sun', type: 'movie', genre: 'Adventure', year: 2020, description: 'An archaeologist races against a rival to find a legendary lost temple.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-5')?.imageUrl!, imageHint: 'adventure jungle' },
  { id: 'mov6', title: 'The Jester', type: 'movie', genre: 'Horror', year: 2019, description: 'A cursed puppet terrorizes a small town.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-6')?.imageUrl!, imageHint: 'horror movie' },
  
  { id: 'ser1', title: 'The Apartment', type: 'series', genre: 'Comedy', year: 2018, description: 'A group of quirky friends navigate life and love in the big city.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-1')?.imageUrl!, imageHint: 'comedy series' },
  { id: 'ser2', title: 'Throne of Dragons', type: 'series', genre: 'Fantasy', year: 2015, description: 'Noble houses vie for control of a mythical kingdom.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-2')?.imageUrl!, imageHint: 'fantasy series' },
  { id: 'ser3', title: 'City General', type: 'series', genre: 'Drama', year: 2022, description: 'The intense lives of doctors and nurses in a busy urban hospital.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-3')?.imageUrl!, imageHint: 'medical drama' },
  { id: 'ser4', title: 'Dust Devil', type: 'series', genre: 'Western', year: 2021, description: 'A mysterious stranger brings justice to a lawless frontier town.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-4')?.imageUrl!, imageHint: 'western series' },
  { id: 'ser5', title: 'Android Dreams', type: 'series', genre: 'Sci-Fi', year: 2023, description: 'In the future, androids are fighting for their rights.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-5')?.imageUrl!, imageHint: 'sci-fi series' },
  { id: 'ser6', title: 'Wacky World', type: 'series', genre: 'Animation', year: 2019, description: 'The hilarious adventures of a talking animal and his human friend.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-6')?.imageUrl!, imageHint: 'cartoon animation' },
  
  { id: 'mus1', title: 'Digital Odyssey', artist: 'DJ Electron', type: 'music', genre: 'Electronic', year: 2023, description: 'An album of pulsing beats and ethereal soundscapes.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-1')?.imageUrl!, imageHint: 'electronic music' },
  { id: 'mus2', title: 'Fireside Songs', artist: 'The Wanderers', type: 'music', genre: 'Folk', year: 2021, description: 'Heartfelt acoustic melodies perfect for a quiet evening.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-2')?.imageUrl!, imageHint: 'acoustic folk' },
  { id: 'mus3', title: 'Urban Flow', artist: 'MC Flow', type: 'music', genre: 'Hip-Hop', year: 2024, description: 'Lyrical genius over classic boom-bap beats.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-3')?.imageUrl!, imageHint: 'hip-hop music' },
  { id: 'mus4', title: 'Stadium Echoes', artist: 'Static Bloom', type: 'music', genre: 'Rock', year: 2022, description: 'Anthemic rock songs built for the big stage.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-4')?.imageUrl!, imageHint: 'rock concert' },
  { id: 'mus5', title: 'The Four Seasons Reimagined', artist: 'The Modern Virtuosos', type: 'music', genre: 'Classical', year: 2020, description: 'A modern take on classical masterpieces.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-5')?.imageUrl!, imageHint: 'classical orchestra' },
  { id: 'mus6', title: 'Midnight Blue', artist: 'The Blue Notes', type: 'music', genre: 'Jazz', year: 2019, description: 'Smooth jazz for late nights and rainy days.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-6')?.imageUrl!, imageHint: 'jazz music' },
];

export function getContent(filters: { type?: ContentType; query?: string; id?: string }): Content[] {
  let content = allContent;

  if (filters.id) {
    return content.filter(item => item.id === filters.id);
  }

  if (filters.type) {
    content = content.filter(item => item.type === filters.type);
  }

  if (filters.query) {
    const lowercasedQuery = filters.query.toLowerCase();
    content = content.filter(item => 
      item.title.toLowerCase().includes(lowercasedQuery) ||
      (item.artist && item.artist.toLowerCase().includes(lowercasedQuery)) ||
      item.genre.toLowerCase().includes(lowercasedQuery)
    );
  }

  return content;
}
