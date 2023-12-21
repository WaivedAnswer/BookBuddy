import { PossibleBook } from "./recommendations"

export interface WishlistItem {
    title: string;
    author: string;
    reason: string;
}
export interface WishlistService {
    addToWishlist(book: WishlistItem): Promise<WishlistItem[]>
    getWishlist(): Promise<WishlistItem[]>
    removeFromWishlist(book: WishlistItem): Promise<WishlistItem[]>
}

class FakeWishlistService implements WishlistService {
    WISHLIST_KEY = "LOCAL_WISHLIST"
    async getWishlist(): Promise<WishlistItem[]> {
        const wishlist = JSON.parse(localStorage.getItem(this.WISHLIST_KEY) || '[]');
        return wishlist;
    }

    async addToWishlist(book: WishlistItem): Promise<WishlistItem[]> {
        let wishlist = await this.getWishlist()
        wishlist.push(book)
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(wishlist));
        return wishlist
    }

    async removeFromWishlist(book: WishlistItem): Promise<WishlistItem[]> {
        let wishlist = await this.getWishlist()
        const newList =  wishlist.filter(wishlistBook => wishlistBook.title !== book.title)
        localStorage.setItem(this.WISHLIST_KEY, JSON.stringify(newList));
        return newList
    }
}

export function getWishlistService() {
    return new FakeWishlistService()
}