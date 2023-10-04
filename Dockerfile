FROM node:12
WORKDIR /usr/src/app
COPY . .

ENV HOST 0.0.0.0

CMD ["npm", "start"]
