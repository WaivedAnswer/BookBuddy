import { createContext, useContext, useState } from 'react';
import { PossibleBook, getFallbackReason, getRecommendationService } from '../services/recommendations';

export enum SearchStatus {
  INITIAL,
  SEARCHING,
  FINISHED,
  NO_RESULTS,
  ERROR,
  MODERATION_ERROR
}

interface RecommendationContextParams {
  recommendations: PossibleBook[];
  addRecommendation: Function;
  clearRecommendations: Function;
  searchStatus: SearchStatus;
  setSearchStatus: Function;
  currentSearch: string;
  setCurrentSearch: Function;
  getReason: (book: PossibleBook, search: string) => Promise<string>;
}
const RecommendationContext = createContext<null | RecommendationContextParams> (null);

function getReasonKey(book: PossibleBook) {
  return `${book.title}|${book.author}`
}

export const RecommendationProvider = ({ children } : any) => {
  const [recommendations, setRecommendations] = useState<PossibleBook[]>([])
  const [searchStatus, setSearchStatus] = useState<SearchStatus>(SearchStatus.INITIAL)
  const [currentSearch, setCurrentSearch] = useState<string>("")
  const [reasons, setReasons] = useState<Map<string, string>>(new Map())

  const addRecommendation = (recommendation: PossibleBook) => {
    setRecommendations(prevRecommendations => [...prevRecommendations, recommendation])
  }

  const setReason = (result: PossibleBook, reason: string) => {
    setReasons(currReasons => new Map(currReasons.set(getReasonKey(result), reason)))
  }

  const getReason = async (result: PossibleBook) => {
    try {
      const resultKey = getReasonKey(result)
      if(reasons.has(resultKey)) {
        return reasons.get(resultKey) || getFallbackReason(result.title)
      }
      const reasonResult = await getRecommendationService().getReason(result, currentSearch)
      setReason(result, reasonResult)
      return reasonResult
    } catch (error) {
      const fallbackReason = getFallbackReason(result.title)
      setReason(result, fallbackReason)
      return fallbackReason
    }
  }

  const clearRecommendations = (book: PossibleBook) => {
    setRecommendations([])
    setReasons(new Map())
  }

  return (
    <RecommendationContext.Provider value={{recommendations, 
    addRecommendation, 
    clearRecommendations, 
    searchStatus, 
    setSearchStatus, 
    currentSearch, 
    setCurrentSearch,
    getReason }}>
      {children}
    </RecommendationContext.Provider>
  );
};

export const useRecommendations = () => {
  const context = useContext(RecommendationContext);
  if (context === null) {
    throw new Error('useRecommendations must be used within a RecommendationProvider');
  }
  return context;
};