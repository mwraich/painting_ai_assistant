import OpenAI from 'openai';
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function initializeAssistant() {
    try {
        const assistant = await openai.beta.assistants.create({
            name: 'Painting Description Assistant',
            instructions:
                'You are an assistant to multiple artists who will provide a short description of a painting and then from there you should make suggests and describe specific details to make the most visually appealing painting possible. Be efficient at answering strictly painting descriptions with details about its elements, style, details, and colors.',
            tools: [{ type: 'code_interpreter' }],
            model: 'gpt-3.5-turbo',
        });
        console.log('Assistant created:', assistant.id)
        return assistant;
    } catch (error) {
        console.error('Error initializing assistant:', error);
    }
}

initializeAssistant();
