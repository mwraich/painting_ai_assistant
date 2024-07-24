import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
	console.log(req);
	const { threadId, message } = await req.json();

	const threadMessages = await openai.beta.threads.messages.create(threadId, {
		role: 'user',
		content: message,
	});

	if (!process.env.ASSISTANT_ID) {
		return NextResponse.json({ message: 'No Assistant ID' }, { status: 500 });
	}

	let run = await openai.beta.threads.runs.createAndPoll(threadId, {
		assistant_id: process.env.ASSISTANT_ID,
		//   instructions: "Please address the user as Jane Doe. The user has a premium account."
	});

	if (run.status !== 'completed') {
		return NextResponse.json(
			{ message: 'Error generating description' },
			{ status: 500 },
		);
	}

	const messages = await openai.beta.threads.messages.list(run.thread_id);
	return NextResponse.json({ messages });
}
