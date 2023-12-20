import React, { createContext, useState, useEffect, useContext } from 'react';
import { getWishlistService } from '../services/wishlist';
import { PossibleBook } from '../services/recommendations';

interface WishlistContextParams {
    wishlist : PossibleBook[];
    handleAddToWishlist : (book: PossibleBook) => void;
    handleRemoveFromWishlist : (book: PossibleBook) => void;
}
const WishlistContext = createContext<null | WishlistContextParams> (null);

export const WishlistProvider = ({ children } : any) => {
  const [wishlist, setWishlist] = useState<PossibleBook[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      const wishlistService = getWishlistService()
      const initialWishlist = await wishlistService.getWishlist();
      setWishlist(initialWishlist);
    };

    fetchWishlist();
  }, []);

  const handleAddToWishlist = async (book: PossibleBook) => {
    const wishlistService = getWishlistService()
    const updatedWishlist = await wishlistService.addToWishlist(book);
    setWishlist(updatedWishlist);
  };

  const handleRemoveFromWishlist = async (book: PossibleBook) => {
    const wishlistService = getWishlistService()
    const updatedWishlist = await wishlistService.removeFromWishlist(book);
    setWishlist(updatedWishlist);
  };


  return (
    <WishlistContext.Provider value={{ wishlist, handleAddToWishlist, handleRemoveFromWishlist }}>
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