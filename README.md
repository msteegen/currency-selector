# Currency Selector JS

A lightweight, zero-dependency JavaScript utility that dynamically converts e-commerce product prices and calculates discount badges on your frontend using exchange rates fetched live from the [Frankfurter API](https://frankfurter.dev/). It caches exchange rates locally for 24 hours to ensure fast page loads and minimize unnecessary API requests.

## 🌟 Features

* 🔄 **Live ECB Exchange Rates:** Automatically fetches fresh exchange rate data sourced from the European Central Bank.
* ⚡ **24-Hour Smart Caching:** Stores rates in `localStorage` with a timestamp TTL so your site only makes one API request per day per user.
* 🏷️ **Dynamic Discounting:** Recalculates both baseline prices and percentage discounts on the fly.
* 🛡️ **Fallback Protection:** Includes default rates to keep your product cards populated even if network issues occur.
* 💾 **Persistent Currency Preference:** Remembers the user's selected currency choice across sessions.

## 📁 Repository Structure

```
.
├── css/
│   └── home.css      # Styling for product cards, currency switcher buttons, and badges
├── js/
│   └── currency.js   # Core logic for fetching rates, caching, and DOM price updates
├── index.html        # HTML structure containing product containers and currency buttons
└── README.md         # Project documentation
```

## 🚀 Quick Setup

### 1. Include `currency.js` & `home.css`

Add the stylesheet link in your `<head>` and the script tag pointing to your `css/` and `js/` folders:

```html
<link rel="stylesheet" href="css/home.css">
<script src="js/currency.js" defer></script>
```

### 2. Add the Currency Switcher Controls

Create your switcher buttons using the `data-currency` attribute matching standard ISO currency codes:

```html
<div class="currency-grid" id="currency-switcher">
    <button class="currency-btn active" data-currency="USD">USD ($)</button>
    <button class="currency-btn" data-currency="EUR">EUR (€)</button>
    <button class="currency-btn" data-currency="JPY">JPY (¥)</button>
    <button class="currency-btn" data-currency="GBP">GBP (£)</button>
    <button class="currency-btn" data-currency="INR">INR (₹)</button>
    <button class="currency-btn" data-currency="BRL">BRL (R$)</button>
</div>
```

### 3. Add Product Price Containers

Assign matching IDs (e.g., `product-price-product1`) inside your product cards:

```html
<div class="product-card">
    <img src="product.jpg" alt="Awesome Widget">
    <h2>Awesome Widget</h2>
    <p>Product description goes here.</p>
    
    <!-- Price container targeted by currency.js -->
    <div id="product-price-product1"></div>
</div>
```

## ⚙️ How It Works

1. **Initialization:** On page load, `currency.js` checks `localStorage` for cached exchange rates that are less than 24 hours old.
2. **API Fetch:** If the cache is expired or missing, it queries `https://api.frankfurter.dev/v2/rates?quotes=USD,JPY,GBP,INR,BRL`.
3. **Cache Update:** Stores the new rates along with the current timestamp in `localStorage`.
4. **DOM Rendering:** Iterates over the `products` array in JavaScript, converting base `EUR` prices to the selected target currency and formatting original price, discounted price, and percentage badge elements.

## 💶 Supported Currencies

| Code | Currency Name | Symbol |
| :--- | :--- | :--- |
| **EUR** | Euro (Base) | € |
| **USD** | US Dollar | $ |
| **GBP** | British Pound | £ |
| **JPY** | Japanese Yen | ¥ |
| **INR** | Indian Rupee | ₹ |
| **BRL** | Brazilian Real | R$ |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check out the [issues page](https://github.com/msteegen/currency-selector/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.
