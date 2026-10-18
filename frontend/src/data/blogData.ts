export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  content: {
    introduction: string;
    sections: {
      heading: string;
      body: string[];
      tip?: string;
    }[];
    conclusion: string;
    keyTakeaways: string[];
  };
  relatedTourId?: number;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "guia-completa-isla-saona-punta-cana",
    title: "Guía Definitiva para Visitar Isla Saona: Qué Llevar, Horarios y Consejos de Expertos",
    excerpt: "Descubre todo lo que necesitas saber antes de embarcarte hacia la joya caribeña de República Dominicana: piscinas naturales, catamaranes, almuerzo buffet y tips locales.",
    category: "Guías de Destino",
    date: "12 de Octubre de 2024",
    readTime: "7 min de lectura",
    author: {
      name: "Manuel Rosario",
      role: "Guía Certificado en La Altagracia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80",
    relatedTourId: 1,
    content: {
      introduction: "Isla Saona es, sin duda, la excursión más codiciada por cualquier viajero que aterriza en Punta Cana. Perteneciente al Parque Nacional Cotubanamá, este santuario de arena blanca impoluta, cocoteros inclinados y aguas turquesas que parecen una piscina infinita representa la postal caribeña por excelencia. Sin embargo, no todas las experiencias son iguales: la diferencia entre un día caótico y una jornada inolvidable radica en conocer los detalles logísticos.",
      sections: [
        {
          heading: "1. ¿Cómo es el trayecto y la dinámica combinada?",
          body: [
            "La mayoría de las excursiones premium operan bajo la modalidad combinada: salida en catamarán espacioso a vela con música, animación y barra libre nacional, y retorno en lancha rápida (o viceversa). Esta combinación ofrece lo mejor de ambos mundos: relajación y fiesta en alta mar al inicio, y rapidez y emoción para regresar a tierra firme sin fatiga.",
            "El punto de embarque se ubica en Bayahíbe, un pintoresco pueblo de pescadores a aproximadamente 50 minutos por autovía desde los hoteles de Bávaro y Punta Cana."
          ],
          tip: "Si eres propenso al mareo, toma una pastilla antimareo 30 minutos antes de subir a la lancha en Bayahíbe y ubícate siempre en el tercio trasero de la embarcación donde el oleaje se siente menos."
        },
        {
          heading: "2. La parada mágica: La Piscina Natural y las Estrellas de Mar",
          body: [
            "En medio de la travesía se hace una parada legendaria en el banco de arena de la Piscina Natural. El agua apenas llega a la cintura a más de 400 metros de la costa.",
            "Aquí podrás brindar con ron dominicano en el agua y admirar las gigantescas estrellas de mar (Oreaster reticulatus). Recuerda una regla de oro de conservación ambiental: jamás saques a las estrellas fuera del agua, ya que respiran por su dermis y pueden asfixiarse en cuestión de segundos."
          ]
        },
        {
          heading: "3. ¿Qué empacar en tu mochila para Saona?",
          body: [
            "Protector solar biodegradable o 'Reef Safe': vital para proteger los arrecifes de coral y tu piel del intenso sol caribeño.",
            "Funda impermeable para teléfono móvil: imprescindible para tomar fotos dentro de la Piscina Natural sin riesgo de mojaduras.",
            "Toalla de microfibra: se seca rápido y ocupa poco espacio en la mochila.",
            "Efectivo en dólares o pesos dominicanos (billetes pequeños): útil para masajes en la playa, cocos frescos o artesanías locales en el poblado de Mano Juan."
          ],
          tip: "Lleva gafas de sol polarizadas; el reflejo del sol sobre la arena blanca de Saona es extremadamente brillante."
        },
        {
          heading: "4. Almuerzo y tiempo libre en la playa",
          body: [
            "En la playa privada se sirve un almuerzo típico dominicano que suele incluir pollo a la leña, pescado fresco, arroz con gandules (moro), plátanos maduros, pastas y ensaladas frescas tropicales.",
            "Aprovecha las 2.5 a 3 horas de playa para caminar lejos del tumulto del muelle, donde encontrarás tramos de playa completamente vírgenes para fotografías de ensueño."
          ]
        }
      ],
      conclusion: "Isla Saona no es solo un destino; es una experiencia sensorial completa. Reservar con operadores oficiales que garanticen capitanes certificados y embarcaciones con chalecos salvavidas reglamentarios es la mejor decisión para disfrutar de uno de los tesoros naturales más deslumbrantes del planeta.",
      keyTakeaways: [
        "Duración aproximada: de 7:30 AM a 6:00 PM (día completo con traslados incluidos).",
        "Incluye: barra libre nacional, almuerzo buffet dominicano y parada en la Piscina Natural.",
        "Reserva con al menos 48 horas de antelación para asegurar cupos en catamaranes de primera categoría."
      ]
    }
  },
  {
    slug: "buggies-macao-punta-cana-consejos-seguridad",
    title: "Buggies 4x4 en Playa Macao: Ruta Off-Road, Cueva Taina y Consejos de Seguridad",
    excerpt: "Guía práctica para vivir la mayor dosis de adrenalina en Punta Cana sin sorpresas: ropa adecuada, cenotes subterráneos, qué esperar del barro y cómo protegerte.",
    category: "Aventura y Adrenalina",
    date: "08 de Octubre de 2024",
    readTime: "5 min de lectura",
    author: {
      name: "Carlos Méndez",
      role: "Instructor de Deportes de Motor",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    relatedTourId: 2,
    content: {
      introduction: "Si estás cansado de estar tumbado en la tumbona del hotel y buscas liberar adrenalina pura, el tour en Buggies 4x4 o Four Wheels por los caminos rurales de Macao es la elección número uno en Punta Cana. Cruzarás plantaciones tropicales, senderos rocosos llenos de lodo y terminarás sumergiéndote en un cenote de agua dulce cristalina dentro de una cueva milenaria.",
      sections: [
        {
          heading: "1. ¿Qué tipo de vehículo elegir: Buggy vs. Four Wheel (Cuatrimoto)?",
          body: [
            "Buggy (Side-by-Side): Diseñado para 2 a 4 pasajeros, cuenta con jaula antivuelco, volante tradicional y cinturones de seguridad. Es ideal para parejas o familias que buscan estabilidad y mayor protección.",
            "Four Wheel (ATV / Cuatrimoto): Se conduce con manillar de motocicleta. Ofrece una sensación más ágil y deportiva, pero requiere mayor fuerza física para maniobrar en baches profundos de barro."
          ],
          tip: "Si viajas con niños o personas mayores, el Buggy techado es infinitamente más cómodo y seguro."
        },
        {
          heading: "2. El Cenote Cueva Taina: Un chapuzón celestial",
          body: [
            "A mitad del trayecto se hace una parada en una cueva subterránea de piedra caliza con un manantial de agua pura a temperatura constante (alrededor de 23°C).",
            "Después de tragar polvo y llenarte de lodo en los caminos de tierra, zambullirte en estas aguas diáfanas rodeado de estalactitas es un alivio inigualable."
          ]
        },
        {
          heading: "3. Código de vestimenta: Qué llevar (y qué NO llevar)",
          body: [
            "Lleva ropa que no te importe manchar para siempre: El barro rojo de Macao contiene minerales que tiñen prendas claras de forma irreversible.",
            "Pañuelo tubular (Bandana) y gafas de sol: Obligatorios para evitar que el polvo y el lodo salpicado entren en los ojos y boca.",
            "Zapatillas cerradas o calzado de agua (aqua shoes): Prohibido usar chanclas sueltas o flip-flops porque se pierden con facilidad en el lodo."
          ]
        },
        {
          heading: "4. Degustación cultural: Café, Cacao y Mamajuana",
          body: [
            "La ruta incluye una parada en un rancho típico campesino donde podrás ver el proceso artesanal de tueste de granos de café caracolillo, pasta pura de cacao orgánico y la tradicional bebida dominicana: la Mamajuana (mezcla de hierbas aromáticas, ron, vino tinto y miel)."
          ]
        }
      ],
      conclusion: "El tour de buggies en Macao combina cultura rural dominicana, paisajes costeros indómitos y emoción a raudales. Con la indumentaria adecuada y siguiendo las instrucciones de los guías del convoy, se convertirá en una de las anécdotas más divertidas de tus vacaciones.",
      keyTakeaways: [
        "Duración del circuito: unas 4 horas incluyendo traslados desde el hotel.",
        "Turnos diarios disponibles: mañana (8:00 AM) y tarde (1:30 PM).",
        "Edad mínima para conducir: 18 años con licencia de conducir física o digital."
      ]
    }
  },
  {
    slug: "traslados-aeropuerto-punta-cana-puj-consejos",
    title: "Cómo Moverte desde el Aeropuerto de Punta Cana (PUJ) a tu Hotel sin Pagar de Más",
    excerpt: "Todo sobre el transporte en el aeropuerto más concurrido del Caribe: traslados privados vs taxis de terminal, estafas habituales y cómo asegurar tu bienvenida sin estrés.",
    category: "Transporte y Logística",
    date: "04 de Octubre de 2024",
    readTime: "6 min de lectura",
    author: {
      name: "Laura De León",
      role: "Especialista en Operaciones Turísticas",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80",
    relatedTourId: 4,
    content: {
      introduction: "El Aeropuerto Internacional de Punta Cana (PUJ) es famoso por su arquitectura tropical con techos de palmas de cana, pero también por el caos que puede suponer salir de la terminal si no tienes tu transporte previamente organizado. Decenas de taxistas informales y vendedores abordan al visitante a la salida de aduanas, a menudo cobrando tarifas desorbitadas de hasta $80 o $100 USD por distancias cortas.",
      sections: [
        {
          heading: "1. ¿Por qué reservar un traslado privado antes de volar?",
          body: [
            "Al reservar con antelación con Fire Tour DR, un chófer profesional te espera en la puerta de arribos con un cartel con tu nombre o código de reserva.",
            "No esperas a que se llene un autobús compartido con 15 paradas en otros hoteles antes del tuyo: vas directo en una furgoneta climatizada y moderna a tu lobby."
          ],
          tip: "Si tu vuelo se retrasa, monitoreamos tu número de vuelo en tiempo real para que tu chófer esté puntual sin cargos extras por demora."
        },
        {
          heading: "2. Tiempos aproximados desde el Aeropuerto PUJ a las principales zonas hoteleras",
          body: [
            "Cap Cana: 10 a 15 minutos (la zona más cercana y exclusiva).",
            "Punta Cana / Cabeza de Toro: 15 a 20 minutos.",
            "Bávaro y El Cortecito: 25 a 35 minutos.",
            "Arena Gorda y Macao: 35 a 45 minutos.",
            "Uvero Alto (Dreams Onyx, Nickelodeon, Excellence, etc.): 50 a 60 minutos por la Autopista del Coral."
          ]
        },
        {
          heading: "3. ¿Uber funciona en el Aeropuerto de Punta Cana?",
          body: [
            "Aunque Uber opera en la República Dominicana, los conductores de aplicaciones tienen restricciones severas de acceso impuestas por los sindicatos de taxis de la terminal.",
            "Con frecuencia, los conductores de Uber no pueden ingresar hasta la acera de llegadas, obligando a los pasajeros a arrastrar maletas pesadas bajo el sol hasta la vía principal fuera del recinto aeroportuario."
          ]
        }
      ],
      conclusion: "Comenzar tus vacaciones relajado y seguro no tiene precio. Programar tu traslado privado con confirmación digital garantiza un precio cerrado y transparente, sin regateos ni esperas innecesarias tras un largo vuelo internacional.",
      keyTakeaways: [
        "Tarifa fija garantizada sin sobrecostos por equipaje o peajes.",
        "Vehículos con aire acondicionado de alta potencia y chóferes acreditados.",
        "Monitoreo continuo de vuelos para adaptarse a cualquier imprevisto de aerolínea."
      ]
    }
  },
  {
    slug: "clima-punta-cana-mejor-epoca-viajar-sargazo",
    title: "El Clima en Punta Cana y la Mejor Época para Viajar: Sol, Lluvias y Estado del Mar",
    excerpt: "Analizamos mes a mes las temperaturas, las temporadas de lluvia tropical y cómo planificar tus excursiones para garantizar días radiantes de playa y navegación.",
    category: "Consejos de Viaje",
    date: "28 de Septiembre de 2024",
    readTime: "6 min de lectura",
    author: {
      name: "Manuel Rosario",
      role: "Guía Certificado en La Altagracia",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    content: {
      introduction: "La República Dominicana goza de un clima tropical cálido durante los doce meses del año, con temperaturas medias que oscilan entre los 25°C y 31°C. Sin embargo, factores como la brisa marina, los aguaceros vespertinos y las corrientes marinas cambian sensiblemente según el mes del año.",
      sections: [
        {
          heading: "1. Temporada Alta y Seca (Diciembre a Abril)",
          body: [
            "Es considerada la mejor época climatológica. La humedad es menor, las noches son agradablemente frescas (unos 21°C) y las precipitaciones son sumamente escasas.",
            "El mar suele estar en calma absoluta, lo que hace que los paseos en catamarán y el parasailing tengan visibilidad estelar."
          ]
        },
        {
          heading: "2. Temporada de Verano (Mayo a Agosto)",
          body: [
            "Los días son más largos y cálidos (31°C - 33°C). El agua del Caribe alcanza temperaturas de hasta 28°C, perfectas para nadar durante horas.",
            "Aunque pueden ocurrir chaparrones tropicales repentinos, suelen durar entre 15 y 20 minutos, despejando el cielo de inmediato con sol radiante."
          ],
          tip: "Las lluvias en el trópico son muy localizadas: puede llover sobre tu hotel mientras que en Isla Saona o Macao el cielo está totalmente despejado."
        },
        {
          heading: "3. ¿Por qué Isla Saona y Catalina siempre tienen aguas cristalinas?",
          body: [
            "A diferencia de la costa atlántica abierta, Isla Saona se encuentra en el mar Caribe meridional protegida por la península del Parque Nacional Cotubanamá.",
            "Esto asegura que sus aguas permanezcan turquesas y tranquilas prácticamente todo el año, convirtiéndola en el refugio costero más fiable de todo el país."
          ]
        }
      ],
      conclusion: "Cualquier época del año es maravillosa para disfrutar de Punta Cana si vienes informado y planificas tus actividades acuáticas con profesionales que conocen al detalle el comportamiento meteorológico de la zona.",
      keyTakeaways: [
        "Temperatura del agua: constante entre 26°C y 29°C todo el año.",
        "Temporada con menor probabilidad de lluvia: Diciembre a Abril.",
        "La mayoría de las lluvias tropicales son breves y no arruinan la jornada de excursión."
      ]
    }
  },
  {
    slug: "top-5-mejores-playas-punta-cana-republica-dominicana",
    title: "Las 5 Playas Más Espectaculares de Punta Cana que Tienes que Visitar",
    excerpt: "Desde las olas salvajes de Macao hasta las arenas blancas de Juanillo en Cap Cana: un recorrido por las costas más hermosas de la región este dominicana.",
    category: "Playas y Naturaleza",
    date: "20 de Septiembre de 2024",
    readTime: "5 min de lectura",
    author: {
      name: "Laura De León",
      role: "Especialista en Operaciones Turísticas",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80"
    },
    coverImage: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
    content: {
      introduction: "La Costa del Coco en República Dominicana abarca más de 50 kilómetros ininterrumpidos de litoral caribeño y atlántico. Pero no todas las playas tienen la misma personalidad: algunas son ideales para surfistas intrépidos, otras ofrecen lujo caribeño y otras parecen sacadas de una película de náufragos.",
      sections: [
        {
          heading: "1. Playa Macao: La reina salvaje y virgen",
          body: [
            "Declarada por la UNESCO como una de las mejores playas del Caribe, Macao destaca por sus olas consistentes, impresionantes acantilados de piedra caliza y una vibrante cultura local con puestos de pescado frito fresco.",
            "Es el epicentro de las rutas de Buggies 4x4 y de las escuelas de surf de Punta Cana."
          ]
        },
        {
          heading: "2. Playa Bávaro: Kilómetros de arena fina y palmeras",
          body: [
            "El corazón neurálgico del turismo dominicano. Su arrecife de coral exterior frena las olas creando una laguna de aguas calmas ideales para nadar, hacer kayak o elevarse en parasailing sobre la costa."
          ]
        },
        {
          heading: "3. Playa Juanillo (Cap Cana): Glamour y exclusividad",
          body: [
            "Ubicada dentro del lujoso complejo de Cap Cana, Juanillo parece una pintura: palmeras perfectamente inclinadas, agua turquesa inmóvil y restaurantes de alta cocina sobre la arena."
          ]
        },
        {
          heading: "4. Isla Saona (Canto de la Playa): El paraíso virgen definitivo",
          body: [
            "La zona más remota y virgen de Isla Saona. Al estar alejada de los muelles principales, aquí no hay construcciones, solo naturaleza exuberante y arena blanca como talco."
          ]
        }
      ],
      conclusion: "Explorar más allá de la piscina del resort y descubrir la variedad de playas que ofrece Punta Cana es la verdadera esencia de visitar la República Dominicana.",
      keyTakeaways: [
        "Para surf y adrenalina: Playa Macao.",
        "Para tranquilidad y lujo: Playa Juanillo.",
        "Para la experiencia caribeña pura: Isla Saona."
      ]
    }
  }
];
