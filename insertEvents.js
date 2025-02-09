import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ywunhfkitajzfaqiwmch.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3dW5oZmtpdGFqemZhcWl3bWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwNTExOTgsImV4cCI6MjA1NDYyNzE5OH0.nXp0WJeDNTyuO4JhxsxO1AAdqs5ZFvZg0icekOv1N9A'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Coordenadas aproximadas de Buenos Aires como punto central
const CENTER_LAT = -34.6037
const CENTER_LNG = -58.3816

// Función para generar coordenadas aleatorias cercanas al centro
const generateNearbyCoordinates = () => {
  const lat = CENTER_LAT + (Math.random() - 0.5) * 0.1 // +/- ~5km en latitud
  const lng = CENTER_LNG + (Math.random() - 0.5) * 0.1 // +/- ~5km en longitud
  return { lat, lng }
}

const sampleEvents = [
  {
    title: "Festival de Jazz en el Parque",
    description: "Una tarde de jazz al aire libre con artistas locales e internacionales. Trae tu manta y disfruta de buena música.",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Parque Centenario"
  },
  {
    title: "Exposición de Arte Contemporáneo",
    description: "Muestra de artistas emergentes locales presentando sus últimas obras en diferentes medios.",
    image: "https://images.unsplash.com/photo-1531243269054-5ebf6f34081e?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Galería Moderna"
  },
  {
    title: "Feria Gastronómica Internacional",
    description: "Descubre sabores de todo el mundo en esta feria que reúne a los mejores restaurantes de la ciudad.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Plaza Serrano"
  },
  {
    title: "Maratón Urbana 10K",
    description: "Participa en la carrera anual por las calles de la ciudad. Apto para todos los niveles.",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Partida: Plaza de Mayo"
  },
  {
    title: "Festival de Cine Independiente",
    description: "Proyección de películas independientes de directores locales y charlas con los realizadores.",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Centro Cultural San Martín"
  },
  {
    title: "Concierto de Rock Nacional",
    description: "Las mejores bandas del rock nacional se reúnen para un show inolvidable.",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Teatro Vorterix"
  },
  {
    title: "Taller de Fotografía Urbana",
    description: "Aprende técnicas de fotografía callejera con fotógrafos profesionales.",
    image: "https://images.unsplash.com/photo-1552168324-d612d77725e3?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Escuela de Fotografía"
  },
  {
    title: "Feria de Diseño Independiente",
    description: "Encuentra productos únicos de diseñadores locales: ropa, accesorios, decoración y más.",
    image: "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Plaza Armenia"
  },
  {
    title: "Workshop de Cocina Saludable",
    description: "Aprende a preparar platos saludables y deliciosos con chefs especializados.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Escuela de Gastronomía"
  },
  {
    title: "Festival de Teatro Callejero",
    description: "Disfruta de performances teatrales al aire libre por diferentes puntos de la ciudad.",
    image: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?ixlib=rb-4.0.3",
    date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(),
    location: "Calle Defensa"
  }
]

async function insertSampleEvents() {
  try {
    // Primero, eliminar eventos existentes
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteError) {
      console.error('Error al eliminar eventos:', deleteError)
      return
    }

    // Insertar nuevos eventos con coordenadas aleatorias
    const eventsWithCoordinates = sampleEvents.map(event => {
      const coords = generateNearbyCoordinates()
      return {
        ...event,
        latitude: coords.lat,
        longitude: coords.lng
      }
    })

    const { error: insertError } = await supabase
      .from('events')
      .insert(eventsWithCoordinates)

    if (insertError) {
      console.error('Error al insertar eventos:', insertError)
      return
    }

    console.log('Eventos de ejemplo insertados correctamente')
  } catch (error) {
    console.error('Error general:', error)
  }
}

// Ejecutar la función
insertSampleEvents()
