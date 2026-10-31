document.addEventListener("DOMContentLoaded", function() {
    const switcher = document.getElementById("currency-switcher");
    const buttons = document.querySelectorAll(".currency-btn");

    // Array of products with base prices in EUR and optional discount percentage (0-100)
    const products = [
        { id: "product1", basePriceEUR: 100, discount: 20 }, // 20% off
        { id: "product2", basePriceEUR: 150, discount: 0 },  // No discount
        { id: "product3", basePriceEUR: 200, discount: 15 }, // 15% off
        { id: "product4", basePriceEUR: 20,  discount: 50 },  // 50% off
        { id: "product5", basePriceEUR: 150, discount: 0 },  // No discount
        { id: "product6", basePriceEUR: 510, discount: 15 }, // 15% off
        { id: "product7", basePriceEUR: 230, discount: 80 },  // 80% off
        { id: "product8", basePriceEUR: 450, discount: 5 }   // 5% off
    ];

    // Default fallback rates in case of network issues
    let exchangeRates = {
        "EUR": 1,
        "USD": 1.18,
        "JPY": 110,
        "GBP": 0.75,
        "INR": 75,
        "BRL": 6.07
    };

    const currencySymbols = {
        "EUR": "€",
        "USD": "$",
        "JPY": "¥",
        "GBP": "£",
        "INR": "₹",
        "BRL": "R$",
        "BRR": "R$" // Alias for compatibility with HTML dataset
    };

    let currentCurrency = "EUR";

    /**
     * Fetches exchange rates from Frankfurter API and caches them for 24 hours.
     */
    async function fetchExchangeRates() {
        const CACHE_KEY_RATES = "frankfurter_exchange_rates";
        const CACHE_KEY_TIMESTAMP = "frankfurter_rates_timestamp";
        const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

        const cachedRates = localStorage.getItem(CACHE_KEY_RATES);
        const cachedTimestamp = localStorage.getItem(CACHE_KEY_TIMESTAMP);
        const now = Date.now();

        // Use cached rates if valid and less than 24 hours old
        if (cachedRates && cachedTimestamp && (now - parseInt(cachedTimestamp, 10) < TWENTY_FOUR_HOURS_MS)) {
            exchangeRates = JSON.parse(cachedRates);
            updateProductPrices();
            return;
        }

        // Fetch fresh rates from Frankfurter API v2
        try {
            const response = await fetch("https://api.frankfurter.dev/v2/rates?quotes=USD,JPY,GBP,INR,BRL");
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            // Format rates object into currency code -> rate mapping
            const newRates = { "EUR": 1 };
            data.forEach(item => {
                newRates[item.quote] = item.rate;
            });

            // Map BRR to BRL rate if present for HTML backward compatibility
            if (newRates["BRL"]) {
                newRates["BRR"] = newRates["BRL"];
            }

            exchangeRates = newRates;

            // Save to localStorage with current timestamp
            localStorage.setItem(CACHE_KEY_RATES, JSON.stringify(exchangeRates));
            localStorage.setItem(CACHE_KEY_TIMESTAMP, now.toString());
        } catch (error) {
            console.error("Failed to fetch rates from Frankfurter API, using fallback rates:", error);
        }

        updateProductPrices();
    }

    function updateProductPrices() {
        const exchangeRate = exchangeRates[currentCurrency] || 1;
        const symbol = currencySymbols[currentCurrency] || "";

        products.forEach(product => {
            const productElement = document.getElementById(`product-price-${product.id}`);
            if (!productElement) return;

            // Calculate converted base price
            const originalPrice = (product.basePriceEUR * exchangeRate).toFixed(2);
            
            if (product.discount > 0) {
                // Calculate discounted price
                const discountAmount = originalPrice * (product.discount / 100);
                const discountedPrice = (originalPrice - discountAmount).toFixed(2);

                // Update HTML with both prices and a discount badge
                productElement.innerHTML = `
                    <span class="original-price" style="text-decoration: line-through; color: #e11d48; opacity: 1;">${symbol}${originalPrice}</span>
                    <span class="discounted-price">${symbol}${discountedPrice}</span>
                    <div class="discount-badge">-${product.discount}%</div>
                `;
            } else {
                // No discount, just show the regular price
                productElement.innerHTML = `<span class="discounted-price">${symbol}${originalPrice}</span>`;
            }
        });

        // Update UI active state for buttons
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
    if (savedCurrency) {
        currentCurrency = savedCurrency;
    }

    // Initialize data fetch and UI update
    fetchExchangeRates();
});
