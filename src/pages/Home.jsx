import { Box, Heading, Button, useToast } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function Home() {
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

  return (
    <Box p={8} textAlign="center">
      <Heading mb={6}>Hola Mundo</Heading>
      <Button colorScheme="red" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </Box>
  )
}
