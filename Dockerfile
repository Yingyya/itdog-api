FROM node:18.18.2

RUN mkdir -p /app

WORKDIR /app

COPY ./dist/ /app

RUN npm i @nestjs/core @nestjs/common rxjs reflect-metadata @nestjs/platform-express --save

ENV HTTP_PORT 8080

EXPOSE 8080

CMD [ "node", "main.js" ]
