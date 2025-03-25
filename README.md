# Amazon Product Scraper

## 🌐 Project Overview

This is a web application that allows users to scrape Amazon product listings by entering a search keyword. The application consists of a Bun-powered backend API and a frontend built with HTML, CSS, and Vanilla JavaScript.

## ✨ Features

- Search Amazon products by keyword
- Extract product details:
   - Product Title
   - Rating
   - Number of Reviews
   - Product Image URL
- Responsive and user-friendly interface
- Error handling for network and search issues

## 🛠 Prerequisites

Before you begin, ensure you have the following installed:
- [Bun](https://bun.sh/) (Backend runtime)
- [Node.js](https://nodejs.org/) (Frontend development)
- [Git](https://git-scm.com/)

## 📦 Project Structure

```
amazon-scraper/
│
├── backend/
│   ├── .env
│   ├── server.js
│   ├── scraper.js
│   └── package.json
│
├── frontend/
│   ├── .env
│   ├── index.html
│   ├── main.js
│   ├── css/
│   │   └── styles.css
│   └── package.json
│
└── README.md
```

## 🚀 Installation and Setup

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   API_AMAZON_SEARCH=https://www.amazon.com/s?k=
   API_GET_SCRAPE=/api/scrape
   PORT=3000
   HOST=http://localhost
   ```

4. Start the backend server:
   ```bash
   bun start
   ```
   The server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```
   VITE_API_URL=http://localhost:3000/api/scrape
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will typically run on `http://localhost:5173`

## 🖥 Usage

1. Ensure both backend and frontend servers are running
2. Open the frontend URL in your browser
3. Enter a keyword in the search input
4. Click "Scrape Products" to fetch and display results

## ⚠️ Disclaimer

Web scraping may violate Amazon's Terms of Service. Use this project responsibly and ethically. Always respect website terms and conditions.

## 🛡 Error Handling

The application includes robust error handling:
- Input validation
- Network error handling
- Empty result handling

## 💻 Technologies Used

- **Backend**:
   - Bun
   - Express
   - Axios
   - JSDOM

- **Frontend**:
   - HTML
   - CSS
   - Vanilla JavaScript
   - Vite

## 📧 Contact

Email: [ kauanvidigalcontato@gmail.com ]

Project Link: [ https://github.com/Vidigal-code/amazon-scraper ]


## 👀 View

 <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
    <img src="https://github.com/Vidigal-code/amazon-scraper/blob/main/example/view-pet.png?raw=true" alt="Imagem Exemplo">
  </div>
