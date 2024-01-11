FROM node:20-alpine

WORKDIR /home/web

RUN npm install -g npm@latest

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

CMD ["npm", "run", "build", "--", "--watch"]
