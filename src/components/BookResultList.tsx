import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"
import LoadingIcon from "./LoadingIcon"

interface BookResultListParams {
    results: PossibleBook[],
    isSearching: boolean
}
function BookResultList( { results, isSearching } : BookResultListParams) {
    if (isSearching) {
        return (<LoadingIcon/>)
    }
    if (results.length === 0) {
        return null
    }
    return ( 
        <div className ="book-results">
            <h1 className="result-title">Results</h1>
            <ol>
            { results.map((book : PossibleBook) => (
            <li key={book.title}>
                <BookResult result={book}/> 
            </li>
            ))}
            </ol>
        </div>
        
    )
}

export default BookResultList