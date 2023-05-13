const setup = () => {
  if (customElements.get('zx-playground') == null) {
    customElements.define('zx-playground', class extends HTMLElement {
      connectedCallback() {
        zuix.loadComponent(this, '{{ app.zkit.libraryPath }}components/zx-playground');
      }
    });
  }
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
