
'use server';

import { PlaceHolderImages } from './placeholder-images';
import fs from 'fs/promises';
import path from 'path';

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

const dbPath = path.join(process.cwd(), 'db.json');

async function readDb(): Promise<{ content: Content[] }> {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading db.json:', error);
    return { content: [] };
  }
}

async function writeDb(data: { content: Content[] }): Promise<void> {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to db.json:', error);
  }
}


export async function getContent(filters: { type?: ContentType; query?: string; id?: string }): Promise<Content[]> {
  const db = await readDb();
  let content = db.content;

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


export async function addContent(newContentData: Omit<Content, 'id' | 'imageHint'>) {
    const db = await readDb();
    const newId = `${newContentData.type}-${Math.random().toString(36).substr(2, 9)}`;
    const randomPlaceholder = PlaceHolderImages[Math.floor(Math.random() * PlaceHolderImages.length)];
    
    const content: Content = {
        ...newContentData,
        id: newId,
        imageUrl: newContentData.imageUrl || randomPlaceholder.imageUrl,
        imageHint: newContentData.imageUrl ? 'custom image' : randomPlaceholder.imageHint,
    };

    db.content.unshift(content);
    await writeDb(db);
    return content;
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
