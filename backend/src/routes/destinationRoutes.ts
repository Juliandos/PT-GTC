import { Router } from 'express';
// @ts-ignore - express-validator v7 tiene problemas de tipos con ES Modules
import { body, query } from 'express-validator';
import {
  getAllDestinations,
  getDestinationById,
  createDestination,
  updateDestination,
  deleteDestination,
} from '../controllers/destinationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Destinations
 *   description: Operaciones CRUD para destinos turísticos
 */

// Validaciones para crear/actualizar destino
const destinationValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ min: 10, max: 500 })
    .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
  body('countryCode')
    .trim()
    .notEmpty()
    .withMessage('El código de país es requerido')
    .isLength({ min: 2, max: 2 })
    .withMessage('El código de país debe tener exactamente 2 caracteres')
    .isUppercase()
    .withMessage('El código de país debe estar en mayúsculas'),
  body('type')
    .isIn(['Beach', 'Mountain', 'City', 'Cultural', 'Adventure'])
    .withMessage('El tipo debe ser uno de: Beach, Mountain, City, Cultural, Adventure'),
];

// Validaciones para query parameters (paginación y filtros)
const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  query('type')
    .optional()
    .isIn(['Beach', 'Mountain', 'City', 'Cultural', 'Adventure'])
    .withMessage('El tipo debe ser uno de: Beach, Mountain, City, Cultural, Adventure'),
  query('countryCode')
    .optional()
    .isLength({ min: 2, max: 2 })
    .withMessage('El código de país debe tener exactamente 2 caracteres'),
];

/**
 * @swagger
 * /api/destinations:
 *   get:
 *     summary: Obtener todos los destinos con paginación y filtros
 *     tags: [Destinations]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Cantidad de resultados por página (máximo 100)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Beach, Mountain, City, Cultural, Adventure]
 *         description: Filtrar por tipo de destino
 *       - in: query
 *         name: countryCode
 *         schema:
 *           type: string
 *           pattern: '^[A-Z]{2}$'
 *         description: Filtrar por código de país (2 letras mayúsculas)
 *     responses:
 *       200:
 *         description: Lista de destinos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DestinationListResponse'
 *       400:
 *         description: Error de validación en los parámetros de consulta
 */
router.get('/', queryValidation, getAllDestinations);

/**
 * @swagger
 * /api/destinations/{id}:
 *   get:
 *     summary: Obtener un destino por ID
 *     tags: [Destinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino
 *     responses:
 *       200:
 *         description: Destino encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Destination'
 *       404:
 *         description: Destino no encontrado
 */
router.get('/:id', getDestinationById);

/**
 * @swagger
 * /api/destinations:
 *   post:
 *     summary: Crear un nuevo destino
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DestinationRequest'
 *     responses:
 *       201:
 *         description: Destino creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Destination'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado - Token requerido
 */
router.post('/', authenticateToken, destinationValidation, createDestination);

/**
 * @swagger
 * /api/destinations/{id}:
 *   put:
 *     summary: Actualizar un destino existente
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DestinationRequest'
 *     responses:
 *       200:
 *         description: Destino actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Destination'
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado - Token requerido
 *       403:
 *         description: No tienes permiso para modificar este destino
 *       404:
 *         description: Destino no encontrado
 */
router.put('/:id', authenticateToken, destinationValidation, updateDestination);

/**
 * @swagger
 * /api/destinations/{id}:
 *   delete:
 *     summary: Eliminar un destino
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino a eliminar
 *     responses:
 *       200:
 *         description: Destino eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Destino eliminado exitosamente
 *       401:
 *         description: No autenticado - Token requerido
 *       403:
 *         description: No tienes permiso para eliminar este destino
 *       404:
 *         description: Destino no encontrado
 */
router.delete('/:id', authenticateToken, deleteDestination);

export default router;

