const express = require('express');
const { getConnection } = require('../db/connection');

const router = express.Router();

// Obtener todas las empresas
/**
 * @swagger
 * /empresa:
 *   get:
 *     summary: Obtener todas las empresas
 *     tags: [Empresa]
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   fecha_inicio:
 *                     type: string
 *                     format: date
 *                     example: "2023-01-01"
 *                   fecha_terminacion:
 *                     type: string
 *                     format: date
 *                     example: "2023-12-31"
 *                   total_dias_practica:
 *                     type: integer
 *                     example: 365
 *                   nit:
 *                     type: string
 *                     example: "123456789"
 *                   nombre_empresa:
 *                     type: string
 *                     example: "Empresa Ejemplo"
 *       500:
 *         description: Error al obtener las empresas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener las empresas.
 */
router.get('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM empresa');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener las empresas:', err);
        res.status(500).json({ error: 'Error al obtener las empresas.' });
    } finally {
        connection.release();
    }
});

// Obtener una empresa por ID
/**
 * @swagger
 * /empresa/{id}:
 *   get:
 *     summary: Obtener una empresa por ID
 *     tags: [Empresa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Detalles de la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                   example: "2023-01-01"
 *                 fecha_terminacion:
 *                   type: string
 *                   format: date
 *                   example: "2023-12-31"
 *                 total_dias_practica:
 *                   type: integer
 *                   example: 365
 *                 nit:
 *                   type: string
 *                   example: "123456789"
 *                 nombre_empresa:
 *                   type: string
 *                   example: "Empresa Ejemplo"
 *       404:
 *         description: Empresa no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Empresa no encontrada.
 *       500:
 *         description: Error al obtener la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener la empresa.
 */
router.get('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM empresa WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Empresa no encontrada.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener la empresa:', err);
        res.status(500).json({ error: 'Error al obtener la empresa.' });
    } finally {
        connection.release();
    }
});

// Crear una nueva empresa
/**
 * @swagger
 * /empresa:
 *   post:
 *     summary: Crear una nueva empresa
 *     tags: [Empresa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-01"
 *               fecha_terminacion:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-31"
 *               total_dias_practica:
 *                 type: integer
 *                 example: 365
 *               nit:
 *                 type: string
 *                 example: "123456789"
 *               nombre_empresa:
 *                 type: string
 *                 example: "Empresa Ejemplo"
 *     responses:
 *       201:
 *         description: Empresa creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 fecha_inicio:
 *                   type: string
 *                   format: date
 *                   example: "2023-01-01"
 *                 fecha_terminacion:
 *                   type: string
 *                   format: date
 *                   example: "2023-12-31"
 *                 total_dias_practica:
 *                   type: integer
 *                   example: 365
 *                 nit:
 *                   type: string
 *                   example: "123456789"
 *                 nombre_empresa:
 *                   type: string
 *                   example: "Empresa Ejemplo"
 *       500:
 *         description: Error al crear la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al crear la empresa.
 */
router.post('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const { fecha_inicio, fecha_terminacion, total_dias_practica, nit, nombre_empresa } = req.body;
        const [result] = await connection.query('INSERT INTO empresa (fecha_inicio, fecha_terminacion, total_dias_practica, nit, nombre_empresa) VALUES (?, ?, ?, ?, ?)',
            [fecha_inicio, fecha_terminacion, total_dias_practica, nit, nombre_empresa]);
        res.status(201).json({ id: result.insertId, fecha_inicio, fecha_terminacion, total_dias_practica, nit, nombre_empresa });
    } catch (err) {
        console.error('Error al crear la empresa:', err);
        res.status(500).json({ error: 'Error al crear la empresa.' });
    } finally {
        connection.release();
    }
});

// Actualizar una empresa por ID
/**
 * @swagger
 * /empresa/{id}:
 *   put:
 *     summary: Actualizar una empresa por ID
 *     tags: [Empresa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_inicio:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-01"
 *               fecha_terminacion:
 *                 type: string
 *                 format: date
 *                 example: "2023-12-31"
 *               total_dias_practica:
 *                 type: integer
 *                 example: 365
 *               nit:
 *                 type: string
 *                 example: "123456789"
 *               nombre_empresa:
 *                 type: string
 *                 example: "Empresa Ejemplo"
 *     responses:
 *       200:
 *         description: Empresa actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Empresa actualizada correctamente.
 *       500:
 *         description: Error al actualizar la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar la empresa.
 */
router.put('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const { fecha_inicio, fecha_terminacion, total_dias_practica, nit, nombre_empresa } = req.body;
        await connection.query('UPDATE empresa SET fecha_inicio = ?, fecha_terminacion = ?, total_dias_practica = ?, nit = ?, nombre_empresa = ? WHERE id = ?',
            [fecha_inicio, fecha_terminacion, total_dias_practica, nit, nombre_empresa, req.params.id]);
        res.json({ message: 'Empresa actualizada correctamente.' });
    } catch (err) {
        console.error('Error al actualizar la empresa:', err);
        res.status(500).json({ error: 'Error al actualizar la empresa.' });
    } finally {
        connection.release();
    }
});

// Eliminar una empresa por ID
/**
 * @swagger
 * /empresa/{id}:
 *   delete:
 *     summary: Eliminar una empresa por ID
 *     tags: [Empresa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la empresa
 *     responses:
 *       200:
 *         description: Empresa eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Empresa eliminada correctamente.
 *       500:
 *         description: Error al eliminar la empresa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al eliminar la empresa.
 */
router.delete('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        await connection.query('DELETE FROM empresa WHERE id = ?', [req.params.id]);
        res.json({ message: 'Empresa eliminada correctamente.' });
    } catch (err) {
        console.error('Error al eliminar la empresa:', err);
        res.status(500).json({ error: 'Error al eliminar la empresa.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
