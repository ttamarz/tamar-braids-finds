export type City = {
  slug: string;
  name: string;
  cover: string;
  tagline: string;
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const cities: City[] = [
  {
    slug: "amsterdam",
    name: "Amsterdam",
    tagline: "Grachten, fietsen — en de zachtste knotless van het land.",
    cover: u("photo-1534351590666-13e3e96c5017"),
  },
  {
    slug: "rotterdam",
    name: "Rotterdam",
    tagline: "Stoere skyline, vlechtwerk met karakter.",
    cover: u("photo-1612521564730-09fe0a07c7b3"),
  },
  {
    slug: "utrecht",
    name: "Utrecht",
    tagline: "Klein van formaat, groot in vlechtkunst.",
    cover: u("photo-1558551649-e44c8f992010"),
  },
  {
    slug: "arnhem",
    name: "Arnhem",
    tagline: "Bossen, mode, en heel veel haarliefde.",
    cover: u("photo-1518391846015-55a9cc003b25"),
  },
  {
    slug: "den-haag",
    name: "Den Haag",
    tagline: "Aan zee, dichtbij de koningin van je kroon.",
    cover: u("photo-1502323777036-f29e3972d82f"),
  },
];

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);

export const styleCategories = [
  { name: "Knotless", photo: u("photo-1531123897727-8f129e1688ce", 400) },
  { name: "Boho Braids", photo: u("photo-1524504388940-b1c1722653e1", 400) },
  { name: "Fulani", photo: u("photo-1605497788044-5a32c7078486", 400) },
  { name: "Box Braids", photo: u("photo-1487412720507-e7ab37603c6f", 400) },
  { name: "Locs", photo: u("photo-1517841905240-472988babdf9", 400) },
];
