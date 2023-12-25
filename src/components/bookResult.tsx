import { PossibleBook, 
  getFallbackReason, 
  getRecommendationService } from "../services/recommendations"
import { useEffect, useState } from "react"
import BookDisplay from "./BookDisplay"

interface BookResultParams {
  result: PossibleBook,
  currentSearch: string,
}
function BookResult( { result, currentSearch } : BookResultParams) {
  const [reason, setReason] = useState<string | null>(null)
  useEffect(() => {
    async function loadReason() {
      try {
        const reasonResult = await getRecommendationService().getReason(result, currentSearch)
        setReason(previousReason => previousReason ? previousReason : reasonResult)
      } catch (error) {
        setReason(getFallbackReason(result.title))
      }
    }
    loadReason()
  }, [result, currentSearch])
  return ( 
    <BookDisplay title={result.title} author={result.author} reason={reason ? reason : ""}/>
  )
}

export default BookResult
