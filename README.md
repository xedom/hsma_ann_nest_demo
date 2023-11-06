## Docker

First copy the `.env.example` file to `.env` and change the values if needed.

Containers:

- nest-api: http://localhost:3000
- swagger: http://localhost:3000/api
- mongo: http://localhost:27017
- mongo-express: http://localhost:8081 (user: admin, password: pass)

### development

```bash
# starting all the containers
npm run docker:start

# stopping all the containers
npm run docker:stop

# force rebuild all the containers
npm run docker:force
```

### production

```bash
# building image manually
docker build -t nestjs .

# start container independently
docker run -p80:3000 nest-api
```

## Installation

```bash
$ npm install
```

## Running the app locally

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
