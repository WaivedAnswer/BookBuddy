import OpenAI from "openai";

interface PossibleBook {
    title: string;
    author: string;
    reason: string;
}

interface BookRecommendationService {
    getRecommendations(lookingFor: string): Promise<PossibleBook[]>;
}

interface ResponseData {
    results: PossibleBook[]
}

export class ChatBookRecommendationService implements BookRecommendationService {
    async getRecommendations(lookingFor: string): Promise<PossibleBook[]> {
        return fetch("https://5hfpjs67uj.execute-api.us-east-2.amazonaws.com/test/books", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lookingFor: lookingFor
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        })
        .then((responseData) => {
            const recommendationData: ResponseData = JSON.parse(responseData.body)
            return recommendationData.results
        })
        .catch(error => {
            console.error("Fetch error:", error)
            return []
        })
    }
}

export class FakeRecommendationService implements BookRecommendationService {
    async getRecommendations(lookingFor: string): Promise<PossibleBook[]> {
        return [
            {
                title: "The Count of Monte Cristo",
                author: "Alexandre Dumas",
                reason: "We think you will love this because A"
            },
            {
                title: "Uncle Tom's Cabin",
                author: "Harriet Beecher Stowe",
                reason: "We think you will love this because B"
            },
            {
                title: "The Subjection of Women",
                author: "John Stuart Mill",
                reason: "We think you will love this because C"
            },
            {
                title: "A Room of One's Own",
                author: "Virginia Woolf",
                reason: "We think you will love this because D"
            },
            {
                title: "Julius Caesar",
                author: "William Shakespeare",
                reason: "We think you will love this because E"
            }
        ]
    }
    
}

export function getRecommendationService() {
    if (process.env.REACT_APP_REC_SERVICE === "true") {
        return new ChatBookRecommendationService()
    } else {
        return new FakeRecommendationService()
    }

}

export type  {
    BookRecommendationService,
    PossibleBook
};