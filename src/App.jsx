import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './index.css';
import titleImage from './assets/title.png';
import noImage from './assets/no-image.jpg';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

function App() {
  // State variables
  const [articles, setArticles] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Function to fetch news from the API
  const fetchNews = (searchQuery = '', selectedCategory = '', pageNumber = 1) => {
    setLoading(true);
    let URL = BASE_URL;
    const pageSize = 16;
  
    if (searchQuery) {
      URL = `https://newsapi.org/v2/everything?q=${searchQuery}&apiKey=${API_KEY}&pageSize=${pageSize}&page=${pageNumber}`;
    } else if (selectedCategory) {
      URL = `${BASE_URL}&category=${selectedCategory}&pageSize=${pageSize}&page=${pageNumber}`;
    } else {
      URL = `${BASE_URL}&pageSize=${pageSize}&page=${pageNumber}`;
    }
  
    axios.get(URL)
      .then(response => {
        setArticles(response.data.articles);
        setTotalPages(Math.ceil(response.data.totalResults / pageSize));
        setError(null);
        preloadImages(response.data.articles);
      })
      .catch(error => {
        console.error("Error fetching news", error);
        setError(error);
        setArticles([]);
        setLoading(false);
      });
  };
  
  // Preload images
  const preloadImages = (articles) => {
    const imagePromises = articles.map(article => {
      if (article.urlToImage) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = article.urlToImage;
          img.onload = resolve;
          img.onerror = reject;
        });
      }
      return Promise.resolve();
    });

    Promise.all(imagePromises)
      .then(() => setImagesLoaded(true))
      .catch(() => setImagesLoaded(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNews(query, category, page);
  }, [query, category, page]);

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchNews(query, category, 1);
  };

  // Handle pagination - next page
  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(prevPage => prevPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handle pagination - previous page
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="App p-4 max-w-screen-lg mx-auto">
      {/* Logo */}
      <img src={titleImage} alt="Logo" className="mx-auto mb-12 w-full max-w-sm" onClick={() => setPage(1)} />

      {/* Search form */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for news..."
            className="px-4 py-3 border rounded w-full md:flex-1"
          />
          <select onChange={(e) => setCategory(e.target.value)} value={category} className="px-4 py-3 border rounded md:flex-1">
            <option value="">All</option>
            <option value="business">Business</option>
            <option value="entertainment">Entertainment</option>
            <option value="health">Health</option>
            <option value="science">Science</option>
            <option value="sports">Sports</option>
            <option value="technology">Technology</option>
          </select>
          <button type="submit" className="px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300">Search</button>
        </div>
      </form>

      {/* Loading spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32"></div>
        </div>
      ) : error ? (
        <div className="error-message text-red-500 mb-4">Error fetching news: {error.message}</div>
      ) : (
        /* Article grid */
        <div className="articles grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles
            .filter(article => article.title && article.url && !article.url.includes("removed.com"))
            .map((article, index) => (
              <div key={index} className="article p-4 border rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-2">{article.title}</h2>
                {article.urlToImage ? (
                  <img src={article.urlToImage} alt={article.title} className="w-full h-48 object-cover mb-2" />
                ) : (
                  <img src={noImage} alt="No Image" className="w-full h-48 object-cover mb-2" />
                )}
                <p className="mb-2">{article.description}</p>
                <p className="text-gray-600 mb-2"><small>{moment(article.publishedAt).format('LLLL')}</small></p>
                <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Read Article</a>
              </div>
            ))}
        </div>
      )}

      {/* Pagination */}
      <div className="pagination flex justify-center items-center space-x-4 mt-8">
        <button onClick={handlePreviousPage} disabled={page === 1} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition duration-300">Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button onClick={handleNextPage} disabled={page === totalPages} className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition duration-300">Next</button>
      </div>
    </div>
  );
}

export default App;