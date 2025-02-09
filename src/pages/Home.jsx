import { Box, Heading, Button, useToast, VStack, HStack, Icon, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { EventFeed } from '../components/events/EventFeed'
import { FaMapMarkerAlt } from 'react-icons/fa'

export function Home({ locationEnabled, setLocationEnabled }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    if (locationEnabled) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
          setLocationEnabled(false)
        }
      )
    }
  }, [locationEnabled])

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: 'Sesión cerrada',
        description: '¡Hasta pronto!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true)
          toast({
            title: 'Ubicación activada',
            description: 'Ahora podrás ver eventos cercanos a ti',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        },
        (error) => {
          toast({
            title: 'Error',
            description: 'No se pudo obtener tu ubicación. Por favor, intenta de nuevo.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      )
    }
  }

  return (
    <Box maxW="container.xl" mx="auto" py={6}>
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" px={4}>
          <Heading size="lg">Eventos Cerca</Heading>
          <Button colorScheme="red" variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </HStack>

        {!locationEnabled && (
          <Box bg="blue.50" p={4} borderRadius="md" mx={4}>
            <HStack>
              <Icon as={FaMapMarkerAlt} color="blue.500" />
              <Text>
                Activa tu ubicación para ver eventos cercanos a ti
              </Text>
              <Button size="sm" colorScheme="blue" onClick={handleLocationPermission}>
                Activar Ubicación
              </Button>
            </HStack>
          </Box>
        )}

        <EventFeed userLocation={userLocation} />
      </VStack>
    </Box>
  )
}
