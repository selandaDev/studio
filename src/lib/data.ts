
'use server';

import { PlaceHolderImages } from './placeholder-images';
import fs from 'fs/promises';
import path from 'path';

export type ContentType = 'movie' | 'series' | 'music';

export interface Episode {
  title: string;
  url: string;
}

export interface Track {
  title: string;
  url: string;
}

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
  url?: string; // For movies
  episodes?: Episode[]; // For series
  tracks?: Track[]; // For music
}

interface TvChannelSource {
    name: string;
    logo: string;
    website?: string;
    country: string;
    streams: string[] | string;
}


export interface TvChannel {
    id: string;
    name: string;
    logo: string;
    url: string | null;
    country: string;
}

const dbPath = path.join(process.cwd(), 'db.json');
const tvDbPath = path.join(process.cwd(), 'tv.json');

async function readDb(): Promise<{ content: Content[] }> {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { content: [] };
  }
}

async function readTvDb(): Promise<TvChannelSource[]> {
  try {
    const fileContent = await fs.readFile(tvDbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading tv.json:', error);
    return [];
  }
}


async function writeDb(data: { content: Content[] }): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
}


export async function getContent(filters: { type?: ContentType | ContentType[]; query?: string; id?: string }): Promise<Content[]> {
  const db = await readDb();
  let content = db.content;

  if (filters.id) {
    return content.filter(item => item.id === filters.id);
  }

  if (filters.type) {
    const types = Array.isArray(filters.type) ? filters.type : [filters.type];
    content = content.filter(item => types.includes(item.type));
  }

  if (filters.query) {
    const lowercasedQuery = filters.query.toLowerCase();
    content = content.filter(item => 
      item.title.toLowerCase().includes(lowercasedQuery) ||
      (item.artist && item.artist.toLowerCase().includes(lowercasedQuery)) ||
      item.genre.toLowerCase().includes(lowercasedQuery)
    );
  }
  
  // Ordenar alfabéticamente por título
  content.sort((a, b) => a.title.localeCompare(b.title));

  return content;
}

export async function getTvChannels(filters: { countryCode?: string } = {}): Promise<TvChannel[]> {
  const rawChannels = await readTvDb();
  let channels: TvChannel[] = rawChannels.map((channel, index) => {
    let streamUrl: string | null = null;
    if (Array.isArray(channel.streams) && channel.streams.length > 0) {
        streamUrl = channel.streams[0];
    } else if (typeof channel.streams === 'string') {
        streamUrl = channel.streams;
    }

    return {
        id: `tv-${index}-${channel.name.replace(/\s+/g, '')}`,
        name: channel.name,
        logo: channel.logo,
        country: channel.country,
        url: streamUrl
    };
  }).filter(c => c.url); // Filter out channels with no valid stream URL

  if (filters.countryCode) {
    channels = channels.filter(channel => channel.country === filters.countryCode);
  }

  channels.sort((a, b) => a.name.localeCompare(b.name));

  return channels;
}


type AddMoviePayload = {
    type: 'movie';
    title: string;
    description: string;
    genre: string;
    year: number;
    imageUrl: string;
    url?: string;
}

type AddSeriesEpisodePayload = {
    type: 'series';
    seriesId: string | 'new';
    title: string;
    description: string;
    genre: string;
    year: number;
    imageUrl: string;
    episodeTitle: string;
    url: string;
}

type AddMusicTrackPayload = {
    type: 'music';
    albumId: string | 'new';
    title: string;
    artist: string;
    description: string;
    genre: string;
    year: number;
    imageUrl: string;
    trackTitle: string;
    url: string;
}

export type AddContentPayload = AddMoviePayload | AddSeriesEpisodePayload | AddMusicTrackPayload;


export async function addContent(payload: AddContentPayload): Promise<Content> {
    const db = await readDb();
    const randomPlaceholder = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];

    if (payload.type === 'movie') {
        const newId = `mov-${Math.random().toString(36).substr(2, 9)}`;
        const content: Content = {
            id: newId,
            ...payload,
            imageHint: payload.imageUrl ? 'custom image' : randomPlaceholder.imageHint,
        };
        db.content.unshift(content);
        await writeDb(db);
        return content;
    }

    if (payload.type === 'series') {
        const { seriesId, episodeTitle, url, ...seriesData } = payload;
        const newEpisode: Episode = { title: episodeTitle, url: url };

        if (seriesId === 'new') {
            const newId = `ser-${Math.random().toString(36).substr(2, 9)}`;
            const content: Content = {
                id: newId,
                ...seriesData,
                episodes: [newEpisode],
                imageHint: payload.imageUrl ? 'custom image' : randomPlaceholder.imageHint,
            };
            db.content.unshift(content);
            await writeDb(db);
            return content;
        } else {
            const series = db.content.find(c => c.id === seriesId);
            if (!series) throw new Error('Series not found');
            if (!series.episodes) series.episodes = [];
            series.episodes.push(newEpisode);
            await writeDb(db);
            return series;
        }
    }

    if (payload.type === 'music') {
        const { albumId, trackTitle, url, ...albumData } = payload;
        const newTrack: Track = { title: trackTitle, url: url };

        if (albumId === 'new') {
            const newId = `mus-${Math.random().toString(36).substr(2, 9)}`;
            const content: Content = {
                id: newId,
                ...albumData,
                tracks: [newTrack],
                imageHint: payload.imageUrl ? 'custom image' : randomPlaceholder.imageHint,
            };
            db.content.unshift(content);
            await writeDb(db);
            return content;
        } else {
            const album = db.content.find(c => c.id === albumId);
            if (!album) throw new Error('Album not found');
            if (!album.tracks) album.tracks = [];
            album.tracks.push(newTrack);
            await writeDb(db);
            return album;
        }
    }
    
    // Should not be reached
    throw new Error("Invalid content type");
}


export async function deleteContent(id: string): Promise<{ success: boolean }> {
  const db = await readDb();
  const initialLength = db.content.length;
  db.content = db.content.filter(item => item.id !== id);
  
  if(db.content.length < initialLength) {
    await writeDb(db);
    return { success: true };
  }
  
  return { success: false };
}
