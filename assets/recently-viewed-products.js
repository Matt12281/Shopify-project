/**
 * Updates the recently viewed products in localStorage.
 */
export class RecentlyViewed {
  /** @static @constant {string} The key used to store the viewed products in localStorage */
  static #STORAGE_KEY = 'recentlyViewedProducts';
  /** @static @constant {number} The maximum number of products to store */
  static #MAX_PRODUCTS = 5;

  /**
   * Initializes the recently viewed tracking
   */
  static init() {
    // Track product views when on product page
    this.trackCurrentProduct();
  }

  /**
   * Tracks the current product if on a product page
   */
  static trackCurrentProduct() {
    if (typeof window.Shopify === 'undefined' || !window.Shopify.product) return;
    
    // Use product HANDLE instead of ID for easier API lookups
    const productHandle = window.Shopify.product.handle;
    if (productHandle) {
      this.addProduct(productHandle);
      // Dispatch custom event to notify section of update
      document.dispatchEvent(new CustomEvent('product-viewed', { detail: { productHandle } }));
    }
  }

  /**
   * Adds a product to the recently viewed products list.
   * @param {string} productHandle - The handle of the product to add (e.g., "premium-headphones").
   */
  static addProduct(productHandle) {
    let viewedProducts = this.getProducts();

    // Remove duplicate if exists
    viewedProducts = viewedProducts.filter((handle) => handle !== productHandle);
    
    // Add to front
    viewedProducts.unshift(productHandle);
    
    // Keep only max products
    viewedProducts = viewedProducts.slice(0, this.#MAX_PRODUCTS);

    localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(viewedProducts));
  }

  /**
   * Clears all recently viewed products
   */
  static clearProducts() {
    localStorage.removeItem(this.#STORAGE_KEY);
  }

  /**
   * Retrieves the list of recently viewed products from localStorage.
   * @returns {Array<string>} The list of viewed product handles (e.g., ["product-1", "product-2"]).
   */
  static getProducts() {
    try {
      const stored = localStorage.getItem(this.#STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error parsing recently viewed products:', e);
      return [];
    }
  }

  /**
   * Gets the count of recently viewed products
   * @returns {number} Count of recently viewed products
   */
  static getCount() {
    return this.getProducts().length;
  }
}

// Initialize tracking when script loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    RecentlyViewed.init();
  });
} else {
  RecentlyViewed.init();
}
