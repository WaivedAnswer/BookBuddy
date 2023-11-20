import {FormEvent, useState } from 'react';

import './App.css';

import { PossibleBook, getRecommendationService } from './services/recommendations';

import BookResultList from './components/BookResultList';

function App() {
  const [description, setDescription] = useState("")
  const [recommendations, setRecommendations] = useState<PossibleBook[]>([])
  const [isSearching, setSearching] = useState(false)

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

  return (
    <div className="App">
      <header className="App-header">
        <h1>BookBuddy</h1>
        <h3>Great Books. Just for you</h3>
      </header>
      <div className="App-body">
        <form className="search-area" onSubmit={handleSubmit}>
            <div className="search-box">
              <textarea
              className="description-text"
              placeholder="What are you looking for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              />
            </div>
            <button className="search-button" type="submit">
              Search
            </button>
          </form>
          <BookResultList results={recommendations} isSearching={isSearching}/>
      </div>
    </div>
  );
}

export default App;
