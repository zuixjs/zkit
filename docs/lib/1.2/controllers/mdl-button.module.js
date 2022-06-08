import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.7/js/zuix.module.min.js';
customElements.define('mdl-button', class extends HTMLElement {
  static get observedAttributes() { return ['disabled']; }
  context = null;
  connectedCallback() {
    this.classList.add('visible-on-ready');
    this.style.display = 'inline-block';
    this.style.margin = '4px';
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/mdl-button', 'ctrl', {
      container: this.attachShadow({mode: 'closed'}),
      ready: (ctx) => this.context = ctx
    });
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.context) {
      this.context.$.attr(name, newValue);
    }
  }
});
