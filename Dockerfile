FROM node:12.19.0-alpine3.9

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm install --only=development

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
