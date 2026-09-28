import type { Attraction } from '../lib/types';

/**
 * All Walt Disney World character meals in one place — the in-park table-service
 * spots (Magic Kingdom, EPCOT) and the resort character meals, grouped under a
 * single "Character Dining" wishlist tab so they can be compared together.
 *
 * `land` is the location (park or resort) the restaurant sits in; the `note`
 * lists the characters you typically meet and which meals are served; `url`
 * links to the official Disney menu page. Coordinates are unused (this tab has
 * no schematic map) but the Attraction type requires them.
 *
 * Scope intentionally excludes character meals that need Animal Kingdom or
 * Hollywood Studios admission (e.g. Tusker House, Hollywood & Vine). Character
 * lineups rotate and aren't guaranteed — check the linked menu page.
 */
const RESERVATION = 'reservation required';
const meal = (
  id: string,
  name: string,
  land: string,
  note: string,
  url: string,
  coords: { x: number; y: number } = { x: 300, y: 300 },
): Attraction => ({
  id,
  name,
  land,
  park: 'resort',
  kind: 'dining',
  avgWait: 0,
  maxWait: 0,
  duration: 90,
  coords,
  note,
  url,
});

export const CHARACTER_DINING: Attraction[] = [
  // In-park character meals (no separate admission beyond the park you're in).
  meal(
    'mk-cinderellas-royal-table',
    "Cinderella's Royal Table",
    'Magic Kingdom',
    `Characters: Disney Princesses (Cinderella, plus Ariel, Aurora, Belle, Jasmine & Snow White rotating) • breakfast, lunch & dinner inside the castle • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/magic-kingdom/cinderella-royal-table/',
    { x: 300, y: 270 },
  ),
  meal(
    'mk-crystal-palace',
    'The Crystal Palace',
    'Magic Kingdom',
    `Characters: Winnie the Pooh, Tigger, Piglet & Eeyore • breakfast, lunch & dinner buffet • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/magic-kingdom/crystal-palace/',
    { x: 250, y: 350 },
  ),
  meal(
    'epcot-garden-grill',
    'Garden Grill Restaurant',
    'EPCOT',
    `Characters: Mickey, Pluto, Chip & Dale • breakfast, lunch & dinner • rotating restaurant in The Land • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/epcot/garden-grill-restaurant/',
    { x: 155, y: 210 },
  ),
  meal(
    'epcot-akershus',
    'Akershus Royal Banquet Hall',
    'EPCOT',
    `Characters: Disney Princesses & friends (Belle, Cinderella, Ariel, Aurora, Snow White, Jasmine, Mulan & Mary Poppins rotate) • breakfast, lunch & dinner • Norway pavilion • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/epcot/akershus-royal-banquet-hall/',
    { x: 445, y: 445 },
  ),

  // Resort character meals (no theme-park admission required).
  meal(
    'resort-chef-mickeys',
    "Chef Mickey's",
    "Disney's Contemporary Resort",
    `Characters: Mickey, Minnie, Donald, Goofy & Pluto (chef attire) • breakfast, brunch & dinner buffet • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/contemporary-resort/chef-mickeys/',
  ),
  meal(
    'resort-ohana-breakfast',
    "'Ohana Best Friends Breakfast",
    "Disney's Polynesian Village Resort",
    `Characters: Lilo, Stitch, Mickey & Pluto • family-style breakfast • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/polynesian-resort/ohana/',
  ),
  meal(
    'resort-topolinos',
    "Topolino's Terrace – Breakfast à la Art",
    "Disney's Riviera Resort",
    `Characters: Mickey, Minnie, Donald & Daisy (in artist outfits) • rooftop breakfast • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/riviera-resort/topolinos-terrace/',
  ),
  meal(
    'resort-cape-may',
    "Cape May Cafe – Minnie's Beach Bash",
    "Disney's Beach Club Resort",
    `Characters: Minnie, Goofy, Donald & Daisy (beach attire) • breakfast buffet • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/beach-club-resort/cape-may-cafe/',
  ),
  meal(
    'resort-1900-park-fare',
    '1900 Park Fare',
    "Disney's Grand Floridian Resort & Spa",
    `Characters: Cinderella, Tiana, Aladdin & Mirabel • character breakfast & dinner buffet • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/grand-floridian-resort-and-spa/1900-park-fare/',
  ),
  meal(
    'resort-artist-point',
    'Story Book Dining at Artist Point',
    "Disney's Wilderness Lodge",
    `Characters: Snow White, the Evil Queen, Dopey & Grumpy • character dinner (prix-fixe) • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/wilderness-lodge-resort/artist-point/',
  ),
  meal(
    'resort-garden-grove',
    'Garden Grove Character Meal',
    'Walt Disney World Swan',
    `Characters: Goofy & Pluto (lineup varies) • character dinner nightly + weekend-morning breakfast • ${RESERVATION}`,
    'https://disneyworld.disney.go.com/dining/swan-hotel/garden-grove/',
  ),
];
