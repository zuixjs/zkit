const setup = () => {
  customElements.define('header-auto-hide', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/header-auto-hide', 'ctrl', {
        scrollHost: this.offsetParent || this
      });
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@1.1.26/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
