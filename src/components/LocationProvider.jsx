import React, { useState } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import {
  Box,
  Text,
  Spinner,
  Button,
  VStack,
  useToast
} from '@chakra-ui/react';

export const LocationProvider = ({ children }) => {
  const [retrying, setRetrying] = useState(false);
  const { location, error, loading } = useGeolocation({ watch: true });
  const toast = useToast();

  const handleRetry = () => {
    setRetrying(true);
    window.location.reload(); // Forzar recarga para reintentar obtener la ubicación
  };

  if (loading && !retrying) {
    return (
      <Box textAlign="center" p={4}>
        <VStack spacing={4}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
          <Text>Obteniendo tu ubicación...</Text>
          <Text fontSize="sm" color="gray.500">
            Por favor, acepta los permisos de ubicación cuando el navegador los solicite
          </Text>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" p={4}>
        <VStack spacing={4}>
          <Text color="red.500" fontWeight="bold">
            No pudimos obtener tu ubicación
          </Text>
          <Text>{error}</Text>
          <Text fontSize="sm" color="gray.600">
            Para una mejor experiencia, necesitamos acceder a tu ubicación.
            Asegúrate de que:
          </Text>
          <VStack spacing={2} fontSize="sm" color="gray.600" align="start">
            <Text>• Los permisos de ubicación estén habilitados en tu navegador</Text>
            <Text>• Tu dispositivo tenga el GPS activado (en móviles)</Text>
            <Text>• Hayas aceptado compartir tu ubicación cuando se te solicitó</Text>
          </VStack>
          <Button
            colorScheme="blue"
            onClick={handleRetry}
            isLoading={retrying}
          >
            Reintentar
          </Button>
        </VStack>
      </Box>
    );
  }

  // Clone children with location prop
  return React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, { location });
    }
    return child;
  });
};
