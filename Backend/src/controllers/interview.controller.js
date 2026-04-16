const pdfParse = require("pdf-parse")
const { generateInterviewReport } = require("../services/ai.service")
const interviewReportModal = require("../models/interviewReport.model")

/**
 * @description Controller to generate interview report based on resume, self description and job description. It uses the AI service to generate the report and saves it to the database.
 * @route POST /api/interview/report
 * @access Private
 */
async function generateInterviewReportController(req, res) {
    const resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
    const { selfDescription, jobDescription } = req.body

    const interviewReportByAi = await generateInterviewReport({ resume: resumeContent.text, selfDescription, jobDescription })

    const interviewReport = await interviewReportModal.create({
        userId: req.user.id,
        resume: resumeContent.text,
        selfDescription,
        jobDescription,
        ...interviewReportByAi
    })

    res.status(201).json({ message: "Interview report generated successfully", interviewReport })
}

/**
 * @description Controller to get interview report by interviewId
 * @route GET /api/interview/report/:interviewId
 * @access Private
 */
async function getInterviewReportController(req, res) {
    const { interviewId } = req.params

    const interviewReport = await interviewReportModal.findOne({ _id: interviewId, userId: req.user.id })

    if (!interviewReport) {
        return res.status(404).json({ message: "Interview report not found" })
    }

    res.status(200).json({ message: "Interview report fetched successfully", interviewReport })
}
 
/**
 * @description Controller to get all interview reports of the logged-in user
 * @route GET /api/interview/reports
 * @access Private
 */
async function getAllInterviewReportsController(req, res) {
    const interviewReports = await interviewReportModal.find({ userId: req.user.id }).sort({ createdAt: -1 }).select('-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan')

    res.status(200).json({ message: "Interview reports fetched successfully", interviewReports })
}

module.exports = { generateInterviewReportController, getInterviewReportController, getAllInterviewReportsController }