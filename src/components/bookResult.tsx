import { PossibleBook } from "../services/recommendations"
import img from "../images/book-cover.png"

interface BookResultParams {
    result: PossibleBook
}
function BookResult( { result } : BookResultParams) {

   const amazonLink = "https://www.amazon.ca/s?k=" + result.title.replace(" ", "+")
    return ( 
    <div className="book-result">
        <img alt="placeholder book cover" src={img} className="book-thumbnail"/>
        <div className="result-info">
            <a href={amazonLink} target="_blank" rel="noreferrer">
                <h2>{result.title}</h2>
            </a>
            <p><span className="heart" aria-hidden="true">&#x2665;&nbsp;&nbsp;&nbsp;&nbsp;</span>{result.reason}</p>
        </div>
        
    </div>
    )
}

export default BookResult