const setup = () => {
  customElements.define('header-auto-hide', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, '{{ app.zkit.libraryPath }}controllers/header-auto-hide', 'ctrl', {
        scrollHost: this.offsetParent || this
      });
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
