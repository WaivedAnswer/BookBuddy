
interface PossibleBook {
    title: string;
    author: string;
}

interface BookRecommendationService {
    getRecommendations(lookingFor: string): Promise<PossibleBook[]>;
    getRecommendationStream(lookingFor: string, onRecommendation: Function): Promise<void>;
    getReason(book: PossibleBook, lookingFor: string): Promise<string>;
}

interface ResponseData {
    results: PossibleBook[]
}

interface ReasonResponseData {
    reason: string
}

export class ChatBookRecommendationService implements BookRecommendationService {
    async getReason(book: PossibleBook, lookingFor: string): Promise<string> {
        //TODO replace URLs with environment variables?
        return fetch("https://xz6ywnep4pctm7wbxubq366rei0irhty.lambda-url.us-east-2.on.aws/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lookingFor: lookingFor,
                bookTitle: book.title,
                bookAuthor: book.author
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        })
        .then((responseData : ReasonResponseData) => {
            if(!responseData.reason) {
                throw new Error('Failed to retrieve results. Try again.')
            }
            return responseData.reason
        })
    }
    
    async getRecommendationStream(lookingFor: string, onRecommendation: Function): Promise<void> {
            const streamUrl = "https://i5hd3z5midjookwdsaa37sqfw40papbm.lambda-url.us-east-2.on.aws/";
        
            const response = await fetch(streamUrl, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    lookingFor: lookingFor
                })
            })
    
            const reader = response.body?.getReader()
            const decoder = new TextDecoder("utf-8")
            let curr_recommendation_string = ""
            let curr_index = 0
            let result_start = -1
            while(true) {
                // The `read()` method returns a promise that
                // resolves when a value has been received.
                const result = await reader?.read();
                if(!result) {
                    return
                }
                // Result objects contain two properties:
                // `done`  - `true` if the stream has already given you all its data.
                // `value` - Some data. Always `undefined` when `done` is `true`.
                if (result.done) {
                    return;
                }
                const delta = decoder.decode(result.value)
                curr_recommendation_string += delta
                while(curr_index < curr_recommendation_string.length) {
                    const curr_character = curr_recommendation_string.charAt(curr_index)
                    if(curr_character === '{') {
                        result_start = curr_index
                    } else if (curr_character === '}') {
                        const result_end = curr_index
                        const curr_result = curr_recommendation_string.slice(result_start, result_end + 1)
                        if(curr_result.indexOf(']') === -1) {
                            const book : any = JSON.parse(curr_result)
                            if("title" in book && "author" in book) {
                                onRecommendation(book)
                            }
                        }
                    }
                    curr_index += 1
                }
            }
    }

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
            if(!responseData.body) {
                throw new Error('Failed to retrieve results. Try again.')
            }
            const recommendationData: ResponseData = JSON.parse(responseData.body)
            if(!recommendationData.results) {
                throw new Error('Failed to retrieve results. Try again.')
            }
            return recommendationData.results
        })
    }
}

export class FakeRecommendationService implements BookRecommendationService {
    recommendations: PossibleBook[];
    constructor() {
        this.recommendations = [
            {
                title: "The Count of Monte Cristo",
                author: "Alexandre Dumas",
            },
            {
                title: "Uncle Tom's Cabin",
                author: "Harriet Beecher Stowe",
            },
            {
                title: "The Subjection of Women",
                author: "John Stuart Mill",
            },
            {
                title: "A Room of One's Own",
                author: "Virginia Woolf",
            },
            {
                title: "Julius Caesar",
                author: "William Shakespeare",
            }
        ]
    }
    async getReason(book: PossibleBook, lookingFor: string): Promise<string> {
        await new Promise(r => setTimeout(r, 2000));
        return `${book.title} is a great book that I am sure you will love because of your interest in "${lookingFor}"`
    }
    
    async getRecommendationStream(lookingFor: string, onRecommendation: Function): Promise<void> {
        for(let recommendation of this.recommendations) {
            await new Promise(r => setTimeout(r, 2000));
            onRecommendation(recommendation)
        }
    }

    async getRecommendations(lookingFor: string): Promise<PossibleBook[]> {
        return this.recommendations
    }
    
}

export function getRecommendationService() {
    if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_REC_SERVICE === "true") {
        console.log(process.env.NODE_ENV)
        return new ChatBookRecommendationService()
    } else {
        return new FakeRecommendationService()
    }

}

export type  {
    BookRecommendationService,
    PossibleBook
};