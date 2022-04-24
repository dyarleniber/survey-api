import 'module-alias/register';
import { MongoHelper } from '@/infra/db/mongodb/helpers';
import env from './config/env';

MongoHelper.connect(env.mongoUrl)
  .then(async () => {
    const app = (await import('./config/app')).default;
    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server is running on port ${env.port}`);
    });
  })
  // eslint-disable-next-line no-console
  .catch(console.error);
