import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.7/js/zuix.module.min.js';
customElements.define('media-browser', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/components/media-browser');
  }
});
