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


### ` AUTHUSER ` ###

Sets the user for http basic auth - ONLY TO BE USED IN THE **TEST** and **DEV** environments.

For **PROD** env, do not use this, Azure Active Directory should be configured instead.


### ` AUTHPASS ` ###

Sets the password for http basic auth - ONLY TO BE USED IN THE **TEST** and **DEV** environments.

For **PROD** env, do not use this, Azure Active Directory should be configured instead.


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


## Data structure ##

The data structure in Mongo (Cosmos) is a little unsual for a number of reasons. Each entry in the DB is one version of the entire data of the site, so one record contains all the frameworks, questions, answers, provider and category information.

This is due mostly to the pricing of Micro$oft Cosmos, each collection (table) is priced separately and regardless of quantity of data stored, which incurs a cost disproportionate to the scale of the thing itself. Also the fact that there was expected to little dev support for this project after going live.

It is only possible due to the small scale of the app, typical content is forecast to be only approx.40 frameworks and a similar number of questions to determine a recommendation.

There are however benefits to storing all the data in one record: it is easy to keep _DRAFT_ , _LIVE_ and _ARCHIVE_ versions separate and revert or promote different versions of the site. Doing this means that changes can be pushed to LIVE without requiring any tech/dev resource being available.

Being a JSON based structure there is no issue when it comes to querying the data no matter how deep it may be nested.

The infrastructure is such that the test env of the service will access the database and consume the newest record with ` status: 'DRAFT' ` while the production env will access the same database and use the record with ` status: 'LIVE' `, although it is recognised that having test and prod envs accessing the same database is not ideal, without dev/tech support to push changes up through the env hierarchy there are no alternatives that do not involve the different envs talking to each other.


## Default data ##

When the app starts if the database is found to be empty then a default record will be created with DRAFT status this is to aid initial set up of the app and not intended as a backup, any changes made whilst using the admin tool will not be reflected in this default content. In case of disaster recovery this default content should not be relied on.
