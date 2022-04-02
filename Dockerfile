FROM node:16.13.2 as base

WORKDIR /app
COPY package.json /app/

RUN npm i
COPY . .

ENV PORT 4000
EXPOSE $PORT

FROM base as production
RUN npm run build