const expect = require('chai').expect
const setup = require('./setup')

let helpers

describe('testing dashboard', () => {
  before(async () => {
    helpers = await setup()
  })

  it('should be have appropriate heading', async () => {
    await helpers.gotoPage('/')
    const heading = await helpers.getText('h1')
    expect(heading).to.equal('Dashboard')
  })

  it('should display the framework expiry table', async () => {
    const table = await helpers.html.get('#frameworkexpiry__table')
    const tbody = table.children[0]
    const rows = tbody.children
    rows.forEach(r => {
      const link = r.children[1].children[0]
      expect(link.name).to.equal('a')
      expect(link.attributes.find(a => a.name === 'href').value).to.include('/framework')
    }) 
  })
})