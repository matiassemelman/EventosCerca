import { Box, Heading, Button, useToast, VStack, HStack, Icon, Text, Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { EventFeed } from '../components/events/EventFeed'
import { FaMapMarkerAlt, FaList } from 'react-icons/fa'
import EventMap from '../components/EventMap'

export function Home({ locationEnabled, setLocationEnabled }) {
  const navigate = useNavigate()
  const toast = useToast()
  const [userLocation, setUserLocation] = useState(null)
  const [events, setEvents] = useState([])

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

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
      
      if (error) throw error
      
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los eventos',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

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
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Heading size="lg">EventosCerca</Heading>
          <Button onClick={handleLogout} colorScheme="red" variant="outline">
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

        <Tabs isFitted variant="enclosed" flex="1">
          <TabList mb="1em">
            <Tab>
              <Icon as={FaList} mr={2} />
              Lista
            </Tab>
            <Tab>
              <Icon as={FaMapMarkerAlt} mr={2} />
              Mapa
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel p={0}>
              <EventFeed events={events} userLocation={userLocation} />
            </TabPanel>
            <TabPanel p={0} h="600px">
              <Box h="100%" w="100%">
                <EventMap events={events} />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  )
}
