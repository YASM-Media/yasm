FROM node:latest

WORKDIR /server

COPY package.json .

RUN npm install

COPY . ./

ENV NODE_ENV=development
ENV DATABASE_HOST=localhost
ENV DATABASE_PORT=8080
ENV DATABASE_USER=user
ENV DATABASE_PASSWORD=password
ENV DATABASE_NAME=db
ENV DATABASE_URL=url
ENV PORT=5000

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]