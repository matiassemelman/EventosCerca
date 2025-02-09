import { Box, Image, Text, VStack, HStack, Icon } from '@chakra-ui/react'
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa'

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
        src={image}
        alt={title}
        objectFit="cover"
        h="200px"
        w="100%"
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
