import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.23/js/zuix.module.min.js';
customElements.define('mdl-menu', class extends HTMLElement {
  context = null;
  shadowView = null;
  connectedCallback() {
    if (!this.shadowView) {
      this.classList.add('visible-on-ready');
      this.style.display = 'inline-block';
      this.shadowView = this.attachShadow({mode: 'closed'});
      zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/mdl-menu', 'ctrl', {
        container: this.shadowView,
        ready: (ctx) => this.context = ctx
      });
    }
  }
});
