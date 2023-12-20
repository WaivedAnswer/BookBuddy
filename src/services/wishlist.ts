import { PossibleBook } from "./recommendations"

export interface WishlistService {
    addToWishlist(book: PossibleBook): Promise<void>
    getWishlist(): Promise<PossibleBook[]>
}

class FakeWishlistService implements WishlistService {
    WISHLIST_KEY = "LOCAL_WISHLIST"
    async getWishlist(): Promise<PossibleBook[]> {
        let wishlist = JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
        return wishlist;
    }

    async addToWishlist(book: PossibleBook): Promise<void> {
        let wishlist = await this.getWishlist()
        wishlist.push(book)
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
    }
}

export function getWishlistService() {
    return new FakeWishlistService()
}