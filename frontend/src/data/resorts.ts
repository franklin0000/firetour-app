export interface ResortInfo {
  slug: string;
  name: string;
  zone: string;
  image: string;
  pickupTimeSaona: string;
  pickupTimeBuggies: string;
  pickupTimeParasail: string;
  hotelLobbyPriceSaona: number;
  hotelLobbyPriceBuggies: number;
  hotelLobbyPriceParasail: number;
  meetingPoint: string;
  distanceToAirport: string;
  highlights: string[];
  faqs: { q: string; a: string }[];
}

export const RESORTS_DATA: ResortInfo[] = [
  {
    slug: 'hard-rock-hotel-punta-cana',
    name: 'Hard Rock Hotel & Casino Punta Cana',
    zone: 'Macao / Playa Bávaro',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:20 AM',
    pickupTimeBuggies: '08:15 AM / 01:30 PM',
    pickupTimeParasail: '09:15 AM / 02:00 PM',
    hotelLobbyPriceSaona: 165,
    hotelLobbyPriceBuggies: 110,
    hotelLobbyPriceParasail: 130,
    meetingPoint: 'Lobby Principal o Caseta de Seguridad (Acceso Boulevard)',
    distanceToAirport: '30 min',
    highlights: [
      'Recogida en minivan/autobús con aire acondicionado directo en el lobby',
      'Ahorra hasta $86 USD por persona comparado con el desk de turismo del hotel',
      'Sin intermediarios: confirmación inmediata con voucher digital oficial',
      'Cancelación 100% gratuita con hasta 24 horas de antelación'
    ],
    faqs: [
      {
        q: '¿Dónde me recoge el transporte dentro del Hard Rock Hotel?',
        a: 'Nuestro chofer debidamente identificado con cartel de Fire Tour DR te espera en el Lobby Principal o en la salida designada de transporte turístico a la hora acordada.'
      },
      {
        q: '¿Por qué el precio es mucho menor que el del lobby del resort?',
        a: 'Los mostradores del hotel cobran altas comisiones de intermediación de hasta un 50%. En Fire Tour DR somos operadores directos locales, transfiriéndote todo el ahorro sin sacrificar calidad ni seguridad.'
      },
      {
        q: '¿Nos llevan de vuelta al Hard Rock Hotel al finalizar el tour?',
        a: '¡Sí, absolutamente! Todas nuestras excursiones incluyen transporte redondo (ida y vuelta garantizada a tu resort).'
      }
    ]
  },
  {
    slug: 'riu-republica',
    name: 'Hotel Riu Republica (Adults Only)',
    zone: 'Arena Gorda, Punta Cana',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:15 AM',
    pickupTimeBuggies: '08:10 AM / 01:25 PM',
    pickupTimeParasail: '09:00 AM / 02:00 PM',
    hotelLobbyPriceSaona: 160,
    hotelLobbyPriceBuggies: 105,
    hotelLobbyPriceParasail: 125,
    meetingPoint: 'Lobby Principal de Riu Republica',
    distanceToAirport: '28 min',
    highlights: [
      'Punto de partida ideal para aventureros y grupos en Riu Republica',
      'Precios directos sin sobreprecio de agencia hotelera',
      'Salida express con traslados puntuales y guías certificados bilingües',
      '¡Promoción de grupo activa: En grupos de 6 personas, la 6ta va gratis!'
    ],
    faqs: [
      {
        q: '¿A qué hora pasa el autobús por Riu Republica para Isla Saona?',
        a: 'La recogida en el lobby de Riu Republica para Isla Saona VIP es a las 07:15 AM. Recomendamos estar listos 10 minutos antes.'
      },
      {
        q: '¿Puedo reservar solo pagando el depósito?',
        a: 'Sí, aseguras tu plaza hoy con solo $25 USD de depósito y pagas el saldo restante en efectivo el día del tour.'
      }
    ]
  },
  {
    slug: 'riu-palace-punta-cana',
    name: 'Hotel Riu Palace Punta Cana & Riu Bambu',
    zone: 'Playa de Arena Gorda, Punta Cana',
    image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:15 AM',
    pickupTimeBuggies: '08:10 AM / 01:25 PM',
    pickupTimeParasail: '09:05 AM / 02:05 PM',
    hotelLobbyPriceSaona: 160,
    hotelLobbyPriceBuggies: 105,
    hotelLobbyPriceParasail: 125,
    meetingPoint: 'Lobby Principal del Complejo Riu',
    distanceToAirport: '26 min',
    highlights: [
      'Recogida en todos los hoteles del complejo: Riu Palace, Riu Bambu y Riu Naiboa',
      'Descuento especial para familias con niños (-40% OFF en menores)',
      'Flota moderna de transportes climatizados con rastreo GPS',
      'Atención 24/7 vía WhatsApp en español, inglés y francés'
    ],
    faqs: [
      {
        q: '¿Recogen en Riu Bambu o Riu Palace Macao?',
        a: 'Sí, cubrimos todos los lobbies del complejo Riu. Indícanos tu lobby específico y habitación en el checkout.'
      }
    ]
  },
  {
    slug: 'barcelo-bavaro-palace',
    name: 'Barceló Bávaro Palace & Grand Resort',
    zone: 'Playa Bávaro, Punta Cana',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:35 AM',
    pickupTimeBuggies: '08:30 AM / 01:45 PM',
    pickupTimeParasail: '09:20 AM / 02:20 PM',
    hotelLobbyPriceSaona: 170,
    hotelLobbyPriceBuggies: 115,
    hotelLobbyPriceParasail: 135,
    meetingPoint: 'Lobby Principal Barceló Palace / Lobby Barceló Beach',
    distanceToAirport: '18 min',
    highlights: [
      'Ubicación privilegiada con tiempos de traslado reducidos',
      'Ahorra más de $90 USD por boleto frente al stand turístico del resort',
      'Equipos de máxima seguridad para Parasailing y Buggies Macao',
      'Catamarán exclusivo con barra libre y almuerzo buffet en Isla Saona'
    ],
    faqs: [
      {
        q: '¿A qué hora nos recogen en el Barceló Bávaro?',
        a: 'Para Isla Saona a las 07:35 AM, y para Buggies a las 08:30 AM (turno mañana) o 01:45 PM (turno tarde).'
      }
    ]
  },
  {
    slug: 'grand-palladium-punta-cana',
    name: 'Grand Palladium Punta Cana Resort & Spa',
    zone: 'Playa El Cortecito, Bávaro',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:30 AM',
    pickupTimeBuggies: '08:25 AM / 01:40 PM',
    pickupTimeParasail: '09:15 AM / 02:15 PM',
    hotelLobbyPriceSaona: 165,
    hotelLobbyPriceBuggies: 110,
    hotelLobbyPriceParasail: 130,
    meetingPoint: 'Lobby Principal Bavaro, Palace o Punta Cana',
    distanceToAirport: '22 min',
    highlights: [
      'Cobertura total para Grand Palladium Bávaro, Punta Cana, Palace y TRS Turquesa',
      'Guías certificados del Ministerio de Turismo de República Dominicana',
      'Fotos profesionales y recuerdos inolvidables incluidos o accesibles',
      'Seguro de accidentes y asistencia al viajero en todas las rutas'
    ],
    faqs: [
      {
        q: '¿Nos recogen si estamos hospedados en TRS Turquesa?',
        a: 'Sí, el transporte recoge directamente en el lobby exclusivo de TRS Turquesa sin coste adicional.'
      }
    ]
  },
  {
    slug: 'bahia-principe-bavaro',
    name: 'Gran Bahía Príncipe Bávaro Resort',
    zone: 'Playa de Arena Gorda, Bávaro',
    image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:20 AM',
    pickupTimeBuggies: '08:15 AM / 01:30 PM',
    pickupTimeParasail: '09:10 AM / 02:10 PM',
    hotelLobbyPriceSaona: 160,
    hotelLobbyPriceBuggies: 105,
    hotelLobbyPriceParasail: 125,
    meetingPoint: 'Lobby Principal de tu Bahía Príncipe asignado (Ambar, Fantasia, Bavaro, Punta Cana)',
    distanceToAirport: '25 min',
    highlights: [
      'Recogida en cualquier sección: Fantasia, Ambar, Aquamarine, Turquesa o Punta Cana',
      'Excelente relación calidad-precio con precios directos garantizados',
      'Descuentos para familias y grupos grandes',
      'Atención rápida por WhatsApp antes y durante tu excursión'
    ],
    faqs: [
      {
        q: '¿Cómo coordinamos en qué lobby de Bahía Príncipe nos buscan?',
        a: 'Al reservar, solo indica en la casilla de hotel la sección en la que te hospedas (ej. Bahía Príncipe Fantasia o Ambar) y nuestro chofer irá directo a ese lobby.'
      }
    ]
  },
  {
    slug: 'iberostar-grand-bavaro',
    name: 'Iberostar Selection Bávaro & Grand Bávaro',
    zone: 'Playa Bávaro, Punta Cana',
    image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:25 AM',
    pickupTimeBuggies: '08:20 AM / 01:35 PM',
    pickupTimeParasail: '09:15 AM / 02:15 PM',
    hotelLobbyPriceSaona: 170,
    hotelLobbyPriceBuggies: 110,
    hotelLobbyPriceParasail: 135,
    meetingPoint: 'Lobby Principal de Iberostar Bávaro / Iberostar Punta Cana',
    distanceToAirport: '24 min',
    highlights: [
      'Servicio VIP de alta puntualidad para huéspedes Iberostar',
      'Guías amables multilingües con amplia experiencia',
      'Transportes desinfectados, cómodos y con WiFi a bordo',
      'Piscina natural con estrellas de mar y barra libre en catamarán'
    ],
    faqs: [
      {
        q: '¿Qué incluye la excursión de Isla Saona VIP desde Iberostar?',
        a: 'Incluye transporte ida y vuelta, lancha rápida, catamarán con animación y baile, visita a la Piscina Natural de estrellas de mar, almuerzo buffet en la isla y bebidas nacionales ilimitadas.'
      }
    ]
  },
  {
    slug: 'secrets-royal-beach',
    name: 'Secrets Royal Beach & Dreams Royal Beach',
    zone: 'Playa Bávaro, Punta Cana',
    image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:40 AM',
    pickupTimeBuggies: '08:35 AM / 01:45 PM',
    pickupTimeParasail: '09:25 AM / 02:20 PM',
    hotelLobbyPriceSaona: 175,
    hotelLobbyPriceBuggies: 115,
    hotelLobbyPriceParasail: 140,
    meetingPoint: 'Lobby Principal Secrets Royal Beach',
    distanceToAirport: '19 min',
    highlights: [
      'Punto de recogida céntrico con menor tiempo de espera',
      'Ahorro del 50% frente a la lista de precios oficial del resort',
      'Atención personalizada para parejas y lunas de miel',
      'Tickets digitales en tu teléfono móvil al instante'
    ],
    faqs: [
      {
        q: '¿Los tours son aptos para parejas en Secrets Royal Beach?',
        a: '¡Por supuesto! Tanto Isla Saona VIP como el Parasailing sobre el mar turquesa son las excursiones favoritas para parejas.'
      }
    ]
  },
  {
    slug: 'lopesan-costa-bavaro',
    name: 'Lopesan Costa Bávaro Resort, Spa & Casino',
    zone: 'Playa Bávaro, Punta Cana',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:40 AM',
    pickupTimeBuggies: '08:35 AM / 01:45 PM',
    pickupTimeParasail: '09:25 AM / 02:25 PM',
    hotelLobbyPriceSaona: 175,
    hotelLobbyPriceBuggies: 115,
    hotelLobbyPriceParasail: 140,
    meetingPoint: 'Lobby The Boulevard / Entrada Principal Lopesan',
    distanceToAirport: '18 min',
    highlights: [
      'Recogida puntual en el imponente lobby de Lopesan Costa Bávaro',
      'Vehículos modernos con aire acondicionado de alta potencia',
      'Tarifas justas sin comisiones ocultas',
      'Garantía de satisfacción y pago seguro certificado por Stripe'
    ],
    faqs: [
      {
        q: '¿Dónde nos busca el conductor en Lopesan?',
        a: 'En la rotonda del Lobby Principal frente a la fuente de recepción, con tu nombre y el logo de Fire Tour DR.'
      }
    ]
  },
  {
    slug: 'dreams-onyx-punta-cana',
    name: 'Dreams Onyx Resort & Spa & Breathless',
    zone: 'Uvero Alto, Punta Cana',
    image: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:00 AM',
    pickupTimeBuggies: '08:00 AM / 01:15 PM',
    pickupTimeParasail: '08:50 AM / 01:50 PM',
    hotelLobbyPriceSaona: 175,
    hotelLobbyPriceBuggies: 115,
    hotelLobbyPriceParasail: 140,
    meetingPoint: 'Lobby Principal Dreams Onyx / Breathless Punta Cana',
    distanceToAirport: '38 min',
    highlights: [
      'Transporte garantizado desde la zona de Uvero Alto sin recargo excesivo',
      'Acceso privilegiado al circuito exclusivo de Buggies en Playa Macao (¡muy cerca de ti!)',
      'Conductores experimentados por autovía del coral',
      'Descuentos automáticos para grupos y familias'
    ],
    faqs: [
      {
        q: '¿Uvero Alto queda lejos para la excursión de Buggies?',
        a: '¡Al contrario! Desde Dreams Onyx en Uvero Alto estás a solo 15-20 minutos del rancho de Buggies en Macao, por lo que es la excursión más rápida y cómoda.'
      }
    ]
  },
  {
    slug: 'majestic-elegance-punta-cana',
    name: 'Majestic Elegance, Colonial & Mirage Punta Cana',
    zone: 'Arena Gorda, Bávaro',
    image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:15 AM',
    pickupTimeBuggies: '08:10 AM / 01:25 PM',
    pickupTimeParasail: '09:05 AM / 02:05 PM',
    hotelLobbyPriceSaona: 165,
    hotelLobbyPriceBuggies: 110,
    hotelLobbyPriceParasail: 130,
    meetingPoint: 'Lobby Principal de tu Majestic asignado (Elegance, Colonial o Mirage)',
    distanceToAirport: '27 min',
    highlights: [
      'Servicio para los 3 hoteles de la cadena Majestic',
      'Recogida en minivan privada o autobús turístico de primera clase',
      'Ahorra hasta $85 USD por persona en Isla Saona',
      'Cancelación flexible si tu vuelo o planes cambian'
    ],
    faqs: [
      {
        q: '¿Nos buscan en el Majestic Mirage Club?',
        a: 'Sí, pasamos por el lobby del Majestic Mirage Club y los lobbies de Colonial y Elegance sin inconvenientes.'
      }
    ]
  },
  {
    slug: 'hyatt-ziva-cap-cana',
    name: 'Hyatt Ziva & Zilara Cap Cana',
    zone: 'Cap Cana Marina, Punta Cana',
    image: 'https://images.unsplash.com/photo-1580977276076-ae4b8c219b8e?auto=format&fit=crop&w=1200&q=80',
    pickupTimeSaona: '07:45 AM',
    pickupTimeBuggies: '08:45 AM / 01:50 PM',
    pickupTimeParasail: '09:30 AM / 02:30 PM',
    hotelLobbyPriceSaona: 185,
    hotelLobbyPriceBuggies: 125,
    hotelLobbyPriceParasail: 150,
    meetingPoint: 'Lobby Principal Hyatt Ziva / Zilara Cap Cana',
    distanceToAirport: '15 min',
    highlights: [
      'Ubicación exclusiva en Cap Cana con rápido acceso hacia Bayahíbe (Isla Saona)',
      'Ahorro de más de $100 USD por persona frente a las tarifas de Cap Cana concierge',
      'Servicio de alta calidad y guías bilingües con credenciales oficiales',
      'Incluye bebidas, refrigerios y todo el equipamiento de seguridad'
    ],
    faqs: [
      {
        q: '¿El transporte puede ingresar al portón de seguridad de Cap Cana?',
        a: 'Sí, nuestros choferes cuentan con permisos turísticos autorizados para ingresar por la garita de seguridad de Cap Cana hasta el lobby de Hyatt.'
      }
    ]
  }
];

export const getResortBySlug = (slug: string): ResortInfo | undefined => {
  return RESORTS_DATA.find(r => r.slug.toLowerCase() === slug.toLowerCase());
};
