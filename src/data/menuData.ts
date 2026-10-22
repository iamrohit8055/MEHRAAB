export interface MenuItem {
  id: string
  name: string
  subtitle: string
  description: string
  price: string
  category: 'all' | 'cafe' | 'small-plates' | 'mains' | 'desserts'
  dietary: 'veg' | 'non-veg' | 'vegan'
  isSignature?: boolean
  image: string
  flavorNotes: string[]
  pairing: string
  origin: string
  ritual?: string
}

export const MENU_CATEGORIES = [
  { id: 'all', label: 'Complete Selection' },
  { id: 'cafe', label: 'Café & Morning Roast' },
  { id: 'small-plates', label: 'Small Plates & Chaat' },
  { id: 'mains', label: 'Signature Mains' },
  { id: 'desserts', label: 'Confections & Libations' },
] as const

export const SIGNATURE_DISHES: MenuItem[] = [
  {
    id: 'gucchi-rogan-josh',
    name: 'Gucchi & Morel Rogan Josh',
    subtitle: 'Wild Kashmir Valley Morels · Saffron Ratanjot Reduction',
    description:
      'Foraged Himalayan morels hand-stuffed with smoked buffalo milk paneer and crushed pine nuts, slow-braised in a delicate mace, dried ginger, and Kashmiri chili reduction.',
    price: '₹1,850',
    category: 'mains',
    dietary: 'veg',
    isSignature: true,
    image:
      'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1200&q=80',
    flavorNotes: ['Wild Earth & Pine', 'Pampore Saffron', 'Warm Mace Broth'],
    pairing: '2019 Domaine de Chevalier · Pessac-Léognan',
    origin: 'Pahalgam Valley, Kashmir · 7,200ft Altitude',
    ritual: 'Slow-braised for 6 hours in sealed brass degchi with single-origin ratanjot bark.',
  },
  {
    id: 'smoked-dal-mehraab',
    name: 'Dal Mehraab (24-Hour Charcoal Smoked)',
    subtitle: 'Black Urad Lentils · White Makhan · Damask Rose Smoke',
    description:
      'Slow-simmered over live acacia embers for twenty-four uninterrupted hours with hand-churned white butter, finished with an applewood and dried damask rose petal dhungar smoke.',
    price: '₹950',
    category: 'mains',
    dietary: 'veg',
    isSignature: true,
    image:
      'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=1200&q=80',
    flavorNotes: ['Smoked Applewood', 'Velvety Cream', 'Sun-Dried Rose Petals'],
    pairing: 'Smoked Kashmiri Walnut Old Fashioned',
    origin: 'Heritage Hearth, Northern Punjab Borderlands',
    ritual: 'Infused table-side under an antique perforated cloche with burning red charcoal embers.',
  },
  {
    id: 'nalli-nihari',
    name: 'Awadhi Nalli Nihari',
    subtitle: 'Slow-Braised Shank · 32 Spices · Saffron Taftan',
    description:
      'Tender shank simmered overnight in potli masala broth, garnished with fresh ginger juliennes, cold-pressed mustard oil, and warm hand-pulled clay oven saffron taftan.',
    price: '₹2,200',
    category: 'mains',
    dietary: 'non-veg',
    isSignature: true,
    image:
      'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&w=1200&q=80',
    flavorNotes: ['Marrow Richness', 'Star Anise & Fennel', 'Saffron Clay Bread'],
    pairing: '2018 Sula Dindori Reserve Shiraz',
    origin: 'Royal Court Kitchens of Lucknow',
    ritual: 'Simmered overnight from midnight to dawn in earthen degh pots.',
  },
  {
    id: 'scallop-ceviche',
    name: 'Malabar Scallop & Raw Mango Ceviche',
    subtitle: 'Diver Scallops · Coconut Emulsion · Crisp Curry Leaf',
    description:
      'Thinly sliced coastal diver scallops cured in raw totapuri mango vinegar, chilled coconut water foam, and crackled black mustard seeds with pickled sea fennel.',
    price: '₹1,450',
    category: 'small-plates',
    dietary: 'non-veg',
    image:
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
    flavorNotes: ['Tart Green Mango', 'Tender Coastal Scallop', 'Fragrant Curry Oil'],
    pairing: 'Kochi Pepper & Lemongrass Highball',
    origin: 'Arabian Sea Coastal Line, Malabar',
    ritual: 'Flash-cured at 4°C with hand-pressed wild coconut cream.',
  },
  {
    id: 'avocado-bhel',
    name: 'Hass Avocado & Truffle Bhel',
    subtitle: 'Puffed Wild Rice · Tamarind Pearls · Black Summer Truffle',
    description:
      'Crisp puffed red rice tossed with diced ripe Hass avocado, tart green mango, date-tamarind sphere pearls, and shaved Himalayan black summer truffle.',
    price: '₹890',
    category: 'small-plates',
    dietary: 'vegan',
    image:
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
    flavorNotes: ['Crunchy Roasted Grains', 'Creamy Ripe Avocado', 'Earthy Summer Truffle'],
    pairing: 'Chilled Sparkling Darjeeling White Tea',
    origin: 'Contemporary Street Ode, Chowpatty',
    ritual: 'Tossed table-side in a hand-hammered bronze mortar.',
  },
  {
    id: 'malabar-monsooned-roast',
    name: 'Monsooned Malabar Nitro Roast',
    subtitle: 'Estate Arabica · Green Cardamom · Jaggery Cloud',
    description:
      'Cold-brewed single-origin coffee exposed to the Arabian Sea monsoon winds, nitrogen-charged and crowned with palm jaggery foam and toasted coconut flake.',
    price: '₹480',
    category: 'cafe',
    dietary: 'vegan',
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80',
    flavorNotes: ['Dark Chocolate Earth', 'Sweet Palm Nectar', 'Nitro Velvet Foam'],
    pairing: 'Cardamom & Roasted Pistachio Biscotti',
    origin: 'Baba Budangiri Hills, Karnataka',
    ritual: 'Steeped for 18 hours in cold alpine spring water.',
  },
  {
    id: 'saffron-pistachio-qahwah',
    name: 'Pashmina Saffron Qahwah',
    subtitle: 'Pampore Saffron · Crushed Green Almond · Wild Honey',
    description:
      'Golden Kashmiri green tea brewed with cinnamon barks, cardamom pods, crushed green almonds, and finished with grade-A Kashmiri saffron threads and raw forest honey.',
    price: '₹520',
    category: 'cafe',
    dietary: 'vegan',
    image:
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80',
    flavorNotes: ['Warm Cinnamon Bark', 'Golden Saffron Nectar', 'Almond Silk'],
    pairing: 'Bakarkhani Crisp Flatbread',
    origin: 'Dal Lake Houseboats, Srinagar',
    ritual: 'Served piping hot from an engraved antique copper Samovar.',
  },
  {
    id: 'paan-mille-feuille',
    name: 'Calcuttan Paan & Rose Mille-Feuille',
    subtitle: 'Caramelized Puff Pastry · Betel Leaf Crème · 24K Gold Leaf',
    description:
      'Paper-thin layers of caramelized puff pastry layered with fragrant Maghai paan emulsion, candied rose petal gulkand, fennel seed pearls, and edible pure gold leaf.',
    price: '₹850',
    category: 'desserts',
    dietary: 'veg',
    isSignature: true,
    image:
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=1200&q=80',
    flavorNotes: ['Flaky Caramel Butter', 'Aromatic Maghai Paan', 'Pure Damask Rose'],
    pairing: 'Late Harvest Royal Tokaji Aszú 5 Puttonyos',
    origin: 'Shobhabazar Rajbari, North Calcutta',
    ritual: 'Gilded by hand with pure 24-karat edible gold leaves.',
  },
]
