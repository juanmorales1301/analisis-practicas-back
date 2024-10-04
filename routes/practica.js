const express = require('express');
const { getConnection } = require('../db/connection');

const router = express.Router();

// Obtener todas las prácticas
/**
 * @swagger
 * /practica:
 *   get:
 *     summary: Obtener todas las prácticas
 *     tags: [Practica]
 *     responses:
 *       200:
 *         description: Lista de prácticas
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
 *                   clasificaciones:
 *                     type: string
 *                     example: "Clasificación A"
 *                   no_folio:
 *                     type: string
 *                     example: "F12345"
 *                   fecha_entrega_facultad:
 *                     type: string
 *                     format: date
 *                     example: "2023-06-15"
 *                   numero_practica_inscribe:
 *                     type: integer
 *                     example: 2
 *                   fecha_inscripcion_materia:
 *                     type: string
 *                     format: date
 *                     example: "2023-01-10"
 *                   nrc:
 *                     type: string
 *                     example: "NRC123"
 *                   programa:
 *                     type: string
 *                     example: "Programa Ejemplo"
 *                   documento_estudiante:
 *                     type: string
 *                     example: "12345678"
 *                   id_empresa:
 *                     type: integer
 *                     example: 1
 *                   id_contacto:
 *                     type: integer
 *                     example: 1
 *                   id_jefe:
 *                     type: integer
 *                     example: 1
 *       500:
 *         description: Error al obtener las prácticas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener las prácticas.
 */
router.get('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM practica');
        res.json(rows);
    } catch (err) {
        console.error('Error al obtener las prácticas:', err);
        res.status(500).json({ error: 'Error al obtener las prácticas.' });
    } finally {
        connection.release();
    }
});

// Obtener una práctica por ID
/**
 * @swagger
 * /practica/{id}:
 *   get:
 *     summary: Obtener una práctica por ID
 *     tags: [Practica]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la práctica
 *     responses:
 *       200:
 *         description: Detalles de la práctica
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 clasificaciones:
 *                   type: string
 *                   example: "Clasificación A"
 *                 no_folio:
 *                   type: string
 *                   example: "F12345"
 *                 fecha_entrega_facultad:
 *                   type: string
 *                   format: date
 *                   example: "2023-06-15"
 *                 numero_practica_inscribe:
 *                   type: integer
 *                   example: 2
 *                 fecha_inscripcion_materia:
 *                   type: string
 *                   format: date
 *                   example: "2023-01-10"
 *                 nrc:
 *                   type: string
 *                   example: "NRC123"
 *                 programa:
 *                   type: string
 *                   example: "Programa Ejemplo"
 *                 documento_estudiante:
 *                   type: string
 *                   example: "12345678"
 *                 id_empresa:
 *                   type: integer
 *                   example: 1
 *                 id_contacto:
 *                   type: integer
 *                   example: 1
 *                 id_jefe:
 *                   type: integer
 *                   example: 1
 *       404:
 *         description: Práctica no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Práctica no encontrada.
 *       500:
 *         description: Error al obtener la práctica
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al obtener la práctica.
 */
router.get('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const rows = await connection.query('SELECT * FROM practica WHERE id = ?', [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Práctica no encontrada.' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error('Error al obtener la práctica:', err);
        res.status(500).json({ error: 'Error al obtener la práctica.' });
    } finally {
        connection.release();
    }
});

// Crear una nueva práctica
/**
 * @swagger
 * /practica:
 *   post:
 *     summary: Crear una nueva práctica
 *     tags: [Practica]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clasificaciones:
 *                 type: string
 *                 example: "Clasificación A"
 *               no_folio:
 *                 type: string
 *                 example: "F12345"
 *               fecha_entrega_facultad:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-15"
 *               numero_practica_inscribe:
 *                 type: integer
 *                 example: 2
 *               fecha_inscripcion_materia:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-10"
 *               nrc:
 *                 type: string
 *                 example: "NRC123"
 *               programa:
 *                 type: string
 *                 example: "Programa Ejemplo"
 *               documento_estudiante:
 *                 type: string
 *                 example: "12345678"
 *               id_empresa:
 *                 type: integer
 *                 example: 1
 *               id_contacto:
 *                 type: integer
 *                 example: 1
 *               id_jefe:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Práctica creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 clasificaciones:
 *                   type: string
 *                   example: "Clasificación A"
 *                 no_folio:
 *                   type: string
 *                   example: "F12345"
 *                 fecha_entrega_facultad:
 *                   type: string
 *                   format: date
 *                   example: "2023-06-15"
 *                 numero_practica_inscribe:
 *                   type: integer
 *                   example: 2
 *                 fecha_inscripcion_materia:
 *                   type: string
 *                   format: date
 *                   example: "2023-01-10"
 *                 nrc:
 *                   type: string
 *                   example: "NRC123"
 *                 programa:
 *                   type: string
 *                   example: "Programa Ejemplo"
 *                 documento_estudiante:
 *                   type: string
 *                   example: "12345678"
 *                 id_empresa:
 *                   type: integer
 *                   example: 1
 *                 id_contacto:
 *                   type: integer
 *                   example: 1
 *                 id_jefe:
 *                   type: integer
 *                   example: 1
 *       500:
 *         description: Error al crear la práctica
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al crear la práctica.
 */
