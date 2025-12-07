import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Operaciones de autenticación de usuarios
 */

// Validaciones para registro
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
];

// Validaciones para login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('El email debe ser válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

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
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El email ya está registrado
 */
router.post('/register', registerValidation, register);

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
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginValidation, login);

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
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de autenticación requerido o inválido
 */
router.get('/me', authenticateToken, getMe);

export default router;

