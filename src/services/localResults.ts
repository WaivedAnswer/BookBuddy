interface LocalBookService {
    searchResults(longitude: number | null, latitude: number | null, isbn: string | null, postal : string) : Promise<ShopResultParams[]>
}

export interface ShopResultParams {
    address : string,
    city : string,
    distance_km : number,
    //distance_mi : 34,
    // is_preorder: false
    // latitude : "49.8859"
    // longitude : "-119.4948"
    name : string
    onhand : true
    onorder : false
    phone : string
    // postal : "V1Y 6N8"
    // province : "BC"
    san : string
    url : string
}

export class BookManagerLocalBookService implements LocalBookService {

    async searchResults(longitude: number | null, latitude: number | null, isbn: string | null, postal : string) : Promise<ShopResultParams[]> {
            let body = new FormData();
            body.append("api_key", "5YKqfETqdBbDihZZEozM65k8jmeXs9tR")
            if(isbn) {
                body.append("isbn", isbn)
            }
            body.append("distance_km", "100")

            if(longitude && latitude) {
                body.append("latitude", latitude.toString())
                body.append("longitude", longitude.toString())
            } else {
                body.append("postal", postal)
            }
    
            return fetch("https://api.bookmanager.com/tbm/nearbyStores/get", {
                    method: "POST",
                    body: body
                }).then((function(e) {
                    return e.json()
                })).then(result => {
                    if(result.error) {
                        console.error(`Failed ${JSON.stringify(result)}`)
                        return []
                    } else {
                        return result.rows
                    }
                })
    }
}


export function getLocalBookService() {
    if(process.env.NODE_ENV === 'production' || process.env.REACT_APP_SHOP_LOCAL_SERVICE === "true" || process.env.REACT_APP_ALL_SERVICES === "true") {
        return new BookManagerLocalBookService()
    } else {
        return new BookManagerLocalBookService()

    }

}

export type {
    LocalBookService
}