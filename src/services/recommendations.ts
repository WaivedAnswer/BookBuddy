import OpenAI from "openai";

interface PossibleBook {
    isbn: string;
    title: string;
    author: string;
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
                "isbn": "9781840224337",
                "title": "The Count of Monte Cristo",
                "author": "Alexandre Dumas"
            },
            {
                "isbn": "9780553213652",
                "title": "Uncle Tom's Cabin",
                "author": "Harriet Beecher Stowe"
            },
            {
                "isbn": "9780140431957",
                "title": "The Subjection of Women",
                "author": "John Stuart Mill"
            },
            {
                "isbn": "9780141441474",
                "title": "A Room of One's Own",
                "author": "Virginia Woolf"
            },
            {
                "isbn": "0743482832",
                "title": "Julius Caesar",
                "author": "William Shakespeare"
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