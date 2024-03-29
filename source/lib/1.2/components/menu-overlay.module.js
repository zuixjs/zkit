const setup = () => {
  customElements.define('menu-overlay', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, '{{ app.zkit.libraryPath }}components/menu-overlay');
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
