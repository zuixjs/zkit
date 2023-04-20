import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.20/js/zuix.module.min.js';
customElements.define('header-auto-hide', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/header-auto-hide', 'ctrl', {
      scrollHost: this.offsetParent || this
    });
  }
});
