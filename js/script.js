'use strict';

// TMDb API configuration
const API_KEY = '343ea85215eca0d0ad819adf3be4f2a5';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Endpoints for movie categories
const ENDPOINTS = {
    nowPlaying: `${BASE_URL}/movie/now_playing?api_key=${API_KEY}`,
    popular: `${BASE_URL}/movie/popular?api_key=${API_KEY}`,
    topRated: `${BASE_URL}/movie/top_rated?api_key=${API_KEY}`,
    upcoming: `${BASE_URL}/movie/upcoming?api_key=${API_KEY}`
};

// Fetch movies from API
async function fetchMovies(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Create and display movie cards
function displayMovies(movies) {
    const mainSection = document.querySelector('main');
    mainSection.innerHTML = ''; // Clear any existing content

    movies.forEach(movie => {
        // Create movie card elements
        const card = document.createElement('article');
        card.classList.add('card');

        const header = document.createElement('header');
        const cardHeader = document.createElement('h2');
        cardHeader.classList.add('card-header');
        cardHeader.textContent = movie.title;

        const movieInfo = document.createElement('section');
        movieInfo.classList.add('movie-info');

        const img = document.createElement('img');
        img.src = movie.poster_path ? `${IMAGE_BASE_URL}${movie.poster_path}` : 'placeholder.png'; // Fallback image
        img.alt = movie.title;

        const infoDiv = document.createElement('div');
        const overview = document.createElement('p');
        overview.classList.add('overview');
        overview.textContent = movie.overview || 'No description available.';

        const originalTitle = document.createElement('p');
        originalTitle.innerHTML = `<span class="bold">Original title: </span><span class="original-title">${movie.original_title}</span>`;

        const releaseDate = document.createElement('p');
        releaseDate.innerHTML = `<span class="bold">Release date: </span><span class="release-date">${movie.release_date || 'Unknown'}</span>`;

        // Append elements
        infoDiv.append(overview, originalTitle, releaseDate);
        movieInfo.append(img, infoDiv);
        header.appendChild(cardHeader);
        card.append(header, movieInfo);
        mainSection.appendChild(card);
    });
}

// Function to handle category clicks
function handleCategoryClick(category) {
    const endpoint = ENDPOINTS[category];
    fetchMovies(endpoint).then(movies => {
        if (movies) displayMovies(movies);
    });
}

// Add event listeners to the navigation
document.querySelectorAll('nav ul li').forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');
        handleCategoryClick(category);
    });
});

// Load Now Playing movies by default when the page loads
window.addEventListener('DOMContentLoaded', () => {
    handleCategoryClick('nowPlaying');
});
