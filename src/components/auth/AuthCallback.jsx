// Importación de dependencias y componentes necesarios
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner, Center } from '@chakra-ui/react';
import { supabase } from '../../lib/supabase';

/**
 * Componente de callback para autenticación
 * Maneja la redirección después del inicio de sesión exitoso
 * Muestra un spinner mientras procesa la autenticación
 */
export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Suscripción a cambios en el estado de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      // Redireccionar a la página principal cuando el usuario se ha autenticado
      if (event === 'SIGNED_IN') {
        navigate('/');
      }
    });

    // Limpieza de la suscripción al desmontar el componente
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  // Renderizar un spinner centrado mientras se procesa la autenticación
  return (
    <Center h="100vh">
      <Spinner size="xl" />
    </Center>
  );
}
