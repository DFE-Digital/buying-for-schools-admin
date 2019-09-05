const md5 = require('md5')
process.env.USERS = md5('bdd@dfe.gov.uk:cucumber')
process.env.AUTHSECRET = 'secretsecretsecretsecret'
process.env.AUTHDISABLED = 'DISABLED'
const theApp = require('../../server.js')

const { setWorldConstructor, AfterAll, BeforeAll } = require('cucumber')
const { expect } = require('chai')
const puppeteer = require('puppeteer')
const selectors = require('./selectors')

const HOMEPAGE = 'http://localhost:8000'
const serviceName = 'Find a DfE approved framework for your school'

let browser = null
let page = null

BeforeAll(async () => {
  await theApp.go
})

class B4SWorld {
  constructor () {
    // console.log('B4SWorld Constructor')
  }

  async gotoPage (u) {
    if (!browser) {
      browser = await puppeteer.launch({ headless: true, devtools: false })
    }

    if (!page) {
      page = await browser.newPage()
    }

    await page.goto(HOMEPAGE + u)
  }

  async checkPageContent (data) {
    const results = []
    for (const row of data) {
      const sel = selectors(row[0])
      const txt = await page.evaluate((s) => document.querySelector(s).innerText, sel)
      results.push({ expected: row[1], actual: txt })
    }

    results.forEach(e => {
      expect(e.actual).to.eql(e.expected)
    })
  }

  async checkText (selector, string) {
    const txt = await page.evaluate((s) => document.querySelector(s).innerText, selector)
    return expect(txt).to.eql(string)
  }

  async haveRadioButtons (data) {
    const radioGroups = await page.evaluate(() => document.getElementsByClassName('govuk-radios__item').length)
    const results = []
    for (let i = 1; i <= radioGroups; i++) {
      const txt = await page.evaluate((i) => document.querySelector(`.govuk-radios__item:nth-child(${i}) label`).innerText, i)
      const val = await page.evaluate((i) => document.querySelector(`.govuk-radios__item:nth-child(${i}) input`).value, i)
      results.push({ label: txt, value: val })
    }

    data.forEach((row, i) => {
      expect(results[i].label).to.eql(row[0])
      expect(results[i].value).to.eql(row[1])
    })

    return results
  }

  async haveLinks (data) {
    const links = await page.evaluate(() => {
      const links = []
      const elements = document.getElementsByTagName('a')
      for (const element of elements) {
        links.push({ href: element.href, text: element.innerText.replace(/\n/g, ' ') })
      }
      return links
    })

    data.forEach(row => {
      const href = (row[1].substr(0, 4) === 'http') ? row[1] : HOMEPAGE + row[1]
      const text = row[0]
      expect(links).to.deep.include({ text, href })
    })
  }

  async hasFormElements (data) {

    const ids = await page.evaluate(data => {
      const ids = []
      for (let i=0; i< data.length; i++) {      
        const id = data[i][0]
        const elID = document.getElementById(id)
        ids.push(elID ? elID.id : null)
      }
      return ids
    }, data)

    data.forEach(row => {
      expect(ids.includes(row[0])).to.be.true
    })
  }

  async haveResultCard (data) {
    const cards = await page.evaluate(() => {
      const cards = []
      const elements = document.getElementsByClassName('card')
      for (const element of elements) {
        const href = element.querySelector('a').href
        const title = element.querySelector('.card__title').innerText
        const provider = element.querySelector('.card__content dd').innerText
        cards.push({ href, title, provider })
      }
      return cards
    })

    const title = data[0][0]
    const provider = data[1][0]
    const href = (data[2][0].substr(0, 4) === 'http') ? data[2][0] : HOMEPAGE + data[2][0]

    expect(cards).to.deep.include({ href, title, provider })
  }

  async hasPageTitle (pageTitle) {
    return await this.checkText(selectors('page title'), `${pageTitle} - ${serviceName} - GOV.UK`)
  }

  async login () {
    await this.gotoPage('/')
    const txt = await page.evaluate((s) => document.querySelector(s).innerText, selectors('heading'))
    if (txt !== 'Log in') {
      return
    }

    await page.focus('#user')
    await page.keyboard.type('bdd@dfe.gov.uk')

    await page.focus('#pass')
    await page.keyboard.type('cucumber')
    const clicked = await page.$eval('[type=submit]', btn => btn.click())
  }

  async getHtml (selector) {
    await page.waitForSelector(selector)
    return await page.evaluate(sel => {
      const recur = n => {
        if (n.nodeType === 3) {
          return { text: n.textContent }
        }
        const children = [...n.childNodes].map(child => recur(child))
        const attributes = [...n.attributes].map(attr => ({ name: attr.name, value: attr.value }))
        return {
          name: n.nodeName.toLowerCase(),
          // type: n.nodeType,
          // childCount: n.children.length,
          children,
          attributes
        }
      }
      const node = document.querySelector(sel)
      return recur(node)
    }, selector)
  }

  async hasFrameworkExpiryTable () {
    await page.waitForSelector('#frameworkexpiry__table')
    const table = await this.getHtml('#frameworkexpiry__table')
    const tbody = table.children[0]
    const rows = tbody.children
    rows.forEach(r => {
      const link = r.children[1].children[0]
      expect(link.name).to.equal('a')
      expect(link.attributes.find(a => a.name === 'href').value).to.include('/framework')
    }) 
  }

  async hasStructureTable() {
    const table = await this.getHtml('#structuretable')
    const tbody = table.children[1]
    const rows = tbody.children
    rows.forEach(r => {
      const status = r.children[1].children[0]
      expect(['DRAFT', 'LIVE', 'ARCHIVE']).to.include(status.text)
    }) 

  }

  async hasFrameworkTable() {
    const table = await this.getHtml('#frameworktable')
    const tbody = table.children[1]
    const rows = tbody.children
    rows.forEach(r => {
      const link = r.children[1].children[0]
      expect(link.name).to.equal('a')
      expect(link.attributes.find(a => a.name === 'href').value).to.include('/framework')
    }) 

  }

  async clickButton (sel) {
    await page.waitForSelector('.button--red')
    await page.$eval('.button--red', btn => btn.click())
  }

  async modalDialogCheck (data) {
    await page.waitForSelector('.dialog__content', { visible: true })
    await this.checkText('.dialog__content h1', data[0][1])
  }
}

const timeout = async ms =>  {
  return new Promise(resolve => setTimeout(resolve, ms))
}

AfterAll(async function () {
  // await timeout(5000)
  await browser.close()
  await theApp.server.close()
}, {timeout: 30 * 1000})

setWorldConstructor(B4SWorld)
