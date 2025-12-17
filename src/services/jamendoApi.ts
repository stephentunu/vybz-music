import { Song } from '@/types/music';

const JAMENDO_CLIENT_ID = 'b6747d04'; // Public demo client ID
const BASE_URL = 'https://api.jamendo.com/v3.0';

interface JamendoTrack {
  id: string;
  name: string;
  artist_name: string;
  album_name: string;
  album_image: string;
  duration: number;
  audio: string;
  audiodownload: string;
}

interface JamendoResponse {
  headers: {
    status: string;
    code: number;
    results_count: number;
  };
  results: JamendoTrack[];
}

export const searchTracks = async (query: string, limit: number = 20): Promise<Song[]> => {
  try {
    const params = new URLSearchParams({
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit: limit.toString(),
      search: query,
      include: 'musicinfo',
      audioformat: 'mp32',
    });

    const response = await fetch(`${BASE_URL}/tracks/?${params}`);
    const data: JamendoResponse = await response.json();

    if (data.headers.code !== 0) {
      throw new Error(`Jamendo API error: ${data.headers.status}`);
    }

    return data.results.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      duration: track.duration,
      albumArt: track.album_image || '/placeholder.svg',
      audioUrl: track.audio,
      liked: false,
    }));
  } catch (error) {
    console.error('Error searching tracks:', error);
    throw error;
  }
};

export const getPopularTracks = async (limit: number = 20): Promise<Song[]> => {
  try {
    const params = new URLSearchParams({
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit: limit.toString(),
      order: 'popularity_week',
      include: 'musicinfo',
      audioformat: 'mp32',
    });

    const response = await fetch(`${BASE_URL}/tracks/?${params}`);
    const data: JamendoResponse = await response.json();

    if (data.headers.code !== 0) {
      throw new Error(`Jamendo API error: ${data.headers.status}`);
    }

    return data.results.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      duration: track.duration,
      albumArt: track.album_image || '/placeholder.svg',
      audioUrl: track.audio,
      liked: false,
    }));
  } catch (error) {
    console.error('Error fetching popular tracks:', error);
    throw error;
  }
};

export const getTracksByGenre = async (genre: string, limit: number = 20): Promise<Song[]> => {
  try {
    const params = new URLSearchParams({
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit: limit.toString(),
      tags: genre,
      order: 'popularity_week',
      include: 'musicinfo',
      audioformat: 'mp32',
    });

    const response = await fetch(`${BASE_URL}/tracks/?${params}`);
    const data: JamendoResponse = await response.json();

    if (data.headers.code !== 0) {
      throw new Error(`Jamendo API error: ${data.headers.status}`);
    }

    return data.results.map(track => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      duration: track.duration,
      albumArt: track.album_image || '/placeholder.svg',
      audioUrl: track.audio,
      liked: false,
    }));
  } catch (error) {
    console.error('Error fetching tracks by genre:', error);
    throw error;
  }
};
