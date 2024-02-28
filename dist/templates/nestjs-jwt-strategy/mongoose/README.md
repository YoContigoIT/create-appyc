<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Description

### CRUD technical test of users with authentication, documentation with swagger and connected to a database.

### System Requeriments
- Node.js 16.20.2 >=
- NPM 8.19.4 >=

### Technologies Tools
- Typescript 5
- Bcrypt
- JWT
- Passport
- TypeORM
- PostgreSQL
- SWC
- class-validator
- class-transformer

### Tasks
- [x] Create Nest project
- [x] Create CRUD Users
- [x] Create and validate User DTOs
- [x] Connect Database to persistance
- [x] Authentication
- [x] Swagger Documentation
- [x] Tests


### Environment Variables
In the root of the project create a __.env__ environment variable, paste the following and fill in each field.

``` env
PORT=
SECRET=
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_PORT=
```


## Installation

```bash
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run start:dev
```

## Test

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

### URL of the deployed API documentation: https://nestjs-challenge-dev-bbxd.1.us-1.fl0.io/api/docs

### Postman Collection: https://www.postman.com/altimetry-physicist-43422969/workspace/projects/collection/30299242-54d2cb16-d05f-4a2c-855f-17a59707a193?action=share&creator=30299242

### NestJS Documentation
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.
