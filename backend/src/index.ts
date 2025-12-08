import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection } from './config/database.js';
import { setupSwagger } from './config/swagger.js';
import './models/associations.js'; // Importar asociaciones de modelos
import authRoutes from './routes/authRoutes.js';
import destinationRoutes from './routes/destinationRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Configuración de CORS
app.use(cors({
  origin: (origin, callback) => {
    // Permitir solicitudes sin origen (como de Postman o curl)
    if (!origin) return callback(null, true);
    
    // En producción, permitir dominios de Vercel y el FRONTEND_URL configurado
    if (process.env.NODE_ENV === 'production') {
      // Permitir cualquier subdominio de Vercel
      if (/^https:\/\/.*\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      
      // Permitir el FRONTEND_URL específico si está configurado
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }
      
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    
    // En desarrollo, permitir cualquier origen localhost
    if (origin.includes('localhost')) {
      return callback(null, true);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
})); // Permitir CORS
app.use(express.json()); // Parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Parsear URL encoded

// Configurar Swagger
setupSwagger(app);

// Ruta de salud/health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'HotelBediaX API is running',
    timestamp: new Date().toISOString()
  });
});

// Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to HotelBediaX API',
    version: '1.0.0',
    documentation: '/api-docs'
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationRoutes);

// Middleware de manejo de errores
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Middleware para rutas no encontradas (404)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Inicializar servidor
const startServer = async (): Promise<void> => {
  try {
    // Probar conexión a la base de datos
    await testConnection();
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check disponible en http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar aplicación
startServer();

export default app;
