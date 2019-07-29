const port = process.env.PORT || 5000
const api = require('./api/api')
const connectionString = process.env.S107D01_MONGO_01.replace(/\/s107d01-mongo-01\?/, '/testing?')
const config = {
  // dataSource: require('./api/adaptors/mongo/mongoAdaptor')({ connectionString: process.env.S107D01_MONGO_01 })
  // dataSource: require('./api/adaptors/lowdb/lowdbAdaptor')({ path: './_data.json' })
  dataSource: require('./api/adaptors/mongodoc/mongodocAdaptor')({ connectionString })
}

const app = api(config)

const server = app.listen(port, () => {
  console.log('Magic happens on port ' + port)
})
