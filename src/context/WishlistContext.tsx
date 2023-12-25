import { createContext, useState, useEffect, useContext } from 'react';
import { WishlistItem, getWishlistService } from '../services/wishlist';

interface WishlistContextParams {
    wishlist : WishlistItem[];
    isLoading: boolean;
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
  const [isLoading, setLoading] = useState<boolean>(false) 

  useEffect(() => {
    const fetchWishlist = async () => {
      const wishlistService = getWishlistService()
      try {
        setLoading(true)
        const initialWishlist = await wishlistService.getWishlist();
        setWishlist(initialWishlist);
      } catch (error) {
        console.error("Failed to load wishlist", error)
        setWishlistError(WishlistError.FAILED_LOAD)
      } finally {
        setLoading(false)
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToWishlist = async (book: WishlistItem) => {
    const wishlistService = getWishlistService()
    try {
      setLoading(true)
      const newItem = await wishlistService.addToWishlist(book);
      setWishlist(wishlist => wishlist.concat(newItem));
      return true
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  };

  const handleRemoveFromWishlist = async (itemId: string) => {
    const wishlistService = getWishlistService()
    try {
      setLoading(true)
      await wishlistService.removeFromWishlist(itemId);
      setWishlist(wishlist => wishlist.filter( item => item.itemId !== itemId));
      return true
    } catch (error) {
      return false
    } finally {
      setLoading(false)
    }
  };


  return (
    <WishlistContext.Provider value={{ wishlist, isLoading, handleAddToWishlist, handleRemoveFromWishlist, wishlistError }}>
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