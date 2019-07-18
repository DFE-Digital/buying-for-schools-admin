const port = process.env.PORT || 5000
const api = require('./api/api')

const config = {
  dataSource: require('./api/adaptors/mongo/mongoAdaptor')({ connectionString: process.env.S107D01_MONGO_01 })
  // dataSource: require('./api/adaptors/lowdb/lowdbAdaptor')({ path: './_data.json' })
}

const app = api(config)

const server = app.listen(port, () => {
  console.log('Magic happens on port ' + port)
})
