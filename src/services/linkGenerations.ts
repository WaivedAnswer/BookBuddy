interface LinkGenerationService {
    generateLink(bookTitle: string, bookAuthor: string) : Promise<LinkResponseData>
}

interface LinkResponseData {
    link: string,
    image: string | null
}

export class AmazonBestSellerLinkGenerator implements LinkGenerationService {

    async generateLink(bookTitle: string, bookAuthor: string): Promise<LinkResponseData> {
        return fetch("https://sc2slkrny7rmct6gtx7h5gwwt40lonrx.lambda-url.us-east-2.on.aws/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                bookTitle: bookTitle,
                bookAuthor: bookAuthor
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        })
        .then((responseData : LinkResponseData) => {
            if(!responseData.link) {
                throw new Error('Failed to retrieve link. Try again.')
            }
            return responseData
        })
    }
}
class FakeLinkGenerationService implements LinkGenerationService {
    async generateLink(bookTitle: string, bookAuthor: string): Promise<LinkResponseData> {
        await new Promise(r => setTimeout(r, 2000));
        return {link: getFixedLink(bookTitle), image: this.getImage()}
    }

    getImage() {
        const images = ["https://m.media-amazon.com/images/I/51Yf9AHpFGL._AC_UL320_.jpg", 
        "https://m.media-amazon.com/images/I/91vnzZO5yPL._AC_UL320_.jpg", 
        "https://m.media-amazon.com/images/I/91JSuY8aT-L._AC_UL320_.jpg", 
        "https://m.media-amazon.com/images/I/71PcexlBwQL._AC_UL320_.jpg", 
        null, 
        null, 
        "https://m.media-amazon.com/images/I/81zk7by9jXL._AC_UL640_FMwebp_QL65_.jpg", 
        "https://m.media-amazon.com/images/I/81YkqyaFVEL._AC_UL640_FMwebp_QL65_.jpg",
        "https://m.media-amazon.com/images/I/91zJxacOUcL._AC_UL640_FMwebp_QL65_.jpg",
        "https://m.media-amazon.com/images/I/61BRxtp9qtL._AC_UL640_FMwebp_QL65_.jpg"
    ]
        const imageIndex = Math.floor(Math.random() * images.length)
        return images[imageIndex]
    }
}

export function getFixedLink(bookTitle: string) {
   return "https://www.amazon.com/s?k=" + bookTitle.replaceAll(" ", "+") + "&tag=myread0b-20"
}

export function getLinkGenerationService() {
    if(process.env.NODE_ENV === 'production' || process.env.REACT_APP_REC_SERVICE === "true") {
        return new AmazonBestSellerLinkGenerator()
    } else {
        return new FakeLinkGenerationService()
    }

}

export type {
    LinkGenerationService
}