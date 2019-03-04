const http = require('http')
const puppeteer = require('puppeteer')
const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

// Database Name
const dbName = 'images';

// Connection url
const dbURL = 'mongodb://localhost:27017';
const puppeteer_port = 8081
const searchUrl = 'https://stock.tuchong.com/free'

class Operation {
  constructor(op) {
    if (this.isOperation(op)) {
      this.opQue = [...op.get()]
    } else if (Array.isArray(op)) {
      this.opQue = [...op]
    } else {
      this.opQue = []
    }
  }

  push(...args) {
    if (!args.length) return this
    this.opQue.push(...args)
    return this
  }

  get() {
    return this.opQue
  }

  isOperation(op) {
    return op instanceof this.constructor
  }

  merge(...ops) {
    for (const op of ops) {
      if (this.isOperation(op)) {
        this.opQue.push(...op.get())
      }
    }
  }
}

const username = '13818323833'
const password = '*******'
const LINK_LOGNIN = `#header > div.header-nav > ul > li:nth-child(2) > a.login-button`
const USERNAME_SELECTOR = `#main > main > form > div.form-body > div:nth-child(2) > input[type="text"]`
const PASSWORD_SELECTOR = `#main > main > form > div.form-body > div:nth-child(3) > input[type="password"]`
const BUTTON_SELECTOR = `#main > main > form > div.form-body > button`
const login = new Operation()
login.push({method: 'click', arg: [LINK_LOGNIN]})
  .push({method: 'click', arg: [USERNAME_SELECTOR]})
  .push({method: 'type', arg: [username]})
  .push({method: 'click', arg: [PASSWORD_SELECTOR]})
  .push({method: 'type', arg: [password]})
  .push({method: 'click', arg: [BUTTON_SELECTOR]})

const SHOW_MORE_SELECTOR = `#pipe-wrap > a.gallery-show-more`
const PIPE_WRAP_ITEM_SELECTOR = `#pipe-wrap > a:nth-child`
const PIPE_WRAP_ITEMS_LENGTH = 18
const PIPE_WRAP_SHOW_MORE_INDEX = 10
const PIPR_WRAP_BR_INDEX = 11
const IMAGES_GALLERY_SELECTOR = `#main > div.home-topic > section > div > div.images-wrap > div > div`
const IMAGE_DIV_SELECTOR = `ul.images-row > li.image > div.image-card > div.img`
const pipeWrapItems = new Array(PIPE_WRAP_ITEMS_LENGTH)
  .fill(0)
  .reduce((res, _, idx) => {
    idx !== PIPE_WRAP_SHOW_MORE_INDEX &&
      idx !== PIPR_WRAP_BR_INDEX &&
      res.push({
        method: 'evaluate',
        arg: [
          async function (pipeWrapItem, imagesGallery, image) {
              const $d = document.body
              let currHeight = 0
              await $d.scrollTo({
                top: currHeight
              })
              await $d.querySelector(pipeWrapItem).click()
              const screenHeight = $d.clientHeight
              while ($d.offsetHeight - currHeight > 500) {
                await new Promise((resolve, _) => {
                  document.body.scrollBy({
                    top: document.body.clientHeight
                  })
                  setTimeout(() => resolve(), 2 * 1000)
                }).then(_ => _)
                currHeight += screenHeight
              }
              const imgs = $d.querySelector(imagesGallery).querySelectorAll(image)
              const sources = []
              for (const index in imgs) {
                try {
                  const url = imgs[index].style.backgroundImage.match(/(?<=\(['"])([\S]+)(?=['"]\))/g)[0]
                  const width = Math.round(imgs[index].getClientRects()[0].width)
                  const height = Math.round(imgs[index].getClientRects()[0].height)
                  sources.push({
                    url,
                    width,
                    height
                  })
                } catch (e) {
                  console.log(e)
                }
              }
              return sources
            },
            `${PIPE_WRAP_ITEM_SELECTOR}(${idx+1})`,
            IMAGES_GALLERY_SELECTOR,
            IMAGE_DIV_SELECTOR
        ]
      })
    return res
  }, [])
const getImagesSrc = new Operation()
getImagesSrc.push({method: 'click',arg: [SHOW_MORE_SELECTOR]})
  .push(...pipeWrapItems)

const puppeteerOptions = {
  defaultViewport: {width: 1903, height: 2800},
  headless: true,
}
async function run(dbOp) {
  let operationFlow = async function (browser, page, operation, dbOp) {
    await page.waitFor(2 * 1000)
    for (const {method, arg} of operation) {
      const result = await page[method](...arg)
      if (method === 'evaluate') {
        console.log(result)
        await dbOp(result)
      }
    }
    browser.close()
  }

  const browser = await puppeteer.launch(puppeteerOptions);
  const page = await browser.newPage();

  operationFlow = operationFlow.bind(null, browser, page, getImagesSrc.get(), dbOp)

  page.once('load', operationFlow)
  await page.goto(searchUrl);
}

http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/api/search') {
    try {
      const data = await dbOperations.readCollection()
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000'
      })
      res.end(data)
    } catch (e) {
      res.writeHead(500)
      res.end()
    }
  }
}).listen(puppeteer_port, () => {
  console.log(`Port:${puppeteer_port} is listenning...`)
})

const dbOperations = () => {
  MongoClient.connect(dbURL, async function (err, client) {
    if (err) throw err
    console.log('db created!')
    const db = client.db(dbName)
    await db.createCollection('images')
    client.close()
  })

  const insertCollection = (data) => {
    MongoClient.connect(dbURL, async function (err, client) {
      if (err) throw err
      const db = client.db(dbName)
      await db.collection('images').insertMany(data)
      client.close()
    })
  }

  const readCollection = () => {
    let data
    MongoClient.connect(dbURL, async function (err, client) {
      if (err) throw err
      const db = client.db(dbName)
      const whereStr = {}
      data = await db.collection('images').find(whereStr)
      client.close()
    })
    return JSON.stringify(data)
  }
  const deleteCollection = () => {
    MongoClient.connect(dbURL, async function (err, client) {
      if (err) throw err
      const db = client.db(dbName)
      await db.collection('images').drop()
      client.close()
    })
  }
  return {
    insertCollection,
    readCollection,
    deleteCollection
  }
}

(function main() {
  const dbOps = dbOperations(dbURL, dbName)
  run(dbOps.insertCollection)
})()
