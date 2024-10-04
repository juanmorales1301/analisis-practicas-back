const express = require('express');
const { getConnection } = require('../db/connection');

const router = express.Router();

// Obtener todos los estudiantes
/**
 * @swagger
 * /estudiante:
 *   get:
 *     summary: Obtener todos los estudiantes
 *     tags: [Estudiante]
 *     responses:
 *       200:
 *         description: Lista de estudiantes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   documento:
 *                     type: string
 *                     example: "12345678"
 *                   nombre:
 *                     type: string
 *                     example: "Juan Pérez"
 *                   edad:
 *                     type: integer
 *                     example: 20
 *                   direccion_residencia:
 *                     type: string
 *                     example: "Calle Falsa 123"
 *                   telefono_residencia:
 *                     type: string
 *                     example: "123456789"
 *                   celular:
 *                     type: string
 *                     example: "987654321"
 *       500:
 *         description: Error al obtener los estudiantes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener los estudiantes.
 */
router.get('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM estudiante');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener los estudiantes:', err);
        res.status(500).json({ error: 'Error al obtener los estudiantes.' });
    } finally {
        connection.release();
    }
});

// Obtener un estudiante por documento
/**
 * @swagger
 * /estudiante/{documento}:
 *   get:
 *     summary: Obtener un estudiante por documento
 *     tags: [Estudiante]
 *     parameters:
 *       - in: path
 *         name: documento
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del estudiante
 *     responses:
 *       200:
 *         description: Detalles del estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documento:
 *                   type: string
 *                   example: "12345678"
 *                 nombre:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 edad:
 *                   type: integer
 *                   example: 20
 *                 direccion_residencia:
 *                   type: string
 *                   example: "Calle Falsa 123"
 *                 telefono_residencia:
 *                   type: string
 *                   example: "123456789"
 *                 celular:
 *                   type: string
 *                   example: "987654321"
 *       404:
 *         description: Estudiante no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Estudiante no encontrado.
 *       500:
 *         description: Error al obtener el estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener el estudiante.
 */
router.get('/:documento', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM estudiante WHERE documento = ?', [req.params.documento]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Estudiante no encontrado.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener el estudiante:', err);
        res.status(500).json({ error: 'Error al obtener el estudiante.' });
    } finally {
        connection.release();
    }
});

// Crear un nuevo estudiante
/**
 * @swagger
 * /estudiante:
 *   post:
 *     summary: Crear un nuevo estudiante
 *     tags: [Estudiante]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               documento:
 *                 type: string
 *                 example: "12345678"
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               edad:
 *                 type: integer
 *                 example: 20
 *               direccion_residencia:
 *                 type: string
 *                 example: "Calle Falsa 123"
 *               telefono_residencia:
 *                 type: string
 *                 example: "123456789"
 *               celular:
 *                 type: string
 *                 example: "987654321"
 *     responses:
 *       201:
 *         description: Estudiante creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 documento:
 *                   type: string
 *                   example: "12345678"
 *                 nombre:
 *                   type: string
 *                   example: "Juan Pérez"
 *                 edad:
 *                   type: integer
 *                   example: 20
 *                 direccion_residencia:
 *                   type: string
 *                   example: "Calle Falsa 123"
 *                 telefono_residencia:
 *                   type: string
 *                   example: "123456789"
 *                 celular:
 *                   type: string
 *                   example: "987654321"
 *       500:
 *         description: Error al crear el estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al crear el estudiante.
 */
router.post('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const { documento, nombre, edad, direccion_residencia, telefono_residencia, celular } = req.body;
        const [result] = await connection.query('INSERT INTO estudiante (documento, nombre, edad, direccion_residencia, telefono_residencia, celular) VALUES (?, ?, ?, ?, ?, ?)', 
            [documento, nombre, edad, direccion_residencia, telefono_residencia, celular]);
        res.status(201).json({ documento, nombre, edad, direccion_residencia, telefono_residencia, celular });
    } catch (err) {
        console.error('Error al crear el estudiante:', err);
        res.status(500).json({ error: 'Error al crear el estudiante.' });
    } finally {
        connection.release();
    }
});

// Actualizar un estudiante por documento
/**
 * @swagger
 * /estudiante/{documento}:
 *   put:
 *     summary: Actualizar un estudiante por documento
 *     tags: [Estudiante]
 *     parameters:
 *       - in: path
 *         name: documento
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del estudiante
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: "Juan Pérez"
 *               edad:
 *                 type: integer
 *                 example: 20
 *               direccion_residencia:
 *                 type: string
 *                 example: "Calle Falsa 123"
 *               telefono_residencia:
 *                 type: string
 *                 example: "123456789"
 *               celular:
 *                 type: string
 *                 example: "987654321"
 *     responses:
 *       200:
 *         description: Estudiante actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estudiante actualizado correctamente.
 *       500:
 *         description: Error al actualizar el estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar el estudiante.
 */
router.put('/:documento', async (req, res) => {
    const connection = await getConnection();
    try {
        const { nombre, edad, direccion_residencia, telefono_residencia, celular } = req.body;
        await connection.query('UPDATE estudiante SET nombre = ?, edad = ?, direccion_residencia = ?, telefono_residencia = ?, celular = ? WHERE documento = ?', 
            [nombre, edad, direccion_residencia, telefono_residencia, celular, req.params.documento]);
        res.json({ message: 'Estudiante actualizado correctamente.' });
    } catch (err) {
        console.error('Error al actualizar el estudiante:', err);
        res.status(500).json({ error: 'Error al actualizar el estudiante.' });
    } finally {
        connection.release();
    }
});

// Eliminar un estudiante por documento
/**
 * @swagger
 * /estudiante/{documento}:
 *   delete:
 *     summary: Eliminar un estudiante por documento
 *     tags: [Estudiante]
 *     parameters:
 *       - in: path
 *         name: documento
 *         required: true
 *         schema:
 *           type: string
 *         description: Documento del estudiante
 *     responses:
 *       200:
 *         description: Estudiante eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estudiante eliminado correctamente.
 *       500:
 *         description: Error al eliminar el estudiante
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al eliminar el estudiante.
 */
router.delete('/:documento', async (req, res) => {
    const connection = await getConnection();
    try {
        await connection.query('DELETE FROM estudiante WHERE documento = ?', [req.params.documento]);
        res.json({ message: 'Estudiante eliminado correctamente.' });
    } catch (err) {
        console.error('Error al eliminar el estudiante:', err);
        res.status(500).json({ error: 'Error al eliminar el estudiante.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
