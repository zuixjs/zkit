const setup = () => {
  customElements.define('view-pager', class extends HTMLElement {
    connectedCallback() {
      this.style.display = 'block';
      zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/lib/1.2/controllers/view-pager', 'ctrl');
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@1.1.28/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
