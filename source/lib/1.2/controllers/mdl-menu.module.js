//import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';
customElements.define('mdl-menu', class extends HTMLElement {
  context = null;
  connectedCallback() {
    this.classList.add('visible-on-ready');
    this.style.display = 'inline-block';
    zuix.loadComponent(this, '@lib/controllers/mdl-menu', 'ctrl', {
      container: this.attachShadow({mode: 'closed'}),
      ready: (ctx) => this.context = ctx
    });
  }
});
