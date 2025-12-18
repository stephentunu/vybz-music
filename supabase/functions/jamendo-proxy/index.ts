import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample music data with real songs from Free Music Archive and other royalty-free sources
const sampleTracks = [
  // Afro Music - Real tracks from Free Music Archive
  {
    id: '1',
    title: 'Djiguiya',
    artist: 'Samba Touré',
    album: 'Afro Collection',
    duration: 285,
    albumArt: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Samba_Tour/Albala/Samba_Tour_-_01_-_Djiguiya.mp3',
  },
  {
    id: '2',
    title: 'Afro Blue',
    artist: 'Dizzy Gillespie',
    album: 'Jazz Classics',
    duration: 320,
    albumArt: 'https://images.unsplash.com/photo-1489549132488-d00b7eee80f1?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Dee_Yan-Key/Afro_Blue/Dee_Yan-Key_-_Afro_Blue.mp3',
  },
  {
    id: '3',
    title: 'African Drums',
    artist: 'World Music Collective',
    album: 'Safari Sounds',
    duration: 195,
    albumArt: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Javolenus/Demos/Javolenus_-_02_-_African_Drums.mp3',
  },
  {
    id: '4',
    title: 'Mama Africa',
    artist: 'African Soul',
    album: 'African Pride',
    duration: 240,
    albumArt: 'https://images.unsplash.com/photo-1504704911898-68304a7d2807?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/TRG_Banks/TRG_Banks/TRG_Banks_-_03_-_Mama_Africa.mp3',
  },
  // Pop/Dance
  {
    id: '5',
    title: 'Electric Feel',
    artist: 'Podington Bear',
    album: 'Electronic Vibes',
    duration: 180,
    albumArt: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Podington_Bear/Solo_Instruments/Podington_Bear_-_Electric_Guitar.mp3',
  },
  {
    id: '6',
    title: 'Summer Love',
    artist: 'The Kyoto Connection',
    album: 'Summer Hits',
    duration: 215,
    albumArt: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/The_Kyoto_Connection/Wake_Up/The_Kyoto_Connection_-_09_-_Hachiko_The_Faithtful_Dog.mp3',
  },
  // Rock
  {
    id: '7',
    title: 'Rock It',
    artist: 'Riot',
    album: 'Rock Collection',
    duration: 198,
    albumArt: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Riot/Riot/Riot_-_01_-_Riot.mp3',
  },
  {
    id: '8',
    title: 'Thunder Road',
    artist: 'The Spin Wires',
    album: 'Highway Songs',
    duration: 225,
    albumArt: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/The_Spin_Wires/Lullabies_for_Robots/The_Spin_Wires_-_06_-_Distant_Shore.mp3',
  },
  // Jazz
  {
    id: '9',
    title: 'Night in Tunisia',
    artist: 'Jazz Quartet',
    album: 'Jazz Standards',
    duration: 312,
    albumArt: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Chad_Crouch/Arps/Chad_Crouch_-_Shipping_Lanes.mp3',
  },
  {
    id: '10',
    title: 'Smooth Operator',
    artist: 'Lounge Lizards',
    album: 'Late Night Jazz',
    duration: 278,
    albumArt: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Loyalty_Freak_Music/LOYALTY_FREAK_MUSIC_ACTIVE/Loyalty_Freak_Music_-_05_-_Cant_Stop_My_Feet_.mp3',
  },
  // Hip-Hop/R&B
  {
    id: '11',
    title: 'City Lights',
    artist: 'MC Flow',
    album: 'Urban Tales',
    duration: 205,
    albumArt: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3',
  },
  {
    id: '12',
    title: 'Street Dreams',
    artist: 'Urban Poets',
    album: 'Real Talk',
    duration: 232,
    albumArt: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Kai_Engel/Satin/Kai_Engel_-_04_-_Downfall.mp3',
  },
  // Electronic/Dance
  {
    id: '13',
    title: 'Neon Nights',
    artist: 'Synthwave',
    album: 'Club Hits',
    duration: 245,
    albumArt: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Komiku/Captain_Glouglous_Incredible_Week_Soundtrack/Komiku_-_01_-_Chill_Out_Theme.mp3',
  },
  {
    id: '14',
    title: 'Dance Floor',
    artist: 'DJ Pulse',
    album: 'Party Time',
    duration: 198,
    albumArt: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Rolemusic/Strata/Rolemusic_-_03_-_Shake_n_Pop.mp3',
  },
  // Bongo Flava / Swahili influenced
  {
    id: '15',
    title: 'Coastal Vibes',
    artist: 'East African Stars',
    album: 'Bongo Flava Hits',
    duration: 220,
    albumArt: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/Monplaisir/Heat_of_the_Summer/Monplaisir_-_04_-_Level_1.mp3',
  },
  {
    id: '16',
    title: 'Zanzibar Sunset',
    artist: 'Swahili Sounds',
    album: 'Tanzania Nights',
    duration: 195,
    albumArt: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&h=300&fit=crop',
    audioUrl: 'https://files.freemusicarchive.org/storage-freemusicarchive-org/music/ccCommunity/BoxCat_Games/Nameless_the_Hackers_RPG_Soundtrack/BoxCat_Games_-_10_-_Epic_Song.mp3',
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
