
interface PossibleBook {
    title: string;
    author: string;
    // reason: string;
}
//TODO figure out how to handle the search term state

interface BookRecommendationService {
    getRecommendations(lookingFor: string): Promise<PossibleBook[]>;
    getRecommendationStream(lookingFor: string, onRecommendation: Function, setRecommendations: Function): Promise<void>;
    getReason(book: PossibleBook, lookingFor: string): Promise<string>;
}

interface ResponseData {
    results: PossibleBook[]
}

export class ChatBookRecommendationService implements BookRecommendationService {
    async getReason(book: PossibleBook, lookingFor: string): Promise<string> {
        throw new Error("Method not implemented.");
    }
    
    async getRecommendationStream(lookingFor: string, onRecommendation: Function, setRecommendations: Function): Promise<void> {
        const streamUrl = "https://i5hd3z5midjookwdsaa37sqfw40papbm.lambda-url.us-east-2.on.aws/";
    fetch(streamUrl, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          lookingFor: lookingFor
      })
  }).then(async response => {
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
                //   book.reason = "Because I said so"
                  onRecommendation(book)
                }
              }
          }
          curr_index += 1
        }
      }})
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
                // reason: "We think you will love this because A"
            },
            {
                title: "Uncle Tom's Cabin",
                author: "Harriet Beecher Stowe",
                // reason: "We think you will love this because B"
            },
            {
                title: "The Subjection of Women",
                author: "John Stuart Mill",
                // reason: "We think you will love this because C"
            },
            {
                title: "A Room of One's Own",
                author: "Virginia Woolf",
                // reason: "We think you will love this because D"
            },
            {
                title: "Julius Caesar",
                author: "William Shakespeare",
                // reason: "We think you will love this because E"
            }
        ]
    }
    async getReason(book: PossibleBook, lookingFor: string): Promise<string> {
        await new Promise(r => setTimeout(r, 2000));
        return `${book.title} is a great book that I am sure you will love because of your interest in "${lookingFor}"`
    }
    
    async getRecommendationStream(lookingFor: string, onRecommendation: Function, setRecommendations: Function): Promise<void> {
        let allRecommendations : PossibleBook[] = []
        for(let recommendation of this.recommendations) {
            await new Promise(r => setTimeout(r, 2000));
            allRecommendations = [...allRecommendations, recommendation]
            setRecommendations(allRecommendations)
        }
    }

    async getRecommendations(lookingFor: string): Promise<PossibleBook[]> {
        return this.recommendations
    }
    
}

export function getRecommendationService() {
    if (process.env.NODE_ENV !== "development") {
        return new ChatBookRecommendationService()
    } else {
        return new FakeRecommendationService()
    }

}

export type  {
    BookRecommendationService,
    PossibleBook
};