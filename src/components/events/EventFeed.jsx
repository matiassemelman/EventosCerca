import { VStack, Spinner, Text, Box } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { supabase } from '../../lib/supabase'
import { EventCard } from './EventCard'

const EVENTS_PER_PAGE = 6

export function EventFeed({ userLocation }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const { ref, inView } = useInView({
    threshold: 0,
  })

  useEffect(() => {
    // Reset everything when location changes
    setEvents([])
    setPage(0)
    setHasMore(true)
    fetchEvents(0, true)
  }, [userLocation])

  useEffect(() => {
    if (inView && hasMore && !loading) {
      fetchEvents(page + 1)
    }
  }, [inView])

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

  const fetchEvents = async (currentPage, reset = false) => {
    try {
      setLoading(true)
      const from = currentPage * EVENTS_PER_PAGE
      const to = from + EVENTS_PER_PAGE - 1

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('date', new Date().toISOString())
        .order('date', { ascending: true })
        .range(from, to)

      if (error) throw error

      const eventsWithDistance = data.map(event => ({
        ...event,
        distance: calculateDistance(event.latitude, event.longitude)
      }))

      // Sort by distance if location is available, otherwise keep date sort
      const sortedEvents = userLocation
        ? eventsWithDistance.sort((a, b) => a.distance - b.distance)
        : eventsWithDistance

      setEvents(prev => reset ? sortedEvents : [...prev, ...sortedEvents])
      setPage(currentPage)
      setHasMore(data.length === EVENTS_PER_PAGE)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading && events.length === 0) {
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
      
      {/* Loading spinner for next page */}
      {hasMore && (
        <Box ref={ref} p={4} w="100%" textAlign="center">
          <Spinner size="md" />
        </Box>
      )}
    </VStack>
  )
}
