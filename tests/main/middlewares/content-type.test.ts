import request from 'supertest';
import app from '@/main/config/app';

describe('Content-Type Middleware', () => {
  test('should return default Content-Type as JSON', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_content_type')
      .expect('Content-Type', /json/);
  });

  test('should return XML Content-Type when defined', async () => {
    app.get('/test_content_type_xml', (req, res) => {
      res.type('xml');
      res.send();
    });
    await request(app)
      .get('/test_content_type_xml')
      .expect('Content-Type', /xml/);
  });
});
