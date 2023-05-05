import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.23/js/zuix.module.min.js';
customElements.define('view-pager', class extends HTMLElement {
  connectedCallback() {
    this.style.display = 'block';
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/view-pager', 'ctrl');
  }
});
