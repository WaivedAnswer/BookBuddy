import React, { createContext, useState, useEffect, useContext } from 'react';
import { getWishlistService } from '../services/wishlist';
import { PossibleBook } from '../services/recommendations';

interface WishlistContextParams {
    wishlist : PossibleBook[];
    wishlistError : null | WishlistError;
    handleAddToWishlist : (book: PossibleBook) => Promise<boolean>;
    handleRemoveFromWishlist : (book: PossibleBook) => Promise<boolean>;
}
const WishlistContext = createContext<null | WishlistContextParams> (null);

enum WishlistError {
  FAILED_LOAD
}

export const WishlistProvider = ({ children } : any) => {
  const [wishlist, setWishlist] = useState<PossibleBook[]>([]);
  const [wishlistError, setWishlistError] = useState<null | WishlistError>(null)

  useEffect(() => {
    const fetchWishlist = async () => {
      const wishlistService = getWishlistService()
      try {
        const initialWishlist = await wishlistService.getWishlist();
        setWishlist(initialWishlist);
      } catch (error) {
        setWishlistError(WishlistError.FAILED_LOAD)
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToWishlist = async (book: PossibleBook) => {
    const wishlistService = getWishlistService()
    try {
      const updatedWishlist = await wishlistService.addToWishlist(book);
      setWishlist(updatedWishlist);
      return true
    } catch (error) {
      return false
    }
  };

  const handleRemoveFromWishlist = async (book: PossibleBook) => {
    const wishlistService = getWishlistService()
    try {
      const updatedWishlist = await wishlistService.removeFromWishlist(book);
      setWishlist(updatedWishlist);
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