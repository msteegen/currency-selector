# Currency Selector JS

A lightweight, zero-dependency JavaScript utility that dynamically converts product prices on your frontend using exchange rates fetched live from the [Frankfurter API](https://frankfurter.dev/). It caches exchange rates for 24 hours to keep page loads fast and minimize external API calls.

## Features

- 🔄 **Live Daily Exchange Rates:** Fetches fresh rates from European Central Bank data via the Frankfurter API.
- ⚡ **24-Hour Automated Cache:** Stores exchange rates in `localStorage` with a timestamp TTL to avoid unnecessary API requests.
- 🏷️ **Dynamic Discounts & Formatting:** Automatically calculates original prices, percentage discounts, and badges based on target currency.
- 🛡️ **Fallback Protection:** Includes pre-defined exchange rates in case of network failures or API downtime.
- 💾 **Persistent Preference:** Remembers the user's selected currency using browser storage.

## Demo

Include `currency.js` in your HTML file and define price containers for each product:

```html
<div class="currency-grid" id="currency-switcher">
    <button class="currency-btn active" data-currency="USD">USD ($)</button>
    <button class="currency-btn" data-currency="EUR">EUR (€)</button>
    <button class="currency-btn" data-currency="GBP">GBP (£)</button>
</div>

<div class="product-card">
    <h2>Awesome Widget</h2>
    <div id="product-price-product1"></div>
</div>

<script src="currency.js"></script>
```

## How It Works

1. **Initialization:** When the page loads, `currency.js` checks `localStorage` for cached exchange rates less than 24 hours old.
2. **Fetch Rates:** If no valid cache is found, it fetches fresh rate quotes from `https://api.frankfurter.dev/v2/rates`.
3. **DOM Update:** Recalculates product prices instantly and updates the DOM whenever a user switches currencies.

## Supported Currencies

- EUR (€) - Base Currency
- USD ($)
- JPY (¥)
- GBP (£)
- INR (₹)
- BRL (R$)

## License

This project is open source under the [MIT License](LICENSE).
