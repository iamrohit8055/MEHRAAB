export interface MenuItem {
  id: string
  name: string
  subtitle: string
  description: string
  price: string
  category: 'all' | 'cafe' | 'small-plates' | 'mains' | 'desserts'
  dietary: 'veg' | 'non-veg' | 'vegan'
  isSignature?: boolean
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
      'Foraged Himalayan morels stuffed with smoked buffalo milk paneer and dry fruits, slow-braised in a delicate mace and Kashmiri chili broth.',
    price: '₹1,850',
    category: 'mains',
    dietary: 'veg',
    isSignature: true,
  },
  {
    id: 'smoked-dal-mehraab',
    name: 'Dal Mehraab (24-Hour Charcoal Smoked)',
    subtitle: 'Urad Lentils · White Makhan · Rose Petal Smoke',
    description:
      'Slow-simmered over live embers for twenty-four hours with single-estate churned white butter, finished with an applewood and dried damask rose smoke.',
    price: '₹950',
    category: 'mains',
    dietary: 'veg',
    isSignature: true,
  },
  {
    id: 'nalli-nihari',
    name: 'Awadhi Nalli Nihari',
    subtitle: 'Slow-Braised Shank · 32 Spices · Saffron Taftan',
    description:
      'Tender shank simmered overnight in potli masala broth, garnished with ginger juliennes, cold-pressed mustard oil, and warm hand-pulled clay oven bread.',
    price: '₹2,200',
    category: 'mains',
    dietary: 'non-veg',
    isSignature: true,
  },
  {
    id: 'scallop-ceviche',
    name: 'Malabar Scallop & Raw Mango Ceviche',
    subtitle: 'Diver Scallops · Coconut Emulsion · Crisp Curry Leaf',
    description:
      'Thinly sliced coastal diver scallops cured in raw totapuri mango vinegar, chilled coconut water foam, and crackled black mustard seeds.',
    price: '₹1,450',
    category: 'small-plates',
    dietary: 'non-veg',
  },
  {
    id: 'avocado-bhel',
    name: 'Hass Avocado & Truffle Bhel',
    subtitle: 'Puffed Wild Rice · Tamarind Pearls · Black Summer Truffle',
    description:
      'Crisp puffed red rice tossed with diced ripe Hass avocado, tart green mango, date-tamarind sphere pearls, and shaved Himalayan black truffle.',
    price: '₹890',
    category: 'small-plates',
    dietary: 'vegan',
  },
  {
    id: 'malabar-monsooned-roast',
    name: 'Monsooned Malabar Nitro Roast',
    subtitle: 'Estate Arabica · Green Cardamom · Jaggery Cloud',
    description:
      'Cold-brewed single-origin coffee exposed to the Arabian Sea monsoon winds, nitrogen-charged and crowned with palm jaggery foam.',
    price: '₹480',
    category: 'cafe',
    dietary: 'vegan',
  },
  {
    id: 'saffron-pistachio-qahwah',
    name: 'Pashmina Saffron Qahwah',
    subtitle: 'Pampore Saffron · Crushed Green Almond · Wild Honey',
    description:
      'Golden Kashmiri green tea brewed with cinnamon barks, cardamom pods, crushed green almonds, and finished with grade-A Kashmiri saffron threads.',
    price: '₹520',
    category: 'cafe',
    dietary: 'vegan',
  },
  {
    id: 'paan-mille-feuille',
    name: 'Calcuttan Paan & Rose Mille-Feuille',
    subtitle: 'Caramelized Puff Pastry · Betel Leaf Crème · 24K Gold Leaf',
    description:
      'Paper-thin layers of caramelized puff pastry layered with fragrant Maghai paan emulsion, candied rose petal gulkand, and edible pure gold leaf.',
    price: '₹850',
    category: 'desserts',
    dietary: 'veg',
    isSignature: true,
  },
]
