export interface SpaceItem {
  id: string
  title: string
  subtitle: string
  description: string
  dimensions: string
  capacity: string
  materials: string[]
  image: string
  quote: string
}

export const ARCHITECTURE_SPACES: SpaceItem[] = [
  {
    id: 'grand-mehraab',
    title: 'The Grand Mehraab Hall',
    subtitle: 'Main Dining Pavilion · 24-Foot Basalt Arches',
    description:
      'The cathedral-like core of the sanctuary. Twelve monumental hand-chiseled black basalt arches rise toward fluted acoustic ceilings, anchored by low-slung patinated brass chandeliers that cast a warm, candlelit chiaroscuro across intimate deep espresso banquettes.',
    dimensions: '2,800 sq ft',
    capacity: '78 Guests',
    materials: ['Deccan Black Basalt', 'Antiqued Brass', 'Charred Teak', 'Espresso Velvet'],
    image:
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80',
    quote: '“Where historic stone geometry dissolves into contemporary warmth.”',
  },
  {
    id: 'cafe-verandah',
    title: 'The Roastery & Café Verandah',
    subtitle: 'Morning Conservatory · Hand-Carved Jali Screens',
    description:
      'A serene, sun-dappled haven greeting the dawn. Geometric stone lattice (jali) screens filter Mumbai’s maritime daylight into kinetic shadows, while our custom Slayer espresso bar serves micro-lot harvests upon polished green Udaipur marble counters.',
    dimensions: '1,400 sq ft',
    capacity: '36 Guests',
    materials: ['Udaipur Green Marble', 'Perforated Stone Jali', 'Woven Cane', 'Brushed Copper'],
    image:
      'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80',
    quote: '“Morning sunlight filtered through ancient lattice geometry.”',
  },
  {
    id: 'courtyard-embers',
    title: 'The Courtyard of Embers',
    subtitle: 'Alfresco Twilight Garden · Reflecting Pools & Clay Pits',
    description:
      'Under the open evening sky, guests dine beside tranquil basalt water rills and scent-giving night jasmines. Open-air charcoal sigris and clay tandoor hearths glow against hand-rendered lime plaster walls as gentle sitar acoustics echo through the courtyard.',
    dimensions: '2,200 sq ft',
    capacity: '50 Guests',
    materials: ['Hand-Rendered Lime Plaster', 'Kota Stone Flagstones', 'Living Jasmine', 'Cast Iron'],
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80',
    quote: '“Open embers, fragrant breeze, and twilight water reflections.”',
  },
  {
    id: 'parda-salon',
    title: 'The Parda Salon',
    subtitle: 'Private Dining Sanctuary · Dedicated Butler & Sommelier',
    description:
      'An ultra-exclusive dining salon concealed behind a heavy brass archway. Accommodates up to 16 guests with bespoke table settings, hand-spun raw Banarasi silk wall upholstery, and a private sommelier tasting cellar stocked with rare regional vintages.',
    dimensions: '850 sq ft',
    capacity: '16 Guests',
    materials: ['Banarasi Raw Silk', 'Smoked Mirror Glass', 'Rosewood Table', '24K Gold Leaf'],
    image:
      'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=1600&q=80',
    quote: '“Absolute seclusion. Royal ceremonial hospitality.”',
  },
]
