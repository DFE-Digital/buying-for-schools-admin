const { helpers } = require('./setup')()

after(done => {
  helpers.dropCollections()
  .then(() => {
    console.log('All finished')  
    done()
  }).catch(err => {
    console.log(err)
    done()
  })
})