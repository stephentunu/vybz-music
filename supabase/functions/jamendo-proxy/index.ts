import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample music data with royalty-free tracks from various sources
const sampleTracks = [
  {
    id: '1',
    title: 'Acoustic Breeze',
    artist: 'Benjamin Tissot',
    album: 'Acoustic Collection',
    duration: 145,
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-acousticbreeze.mp3',
  },
  {
    id: '2',
    title: 'Sunny',
    artist: 'Benjamin Tissot',
    album: 'Happy Vibes',
    duration: 143,
    albumArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-sunny.mp3',
  },
  {
    id: '3',
    title: 'Creative Minds',
    artist: 'Benjamin Tissot',
    album: 'Corporate',
    duration: 170,
    albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-creativeminds.mp3',
  },
  {
    id: '4',
    title: 'Ukulele',
    artist: 'Benjamin Tissot',
    album: 'Acoustic Collection',
    duration: 146,
    albumArt: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-ukulele.mp3',
  },
  {
    id: '5',
    title: 'A New Beginning',
    artist: 'Benjamin Tissot',
    album: 'Cinematic',
    duration: 175,
    albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-anewbeginning.mp3',
  },
  {
    id: '6',
    title: 'Dreams',
    artist: 'Benjamin Tissot',
    album: 'Ambient',
    duration: 213,
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-dreams.mp3',
  },
  {
    id: '7',
    title: 'Energy',
    artist: 'Benjamin Tissot',
    album: 'Electronic',
    duration: 152,
    albumArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-energy.mp3',
  },
  {
    id: '8',
    title: 'Jazzy Frenchy',
    artist: 'Benjamin Tissot',
    album: 'Jazz Collection',
    duration: 128,
    albumArt: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-jazzyfrenchy.mp3',
  },
  {
    id: '9',
    title: 'Little Idea',
    artist: 'Benjamin Tissot',
    album: 'Acoustic Collection',
    duration: 109,
    albumArt: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-littleidea.mp3',
  },
  {
    id: '10',
    title: 'Memories',
    artist: 'Benjamin Tissot',
    album: 'Piano Collection',
    duration: 277,
    albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-memories.mp3',
  },
  {
    id: '11',
    title: 'Happy Rock',
    artist: 'Benjamin Tissot',
    album: 'Rock Collection',
    duration: 105,
    albumArt: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-happyrock.mp3',
  },
  {
    id: '12',
    title: 'Funky Suspense',
    artist: 'Benjamin Tissot',
    album: 'Funk Collection',
    duration: 153,
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.bensound.com/bensound-music/bensound-funkysuspense.mp3',
  },
];

// Genre-based filtering keywords
const genreKeywords: Record<string, string[]> = {
  'rock': ['rock', 'energy', 'happy rock'],
  'pop': ['sunny', 'ukulele', 'little idea', 'happy'],
  'electronic': ['energy', 'dreams', 'funky'],
  'jazz': ['jazzy', 'frenchy'],
  'classical': ['memories', 'dreams', 'beginning'],
  'hip-hop': ['funky', 'suspense', 'energy'],
  'ambient': ['dreams', 'memories', 'beginning'],
  'indie': ['acoustic', 'ukulele', 'creative'],
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, query, genre, limit = 20 } = await req.json();
    
    let songs = [...sampleTracks];

    if (action === 'search' && query) {
      const searchTerm = query.toLowerCase();
      songs = sampleTracks.filter(track => 
        track.title.toLowerCase().includes(searchTerm) ||
        track.artist.toLowerCase().includes(searchTerm) ||
        track.album.toLowerCase().includes(searchTerm)
      );
    } else if (action === 'genre' && genre) {
      const keywords = genreKeywords[genre.toLowerCase()] || [];
      if (keywords.length > 0) {
        songs = sampleTracks.filter(track => 
          keywords.some(keyword => 
            track.title.toLowerCase().includes(keyword) ||
            track.album.toLowerCase().includes(keyword)
          )
        );
      }
      // If no genre match found, return shuffled tracks
      if (songs.length === 0) {
        songs = [...sampleTracks].sort(() => Math.random() - 0.5);
      }
    } else if (action === 'popular') {
      // Shuffle for variety
      songs = [...sampleTracks].sort(() => Math.random() - 0.5);
    }

    // Limit results
    songs = songs.slice(0, limit).map(song => ({ ...song, liked: false }));

    console.log(`Action: ${action}, Query: ${query}, Genre: ${genre}, Results: ${songs.length}`);

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
