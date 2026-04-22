const setup = () => {
  if (customElements.get('zx-playground') == null) {
    customElements.define('zx-playground', class extends HTMLElement {
      connectedCallback() {
        zuix.loadComponent(this, '/lib/1.2/components/zx-playground');
      }
    });
  }
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@1.2.7/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
