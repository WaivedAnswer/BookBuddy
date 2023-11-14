import { SetStateAction, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { PossibleBook, ChatBookRecommendationService } from './services/recommendations';

const service = new ChatBookRecommendationService()

function App() {
  const [description, setDescription] = useState("")
  const [recommendation, setRecommendation] = useState<PossibleBook | null>(null)

  const search = () => {
    service.getRecommendation(description).then(
      ( recommendation: PossibleBook | null ) => { setRecommendation(recommendation) })
      .catch((error: any) => {
        console.error("Error fetching recommendations:", error);
      })
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="search-area">
          <label htmlFor="description">Description:</label>
          <textarea
          id="description"
          placeholder="Tell me what you're looking for"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          />
          <button onClick={search}>
            Search
          </button>
        </div>
        <p>
          {recommendation ? recommendation.title : ""}
        </p>
      </header>
    </div>
  );
}

export default App;
