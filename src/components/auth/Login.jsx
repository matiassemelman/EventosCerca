// Importación de dependencias y componentes necesarios
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
  Link,
  Checkbox,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../lib/supabase';
import { geolocationService } from '../../services/geolocationService';

/**
 * Componente de inicio de sesión
 * Maneja la autenticación de usuarios mediante email/password y Google
 * @param {Function} setLocationEnabled - Función para actualizar el estado de permisos de ubicación
 */
export function Login({ setLocationEnabled }) {
  // Estados para el formulario y la interfaz
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  // Efecto para cargar credenciales guardadas
  useEffect(() => {
    const savedCredentials = localStorage.getItem('userCredentials');
    if (savedCredentials) {
      const { email: savedEmail, password: savedPassword } = JSON.parse(savedCredentials);
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  // Efecto para verificar permisos de ubicación existentes
  useEffect(() => {
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
          if (result.state === 'granted') {
            setLocationEnabled(true);
            setShowLocationPrompt(false);
          }
        });
    }
  }, [setLocationEnabled]);

  /**
   * Valida los campos del formulario
   * @returns {Boolean} Verdadero si el formulario es válido, falso de lo contrario
   */
  const validateForm = () => {
    const newErrors = {};
    
    // Validación de email
    if (!email) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      newErrors.email = 'Correo electrónico inválido';
    }

    // Validación de contraseña
    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Solicita permisos de ubicación al usuario
   */
  const requestLocationPermission = async () => {
    try {
      const position = await geolocationService.getCurrentPosition();
      setLocationEnabled(true);
      setShowLocationPrompt(false);
      toast({
        title: '¡Perfecto!',
        description: 'Ahora podremos mostrarte eventos cerca de tu ubicación.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Acceso a ubicación denegado',
        description: 'Sin acceso a tu ubicación, no podremos mostrarte eventos cercanos. Puedes cambiar esto en la configuración de tu navegador.',
        status: 'warning',
        duration: 8000,
        isClosable: true,
      });
      navigate('/');
    }
  };

  /**
   * Maneja el envío del formulario
   * @param {Event} e - Evento de envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Error de validación',
        description: 'Por favor corrige los errores en el formulario',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      if (rememberMe) {
        localStorage.setItem('userCredentials', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('userCredentials');
      }

      // Si el inicio de sesión es exitoso, verificar la ubicación o redirigir
      if (data?.user) {
        if ('permissions' in navigator) {
          const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
          if (permissionStatus.state === 'granted') {
            setLocationEnabled(true);
            navigate('/');
          } else {
            setShowLocationPrompt(true);
          }
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja el inicio de sesión con Google
   */
  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) throw error;
    } catch (error) {
      toast({
        title: 'Error al iniciar sesión con Google',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={8} maxWidth="400px" mx="auto">
      <VStack spacing={4} align="stretch">
        {showLocationPrompt ? (
          <Alert
            status="info"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            height="300px"
            borderRadius="md"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              ¡Encuentra eventos cerca de ti!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Para mostrarte los mejores eventos en tu área, necesitamos acceder a tu ubicación. 
              Esta información es esencial para brindarte una experiencia personalizada.
            </AlertDescription>
            <Button
              colorScheme="blue"
              mt={4}
              onClick={requestLocationPermission}
              isLoading={loading}
            >
              Permitir acceso a mi ubicación
            </Button>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <VStack spacing={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Iniciar Sesión
              </Text>
              
              <FormControl isRequired isInvalid={errors.email}>
                <FormLabel>Correo electrónico</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: undefined });
                  }}
                  placeholder="tucorreo@ejemplo.com"
                />
                <FormErrorMessage>{errors.email}</FormErrorMessage>
              </FormControl>

              <FormControl isRequired isInvalid={errors.password}>
                <FormLabel>Contraseña</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors({ ...errors, password: undefined });
                    }}
                    placeholder="Tu contraseña"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <Checkbox
                  isChecked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                >
                  Recordar mis credenciales
                </Checkbox>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="100%"
                isLoading={loading}
              >
                Iniciar Sesión
              </Button>

              <Text>
                ¿No tienes una cuenta?{' '}
                <Link color="blue.500" href="/signup">
                  Regístrate aquí
                </Link>
              </Text>
            </VStack>
          </form>
        )}
        <Box w="100%" mt={4}>
          <Button
            w="100%"
            variant="outline"
            leftIcon={<FcGoogle />}
            onClick={handleGoogleLogin}
            isLoading={loading}
          >
            Continuar con Google
          </Button>
        </Box>
      </VStack>
    </Box>
  );
}
