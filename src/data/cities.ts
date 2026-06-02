export type Braider = {
  name: string;
  photo: string;
  instagram: string;
  styles: string[];
  priceFrom: number; // euros
  priceTier: "€" | "€€" | "€€€";
  rating: number;
  reviews: number;
  bio: string;
};

export type City = {
  slug: string;
  name: string;
  cover: string;
  tagline: string;
  braiders: Braider[];
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const cities: City[] = [
  {
    slug: "amsterdam",
    name: "Amsterdam",
    tagline: "Grachten, fietsen — en de zachtste knotless van het land.",
    cover: u("photo-1534351590666-13e3e96c5017"),
    braiders: [
      {
        name: "Crowned Beauty",
        photo: u("photo-1531123897727-8f129e1688ce", 800),
        instagram: "crowned.beauty.ams",
        styles: ["Knotless", "Boho Braids", "Goddess Locs"],
        priceFrom: 180,
        priceTier: "€€€",
        rating: 4.8,
        reviews: 34,
        bio: "Salon in Amsterdam-Zuidoost. Bekend om luchtige knotless en zachte boho looks.",
      },
      {
        name: "Yara Haircraft",
        photo: u("photo-1605497788044-5a32c7078486", 800),
        instagram: "yara.haircraft",
        styles: ["Fulani", "Stitch Braids"],
        priceFrom: 120,
        priceTier: "€€",
        rating: 4.9,
        reviews: 52,
        bio: "Thuissalon in De Pijp. Strakke parts, geduldige hand.",
      },
      {
        name: "Soraya Styles",
        photo: u("photo-1594744803329-e58b31de8bf5", 800),
        instagram: "soraya.styles",
        styles: ["Box Braids", "Passion Twists"],
        priceFrom: 100,
        priceTier: "€€",
        rating: 4.7,
        reviews: 41,
        bio: "Snel, netjes en altijd op tijd — Amsterdam Noord.",
      },
    ],
  },
  {
    slug: "rotterdam",
    name: "Rotterdam",
    tagline: "Stoere skyline, vlechtwerk met karakter.",
    cover: u("photo-1612521564730-09fe0a07c7b3"),
    braiders: [
      {
        name: "Braids by Amina",
        photo: u("photo-1487412720507-e7ab37603c6f", 800),
        instagram: "braidsbyamina",
        styles: ["Knotless", "Bohemian", "Micro Braids"],
        priceFrom: 150,
        priceTier: "€€",
        rating: 4.9,
        reviews: 56,
        bio: "Studio in Rotterdam-West. Bohemian curls zijn haar handtekening.",
      },
      {
        name: "Kalia Reed",
        photo: u("photo-1502720433255-614171a1835e", 800),
        instagram: "kaliareedhair",
        styles: ["Goddess Braids", "Feed-Ins"],
        priceFrom: 130,
        priceTier: "€€",
        rating: 4.8,
        reviews: 38,
        bio: "Vlechtspecialist met liefde voor langhoudbare protective styles.",
      },
    ],
  },
  {
    slug: "utrecht",
    name: "Utrecht",
    tagline: "Klein van formaat, groot in vlechtkunst.",
    cover: u("photo-1558551649-e44c8f992010"),
    braiders: [
      {
        name: "Locs by Destiny",
        photo: u("photo-1517841905240-472988babdf9", 800),
        instagram: "locsbydestiny",
        styles: ["Sister Locs", "Butterfly Locs"],
        priceFrom: 200,
        priceTier: "€€",
        rating: 5.0,
        reviews: 32,
        bio: "Loc-specialist in Utrecht Centrum. Tedere installaties, eindeloze details.",
      },
      {
        name: "Aisha Mensah",
        photo: u("photo-1488426862026-3ee34a7d66df", 800),
        instagram: "aishaslays",
        styles: ["Tribal Braids", "Stitch Braids"],
        priceFrom: 140,
        priceTier: "€€",
        rating: 4.8,
        reviews: 27,
        bio: "Ghanese roots, Hollandse finish. Thuissalon in Overvecht.",
      },
    ],
  },
  {
    slug: "arnhem",
    name: "Arnhem",
    tagline: "Bossen, mode, en heel veel haarliefde.",
    cover: u("photo-1518391846015-55a9cc003b25"),
    braiders: [
      {
        name: "Nay's Braids",
        photo: u("photo-1524504388940-b1c1722653e1", 800),
        instagram: "naysbraids",
        styles: ["Knotless", "Coi Leray", "Passion Twists"],
        priceFrom: 160,
        priceTier: "€€",
        rating: 4.9,
        reviews: 28,
        bio: "Studio in Arnhem Zuid. Geliefd bij creatieven en studenten.",
      },
      {
        name: "Maya Roots",
        photo: u("photo-1438761681033-6461ffad8d80", 800),
        instagram: "mayaroots.nl",
        styles: ["Boho Braids", "Goddess Locs"],
        priceFrom: 140,
        priceTier: "€€",
        rating: 4.7,
        reviews: 19,
        bio: "Boho-specialist met een zachte, romantische signature.",
      },
    ],
  },
  {
    slug: "the-hague",
    name: "The Hague",
    tagline: "Aan zee, dichtbij de koningin van je kroon.",
    cover: u("photo-1502323777036-f29e3972d82f"),
    braiders: [
      {
        name: "Camille Haircouture",
        photo: u("photo-1534528741775-53994a69daeb", 800),
        instagram: "camille.haircouture",
        styles: ["Boho Knotless", "Goddess Locs"],
        priceFrom: 170,
        priceTier: "€€€",
        rating: 4.9,
        reviews: 44,
        bio: "Salon in het centrum van Den Haag. Romantische, zachte esthetiek.",
      },
      {
        name: "Lola Bertrand",
        photo: u("photo-1546961342-1eaa5f239d11", 800),
        instagram: "lola.bertrand",
        styles: ["Passion Twists", "Senegalese Twists"],
        priceFrom: 130,
        priceTier: "€€",
        rating: 4.8,
        reviews: 31,
        bio: "Studio in Scheveningen. Vakantie-ready styles met durf.",
      },
    ],
  },
];

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);

// Curated style categories shown in "Browse by style"
export const styleCategories = [
  { name: "Knotless", photo: u("photo-1531123897727-8f129e1688ce", 400) },
  { name: "Boho Braids", photo: u("photo-1524504388940-b1c1722653e1", 400) },
  { name: "Fulani Braids", photo: u("photo-1605497788044-5a32c7078486", 400) },
  { name: "Cornrows", photo: u("photo-1487412720507-e7ab37603c6f", 400) },
  { name: "Locs & Twists", photo: u("photo-1517841905240-472988babdf9", 400) },
];
