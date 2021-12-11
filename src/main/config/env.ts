export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://mongo:27017/survey-api',
  port: process.env.PORT || 5050,
  bcryptSalt: 12,
  jwtSecret: process.env.JWT_SECRET || 'secret',
};
