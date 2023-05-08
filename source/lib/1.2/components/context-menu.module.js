const setup = () => {
  customElements.define('context-menu', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, '{{ app.zkit.libraryPath }}components/context-menu');
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
