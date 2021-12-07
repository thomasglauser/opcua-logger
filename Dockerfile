FROM node:17

WORKDIR /usr/src/opcua-logger

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "./src/index.js" ]
