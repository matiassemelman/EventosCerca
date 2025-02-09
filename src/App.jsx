// Importación de componentes y hooks necesarios
import { ChakraProvider, Container } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Register } from './components/auth/Register'
import { Login } from './components/auth/Login'
import { AuthCallback } from './components/auth/AuthCallback'
import { Home } from './pages/Home'
import { LocationProvider } from './components/LocationProvider'
import { useEffect, useState } from 'react'

/**
 * Componente principal de la aplicación
 * Maneja el enrutamiento y el estado de los permisos de ubicación
 */
function App() {
  // Estado para controlar si los permisos de ubicación están habilitados
  const [locationEnabled, setLocationEnabled] = useState(false);

  useEffect(() => {
    // Verificar permisos de geolocalización al cargar la aplicación
    if ('permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' })
        .then(result => {
          if (result.state === 'granted') {
            setLocationEnabled(true);
          }
        });
    }
  }, []);

  return (
    <ChakraProvider>
      <BrowserRouter>
        {/* Renderizado condicional basado en permisos de ubicación */}
        {locationEnabled ? (
          // Si la ubicación está habilitada, envolver la app en LocationProvider
          <LocationProvider>
            <Container maxW="container.xl" py={8}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login setLocationEnabled={setLocationEnabled} />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
              </Routes>
            </Container>
          </LocationProvider>
        ) : (
          // Si la ubicación no está habilitada, mostrar la app sin LocationProvider
          <Container maxW="container.xl" py={8}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login setLocationEnabled={setLocationEnabled} />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
            </Routes>
          </Container>
        )}
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
