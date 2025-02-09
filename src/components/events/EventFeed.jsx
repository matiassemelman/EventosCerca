import { VStack, Spinner, Text, Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { EventCard } from './EventCard'

export function EventFeed({ userLocation }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [userLocation])

  const calculateDistance = (eventLat, eventLng) => {
    if (!userLocation) return null
    
    const R = 6371 // Earth's radius in km
    const dLat = (eventLat - userLocation.latitude) * (Math.PI / 180)
    const dLon = (eventLng - userLocation.longitude) * (Math.PI / 180)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.latitude * (Math.PI / 180)) * Math.cos(eventLat * (Math.PI / 180)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })

      if (error) throw error

      const eventsWithDistance = data.map(event => ({
        ...event,
        distance: calculateDistance(event.latitude, event.longitude)
      }))

      // Sort by distance if location is available, otherwise by date
      const sortedEvents = userLocation
        ? eventsWithDistance.sort((a, b) => a.distance - b.distance)
        : eventsWithDistance

      setEvents(sortedEvents)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Spinner size="xl" />
      </Box>
    )
  }

  if (events.length === 0) {
    return (
      <Box textAlign="center" p={4}>
        <Text fontSize="lg" color="gray.500">
          No hay eventos disponibles en este momento
        </Text>
      </Box>
    )
  }

  return (
    <VStack spacing={4} w="100%" p={4}>
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          distance={event.distance}
        />
      ))}
    </VStack>
  )
}
