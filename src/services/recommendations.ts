import OpenAI from "openai";

interface PossibleBook {
    isbn: string;
    title: string;
    author: string;
}

interface BookRecommendationService {
    getRecommendations(lookingFor: string): Promise<PossibleBook[]>;
}

export class ChatBookRecommendationService implements BookRecommendationService {
    async getRecommendations(lookingFor: string): Promise<PossibleBook[]> {
        const functionName = "create_book_recommendation";
        const STRING_TYPE = "string";
        const OBJECT_TYPE = "object"
        const ARRAY_TYPE = "array"
        const functions = [ {
            name: functionName,
            description: "Creates personalized book recommendation",
            parameters: {
                type: OBJECT_TYPE,
                properties: {
                    results: {
                        type: ARRAY_TYPE,
                        items: {
                            type: OBJECT_TYPE,
                        properties: {
                            isbn: {
                                type: STRING_TYPE,
                                description: "Book ISBN number"
                            }, 
                            title: {
                                type: STRING_TYPE,
                                description: "Book Title"
                            },
                            author: {
                                type: STRING_TYPE,
                                description: "Book Author"
                            }
                            // "reason": {
                            //     "type": "string",
                            //     "description": "Sales pitch to the user on the most valuable things they will get from the book."
                            // } 
                        },
                        required: ["isbn", "title", "author"]
                        }
                    }
                }
            }
        }]
        const openai = new OpenAI({apiKey: process.env.REACT_APP_OPENAI_API_KEY, dangerouslyAllowBrowser: true});
       
        const response = await openai.chat.completions.create({
                model: "gpt-4-1106-preview",
                messages: [
                    {role: "system", "content": "You give great book recommendations. Limit to top 5 responses."},
                    {role: "user", "content": lookingFor},
                ],
                functions: functions,
                function_call: {name: functionName}
            });

        const bookRecommendationCall = response.choices[0].message.function_call
        if(!bookRecommendationCall || bookRecommendationCall.name !== functionName) {
            return []
        }
        console.log(bookRecommendationCall)
        const recommendations = JSON.parse(bookRecommendationCall.arguments)
        console.log(recommendations)
        return recommendations.results;
    }
}

export type  {
    BookRecommendationService,
    PossibleBook
};