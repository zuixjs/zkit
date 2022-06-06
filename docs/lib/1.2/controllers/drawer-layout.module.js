import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';
customElements.define('drawer-layout', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, '{{ app.zkit.libraryPath }}controllers/drawer-layout', 'ctrl');
  }
});
