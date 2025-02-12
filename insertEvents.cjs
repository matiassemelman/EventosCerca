const { createClient } = require('@supabase/supabase-js')
const fetch = require('node-fetch')

const supabaseUrl = 'https://ywunhfkitajzfaqiwmch.supabase.co'
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Función para limpiar la dirección
function cleanAddress(address) {
  // Extraer la dirección principal antes de la coma si existe
  const mainAddress = address.split(',')[0].trim()
  // Remover el barrio si está entre paréntesis
  return mainAddress.replace(/\([^)]*\)/g, '').trim()
}

// Función para obtener coordenadas desde una dirección usando OpenStreetMap
async function getCoordinates(address) {
  try {
    const cleanedAddress = cleanAddress(address)
    // Agregamos ", Buenos Aires, Argentina" para mejorar la precisión
    const searchAddress = `${cleanedAddress}, Buenos Aires, Argentina`
    const encodedAddress = encodeURIComponent(searchAddress)
    
    console.log(`Buscando coordenadas para: ${searchAddress}`)
    
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`)
    const data = await response.json()

    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon)
      }
    }
    console.log(`No se encontraron coordenadas para: ${searchAddress}`)
    return null
  } catch (error) {
    console.error('Error obteniendo coordenadas:', error)
    return null
  }
}

// Función para esperar un tiempo determinado
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const sampleEvents = [
  {
    id: "uuid-1",
    title: "ATP de Buenos Aires",
    description: "[ Deporte ] Llega la 25° edición del torneo de tenis con más historia y prestigio de Sudamérica. Ya confirmaron su presencia Alexander Zverev, número 2 del Ranking ATP. También estarán Holger Rune (13), acompañado por Lorenzo Musetti (15), Alejandro Tabilo (26), Sebastián Báez (28), Francisco Cerúndolo (31), Nicolás Jarry (36) y Tomás Etcheverry (38).",
    image: "",
    date: "Del 8 al 16 de febrero",
    location: "Lawn Tennis Club Av. Olleros 1510, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-2",
    title: "Sunset al lado del río",
    description: "[ Evento | Gratis ] Vení a vivir el verano al lado del río. Buena música, calor y diversión. El sábado se extiende hasta la 1:30 h y el domingo, hasta las 23:30 h. La propuesta incluye una amplia oferta gastronómica a cargo de 12 foodtrucks, donde vas a poder elegir desde carnes ahumadas y parrilla hasta helados y pizzas.",
    image: "",
    date: "Sábado 15 y domingo 16 de febrero, desde 16:30 h.",
    location: "Parque Saint Tropez Av. Rafael Obligado y La Pampa, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-3",
    title: "Ballet Romeo y Julieta",
    description: "[ Danza ] En el Día de los Enamorados, el Teatro Avenida te invita a disfrutar del apasionado ballet de Romeo y Julieta. El clásico shakespeariano será interpretado por la compañía de Guido De Benedetti, ex Primer Bailarín del Teatro Colón, compuesta por más de 45 artistas. Una propuesta de gala para celebrar el amor.",
    image: "",
    date: "Viernes 14 de febrero, 20 h.",
    location: "Teatro Avenida Av. de Mayo 1222, Monserrat",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-4",
    title: "Margarita",
    description: "[ Evento ] ¡Ya no tenés que esperar más! Vuelve a desplegarse toda la magia de Cris Morena, esta vez con un espectáculo muy esperado: Margarita. Promete ser un show único, lleno de momentos inolvidables para disfrutar y emocionarse con el elenco completo. Preparate para cantar, bailar y divertirte en familia. ¡No te lo pierdas!",
    image: "",
    date: "Martes 11 a domingo 16, 19:30 y 21 h.",
    location: "Movistar Arena Humboldt 450, Villa Crespo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-5",
    title: "Blow Up New Sensations",
    description: "[ Evento ] Vuelve el fenómeno del arte inflable, con una propuesta renovada para que te diviertas a lo grande. Blow Up New Sensation es un recorrido lúdico inmersivo con diferentes puestas artísticas que combinan tecnología de vanguardia, creatividad artística y una conexión emocional única. Está diseñado para que disfruten grandes y chicos.",
    image: "",
    date: "De martes a domingos, de 10 a 20 h.",
    location: "La Rural Av Santa Fe y Thames, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-6",
    title: "Disney en concierto | Función distendida",
    description: "[ Evento ] Este domingo, en el Colón, habrá una función distendida del show sinfónico deslumbrante que revive los grandes éxitos de Disney. Será especialmente adaptada a las necesidades de personas neurodivergentes, con estímulos visuales y sonoros reducidos, libertad de movimiento, personal y elenco entrenados por especialistas.",
    image: "",
    date: "Domingo 16, 17 h.",
    location: "Teatro Colón Cerrito 618, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-7",
    title: "Buenos Aires Matsuri",
    description: "[ Evento | Gratis ] Llega la primera edición de Matsuri al Mercat Villa Crespo: una feria asiática con los mejores stands de la cultura, manga, anime y gastronomía japonesa street food. Vas a encontrar bandas de rock y pop nikkei, danzas tradicionales, tambores taiko y toda la magia del festival Bon Odori. Consultá la grilla de actividades. Acceso libre y gratuito.",
    image: "",
    date: "Sábado 15 y domingo 16, de 12 a 20 h.",
    location: "Mercat Villa Crespo Thames 747, Villa Crespo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-8",
    title: "13° Festival Temporada Alta en Buenos Aires (TABA)",
    description: "[ Teatro ] Sumate a esta cita cultural del verano porteño que celebra las artes escénicas y alienta la creación de nuevos vínculos. Contará con una programación internacional llegada desde España y Francia, acompañada de obras locales y el consolidado Torneo de Dramaturgia. Consultá la grilla y reservá tus entradas.",
    image: "",
    date: "Del jueves 13 al domingo 23",
    location: "Timbre 4 Av. Boedo 640, Almagro",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-9",
    title: "Puertas a Mundos",
    description: "[ Evento ] Disfrutá de esta muestra inmersiva y sorprendente con diferentes escenarios, especialmente pensados para que puedas sacarte las mejores fotos de la temporada. Son diez puertas que se abren a espacios únicos, diversos y originales. Ideal para divertirte y crear contenido para tus redes. ¡Imperdible!",
    image: "",
    date: "Todos los días, de 12 a 20 h.",
    location: "La Rural Av Santa Fe y Thames, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-10",
    title: "ReOutlet",
    description: "[ Evento ] Una feria en la que vas a poder encontrar productos de más de 40 de las mejores marcas a precios accesibles, con promociones y descuentos. También habrá opciones gastronómicas para comer o picar algo mientras hacés tus compras. Se realiza en el pabellón azul de La Rural, con acceso gratuito. ¡No te lo pierdas!",
    image: "",
    date: "De martes a domingos, de 12 a 20 h.",
    location: "La Rural Av Santa Fe y Thames, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-11",
    title: "Vacaciones Planetarias | Domo",
    description: "[ Evento ] Estas vacaciones de verano, el domo del Planetario de Buenos Aires te espera con espectáculos como \"Sol, biografía de una estrella\", \"Universo en movimiento\" y \"Aventura espacial\". Hay 4 funciones de martes a viernes y 7 los fines de semana. Consultá la grilla horaria de cada día. ¡No te lo pierdas!",
    image: "",
    date: "De martes a viernes, 13, 14:30, 16 y 17 h. Fines de semana, 12, 13, 14, 15:30, 16:30, 18 y 19 h.",
    location: "Planetario Galileo Galilei Av. Sarmiento y Belisario Roldán, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-12",
    title: "Burger Fest",
    description: "[ Gastronomía | Gratis ] Con entrada libre y gratuita, el Hipódromo de Buenos Aires te espera con 35 stands y food trucks –incluyendo opciones vegetarianas y sin TACC–, además de un patio cervecero con Rabieta, vinos y coctelería. ¡Más de 100 variedades de hamburguesas para probar!",
    image: "",
    date: "Sábado 15 y domingo 16, de 18 a 01 h.",
    location: "Hipódromo de Palermo Av. del Libertador 4001, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-13",
    title: "Parador Konex | Ale Sergi",
    description: "[ Música ] Como cada verano, Parador Konex trae una grilla de espectáculos para que disfrutes a todo ritmo. Los shows se realizan en el Patio y, en caso de lluvia, se trasladan a la Sala de las Columnas. Este sábado, Ale Sergi presenta su show \"Tarde de vinilos\".",
    image: "",
    date: "Sábado 15, 17 h.",
    location: "Ciudad Cultural Konex Sarmiento 3131, Balvanera",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-14",
    title: "Visita Guiada | Plaza de Mayo",
    description: "[ Visita guiada | Gratis ] Un guía de turismo te espera en la Plazoleta Héroes de Malvinas para iniciar un recorrido por los orígenes de Buenos Aires, con datos históricos desde la fundación hasta hoy.",
    image: "",
    date: "Lunes 10, 17 y 24, 11 h. – Viernes 14, 21 y 28, 11 h.",
    location: "Plazoleta Héroes de Malvinas Defensa y Alsina, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-15",
    title: "Diego Eterno",
    description: "[ Exposición ] Llega la muestra que homenajea a Diego Armando Maradona. Un recorrido inmersivo desde Villa Fiorito hasta la gloria futbolística, con objetos personales, zona de juegos y un menú especial dedicado al ídolo.",
    image: "",
    date: "De lunes a domingos, de 12 a 20 h.",
    location: "La Rural Av Santa Fe y Thames, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-16",
    title: "Verano en la Ciudad",
    description: "[ Evento | Gratis ] Disfrutá este verano en distintos puntos de Buenos Aires con juegos de agua, áreas de arena, actividades deportivas, clases de ritmos, talleres, música y espectáculos artísticos, además del ciclo Atardeceres para jóvenes.",
    image: "",
    date: "De martes a domingos, 10 a 20 h. Hasta el domingo 16 de febrero.",
    location: "Distintos puntos Ciudad de Buenos Aires, CABA",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-17",
    title: "Marco Antonio Solís",
    description: "[ Música ] El artista mexicano llega con su world tour 2025 presentando sus éxitos en dos funciones especiales: jueves 14 para el Día de los Enamorados y viernes 15.",
    image: "",
    date: "Viernes 14 y sábado 15, 19 h.",
    location: "GEBA Av. Pte. Figueroa Alcorta 5575, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-18",
    title: "BA Market At Night",
    description: "[ Gastronomía | Gratis ] Disfrutá del mercado de productores en el Parque Rivadavia, con puestos de comida variada que ofrecen desde paella y rabas hasta hamburguesas, quesos y más.",
    image: "",
    date: "Sábado 15 y domingo 16, de 17 a 00 h.",
    location: "Parque Rivadavia Av. Rivadavia 4800, Caballito",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-19",
    title: "Observación por telescopio",
    description: "[ Evento | Gratis ] Acercate a la astronomía: el Planetario Galileo Galilei presta sus telescopios los fines de semana para que observes el cielo. (Nota: se suspende por nubosidad o lluvia).",
    image: "",
    date: "Sábados y domingos, 20:30 h.",
    location: "Planetario Galileo Galilei Av. Sarmiento y Belisario Roldán, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-20",
    title: "Re Fiesta",
    description: "[ Música ] Reviví las tradiciones de los 2000 en este evento con cumbia, reggaetón, pop latino y más. No se suspende por lluvia y es para mayores de 18 años.",
    image: "",
    date: "Viernes 14, 00:30 h.",
    location: "Ciudad Cultural Konex Sarmiento 3131, Balvanera",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-21",
    title: "Mina, che cosa seí?",
    description: "[ Teatro ] Un tributo a la cantante italiana Mina Mazzini, con Elena Roger, Diego Reinhold, Gaby Goldman y Valeria Ambrosio. Estará en cartel solo por 5 semanas.",
    image: "",
    date: "Jueves a sábados, 20:30 h. Domingos, 18 h.",
    location: "Teatro El Nacional Av. Corrientes 960, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-22",
    title: "Vino Fest | Edición Tragos",
    description: "[ Gastronomía ] Por primera vez, un Vino Fest sin vino – sólo tragos – con degustaciones de más de 20 expositores. Una alternativa para celebrar el Día de los Enamorados.",
    image: "",
    date: "Viernes 14, 19 a 23 h.",
    location: "Mercado Soho Armenia 1744, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-23",
    title: "Visita guiada | Moscato, pizza y fainá",
    description: "[ Visita guiada | Gratis ] Conmemorá el Día de la Pizza recorriendo las pizzerías más famosas del Microcentro y conociendo su historia.",
    image: "",
    date: "Viernes 14, a las 11 h.",
    location: "Av. Corrientes 751, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-24",
    title: "Quién es quién",
    description: "[ Teatro ] Luis Brandoni y Soledad Silveyra se unen en una comedia sobre las situaciones hilarantes y reflexiones sobre el amor y la felicidad en la espera de una cena.",
    image: "",
    date: "Miércoles a viernes, 20:30 h. Sábados, 20 y 22 h. Domingos, 20 h.",
    location: "Teatro Liceo Av. Rivadavia 1499, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-25",
    title: "Canciones al atardecer",
    description: "[ Música | Gratis ] Ciclo de recitales con bandas y solistas en la terraza del Recoleta. El viernes, Chechi de Marco; el domingo, Nina Suárez. Ingreso por orden de llegada.",
    image: "",
    date: "Viernes 14, 19:30 h. – Domingo 16, 18 h.",
    location: "Centro Cultural Recoleta Junín 1930, Recoleta",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-26",
    title: "Las cosas maravillosas",
    description: "[ Teatro ] Cuarta temporada de la obra de Duncan Macmillan y Jonny Donahoe. Unipersonal con actores que se presentan por temporadas limitadas. A principios de 2025, el turno es de Florencia Otero.",
    image: "",
    date: "Jueves y viernes, 22:30 h.",
    location: "Multiteatro Comafi Av. Corrientes 1283., San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-27",
    title: "La Madre",
    description: "[ Teatro ] Una obra que explora si una madre puede amar demasiado, con Cecilia Roth, Gustavo Garzón, Martín Slipak y Victoria Baldomir.",
    image: "",
    date: "Jueves a sábados, 20 h. – Domingos, 18:30 h.",
    location: "Teatro Picadero Pasaje Enrique Santos Discépolo 1857, Balvanera",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-28",
    title: "Colón Fábrica",
    description: "[ Visita guiada ] Visitá los talleres del Teatro Colón para admirar escenografías, trajes, pelucas, zapatos y efectos especiales.",
    image: "",
    date: "Viernes a domingos y feriados, de 12 a 18 h.",
    location: "Colón Fábrica Av. Pedro de Mendoza 2163, La Boca",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-29",
    title: "Tranvía Histórico de Buenos Aires",
    description: "[ Visita guiada | Gratis ] Recorré Caballito a bordo de un tranvía antiguo que te transporta a otra época.",
    image: "",
    date: "Sábados, de 17 a 20 h. – Domingos, 10 a 13 h y de 17 a 20 h.",
    location: "Tramway Histórico de Buenos Aires Emilio Mitre 500, Caballito",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-30",
    title: "Visita Guiada por el Teatro Colón",
    description: "[ Visita guiada ] Recorre el Teatro Colón y descubre detalles asombrosos de su arquitectura y escenografía.",
    image: "",
    date: "Lunes a domingos, de 10 a 16:45 h.",
    location: "Teatro Colón Cerrito 618, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-31",
    title: "James Brown usaba ruleros",
    description: "[ Teatro ] La trama se desata cuando un hijo anuncia a sus padres que él es Céline Dion y deciden internarlo en un psiquiátrico. Dirigida por Alfredo Arias con propuestas de autopercepción y corrección política.",
    image: "",
    date: "De jueves a domingos, 20 h.",
    location: "Teatro Sarmiento Sarmiento 2715, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-32",
    title: "Bus Turístico",
    description: "[ Visita guiada ] Con dos circuitos (amarillo y rojo), recorremos los atractivos turísticos más emblemáticos de la ciudad con vista panorámica y posibilidad de subir y bajar cuando quieras.",
    image: "",
    date: "Todos los días, de 9 a 17 h. (Amarillo) y de 9:30 a 18 h (Rojo)",
    location: "Bus Turístico Av. Quintana 596 (el amarillo) y Diagonal Roque Sáenz Peña 728 (el rojo)., CABA",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-33",
    title: "A ciegas gourmet",
    description: "[ Evento ] Un show sensorial que combina música en vivo y una cena gourmet en completa oscuridad, con un menú sorpresa de 7 pasos.",
    image: "",
    date: "Jueves y viernes, 21 h. – Sábados, 20 y 22 h.",
    location: "Teatro Ciego Borges 1975, Palermo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-34",
    title: "Toc Toc",
    description: "[ Teatro ] Una comedia sobre personajes con TOC que se encuentran en la sala de espera de un psiquiatra. Una propuesta divertida del autor Laurent Baffie.",
    image: "",
    date: "Miércoles a viernes, 20 h. – Sábados, 19:30 y 21:30 h. – Domingos, 19:30 h.",
    location: "Multiteatro Comafi Av. Corrientes 1283., San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-35",
    title: "Las Cautivas",
    description: "[ Teatro ] Obra sobre la historia de una mujer secuestrada en el siglo XIX y su lucha por liberarse, con la actuación de Lorena Vega y Laura Paredes.",
    image: "",
    date: "Domingo 16 y 23, 18 h.",
    location: "Teatro Metropolitan Av. Corrientes 1343, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-36",
    title: "Visita Guiada | San Telmo, bohemio, histórico y cultural",
    description: "[ Evento | Gratis ] Recorre San Telmo y descubrí la historia y el ambiente único de este barrio, incluyendo su feria de antigüedades en la Plaza Dorrego.",
    image: "",
    date: "Jueves 13, 20 y 27 de febrero, 11 h.",
    location: "Chile y Defensa, San Telmo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-37",
    title: "Medida por Medida",
    description: "[ Teatro ] Con adaptación, traducción y dirección de Gabriel Chamé Buendia, esta obra reflexiona sobre la cultura de la culpa a través del humor y el gag físico.",
    image: "",
    date: "Martes 11, 20 h. – Viernes 14, 22:30 h.",
    location: "Teatro Politeama Paraná 353, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-38",
    title: "Esperando la Carroza",
    description: "[ Teatro ] Basada en la película de culto, esta obra presenta situaciones desopilantes a partir de la desaparición de una abuela entrañable, desencadenando una batalla campal familiar. (Últimas 2 semanas)",
    image: "",
    date: "Jueves, 20:30 h. – Viernes, 21 h. – Sábados, 20 y 22:15 h. – Domingos, 20:30 h.",
    location: "Teatro Broadway Av. Corrientes 1155, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-39",
    title: "Vacaciones de verano 2025 | Destellos de otro mundo",
    description: "[ Artes visuales ] El Museo Moderno se transforma en un campamento de verano con talleres, espectáculos y actividades para todos. (Hasta el 16 de febrero)",
    image: "",
    date: "Lunes, miércoles, jueves y viernes, de 11 a 19 h. – Sábados y domingos, de 11 a 20 h.",
    location: "Museo Moderno Av. San Juan 350, San Telmo",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-40",
    title: "La vida extraordinaria",
    description: "[ Teatro ] Una obra que bucea en la poesía, lo teatral y los enigmas filosóficos, protagonizada por Valeria Lois y Lorena Vega.",
    image: "",
    date: "Miércoles 12 de febrero, 20 h.",
    location: "Teatro Picadero Pasaje Enrique Santos Discépolo 1857, Balvanera",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-41",
    title: "El trágico reinado de Eduardo II...",
    description: "[ Teatro ] Carlos Gamerro, Oria Puppo y Alejandro Tantanian presentan una versión de la obra de Marlowe centrada en la homosexualidad y el poder. (Sugerida para mayores de 16 años)",
    image: "",
    date: "Jueves a domingos, 20 h.",
    location: "Teatro San Martín Av. Corrientes 1530, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-42",
    title: "Sabe la Tierra",
    description: "[ Gastronomía | Gratis ] Feria de proyectos de triple impacto, emprendimientos sustentables y propuestas gastronómicas, con puestos de alimentos y objetos de decoración.",
    image: "",
    date: "Sábado 15, de 16 a 22 h.",
    location: "Parque Patricios Monteagudo y Av. Caseros, Parque Patricios",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-43",
    title: "Cuando Frank conoció a Carlitos",
    description: "[ Teatro ] Un encuentro imaginario entre Sinatra y Gardel, ambientado en 1934, en el que músicos quedan encerrados en un camarín y se generan situaciones únicas.",
    image: "",
    date: "Miércoles a viernes y domingos, 20 h. – Sábado, 20 y 22 h.",
    location: "Teatro Astral Av. Corrientes 1639, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-44",
    title: "MI amiga y yo",
    description: "[ Teatro ] Una comedia sobre la amistad y el desamor en la que Santiago, comediante, busca contención en el departamento de Valeria tras su separación.",
    image: "",
    date: "Jueves, 20 h. – Viernes, 22 h. – Sábados, 19:30 y 21:30 h. – Domingos, 21 h.",
    location: "Paseo La Plaza Av. Corrientes 1660, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-45",
    title: "La sala roja",
    description: "[ Teatro ] Un grupo de padres se reúne mensualmente en un jardín de infantes para definir las reglas de sus hijos, en un ambiente de estricta autoridad y humor involuntario.",
    image: "",
    date: "Jueves 13, 20:30 h.",
    location: "Teatro Astros Av. Corrientes 746, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-46",
    title: "Empieza con D, 7 Letras",
    description: "[ Teatro ] Comedia escrita por Juan José Campanella que explora qué significa empezar de nuevo, protagonizada por una profesora de yoga y un médico retirado.",
    image: "",
    date: "Miércoles a viernes, 20 h. – Sábados, 19 y 21:45 h. – Domingos, 19 h.",
    location: "Teatro Politeama Paraná 353, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-47",
    title: "Visitas guiadas al Museo Ana Frank",
    description: "[ Visita guiada ] Descubrí objetos originales y la historia de la familia Frank en recorridos por cuatro salas, con recreación de la \"Casa de Atrás\" y el castaño original.",
    image: "",
    date: "De jueves a domingos, de 14 a 19 h.",
    location: "Centro Ana Frank Superí 2647, Coghlan",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-48",
    title: "Jardines salvajes",
    description: "[ Teatro ] Una comedia con final inesperado sobre una pareja joven y un matrimonio mayor que comparten un jardín, enfrentando diferencias generacionales y culturales.",
    image: "",
    date: "Miércoles a viernes, 21 h. – Sábados, 20:30 y 22:30 h. – Domingos, 20:30 h.",
    location: "Multiteatro Comafi Av. Corrientes 1283., San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-49",
    title: "Mi querido presidente",
    description: "[ Teatro ] En plena asunción, el presidente (Maxi de la Cruz) sufre una picazón en la nariz y, junto a un psiquiatra (Miguel Ángel Solá), se lanza a un duelo para tomar el poder.",
    image: "",
    date: "Jueves, 20:30 h. – Viernes, 21 h. – Sábados, 20 y 22 h. – Domingos, 20:30 h.",
    location: "Teatro Astral Av. Corrientes 1639, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-50",
    title: "Navegación por el Riachuelo | Postales de Buenos Aires",
    description: "[ Visita guiada ] Embarcate en un recorrido por el Riachuelo, pasando por La Boca, Puerto Madero, Caminito y más, para ver la ciudad desde el agua.",
    image: "",
    date: "Todos los días, 10:30, 13, 15 y 17:30 h.",
    location: "Sturla Av. Pedro de Mendoza 1630, La Boca",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  },
  {
    id: "uuid-51",
    title: "Cha, Cha, Cha",
    description: "[ Teatro ] El ciclo de Alfredo Casero regresa al teatro con una propuesta renovada junto a Fabio Alberti y un elenco de lujo: Romina Sznaider, Lito Ming, Santiago Ríos, Favio González, Leo Raff, Gustavo Ciancio y Diego Rivas.",
    image: "",
    date: "Jueves y viernes, 22:30 h. – Sábados, 23 h.",
    location: "Teatro Metropolitan Av. Corrientes 1343, San Nicolás",
    latitude: null,
    longitude: null,
    created_at: "2025-02-12T00:00:00Z",
    updated_at: "2025-02-12T00:00:00Z"
  }
];

async function insertSampleEvents() {
  try {
    console.log('Iniciando inserción de eventos...\n')
    
    for (const event of sampleEvents) {
      console.log(`\nProcesando evento: ${event.title}`)
      console.log(`Dirección original: ${event.location}`)
      
      // Obtener coordenadas desde la dirección
      const coords = await getCoordinates(event.location)
      // Esperar 1 segundo entre solicitudes para respetar el rate limit de Nominatim
      await sleep(1000)

      const eventToInsert = {
        ...event,
        id: crypto.randomUUID(),
        latitude: coords ? coords.lat : -34.6037,
        longitude: coords ? coords.lng : -58.3816
      }

      const { error } = await supabase
        .from('events')
        .insert([eventToInsert])

      if (error) {
        console.error('❌ Error al insertar evento:', error.message)
      } else {
        console.log('✅ Evento insertado exitosamente')
        if (coords) {
          console.log(`📍 Coordenadas: ${coords.lat}, ${coords.lng}`)
        } else {
          console.log('⚠️ Usando coordenadas por defecto de Buenos Aires')
        }
      }
      console.log('-'.repeat(50))
    }
    console.log('\nProceso de inserción completado')
  } catch (error) {
    console.error('Error durante la inserción:', error)
  }
}

// Ejecutar la función
insertSampleEvents();
