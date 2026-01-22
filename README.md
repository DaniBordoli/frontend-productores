# Ruta y Campo - Portal de Productores

Portal web para que los productores puedan solicitar transporte, hacer seguimiento de sus viajes y gestionar sus pedidos.

## 🚀 Características Implementadas

### ✅ Autenticación
- Login con email y contraseña
- Sesión persistente con JWT
- Protección de rutas

### ✅ Dashboard
- Vista general con estadísticas
- Total de viajes, en curso, pendientes y finalizados
- Acceso rápido a solicitar viaje
- Últimos viajes recientes

### ✅ Solicitar Viaje
- Formulario completo con:
  - Origen y destino (dirección, ciudad, provincia)
  - Tipo de destino (puerto/acopio)
  - Fecha programada
  - Tipo de carga
  - Peso en toneladas
  - Cantidad de camiones
  - Notas adicionales

### ✅ Mis Viajes
- Lista de todos los viajes del productor
- Búsqueda por número o ciudad
- Filtros por estado (todos, solicitado, en curso, finalizado)
- Vista de cards con información resumida

### ✅ Detalle de Viaje
- Información completa del viaje
- Ruta visual (origen → destino)
- Detalles de carga
- Transportista asignado (cuando aplique)
- Sistema de precios:
  - Precio base
  - Proponer precio personalizado
  - Precio confirmado
- Check-ins del viaje
- Historial de cambios

### ✅ Sistema de Precios
- Ver precio base estimado
- Proponer tarifa personalizada
- Modificar propuesta antes de confirmación
- Ver precio confirmado por Ruta y Campo

## 🛠️ Stack Tecnológico

- **React 19** - Framework UI
- **Vite** - Build tool
- **React Router DOM** - Navegación
- **Axios** - Cliente HTTP
- **TailwindCSS** - Estilos
- **Lucide React** - Iconos

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
```

## ⚙️ Configuración

Edita el archivo `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_WS_URL=ws://localhost:5000
```

## 🚀 Ejecución

### Desarrollo

```bash
npm run dev
```

El portal estará disponible en: http://localhost:5173

### Producción

```bash
npm run build
npm run preview
```

## 👤 Credenciales de Prueba

**Usuario Productor:**
- Email: `productor@test.com`
- Password: `productor123`

## 📱 Páginas Disponibles

- `/login` - Inicio de sesión
- `/` - Dashboard principal
- `/solicitar-viaje` - Formulario de solicitud
- `/viajes` - Lista de mis viajes
- `/viajes/:id` - Detalle de un viaje específico

## 🎨 Diseño

- **Responsive**: Funciona en móvil, tablet y desktop
- **Colores**: Verde (primary) para acciones principales
- **UX**: Interfaz limpia y fácil de usar
- **Feedback**: Loading states y mensajes de error claros

## 🔄 Flujo de Usuario

1. **Login** → Ingresar con credenciales
2. **Dashboard** → Ver resumen de viajes
3. **Solicitar Viaje** → Completar formulario
4. **Mis Viajes** → Ver lista y buscar
5. **Detalle** → Ver información completa
6. **Proponer Precio** → Negociar tarifa (opcional)
7. **Seguimiento** → Ver check-ins en tiempo real

## 📋 Estados de Viaje

- **Solicitado** - Pedido creado por el productor
- **Cotizando** - Ruta y Campo está validando
- **Confirmado** - Precio y condiciones cerradas
- **En Asignación** - Buscando transportistas
- **En Curso** - Viaje en progreso
- **Finalizado** - Viaje completado

## 🔗 Integración con Backend

El frontend consume los siguientes endpoints:

- `POST /api/auth/login` - Autenticación
- `GET /api/trips` - Listar viajes del productor
- `GET /api/trips/:id` - Detalle de viaje
- `POST /api/trips` - Crear solicitud de viaje
- `PATCH /api/trips/:id/propose-price` - Proponer precio

## 🐛 Troubleshooting

### Error de conexión
Verifica que el backend esté corriendo en `http://localhost:5000`

### Token expirado
Cierra sesión y vuelve a iniciar sesión

### No aparecen viajes
Verifica que el usuario tenga rol `productor` y esté asociado a un productor

## 📝 Próximas Features

- Upload de documentos (carta de porte, cupo)
- Notificaciones push en tiempo real
- Edición/cancelación de viajes
- Plantillas de viajes frecuentes
- Export de comprobantes

## 🤝 Soporte

Para ayuda o reportar problemas, contacta al equipo de Ruta y Campo.
