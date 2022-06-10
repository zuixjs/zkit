import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.10/js/zuix.module.min.js';
customElements.define('shadow-view', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, 'default', 'ctrl', {
      container: this.attachShadow({
        mode: this.getAttribute(':mode') || 'closed'
      })
    });
  }
});
