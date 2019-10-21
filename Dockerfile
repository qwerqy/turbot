FROM node:10-alpine
ENV NODE_ENV production

RUN mkdir -p /usr/src/tehbot/bot
WORKDIR /usr/src/tehbot/bot
COPY . .

RUN npm run tsc
EXPOSE 3000
CMD [ "node", ".build/main.js" ]
