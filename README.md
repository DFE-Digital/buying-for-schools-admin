# Admin tool for Find a DfE approved framework for your school #

This project is to provide administration tools for the *Find a framework* service aka (Find a DfE approved framework for your school)

> Find a DfE approved framework for your school helps anyone within schools with a responsibility for buying/procurement to find a framework which best suits their needs.

> This help is given via a decision tree navigation which asks simple multiple choice questions, each answer narrowing down the frameworks until either one or a small number of frameworks can be recommended. The recommendations are links to frameworks offered by 3rd parties, as such any purchase/financial transaction takes place on the 3rd party site.

**Tech**

- Azure WebApp
- NodeJS
- Express
- Mongo (CosmosDB)
- React


## Install ##

For dev environment...

```sh
    npm install
```

For production environment...

```sh
    npm ci --only=production
```

...this excludes any dependencies required for testing the service or developing the service.


## npm scripts ##

### ` npm start ` ###
Start the service in it's normal state
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
The api will be running on [http://localhost:8000/api](http://localhost:8000/api)

### ` npm run start:dev ` ###
Start the service in dev mode, such that the api is restarted each time changes are made.

### ` npm test ` ###
Run all tests: jhint, mocha

### ` npm run test:jshint ` ###
Run jshint

### ` npm run test:api ` ###
Run Mocha unit tests on the api


## env variables ##

### ` PORT ` ###

Defines the port for serving the app, defaults: 8000


### ` USERS ` ###

**REQUIRED**

Sets the authenticated users for the admin tool, should be a space separated list of md5 hashes of user email, colon, password.

For example if the user is ` user@dfe.gov.uk ` and the password is ` dfe ` then the hash should be `md5( 'user@dfe.gov.uk:dfe' )` = ` 579b1220a4e48538c1989daf7a514f52 `, DON'T USE THIS ACTUAL VALUE.


### ` AUTHSECRET ` ###

**REQUIRED**

The auth secret is used to sign the JWT authentication token. Must be suitably long and random.


### ` MONGO ` ###

**REQUIRED**

The connection string to use to connect to a mongo database, it should be as per the connection string shown in the Azure Cosmos DB Connection String section **with** the addition of the database name added after the portnumber.


## Directory Structure ##

### server.js ###

Entrypoint to the application, this is the file which is started when app runs.

```sh
  node server.js
```

### /api ###

Contains everything to do with the API with the exception of the ` server.js ` file mentioned above.


### /public ###

Static asset items which are used by the front end, eg fonts, favicon etc.


### /src ###

Source code for the React front end.
