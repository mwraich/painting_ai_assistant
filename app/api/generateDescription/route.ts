import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {

	const { theme } = await req.json();

	try {
		const thread = await openai.beta.threads.create();
		await openai.beta.threads.messages.create(thread.id, {
			role: 'user',
			content: `Describe a painting with the theme: ${theme}`,
		});
		const run = await openai.beta.threads.runs.create(thread.id, {
			assistant_id: process.env.ASSISTANT_ID as string,
		});

		let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
		while (runStatus.status !== 'completed') {
            console.log('WAITING FOR COMPLETION')
			await new Promise((resolve) => setTimeout(resolve, 1000));
			runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
		}

		const messages = await openai.beta.threads.messages.list(thread.id);
		const assistantMessage = messages.data.find(
			(message) => message.role === 'assistant',
		);
		if (assistantMessage && assistantMessage.content[0].type === 'text') {
			return NextResponse.json({ description: assistantMessage.content[0].text.value });
		} else {
			return NextResponse.json({ message: 'Error generating description' }, { status: 500 });
		}
	} catch (error: unknown) {
		console.error('Error generating description:', error);
		const errorMessage = error instanceof Error ? error.message : String(error);

		return NextResponse.json({ message: 'Error generating description', error: errorMessage }, { status: 500 });
	}
}
