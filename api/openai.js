import { OpenAI } from 'openai'
// import { OpenAIStream, StreamingTextResponse } from 'ai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const config = {
    runtime: "edge",
};

export default async function handler(req) {
    if (req.method === 'GET') {
        return new Response.redirect(window.location.origin)
    }
    console.log('test', { req })

    try {
        const body = await req.json()

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            // stream: true,
            messages: body,
        })
        console.log("stream-response:", response)

        // // Convert the response into a friendly text-stream
        // const stream = OpenAIStream(response)
        // console.log(stream)
        // // Respond with the stream
        // return new StreamingTextResponse(stream)

        const reply = JSON.stringify(response.choices[0].message)

        return new Response(reply, { status: 200 })
        // return res.status(200).json({
        //     reply: response.choices[0].message
        // })
    } catch (error) {
        console.log("error:", error)
        return new Response('Something went wrong...', { status: 500 })
        // return res.status(500).json("Something went wrong...")
    }
}

