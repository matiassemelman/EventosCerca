import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { Box, Input, Button, VStack, Text, useToast } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Componente para actualizar la vista del mapa
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [map, center]);
  return null;
}

// Componente para manejar eventos de click en el mapa
function MapClickHandler({ onLocationSelect }) {
  const map = useMap();
  useEffect(() => {
    map.on('click', (e) => {
      onLocationSelect([e.latlng.lat, e.latlng.lng]);
    });
  }, [map, onLocationSelect]);
  return null;
}

export default function LocationPicker({ onLocationSelect, initialLocation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState(initialLocation || [-34.6037, -58.3816]);
  const [isSearching, setIsSearching] = useState(false);
  const toast = useToast();
  const searchTimeoutRef = useRef(null);

  // Función para buscar ubicación usando Nominatim
  const searchLocation = async (query) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const newPosition = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        setPosition(newPosition);
        onLocationSelect(newPosition);
      } else {
        toast({
          title: "Ubicación no encontrada",
          description: "Intenta con una dirección más específica",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error al buscar ubicación",
        description: "Por favor intenta nuevamente",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Manejar cambios en la búsqueda con debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      searchLocation(value);
    }, 1000);
  };

  // Obtener ubicación actual
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = [position.coords.latitude, position.coords.longitude];
          setPosition(newPosition);
          onLocationSelect(newPosition);
          toast({
            title: "Ubicación actual obtenida",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        },
        (error) => {
          toast({
            title: "Error al obtener ubicación",
            description: "Verifica que hayas dado permiso de ubicación",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      );
    }
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <VStack spacing={4} width="100%">
      <Box position="relative" width="100%">
        <Input
          placeholder="Buscar ubicación..."
          value={searchQuery}
          onChange={handleSearchChange}
          pr="4.5rem"
          isDisabled={isSearching}
        />
        <Button
          position="absolute"
          right="0"
          top="0"
          h="100%"
          onClick={() => searchLocation(searchQuery)}
          isLoading={isSearching}
        >
          <SearchIcon />
        </Button>
      </Box>

      <Button
        onClick={getCurrentLocation}
        colorScheme="blue"
        width="100%"
      >
        Usar mi ubicación actual
      </Button>

      <Box height="400px" width="100%" position="relative">
        <MapContainer
          center={position}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} />
          <MapUpdater center={position} />
          <MapClickHandler onLocationSelect={(pos) => {
            setPosition(pos);
            onLocationSelect(pos);
          }} />
        </MapContainer>
      </Box>

      <Text fontSize="sm" color="gray.500">
        Haz clic en el mapa para ajustar la ubicación manualmente
      </Text>
    </VStack>
  );
}
