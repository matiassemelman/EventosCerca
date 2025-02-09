import { Box, Heading, Button, useToast, VStack } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Home({ locationEnabled, setLocationEnabled }) {
  const navigate = useNavigate()
  const toast = useToast()

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      toast({
        title: 'Sesión cerrada',
        description: '¡Hasta pronto!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      navigate('/login')
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleLocationPermission = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationEnabled(true)
          toast({
            title: 'Ubicación activada',
            description: 'Ahora podrás ver eventos cercanos a ti',
            status: 'success',
            duration: 3000,
            isClosable: true,
          })
        },
        (error) => {
          toast({
            title: 'Error',
            description: 'No se pudo obtener tu ubicación. Por favor, intenta de nuevo.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      )
    }
  }

  return (
    <Box p={8} textAlign="center">
      <VStack spacing={6}>
        <Heading>Hola Mundo</Heading>
        {!locationEnabled && (
          <Button colorScheme="blue" onClick={handleLocationPermission}>
            Permitir Ubicación
          </Button>
        )}
        <Button colorScheme="red" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </VStack>
    </Box>
  )
}
