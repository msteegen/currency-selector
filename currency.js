document.addEventListener("DOMContentLoaded", function() {
    const currencyDropdown = document.getElementById("currency");

    // Array of products with their base prices in USD
    const products = [
        { id: "product1", basePriceUSD: 100 },
        { id: "product2", basePriceUSD: 150 },
        { id: "product3", basePriceUSD: 200 },
        { id: "product4", basePriceUSD: 1 },
        { id: "product5", basePriceUSD: 45.85 },
        { id: "product6", basePriceUSD: 12.75 },
        { id: "product7", basePriceUSD: 20 },
        { id: "product8", basePriceUSD: 2000 }
    ];

    // Exchange rates relative to USD
    const exchangeRates = {
        "USD": 1,      // 1 USD = 1 USD
        "EUR": 0.92,   // 1 USD = 0.92 EUR
        "JPY": 110,    // 1 USD = 110 JPY
        "GBP": 0.75,   // 1 USD = 0.75 GBP
        "INR": 75      // 1 USD = 75 INR
    };

    // Function to update product prices based on selected currency
    function updateProductPrices() {
        const selectedCurrency = currencyDropdown.value;
        const exchangeRate = exchangeRates[selectedCurrency];

        products.forEach(product => {
            const convertedPrice = (product.basePriceUSD * exchangeRate).toFixed(2);
            const productPriceDisplay = document.getElementById(`product-price-${product.id}`);

            // Display the price with the correct currency symbol
            let currencySymbol = '';
            switch (selectedCurrency) {
                case "USD": currencySymbol = "$"; break;
                case "EUR": currencySymbol = "€"; break;
                case "JPY": currencySymbol = "¥"; break;
                case "GBP": currencySymbol = "£"; break;
                case "INR": currencySymbol = "₹"; break;
            }

            productPriceDisplay.textContent = `${currencySymbol}${convertedPrice}`;
        });

        // Store the selected currency in localStorage
        localStorage.setItem("selectedCurrency", selectedCurrency);
    }

    // Check if there is a stored currency in localStorage
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
        currencyDropdown.value = savedCurrency;
    }

    // Update prices when selection changes
    currencyDropdown.addEventListener("change", updateProductPrices);

    // Set initial price display
    updateProductPrices();
});
