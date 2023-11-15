import {useState } from 'react';

import logo from './logo.svg';
import './App.css';

import { PossibleBook, ChatBookRecommendationService } from './services/recommendations';

import BookResultList from './components/BookResultList';

const service = new ChatBookRecommendationService()

function App() {
  const [description, setDescription] = useState("")
  const [recommendations, setRecommendations] = useState<PossibleBook[]>([])

  const search = () => {
    service.getRecommendations(description).then(
      ( recommendations: PossibleBook[] ) => { 
        setRecommendations(recommendations) })
      .catch((error: any) => {
        console.error("Error fetching recommendations:", error);
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="search-area">
          <div className="search-box">
            <label htmlFor="description">Description:</label>
            <textarea
            id="description"
            className="description-text"
            placeholder="What are you looking for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <button className="search-button" onClick={search}>
            Search
          </button>
        </div>
        <BookResultList results={recommendations}/>
      </header>
    </div>
  );
}

export default App;
