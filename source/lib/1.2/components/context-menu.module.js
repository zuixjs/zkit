import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';
customElements.define('context-menu', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, '{{ app.zkit.libraryPath }}components/context-menu');
  }
});
