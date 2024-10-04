const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const { getConnection, getOrCreate } = require('../db/connection');

const router = express.Router();

// Configuración de Multer para almacenar los archivos subidos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Endpoint para subir el archivo Excel
/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Subir un archivo Excel
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: El archivo Excel a subir
 *     responses:
 *       200:
 *         description: Archivo procesado e insertado en la base de datos correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Archivo procesado e insertado en la base de datos correctamente.
 *       400:
 *         description: Error en la subida del archivo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No se ha subido ningún archivo.
 *       500:
 *         description: Error al insertar en la base de datos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error al insertar en la base de datos.
 */
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se ha subido ningún archivo.' });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = 'Datos'; // Nombre de la hoja que quieres leer
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
        return res.status(400).json({ error: `La hoja con nombre "${sheetName}" no existe.` });
    }

    const jsonData = xlsx.utils.sheet_to_json(worksheet);

    const connection = await getConnection();

    try {
        await connection.query('BEGIN');

        for (let i = 0; i < jsonData.length; i++) {
            const row = jsonData[i];

            const cargoContactoData = { nombre: row['CARGO DEL CONTACTO'] };
            const cargoContacto = await getOrCreate(connection, 'p_cargo_contacto', cargoContactoData, 'nombre');

            const contactoData = {
                nombre: row['CONTACTO'],
                telefono: row['TELEFONO CONTACTO'],
                celular: row['CELULAR CONTACTO'],
                email: row['E MAIL CONTACTO'],
                id_cargo_contacto: cargoContacto.id_cargo_contacto
            };
            const contacto = await getOrCreate(connection, 'p_contacto', contactoData, 'email');

            const empresaData = {
                nit: row['NIT'],
                razon_social: row['EMPRESA DONDE REALIZA LA PRÁCTICA'],
                direccion: row['DIRECCION CONTACTO'],
                id_jefe_inmediato: contacto.id_contacto
            };
            const empresa = await getOrCreate(connection, 'p_empresa', empresaData, 'nit');

            const programaData = { nombre: row['PROGRAMA'] };
            const programa = await getOrCreate(connection, 'p_programa', programaData, 'nombre');

            const estudianteData = {
                nombres: row['APELLIDOS Y NOMBRES'],
                edad: row['EDAD'],
                celular: row['CELULAR'],
                direccion: row['DIRECCION RESIDENCIA'],
                telefono: row['TELÉFONO RESIDENCIA'],
                email: row['CORREO JEFE INMEDIATO'],
                id_contacto: contacto.id_contacto
            };
            const estudiante = await getOrCreate(connection, 'p_estudiante', estudianteData, 'email');

            const practicaData = {
                id_programa: programa.id_programa,
                id_estudiante: estudiante.id_estudiante,
                id_empresa: empresa.id_empresa,
                fec_inicio: new Date((row['FECHA INICIO'] - (25567 + 2)) * 86400 * 1000),
                fec_termina: new Date((row['FECHA TERMINACIÓN'] - (25567 + 2)) * 86400 * 1000),
                dias_pract: row['TOTAL DIAS EN PRACTICA']
            };

            const [practicaRows] = await connection.query(`SELECT * FROM p_practica WHERE id_estudiante = ? AND id_empresa = ? AND id_programa = ?`, [estudiante.id_estudiante, empresa.id_empresa, programa.id_programa]);
            if (practicaRows.length > 0) {
                await connection.query(`UPDATE p_practica SET ? WHERE id_practica = ?`, [practicaData, practicaRows[0].id_practica]);
            } else {
                await connection.query(`INSERT INTO p_practica SET ?`, practicaData);
            }
        }

        await connection.query('COMMIT');
        res.json({ message: 'Archivo procesado e insertado en la base de datos correctamente.' });
    } catch (err) {
        await connection.query('ROLLBACK');
        console.error('Error al insertar en la base de datos:', err);
        res.status(500).json({ error: 'Error al insertar en la base de datos.' });
    } finally {
        connection.release();
    }
});

module.exports = router;
