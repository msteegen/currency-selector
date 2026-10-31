document.addEventListener("DOMContentLoaded", function() {
const switcher = document.getElementById("currency-switcher");
const buttons = document.querySelectorAll(".currency-btn");

// Products list with base price in EUR and optional discount percentage (0-100)
const products = [
    { id: "product1", basePriceEUR: 100, discount: 20 }, // 20% off
    { id: "product2", basePriceEUR: 150, discount: 0 },  // No discount
    { id: "product3", basePriceEUR: 200, discount: 15 }, // 15% off
    { id: "product4", basePriceEUR: 20,  discount: 50 }   // 50% off
];

// Default fallback exchange rates
let exchangeRates = {
    "EUR": 1,
    "USD": 1.08,
    "JPY": 162.50,
    "GBP": 0.85,
    "INR": 90.20,
    "BRL": 5.45
};

const currencySymbols = {
    "EUR": "€",
    "USD": "$",
    "JPY": "¥",
    "GBP": "£",
    "INR": "₹",
    "BRL": "R$",
    "BRR": "R$"
};

let currentCurrency = "USD";

/**
 * Fetches exchange rates from Frankfurter API with 24-hour localStorage caching
 */
async function fetchExchangeRates() {
    const CACHE_KEY_RATES = "frankfurter_exchange_rates";
    const CACHE_KEY_TIMESTAMP = "frankfurter_rates_timestamp";
    const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

    const cachedRates = localStorage.getItem(CACHE_KEY_RATES);
    const cachedTimestamp = localStorage.getItem(CACHE_KEY_TIMESTAMP);
    const now = Date.now();

    // If cached data exists and is less than 24 hours old, use cached rates
    if (cachedRates && cachedTimestamp && (now - parseInt(cachedTimestamp, 10) < TWENTY_FOUR_HOURS_MS)) {
        exchangeRates = JSON.parse(cachedRates);
        updateProductPrices();
        return;
    }

    // Otherwise fetch fresh quotes from Frankfurter API v2
    try {
        const response = await fetch("https://api.frankfurter.dev/v2/rates?quotes=USD,JPY,GBP,INR,BRL");
        if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
        
        const data = await response.json();
        
        const newRates = { "EUR": 1 };
        data.forEach(item => {
            newRates[item.quote] = item.rate;
        });

        // Backward compatibility alias for BRL/BRR
        if (newRates["BRL"]) {
            newRates["BRR"] = newRates["BRL"];
        }

        exchangeRates = newRates;

        // Cache in localStorage with timestamp
        localStorage.setItem(CACHE_KEY_RATES, JSON.stringify(exchangeRates));
        localStorage.setItem(CACHE_KEY_TIMESTAMP, now.toString());
    } catch (error) {
        console.warn("Could not fetch rates from Frankfurter API, using fallback rates:", error);
    }

    updateProductPrices();
}

function updateProductPrices() {
    const exchangeRate = exchangeRates[currentCurrency] || 1;
    const symbol = currencySymbols[currentCurrency] || "";

    products.forEach(product => {
        const productElement = document.getElementById(`product-price-${product.id}`);
        if (!productElement) return;

        const parentCard = productElement.closest('.product-card');

        // Calculate original converted base price
        const originalPrice = (product.basePriceEUR * exchangeRate).toFixed(2);
        
        if (product.discount > 0) {
            const discountAmount = originalPrice * (product.discount / 100);
            const discountedPrice = (originalPrice - discountAmount).toFixed(2);

            // Ensure discount badge exists
            if (parentCard && !parentCard.querySelector('.discount-badge')) {
                const badge = document.createElement('div');
                badge.className = 'discount-badge';
                badge.textContent = `-${product.discount}%`;
                parentCard.appendChild(badge);
            }

            productElement.innerHTML = `
                <span class="original-price">${symbol}${originalPrice}</span>
                <span class="discounted-price">${symbol}${discountedPrice}</span>
            `;
        } else {
            // Remove badge if present
            if (parentCard) {
                const badge = parentCard.querySelector('.discount-badge');
                if (badge) badge.remove();
            }
            productElement.innerHTML = `<span class="discounted-price">${symbol}${originalPrice}</span>`;
        }
    });

    // Update active state on currency switcher buttons
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.currency === currentCurrency);
    });

    localStorage.setItem("selectedCurrency", currentCurrency);
}

switcher.addEventListener("click", (e) => {
    if (e.target.classList.contains('currency-btn')) {
        currentCurrency = e.target.dataset.currency;
        updateProductPrices();
    }
});

const savedCurrency = localStorage.getItem("selectedCurrency");
if (savedCurrency && exchangeRates[savedCurrency]) {
    currentCurrency = savedCurrency;
}

fetchExchangeRates();
});