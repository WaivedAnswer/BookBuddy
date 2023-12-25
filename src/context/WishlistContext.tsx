import { createContext, useState, useEffect, useContext } from 'react';
import { WishlistItem, getWishlistService } from '../services/wishlist';

interface WishlistContextParams {
    wishlist : WishlistItem[];
    wishlistError : null | WishlistError;
    handleAddToWishlist : (book: WishlistItem) => Promise<boolean>;
    handleRemoveFromWishlist : (itemId: string) => Promise<boolean>;
}
const WishlistContext = createContext<null | WishlistContextParams> (null);

enum WishlistError {
  FAILED_LOAD
}

export const WishlistProvider = ({ children } : any) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [wishlistError, setWishlistError] = useState<null | WishlistError>(null)

  useEffect(() => {
    const fetchWishlist = async () => {
      const wishlistService = getWishlistService()
      try {
        const initialWishlist = await wishlistService.getWishlist();
        setWishlist(initialWishlist);
      } catch (error) {
        console.error("Failed to load wishlist", error)
        setWishlistError(WishlistError.FAILED_LOAD)
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToWishlist = async (book: WishlistItem) => {
    const wishlistService = getWishlistService()
    try {
      const newItem = await wishlistService.addToWishlist(book);
      setWishlist(wishlist => wishlist.concat(newItem));
      return true
    } catch (error) {
      return false
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    const wishlistService = getWishlistService()
    try {
      await wishlistService.removeFromWishlist(itemId);
      setWishlist(wishlist => wishlist.filter( item => item.itemId !== itemId));
      return true
    } catch (error) {
      return false
    }
  };


  return (
    <WishlistContext.Provider value={{ wishlist, handleAddToWishlist, handleRemoveFromWishlist, wishlistError }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === null) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};