import { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, useColorMode, Flex, IconButton, Text } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Función para validar coordenadas
const isValidCoordinate = (lat, lng) => {
  return typeof lat === 'number' && 
         typeof lng === 'number' && 
         !isNaN(lat) && 
         !isNaN(lng) && 
         lat >= -90 && 
         lat <= 90 && 
         lng >= -180 && 
         lng <= 180;
};

// Función para formatear la fecha
const formatDate = (date) => {
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return null;
    }
    
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return dateObj.toLocaleDateString('es-ES', options);
  } catch (e) {
    return null;
  }
};

// Componente para manejar la actualización del mapa
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    map.invalidateSize();
    map.setView(center, map.getZoom());
  }, [map, center]);
  
  return null;
}

// Componente para el contenido del Popup
const PopupContent = ({ events, locationKey }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prev => {
      const newIndex = prev > 0 ? prev - 1 : 0;
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex(prev => {
      const newIndex = prev < events.length - 1 ? prev + 1 : prev;
      return newIndex;
    });
  };

  const currentEvent = events[currentIndex];
  const formattedDate = formatDate(currentEvent.date);

  const handleImageClick = () => {
    if (currentEvent.url) {
      window.open(currentEvent.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div style={{ minWidth: '300px', maxWidth: '350px' }}>
      {currentEvent.image && (
        <Box
          mb={3}
          borderRadius="md"
          overflow="hidden"
          position="relative"
          paddingTop="56.25%" // 16:9 aspect ratio
          cursor={currentEvent.url ? 'pointer' : 'default'}
          onClick={handleImageClick}
          _hover={currentEvent.url ? {
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.2s'
            }
          } : {}}
        >
          <img
            src={currentEvent.image}
            alt={currentEvent.title}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      )}
      <h3 style={{ 
        fontWeight: 'bold', 
        marginBottom: '8px',
        fontSize: '1.1rem',
        color: '#2D3748'
      }}>
        {currentEvent.title}
      </h3>
      <p style={{ 
        marginBottom: formattedDate ? '12px' : '16px',
        fontSize: '0.9rem',
        color: '#4A5568',
        lineHeight: '1.4'
      }}>
        {currentEvent.description}
      </p>
      
      {formattedDate && (
        <Flex 
          align="center" 
          mb={3}
          color="#718096"
          fontSize="0.85rem"
        >
          <Box as="span" mr={2}>
            <i className="far fa-calendar-alt"></i>
          </Box>
          {formattedDate}
        </Flex>
      )}
      
      {events.length > 1 && (
        <Flex 
          align="center" 
          justify="space-between" 
          mt={4}
          pt={3}
          borderTop="1px solid"
          borderColor="gray.200"
        >
          <IconButton
            icon={<ChevronLeftIcon />}
            size="sm"
            isDisabled={currentIndex === 0}
            onClick={handlePrev}
            aria-label="Evento anterior"
            variant="ghost"
            _hover={{ bg: 'gray.100' }}
          />
          <Text fontSize="sm" color="#718096">
            {currentIndex + 1} de {events.length}
          </Text>
          <IconButton
            icon={<ChevronRightIcon />}
            size="sm"
            isDisabled={currentIndex === events.length - 1}
            onClick={handleNext}
            aria-label="Siguiente evento"
            variant="ghost"
            _hover={{ bg: 'gray.100' }}
          />
        </Flex>
      )}
    </div>
  );
};

const EventMap = ({ events = [] }) => {
  const [center, setCenter] = useState([-34.6037, -58.3816]); // Default to Buenos Aires
  const [userLocation, setUserLocation] = useState(null);
  const { colorMode } = useColorMode();
  
  // Filtrar eventos con coordenadas válidas
  const validEvents = events.filter(event => 
    event && 
    isValidCoordinate(
      event.latitude || event.location?.coordinates?.[0],
      event.longitude || event.location?.coordinates?.[1]
    )
  );
  
  // Agrupar eventos por ubicación usando useMemo
  const groupedEvents = useMemo(() => {
    return validEvents.reduce((acc, event) => {
      const lat = event.latitude || event.location?.coordinates?.[0];
      const lng = event.longitude || event.location?.coordinates?.[1];
      const key = `${lat},${lng}`;
      
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(event);
      return acc;
    }, {});
  }, [validEvents]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = [position.coords.latitude, position.coords.longitude];
          setCenter(newLocation);
          setUserLocation({
            coords: newLocation,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <Box
      h="500px"
      w="100%"
      position="relative"
      overflow="hidden"
      borderRadius="lg"
      boxShadow="base"
      sx={{
        '.leaflet-container': {
          height: '100%',
          width: '100%',
          zIndex: 1
        }
      }}
    >
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />
        <MapUpdater center={center} />
        
        {userLocation && (
          <Marker position={userLocation.coords}>
            <Popup>
              <div>
                <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Tu ubicación</h3>
              </div>
            </Popup>
          </Marker>
        )}

        {Object.entries(groupedEvents).map(([locationKey, locationEvents]) => {
          const [lat, lng] = locationKey.split(',').map(Number);
          
          return (
            <Marker
              key={locationKey}
              position={[lat, lng]}
            >
              <Popup>
                <PopupContent
                  events={locationEvents}
                  locationKey={locationKey}
                />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default EventMap;
