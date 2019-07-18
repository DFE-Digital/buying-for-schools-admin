const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const lowdbAdaptorFramework = require('./lowdbAdaptorFramework')
const lowdbAdaptorQuestion = require('./lowdbAdaptorQuestion')
const lowdbAdaptorGeneric = require('./lowdbAdaptorGeneric')


const lowdbAdaptor = options => {
  const adapter = new FileSync(options.path)
  const db = low(adapter)

  db.defaults({ question: [], framework: [], category: [], provider: [] })
  .write()

  return {
    question: lowdbAdaptorQuestion(db),
    framework: lowdbAdaptorFramework(db),
    provider: lowdbAdaptorGeneric(db, 'provider'),
    category: lowdbAdaptorGeneric(db, 'category'),
    db
  }
}

module.exports = lowdbAdaptor