import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

function App() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');

  const fetchNews = (searchQuery = '') => {
    const URL = searchQuery
      ? `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${API_KEY}`
      : BASE_URL;

    axios.get(URL)
      .then(response => {
        setArticles(response.data.articles);
      })
      .catch(error => {
        console.error("Error fetching news", error);
      });
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNews(query);
  };

  return (
    <div className="App">
      <h1>Latest News</h1>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for news..."
        />
        <button type="submit">Search</button>
      </form>
      <div className="articles">
        {articles.map((article, index) => (
          <div key={index} className="article">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <p><small>{moment(article.publishedAt).format('LLLL')}</small></p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;