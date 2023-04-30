import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.22/js/zuix.module.min.js';
customElements.define('menu-overlay', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/components/menu-overlay');
  }
});
