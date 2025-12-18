import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const JAMENDO_CLIENT_ID = 'b6747d04';
const BASE_URL = 'https://api.jamendo.com/v3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, query, genre, limit = 20 } = await req.json();
    
    let params = new URLSearchParams({
      client_id: JAMENDO_CLIENT_ID,
      format: 'json',
      limit: limit.toString(),
      include: 'musicinfo',
      audioformat: 'mp32',
    });

    if (action === 'search' && query) {
      params.append('search', query);
    } else if (action === 'genre' && genre) {
      params.append('tags', genre);
      params.append('order', 'popularity_week');
    } else if (action === 'popular') {
      params.append('order', 'popularity_week');
    }

    console.log(`Fetching from Jamendo: ${BASE_URL}/tracks/?${params}`);
    
    const response = await fetch(`${BASE_URL}/tracks/?${params}`);
    const data = await response.json();

    console.log(`Jamendo response status: ${data.headers?.code}, results: ${data.headers?.results_count}`);

    if (data.headers?.code !== 0) {
      throw new Error(`Jamendo API error: ${data.headers?.status}`);
    }

    const songs = data.results.map((track: any) => ({
      id: track.id,
      title: track.name,
      artist: track.artist_name,
      album: track.album_name,
      duration: track.duration,
      albumArt: track.album_image || '/placeholder.svg',
      audioUrl: track.audio,
      liked: false,
    }));

    return new Response(JSON.stringify({ songs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in jamendo-proxy function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
