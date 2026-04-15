require('dotenv').config()
const app = require('./src/app')
const connectToDb = require('./src/config/database')
const { resume, selfDescription, jobDescription } = require('./src/services/sampleData')
const {generateInterviewReport} = require('./src/services/ai.service')

connectToDb()
generateInterviewReport({ resume, selfDescription, jobDescription })

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})