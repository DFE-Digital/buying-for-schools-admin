const USERS_ERROR = 'USERS_ERROR'
const AUTHSECRET_ERROR = 'AUTHSECRET_ERROR'
const MONGO_ERROR = 'MONGO_ERROR'
const CONNECTION_ERROR = 'CONNECTION_ERROR'

const errors =  {
  USERS_ERROR,
  AUTHSECRET_ERROR,
  MONGO_ERROR,
  CONNECTION_ERROR,
  getErrorMessage: code => {
    switch(code) {
      case USERS_ERROR:
        return 'process.env.USERS is not correctly defined it should be a space separated list of user, a colon and password md5\'d'
      
      case AUTHSECRET_ERROR:
        return 'process.env.AUTHSECRET is not correctly defined it should be random, complex and longer than 15 chars'

      case MONGO_ERROR:
        return 'process.env.MONGO is not set it should be as per the connection string shown in the Azure Cosmos DB Connection String section with the addition of the database name added after the portnumber'

      case CONNECTION_ERROR:
        return 'Failed to connect to the mongo database a connection string was supplied but is incorrect'

      default: {
        return `Unknown error ${code}` 
      }
    }
  },
  log: codes => {
    codes.forEach(c => {
      console.log('ERROR', errors.getErrorMessage(c))
    })
  }
}

module.exports = errors