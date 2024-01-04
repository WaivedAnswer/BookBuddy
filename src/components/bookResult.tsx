import { PossibleBook, 
  getFallbackReason } from "../services/recommendations"
import { useEffect, useState } from "react"
import BookDisplay from "./BookDisplay"
import { useRecommendations } from "../context/RecommendationContext"

interface BookResultParams {
  result: PossibleBook,
  currentSearch: string,
}
function BookResult( { result, currentSearch } : BookResultParams) {
  const [reason, setReason] = useState<string | null>(null)
  const { getReason } = useRecommendations()
  useEffect(() => {
    async function loadReason() {
      try {
        const reasonResult = await getReason(result, currentSearch)
        setReason(previousReason => previousReason ? previousReason : reasonResult)
      } catch (error) {
        setReason(getFallbackReason(result.title))
      }
    }
    loadReason()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, currentSearch])
  return ( 
    <BookDisplay title={result.title} author={result.author} reason={reason ? reason : ""}/>
  )
}

export default BookResult
