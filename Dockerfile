FROM node:16-alpine

WORKDIR /usr/src/opcua-logger

COPY ./opcua-logger/package*.json ./

RUN npm install

COPY ./opcua-logger .

CMD [ "node", "./src/index.js" ]
