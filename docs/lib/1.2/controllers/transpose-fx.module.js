import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.7/js/zuix.module.min.js';
customElements.define('transpose-fx', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this.parentElement, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/transpose-fx', 'ctrl');
  }
});
