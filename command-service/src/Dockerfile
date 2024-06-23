FROM node:14

WORKDIR /usr/src/app

COPY client/package*.json ./client/

RUN cd client && npm install

COPY client/ ./client/

EXPOSE 3000

CMD ["node", "./client/client.js"]
