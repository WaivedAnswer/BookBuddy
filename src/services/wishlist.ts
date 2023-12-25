
import { fetchAuthSession } from 'aws-amplify/auth';

export interface WishlistItem {
    title: string;
    author: string;
    reason: string;
    itemId?: string
}
export interface WishlistService {
    addToWishlist(book: WishlistItem): Promise<WishlistItem>
    getWishlist(): Promise<WishlistItem[]>
    removeFromWishlist(itemId: string): Promise<void>
}

class RealWishlistService implements WishlistService {
    async addToWishlist(book: WishlistItem): Promise<WishlistItem> {
        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString();
        return fetch("https://brszebkvlb.execute-api.us-east-2.amazonaws.com/beta/wishlist", {
            method: "POST",
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: book.title,
                author: book.author,
                reason: book.reason
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        })
        .then((responseData : any) => {
            if(!responseData.item) {
                throw new Error("Failed to add item")
            }
            return responseData.item
        })
    }
    async getWishlist(): Promise<WishlistItem[]> {
        let token 
        try {
            const session = await fetchAuthSession()
            token = session.tokens?.idToken?.toString();
        } catch (error) {
            throw new Error("failed to retrieve session")
        }
        return fetch("https://brszebkvlb.execute-api.us-east-2.amazonaws.com/beta/wishlist", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                console.error(response)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            return response.json()
        })
        .then((responseData : any) => {
            return responseData.items
        })
    }
    async removeFromWishlist(itemId: string): Promise<void> {
        const session = await fetchAuthSession()
        const token = session.tokens?.idToken?.toString();
        if(!itemId) {
            throw new Error("Wishlist item has not been assigned an id")
        }
        const url = `https://brszebkvlb.execute-api.us-east-2.amazonaws.com/beta/wishlist/${itemId}`
        return fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json()
        })
        .then((responseData : any) => {
            if(!responseData.success) {
                throw new Error("Failed to remove item")
            }
        })
    } 

}

class FakeWishlistService implements WishlistService {
    WISHLIST_KEY = "LOCAL_WISHLIST"
    async getWishlist(): Promise<WishlistItem[]> {
        const wishlist = JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
        return wishlist;
    }

    async addToWishlist(book: WishlistItem): Promise<WishlistItem> {
        let wishlist = await this.getWishlist()
        wishlist.push(book)
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
        return book
    }

    async removeFromWishlist(itemId: string): Promise<void> {
        let wishlist = await this.getWishlist()
        const newList =  wishlist.filter(wishlistBook => wishlistBook.itemId !== itemId)
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(newList));
    }
}

export function getWishlistService() {
    return new RealWishlistService()
}