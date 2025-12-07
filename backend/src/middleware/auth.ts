import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';

dotenv.config();

// Extender el tipo Request para incluir user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

/**
 * Middleware para verificar y validar tokens JWT
 * Extrae el token del header Authorization y verifica su validez
 */
export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener el token del header Authorization
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token de acceso requerido. Formato: Authorization: Bearer <token>'
      });
      return;
    }

    // Verificar y decodificar el token
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET no está configurado en las variables de entorno');
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error de configuración del servidor'
      });
      return;
    }

    // Verificar el token
    const decoded = jwt.verify(token, jwtSecret) as { userId: number; email: string };

    // Buscar el usuario en la base de datos
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'name']
    });

    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no encontrado'
      });
      return;
    }

    // Agregar información del usuario al request
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    // Continuar con el siguiente middleware
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token inválido o expirado'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Token expirado'
      });
      return;
    }

    console.error('Error en middleware de autenticación:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al verificar el token'
    });
  }
};

/**
 * Middleware opcional: verificar si el usuario es el propietario del recurso
 * Útil para proteger rutas donde el usuario solo puede acceder a sus propios recursos
 */
export const isOwner = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Usuario no autenticado'
    });
    return;
  }

  // El userId del recurso debe coincidir con el userId del usuario autenticado
  const resourceUserId = parseInt(req.params.userId || req.body.userId || '0');

  if (resourceUserId !== req.user.id) {
    res.status(403).json({
      error: 'Forbidden',
      message: 'No tienes permiso para acceder a este recurso'
    });
    return;
  }

  next();
};

