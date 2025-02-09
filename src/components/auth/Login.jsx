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
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FcGoogle } from 'react-icons/fc';
import { supabase } from '../../lib/supabase';

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
        password,
      });

      if (error) {
        let errorMessage = error.message;
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Credenciales inválidas';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email no confirmado. Por favor verifica tu correo';
        }
        throw { message: errorMessage };
      }

      // Solicitar permisos de ubicación después del inicio de sesión exitoso
      if ('geolocation' in navigator) {
        const requestLocation = () => {
          return new Promise((resolve) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({ success: true, position });
              },
              (error) => {
                resolve({ success: false, error });
              },
              {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 30000
              }
            );
          });
        };

        const { success, error: geoError } = await requestLocation();
        
        if (success) {
          setLocationEnabled(true);
        } else {
          toast({
            title: 'Ubicación requerida',
            description: 'Para una mejor experiencia, por favor permite el acceso a tu ubicación y recarga la página.',
            status: 'warning',
            duration: 8000,
            isClosable: true,
          });
        }
      }

      if (rememberMe) {
        localStorage.setItem('userCredentials', JSON.stringify({ email, password }));
      } else {
        localStorage.removeItem('userCredentials');
      }

      toast({
        title: '¡Bienvenido!',
        description: 'Has iniciado sesión correctamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      navigate('/');
      
    } catch (error) {
      toast({
        title: 'Error al iniciar sesión',
        description: error.message,
        status: 'error',
        duration: 3000,
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
          redirectTo: `${window.location.origin}/auth/callback`
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
    <Box maxW="md" mx="auto" mt={8} p={6} borderWidth={1} borderRadius="lg">
      <form onSubmit={handleSubmit}>
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
    </Box>
  );
}
