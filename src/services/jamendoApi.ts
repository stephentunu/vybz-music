import { Song } from '@/types/music';
import { supabase } from '@/integrations/supabase/client';

export const searchTracks = async (query: string, limit: number = 20): Promise<Song[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('jamendo-proxy', {
      body: { action: 'search', query, limit },
    });

    if (error) throw error;
    return data.songs;
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

export const getPopularTracks = async (limit: number = 20): Promise<Song[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('jamendo-proxy', {
      body: { action: 'popular', limit },
    });

    if (error) throw error;
    return data.songs;
  } catch (error) {
    console.error('Error fetching popular tracks:', error);
    throw error;
  }
};

export const getTracksByGenre = async (genre: string, limit: number = 20): Promise<Song[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('jamendo-proxy', {
      body: { action: 'genre', genre, limit },
    });

    if (error) throw error;
    return data.songs;
  } catch (error) {
    console.error('Error fetching tracks by genre:', error);
    throw error;
  }
};
