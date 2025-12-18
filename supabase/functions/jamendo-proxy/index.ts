import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const JAMENDO_API_BASE = 'https://api.jamendo.com/v3.0';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const clientId = Deno.env.get('JAMENDO_CLIENT_ID');
    
    if (!clientId) {
      console.error('JAMENDO_CLIENT_ID is not configured');
      throw new Error('Jamendo API not configured');
    }

    const { action, query, genre, limit = 20 } = await req.json();
    
    let apiUrl = '';
    
    if (action === 'search' && query) {
      apiUrl = `${JAMENDO_API_BASE}/tracks/?client_id=${clientId}&format=json&limit=${limit}&namesearch=${encodeURIComponent(query)}&include=musicinfo&audioformat=mp32`;
    } else if (action === 'genre' && genre) {
      // Map genres to Jamendo tags
      const genreMapping: Record<string, string> = {
        'rock': 'rock',
        'pop': 'pop',
        'electronic': 'electronic+dance',
        'jazz': 'jazz',
        'classical': 'classical',
        'hip-hop': 'hiphop',
        'hiphop': 'hiphop',
        'ambient': 'ambient+chillout',
        'indie': 'indie',
        'afro': 'african+world+tribal',
        'bongo flava': 'african+world+dance',
        'african': 'african+world',
        'reggae': 'reggae+dub',
        'country': 'country',
        'folk': 'folk+acoustic',
        'metal': 'metal+rock',
        'blues': 'blues',
        'r&b': 'rnb+soul',
        'latin': 'latin+salsa',
        'world': 'world+ethnic',
        'gospel': 'gospel+spiritual+christian',
        'rhumba': 'rumba+latin+african',
        'swahili': 'african+world',
      };
      
      const jamendoGenre = genreMapping[genre.toLowerCase()] || genre.toLowerCase();
      apiUrl = `${JAMENDO_API_BASE}/tracks/?client_id=${clientId}&format=json&limit=${limit}&tags=${encodeURIComponent(jamendoGenre)}&include=musicinfo&audioformat=mp32&boost=popularity_total&groupby=artist_id`;
    } else if (action === 'popular') {
      apiUrl = `${JAMENDO_API_BASE}/tracks/?client_id=${clientId}&format=json&limit=${limit}&order=popularity_total&include=musicinfo&audioformat=mp32`;
    } else {
      // Default to popular tracks
      apiUrl = `${JAMENDO_API_BASE}/tracks/?client_id=${clientId}&format=json&limit=${limit}&order=popularity_total&include=musicinfo&audioformat=mp32`;
    }

    console.log(`Jamendo API request: ${action}, query: ${query}, genre: ${genre}`);
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Jamendo API error:', response.status, errorText);
      throw new Error(`Jamendo API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log('No results from Jamendo API');
      return new Response(JSON.stringify({ songs: [] }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Transform Jamendo response to our song format
    const songs = data.results.map((track: any) => ({
      id: track.id.toString(),
      title: track.name,
      artist: track.artist_name,
      album: track.album_name || 'Single',
      duration: track.duration,
      albumArt: track.album_image || track.image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
      audioUrl: track.audio, // Jamendo provides direct streaming URL
      liked: false,
      genre: track.musicinfo?.tags?.genres?.[0] || '',
    }));

    console.log(`Jamendo returned ${songs.length} tracks`);

    return new Response(JSON.stringify({ songs }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in jamendo-proxy function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage, songs: [] }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
