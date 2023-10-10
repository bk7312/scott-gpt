import { OpenAI } from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const config = {
    runtime: "edge",
};

export default async function handler(req) {
    if (req.method === 'GET') {
        return Response.redirect(`http://${req.headers.get('host')}`)
    }

    try {
        const body = await req.json()
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            stream: true,
            messages: body,
        })
        const stream = OpenAIStream(response)
        return new StreamingTextResponse(stream)

    } catch (error) {
        console.log("error:", error)
        return new Response('Something went wrong...', { status: 500 })
    }
}

