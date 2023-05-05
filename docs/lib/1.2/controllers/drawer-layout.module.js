import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.23/js/zuix.module.min.js';
customElements.define('drawer-layout', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/drawer-layout', 'ctrl');
  }
});
