const expect = require('chai').expect
const setup = require('./setup')

let helpers

describe('testing diagram', () => {
  before(async () => {
    helpers = await setup()
  })

  it('should be have root question', async () => {
    await helpers.gotoPage('/diagram')
    const rootQuestionText = await helpers.getText('#type h2')
    expect(rootQuestionText).to.equal('What are you buying?')
  })

  it('should display the diagram of questions and answers', async () => {
    await helpers.gotoPage('/diagram')
    const table = await helpers.html.get('#diagram')
    const resultingFrameworks = helpers.html.findAll(table, node => {
      const attr = helpers.html.getAttr(node, 'class')
      return attr ? attr.includes('dresult') : false
    })
    expect(resultingFrameworks.length).to.equal(47)
  })

  describe('show hide option edit form', () => {
    before(async () => {
      await helpers.gotoPage('/diagram')  
    })

    it('should not show option edit form', async () => {
      const isHidden = await helpers.isHidden('#optioneditorform')
      expect(isHidden).to.be.true
    })

    it('should display the option edit form when an option is clicked', async () => {
      await helpers.click('#type_buying_what_furniture a')
      const isShowing = await helpers.isShowing('#optioneditorform')
      expect(isShowing).to.be.true
    })

    it('should hide the option edit form when the back button is clicked', async () => {
      await helpers.click('#backbtn')
      const isHiddenAgain = await helpers.isHidden('#optioneditorform')
      expect(isHiddenAgain).to.be.true
    })

  })
    
  describe('add/remove result/next question from an option', () => {
    before(async () => {
      await helpers.gotoPage('/diagram')
    })

    it('should not allow an option with a result to link to a question', async () => {
      await helpers.click('#type_buying_what_furniture a')
      const next = await helpers.html.get('#next')
      const disabled = helpers.html.getAttr(next, 'disabled')
      expect(disabled).to.equal('')
    })

    it('should allow removal of a framework option', async () => {
      await helpers.click('#type_buying_what_furniture a')
      // const resultsWithNepo = await helpers.html.get('.editoption__results td')
      // expect(helpers.html.getText(resultsWithNepo).trim()).to.equal('Furniture (NEPO)')
      await helpers.click('#removeresult_0')
      await helpers.click('#savebtn')
      const furnitureResultIsGone = await helpers.isHidden('#type_buying_what_furniture_furniture')
      expect(furnitureResultIsGone).to.be.true
    })

    it('should show additional option buttons if the option leads to a deadend', async () => {
      const isEditButtonShowing = await helpers.isShowing('#type_buying_what_furniture .doption__link--edit')
      expect(isEditButtonShowing).to.be.true
      const isNewQuestionButtonShowing = await helpers.isShowing('#type_buying_what_furniture .doption__link--newquestion')
      expect(isNewQuestionButtonShowing).to.be.true
    })

    it('should allow either a framework or another question to be selected', async () => {
      await helpers.click('#type_buying_what_furniture a')
      const nextOptions = await helpers.html.get('#next')
      const nextDisabled = helpers.html.getAttr(nextOptions, 'disabled')
      expect(nextDisabled).to.be.null

      const resultOptions = await helpers.html.get('#result')
      const resultDisabled = helpers.html.getAttr(resultOptions, 'disabled')
      expect(resultDisabled).to.be.null
    })

    it('should allow an option that previously had a result to link to another question', async () => {
      await helpers.click('#type_buying_what_furniture a')
      const selectHtml = await helpers.html.get('#next')
      const options = selectHtml.children.map(child => helpers.html.getAttr(child, 'value'))
      const isAcademy = options[3]
      await helpers.select('#next', isAcademy)
      await helpers.click('#savebtn')
      const isAcademyQExists = await helpers.isShowing('#type_buying_what_furniture_academy')
      expect(isAcademyQExists).to.be.true
    })

    it('should not allow an option with a link to another quesion to have a framework result', async () => {
      await helpers.click('#type_buying_what_furniture a')
      const resultOptions = await helpers.html.get('#result')
      const resultDisabled = helpers.html.getAttr(resultOptions, 'disabled')
      expect(resultDisabled).to.equal('')
    })
  })

  describe('create new option and then new question', () => {
    before(async () => {
      await helpers.gotoPage('/diagram')
    })

    it('should show the edit option form when plus button is clicked', async () => {
      await helpers.click('#type_buying_what .dquestion__addoption')
      const isShowing = await helpers.isShowing('#optioneditorform')
      expect(isShowing).to.be.true
    })
  })
})