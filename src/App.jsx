import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

function App() {
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);

  const fetchNews = (searchQuery = '', selectedCategory = '', pageNumber = 1) => {
    let URL = BASE_URL;

    if (searchQuery) {
      URL = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${API_KEY}&page=${pageNumber}`;
    } else if (selectedCategory) {
      URL = `${BASE_URL}&category=${selectedCategory}&page=${pageNumber}`;
    } else {
      URL = `${BASE_URL}&page=${pageNumber}`;
    }

    axios.get(URL)
      .then(response => {
        setArticles(response.data.articles);
        setTotalPages(Math.ceil(response.data.totalResults / 20));
        setError(null);
      })
      .catch(error => {
        console.error("Error fetching news", error);
        setError(error);
        setArticles([]);
      });
  };

  useEffect(() => {
    fetchNews(query, category, page);
  }, [query, category, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews(query, category, 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="">All</option>
          <option value="business">Business</option>
          <option value="entertainment">Entertainment</option>
          <option value="health">Health</option>
          <option value="science">Science</option>
          <option value="sports">Sports</option>
          <option value="technology">Technology</option>
        </select>
        <button type="submit">Search</button>
      </form>
      {error && <div className="error-message">Error fetching news: {error.message}</div>}
      <div className="articles">
        {articles
          .filter(article => article.title && article.url && !article.url.includes("removed.com"))
          .map((article, index) => (
            <div key={index} className="article">
              <h2>{article.title}</h2>
              {article.urlToImage && <img src={article.urlToImage} alt={article.title} />}
              <p>{article.description}</p>
              <p><small>{moment(article.publishedAt).format('LLLL')}</small></p>
              <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
            </div>
          ))}
      </div>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default App;