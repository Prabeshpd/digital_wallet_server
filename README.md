# digital_wallet_server

# Setup

- Requires Node 16.13.0 (Gallium) or above.
- Postgres Server
- Redis

---

## Installation

Clone the repository, install the dependencies and get started right away. Make sure you already have `nodejs`, `npm` and `yarn` installed in your system.

```sh
git git@github.com:Prabeshpd/digital_wallet_server.git
cd digital_wallet_server
cp .env.example .env
yarn
```

---

## Environment Variables

Set environment variables in your env file:

---

## Database Migrations

You can run the migrations by the following command

```bash
yarn migrate
```

---

## Start Application

To start the application in dev.

```bash
yarn start:dev
```

---

### RUN TEST

```bash
yarn test
```

---

## Test Workflow

Unit test are run on the CI-Workflow but for now the end to end test are skipped in CI environment. This is because we do not have provision to setup the databases on CI workflow. We can create an test database on an rds instance or any other database instance which is already running from an script with provided env variables. Then we can migrate our database using

```bash
yarn migrate
```

Then we can have a seed script to insert our data for test and then we can assert the end to end test. For, now it is being assumed that in local environment test database is already setup with migrations.

Tools used for testing are

- mocha.
- chai
- sinon
- supertest

---

## Manage ENV Variable

To manage env variable we can have `vault` to store our database credentials and dynamic secrets that is needed to run the environment. We can have a vault agent to rotate our secret of vault and access the credentials from the vault api interface.
Or we can have a agent that populates our env file whenever a change is encountered in vault credentials.

---

## RELEASE CONVENTION

[Release Convention](./RELEASE.md)
