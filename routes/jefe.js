const express = require('express');
const { getConnection } = require('../db/connection');

const router = express.Router();

// Obtener todos los jefes
/**
 * @swagger
 * /jefe:
 *   get:
 *     summary: Obtener todos los jefes
 *     tags: [Jefe]
 *     responses:
 *       200:
 *         description: Lista de jefes
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
 *                   nombre_jefe:
 *                     type: string
 *                     example: "Pedro Gómez"
 *                   telefono_jefe:
 *                     type: string
 *                     example: "123456789"
 *                   correo_jefe:
 *                     type: string
 *                     example: "pedro.gomez@example.com"
 *                   cargo_jefe:
 *                     type: string
 *                     example: "Gerente"
 *       500:
 *         description: Error al obtener los jefes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener los jefes.
 */
router.get('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM jefe');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener los jefes:', err);
        res.status(500).json({ error: 'Error al obtener los jefes.' });
    } finally {
        connection.release();
    }
});

// Obtener un jefe por ID
/**
 * @swagger
 * /jefe/{id}:
 *   get:
 *     summary: Obtener un jefe por ID
 *     tags: [Jefe]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del jefe
 *     responses:
 *       200:
 *         description: Detalles del jefe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre_jefe:
 *                   type: string
 *                   example: "Pedro Gómez"
 *                 telefono_jefe:
 *                   type: string
 *                   example: "123456789"
 *                 correo_jefe:
 *                   type: string
 *                   example: "pedro.gomez@example.com"
 *                 cargo_jefe:
 *                   type: string
 *                   example: "Gerente"
 *       404:
 *         description: Jefe no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Jefe no encontrado.
 *       500:
 *         description: Error al obtener el jefe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener el jefe.
 */
router.get('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM jefe WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Jefe no encontrado.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener el jefe:', err);
        res.status(500).json({ error: 'Error al obtener el jefe.' });
    } finally {
        connection.release();
    }
});

// Crear un nuevo jefe
/**
 * @swagger
 * /jefe:
 *   post:
 *     summary: Crear un nuevo jefe
 *     tags: [Jefe]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_jefe:
 *                 type: string
 *                 example: "Pedro Gómez"
 *               telefono_jefe:
 *                 type: string
 *                 example: "123456789"
 *               correo_jefe:
 *                 type: string
 *                 example: "pedro.gomez@example.com"
 *               cargo_jefe:
 *                 type: string
 *                 example: "Gerente"
 *     responses:
 *       201:
 *         description: Jefe creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre_jefe:
 *                   type: string
 *                   example: "Pedro Gómez"
 *                 telefono_jefe:
 *                   type: string
 *                   example: "123456789"
 *                 correo_jefe:
 *                   type: string
 *                   example: "pedro.gomez@example.com"
 *                 cargo_jefe:
 *                   type: string
 *                   example: "Gerente"
 *       500:
 *         description: Error al crear el jefe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al crear el jefe.
 */
router.post('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const { nombre_jefe, telefono_jefe, correo_jefe, cargo_jefe } = req.body;
        const [result] = await connection.query('INSERT INTO jefe (nombre_jefe, telefono_jefe, correo_jefe, cargo_jefe) VALUES (?, ?, ?, ?)',
            [nombre_jefe, telefono_jefe, correo_jefe, cargo_jefe]);
        res.status(201).json({ id: result.insertId, nombre_jefe, telefono_jefe, correo_jefe, cargo_jefe });
    } catch (err) {
        console.error('Error al crear el jefe:', err);
        res.status(500).json({ error: 'Error al crear el jefe.' });
    } finally {
        connection.release();
    }
});

// Actualizar un jefe por ID
/**
 * @swagger
 * /jefe/{id}:
 *   put:
 *     summary: Actualizar un jefe por ID
 *     tags: [Jefe]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del jefe
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_jefe:
 *                 type: string
 *                 example: "Pedro Gómez"
 *               telefono_jefe:
 *                 type: string
 *                 example: "123456789"
 *               correo_jefe:
 *                 type: string
 *                 example: "pedro.gomez@example.com"
 *               cargo_jefe:
 *                 type: string
 *                 example: "Gerente"
 *     responses:
 *       200:
 *         description: Jefe actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Jefe actualizado correctamente.
 *       500:
 *         description: Error al actualizar el jefe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar el jefe.
 */
router.put('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const { nombre_jefe, telefono_jefe, correo_jefe, cargo_jefe } = req.body;
        await connection.query('UPDATE jefe SET nombre_jefe = ?, telefono_jefe = ?, correo_jefe = ?, cargo_jefe = ? WHERE id = ?',
            [nombre_jefe, telefono_jefe, correo_jefe, cargo_jefe, req.params.id]);
        res.json({ message: 'Jefe actualizado correctamente.' });
    } catch (err) {
        console.error('Error al actualizar el jefe:', err);
        res.status(500).json({ error: 'Error al actualizar el jefe.' });
    } finally {
        connection.release();
    }
});

// Eliminar un jefe por ID
/**
 * @swagger
 * /jefe/{id}:
 *   delete:
 *     summary: Eliminar un jefe por ID
 *     tags: [Jefe]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del jefe
 *     responses:
 *       200:
 *         description: Jefe eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Jefe eliminado correctamente.
 *       500:
 *         description: Error al eliminar el jefe
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al eliminar el jefe.
 */
router.delete('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        await connection.query('DELETE FROM jefe WHERE id = ?', [req.params.id]);
        res.json({ message: 'Jefe eliminado correctamente.' });
    } catch (err) {
        console.error('Error al eliminar el jefe:', err);
        res.status(500).json({ error: 'Error al eliminar el jefe.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
