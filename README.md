# News App

This is a simple React application that fetches news articles from the News API based on user queries or selected categories.

## Features

- Users can search for news articles using keywords.
- Users can filter news articles by category (e.g., Business, Entertainment, Health, Science, Sports, Technology).
- Pagination support to navigate through multiple pages of search results.
- Responsive design to ensure optimal viewing experience on different devices.

## Technologies Used

- React: Frontend JavaScript library for building user interfaces.
- Axios: HTTP client for making AJAX requests.
- Moment.js: Library for parsing, manipulating, and formatting dates and times.
- Tailwind CSS: CSS framework for quickly building custom designs.
- News API: API for fetching news articles from various sources.

## How to Use

1. Clone the repository: `git clone https://github.com/bdrn/news-api-project.git`
2. Install dependencies: `npm install`
3. Obtain an API key from the [News API](https://newsapi.org/) website.
4. Create a `.env` file in the project root directory and add your API key: VITE_NEWS_API_KEY=your-api-key
5. Start the development server: `npm run dev`
6. Open your browser and visit `http://localhost:5173` to view the app.

## Credits

- This project was created by Mohamad Badran.
- The project uses data from the [News API](https://newsapi.org/).

## License

This project is licensed under the [MIT License](LICENSE).