import { Box, Image, Text, VStack, HStack, Icon } from '@chakra-ui/react'
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa'

// Imágenes por defecto según el tipo de evento o palabras clave en el título
const defaultImages = {
  concierto: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop',
  deportes: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop',
  teatro: 'https://images.unsplash.com/photo-1507924538820-ede94a04019d?w=800&auto=format&fit=crop',
  arte: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&auto=format&fit=crop',
  fiesta: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
  default: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=800&auto=format&fit=crop',
}

function getDefaultImage(title, description) {
  const text = (title + ' ' + (description || '')).toLowerCase()
  
  if (text.includes('concierto') || text.includes('música') || text.includes('show')) {
    return defaultImages.concierto
  }
  if (text.includes('deporte') || text.includes('partido') || text.includes('torneo')) {
    return defaultImages.deportes
  }
  if (text.includes('teatro') || text.includes('obra') || text.includes('musical')) {
    return defaultImages.teatro
  }
  if (text.includes('arte') || text.includes('exposición') || text.includes('galería')) {
    return defaultImages.arte
  }
  if (text.includes('fiesta') || text.includes('party') || text.includes('celebración')) {
    return defaultImages.fiesta
  }
  
  return defaultImages.default
}

export function EventCard({ event, distance }) {
  const { title, description, image, date, location } = event

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg="white"
      shadow="md"
      _hover={{ shadow: 'lg' }}
      transition="all 0.2s"
      cursor="pointer"
      onClick={() => {/* TODO: Navigate to event detail */}}
    >
      <Image
        src={image || getDefaultImage(title, description)}
        alt={title}
        objectFit="cover"
        h="200px"
        w="100%"
        fallback={<Image src={defaultImages.default} alt={title} objectFit="cover" h="200px" w="100%" />}
      />
      <VStack p={4} align="start" spacing={3}>
        <Text fontSize="xl" fontWeight="bold" noOfLines={1}>
          {title}
        </Text>
        <Text color="gray.600" noOfLines={2}>
          {description}
        </Text>
        <HStack spacing={4} color="gray.500">
          <HStack>
            <Icon as={FaClock} />
            <Text>{new Date(date).toLocaleDateString()}</Text>
          </HStack>
          <HStack>
            <Icon as={FaMapMarkerAlt} />
            <Text>{distance ? `${distance.toFixed(1)} km` : location}</Text>
          </HStack>
        </HStack>
      </VStack>
    </Box>
  )
}
