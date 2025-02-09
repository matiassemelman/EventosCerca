import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
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

// Icono personalizado para la ubicación del usuario
const userLocationIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

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
  const mapRef = useRef(null);
  
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

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    }, 100);
    return () => clearTimeout(timeoutId);
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
        ref={mapRef}
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
          <>
            <Marker
              position={userLocation.coords}
              icon={userLocationIcon}
            >
              <Popup>
                <div>
                  <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Tu ubicación</h3>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userLocation.coords}
              radius={1}
              pathOptions={{
                color: '#2196F3',
                fillColor: '#2196F3',
                fillOpacity: 0.15
              }}
            />
          </>
        )}

        {events.map((event) => (
          <Marker
            key={event.id}
            position={[event.latitude, event.longitude]}
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
        ))}
      </MapContainer>
    </Box>
  );
};

export default EventMap;
