// Importación de dependencias y componentes necesarios
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Spinner, 
  Center, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription, 
  Button,
  VStack,
  useToast
} from '@chakra-ui/react';
import { supabase } from '../../lib/supabase';
import { geolocationService } from '../../services/geolocationService';

/**
 * Componente de callback para autenticación
 * Maneja la redirección después del inicio de sesión exitoso
 * y solicita permisos de ubicación
 */
export function AuthCallback() {
  const navigate = useNavigate();
  const toast = useToast();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthAndLocation();
  }, []);

  const checkAuthAndLocation = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (!session) {
        navigate('/login');
        return;
      }

      // Verificar si ya tenemos los permisos de ubicación
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'granted') {
          // Si ya tenemos permisos, redirigir a la página principal
          window.location.href = '/';
        } else {
          setShowLocationPrompt(true);
          setLoading(false);
        }
      } else {
        // Si no hay API de permisos, redirigir a la página principal
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Error en checkAuthAndLocation:', error);
      toast({
        title: 'Error de autenticación',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
    }
  };

  const handleLocationPermission = async () => {
    try {
      setLoading(true);
      const position = await geolocationService.getCurrentPosition();
      window.location.href = '/';
    } catch (error) {
      toast({
        title: 'Error de ubicación',
        description: 'No se pudo obtener tu ubicación. Serás redirigido a la página principal.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      window.location.href = '/';
    }
  };

  const skipLocationPermission = () => {
    navigate('/');
  };

  if (loading && !showLocationPrompt) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (showLocationPrompt) {
    return (
      <Center h="100vh">
        <VStack spacing={4} maxW="md" p={6}>
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Permiso de ubicación
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Para mostrarte eventos cercanos, necesitamos acceder a tu ubicación.
              ¿Nos permites acceder a ella?
            </AlertDescription>
          </Alert>
          <Button colorScheme="blue" onClick={handleLocationPermission}>
            Permitir acceso a ubicación
          </Button>
          <Button variant="ghost" onClick={skipLocationPermission}>
            Continuar sin ubicación
          </Button>
        </VStack>
      </Center>
    );
  }

  return null;
}
