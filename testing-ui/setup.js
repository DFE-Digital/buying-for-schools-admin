process.env.PORT = 8888
process.env.COLLECTION_NAME = 'MOCHA_UI_' + Date.now()
process.env.AUTHUSER = ''
process.env.AUTHPASS = ''

const puppeteer = require('puppeteer')
const pseudoHtml = require('./pseudoHtml')
const HOMEPAGE = `http://localhost:${process.env.PORT}`
const app = require('../server.js')

const setup = { app: null }

let page
let browser

const gotoPage = async u => {
  await page.goto(HOMEPAGE + u)
}

after(async () => {
  console.log('AFTER closing server')
  await app.server.close()
  if (process.env.COLLECTION_NAME !== 'structure') {
    await app.dataSource.model.collection.drop()
  }
})

const getText = async selector => {
  await page.waitForSelector(selector)
  return await page.evaluate(s => {
    const elem = document.querySelector(s)
    return elem ? elem.innerText : null
  }, selector)
}

const click = async selector => {
  await page.waitForSelector(selector)
  await page.$eval(selector, btn => btn.click())
}

const isShowing = async sel => {
  const isit = await page.waitForSelector(sel, { visible: true })
  // console.log('isShowing', isit, typeof isit)
  return !!isit
}
const isHidden = async sel => {
  const isit = await page.waitForSelector(sel, { hidden: true })
  return isit === null ? true: isit
}

const select = async (sel, val) => {
  return await page.select(sel, val)
}

exports = module.exports = async () => {
  if (setup.app) {
    // only do this once!
    return setup
  }

  if (!browser) {
    browser = await puppeteer.launch({ headless: true, devtools: false })
  }

  if (!page) {
    page = await browser.newPage()
  }

  await app.go

  setup.gotoPage = gotoPage
  setup.app = app
  setup.getText = getText
  setup.click = click
  setup.select = select
  setup.isShowing = isShowing
  setup.isHidden = isHidden
  setup.html = pseudoHtml(page)
  return setup
}
