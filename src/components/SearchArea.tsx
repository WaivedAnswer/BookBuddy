import {FormEvent, useState } from 'react';

import { PossibleBook, getRecommendationService } from '../services/recommendations';

interface SearchAreaParams {
    setSearching : Function;
    setRecommendations : Function; 
}

function SearchArea({setSearching, setRecommendations} : SearchAreaParams) {
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    searchInner();
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Check for Enter key and that Shift is not pressed
        e.preventDefault(); // Prevents the default action (new line)
        searchInner(); // Calls the submit function
    }
};

function searchInner() {
  setSearching(true);
  setRecommendations([]);
  getRecommendationService().getRecommendations(description).then(
    (recommendations: PossibleBook[]) => {
      setSearching(false);
      setRecommendations(recommendations);
    })
    .catch((error: any) => {
      console.error("Error fetching recommendations:", error);
    });
}
    const [description, setDescription] = useState("")
    return (<form className="search-area" onSubmit={handleSubmit}>
      <div className="search-box">
        <textarea
          className="description-text"
          placeholder="What are you looking for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={handleKeyDown} />
      </div>
      <button className="search-button" type="submit">
        Search
      </button>
    </form>)
  }

 export default SearchArea;