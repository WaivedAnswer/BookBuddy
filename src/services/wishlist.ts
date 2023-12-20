import { PossibleBook } from "./recommendations"

export interface WishlistService {
    addToWishlist(book: PossibleBook): Promise<PossibleBook[]>
    getWishlist(): Promise<PossibleBook[]>
    removeFromWishlist(book: PossibleBook): Promise<PossibleBook[]>
}

class FakeWishlistService implements WishlistService {
    WISHLIST_KEY = "LOCAL_WISHLIST"
    async getWishlist(): Promise<PossibleBook[]> {
        const wishlist = JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
        return wishlist;
    }

    async addToWishlist(book: PossibleBook): Promise<PossibleBook[]> {
        let wishlist = await this.getWishlist()
        wishlist.push(book)
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
        return wishlist
    }

    async removeFromWishlist(book: PossibleBook): Promise<PossibleBook[]> {
        let wishlist = await this.getWishlist()
        const newList =  wishlist.filter(wishlistBook => wishlistBook.title !== book.title)
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(newList));
        return newList
    }
}

export function getWishlistService() {
    return new FakeWishlistService()
}