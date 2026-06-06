export type BlogPost = {
  slug: string;
  title: string;
  tag: string;
  readTime: string;
  image: string;
  excerpt: string;
  body: string[];
};

const u = (id: string, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

export const blogPosts: BlogPost[] = [
  {
    slug: "avoid-traction-alopecia",
    title: "How to avoid traction alopecia",
    tag: "Guide",
    readTime: "5 min read",
    image: u("photo-1531123897727-8f129e1688ce"),
    excerpt:
      "Strakke vlechten zien er prachtig uit — maar te strak kan je haarlijn beschadigen. Zo bescherm je je edges.",
    body: [
      "Traction alopecia is haaruitval die ontstaat door langdurige spanning op de haarwortel. Bij vlechten is dit één van de meest voorkomende oorzaken van een terugwijkende haarlijn.",
      "Een goede vlechter herken je aan haar geduld: ze trekt je haar nooit zo strak dat je tranen in je ogen krijgt. Voelt het de eerste nacht alsof je hoofdhuid in brand staat? Dan zit het te strak.",
      "Geef je haar minimaal twee weken rust tussen protective styles, gebruik een lichte olie op je edges en kies voor knotless of feed-in technieken als je gevoelig bent.",
    ],
  },
  {
    slug: "best-styles-4c-summer",
    title: "Best styles for 4C hair in summer",
    tag: "Tips",
    readTime: "7 min read",
    image: u("photo-1594744803329-e58b31de8bf5"),
    excerpt:
      "Van boho knotless tot Fulani — dit zijn de styles die je 4C krullen koel en gehydrateerd houden.",
    body: [
      "Zomer in Nederland kan onvoorspelbaar zijn — de ene dag 30 graden, de volgende plensbuien. Voor 4C haar betekent dat: kies een style die mee kan met de vochtigheid.",
      "Boho knotless braids zijn dit seizoen overal. Ze zijn licht, ademend en geven je krullen ruimte. Goddess locs zijn ideaal als je iets langer wil meegaan zonder veel onderhoud.",
      "Vergeet niet om je hoofdhuid wekelijks te verzorgen met een lichte oil en een satin scarf 's nachts — ook met vlechten.",
    ],
  },
  {
    slug: "moving-find-new-braider",
    title: "Verhuisd? Vind snel een nieuwe vlechter",
    tag: "Moving",
    readTime: "6 min read",
    image: u("photo-1605497788044-5a32c7078486"),
    excerpt:
      "Een nieuwe stad betekent ook een nieuwe vlechter zoeken. Dit is hoe je sneller iemand vindt die je vertrouwt.",
    body: [
      "Verhuizen is stressvol genoeg — een nieuwe vlechter zoeken hoort daar eigenlijk niet bij. Toch is het één van de eerste dingen waar veel vrouwen tegenaan lopen.",
      "Begin met lokale community-groepen en kijk daarna gericht in onze directory per stad. Bekijk altijd echte foto's van klanten, niet alleen geposeerde Instagram shots.",
      "Boek je eerste afspraak voor een kleinere style — bijvoorbeeld cornrows of een mini install — voordat je een 8-uurs knotless laat doen. Zo weet je of haar techniek bij je past.",
    ],
  },
];

export const getBlogPost = (slug: string) =>
  blogPosts.find((p) => p.slug === slug);
