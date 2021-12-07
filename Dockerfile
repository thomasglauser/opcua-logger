FROM node:17-alpine

RUN apk add --no-cache openssl

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/opcua-logger

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "./src/index.js" ]
