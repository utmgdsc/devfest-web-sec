FROM node:18-alpine

WORKDIR /app

COPY ./package.json .

RUN apk add tectonic && apk add pandoc-cli && npm install

COPY . .

CMD ["npm", "run", "start"]
