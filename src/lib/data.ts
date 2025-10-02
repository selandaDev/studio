
'use client';

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

let allContent: Content[] = [
  { id: 'mov1', title: 'Ciudad Cibernética', type: 'movie', genre: 'Acción', year: 2023, description: 'En un futuro bañado en neón, un operativo solitario debe descubrir una conspiración corporativa.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-1')?.imageUrl!, imageHint: 'action movie' },
  { id: 'mov2', title: 'El Borde de la Galaxia', type: 'movie', genre: 'Ciencia Ficción', year: 2022, description: 'La tripulación de la nave estelar Errante descubre un secreto que podría cambiar el universo.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-2')?.imageUrl!, imageHint: 'sci-fi space', url: 'https://youtu.be/fb4wdTpkhBs?si=8Nc1HzpaLD5ycY5A' },
  { id: 'mov3', title: 'La Última Pista', type: 'movie', genre: 'Misterio', year: 2021, description: 'Un detective experimentado a punto de jubilarse se enfrenta a un último y desconcertante caso.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-3')?.imageUrl!, imageHint: 'mystery thriller' },
  { id: 'mov4', title: 'Amor de Verano', type: 'movie', genre: 'Romance', year: 2024, description: 'Dos personas de mundos diferentes encuentran un amor inesperado durante unas vacaciones de verano.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-4')?.imageUrl!, imageHint: 'romance comedy' },
  { id: 'mov5', title: 'Templo del Sol', type: 'movie', genre: 'Aventura', year: 2020, description: 'Un arqueólogo corre contra un rival para encontrar un legendario templo perdido.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-5')?.imageUrl!, imageHint: 'adventure jungle' },
  { id: 'mov6', title: 'El Bufón', type: 'movie', genre: 'Terror', year: 2019, description: 'Una marioneta maldita aterroriza a un pequeño pueblo.', imageUrl: PlaceHolderImages.find(i => i.id === 'movie-6')?.imageUrl!, imageHint: 'horror movie' },
  
  { id: 'ser1', title: 'El Apartamento', type: 'series', genre: 'Comedia', year: 2018, description: 'Un grupo de amigos extravagantes navegan por la vida y el amor en la gran ciudad.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-1')?.imageUrl!, imageHint: 'comedy series' },
  { id: 'ser2', title: 'Trono de Dragones', type: 'series', genre: 'Fantasía', year: 2015, description: 'Casas nobles compiten por el control de un reino mítico.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-2')?.imageUrl!, imageHint: 'fantasy series' },
  { id: 'ser3', title: 'Hospital General de la Ciudad', type: 'series', genre: 'Drama', year: 2022, description: 'Las intensas vidas de los médicos y enfermeras en un ajetreado hospital urbano.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-3')?.imageUrl!, imageHint: 'medical drama' },
  { id: 'ser4', title: 'Demonio del Polvo', type: 'series', genre: 'Western', year: 2021, description: 'Un misterioso extraño lleva la justicia a un pueblo fronterizo sin ley.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-4')?.imageUrl!, imageHint: 'western series' },
  { id: 'ser5', title: 'Sueños de Androide', type: 'series', genre: 'Ciencia Ficción', year: 2023, description: 'En el futuro, los androides luchan por sus derechos.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-5')?.imageUrl!, imageHint: 'sci-fi series' },
  { id: 'ser6', title: 'Mundo Loco', type: 'series', genre: 'Animación', year: 2019, description: 'Las divertidas aventuras de un animal parlante y su amigo humano.', imageUrl: PlaceHolderImages.find(i => i.id === 'series-6')?.imageUrl!, imageHint: 'cartoon animation' },
  
  { id: 'mus1', title: 'Odisea Digital', artist: 'DJ Electrón', type: 'music', genre: 'Electrónica', year: 2023, description: 'Un álbum de ritmos pulsantes y paisajes sonoros etéreos.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-1')?.imageUrl!, imageHint: 'electronic music' },
  { id: 'mus2', title: 'Canciones junto al Fuego', artist: 'Los Errantes', type: 'music', genre: 'Folk', year: 2021, description: 'Melodías acústicas sinceras, perfectas para una velada tranquila.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-2')?.imageUrl!, imageHint: 'acoustic folk' },
  { id: 'mus3', title: 'Flujo Urbano', artist: 'MC Flow', type: 'music', genre: 'Hip-Hop', year: 2024, description: 'Genialidad lírica sobre ritmos clásicos de boom-bap.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-3')?.imageUrl!, imageHint: 'hip-hop music' },
  { id: 'mus4', title: 'Ecos de Estadio', artist: 'Floración Estática', type: 'music', genre: 'Rock', year: 2022, description: 'Canciones de rock de himno creadas para el gran escenario.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-4')?.imageUrl!, imageHint: 'rock concert' },
  { id: 'mus5', title: 'Las Cuatro Estaciones Reimaginadas', artist: 'Los Virtuosos Modernos', type: 'music', genre: 'Clásica', year: 2020, description: 'Una versión moderna de las obras maestras clásicas.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-5')?.imageUrl!, imageHint: 'classical orchestra' },
  { id: 'mus6', title: 'Azul Medianoche', artist: 'The Blue Notes', type: 'music', genre: 'Jazz', year: 2019, description: 'Jazz suave para noches tardías y días lluviosos.', imageUrl: PlaceHolderImages.find(i => i.id === 'music-6')?.imageUrl!, imageHint: 'jazz music' },
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


export function addContent(newContent: Omit<Content, 'id' | 'imageUrl' | 'imageHint'>) {
    const newId = `${newContent.type}-${Math.random().toString(36).substr(2, 9)}`;
    const placeholder = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
    const content: Content = {
        ...newContent,
        id: newId,
        imageUrl: placeholder.imageUrl,
        imageHint: placeholder.imageHint,
    };
    allContent.unshift(content);
    return content;
}
