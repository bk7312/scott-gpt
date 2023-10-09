import { Configuration, OpenAIApi } from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}))

export const runtime = 'edge'

export default async function handler(req, res) {
    const model = "gpt-3.5-turbo"
    const messages = req.body

    try {
        const response = await openai.createChatCompletion({
            model,
            stream: true,
            messages,
        })
        console.log("stream-response:", response)

        // Convert the response into a friendly text-stream
        const stream = OpenAIStream(response)

        // Respond with the stream
        return new StreamingTextResponse(stream)

        // return res.status(200).json({
        //     reply: response.data.choices[0].message
        // })
    } catch (error) {
        console.log("error:", error)
        return res.status(500).json("Something went wrong...")
    }
}

