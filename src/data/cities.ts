export type City = {
  slug: string;
  name: string;
  cover: string;
  tagline: string;
};

const u = (id: string, w = 1200) =>
  `https://images.pexels.com/photos/37115258/pexels-photo-37115258.jpeg`;

export const cities: City[] = [
  {
    slug: "amsterdam",
    name: "Amsterdam",
    tagline: "De meest trendy braids en strakke lines, geïnspireerd op de non-stop energie van Dammie.",
    cover: u("https://pixabay.com/images/download/3345557-amsterdam-6393230_1920.jpg"),
  },
  {
    slug: "rotterdam",
    name: "Rotterdam",
    tagline: " Strakke braids, gedurfde styles en pure kwaliteit met de rauwe energie van Rotterdam.",
    cover: u("https://pixabay.com/images/download/derooijfotografie-rotterdam-4152380_1920.jpg"),
  },
  {
    slug: "utrecht",
    name: "Utrecht",
    tagline: "Jouw go-to plek in het hart van de Domstad voor flawless braids en fresh styles.",
    cover: u("https://pixabay.com/images/download/7162046-utrecht-4586602_1920.jpg"),
  },
  {
    slug: "arnhem",
    name: "Arnhem",
    tagline: "Creatieve designs en perfecte braids, midden in de modestad van het oosten.",
    cover: u("https://pixabay.com/images/download/jabpaul43-bridge-5368820_1920.jpg"),
  },
  {
    slug: "den-haag",
    name: "Den Haag",
    tagline: "Royal treatment en premium braids met de stijlvolle vibe van de Haagse regio.",
    cover: u("https://pixabay.com/images/download/jsh5190-night-4047217_1920.jpg"),
  },
];

export const getCity = (slug: string) => cities.find((c) => c.slug === slug);

export const styleCategories = [
  { name: "Knotless", photo: u("https://images.pexels.com/photos/7607808/pexels-photo-7607808.jpeg", 400) },
  { name: "Boho Braids", photo: u("https://images.pexels.com/photos/28383173/pexels-photo-28383173.jpeg", 400) },
  { name: "Fulani", photo: u("https://images.pexels.com/photos/29496369/pexels-photo-29496369.jpeg", 400) },
  { name: "Box Braids", photo: u("https://images.pexels.com/photos/7190007/pexels-photo-7190007.jpeg", 400) },
  { name: "Locs", photo: u("https://images.pexels.com/photos/37010087/pexels-photo-37010087.jpeg", 400) },
];
