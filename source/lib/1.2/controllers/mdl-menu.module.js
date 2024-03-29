const setup = () => {
  if (customElements.get('mdl-menu') == null) {
    customElements.define('mdl-menu', class extends HTMLElement {
      context = null;
      shadowView = null;
      connectedCallback() {
        if (!this.shadowView) {
          this.classList.add('visible-on-ready');
          this.style.display = 'inline-block';
          this.shadowView = this.attachShadow({mode: 'closed'});
          zuix.loadComponent(this, '{{ app.zkit.libraryPath }}controllers/mdl-menu', 'ctrl', {
            container: this.shadowView,
            ready: (ctx) => this.context = ctx
          });
        }
      }
    });
  }
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
