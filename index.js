const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = 3000;

const options = {
  definition: swaggerDocument,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Configura CORS para permitir todos los orígenes y encabezados
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept']
}));

// Middleware para analizar el cuerpo de las solicitudes entrantes como JSON
app.use(express.json());

app.use('/api', require('./routes/upload')); //Migrar información
app.use('/api/programa', require('./routes/programa')); //Endoints de Programa
app.use('/api/contacto', require('./routes/contacto')); // Endpoints de Contacto
app.use('/api/empresa', require('./routes/empresa')); // Endpoints de Empresa
app.use('/api/jefe', require('./routes/jefe')); // Endpoints de Jefe
app.use('/api/estudiante', require('./routes/estudiante')); // Endpoints de Estudiante
app.use('/api/practica', require('./routes/practica')); // Endpoints de Practica


app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
  console.log('Documentación disponible en http://localhost:3000/api-docs');
});
