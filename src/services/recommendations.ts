
interface PossibleBook {
    title: string;
    author: string;
}

interface BookRecommendationService {
    getRecommendationStream(lookingFor: string, onRecommendation: Function): Promise<void>;
    getAdditionalRecommendations(lookingFor: string, currentResults : PossibleBook[], onRecommendation: Function) : Promise<void>
    getReason(book: PossibleBook, lookingFor: string): Promise<string>;
}


interface ReasonResponseData {
    reason: string
}

export class ChatBookRecommendationService implements BookRecommendationService {
    getAdditionalRecommendations(lookingFor: string, currentResults: PossibleBook[], onRecommendation: Function): Promise<void> {
        const titles = currentResults.map(result => result.title)
        const additionText = `You already suggested the following: ${titles.join(", ")}. What other books do you suggest?`
        return this.getRecommendationStream(lookingFor + ". " + additionText, onRecommendation)
    }
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
            if(!response.ok) {
                throw new Error("Failed to retrieve results")
            }
            
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
                            const object : any = JSON.parse(curr_result)
                            if("title" in object && "author" in object) {
                                onRecommendation(object)
                            } else if ("error" in object) {
                                throw new Error(object.error)
                            }
                        }
                    }
                    curr_index += 1
                }
            }
    }
}

export class FakeRecommendationService implements BookRecommendationService {
    recommendations: PossibleBook[];
    additional: PossibleBook[];
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
        this.additional = [
            {
                title: "Cristo: The Count of Excellency",
                author: "Dumas Alexandre ",
            },
            {
                title: "Cabin Uncle Tom's Cabin",
                author: "Stowe Harriet",
            },
            {
                title: "Women Subjection",
                author: "Mill John",
            },
            {
                title: "Own A Room",
                author: "Woolf Virginia",
            },
            {
                title: "Caesar Julius",
                author: "Shakespeare William",
            }
        ]
    }
    async getAdditionalRecommendations(lookingFor: string, currentResults: PossibleBook[], onRecommendation: Function): Promise<void> {
        const resultCount = currentResults.length
        for(let recommendation of this.additional) { 
            recommendation.title = recommendation.title +` ${resultCount}`
            await new Promise(r => setTimeout(r, 1000));
            onRecommendation(recommendation)
        }
    }
    async getReason(book: PossibleBook, lookingFor: string): Promise<string> {
        await new Promise(r => setTimeout(r, 2000));
        return getFallbackReason(book.title)
    }
    
    async getRecommendationStream(lookingFor: string, onRecommendation: Function): Promise<void> {
        for(let recommendation of this.recommendations) {
            await new Promise(r => setTimeout(r, 1000));
            onRecommendation(recommendation)
        }
    }
}

export function getFallbackReason(bookTitle: string) {
    const bookMainTitle = bookTitle.split(":")[0]
    return `${bookMainTitle} is highly recommended by your fellow readers. We are sure you'll love it!`
}

export function getRecommendationService() {
    if (process.env.NODE_ENV === 'production' || process.env.REACT_APP_REC_SERVICE === "true" || process.env.REACT_APP_ALL_SERVICES === "true") {
        return new ChatBookRecommendationService()
    } else {
        return new FakeRecommendationService()
    }

}

export type  {
    BookRecommendationService,
    PossibleBook
};