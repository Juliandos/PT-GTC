import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.js';
import { AuthRequest } from '../middleware/auth.js';

// Importación dinámica de validationResult para ES Modules
let validationResultFn: any;
const getValidationResult = async (req: Request) => {
  if (!validationResultFn) {
    const expressValidator = await import('express-validator');
    // @ts-ignore - express-validator v7 tiene problemas de tipos con ES Modules
    validationResultFn = expressValidator.validationResult;
  }
  return validationResultFn(req);
};

dotenv.config();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: El email ya está registrado
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar errores de validación
    const errors = await getValidationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
      return;
    }

    const { email, password, name } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({
        error: 'Conflict',
        message: 'El email ya está registrado'
      });
      return;
    }

    // Crear nuevo usuario (el password se hashea automáticamente en el hook beforeCreate)
    const user = await User.create({
      email,
      password, // Se hashea automáticamente
      name
    });

    // Generar token JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está configurado');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const tokenOptions: SignOptions = {
      // @ts-ignore - '24h' es un valor válido para expiresIn
      expiresIn: expiresIn
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      tokenOptions
    );

    // Respuesta sin el password
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al registrar el usuario'
    });
  }
};

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Credenciales inválidas
 *       400:
 *         description: Error de validación
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // Verificar errores de validación
    const errors = await getValidationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation Error',
        details: errors.array()
      });
      return;
    }

    const { email, password } = req.body;

    // Buscar usuario por email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Email o contraseña incorrectos'
      });
      return;
    }

    // Verificar password usando el método del modelo
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Email o contraseña incorrectos'
      });
      return;
    }

    // Generar token JWT
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET no está configurado');
    }

    const expiresIn = process.env.JWT_EXPIRES_IN || '24h';
    const tokenOptions: SignOptions = {
      // @ts-ignore - '24h' es un valor válido para expiresIn
      expiresIn: expiresIn
    };

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      tokenOptions
    );

    // Respuesta sin el password
    res.status(200).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al iniciar sesión'
    });
  }
};

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener información del usuario actual
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no autenticado'
      });
      return;
    }

    // Buscar usuario completo en la base de datos
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'createdAt', 'updatedAt']
    });

    if (!user) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Usuario no encontrado'
      });
      return;
    }

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al obtener información del usuario'
    });
  }
};

