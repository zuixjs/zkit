import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.24/js/zuix.module.min.js';
customElements.define('list-view', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/list-view', 'ctrl');
  }
});
