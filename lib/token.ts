require('dotenv').config()
const request = require('request')

const options = {
  method: 'POST',
  url: 'https://api.imgur.com/oauth2/token',
  headers: {
    'Postman-Token': process.env.POSTMAN_TOKEN,
    'cache-control': 'no-cache',
    'content-type':
      'multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW'
  },
  formData: {
    refresh_token: process.env.IMGUR_REFRESH_TOKEN,
    client_id: process.env.IMGUR_CLIENT_ID,
    client_secret: process.env.IMGUR_CLIENT_SECRET,
    grant_type: 'refresh_token'
  }
}

request(options, function(error, response, body) {
  if (error) throw new Error(error)

  console.log(body)
})
