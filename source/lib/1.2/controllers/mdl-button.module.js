customElements.define('mdl-button', class extends HTMLElement {
  static get observedAttributes() { return ['disabled', 'class']; }
  context = null;

  connectedCallback() {
    this.classList.add('visible-on-ready');
    this.style.display = 'inline-block';
    const extraCss = this.attributes.getNamedItem('z-css');
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/mdl-button', 'ctrl', {
      css: self[extraCss?.value],
      container: this.attachShadow({mode: 'closed'}),
      ready: (ctx) => this.context = ctx
    });
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (this.context) {
      if (name === 'disabled') {
        this.context.$.attr(name, newValue);
      }
    }
  }
});
