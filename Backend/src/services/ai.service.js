const { GoogleGenAI } = require("@google/genai")
const { z } = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")
const puppeteer = require("puppeteer")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
})

// const interviewReportSchema = z.object({
//     matchScore: z.number().describe("A score between 0 and 100 indicating how well the candidate's profile matches the job describe"),
//     technicalQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Technical questions that can be asked in the interview along with their intention and how to answer them").min(3).max(10),
//     behavioralQuestions: z.array(z.object({
//         question: z.string().describe("The technical question can be asked in the interview"),
//         intention: z.string().describe("The intention of interviewer behind asking this question"),
//         answer: z.string().describe("How to answer this question, what points to cover, what approach to take etc.")
//     })).describe("Behavioral questions that can be asked in the interview along with their intention and how to answer them").min(3).max(10),
//     skillGaps: z.array(z.object({
//         skill: z.string().describe("The skill which the candidate is lacking"),
//         severity: z.enum(["low", "medium", "high"]).describe("The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances")
//     })).describe("List of skill gaps in the candidate's profile along with their severity"),
//     preparationPlan: z.array(z.object({
//         day: z.number().describe("The day number in the preparation plan, starting from 1"),
//         focus: z.string().describe("The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc."),
//         tasks: z.array(z.string()).describe("List of tasks to be done on this day to follow the preparation plan, e.g. read a specific book or article, solve a set of problems, watch a video etc.")
//     })).describe("A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively").min(3).max(14),
//     title: z.string().describe("The title of the job for which the interview report is generated"),
// })

const sampleInterviewReport = {
  "matchScore": 78,
  "title": "Frontend Developer",
  "technicalQuestions": [
    {
      "question": "What is the virtual DOM in React and how does it improve performance?",
      "intention": "To evaluate understanding of React internals and performance optimization concepts.",
      "answer": "Explain that the virtual DOM is a lightweight JavaScript representation of the real DOM. React updates the virtual DOM first, compares it with the previous version using diffing, and updates only the changed elements in the real DOM. Mention performance benefits and reduced direct DOM manipulation."
    },
    {
      "question": "How does CSS Flexbox differ from Grid?",
      "intention": "To assess knowledge of layout systems and when to use each.",
      "answer": "Explain that Flexbox is one-dimensional (row or column) while Grid is two-dimensional (rows and columns). Mention use cases like Flexbox for components and Grid for full layouts."
    }
  ],
  "behavioralQuestions": [
    {
      "question": "Tell me about a time you faced a challenge while working on a frontend project.",
      "intention": "To evaluate problem-solving skills and real-world experience.",
      "answer": "Use the STAR method. Describe the situation, task, action taken, and result. Focus on how you solved the issue and what you learned."
    },
    {
      "question": "How do you handle tight deadlines?",
      "intention": "To assess time management and prioritization skills.",
      "answer": "Explain how you prioritize tasks, break work into smaller parts, communicate with stakeholders, and stay focused under pressure."
    }
  ],
  "skillGaps": [
    {
      "skill": "System Design",
      "severity": "medium"
    },
    {
      "skill": "Advanced Testing (Jest, Cypress)",
      "severity": "high"
    }
  ],
  "preparationPlan": [
    {
      "day": 1,
      "focus": "JavaScript Fundamentals",
      "tasks": [
        "Revise closures, promises, and async/await",
        "Solve 10 JavaScript interview questions",
        "Review common JS interview patterns"
      ]
    },
    {
      "day": 2,
      "focus": "React Concepts",
      "tasks": [
        "Study hooks (useState, useEffect)",
        "Build a small React component",
        "Understand component lifecycle"
      ]
    },
    {
      "day": 3,
      "focus": "Mock Interview Practice",
      "tasks": [
        "Practice 5 technical questions",
        "Record and review answers",
        "Improve weak areas identified"
      ]
    }
  ]
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

 const prompt = `
You MUST return ONLY valid JSON.

STRICT RULES:
- Include ALL fields from the schema
- Do NOT skip nested fields
- Every question MUST include: question, intention, answer
- Every skillGap MUST include: skill, severity
- Every preparationPlan item MUST include: day, focus, tasks
- Do NOT shorten the structure
- Do NOT omit any keys
- Do NOT return partial JSON

ABSOLUTE RULES:
- Output ONLY valid JSON
- Follow the schema EXACTLY
- DO NOT remove or flatten nested objects
- DO NOT convert objects into strings or arrays of strings
- EVERY field in schema MUST be present
- If you skip any field, the response is invalid

Example:
${JSON.stringify(sampleInterviewReport, null, 2)}

Now generate the interview report.

Resume: ${resume}
Self Description: ${selfDescription}
Job Description: ${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // responseSchema: zodToJsonSchema(interviewReportSchema),
        }
    })

    console.log(JSON.parse(response.text))
    return JSON.parse(response.text)
}

async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" })

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "10mm",
            right: "10mm"
        },
        padding: {
          left: "5mm",
          right: "5mm"
        }
    })

    await browser.close()
    return pdfBuffer
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    })

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `

    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: zodToJsonSchema(resumePdfSchema),
        }
    })

    const jsonContent = JSON.parse(response.text)
    const pdfBuffer = await generatePdfFromHtml(jsonContent.html)
    return pdfBuffer
}

module.exports = { generateInterviewReport, generateResumePdf }