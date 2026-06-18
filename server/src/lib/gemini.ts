import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Default model for all AI features
export const gemini = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

export default gemini;
