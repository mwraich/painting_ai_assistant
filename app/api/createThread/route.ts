import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
    const thread = await openai.beta.threads.create();

    let run = await openai.beta.threads.runs.createAndPoll(thread.id, {
		assistant_id: process.env.ASSISTANT_ID!,
		  instructions: "Say Hello and ask the user if they like painting"
	});

	if (run.status !== 'completed') {
		return NextResponse.json(
			{ message: 'Error generating description' },
			{ status: 500 },
		);
	}

    const messages = await openai.beta.threads.messages.list(run.thread_id);

    return NextResponse.json({ thread: thread, messages });
}
