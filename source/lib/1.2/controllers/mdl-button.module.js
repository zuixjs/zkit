const setup = () => {
  if (customElements.get('mdl-button') == null) {
    customElements.define('mdl-button', class extends HTMLElement {
      static get observedAttributes() {
        return ['disabled', 'class'];
      }
      context = null;
      shadowView = null;

      connectedCallback() {
        if (!this.shadowView) {
          this.classList.add('visible-on-ready');
          this.style.display = 'inline-block';
          const extraCss = this.attributes.getNamedItem('z-css');
          this.shadowView = this.attachShadow({mode: 'closed'});
          zuix.loadComponent(this, '{{ app.zkit.libraryPath }}controllers/mdl-button', 'ctrl', {
            css: self[extraCss?.value],
            container: this.shadowView,
            ready: (ctx) => this.context = ctx
          });
        }
      }
      attributeChangedCallback(name, oldValue, newValue) {
        if (this.context) {
          if (name === 'disabled') {
            this.context.$.attr(name, newValue);
          }
        }
      }
    });
  }
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
