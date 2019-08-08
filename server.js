const http = require('http')
const port = process.env.PORT || 8080

const requestHandler = (request, response) => {
  const msg = process.env.MESSAGE || 'poo'
  response.end(`Hello Node.js Server! ${msg}`)
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})