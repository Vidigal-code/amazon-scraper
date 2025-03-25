import axios from 'axios';
import {JSDOM} from 'jsdom';
import dotenv from 'dotenv';
dotenv.config();

const API_AMAZON_SEARCH = process.env.API_AMAZON_SEARCH || 'https://www.amazon.com/s?k=';

/**
 * Scrapes product information from Amazon based on a given search keyword.
 *
 * @param {string} keyword - The search term to find products on Amazon.
 * @returns {Promise<Array<ProductInfo>>} A promise that resolves to an array of product information.
 *
 * @typedef {Object} ProductInfo
 * @property {string} title - The title of the product.
 * @property {number|null} rating - The product rating out of 5 stars.
 * @property {number} reviewCount - Total number of product reviews.
 * @property {string|null} imageUrl - URL of the product's primary image.
 *
 * @example
 * // Basic usage
 * scrapeAmazonProducts('wireless headphones')
 *   .then(products => {
 *     console.log(products);
 *   })
 *   .catch(error => {
 *     console.error('Error fetching products:', error);
 *   });
 *
 * @throws {Error} Throws an error if the network request fails or page cannot be parsed.
 */
export function scrapeAmazonProducts(keyword) {
    /**
     * Construct the Amazon search URL with the given keyword.
     * Encodes the keyword to handle special characters safely.
     */
    const searchUrl = `${API_AMAZON_SEARCH}${encodeURIComponent(keyword)}`;

    /**
     * Fetch Amazon search results with browser-like headers to prevent blocking.
     */
    return axios.get(searchUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept-Language': 'en-US,en;q=0.9'
        }
    }).then(response => {


        const dom = new JSDOM(response.data);
        const document = dom.window.document;

        // Select product containers using Amazon's data component attribute
        const productElements = document.querySelectorAll('[data-component-type="s-search-result"]');

        // Process each product element
        const products = Array.from(productElements)
            .map(product => {

                /** TITLE EXTRACTION **/
                const titleSelectors = [
                    '.a-size-medium.a-color-base.a-text-normal',
                    '.a-size-base-plus.a-color-base.a-text-normal',
                    'span.a-text-normal'
                ];

                const titleElement = titleSelectors.map(sel => product.querySelector(sel)).find(el => el);
                const title = titleElement?.textContent.trim() || 'Title Unavailable';

                /** RATING EXTRACTION **/
                const ratingElement = product.querySelector('.a-icon-alt');
                const rating = ratingElement
                    ? parseFloat(ratingElement.textContent.split(' ')[0].replace(',', '.'))
                    : null;

                /** REVIEW COUNT PARSING **/
                const reviewElement = product.querySelector('.a-size-base.s-underline-text');
                const reviewCount = reviewElement
                    ? parseInt(reviewElement.textContent.replace(/,/g, ''), 10)
                    : 0;

                /** PRICE EXTRACTION **/
                    // Priority order for price selectors:
                    // 1. Visible price (aria-hidden) for screen-displayed value
                    // 2. Offscreen price for screen-reader version
                    // 3. Fallback price class
                const priceElement = product.querySelector('.a-price span[aria-hidden="true"]')
                        || product.querySelector('.a-price .a-offscreen')
                        || product.querySelector('.a-color-price');

                // Clean and format price text
                const priceText = priceElement
                    ? priceElement.textContent
                        .trim()
                        .replace(/\s+/g, ' ') // Normalize whitespace
                        .replace(/&nbsp;/g, ' ') // Handle HTML spaces
                    : '';

                /** IMAGE URL EXTRACTION **/
                const imageUrl = product.querySelector('.s-image')?.src;

                /** STAR ICON IDENTIFICATION **/
                const starIconElement = product.querySelector('i.a-icon-star-small');
                const starIconClass = starIconElement
                    ? starIconElement.className.split(' ').find(cls => cls.startsWith('a-star-small-'))
                    : null;

                /** UNIT COUNT  EXTRACTION **/
                const unitCountElement = product.querySelector('.a-size-base.a-color-base.s-background-color-platinum');
                const unitCount = unitCountElement
                    ? unitCountElement.textContent.trim()
                    : '';

                /** PURCHASE COUNT EXTRACTION **/
                const purchaseCountElement = product.querySelector('.a-size-base.a-color-secondary');
                const purchaseCount = purchaseCountElement
                    ? purchaseCountElement.textContent.trim()
                    : '';

                /** PRICE PER UNIT EXTRACTION **/
                const pricePerUnitElement = product.querySelector('.a-price .a-offscreen');
                const pricePerUnit = pricePerUnitElement
                    ? pricePerUnitElement.textContent.trim().replace(/\s+/g, ' ').replace(/&nbsp;/g, ' ')
                    : '';

                /** ORIGINAL PRICE EXTRACTION  **/
                const originalPriceElement = product.querySelector('.a-size-base.a-color-secondary');
                const originalPrice = originalPriceElement
                    ? originalPriceElement.textContent.trim()
                    : '';

                /** SHIPPING INFO **/
                const shippingInfoElement = product.querySelector('.a-row.a-size-base.a-color-secondary .a-size-small');
                const shippingInfo = shippingInfoElement
                    ? shippingInfoElement.textContent.trim()
                    : '';

                return {
                    title,
                    rating,
                    reviewCount,
                    price: priceText,
                    imageUrl,
                    starIconClass,
                    unitCount,
                    purchaseCount,
                    pricePerUnit,
                    originalPrice,
                    shippingInfo
                };
            })
            .filter(product => product.imageUrl); // Filter out items without images

        return products;

    });
}