import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample music data with royalty-free tracks from various sources
const sampleTracks = [
  // Acoustic/Pop
  {
    id: '1',
    title: 'Acoustic Breeze',
    artist: 'Benjamin Tissot',
    album: 'Acoustic Collection',
    duration: 145,
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: '2',
    title: 'Sunny Days',
    artist: 'Benjamin Tissot',
    album: 'Happy Vibes',
    duration: 143,
    albumArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  // Afro Music
  {
    id: '3',
    title: 'African Sunrise',
    artist: 'Afro Beats Collective',
    album: 'Afro Rhythms',
    duration: 210,
    albumArt: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  },
  {
    id: '4',
    title: 'Lagos Nights',
    artist: 'Afro Beats Collective',
    album: 'Afro Rhythms',
    duration: 195,
    albumArt: 'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  },
  {
    id: '5',
    title: 'Nairobi Groove',
    artist: 'East African Vibes',
    album: 'Safari Sounds',
    duration: 185,
    albumArt: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  },
  {
    id: '6',
    title: 'Afrobeat Dance',
    artist: 'African Soul',
    album: 'Dance Floor Africa',
    duration: 220,
    albumArt: 'https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  },
  // Bongo Flava
  {
    id: '7',
    title: 'Dar Es Salaam Love',
    artist: 'Bongo Stars',
    album: 'Bongo Flava Hits',
    duration: 198,
    albumArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  },
  {
    id: '8',
    title: 'Tanzania Nights',
    artist: 'Bongo Stars',
    album: 'Bongo Flava Hits',
    duration: 205,
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  },
  {
    id: '9',
    title: 'Swahili Rhythm',
    artist: 'East Coast Bongo',
    album: 'Coastal Vibes',
    duration: 178,
    albumArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  },
  {
    id: '10',
    title: 'Bongo Love Song',
    artist: 'Tanzanian Dreamers',
    album: 'Love & Bongo',
    duration: 215,
    albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  },
  // Electronic/Dance
  {
    id: '11',
    title: 'Electronic Dreams',
    artist: 'Synth Masters',
    album: 'Electronic',
    duration: 180,
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  },
  {
    id: '12',
    title: 'Night Club Energy',
    artist: 'DJ Beats',
    album: 'Club Hits',
    duration: 195,
    albumArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  },
  // Rock
  {
    id: '13',
    title: 'Rock Anthem',
    artist: 'The Rockers',
    album: 'Rock Collection',
    duration: 165,
    albumArt: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  },
  {
    id: '14',
    title: 'Guitar Solo',
    artist: 'Rock Legends',
    album: 'Epic Rock',
    duration: 188,
    albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  },
  // Jazz
  {
    id: '15',
    title: 'Jazz Cafe',
    artist: 'Smooth Jazz Trio',
    album: 'Jazz Collection',
    duration: 245,
    albumArt: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  },
  {
    id: '16',
    title: 'Late Night Jazz',
    artist: 'Jazz Masters',
    album: 'Midnight Sessions',
    duration: 278,
    albumArt: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
  },
];

// Genre-based filtering keywords
const genreKeywords: Record<string, string[]> = {
  'rock': ['rock', 'guitar', 'anthem'],
  'pop': ['sunny', 'acoustic', 'love'],
  'electronic': ['electronic', 'club', 'energy', 'dance'],
  'jazz': ['jazz', 'smooth', 'midnight'],
  'classical': ['classical', 'piano'],
  'hip-hop': ['hip-hop', 'beats', 'rhythm'],
  'ambient': ['dreams', 'ambient'],
  'indie': ['acoustic', 'indie'],
  'afro': ['afro', 'african', 'lagos', 'nairobi', 'safari', 'dance floor africa'],
  'bongo flava': ['bongo', 'tanzania', 'dar es salaam', 'swahili', 'coastal'],
  'bongo': ['bongo', 'tanzania', 'dar es salaam', 'swahili', 'coastal'],
  'african': ['afro', 'african', 'lagos', 'nairobi', 'bongo', 'tanzania'],
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
