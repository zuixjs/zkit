import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';
customElements.define('media-browser', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, '{{ app.zkit.libraryPath }}components/media-browser');
  }
});
