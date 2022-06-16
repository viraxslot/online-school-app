FROM node:16.15.1 as base
ENV NODE_ENV=development

WORKDIR /app
COPY package.json /app/

RUN npm i
COPY . .

ENV PORT 4000
EXPOSE $PORT

FROM base as production
ENV NODE_ENV=production
RUN npm run build