import os
import json
import sys

def main():
    project_root = r"C:\Users\bot\Desktop\Fire Tour DR"
    db_file = os.path.join(project_root, "backend", "database.json")
    
    print("==============================================================")
    print("INICIANDO REORGANIZACION Y ENRIQUECIMIENTO CATA-MAESTRO")
    print(f"Base de Datos: {db_file}")
    print("==============================================================")
    
    # Cargar base de datos
    try:
        with open(db_file, 'r', encoding='utf-8') as f:
            db_data = json.load(f)
        db_tours = db_data.get('tours', [])
        print(f"Cargados {len(db_tours)} tours de la base de datos local.")
    except Exception as e:
        print(f"[ERROR] No se pudo cargar database.json: {e}")
        sys.exit(1)
        
    # DEFINICION DEL CATALOGO MAESTRO DE TRADUCCION Y DETALLES (ID 2 a 24)
    # Cada entrada contiene la informacion premium en espanol a inyectar.
    catalogo_maestro = {
        2: {
            "name": "Fire Tour DR: Aventura en Buggy Off-Road, Rancho Típico & Playa Macao",
            "desc": "Conduce tu propio buggy en caravana por el hermoso campo dominicano. Visita un rancho tradicional para degustar café orgánico, cacao y mamajuana. Luego, continúa hacia una impresionante cueva de agua dulce para un baño refrescante y finaliza en la espectacular Playa Macao para relajarte frente al mar turquesa.",
            "duration": "4 horas",
            "difficulty": "Media",
            "tag": "Adventure",
            "included": [
                "Transporte de ida y vuelta en autobús climatizado",
                "Guía profesional líder de caravana",
                "Buggy o ATV moderno (doble o individual)",
                "Casco de seguridad homologado",
                "Nado en cenote cueva de agua dulce",
                "Visita y tiempo libre en Playa Macao",
                "Degustación en rancho típico (cacao, café, mamajuana)"
            ],
            "itinerary": [
                {"time": "08:00 AM", "title": "Recogida en el Hotel", "desc": "Traslado cómodo en vehículo climatizado hacia el rancho base."},
                {"time": "09:00 AM", "title": "Instrucciones de Seguridad", "desc": "Charla técnica, entrega de equipamiento protector y prueba de conducción."},
                {"time": "09:30 AM", "title": "Ruta de Barro y Selva", "desc": "Aceleración por caminos off-road atravesando senderos naturales dominicanos."},
                {"time": "10:30 AM", "title": "Baño en Cenote", "desc": "Parada refrescante en una cueva subterránea de aguas cristalinas."},
                {"time": "11:30 AM", "title": "Visita Playa Macao", "desc": "Conducción hacia la paradisíaca Playa Macao para relajarse y tomar fotos."},
                {"time": "12:30 PM", "title": "Rancho Dominicano", "desc": "Degustación artesanal y explicación de cultivos locales dominicanos."},
                {"time": "01:30 PM", "title": "Retorno al Hotel", "desc": "Traslado de regreso cómodo directo a tu resort."}
            ]
        },
        3: {
            "name": "Fire Tour DR: Excursión Premium a Isla Saona, Catamarán & Piscina Natural",
            "desc": "Navega hacia Isla Saona, una joya caribeña de arena blanca y cocoteros. Disfruta de un emocionante viaje en lancha rápida y un relajante crucero en catamarán con música, animación y barra abierta. Haz snorkel, báñate con estrellas de mar gigantes en la Piscina Natural y disfruta de un delicioso almuerzo buffet dominicano frente al mar.",
            "duration": "9 horas",
            "difficulty": "Fácil",
            "tag": "Water",
            "included": [
                "Traslado VIP de ida y vuelta a tu hotel",
                "Navegación de ida en catamarán de vela",
                "Navegación de retorno en lancha rápida",
                "Barra libre nacional a bordo (ron, refrescos, agua)",
                "Parada en la Piscina Natural con estrellas de mar",
                "Almuerzo buffet en playa privada en Isla Saona",
                "Staff de animación y guías certificados"
            ],
            "itinerary": [
                {"time": "07:30 AM", "title": "Recogida VIP", "desc": "Traslado terrestre en cómodo autobús hacia el puerto de Bayahíbe."},
                {"time": "09:30 AM", "title": "Zarpamos en Catamarán", "desc": "Abordaje con cóctel de bienvenida, música dominicana y barra abierta."},
                {"time": "11:00 AM", "title": "Piscina Natural", "desc": "Nado en bancos de arena cristalina y encuentro respetuoso con estrellas de mar."},
                {"time": "12:30 PM", "title": "Almuerzo en Isla Saona", "desc": "Llegada a playa privada, relax bajo cocoteros y almuerzo buffet frente al mar."},
                {"time": "03:00 PM", "title": "Retorno en Lancha Rápida", "desc": "Viaje emocionante a alta velocidad de regreso al puerto."},
                {"time": "05:30 PM", "title": "Retorno al Hotel", "desc": "Traslado terrestre de regreso a tu resort."}
            ]
        },
        4: {
            "name": "Fire Tour DR: Traslado Aeropuerto Privado VIP de Lujo (SUV SUV)",
            "desc": "Disfruta de una llegada y salida VIP en Punta Cana con un traslado privado en SUV de lujo de último modelo. Tu chofer personal te dará una bienvenida exclusiva y sin estrés en la puerta de la terminal de llegadas. Perfecto para familias y grupos de hasta 5 personas con asistencia completa.",
            "duration": "1 hora",
            "difficulty": "Fácil",
            "tag": "Relax",
            "included": [
                "Traslado privado unidireccional en SUV de lujo climatizada",
                "Chofer personal bilingüe uniformado",
                "Bienvenida personalizada con cartel en la terminal",
                "Monitoreo del estado del vuelo en tiempo real",
                "Asistencia completa con el equipaje",
                "Bebida fría de cortesía en el vehículo"
            ],
            "itinerary": [
                {"time": "09:00 AM", "title": "Bienvenida en Terminal", "desc": "Tu chofer personal te recibirá en la salida del aeropuerto con un cartel personalizado y bebidas frías."},
                {"time": "09:15 AM", "title": "Equipaje VIP", "desc": "Asistencia con tus maletas e instalación cómoda en la SUV climatizada de lujo."},
                {"time": "09:30 AM", "title": "Ruta Directa al Resort", "desc": "Traslado premium directo por autopista sin paradas intermedias."},
                {"time": "10:15 AM", "title": "Llegada al Lobby", "desc": "Arribo al lobby principal de tu resort con asistencia completa de equipaje."}
            ]
        },
        5: {
            "name": "Fire Tour DR: Cena en las Alturas (Dinner in the Sky Punta Cana)",
            "desc": "Lleva tu experiencia gastronómica al siguiente nivel con una cena exclusiva suspendida a 45 metros sobre el suelo. Disfruta de un menú gourmet de 4 tiempos diseñado por chefs de renombre internacional, barra libre premium y vistas panorámicas de 360 grados de toda la costa de Punta Cana.",
            "duration": "2 horas",
            "difficulty": "Fácil",
            "tag": "Relax",
            "included": [
                "Traslado de lujo de ida y vuelta a tu hotel",
                "Menú gourmet de 4 tiempos (opciones de carne, pescado o vegetariano)",
                "Bebidas alcohólicas premium y refrescos ilimitados",
                "Asiento giratorio de seguridad homologado a 45 metros de altura",
                "Show musical y de luces interactivo en el aire"
            ],
            "itinerary": [
                {"time": "06:00 PM", "title": "Traslado Premium", "desc": "Recogida en el hotel en nuestro transporte VIP climatizado hacia el helipuerto base."},
                {"time": "06:45 PM", "title": "Bienvenida y Cóctel", "desc": "Recepción en la sala VIP de tierra con cócteles exclusivos y charla de seguridad."},
                {"time": "07:15 PM", "title": "Despegue de la Mesa", "desc": "Ajuste de arneses en los asientos pivotantes y elevación suave con grúa profesional."},
                {"time": "07:30 PM", "title": "Cena Gourmet e Interacción", "desc": "Servicio de cena gourmet en vivo por los chefs mientras disfrutas del atardecer caribeño."},
                {"time": "08:45 PM", "title": "Aterrizaje Seguro", "desc": "Descenso controlado a tierra y tiempo para fotos grupales en el photocall."},
                {"time": "09:15 PM", "title": "Retorno al Hotel", "desc": "Traslado de regreso directo a tu resort."}
            ]
        },
        6: {
            "name": "Fire Tour DR: Traslado Aeropuerto Privado Express (Minivan/Shuttle)",
            "desc": "Llega a tu resort de forma cómoda, segura y sin esperas molestas reservando un traslado privado express en minivan climatizada. Ideal para grupos medianos de hasta 10 pasajeros con equipaje completo. Chofer profesional con monitoreo constante del estado de tu vuelo.",
            "duration": "1 hora",
            "difficulty": "Fácil",
            "tag": "Relax",
            "included": [
                "Traslado privado climatizado en minivan moderna",
                "Chofer local profesional bilingüe",
                "Bienvenida personalizada en el aeropuerto",
                "Monitoreo de vuelo en tiempo real",
                "Asistencia completa con equipaje"
            ],
            "itinerary": [
                {"time": "09:00 AM", "title": "Recepción en Salidas", "desc": "Tu chofer te esperará con un cartel personalizado de Fire Tour DR en la puerta del aeropuerto."},
                {"time": "09:15 AM", "title": "Equipaje y Salida", "desc": "Asistencia de maletas y abordaje cómodo a la minivan climatizada."},
                {"time": "09:30 AM", "title": "Traslado Directo", "desc": "Viaje fluido por autopista directo hacia el sector de tu hotel en Punta Cana."},
                {"time": "10:15 AM", "title": "Llegada al Lobby", "desc": "Llegada al lobby de tu resort con entrega segura de equipaje."}
            ]
        },
        7: {
            "name": "Fire Tour DR: Safari Cultural Dominicano, Cultivos de Cacao & Tirolesas",
            "desc": "Conoce el verdadero corazón cultural e histórico de la República Dominicana en este safari de día completo. Recorre campos de caña de azúcar, visita un rancho típico para ver el proceso artesanal del cacao y café tostado, deslízate por tirolesas selváticas y disfruta de un delicioso almuerzo dominicano casero.",
            "duration": "7 horas",
            "difficulty": "Fácil / Media",
            "tag": "Adventure",
            "included": [
                "Recogida y retorno en camión safari abierto de lujo",
                "Guía de historia y cultura certificado por el Ministerio",
                "Degustación de café orgánico, cacao y mamajuana",
                "Deslizamiento por tirolesas de seguridad homologadas",
                "Almuerzo criollo buffet dominicano tradicional",
                "Visita a basílica de Higüey o iglesia típica dominicana"
            ],
            "itinerary": [
                {"time": "08:00 AM", "title": "Embarque Safari", "desc": "Abordaje en nuestro camión safari abierto y salida hacia los campos rurales dominicanos."},
                {"time": "09:30 AM", "title": "Caña de Azúcar", "desc": "Parada en los cultivos de caña de azúcar con explicación y degustación del tallo fresco."},
                {"time": "10:30 AM", "title": "Rancho de Café y Cacao", "desc": "Demostración en vivo del proceso del cacao, café y elaboración de puros artesanales."},
                {"time": "12:00 PM", "title": "Almuerzo del Rancho", "desc": "Disfruta de un delicioso almuerzo típico estilo buffet en un rancho de montaña."},
                {"time": "01:30 PM", "title": "Aventura en Tirolesas", "desc": "Adrenalina sobre las copas de los árboles en nuestras seguras líneas de canopy."},
                {"time": "03:30 PM", "title": "Retorno Escénico", "desc": "Regreso al camión safari y viaje de vuelta admirando las montañas dominicanas."}
            ]
        },
        8: {
            "name": "Fire Tour DR: Caminata Submarina Sea Trek & Snorkel en Arrecife de Coral",
            "desc": "Camina bajo el mar turquesa sin necesidad de saber nadar o bucear con el innovador sistema Sea Trek. Equipado con un casco especial que te permite respirar con normalidad, explorarás el fondo marino y estarás rodeado de cientos de peces tropicales y hermosas barreras de coral en un entorno 100% seguro.",
            "duration": "4 horas",
            "difficulty": "Fácil",
            "tag": "Water",
            "included": [
                "Traslado de ida y vuelta a tu resort",
                "Casco y equipamiento Sea Trek certificado",
                "Instrucción guiada por buzos profesionales certificados",
                "Equipo de snorkel premium completo",
                "Bebidas refrescantes y agua a bordo de nuestra plataforma"
            ],
            "itinerary": [
                {"time": "08:30 AM", "title": "Recogida y Traslado", "desc": "Traslado al muelle principal para abordar la lancha de enlace náutico."},
                {"time": "09:15 AM", "title": "Charla Técnica Marina", "desc": "Briefing instructivo del sistema de respiración del casco Sea Trek y señas de buceo."},
                {"time": "09:45 AM", "title": "Caminata Submarina", "desc": "Descenso guiado a 4 metros de profundidad para caminar sobre la arena rodeado de arrecifes de coral."},
                {"time": "10:30 AM", "title": "Tiempo de Snorkel", "desc": "Snorkel libre sobre la barrera con chaleco salvavidas y guía náutico."},
                {"time": "11:30 AM", "title": "Retorno al Muelle", "desc": "Navegación de regreso al muelle y traslado climatizado a tu hotel."}
            ]
        },
        9: {
            "name": "Fire Tour DR: Super Combo 3-en-1 (Buggys, Tirolesas & Montaña Redonda)",
            "desc": "Experimenta el combo definitivo de adrenalina en Punta Cana. Conduce potentes buggies off-road por el fango, vuela por espectaculares tirolesas sobre los árboles dominicanos y sube a la famosa Montaña Redonda para columpiarte sobre el abismo con espectaculares vistas del Atlántico y las lagunas.",
            "duration": "10 horas",
            "difficulty": "Media / Extrema",
            "tag": "Adventure",
            "included": [
                "Traslado de ida y vuelta en camión de aventura climatizado",
                "Conducción de buggy o ATV de alta cilindrada",
                "Acceso al circuito de tirolesas con arnés profesional",
                "Entrada y ascenso en vehículo 4x4 a Montaña Redonda",
                "Almuerzo criollo típico con bebidas ilimitadas en la montaña",
                "Guías expertos de montaña y asistencia técnica"
            ],
            "itinerary": [
                {"time": "07:00 AM", "title": "Recogida Aventura", "desc": "Traslado terrestre en camión todoterreno hacia el parque de aventuras."},
                {"time": "08:30 AM", "title": "Ruta en Buggy Off-Road", "desc": "Instrucción y aceleración por caminos extremos de barro y fango."},
                {"time": "11:00 AM", "title": "Circuito de Tirolesas", "desc": "Vuelo de altura por nuestras líneas de canopy selváticas."},
                {"time": "01:00 PM", "title": "Ascenso a Montaña Redonda", "desc": "Subida extrema en camión 4x4, almuerzo buffet criollo frente al mirador."},
                {"time": "02:30 PM", "title": "Columpios Fotográficos", "desc": "Tiempo libre para fotos espectaculares en los columpios infinitos de montaña."},
                {"time": "04:30 PM", "title": "Retorno al Hotel", "desc": "Traslado de regreso climatizado y seguro a tu resort."}
            ]
        },
        10: {
            "name": "Fire Tour DR: Adrenalina Extrema - Circuito Zipline Canopy de 12 Líneas",
            "desc": "Siente la velocidad volando sobre la selva de Punta Cana en nuestro galardonado circuito de 12 tirolesas de seguridad profesional. Diseñado por constructores certificados de montaña, te deslizarás a más de 50 km/h cruzando plataformas de montaña con espectaculares vistas de la cordillera de Anamuya.",
            "duration": "5 horas",
            "difficulty": "Media",
            "tag": "Adventure",
            "included": [
                "Traslado VIP climatizado de ida y vuelta",
                "Acceso al circuito completo de 12 tirolesas canopy",
                "Arnés, casco, polea y guantes profesionales homologados",
                "Instructores de escalada y montaña certificados",
                "Degustación de frutas tropicales frescas al finalizar"
            ],
            "itinerary": [
                {"time": "08:00 AM", "title": "Recogida y Traslado", "desc": "Recogida directa en tu resort y traslado hacia las montañas de Anamuya."},
                {"time": "09:00 AM", "title": "Briefing de Seguridad", "desc": "Charla técnica, demostración interactiva de frenado y equipamiento de seguridad."},
                {"time": "09:30 AM", "title": "Vuelo Canopy", "desc": "Comienza el circuito. Deslízate por 12 tirolesas cruzando abismos y copas de árboles selváticos."},
                {"time": "11:30 AM", "title": "Frutas Orgánicas", "desc": "Descanso en la base del rancho para degustar piña, lechosa y mamajuana."},
                {"time": "12:30 PM", "title": "Retorno Cómodo", "desc": "Regreso terrestre climatizado directo a tu hotel."}
            ]
        },
        11: {
            "name": "Fire Tour DR: Vuelo VIP en Helicóptero (Vista Aérea Punta Cana)",
            "desc": "Disfruta de las vistas aéreas más exclusivas del Caribe a bordo de nuestro moderno helicóptero VIP. Vuela sobre las playas de arena blanca de Bávaro, El Cortecito y Cabeza de Toro, admirando las aguas turquesas del océano y la barrera de coral desde una perspectiva verdaderamente única.",
            "duration": "1 hora",
            "difficulty": "Fácil",
            "tag": "Relax",
            "included": [
                "Traslado privado de ida y vuelta a tu resort",
                "Vuelo escénico de 10-15 minutos en helicóptero VIP",
                "Piloto profesional bilingüe certificado internacionalmente",
                "Auriculares interactivos de comunicación durante el vuelo",
                "Copa de champán de cortesía en la sala de embarque"
            ],
            "itinerary": [
                {"time": "09:00 AM", "title": "Recogida Privada", "desc": "Traslado privado directo hacia el helipuerto principal de Bávaro."},
                {"time": "09:30 AM", "title": "Bienvenida y Check-In", "desc": "Recepción en la sala de control, cóctel de bienvenida y briefing técnico con el piloto."},
                {"time": "09:45 AM", "title": "Vuelo VIP en Helicóptero", "desc": "Vuelo escénico espectacular sobre la costa turquesa de Punta Cana."},
                {"time": "10:15 AM", "title": "Sesión Fotográfica", "desc": "Aterrizaje y tiempo para fotos profesionales con el helicóptero de fondo."},
                {"time": "10:45 AM", "title": "Retorno al Hotel", "desc": "Traslado de regreso directo a tu resort."}
            ]
        },
        12: {
            "name": "Fire Tour DR: Paseo a Caballo por la Costa Salvaje de Uvero Alto",
            "desc": "Conéctate con la naturaleza en un paseo a caballo por la hermosa y virgen playa de Uvero Alto. Guiado por un instructor ecuestre experto, cabalgarás a lo largo de la costa caribeña sintiendo la brisa marina y contemplando espectaculares paisajes naturales, ideal para parejas y familias.",
            "duration": "3 horas",
            "difficulty": "Fácil / Media",
            "tag": "Relax",
            "included": [
                "Traslado de ida y vuelta climatizado a tu hotel",
                "Caballo entrenado y dócil adaptado a tu nivel de experiencia",
                "Casco y equipamiento de equitación homologado",
                "Guía e instructor ecuestre profesional bilingüe",
                "Botella de agua fría durante el recorrido"
            ],
            "itinerary": [
                {"time": "08:30 AM", "title": "Recogida VIP", "desc": "Traslado terrestre climatizado hacia el rancho ecuestre base."},
                {"time": "09:15 AM", "title": "Instrucción y Asignación", "desc": "Charla técnica, colocación de casco y asignación del caballo adecuado a tu peso y destreza."},
                {"time": "09:45 AM", "title": "Cabalga por la Playa", "desc": "Paseo escénico relajante a lo largo de la orilla de la espectacular Playa Uvero Alto."},
                {"time": "11:00 AM", "title": "Rancho y Descanso", "desc": "Regreso al rancho, tiempo para interactuar con los caballos y refrescarse."},
                {"time": "11:30 AM", "title": "Retorno al Hotel", "desc": "Traslado terrestre cómodo de regreso a tu resort."}
            ]
        },
        13: {
            "name": "Fire Tour DR: Santo Domingo Histórico: Zona Colonial & Parque Tres Ojos",
            "desc": "Viaja en el tiempo en un tour de día completo a la primera ciudad de América: Santo Domingo. Pasea por la histórica Zona Colonial con un guía oficial, entra al Alcázar de Colón, admira la Catedral Primada y maravíllate con los impresionantes lagos subterráneos del Parque Nacional Los Tres Ojos.",
            "duration": "11 horas",
            "difficulty": "Fácil",
            "tag": "Relax",
            "included": [
                "Traslado de ida y vuelta en autobús de larga distancia de gran confort",
                "Guía de historia oficial certificado bilingüe",
                "Entrada al Parque Tres Ojos y paseo en barca",
                "Entrada al Alcázar de Colón y Catedral Primada",
                "Almuerzo criollo dominicano gourmet en restaurante colonial",
                "Visita al Faro a Colón y Palacio Presidencial"
            ],
            "itinerary": [
                {"time": "06:30 AM", "title": "Salida Express", "desc": "Recogida en el hotel y salida directa en autobús VIP climatizado hacia Santo Domingo."},
                {"time": "09:30 AM", "title": "Los Tres Ojos", "desc": "Visita guiada a las espectaculares cuevas abiertas de agua dulce y sus tres lagos subterráneos."},
                {"time": "11:00 AM", "title": "Zona Colonial Histórica", "desc": "Caminata guiada por la calle Las Damas, Alcázar de Colón e iglesias antiguas de la era de la conquista."},
                {"time": "01:00 PM", "title": "Almuerzo Colonial", "desc": "Almuerzo buffet criollo tradicional en un histórico restaurante colonial."},
                {"time": "02:30 PM", "title": "Catedral Primada", "desc": "Visita a la primera basílica del Nuevo Mundo con audio-guía oficial."},
                {"time": "04:00 PM", "title": "Retorno Cómodo", "desc": "Regreso por la Autovía del Este directo de vuelta hacia Punta Cana."},
                {"time": "07:00 PM", "title": "Llegada al Hotel", "desc": "Llegada directa de regreso a tu lobby."}
            ]
        },
        14: {
            "name": "Fire Tour DR: Isla Saona Express en Lancha Rápida & Piscina Natural",
            "desc": "Disfruta de una excursión de ritmo rápido y máxima emoción a la paradisíaca Isla Saona viajando en lancha rápida. Pasa más tiempo en las hermosas playas vírgenes de arena blanca, disfruta de un baño espectacular en la inmensa Piscina Natural con estrellas de mar y almuerza un rico buffet dominicano criollo.",
            "duration": "8 horas",
            "difficulty": "Fácil",
            "tag": "Water",
            "included": [
                "Traslado de ida y vuelta climatizado a tu hotel",
                "Viaje rápido de ida y vuelta en moderna lancha rápida",
                "Barra libre nacional de ron, refrescos y agua a bordo",
                "Parada prolongada en la Piscina Natural con estrellas de mar",
                "Almuerzo buffet completo y bebidas en playa Isla Saona",
                "Guía de turismo certificado y tripulación náutica"
            ],
            "itinerary": [
                {"time": "07:30 AM", "title": "Recogida en Resort", "desc": "Traslado rápido por carretera hacia la costa de Bayahíbe."},
                {"time": "09:15 AM", "title": "Embarque Express", "desc": "Subida a la lancha rápida y aceleración por la costa turquesa."},
                {"time": "10:00 AM", "title": "Piscina Natural", "desc": "Parada en el banco de arena transparente con estrellas de mar y ron frío."},
                {"time": "11:30 AM", "title": "Playa de Isla Saona", "desc": "Desembarque en playa de cocoteros, tiempo libre para nadar y almuerzo criollo frente al mar."},
                {"time": "03:00 PM", "title": "Aventura en Lancha", "desc": "Regreso a toda velocidad sobre las olas caribeñas de vuelta al puerto."},
                {"time": "05:00 PM", "title": "Llegada al Hotel", "desc": "Traslado terrestre de regreso a tu resort."}
            ]
        },
        15: {
            "name": "Fire Tour DR: Aventura de Nado con Delfines en Dolphin Island Park",
            "desc": "Vive la fantástica experiencia de nadar e interactuar con hermosos delfines en su hábitat natural en Punta Cana. Disfruta de un emocionante paseo en barco hasta nuestra isla flotante en medio de la barrera de coral, donde realizarás nados asistidos, besos, apretones de aletas y divertidas acrobacias marinas guiadas en un entorno 100% ecológico.",
            "duration": "4 horas",
            "difficulty": "Fácil",
            "tag": "Water",
            "included": [
                "Traslado terrestre climatizado de ida y vuelta a tu hotel",
                "Traslado en lancha rápida hacia la plataforma marina flotante",
                "Nado interactivo de 40 minutos con delfines",
                "Chaleco salvavidas y equipamiento de seguridad",
                "Guías bilingües e instructores marinos expertos"
            ],
            "itinerary": [
                {"time": "08:30 AM", "title": "Recogida y Traslado", "desc": "Traslado terrestre climatizado hacia la marina base en la playa de Bávaro."},
                {"time": "09:15 AM", "title": "Abordaje y Lancha Rápida", "desc": "Embarque y traslado en lancha rápida hacia la plataforma marina de Dolphin Island."},
                {"time": "09:45 AM", "title": "Orientación de Seguridad", "desc": "Charla informativa con los biólogos e instructores sobre la fisiología y cuidado de los delfines."},
                {"time": "10:15 AM", "title": "Nado con Delfines", "desc": "Entrada al agua en grupos reducidos para realizar nados asistidos, caricias, besos y acrobacias con los delfines."},
                {"time": "11:15 AM", "title": "Tiempo de Fotos y Retorno", "desc": "Visualización de fotos profesionales opcionales y navegación de regreso al muelle principal."},
                {"time": "12:00 PM", "title": "Llegada al Resort", "desc": "Traslado de regreso climatizado y directo al lobby de tu resort."}
            ]
        },
        16: {
            "name": "Fire Tour DR: Encuentro Familiar Interactivo con Delfines (Dolphin Explorer)",
            "desc": "Una experiencia mágica diseñada especialmente para familias, niños y personas de todas las edades. En este encuentro interactivo de pie en una plataforma poco profunda, podrás acariciar, abrazar, alimentar y recibir un tierno beso de un encantador delfín. Ideal para crear recuerdos inolvidables en un entorno totalmente seguro.",
            "duration": "4 horas",
            "difficulty": "Fácil",
            "tag": "Water",
            "included": [
                "Traslado de ida y vuelta a tu resort",
                "Acceso general al parque ecológico Dolphin Explorer",
                "Encuentro interactivo de 30 minutos con delfines",
                "Guía y entrenador bilingüe certificado",
                "Show educativo de aves tropicales y leones marinos"
            ],
            "itinerary": [
                {"time": "08:30 AM", "title": "Recogida Familiar", "desc": "Traslado en nuestro transporte cómodo climatizado directo hacia el parque Dolphin Explorer."},
                {"time": "09:15 AM", "title": "Llegada y Bienvenida", "desc": "Check-in en el parque, asignación de grupos y colocación de pulseras de acceso."},
                {"time": "09:45 AM", "title": "Encuentro en Plataforma", "desc": "Interacción de pie sobre plataforma de agua a la cintura con caricias, bailes y besos con el delfín."},
                {"time": "10:30 AM", "title": "Show Educativo de Aves", "desc": "Disfruta de un espectáculo interactivo con guacamayos, loros y leones marinos del parque."},
                {"time": "11:30 AM", "title": "Retorno al Hotel", "desc": "Coordinación de salida y traslado terrestre directo a tu resort."}
            ]
        },
        17: {
            "name": "Fire Tour DR: Crucero Catamarán de Lujo, Snorkel Privado & Barra Libre",
            "desc": "Embárcate en un exclusivo catamarán de vela para navegar por la costa de Bávaro. Disfruta de una inmersión guiada de snorkel en arrecifes de coral repletos de peces tropicales, báñate en la tranquila y cristalina piscina natural, y relájate bajo el sol con cócteles tropicales y barra libre a bordo.",
            "duration": "4 horas",
            "difficulty": "Fácil",
            "tag": "Water",
            "included": [
                "Traslado terrestre climatizado de ida y vuelta",
                "Navegación exclusiva en catamarán moderno de vela",
                "Equipo de snorkel premium completo y desinfectado",
                "Barra libre nacional (ron, cerveza, refrescos, jugos)",
                "Bebidas y frutas tropicales servidas en el agua en Piscina Natural",
                "Staff náutico bilingüe certificado"
            ],
            "itinerary": [
                {"time": "08:30 AM", "title": "Recogida y Traslado", "desc": "Traslado terrestre hacia la base náutica de Bávaro."},
                {"time": "09:15 AM", "title": "Zarpamos al Atlántico", "desc": "Embarque en el catamarán de lujo con barra libre y música ambiental caribeña."},
                {"time": "10:00 AM", "title": "Snorkel de Arrecife", "desc": "Parada en la reserva coralina para nadar con guías y observar peces tropicales."},
                {"time": "11:15 AM", "title": "Piscina Natural Bávaro", "desc": "Fondeo en aguas poco profundas (cintura) con barra libre flotante y juegos de agua."},
                {"time": "12:15 PM", "title": "Regreso al Muelle", "desc": "Brindis final a bordo y traslado de regreso a tu resort."}
            ]
        },
        18: {
            "name": "Fire Tour DR: Snorkel VIP Catamarán (Adults-Only) & Almuerzo de Mariscos",
            "desc": "Disfruta de una experiencia exclusiva solo para adultos a bordo de nuestro catamarán VIP. Haz snorkel en la barrera coralina de Cabeza de Toro, báñate en una tranquila piscina natural costera y deléitate con un almuerzo gourmet de mariscos frescos (langosta según temporada) servido en un exclusivo club de playa.",
            "duration": "5 horas",
            "difficulty": "Fácil",
            "tag": "Water",
            "included": [
                "Traslado de ida y vuelta privado o VIP",
                "Navegación premium en catamarán exclusivo solo para adultos",
                "Equipo de snorkel desinfectado de alta calidad",
                "Barra libre de ron premium, cerveza, vino y cócteles",
                "Almuerzo gourmet de mariscos frescos frente al mar",
                "Servicio personalizado VIP a bordo"
            ],
            "itinerary": [
                {"time": "08:30 AM", "title": "Recogida VIP", "desc": "Recogida cómoda en el lobby y traslado directo al embarcadero VIP."},
                {"time": "09:15 AM", "title": "Crucero Exclusivo", "desc": "Embarque, cóctel premium de bienvenida y navegación relajada por la costa."},
                {"time": "10:00 AM", "title": "Inmersión de Snorkel", "desc": "Exploración de la barrera de coral protegida con fauna marina diversa y guías."},
                {"time": "11:15 AM", "title": "Piscina Natural Selecta", "desc": "Relax con bebidas finas en bancos de arena alejados del turismo masivo."},
                {"time": "12:30 PM", "title": "Almuerzo de Mariscos", "desc": "Desembarque en club de playa privado para disfrutar de un festín gourmet de mariscos frescos."},
                {"time": "01:30 PM", "title": "Retorno al Hotel", "desc": "Traslado privado de regreso a tu resort."}
            ]
        },
        19: {
            "name": "Fire Tour DR: Crucero Catamarán Familiar con Tobogán & Snorkel",
            "desc": "La combinación perfecta de diversión y relax para toda la familia. Navega en un gran catamarán moderno equipado con tobogán acuático para lanzarte directamente al mar cristalino. Disfruta de snorkel guiado, nado en piscina natural y un gran ambiente festivo con música, frutas y refrescos para todas las edades.",
            "duration": "4 horas",
            "difficulty": "Fácil",
            "tag": "Water",
            "included": [
                "Traslado terrestre climatizado de ida y vuelta",
                "Navegación en catamarán con tobogán acuático a bordo",
                "Equipo completo de snorkel (máscara, aletas, chaleco)",
                "Barra libre nacional de bebidas dominicanas y gaseosas",
                "Picadera de frutas frescas de estación y nachos",
                "Staff de animación familiar y guías"
            ],
            "itinerary": [
                {"time": "08:30 AM", "title": "Recogida y Traslado", "desc": "Traslado terrestre cómodo hacia el puerto de embarque náutico."},
                {"time": "09:15 AM", "title": "Zarpamos con Tobogán", "desc": "Embarque en el catamarán familiar con música alegre y barra abierta."},
                {"time": "10:00 AM", "title": "Snorkel Familiar", "desc": "Parada en el arrecife de coral para nadar con cientos de peces de colores."},
                {"time": "11:15 AM", "title": "Tobogán en Piscina Natural", "desc": "Fondeo en aguas cristalinas y poco profundas. ¡Lánzate por el tobogán al mar!"},
                {"time": "12:15 PM", "title": "Retorno al Muelle", "desc": "Navegación final y traslado terrestre de regreso al resort."}
            ]
        },
        20: {
            "name": "Fire Tour DR: Ruta en Buggy Extremo: Cuevas Mágicas & Playa Salvaje",
            "desc": "Adéntrate en los senderos más salvajes de Punta Cana conduciendo un potente buggy 4x4. Acelera por caminos llenos de barro y lodo, explora y nada en las aguas turquesas de una impresionante cueva subterránea de piedra caliza y deléitate con las espectaculares costas vírgenes de Playa Macao.",
            "duration": "4 horas",
            "difficulty": "Media / Extrema",
            "tag": "Adventure",
            "included": [
                "Transporte climatizado de ida y vuelta a tu resort",
                "Buggy extremo de tracción total (doble o individual)",
                "Equipo protector completo (casco, gafas de barro)",
                "Nado en cueva subterránea natural de agua cristalina",
                "Visita y tiempo libre en Playa Macao",
                "Guía bilingüe experto de caravana y asistencia de fango"
            ],
            "itinerary": [
                {"time": "08:00 AM", "title": "Traslado al Rancho", "desc": "Recogida directa en tu lobby y traslado en bus todoterreno al rancho base."},
                {"time": "09:00 AM", "title": "Instrucción de Barro", "desc": "Charla técnica, equipamiento protector completo y asignación de buggies."},
                {"time": "09:30 AM", "title": "Caravana Extrema", "desc": "Comienza la aceleración por caminos difíciles, lodo y selva profunda."},
                {"time": "10:30 AM", "title": "Nado en Cueva Mágica", "desc": "Parada para nadar con linternas de agua en una cueva subterránea espectacular."},
                {"time": "11:30 AM", "title": "Playa Macao Salvaje", "desc": "Visita escénica para fotos brutales de la costa rocosa de Playa Macao."},
                {"time": "12:30 PM", "title": "Regreso al Rancho", "desc": "Degustaciones rápidas y traslado de regreso a tu resort."}
            ]
        },
        21: {
            "name": "Fire Tour DR: Royal Swim VIP con Delfines y Leones Marinos (Dolphin Island)",
            "desc": "Disfruta de la experiencia de nado con delfines más completa, exclusiva e inmersiva del Caribe. El programa Royal Swim te permite experimentar la emocionante propulsión 'Foot-Push', donde dos maravillosos delfines te empujarán de los pies elevándote sobre el agua, además de nadar a alta velocidad sujetando sus aletas dorsales (Dorsal Tow).",
            "duration": "5 horas",
            "difficulty": "Media",
            "tag": "Water",
            "included": [
                "Traslado privado de ida y vuelta en vehículo VIP",
                "Traslado premium en lancha hacia la reserva marina",
                "Programa Royal Swim de 50 minutos con dos delfines",
                "Interacción con lobos marinos o tiburones nodriza",
                "Bebidas frías e hidratación de cortesía"
            ],
            "itinerary": [
                {"time": "09:00 AM", "title": "Recogida VIP Privada", "desc": "Traslado privado directo en vehículo climatizado VIP hacia la marina principal."},
                {"time": "09:30 AM", "title": "Embarque y Zarpado", "desc": "Navegación premium en lancha rápida hacia la plataforma VIP flotante de Dolphin Island."},
                {"time": "10:00 AM", "title": "Foot-Push y Dorsal Tow", "desc": "Acceso al agua para experimentar las propulsiones Foot-Push y remolques dorsales extremos a alta velocidad con dos delfines."},
                {"time": "11:00 AM", "title": "Interacción con Tiburones", "desc": "Acceso guiado exclusivo para hacer snorkel y observar tiburones nodriza y rayas gigantes."},
                {"time": "12:00 PM", "title": "Retorno Privado", "desc": "Navegación final y traslado privado directo a tu hotel."}
            ]
        },
        22: {
            "name": "Fire Tour DR: Combo Caballo + ATV/Buggy & Cenote Subterráneo",
            "desc": "Disfruta de la mejor combinación de tierra en Punta Cana. Cabalga a caballo por senderos selváticos y playas vírgenes, luego súbete a un potente buggy o ATV off-road para acelerar por el fango, explorar una cueva de agua dulce y nadar en sus profundidades cristalinas.",
            "duration": "5 horas",
            "difficulty": "Media",
            "tag": "Adventure",
            "included": [
                "Traslado de ida y vuelta a tu resort",
                "Paseo a caballo guiado (30-40 minutos)",
                "Conducción de ATV o Buggy moderno (60-80 minutos)",
                "Nado guiado en cueva subterránea de agua cristalina",
                "Casco, gafas y equipo protector completo",
                "Degustación en rancho típico artesanal"
            ],
            "itinerary": [
                {"time": "08:00 AM", "title": "Recogida VIP", "desc": "Traslado terrestre climatizado hacia el rancho de aventura."},
                {"time": "09:00 AM", "title": "Paseo a Caballo", "desc": "Bienvenida, instrucción y cabalgata escénica guiada por hermosos senderos."},
                {"time": "09:45 AM", "title": "Ruta Buggy / ATV", "desc": "Equipamiento de seguridad y aceleración extrema por caminos de barro en buggy o quad."},
                {"time": "11:00 AM", "title": "Nado en Cenote Cueva", "desc": "Baño refrescante en una cueva subterránea de piedra caliza espectacular."},
                {"time": "12:00 PM", "title": "Degustación del Rancho", "desc": "Prueba café orgánico tostado, cacao artesanal y mamajuana."},
                {"time": "12:30 PM", "title": "Retorno al Hotel", "desc": "Traslado cómodo y seguro directo de vuelta a tu resort."}
            ]
        },
        23: {
            "name": "Fire Tour DR: Hip Hop Party Boat (Adults-Only) & Piscina Natural",
            "desc": "¡La fiesta más encendida sobre el agua! Súbete a nuestro barco de fiesta de alta energía para adultos y disfruta de los mejores ritmos de Hip Hop, R&B y Reggaetón mezclados en vivo por nuestro DJ a bordo. Incluye barra libre nacional ilimitada, snorkel guiado y parada salvaje en el banco de arena de la Piscina Natural.",
            "duration": "4 horas",
            "difficulty": "Fácil",
            "tag": "Water",
            "included": [
                "Traslado seguro de ida y vuelta en autobús de fiesta",
                "Entrada al catamarán de fiesta para adultos",
                "Barra libre nacional ilimitada (ron, cerveza, vodka, tequila)",
                "DJ en vivo mezclando Hip Hop, R&B y Reggaetón",
                "Equipos de snorkel desinfectados con guías",
                "Bebidas flotantes en la Piscina Natural"
            ],
            "itinerary": [
                {"time": "02:00 PM", "title": "Traslado de Fiesta", "desc": "Recogida en el hotel con música ambiente y traslado directo al embarcadero."},
                {"time": "02:45 PM", "title": "Embarque y DJ Set", "desc": "Zarpamos con barra libre abierta de inmediato y DJ mezclando en vivo sobre las olas."},
                {"time": "03:30 PM", "title": "Snorkel Náutico", "desc": "Parada rápida para refrescarse en el arrecife con equipo completo."},
                {"time": "04:30 PM", "title": "Sandbar Party", "desc": "Fiesta masiva con barra abierta en el banco de arena transparente con agua a la cintura."},
                {"time": "06:00 PM", "title": "Retorno Seguro", "desc": "Llegada al muelle bajo el atardecer y traslado seguro de regreso a tu resort."}
            ]
        },
        24: {
            "name": "Fire Tour DR: Experiencia Ultimate Buggy Premium & Cenote Privado",
            "desc": "Disfruta de la versión ultra-VIP y premium de nuestra clásica aventura off-road. Conduce buggies Can-Am de alta potencia de último modelo en una ruta extendida y exclusiva sin aglomeraciones, entra a una reserva ecológica privada y báñate en un cenote de cueva de agua dulce cristalina y cristalina.",
            "duration": "5 horas",
            "difficulty": "Media / Extrema",
            "tag": "Adventure",
            "included": [
                "Traslado VIP privado de ida y vuelta a tu resort",
                "Conducción de buggy de alta gama Can-Am original",
                "Casco profesional, mascarilla de barro y gafas premium",
                "Acceso a cenote ecológico privado sin aglomeraciones",
                "Almuerzo criollo premium e hidratación ilimitada",
                "Guía de turismo de aventura certificado dedicado"
            ],
            "itinerary": [
                {"time": "08:00 AM", "title": "Traslado Privado", "desc": "Traslado privado exclusivo directo en SUV VIP climatizada hacia la base Can-Am."},
                {"time": "09:00 AM", "title": "Asignación Can-Am", "desc": "Entrega de equipo premium y briefing técnico de alta cilindrada."},
                {"time": "09:30 AM", "title": "Ruta Aventura Can-Am", "desc": "Adrenalina pura cruzando senderos ecológicos exclusivos y de difícil acceso."},
                {"time": "10:45 AM", "title": "Cenote Ecológico Privado", "desc": "Nado refrescante y exclusivo en una cueva subterránea de aguas turquesas cristalinas."},
                {"time": "11:45 AM", "title": "Almuerzo VIP del Rancho", "desc": "Degustación de carnes y platos criollos en una zona exclusiva del rancho."},
                {"time": "01:00 PM", "title": "Retorno Privado", "desc": "Traslado privado de regreso en SUV directa a tu resort."}
            ]
        }
    }
    
    # 6. ITERAR Y ENRIQUECER TODA LA BASE DE DATOS
    tours_updated = 0
    
    for t in db_tours:
        tid = t.get('id')
        
        # Omitimos el ID 1 ya que es nuestra excursion premium personalizada hecha manualmente
        if tid == 1:
            print("ID 01 | Omitido (Mantiene seccion premium inmersiva manual).")
            continue
            
        # Para todos los tours del 2 al 69:
        # Calcular el ID maestro correspondiente (1 de los 23 perfiles de catalogo_maestro)
        # La base de datos tiene 23 excursiones maestras que se repiten secuencialmente:
        # ID 2 -> maestro 2
        # ID 3 -> maestro 3
        # ...
        # ID 24 -> maestro 24
        # ID 25 -> maestro 2
        # ID 26 -> maestro 3
        # ...
        maestro_id = ((tid - 2) % 23) + 2
        
        if maestro_id in catalogo_maestro:
            profile = catalogo_maestro[maestro_id]
            
            # Sobrescribir los campos con el perfil premium en espanol
            t['name'] = profile['name']
            t['desc'] = profile['desc']
            t['duration'] = profile['duration']
            t['difficulty'] = profile['difficulty']
            t['tag'] = profile['tag']
            t['included'] = profile['included']
            t['itinerary'] = profile['itinerary']
            
            # Tambien nos aseguramos de que el badge y la clase sean coherentes y premium
            if profile['tag'] == 'Adventure':
                t['badge'] = "Aventura"
                t['badgeClass'] = "badge-accent"
            elif profile['tag'] == 'Water':
                t['badge'] = "Acuático"
                t['badgeClass'] = "badge-cyan"
            else:
                t['badge'] = "Relajante"
                t['badgeClass'] = "badge-secondary"
                
            # Asignar de forma consistente las fotos 2K locales correspondientes del tour
            # Mapeamos las fotos locales de alta calidad /tours/page2/tour_[maestro_id]/foto_X.jpg
            local_photos = []
            for img_idx in range(1, 11):
                local_photos.append(f"/tours/page2/tour_{maestro_id}/foto_{img_idx}.jpg")
                
            t['image'] = local_photos[0]
            t['photos'] = local_photos
            
            tours_updated += 1
            
    # Guardar base de datos
    try:
        with open(db_file, 'w', encoding='utf-8') as f:
            json.dump(db_data, f, indent=2, ensure_ascii=False)
        print("\n==============================================================")
        print("BASE DE DATOS database.json ENRIQUECIDA CORRECTAMENTE!")
        print(f"Total de tours actualizados en el catalogo: {tours_updated}")
        print("==============================================================")
    except Exception as e:
        print(f"[ERROR] No se pudo guardar database.json: {e}")
        sys.exit(1)
        
    print("\n==============================================================")
    print("PROCESO DE REORGANIZACION Y ENRIQUECIMIENTO FINALIZADO CON EXITO")
    print("==============================================================")

if __name__ == '__main__':
    main()
