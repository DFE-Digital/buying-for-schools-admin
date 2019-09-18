const { Given, When, Then, AfterAll } = require("cucumber");


Given(/^user is on page (.+)$/, {timeout: 30 * 1000}, async function(string) {
  await this.gotoPage(string)
})

Given(/^the service is (unavailable|available)$/, function(availability) {
  process.env.AVAILABLE = (availability !== 'unavailable') ? 'TRUE' : 'FALSE'
})

Given('the user is logged in', async function () {
  await this.login()
})

Then("the service displays the following page content", async function(data) {
  await this.checkPageContent(data.raw())
})

Then('have radio buttons', async function (data) {
  await this.haveRadioButtons(data.raw())
})

Then('have links', async function (data) {
  await this.haveLinks(data.raw())
})

Then('have result card', async function (data) {
  await this.haveResultCard(data.raw())
})

Then(/^the page title is '(.*)'$/, async function (pageTitle) {
  await this.hasPageTitle(pageTitle)
})

Then('have the following form elements', async function (data) {
  await this.hasFormElements(data.raw())
})

Then('show framework expiry table', async function () {
  await this.hasFrameworkExpiryTable()
})

Then('show structure table', async function () {
  await this.hasStructureTable()
})

Then('show framework table', async function () {
  await this.hasFrameworkTable()
})

Then('a modal dialog should ask for confirmation', async function (data) {
  await this.modalDialogCheck(data.raw())
})

// Then('the dialog should not be displayed', async function() {
//   await this.modalDialogCheck(null)
// })

When(/^(a|the) (.+) is (pressed|clicked)$/, async function (foo, sel, bar) {
  await this.clickButton(sel)
})

Then('the form has these fields', async function (data) {
  await this.checkFormFields(data.raw())
})

Then(/^(a|the) (.+) (should|should NOT) be displayed$/i, async function (foo, item, includes) {
  await this.checkDisplay(item, includes==='should')
})

Then('the form is completed with', async function (data) {
  await this.formCompleted(data.raw())
})

Then(/^the (.+) category of the framework list should contain$/, async function (cat, data) {
  await this.frameworkListContains(cat, data.raw())
})