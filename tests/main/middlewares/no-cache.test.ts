import request from 'supertest';
import app from '@/main/config/app';

describe('No cache Middleware', () => {
  test('should disable cache', async () => {
    app.get('/test_no_cache', (req, res) => {
      res.send();
    });
    await request(app)
      .get('/test_no_cache')
      .expect('Cache-Control', 'no-cache, no-store, must-revalidate, proxy-revalidate')
      .expect('Pragma', 'no-cache')
      .expect('Expires', '0')
      .expect('Surrogate-Control', 'no-store');
  });
});
