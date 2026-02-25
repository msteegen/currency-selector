document.addEventListener("DOMContentLoaded", function() {
    const switcher = document.getElementById("currency-switcher");
    const buttons = document.querySelectorAll(".currency-btn");

    // Array of products with base prices and optional discount percentage (0-100)
    const products = [
        { id: "product1", basePriceEUR: 100, discount: 20 }, // 20% off
        { id: "product2", basePriceEUR: 150, discount: 0 },  // No discount
        { id: "product3", basePriceEUR: 200, discount: 15 }, // 15% off
        { id: "product4", basePriceEUR: 20,  discount: 50 },  // 50% off
        { id: "product5", basePriceEUR: 150, discount: 0 },  // No discount
        { id: "product6", basePriceEUR: 510, discount: 15 }, // 15% off
        { id: "product7", basePriceEUR: 230,  discount: 80 },  // 80% off
        { id: "product8", basePriceEUR: 450,  discount: 5 }  // 5% off
    ];

    const exchangeRates = {
        "EUR": 1,
        "USD": 1.18,
        "JPY": 110,
        "GBP": 0.75,
        "INR": 75,
        "BRR": 6.07,
    }

    const currencySymbols = {
        "EUR": "€",
        "USD": "$",
        "JPY": "¥",
        "GBP": "£",
        "INR": "₹",
        "BRR": "R$"
    }

    let currentCurrency = "EUR";

    function updateProductPrices() {
        const exchangeRate = exchangeRates[currentCurrency];
        const symbol = currencySymbols[currentCurrency];

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
                // Note: original-price is styled red and strikethrough via inline style
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
    if (savedCurrency && exchangeRates[savedCurrency]) {
        currentCurrency = savedCurrency;
    }

    updateProductPrices();
});
