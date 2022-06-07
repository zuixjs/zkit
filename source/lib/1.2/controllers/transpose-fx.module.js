import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';
customElements.define('transpose-fx', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this.parentElement, '{{ app.zkit.libraryPath }}controllers/transpose-fx', 'ctrl', {
      contextId: this.getAttribute('z-context')
    });
  }
});
