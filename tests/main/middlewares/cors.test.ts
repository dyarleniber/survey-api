import request from 'supertest';
import app from '../../../src/main/config/app';

describe('CORS Middleware', () => {
  test('should enable CORS', async () => {
    app.get('/test_cors', (req, res) => {
      res.send();
    });
    await request(app)
      .post('/test_cors')
      .expect('Access-Control-Allow-Origin', '*')
      .expect('Access-Control-Allow-Methods', '*')
      .expect('Access-Control-Allow-Headers', '*');
  });
});
