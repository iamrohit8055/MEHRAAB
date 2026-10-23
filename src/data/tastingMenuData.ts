export interface TastingCourse {
  courseNumber: string
  title: string
  dish: string
  subtitle: string
  description: string
  vegetarianAlternative?: string
  pairing: {
    wine: string
    botanical: string
  }
}

export interface TastingMenu {
  title: string
  subtitle: string
  curator: string
  priceFood: string
  pricePairing: string
  serviceHours: string
  courses: TastingCourse[]
}

export const AUTUMN_TASTING_MENU: TastingMenu = {
  title: 'The Seven-Course Mehraab Odyssey',
  subtitle: 'Autumn Solstice Gastronomic Architecture · 2026',
  curator: 'Executive Chef Samarpan Roy · Head Sommelier Kavita Rao',
  priceFood: '₹6,500 per guest',
  pricePairing: '₹3,800 paired tasting flight',
  serviceHours: 'Twilight Seating 18:30 · Prime Dinner 20:30',
  courses: [
    {
      courseNumber: 'Course 01 · Prarambh',
      title: 'The Awakening Amuse-Bouche',
      dish: 'Kokum & Wild Rose Sphere',
      subtitle: 'Liquid Nitrogen Frozen Kokum Foam · Black Salt Pearl',
      description:
        'A single crystalline orb of chilled coastal kokum nectar, cold-pressed mint oil, and crushed Himalayan rock salt pearls that dissolves upon the palate.',
      pairing: {
        wine: 'NV Drappier Brut Nature Zero Dosage Champagne',
        botanical: 'Kashmiri Kahwa & Spiced Melon Elixir',
      },
    },
    {
      courseNumber: 'Course 02 · Samudra',
      title: 'From Coastal Trade Routes',
      dish: 'Malabar Diver Scallop & Totapuri Mango',
      subtitle: 'Thinly Sliced Arabian Sea Scallops · Chilled Coconut Water Emulsion',
      description:
        'Flash-cured coastal scallops in raw totapuri mango vinegar, cold-pressed mustard oil crackle, pickled sea purslane, and crispy curry leaf threads.',
      vegetarianAlternative:
        'Heirloom Palm Heart & Young Coconut Carpaccio with green chili lime emulsion.',
      pairing: {
        wine: '2022 Domaine Sigalas Assyrtiko · Santorini',
        botanical: 'Lemongrass, Kaffir & Chilled Coconut Highball',
      },
    },
    {
      courseNumber: 'Course 03 · Krishi',
      title: 'The Street Heritage Ode',
      dish: 'Hass Avocado & Summer Truffle Bhel',
      subtitle: 'Puffed Red Rice · Tamarind Fluid Gel · Shaved Black Truffle',
      description:
        'Heirloom red rice crisped in cold-pressed peanut oil, tossed with ripe Hass avocado, tart green mango brunoise, and crowned with shaved summer truffle.',
      pairing: {
        wine: '2021 Schloss Gobelsburg Grüner Veltliner · Kamptal',
        botanical: 'Makaibari Estate Sparkling White Tea Cold Brew',
      },
    },
    {
      courseNumber: 'Course 04 · Jungle',
      title: 'Wild Himalayan Terroir',
      dish: 'Foraged Kashmir Valley Gucchi Morel',
      subtitle: 'Smoked Buffalo Paneer · Crushed Pine Nuts · Ratanjot Saffron Reduction',
      description:
        'Wild Himalayan morels hand-stuffed with smoked cottage cheese and roasted cedar nuts, slow-braised for 6 hours in sealed brass with single-origin ratanjot bark.',
      pairing: {
        wine: '2019 Domaine de Chevalier · Pessac-Léognan, Bordeaux',
        botanical: 'Smoked Walnut & Mulberry Infusion',
      },
    },
    {
      courseNumber: 'Course 05 · Dastarkhwan',
      title: 'The Royal Court Hearth',
      dish: 'Awadhi Nalli Nihari & Saffron Taftan',
      subtitle: '14-Hour Braised Shank · 32 Potli Masalas · Clay Oven Bread',
      description:
        'Rich bone marrow broth simmered overnight from midnight to dawn in unglazed degh pots, accented with fresh mace, ginger juliennes, and warm hand-pulled taftan.',
      vegetarianAlternative:
        'Slow-braised Smoked Kathal (Young Jackfruit) Nihari with roasted shallots.',
      pairing: {
        wine: '2018 Sula Dindori Reserve Shiraz · Nashik Valley',
        botanical: 'Star Anise & Caramelized Fig Shrub',
      },
    },
    {
      courseNumber: 'Course 06 · Anugrah',
      title: 'The Sacred Embers',
      dish: 'Dal Mehraab (24-Hour Charcoal Smoked)',
      subtitle: 'Black Urad · Cultured Makhan · Damask Rose Petal Dhungar',
      description:
        'Our iconic signature. Simmered over live acacia embers for twenty-four uninterrupted hours with hand-churned white butter and smoked table-side under an antique brass cloche.',
      pairing: {
        wine: '2017 Marchesi di Barolo Tradizione Nebbiolo · Piedmont',
        botanical: 'Roasted Cardamom & Sun-Dried Rose Soda',
      },
    },
    {
      courseNumber: 'Course 07 · Shringaar',
      title: 'The Confection Finale',
      dish: 'Calcuttan Paan & Damask Rose Mille-Feuille',
      subtitle: 'Flaky Puff Pastry · Maghai Paan Crème · 24K Edible Gold Leaf',
      description:
        'Paper-thin layers of caramelized puff pastry alternating with fragrant Maghai betel leaf emulsion, candied gulkand pearls, and hand-gilded 24-karat edible gold leaves.',
      pairing: {
        wine: '2017 Royal Tokaji Aszú 5 Puttonyos · Hungary',
        botanical: 'Spiced Saffron Milk with Roasted Green Almond',
      },
    },
  ],
}
