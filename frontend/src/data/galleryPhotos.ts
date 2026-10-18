export interface GalleryPhoto {
  id: string;
  url: string;
  title: string;
  location: string;
  tag: 'playas' | 'saona' | 'aventura' | 'cultura' | 'relax';
}

export const REAL_GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "g1",
    url: "/gallery/facebook_1792088865961.jpg",
    title: "Palmeras infinitas y arena blanca virgen",
    location: "Isla Saona, Parque Nacional Cotubanamá",
    tag: "saona"
  },
  {
    id: "g2",
    url: "/gallery/facebook_1791837976637.jpg",
    title: "Aguas turquesas transparentes en la costa caribeña",
    location: "Playa Bávaro, Punta Cana",
    tag: "playas"
  },
  {
    id: "g3",
    url: "/gallery/facebook_1792088108970.jpg",
    title: "Momentos inolvidables entre amigos bajo el sol caribeño",
    location: "Catamarán VIP hacia Saona",
    tag: "saona"
  },
  {
    id: "g4",
    url: "/gallery/facebook_1792088950614.jpg",
    title: "Relax total en hamacas frente a la brisa marina",
    location: "Playa Privada Fire Tour, Saona",
    tag: "relax"
  },
  {
    id: "g5",
    url: "/gallery/facebook_1791838610500.jpg",
    title: "Costa tropical y palmerales vírgenes de La Altagracia",
    location: "Playa Macao, Punta Cana",
    tag: "playas"
  },
  {
    id: "g6",
    url: "/gallery/facebook_1792088042689.jpg",
    title: "Descanso en las palmeras icónicas de la playa",
    location: "Canto de la Playa, Saona",
    tag: "relax"
  },
  {
    id: "g7",
    url: "/gallery/facebook_1791838590171.jpg",
    title: "Piscina natural con aguas cálidas y estrellas de mar",
    location: "Piscina Natural de Bayahíbe",
    tag: "saona"
  },
  {
    id: "g8",
    url: "/gallery/facebook_1791838696169.jpg",
    title: "Aventura y adrenalina off-road en rutas selváticas",
    location: "Ruta 4x4 Macao",
    tag: "aventura"
  },
  {
    id: "g9",
    url: "/gallery/facebook_1792088198310.jpg",
    title: "Panorámica de postal caribeña desde el mar",
    location: "Costa de Punta Cana",
    tag: "playas"
  },
  {
    id: "g10",
    url: "/gallery/facebook_1792088848136.jpg",
    title: "Cielo despejado y brisa marina en altamar",
    location: "Travesía en Catamarán a vela",
    tag: "saona"
  },
  {
    id: "g11",
    url: "/gallery/facebook_1792088855610.jpg",
    title: "Naturaleza intacta y bosque tropical caribeño",
    location: "Parque Ecológico Ojos Indígenas",
    tag: "cultura"
  },
  {
    id: "g12",
    url: "/gallery/facebook_1791838053618.jpg",
    title: "Sonrisas y buena vibra en la excursión",
    location: "Isla Saona",
    tag: "relax"
  },
  {
    id: "g13",
    url: "/gallery/facebook_1791838085109.jpg",
    title: "Aguas cristalinas poco profundas para bañarse",
    location: "Playa Juanillo, Cap Cana",
    tag: "playas"
  },
  {
    id: "g14",
    url: "/gallery/facebook_1792088679530.jpg",
    title: "Aventura en cenotes subterráneos de agua dulce",
    location: "Cueva Taina Macao",
    tag: "aventura"
  },
  {
    id: "g15",
    url: "/gallery/facebook_1791838547646.jpg",
    title: "Tradición y sabor dominicano en los ranchos",
    location: "Higüey, La Altagracia",
    tag: "cultura"
  },
  {
    id: "g16",
    url: "/gallery/facebook_1791838585042.jpg",
    title: "La verdadera esencia del paraíso caribeño",
    location: "Punta Cana, República Dominicana",
    tag: "playas"
  }
];
