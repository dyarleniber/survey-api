import paths from './paths';
import components from './components';
import schemas from './schemas';

export default {
  openapi: '3.0.0',
  info: {
    title: 'Survey API',
    description: 'Survey API built with TypeScript and MongoDB, using TDD, Clean Architecture, SOLID principles, and Design Patterns.',
    version: '1.0.0',
    contact: {
      name: 'Dyarlen Iber',
      email: 'dyarlen1@gmail.com',
    },
  },
  externalDocs: {
    description: 'API source code',
    url: 'https://github.com/dyarleniber/survey-api',
  },
  servers: [{
    url: '/api',
    description: 'Main server',
  }],
  tags: [{
    name: 'Login',
    description: 'User authentication',
  }, {
    name: 'Survey',
    description: 'Survey management',
  }],
  paths,
  schemas,
  components,
};
