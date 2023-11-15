import { PossibleBook } from "../services/recommendations"
import BookResult from "./BookResult"

interface BookResultListParams {
    results: PossibleBook[]
}
function BookResultList( { results } : BookResultListParams) {
    if (results.length === 0) {
        return null
    }
    return ( 
        <div>
            <h1 className="result-title">Results</h1>
            <ol>
            { results.map((book : PossibleBook) => (
            <li key={book.isbn}>
                <BookResult result={book}/> 
            </li>
            ))}
            </ol>
        </div>
        
    )
}

export default BookResultList