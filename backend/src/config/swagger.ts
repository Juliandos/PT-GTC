import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'HotelBediaX API',
      version: '1.0.0',
      description: 'API REST para la gestión de destinos turísticos de HotelBediaX',
      contact: {
        name: 'API Support',
        email: 'support@hotelbediax.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa el token JWT obtenido del endpoint /api/auth/login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario',
              example: 1
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'user@example.com'
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan Pérez'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        Destination: {
          type: 'object',
          required: ['name', 'description', 'countryCode', 'type'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del destino',
              example: 1
            },
            name: {
              type: 'string',
              description: 'Nombre del destino',
              example: 'Playa del Carmen'
            },
            description: {
              type: 'string',
              description: 'Descripción del destino',
              example: 'Hermosa playa en la Riviera Maya'
            },
            countryCode: {
              type: 'string',
              description: 'Código del país (ISO 3166-1 alpha-2)',
              example: 'MX'
            },
            type: {
              type: 'string',
              enum: ['Beach', 'Mountain', 'City', 'Cultural', 'Adventure'],
              description: 'Tipo de destino',
              example: 'Beach'
            },
            lastModif: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última modificación'
            },
            userId: {
              type: 'integer',
              description: 'ID del usuario que creó el destino',
              example: 1
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de última actualización'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error',
              example: 'Error message'
            },
            details: {
              type: 'string',
              description: 'Detalles adicionales del error'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña (mínimo 6 caracteres)',
              example: 'password123',
              minLength: 6
            },
            name: {
              type: 'string',
              description: 'Nombre del usuario',
              example: 'Juan Pérez',
              minLength: 2
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email del usuario',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'Contraseña del usuario',
              example: 'password123'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              description: 'Token JWT para autenticación',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            },
            user: {
              $ref: '#/components/schemas/User'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Auth',
        description: 'Endpoints de autenticación'
      },
      {
        name: 'Destinations',
        description: 'Endpoints para gestión de destinos'
      }
    ]
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'HotelBediaX API Documentation'
  }));
};

export default swaggerSpec;

