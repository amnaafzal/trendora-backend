const express = require('express')
const mongoose = require('mongoose')
const app = express()
var cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const port = process.env.PORT || 5000;


app.use(cors())

async function main() {
  await mongoose.connect(process.env.MONGODB_URI)
}





app.get('/', (req, res) => {
  res.send('i am going to be the great software engineer')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
