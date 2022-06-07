import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';
customElements.define('gesture-helper', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this.parentElement, '{{ app.zkit.libraryPath }}controllers/gesture-helper', 'ctrl', {
      contextId: this.getAttribute('z-context')
    });
  }
});
