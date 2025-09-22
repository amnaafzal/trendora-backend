const express = require('express')
const mongoose = require('mongoose')
const app = express()
var cors = require('cors')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
dotenv.config()
const port = process.env.PORT || 5000;


app.use(express.json({limit: "24mb"}))
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(cookieParser())
// app.use(bodyParser.urlencoded())
// app.use(bodyParser.json())


// all routes here  
const authRouter = require('./src/users/user.router')

app.use('/api/auth', authRouter)

async function main() {
  await mongoose.connect(process.env.MONGODB_URI)
}

main().then(() => {
  console.log("✅ Connected to MongoDB");
}).catch(err => {
  console.error("❌ MongoDB connection error:", err);
});





app.get('/', (req, res) => {
  res.send('i am going to be the great software engineer')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
