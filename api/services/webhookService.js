const send = async (payload) => {
  const https = require('https')

  const data = JSON.stringify(payload)

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data),
      'Authorization': `Token ${process.env.GHBS_WEBHOOK_SECRET}`
    }
  }
  
  const req = https.request(process.env.GHBS_WEBHOOK_ENDPOINT, options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  })

  req.on('error', error => {
    console.error(error)
  })

  req.write(data)
  req.end()
}

module.exports = { send }
