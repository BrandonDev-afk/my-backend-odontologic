// filepath: app.js
const express = require('express');
const cors = require('cors');

// Inicializar modelos y conexión a la base de datos
require('./models/index');

const authRouter = require('./routers/auth-router');
const userRouter = require('./routers/user-router');
const guestPatientRouter = require('./routers/guest-patient-router');
const appointmentRouter = require('./routers/appointment-router');
const especialidadRouter = require('./routers/especialidad-router');
const serviceTypeRouter = require('./routers/service-type-router');
const disponibilidadRouter = require('./routers/disponibilidad-router');
const contactRouter = require('./routers/contact-router');
const adminRouter = require('./routers/admin-router');
const errorHandler = require('./middleware/error-handler');
const app = express();

// Configuración de CORS
app.use(cors({
    // CAMBIAR A LA URL DONDE REALMENTE CORRE TU FRONTEND (Vite)
    origin: 'http://localhost:5173', // <--- ¡CAMBIADO A 5173!
    credentials: true // Si necesitas enviar cookies o cabeceras de autorización
}));

app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las solicitudes

// Rutas públicas para el flujo de citas como invitado (sin autenticación)
app.use('/api/especialidad', especialidadRouter); // GET /api/especialidad
app.use('/api/service-type', serviceTypeRouter); // GET /api/service-type/especialidad/:id
app.use('/api/disponibilidad', disponibilidadRouter); // GET /api/disponibilidad/especialidad/:id
app.use('/api/guest-patient', guestPatientRouter); // POST /api/guest-patient
app.use('/api/appointments', appointmentRouter); // POST /api/appointments/guest

// Rutas de contacto
app.use('/api/contact', contactRouter); // POST /api/contact/send-message

// Rutas de autenticación y usuario
app.use('/api', authRouter);
app.use('/api/user', userRouter);

// Rutas de administrador
app.use('/api/admin', adminRouter);

// Middleware global de manejo de errores (debe ir al final)
app.use(errorHandler);

module.exports = app;
