export type Braider = {
  name: string;
  photo: string;
  instagram: string; // handle without @
  styles: string[];
  priceFrom: number;
  bio: string;
};

export type City = {
  slug: string;
  name: string;
  state: string;
  cover: string;
  tagline: string;
  braiders: Braider[];
};

// Hand-picked Unsplash photos (free to use) showcasing braided hairstyles & cities.
const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const cities: City[] = [
  {
    slug: "new-york",
    name: "New York",
    state: "NY",
    tagline: "From Harlem to Brooklyn — the city that braids back.",
    cover: u("photo-1518391846015-55a9cc003b25"),
    braiders: [
      {
        name: "Amara Okafor",
        photo: u("photo-1531123897727-8f129e1688ce", 800),
        instagram: "amara.braids",
        styles: ["Knotless", "Boho", "Goddess Locs"],
        priceFrom: 220,
        bio: "Harlem-based stylist with a soft-touch technique. Specializing in lightweight, scalp-friendly knotless.",
      },
      {
        name: "Zuri Bennett",
        photo: u("photo-1605497788044-5a32c7078486", 800),
        instagram: "zuri.hairnyc",
        styles: ["Fulani", "Cornrows", "Stitch Braids"],
        priceFrom: 180,
        bio: "Brooklyn artist known for clean parts and intricate Fulani patterns.",
      },
      {
        name: "Imani Charles",
        photo: u("photo-1594744803329-e58b31de8bf5", 800),
        instagram: "imanidoeshair",
        styles: ["Box Braids", "Passion Twists"],
        priceFrom: 200,
        bio: "Bronx-born, ten years experience. Cozy in-home studio in Bed-Stuy.",
      },
    ],
  },
  {
    slug: "atlanta",
    name: "Atlanta",
    state: "GA",
    tagline: "Capital of culture — and the crown above it.",
    cover: u("photo-1575919460395-c20bcd0bf0e0"),
    braiders: [
      {
        name: "Nia Williams",
        photo: u("photo-1487412720507-e7ab37603c6f", 800),
        instagram: "niabraidsatl",
        styles: ["Knotless", "Bohemian", "Micro Braids"],
        priceFrom: 250,
        bio: "Buckhead salon owner. Bohemian curls are her signature.",
      },
      {
        name: "Kalia Reed",
        photo: u("photo-1502720433255-614171a1835e", 800),
        instagram: "kaliareedhair",
        styles: ["Goddess Braids", "Feed-Ins"],
        priceFrom: 175,
        bio: "Decatur-based braider with a passion for protective styles that last.",
      },
      {
        name: "Sade Johnson",
        photo: u("photo-1542596594-649edbc13630", 800),
        instagram: "sade.styles",
        styles: ["Lemonade Braids", "Cornrows"],
        priceFrom: 160,
        bio: "Quick, neat, and always on time. Midtown studio.",
      },
    ],
  },
  {
    slug: "houston",
    name: "Houston",
    state: "TX",
    tagline: "Big city, bigger braid game.",
    cover: u("photo-1531218150217-54595bc2b934"),
    braiders: [
      {
        name: "Brielle Thomas",
        photo: u("photo-1517841905240-472988babdf9", 800),
        instagram: "brielle.htx",
        styles: ["Boho Knotless", "Butterfly Locs"],
        priceFrom: 210,
        bio: "Third Ward braider. Lush, romantic boho looks.",
      },
      {
        name: "Aisha Mensah",
        photo: u("photo-1488426862026-3ee34a7d66df", 800),
        instagram: "aishaslays",
        styles: ["Tribal Braids", "Stitch Braids"],
        priceFrom: 190,
        bio: "Ghanaian roots, Texan finish. Sugar Land studio.",
      },
    ],
  },
  {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "CA",
    tagline: "Sun-kissed style, woven by hand.",
    cover: u("photo-1444723121867-7a241cacace9"),
    braiders: [
      {
        name: "Jordyn Pierre",
        photo: u("photo-1524504388940-b1c1722653e1", 800),
        instagram: "jordyn.braids.la",
        styles: ["Knotless", "Coi Leray", "Passion Twists"],
        priceFrom: 280,
        bio: "Inglewood stylist beloved by LA creatives.",
      },
      {
        name: "Maya Robinson",
        photo: u("photo-1438761681033-6461ffad8d80", 800),
        instagram: "mayadoeshair",
        styles: ["Boho Braids", "Goddess Locs"],
        priceFrom: 240,
        bio: "Beach-vibe boho specialist in Culver City.",
      },
    ],
  },
  {
    slug: "chicago",
    name: "Chicago",
    state: "IL",
    tagline: "Lakefront luxe and South Side soul.",
    cover: u("photo-1494522855154-9297ac14b55f"),
    braiders: [
      {
        name: "Tiana Brooks",
        photo: u("photo-1546961342-1eaa5f239d11", 800),
        instagram: "tianabraidschi",
        styles: ["Micro Knotless", "Fulani"],
        priceFrom: 230,
        bio: "South Loop studio. Detail-obsessed, lightweight finish.",
      },
      {
        name: "Olivia Hayes",
        photo: u("photo-1508214751196-bcfd4ca60f91", 800),
        instagram: "livhairchi",
        styles: ["Box Braids", "Cornrows"],
        priceFrom: 170,
        bio: "Hyde Park braider with a gentle hand for sensitive scalps.",
      },
    ],
  },
  {
    slug: "miami",
    name: "Miami",
    state: "FL",
    tagline: "Salt air, sun, and silky finishes.",
    cover: u("photo-1514214246283-d427a95c5d2f"),
    braiders: [
      {
        name: "Camille Saint-Louis",
        photo: u("photo-1534528741775-53994a69daeb", 800),
        instagram: "camille.miamihair",
        styles: ["Boho Knotless", "Goddess Locs", "Butterfly Locs"],
        priceFrom: 260,
        bio: "Haitian-Miami stylist with a romantic, soft aesthetic.",
      },
      {
        name: "Lola Bertrand",
        photo: u("photo-1502323777036-f29e3972d82f", 800),
        instagram: "lola.bertrand",
        styles: ["Passion Twists", "Senegalese Twists"],
        priceFrom: 200,
        bio: "Wynwood studio. Bold colors and vacation-ready styles.",
      },
    ],
  },
];

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);
