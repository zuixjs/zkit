const setup = () => {
  customElements.define('list-view', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, '/lib/1.2/controllers/list-view', 'ctrl');
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@1.2.7/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
