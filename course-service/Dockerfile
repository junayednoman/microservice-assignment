FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5002

CMD ["npm", "run", "start"]