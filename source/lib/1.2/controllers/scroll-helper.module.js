import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';
customElements.define('scroll-helper', class extends HTMLElement {
  connectedCallback() {
    const contextId = this.getAttribute('z-context');
    zuix.loadComponent(this.parentElement, '{{ app.zkit.libraryPath }}controllers/scroll-helper', 'ctrl', {
      contextId, ready: (ctx) => zuix.$(this).trigger('component:ready', ctx)
    });
  }
});
