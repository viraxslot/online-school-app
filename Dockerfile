FROM node:16.13.2 as base
ENV NODE_ENV=dev

WORKDIR /app
COPY package.json /app/

RUN npm i
COPY . .

ENV PORT 4000
EXPOSE $PORT

FROM base as production
ENV NODE_ENV=production
RUN npm run build