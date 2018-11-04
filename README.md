# katty

## Install dependencies

`yarn install`

## Configuration

Change the development part with your database informations.

Configuration file per environment are located in `src/config` directory.

## Create database and execute migration

Execute the two following command in your terminal.

First create the database.

`node_modules/.bin/sequelize db:create`

Next execute migrations.

`node_modules/.bin/sequelize db:migrate`

## Start server with autoreload

`./node_modules/.bin/nodemon src/index.js`
