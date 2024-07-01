'use client';

export default function Home() {
  const thread = await openai.beta.threads.create();
  
	return (
		<main>
			<h1>AI Painting Assistant</h1>
		</main>
	);
}
