'use client';
import { useEffect, useState } from 'react';

const themes = ['Nature', 'Urban Life', 'Abstract', 'Historical', 'Futuristic'];

export default function Home() {
	const [selectedTheme, setSelectedTheme] = useState('');
	const [description, setDescription] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [threadId, setThreadId] = useState('');

	async function createThread() {
		const response = await fetch('/api/createThread', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const data = await response.json();

		setThreadId(data.thread.id);
		setMessages(data.messages.data);
	}

	useEffect(() => {
		createThread();
	}, []);

	const generateDescription = async () => {
		setIsLoading(true);
		try {
			const response = await fetch('/api/generateDescription', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ theme: selectedTheme }),
			});
			const data = await response.json();
			setDescription(data.description);
		} catch (error) {
			console.error('Error generating description', error);
		}
		setIsLoading(false);
	};

	const PaintingDescription = () => (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-4">Select a Painting Theme</h1>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{themes.map((theme) => (
					<button
						key={theme}
						className={`
                p-2 rounded ${
									selectedTheme === theme
										? 'bg-blue-500'
										: 'bg-slate-600 hover:bg-gray-300'
								}
              `}
						onClick={() => setSelectedTheme(theme)}
					>
						{theme}
					</button>
				))}
			</div>
			{selectedTheme && (
				<div className="mt-4">
					<p className="mt-4">You Selected: {selectedTheme}</p>
					<button
						className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600"
						onClick={generateDescription}
						disabled={isLoading}
					>
						{isLoading ? 'Generating...' : 'Generate Description'}
					</button>
				</div>
			)}
			{description && (
				<div className="mt-4">
					<h2 className="text-2xl font-bold mb-2">Generated Description:</h2>
					<p className="p-4 rounded">{description}</p>
				</div>
			)}
		</div>
	);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const response = await fetch('/api/createMessage', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				threadId,
				message,
			}),
		});

		const data = await response.json();
		setMessages(data.messages.data);
	};

	return (
		<main>
			<PaintingDescription />

			{/* Chat Component */}
			<div className="flex flex-col items-center">
				<h1 className="text-3xl font-bold mt-4">Chat with the Assistant</h1>
				<h3>Thread ID: {threadId}</h3>
				{messages.map((message, index) => (
					<div
						key={index}
						className={`p-2 m-2 rounded ${
							message.role === 'user' ? 'bg-gray-300' : 'bg-gray-500'
						}`}
					>
						{message.content[0].type === 'text'
							? message.content[0].text.value
							: 'Image'}
					</div>
				))}
				<form onSubmit={handleSubmit}>
					<input
						type="text"
						name="message"
						value={message}
						onChange={(e) => setMessage(e.target.value)}
						placeholder="Type a message..."
						className="mx-4 p-2 rounded border bg-black text-white"
					/>
					<button
						type="submit"
						className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
					>
						Send
					</button>
				</form>
			</div>
		</main>
	);
}
