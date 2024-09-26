

const express = require('express')
const app = express()
const port = 3010

app.get('/', (req, res) => {
  res.send('sapne dekhna aachi bat hai lekin sabne ke sath sona ye to  achi bat nbahi !')
})

app.listen(port, () => {
  console.log(`sapne dekhna ${port}`)
})