import OpenAI from "openai";

interface PossibleBook {
    isbn: string;
    title: string;
    author: string;
}

interface BookRecommendationService {
    getRecommendation(lookingFor: string): Promise<PossibleBook | null>;
}

export class ChatBookRecommendationService implements BookRecommendationService {
    async getRecommendation(lookingFor: string): Promise<PossibleBook | null> {
        const functionName = "create_book_recommendation";
         const functions = [ 
            {
            name: functionName,
            description: "Creates personalized book recommendation",
            parameters: {
                type: "object",
                properties: {
                    isbn: {
                        type: "string",
                        description: "Book ISBN number"
                    }, 
                    title: {
                        type: "string",
                        description: "Book Title"
                    },
                    author: {
                        type: "string",
                        description: "Book Author"
                    }
                    // "reason": {
                    //     "type": "string",
                    //     "description": "Sales pitch to the user on the most valuable things they will get from the book."
                    // } 
                },
                required: ["isbn", "title", "author"]
            }
        }]
        const openai = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true});
       
        const response = await openai.chat.completions.create({
                model: "gpt-4-1106-preview",
                messages: [
                    {role: "system", "content": "You give great book recommendations. Limit to best response."},
                    {role: "user", "content": lookingFor},
                ],
                functions: functions,
                function_call: {name: functionName}
            });

        const bookRecommendationCall = response.choices[0].message.function_call
        if(!bookRecommendationCall || bookRecommendationCall.name !== functionName) {
            return null
        }
        return JSON.parse(bookRecommendationCall.arguments);
    }
}

export type  {
    BookRecommendationService,
    PossibleBook
};