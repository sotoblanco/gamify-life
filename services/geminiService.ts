
import { GoogleGenAI, Type } from "@google/genai";
import type { Character } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCharacter = async (): Promise<Character> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Create a fun and quirky character profile for a task completion app. The character is a quest giver. Provide a name and a short, one-paragraph description. Example: 'Captain Quirk, a friendly space pirate who finds treasure in everyday chores.'",
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING, description: "The character's name." },
                    description: { type: Type.STRING, description: "A short paragraph describing the character." }
                },
                required: ["name", "description"]
            },
        },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as Character;
};

export const generateStoryForTask = async (taskDescription: string, character: Character): Promise<{ story: string; points: number }> => {
    const prompt = `You are ${character.name}, a quest giver. Your personality is: "${character.description}". A hero has a new quest: "${taskDescription}". Turn this mundane task into a short, epic, and fun story to motivate the hero. Keep it to 1-2 witty paragraphs. Also, assign a point value for this quest based on its perceived difficulty, from 10 to 100. A simple task like 'do laundry' should be low points, while 'study for an exam' should be high.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    story: { type: Type.STRING, description: "The generated story for the task." },
                    points: { type: Type.INTEGER, description: "The points assigned to the task." }
                },
                required: ["story", "points"]
            },
        },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString);
};
