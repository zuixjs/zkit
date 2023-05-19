const setup = () => {
  customElements.define('drawer-layout', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/drawer-layout', 'ctrl');
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@1.1.27/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
