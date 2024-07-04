'use client';
import { useState } from 'react';

const themes = ['Nature', 'Urban Life', 'Abstract', 'Historical', 'Futuristic'];

export default function Home() {
	const [selectedTheme, setSelectedTheme] = useState('');
	const [description, setDescription] = useState('');
	const [isLoading, setIsLoading] = useState(false);

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
	return (
		<main>
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
		</main>
	);
}
