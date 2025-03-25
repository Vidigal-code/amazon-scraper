/**
 * The URL for the backend API endpoint to scrape Amazon products.
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/scrape';

/**
 * DOM Elements with renamed IDs
 */
const key = document.getElementById('key');
const search = document.getElementById('search');
const results = document.getElementById('results');
const Loading = document.getElementById('Loading');
const ErrorMessage = document.getElementById('ErrorMessage');

/**
 * Event Listener for Search Button
 * When the button is clicked, it triggers the scrapeProducts function.
 */
search.addEventListener('click', scrapeProducts);

/**
 * Event Listener for Enter key press on keyword input
 * Triggers scrapeProducts when Enter is pressed
 */
key.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        scrapeProducts();
    }
});

/**
 * Function to scrape products from the backend API based on the search keyword.
 * It fetches product data from the server and displays the results.
 */
function scrapeProducts() {
    const keyword = key.value.trim();

    // Reset previous results and errors
    results.innerHTML = '';
    ErrorMessage.classList.add('hidden');
    Loading.classList.remove('hidden');

    // Check if the keyword is provided
    if (!keyword) {
        showError('Please enter a search keyword');
        return;
    }

    // Fetch data from the API using fetch() and handle the response using .then() and .catch()
    fetch(`${API_URL}?keyword=${encodeURIComponent(keyword)}`)
        .then(response => {
            // If response is not OK (status code not in the range 200-299), reject the promise
            if (!response.ok) {
                return Promise.reject(new Error('Failed to fetch products'));
            }
            return response.json();
        })
        .then(products => {
            // Display the products if they were fetched successfully
            displayProducts(products);
        })
        .catch(error => {
            // Handle any errors that occur during the fetch operation
            showError(error.message);
        })
        .finally(() => {
            // Hide the loading indicator regardless of success or failure
            Loading.classList.add('hidden');
        });
}

/**
 * Function to display the products on the page.
 * If no products are found, an error message is shown.
 * @param {Array} products - The list of products to display.
 */
function displayProducts(products) {
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = '';

    if (products.length === 0) {
        resultsContainer.innerHTML = '<div class="error">No products found</div>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        function getStars(rating) {
            const fullStars = Math.floor(rating);
            const halfStar = rating % 1 >= 0.5 ? 1 : 0;
            const emptyStars = 5 - fullStars - halfStar;

            let starsHTML = '';

            for (let i = 0; i < fullStars; i++) {
                starsHTML += '★';
            }

            if (halfStar) {
                starsHTML += '☆';
            }

            for (let i = 0; i < emptyStars; i++) {
                starsHTML += '☆';
            }

            if (rating > 5) {
                starsHTML = '★★★★★ 6 star';
            }

            return starsHTML;
        }

        card.innerHTML = `
            ${product.imageUrl ?
            `<img src="${product.imageUrl}" alt="${product.title}">` :
            '<div class="no-image">No Image</div>'
        }
            <div class="product-title">${product.title}</div>
            ${product.rating ?
            `<div class="product-rating">${getStars(product.rating)}<div style="color: black">Rating : ${product.rating}</div></div>` :
            ''
        }
            ${product.price ?
            `<div class="product-price">${product.price}</div>` :
            ''
        }
            ${product.reviewCount ?
            `<div class="product-reviews">(${product.reviewCount} reviews)</div>` :
            ''
        }
            ${product.unitCount ?
            `<div class="product-reviews">${product.unitCount}</div>` :
            ''
        }
           ${product.purchaseCount ?
            `<div class="product-reviews">${product.purchaseCount}</div>` :
            ''
        }
             ${product.shippingInfo ?
            `<div class="product-reviews">${product.shippingInfo}</div>` :
            ''
        }
        `;

        resultsContainer.appendChild(card);
    });
}


/**
 * Function to show an error message on the page.
 * @param {string} message - The error message to display.
 */
function showError(message) {
    ErrorMessage.textContent = message;
    ErrorMessage.classList.remove('hidden');
}