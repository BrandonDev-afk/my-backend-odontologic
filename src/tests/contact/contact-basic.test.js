const request = require('supertest');
const app = require('../../app');
const { ContactMessage } = require('../../models');

describe('POST /api/contact/send-message - Pruebas Básicas', () => {
  beforeEach(async () => {
    await ContactMessage.destroy({ where: {} });
  });

  afterEach(async () => {
    await ContactMessage.destroy({ where: {} });
  });

  test('envía mensaje exitosamente', async () => {
    const response = await request(app)
      .post('/api/contact/send-message')
      .send({
        name: 'Juan Pérez',
        email: 'juan@test.com',
        phone: '+57 300 123-4567',
        subject: 'consulta',
        message: 'Hola, me gustaría consultar sobre los servicios dentales disponibles.'
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Mensaje enviado correctamente. Te contactaremos pronto.');
    expect(response.body.data).toHaveProperty('id');
    expect(response.body.data).toHaveProperty('timestamp');
    expect(response.body.data).toHaveProperty('status');
  });

  test('valida campos requeridos', async () => {
    const response = await request(app)
      .post('/api/contact/send-message')
      .send({
        name: '',
        email: 'invalid-email',
        subject: 'invalid-subject',
        message: 'corto'
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Datos inválidos');
    expect(response.body.errors).toBeDefined();
  });

  test('valida formato de email', async () => {
    const response = await request(app)
      .post('/api/contact/send-message')
      .send({
        name: 'Juan Pérez',
        email: 'invalid-email-format',
        subject: 'consulta',
        message: 'Hola, me gustaría consultar sobre los servicios dentales disponibles.'
      });

    expect(response.status).toBe(400);
    expect(response.body.errors.email).toBeDefined();
  });

  test('guarda mensaje en la base de datos', async () => {
    const messageData = {
      name: 'Juan Pérez',
      email: 'juan@test.com',
      phone: '+57 300 123-4567',
      subject: 'consulta',
      message: 'Hola, me gustaría consultar sobre los servicios dentales disponibles.'
    };

    const response = await request(app)
      .post('/api/contact/send-message')
      .send(messageData);

    expect(response.status).toBe(200);

    // Esperar un poco para que se complete la operación de base de datos
    await new Promise(resolve => setTimeout(resolve, 100));

    const savedMessage = await ContactMessage.findOne({
      where: { email: messageData.email }
    });

    expect(savedMessage).toBeDefined();
    expect(savedMessage.name).toBe(messageData.name);
    expect(savedMessage.email).toBe(messageData.email);
    expect(savedMessage.phone).toBe(messageData.phone);
    expect(savedMessage.subject).toBe(messageData.subject);
    expect(savedMessage.message).toBe(messageData.message);
    expect(savedMessage.status).toBe('pending');
  });
}); 