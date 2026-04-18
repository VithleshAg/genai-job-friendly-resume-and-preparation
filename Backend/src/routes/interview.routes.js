const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const upload = require("../middlewares/file.middleware")
const { generateInterviewReportController, getInterviewReportController, getAllInterviewReportsController, generateResumePdfController } = require("../controllers/interview.controller")

const interviewRouter = express.Router()

interviewRouter.post("/report", authMiddleware.authUser, upload.single("resume"), generateInterviewReportController)
interviewRouter.get("/report/:interviewId", authMiddleware.authUser, getInterviewReportController)
interviewRouter.get("/reports", authMiddleware.authUser, getAllInterviewReportsController)
interviewRouter.post("/resume/pdf/:interviewReportId", authMiddleware.authUser, generateResumePdfController)

module.exports = interviewRouter