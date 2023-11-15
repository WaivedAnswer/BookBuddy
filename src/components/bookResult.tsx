import { PossibleBook } from "../services/recommendations"
import img from "../images/book-cover.png"

interface BookResultParams {
    result: PossibleBook
}
function BookResult( { result } : BookResultParams) {
    return ( 
    <div className="book-result">
        <img alt="placeholder book cover" src={img} className="book-thumbnail"/>
        <p>
          {result ? result.title : ""}
        </p>
    </div>
    )
}

export default BookResult