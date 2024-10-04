const express = require('express');
const { getConnection, getOrCreate } = require('../db/connection');

const router = express.Router();

// Obtener todos los programas
/**
 * @swagger
 * /programa:
 *   get:
 *     summary: Obtener todos los programas
 *     tags: [Programa]
 *     responses:
 *       200:
 *         description: Lista de programas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_programa:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "Programa Ejemplo"
 *       500:
 *         description: Error al obtener los programas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener los programas.
 */
router.get('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM p_programa');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener los programas:', err);
        res.status(500).json({ error: 'Error al obtener los programas.' });
    } finally {
        connection.release();
    }
});

// Obtener un programa por ID
/**
 * @swagger
 * /programa/{id}:
 *   get:
 *     summary: Obtener un programa por ID
 *     tags: [Programa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del programa
 *     responses:
 *       200:
 *         description: Detalles del programa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_programa:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Programa Ejemplo"
 *       404:
 *         description: Programa no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Programa no encontrado.
 *       500:
 *         description: Error al obtener el programa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener el programa.
 */
router.get('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM p_programa WHERE id_programa = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Programa no encontrado.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener el programa:', err);
        res.status(500).json({ error: 'Error al obtener el programa.' });
    } finally {
        connection.release();
    }
});

// Crear un nuevo programa
/**
 * @swagger
 * /programa:
 *   post:
 *     summary: Crear un nuevo programa
 *     tags: [Programa]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Programa Ejemplo"
 *     responses:
 *       201:
 *         description: Programa creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_programa:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "Programa Ejemplo"
 *       500:
 *         description: Error al crear el programa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al crear el programa.
 */
router.post('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const { nombre } = req.body;
        const [result] = await connection.query('INSERT INTO p_programa (nombre) VALUES (?)', [nombre]);
        res.status(201).json({ id_programa: result.insertId, nombre });
    } catch (err) {
        console.error('Error al crear el programa:', err);
        res.status(500).json({ error: 'Error al crear el programa.' });
    } finally {
        connection.release();
    }
});

// Actualizar un programa por ID
/**
 * @swagger
 * /programa/{id}:
 *   put:
 *     summary: Actualizar un programa por ID
 *     tags: [Programa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del programa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Programa Ejemplo"
 *     responses:
 *       200:
 *         description: Programa actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Programa actualizado correctamente.
 *       500:
 *         description: Error al actualizar el programa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar el programa.
 */
router.put('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const { nombre } = req.body;
        await connection.query('UPDATE p_programa SET nombre = ? WHERE id_programa = ?', [nombre, req.params.id]);
        res.json({ message: 'Programa actualizado correctamente.' });
    } catch (err) {
        console.error('Error al actualizar el programa:', err);
        res.status(500).json({ error: 'Error al actualizar el programa.' });
    } finally {
        connection.release();
    }
});

// Eliminar un programa por ID
/**
 * @swagger
 * /programa/{id}:
 *   delete:
 *     summary: Eliminar un programa por ID
 *     tags: [Programa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del programa
 *     responses:
 *       200:
 *         description: Programa eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Programa eliminado correctamente.
 *       500:
 *         description: Error al eliminar el programa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al eliminar el programa.
 */
router.delete('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        await connection.query('DELETE FROM p_programa WHERE id_programa = ?', [req.params.id]);
        res.json({ message: 'Programa eliminado correctamente.' });
    } catch (err) {
        console.error('Error al eliminar el programa:', err);
        res.status(500).json({ error: 'Error al eliminar el programa.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
