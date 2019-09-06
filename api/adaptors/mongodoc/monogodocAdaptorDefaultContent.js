const defaultData = async (collection) => {
  const count = await collection.count()
  console.log(typeof count, count)
  if (count !== 0) {
    return
  }
  console.log('\n\n## importing defaultdata.json ##')
  const data = require('./defaultdata.json')
  data.title = 'Default data'
  data.status = 'DRAFT'
  await collection.create(data)
  console.log('## importing complete ##\n\n')
}

exports = module.exports = defaultData
