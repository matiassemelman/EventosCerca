# EventosCerca 2.0 🎉

Una aplicación móvil moderna para descubrir y participar en eventos locales.

## 🎯 Visión del Proyecto

EventosCerca es una aplicación que permite a los usuarios descubrir, explorar y participar en eventos cercanos a su ubicación. Combina un feed dinámico con un mapa interactivo para ofrecer una experiencia única en la búsqueda y participación de eventos locales.

## ✨ Características Principales

- 📱 Exploración de eventos como usuario invitado
- 📍 Geolocalización y mapa interactivo
- 📅 Feed dinámico de eventos
- 🔍 Filtros por categoría, distancia y fecha
- 📝 Detalles completos de eventos
- 🔔 Sistema de recordatorios

## 🛠️ Tecnologías

- **Frontend:** React Native/Flutter
- **Backend:** Supabase
- **Base de Datos:** PostgreSQL (via Supabase)
- **APIs:** Google Maps/Mapbox
- **CI/CD:** GitHub Actions

## 🚀 Configuración del Proyecto

### Prerrequisitos

- Node.js (versión recomendada: 18.x o superior)
- npm/yarn
- Cuenta en Supabase
- API Key de Google Maps/Mapbox

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/EventosCerca.git
   cd EventosCerca
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con tus credenciales

4. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## 📁 Estructura del Proyecto

```
EventosCerca/
├── src/
│   ├── components/     # Componentes reutilizables
│   ├── screens/        # Pantallas de la aplicación
│   ├── services/       # Servicios y APIs
│   ├── utils/          # Utilidades y helpers
│   └── navigation/     # Configuración de navegación
├── assets/            # Recursos estáticos
├── docs/             # Documentación adicional
└── tests/            # Tests unitarios y de integración
```

## 🧪 Testing

```bash
# Ejecutar tests unitarios
npm run test

# Ejecutar tests con coverage
npm run test:coverage
```

## 📝 Guías de Desarrollo

### Convenciones de Código

- Utilizar TypeScript para todo el código nuevo
- Seguir el estilo de código definido en ESLint
- Documentar componentes y funciones principales
- Escribir tests para nueva funcionalidad

### Flujo de Trabajo Git

1. Crear una nueva rama para cada feature/fix
2. Seguir convención de commits convencionales
3. Crear PR con descripción detallada
4. Esperar review y CI checks
5. Merge a main tras aprobación

## 📈 Roadmap

### Fase 1 - MVP
- [ ] Implementación de autenticación básica
- [ ] Feed de eventos
- [ ] Mapa interactivo básico
- [ ] Filtros esenciales

### Fase 2 - Mejoras
- [ ] Sistema de notificaciones
- [ ] Integración con calendarios
- [ ] Recomendaciones personalizadas
- [ ] Creación de eventos por usuarios

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👥 Contribución

Las contribuciones son bienvenidas. Por favor, lee [CONTRIBUTING.md](CONTRIBUTING.md) para detalles sobre nuestro código de conducta y el proceso para enviarnos pull requests.

## 📞 Soporte

Para soporte y preguntas, por favor crear un issue en el repositorio o contactar al equipo de desarrollo.
