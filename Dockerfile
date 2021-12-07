FROM node:16-alpine

WORKDIR /usr/src/opcua-logger

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "./src/index.js" ]
