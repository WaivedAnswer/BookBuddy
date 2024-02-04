interface BookInfoService {
    getInfo(bookTitle: string, bookAuthor: string) : Promise<BookInfoResponseData>
}

interface BookInfoResponseData {
    image: string | null,
    isbn: string | null
}

export class ISBNBookInfoService implements BookInfoService {

    async getInfo(bookTitle: string, bookAuthor: string): Promise<BookInfoResponseData> {
        return fetch("https://h5tehzdid55sawunp5cetk4vue0rcjer.lambda-url.us-east-2.on.aws/", {
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
        .then((responseData : any) => {
            if(responseData.error) {
                throw new Error(responseData.error)
            }
            if(!responseData.isbn) {
                throw new Error('Failed to retrieve book info. Try again.')
            }
            return responseData
        })
    }
}
class FakeBookInfoService implements BookInfoService {
    async getInfo(bookTitle: string, bookAuthor: string): Promise<BookInfoResponseData> {
        await new Promise(r => setTimeout(r, 2000));
        return {image: this.getImage(), isbn: this.getISBN()}
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
        "https://m.media-amazon.com/images/I/61BRxtp9qtL._AC_UL640_FMwebp_QL65_.jpg",
        "https://m.media-amazon.com/images/I/81SrwYY-6-L._AC_UY218_.jpg"
    ]
        const imageIndex = Math.floor(Math.random() * images.length)
        return images[imageIndex]
    }

    getISBN() {
        const isbns = ["9781982137274",
        "9780735211292"
        ]
        const isbnIndex = Math.floor(Math.random() * isbns.length)
        return isbns[isbnIndex]
    }
}


export function getBookInfoService() {
    if(process.env.NODE_ENV === 'production' || process.env.REACT_APP_BOOK_SERVICE === "true") {
        return new ISBNBookInfoService()
    } else {
        return new FakeBookInfoService()
    }

}

export type {
    BookInfoService
}