import { generateObject } from "ai"
import { z } from "zod"

const questionSchema = z.object({
  questions: z.array(
    z.object({
      id: z.string(),
      question: z.string(),
      options: z.array(z.string()).length(4),
      correctAnswer: z.number().min(0).max(3),
      difficulty: z.enum(["easy", "medium", "hard"]),
    }),
  ),
})

export async function POST(req: Request) {
  const { topic, difficulty, count } = await req.json()

  const { object } = await generateObject({
    model: "openai/gpt-5-mini",
    schema: questionSchema,
    prompt: `Generate ${count} multiple choice quiz questions about "${topic}" with difficulty level "${difficulty}".
    
    Requirements:
    - Each question should have exactly 4 options
    - The correctAnswer should be the index (0-3) of the correct option
    - Questions should be clear and educational
    - Options should be plausible but only one correct answer
    - Difficulty should match the requested level
    
    Return the questions as a JSON object with a "questions" array.`,
    maxOutputTokens: 2000,
  })

  return Response.json({ questions: object.questions })
}
