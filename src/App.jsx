import { ChakraProvider, Container } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Register } from './components/auth/Register'
import { Home } from './pages/Home'

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <Container maxW="container.xl" py={8}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
