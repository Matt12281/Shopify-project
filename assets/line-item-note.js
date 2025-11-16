import { Component } from '@theme/component';
import { debounce, fetchConfig } from '@theme/utilities';
import { cartPerformance } from '@theme/performance';

/**
 * A custom element that manages per-line-item notes (gift messages, engraving, etc).
 */
class LineItemNote extends Component {
  /** @type {AbortController | null} */
  #activeFetch = null;

  connectedCallback() {
    super.connectedCallback();
    this.setupEventListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

  setupEventListeners() {
    const textarea = this.querySelector('textarea');
    if (textarea) {
      textarea.addEventListener('input', this.#handleNoteChange.bind(this));
    }
  }

  /**
   * Handles updates to the line item note.
   * @param {InputEvent} event - The input event in our text-area.
   */
  #handleNoteChange = debounce(async (event) => {
    if (!(event.target instanceof HTMLTextAreaElement)) return;

    const note = event.target.value;
    const lineItemIndex = this.dataset.lineIndex;

    if (!lineItemIndex) return;

    if (this.#activeFetch) {
      this.#activeFetch.abort();
    }

    const abortController = new AbortController();
    this.#activeFetch = abortController;

    try {
      // Update the cart with the line item attribute
      const formData = new FormData();
      formData.append('updates', JSON.stringify({
        [lineItemIndex]: {
          properties: {
            '_note': note
          }
        }
      }));

      const config = fetchConfig('json', {
        body: JSON.stringify({
          updates: {
            [lineItemIndex]: {
              properties: {
                '_note': note
              }
            }
          }
        }),
      });

      const response = await fetch(Theme.routes.cart_update_url, {
        ...config,
        signal: abortController.signal,
      });

      if (response.ok) {
        this.showNoteSaved();
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error updating line item note:', error);
      }
    } finally {
      this.#activeFetch = null;
      cartPerformance.measureFromEvent('line-item-note:user-action', event);
    }
  }, 500);

  /**
   * Shows a temporary "saved" message
   */
  showNoteSaved() {
    const button = this.querySelector('.line-item-note__save-indicator');
    if (button) {
      button.classList.add('saved');
      setTimeout(() => {
        button.classList.remove('saved');
      }, 2000);
    }
  }
}

if (!customElements.get('line-item-note')) {
  customElements.define('line-item-note', LineItemNote);
}
