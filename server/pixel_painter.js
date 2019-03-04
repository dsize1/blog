const http = require('http')
const path = require('path')
const express = require('express')
const Jimp = require('jimp')
const socketIo = require('socket.io')

const pixel_painter_port = 8082

const app = express()
const server = http.createServer(app)
const io = socketIo(server)

const width = 880
const height = 544



main()

async function main() {
  let img
  try {
    img = await Jimp.read(path.join(__dirname, './pixel.png'))
  } catch (e) {
    img = new Jimp(width, height, 0xffffffff, (err, img) => {
      console.log('img created')
    })
  }

  let lastUpdate = 0
  setInterval(() => {
    var now = Date.now()
    if (now - lastUpdate < 3000) {
      img.writeAsync(path.join(__dirname, './pixel.png')).then(() => {
        console.log('data saved!')
      })
    }
  }, 3000)

  let userOperations = []

  setInterval(() => {
    if (userOperations.length > 0) {
      io.emit('updateDot', userOperations)
      userOperations = []
    }

  }, 300)

  io.on('connection', (ws, req) => {
    img.getBuffer(Jimp.MIME_PNG, (err, buf) => {
      if (err) {
        console.log('get buffer err', err)
      } else {
        ws.emit('init', buf)
      }
    })

    io.emit('onlineCount', {
      count: Object.keys(io.sockets.sockets).length
    })

    var lastDraw = 0

    ws.on('close', () => {
      io.emit('onlineCount', {
        count: Object.keys(io.sockets.sockets).length
      })
    })

    ws.on('drawDot', data => {
      var { x, y, color } = data
      var now = Date.now()

      if (now - lastDraw < 200) {
        return
      }

      if (x < 0 || x > width || y < 0 || y > height) {
        return
      }
      lastDraw = now
      lastUpdate = now
      img.setPixelColor(Jimp.cssColorToHex(color), x, y)
      userOperations.push({ x, y, color })
    })
  })

  // app.use(express.static(path.join(__dirname, './static')))

  server.listen(pixel_painter_port, () => {
    console.log('sever listeing on port', pixel_painter_port)
  })
}
