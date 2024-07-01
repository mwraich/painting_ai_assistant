'use client'
import { useState } from 'react';

const themes = ['Nature', 'Urban Life', 'Abstract', 'Historical', 'Futuristic'];

export default function Home() {
	const [selectedTheme, setSelectedTheme] = useState('');
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
          {selectedTheme && (
            <p className="mt-4">You Selected: {selectedTheme}</p>
          )}
				</div>
			</div>
		</main>
	);
}
