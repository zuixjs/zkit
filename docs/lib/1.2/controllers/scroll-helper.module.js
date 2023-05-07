import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.24/js/zuix.module.min.js';
customElements.define('scroll-helper', class extends HTMLElement {
  connectedCallback() {
    const contextId = this.getAttribute('z-context');
    zuix.loadComponent(this.parentElement, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/scroll-helper', 'ctrl', {
      contextId, ready: (ctx) => zuix.$(this).trigger('component:ready', ctx)
    });
  }
});
