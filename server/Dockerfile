FROM node:18-alpine

WORKDIR /app

COPY . .

RUN apk add tectonic && apk add pandoc-cli && npm install

CMD ["npm", "run", "start"]
