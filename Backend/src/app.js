const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}))

/* require all the routes here */
const authRouter = require('./routes/auth.routes')

/* using all the routes here */
app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    res.send('Welcome to the GenAI Job-Friendly Resume and Preparation API');
});

module.exports = app