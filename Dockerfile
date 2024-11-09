FROM node:20.18.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20.18.0 AS production

WORKDIR /app

EXPOSE 3000

ENV NODE_ENV production

CMD [ "npm", "run", "start" ]