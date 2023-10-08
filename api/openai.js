import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}))

export default async function handler(req, res) {
    const model = "gpt-3.5-turbo"
    const messages = req.body
    try {
        const response = await openai.createChatCompletion({
            model,
            messages
        })
        console.log("response:", response)
        return res.status(200).json({
            reply: response.data.choices[0].message
        })
    } catch (error) {
        console.log("error:", error)
        return res.status(500).json("Something went wrong...")
    }
}