router.post('/', async (req, res) => {
    const connection = await getConnection();
    try {
        const { clasificaciones, no_folio, fecha_entrega_facultad, numero_practica_inscribe, fecha_inscripcion_materia, nrc, programa, documento_estudiante, id_empresa, id_contacto, id_jefe } = req.body;
        const [result] = await connection.query('INSERT INTO practica (clasificaciones, no_folio, fecha_entrega_facultad, numero_practica_inscribe, fecha_inscripcion_materia, nrc, programa, documento_estudiante, id_empresa, id_contacto, id_jefe) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [clasificaciones, no_folio, fecha_entrega_facultad, numero_practica_inscribe, fecha_inscripcion_materia, nrc, programa, documento_estudiante, id_empresa, id_contacto, id_jefe]);
        res.status(201).json({ id: result.insertId, clasificaciones, no_folio, fecha_entrega_facultad, numero_practica_inscribe, fecha_inscripcion_materia, nrc, programa, documento_estudiante, id_empresa, id_contacto, id_jefe });
    } catch (err) {
        console.error('Error al crear la práctica:', err);
        res.status(500).json({ error: 'Error al crear la práctica.' });
    } finally {
        connection.release();
    }
});

// Actualizar una práctica por ID
/**
 * @swagger
 * /practica/{id}:
 *   put:
 *     summary: Actualizar una práctica por ID
 *     tags: [Practica]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la práctica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clasificaciones:
 *                 type: string
 *                 example: "Clasificación A"
 *               no_folio:
 *                 type: string
 *                 example: "F12345"
 *               fecha_entrega_facultad:
 *                 type: string
 *                 format: date
 *                 example: "2023-06-15"
 *               numero_practica_inscribe:
 *                 type: integer
 *                 example: 2
 *               fecha_inscripcion_materia:
 *                 type: string
 *                 format: date
 *                 example: "2023-01-10"
 *               nrc:
 *                 type: string
 *                 example: "NRC123"
 *               programa:
 *                 type: string
 *                 example: "Programa Ejemplo"
 *               documento_estudiante:
 *                 type: string
 *                 example: "12345678"
 *               id_empresa:
 *                 type: integer
 *                 example: 1
 *               id_contacto:
 *                 type: integer
 *                 example: 1
 *               id_jefe:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Práctica actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Práctica actualizada correctamente.
 *       500:
 *         description: Error al actualizar la práctica
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al actualizar la práctica.
 */
router.put('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        const { clasificaciones, no_folio, fecha_entrega_facultad, numero_practica_inscribe, fecha_inscripcion_materia, nrc, programa, documento_estudiante, id_empresa, id_contacto, id_jefe } = req.body;
        await connection.query('UPDATE practica SET clasificaciones = ?, no_folio = ?, fecha_entrega_facultad = ?, numero_practica_inscribe = ?, fecha_inscripcion_materia = ?, nrc = ?, programa = ?, documento_estudiante = ?, id_empresa = ?, id_contacto = ?, id_jefe = ? WHERE id = ?',
            [clasificaciones, no_folio, fecha_entrega_facultad, numero_practica_inscribe, fecha_inscripcion_materia, nrc, programa, documento_estudiante, id_empresa, id_contacto, id_jefe, req.params.id]);
        res.json({ message: 'Práctica actualizada correctamente.' });
    } catch (err) {
        console.error('Error al actualizar la práctica:', err);
        res.status(500).json({ error: 'Error al actualizar la práctica.' });
    } finally {
        connection.release();
    }
});

// Eliminar una práctica por ID
/**
 * @swagger
 * /practica/{id}:
 *   delete:
 *     summary: Eliminar una práctica por ID
 *     tags: [Practica]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la práctica
 *     responses:
 *       200:
 *         description: Práctica eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Práctica eliminada correctamente.
 *       500:
 *         description: Error al eliminar la práctica
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al eliminar la práctica.
 */
router.delete('/:id', async (req, res) => {
    const connection = await getConnection();
    try {
        await connection.query('DELETE FROM practica WHERE id = ?', [req.params.id]);
        res.json({ message: 'Práctica eliminada correctamente.' });
    } catch (err) {
        console.error('Error al eliminar la práctica:', err);
        res.status(500).json({ error: 'Error al eliminar la práctica.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
