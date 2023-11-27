import {FormEvent, useState } from 'react';

import './App.css';

import { PossibleBook } from './services/recommendations';

import BookResultList from './components/BookResultList';
import SearchArea from './components/SearchArea';

function App() {
  const [recommendations, setRecommendations] = useState<PossibleBook[]>([])
  const [isSearching, setSearching] = useState(false)

  return (
    <div className="App">
      <header className="App-header">
        <h1>BookBuddy</h1>
        <h3>Great Books. Just for you</h3>
      </header>
      <div className="App-body">
        <SearchArea setSearching={setSearching} setRecommendations={setRecommendations}/>
        <BookResultList results={recommendations} isSearching={isSearching}/>
      </div>
    </div>
  );
}

export default App;
