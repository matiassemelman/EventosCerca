import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, useColorMode } from '@chakra-ui/react';
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

// Componente para manejar la actualización del mapa
function MapUpdater({ center }) {
  const map = useMap();
  
  useEffect(() => {
    map.invalidateSize();
    map.setView(center, map.getZoom());
  }, [map, center]);
  
  return null;
}

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

        {validEvents.map((event, index) => {
          const lat = event.latitude || event.location?.coordinates?.[0];
          const lng = event.longitude || event.location?.coordinates?.[1];
          
          return (
            <Marker
              key={index}
              position={[lat, lng]}
            >
              <Popup>
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>{event.title}</h3>
                  <p style={{ marginBottom: '4px' }}>{event.description}</p>
                  <p style={{ color: '#666' }}>
                    Fecha: {new Date(event.date).toLocaleDateString()}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default EventMap;
