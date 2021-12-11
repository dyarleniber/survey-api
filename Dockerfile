FROM node:14
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --only=production
COPY dist dist
EXPOSE 8080
CMD npm start
