const setup = () => {
  customElements.define('context-menu', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/components/context-menu');
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@1.1.28/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
