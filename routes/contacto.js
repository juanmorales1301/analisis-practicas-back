const express = require('express');
const { getConnection, getOrCreate } = require('../db/connection');

const router = express.Router();

// Obtener todos los contactos
/**
 * @swagger
 * /contacto:
 *   get:
 *     summary: Obtener todos los contactos
 *     tags: [Contacto]
 *     responses:
 *       200:
 *         description: Lista de contactos
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
 *                   nombre_contacto:
 *                     type: string
 *                     example: Juan Pérez
 *                   cargo_contacto:
 *                     type: string
 *                     example: Gerente
 *                   telefono_contacto:
 *                     type: string
 *                     example: "123456789"
 *                   celular_contacto:
 *                     type: string
 *                     example: "987654321"
 *                   email_contacto:
 *                     type: string
 *                     example: juan.perez@example.com
 *                   direccion_contacto:
 *                     type: string
 *                     example: Calle Falsa 123
 *       500:
 *         description: Error al obtener los contactos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener los contactos.
 */
router.get('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM contacto');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener los contactos:', err);
        res.status(500).json({ error: 'Error al obtener los contactos.' });
    } finally {
        connection.release();
    }
});

// Obtener un contacto por ID
/**
 * @swagger
 * /contacto/{id}:
 *   get:
 *     summary: Obtener un contacto por ID
 *     tags: [Contacto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contacto
 *     responses:
 *       200:
 *         description: Detalles del contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre_contacto:
 *                   type: string
 *                   example: Juan Pérez
 *                 cargo_contacto:
 *                   type: string
 *                   example: Gerente
 *                 telefono_contacto:
 *                   type: string
 *                   example: "123456789"
 *                 celular_contacto:
 *                   type: string
 *                   example: "987654321"
 *                 email_contacto:
 *                   type: string
 *                   example: juan.perez@example.com
 *                 direccion_contacto:
 *                   type: string
 *                   example: Calle Falsa 123
 *       404:
 *         description: Contacto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Contacto no encontrado.
 *       500:
 *         description: Error al obtener el contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener el contacto.
 */
router.get('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM contacto WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Contacto no encontrado.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener el contacto:', err);
        res.status(500).json({ error: 'Error al obtener el contacto.' });
    } finally {
        connection.release();
    }
});

// Crear un nuevo contacto
/**
 * @swagger
 * /contacto:
 *   post:
 *     summary: Crear un nuevo contacto
 *     tags: [Contacto]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_contacto:
 *                 type: string
 *                 example: Juan Pérez
 *               cargo_contacto:
 *                 type: string
 *                 example: Gerente
 *               telefono_contacto:
 *                 type: string
 *                 example: "123456789"
 *               celular_contacto:
 *                 type: string
 *                 example: "987654321"
 *               email_contacto:
 *                 type: string
 *                 example: juan.perez@example.com
 *               direccion_contacto:
 *                 type: string
 *                 example: Calle Falsa 123
 *     responses:
 *       201:
 *         description: Contacto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 nombre_contacto:
 *                   type: string
 *                   example: Juan Pérez
 *                 cargo_contacto:
 *                   type: string
 *                   example: Gerente
 *                 telefono_contacto:
 *                   type: string
 *                   example: "123456789"
 *                 celular_contacto:
 *                   type: string
 *                   example: "987654321"
 *                 email_contacto:
 *                   type: string
 *                   example: juan.perez@example.com
 *                 direccion_contacto:
 *                   type: string
 *                   example: Calle Falsa 123
 *       500:
 *         description: Error al crear el contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al crear el contacto.
 */
router.post('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const { nombre_contacto, cargo_contacto, telefono_contacto, celular_contacto, email_contacto, direccion_contacto } = req.body;
        const [result] = await connection.query(
            'INSERT INTO contacto (nombre_contacto, cargo_contacto, telefono_contacto, celular_contacto, email_contacto, direccion_contacto) VALUES (?, ?, ?, ?, ?, ?)',
            [nombre_contacto, cargo_contacto, telefono_contacto, celular_contacto, email_contacto, direccion_contacto]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (err) {
        console.error('Error al crear el contacto:', err);
        res.status(500).json({ error: 'Error al crear el contacto.' });
    } finally {
        connection.release();
    }
});

// Actualizar un contacto por ID
/**
 * @swagger
 * /contacto/{id}:
 *   put:
 *     summary: Actualizar un contacto por ID
 *     tags: [Contacto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contacto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre_contacto:
 *                 type: string
 *                 example: Juan Pérez
 *               cargo_contacto:
 *                 type: string
 *                 example: Gerente
 *               telefono_contacto:
 *                 type: string
 *                 example: "123456789"
 *               celular_contacto:
 *                 type: string
 *                 example: "987654321"
 *               email_contacto:
 *                 type: string
 *                 example: juan.perez@example.com
 *               direccion_contacto:
 *                 type: string
 *                 example: Calle Falsa 123
 *     responses:
 *       200:
 *         description: Contacto actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contacto actualizado correctamente.
 *       500:
 *         description: Error al actualizar el contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar el contacto.
 */
router.put('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const { nombre_contacto, cargo_contacto, telefono_contacto, celular_contacto, email_contacto, direccion_contacto } = req.body;
        await connection.query(
            'UPDATE contacto SET nombre_contacto = ?, cargo_contacto = ?, telefono_contacto = ?, celular_contacto = ?, email_contacto = ?, direccion_contacto = ? WHERE id = ?',
            [nombre_contacto, cargo_contacto, telefono_contacto, celular_contacto, email_contacto, direccion_contacto, req.params.id]
        );
        res.json({ message: 'Contacto actualizado correctamente.' });
    } catch (err) {
        console.error('Error al actualizar el contacto:', err);
        res.status(500).json({ error: 'Error al actualizar el contacto.' });
    } finally {
        connection.release();
    }
});

// Eliminar un contacto por ID
/**
 * @swagger
 * /contacto/{id}:
 *   delete:
 *     summary: Eliminar un contacto por ID
 *     tags: [Contacto]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del contacto
 *     responses:
 *       200:
 *         description: Contacto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Contacto eliminado correctamente.
 *       500:
 *         description: Error al eliminar el contacto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al eliminar el contacto.
 */
router.delete('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        await connection.query('DELETE FROM contacto WHERE id = ?', [req.params.id]);
        res.json({ message: 'Contacto eliminado correctamente.' });
    } catch (err) {
        console.error('Error al eliminar el contacto:', err);
        res.status(500).json({ error: 'Error al eliminar el contacto.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
