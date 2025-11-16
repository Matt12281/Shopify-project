# Quick Reference Guide

## PART 1: Shopify Theme - Recently Viewed Products & Cart Notes

### Recently Viewed Products

**What it does:** Displays the last 5 products the customer viewed in a carousel on product pages.

**Key Files:**

- `sections/recently-viewed-products.liquid` - Section template
- `assets/recently-viewed-products.js` - JavaScript tracking

**How to test:**

1. Open Shopify theme editor
2. On product page, add "Recently Viewed Products" section
3. Visit 3+ different products
4. The carousel appears and updates in real-time

**Data stored in:** `localStorage['recentlyViewedProducts']`

### Per-Line-Item Cart Notes

**What it does:** Allows customers to add personal messages or instructions to individual cart items.

**Key Files:**

- `assets/line-item-note.js` - Note component
- `snippets/cart-products.liquid` - Cart display integration

**How to test:**

1. Add product to cart (open cart drawer)
2. Scroll down to see "Add a note" field under product
3. Type a message (max 500 chars)
4. Message auto-saves after typing stops
5. Refresh page - message persists
6. Proceed to checkout - message shows in order

---

## PART 2: Product Importer - Quick Start

### Installation (5 minutes)

```bash
cd c:\Users\mathe\Downloads\shopify_product_importer

# Install dependencies
pip install -r requirements.txt
```

### Setup (2 minutes)

1. Go to Shopify Admin → Settings → Apps and integrations → Develop apps
2. Create new app (or use existing)
3. Enable scopes: `write_products`, `read_products`, `write_variants`, `read_variants`
4. Copy access token

### First Run

```bash
python shopify_importer.py \
  --token YOUR_TOKEN_HERE \
  --shop your-shop.myshopify.com \
  --file sample_products.xlsx
```

**Example Output:**

```
Processing 5 products...
[1/5] Processing: Premium Wireless Headphones
  → Creating new product
[2/5] Processing: Organic Cotton T-Shirt
  → Updating existing product
...
Import Complete!
  Created: 3
  Updated: 2
  Errors:  0
```

### Excel Format

Create file with columns:

- `title` ⭐ required
- `handle` ⭐ required
- `description`
- `productType`
- `vendor`
- `tags` (comma-separated)
- `variantTitle`
- `sku`
- `price`
- `compareAtPrice`
- `weight`
- `weightUnit`
- `barcode`

### Key Features

✅ **No duplicates** - Running twice updates, never creates duplicates
✅ **Auto-retry** - Handles network errors automatically
✅ **Rate limited** - Respects Shopify API limits
✅ **Logging** - Detailed progress and error messages

---

## File Locations

### Theme Files (Shopify Theme)

```
theme_export__javadalamathew21je0425-myshopify-com-horizon__16NOV2025-0309am/
├── sections/
│   └── recently-viewed-products.liquid ✨ NEW
├── assets/
│   ├── recently-viewed-products.js 📝 MODIFIED
│   └── line-item-note.js ✨ NEW
├── snippets/
│   └── cart-products.liquid 📝 MODIFIED
├── templates/
│   └── product.json 📝 MODIFIED
└── IMPLEMENTATION_SUMMARY.md 📝 NEW
```

### Product Importer Files

```
shopify_product_importer/
├── shopify_importer.py ✨ Main script
├── create_sample_excel.py ✨ Generator script
├── requirements.txt ✨ Dependencies
├── README.md ✨ Full documentation
├── .env.example ✨ Config template
├── .gitignore ✨ Git rules
└── sample_products.xlsx ✨ Sample data
```

---

## Troubleshooting Quick Tips

### Theme Issues

**Problem:** Recently viewed products don't show

- Solution: Ensure section is added to product page template
- Check browser console for JS errors

**Problem:** Cart notes not saving

- Solution: Verify line-item-note.js is loaded
- Check `/cart/update.json` response in network tab

### Importer Issues

**Problem:** "Invalid API token"

- Solution: Copy token exactly from Shopify admin
- Token expires after 24 hours for session tokens

**Problem:** Products not created

- Solution: Check Excel format matches requirements
- Verify handle is unique (not used by existing product)

**Problem:** Script runs slowly

- Solution: Normal - it's rate-limited for API safety
- 100 products takes ~1-2 minutes

---

## API Integration Details

### Cart Note Data

Notes stored as:

```javascript
item.properties = {
  _note: "Please gift wrap",
};
```

The `_note` prefix stores as hidden property, passes to checkout.

### Recently Viewed Data

```javascript
localStorage['recentlyViewedProducts'] = [
  "gid://shopify/Product/123456789",
  "gid://shopify/Product/987654321",
  ...
]
```

Limited to 5 most recent products.

---

## Support Resources

📚 **Documentation:**

- Theme: `/IMPLEMENTATION_SUMMARY.md`
- Importer: `/shopify_product_importer/README.md`

🔗 **External Links:**

- Shopify GraphQL Docs: https://shopify.dev/docs/api/admin-graphql
- Shopify Admin API: https://shopify.dev/docs/api/admin-rest

🎯 **Need Help?**

1. Check README in respective folder
2. Look for error message in console/logs
3. Verify credentials and file formats
4. Review Troubleshooting section

---

## What's Included

### Theme Customization ✅

- [x] Recently viewed products section
- [x] Carousel with navigation
- [x] Per-line-item cart notes
- [x] Auto-save without page reload
- [x] Responsive design
- [x] Full documentation

### Product Importer ✅

- [x] Excel to Shopify sync
- [x] Create & update products
- [x] Variant management
- [x] Duplicate prevention
- [x] Error handling & retry logic
- [x] Rate limiting
- [x] Sample data & docs

---

**Ready to go! 🚀**

Start with theme updates in Shopify, then run the product importer to test the API integration.
