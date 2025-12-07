import { Response } from 'express';
import { Destination } from '../models/index.js';
import { AuthRequest } from '../middleware/auth.js';

// Helper para validationResult (workaround para express-validator v7 con ES Modules)
const getValidationResult = async (req: AuthRequest) => {
  if (!validationResultFn) {
    const expressValidator = await import('express-validator');
    // @ts-ignore - express-validator v7 tiene problemas de tipos con ES Modules
    validationResultFn = expressValidator.validationResult;
  }
  return validationResultFn(req);
};

let validationResultFn: any;

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
 *         description: Cantidad de resultados por página
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
 *         description: Filtrar por código de país
 *     responses:
 *       200:
 *         description: Lista de destinos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 destinations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Destination'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
export const getAllDestinations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    if (req.query.type) {
      where.type = req.query.type;
    }
    if (req.query.countryCode) {
      where.countryCode = req.query.countryCode;
    }

    // Obtener destinos con paginación
    const { count, rows } = await Destination.findAndCountAll({
      where,
      limit,
      offset,
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      destinations: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Error en getAllDestinations:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al obtener los destinos',
    });
  }
};

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
export const getDestinationById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByPk(id);

    if (!destination) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Destino no encontrado',
      });
      return;
    }

    res.status(200).json(destination);
  } catch (error) {
    console.error('Error en getDestinationById:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al obtener el destino',
    });
  }
};

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
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - countryCode
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: Playa del Carmen
 *               description:
 *                 type: string
 *                 example: Hermosa playa en la Riviera Maya
 *               countryCode:
 *                 type: string
 *                 example: MX
 *               type:
 *                 type: string
 *                 enum: [Beach, Mountain, City, Cultural, Adventure]
 *                 example: Beach
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
 *         description: No autenticado
 */
export const createDestination = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = await getValidationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation Error',
        details: errors.array(),
      });
      return;
    }

    const { name, description, countryCode, type } = req.body;

    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no autenticado',
      });
      return;
    }

    const destination = await Destination.create({
      name,
      description,
      countryCode,
      type,
      userId: req.user.id,
      lastModif: new Date(),
    });

    res.status(201).json(destination);
  } catch (error: any) {
    console.error('Error en createDestination:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Validation Error',
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al crear el destino',
    });
  }
};

/**
 * @swagger
 * /api/destinations/{id}:
 *   put:
 *     summary: Actualizar un destino
 *     tags: [Destinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del destino
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               countryCode:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [Beach, Mountain, City, Cultural, Adventure]
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
 *         description: No autenticado
 *       403:
 *         description: No tienes permiso para modificar este destino
 *       404:
 *         description: Destino no encontrado
 */
export const updateDestination = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const errors = await getValidationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation Error',
        details: errors.array(),
      });
      return;
    }

    const { id } = req.params;
    const destination = await Destination.findByPk(id);

    if (!destination) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Destino no encontrado',
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no autenticado',
      });
      return;
    }

    // Verificar que el usuario es el propietario
    if (destination.userId !== req.user.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'No tienes permiso para modificar este destino',
      });
      return;
    }

    const { name, description, countryCode, type } = req.body;

    await destination.update({
      name: name || destination.name,
      description: description || destination.description,
      countryCode: countryCode || destination.countryCode,
      type: type || destination.type,
      lastModif: new Date(),
    });

    res.status(200).json(destination);
  } catch (error: any) {
    console.error('Error en updateDestination:', error);
    if (error.name === 'SequelizeValidationError') {
      res.status(400).json({
        error: 'Validation Error',
        message: error.message,
      });
      return;
    }
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al actualizar el destino',
    });
  }
};

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
 *         description: ID del destino
 *     responses:
 *       200:
 *         description: Destino eliminado exitosamente
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No tienes permiso para eliminar este destino
 *       404:
 *         description: Destino no encontrado
 */
export const deleteDestination = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const destination = await Destination.findByPk(id);

    if (!destination) {
      res.status(404).json({
        error: 'Not Found',
        message: 'Destino no encontrado',
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Usuario no autenticado',
      });
      return;
    }

    // Verificar que el usuario es el propietario
    if (destination.userId !== req.user.id) {
      res.status(403).json({
        error: 'Forbidden',
        message: 'No tienes permiso para eliminar este destino',
      });
      return;
    }

    await destination.destroy();

    res.status(200).json({
      message: 'Destino eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error en deleteDestination:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Error al eliminar el destino',
    });
  }
};

