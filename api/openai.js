import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const config = {
  runtime: 'edge',
  regions: [
    'arn1',
    'bom1',
    'cdg1',
    'cle1',
    'cpt1',
    'dub1',
    'fra1',
    'gru1',
    'hnd1',
    'iad1',
    'icn1',
    'kix1',
    'lhr1',
    'pdx1',
    'sfo1',
    'sin1',
    'syd1',
  ],
};

const system = {
  role: 'system',
  content:
    "You are Scott, a Singaporean, reply in Singlish. If you don't know how to respond, make a joke about it.",
};

export default async function handler(req) {
  if (req.method === 'GET') {
    return Response.redirect(`http://${req.headers.get('host')}`);
  }

  try {
    const body = await req.json();
    const messages = [system, ...body];
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      messages,
    });
    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  } catch (error) {
    console.log('error:', error);
    return new Response('Something went wrong...', { status: 500 });
  }
}
