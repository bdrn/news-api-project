import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import './App.css';

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const URL = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    axios.get(URL)
      .then(response => {
        setArticles(response.data.articles);
      })
      .catch(error => {
        console.error("Error fetching news", error);
      });
  }, []);

  return (
    <div className="App">
      <h1>Latest News</h1>
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