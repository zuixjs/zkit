import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';
customElements.define('mdl-button', class extends HTMLElement {
  static get observedAttributes() { return ['disabled']; }
  context = null;
  connectedCallback() {
    this.classList.add('visible-on-ready');
    this.style.display = 'inline-block';
    this.style.margin = '4px';
    zuix.loadComponent(this, '{{ app.zkit.libraryPath }}controllers/mdl-button', 'ctrl', {
      container: this.attachShadow({mode: 'closed'}),
      ready: (ctx) => this.context = ctx
    });
  }
  attributeChangedCallback(name, oldValue, newValue) {
    this.context.$.attr(name, newValue);
  }
});
