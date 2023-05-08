const setup = () => {
  customElements.define('view-pager', class extends HTMLElement {
    connectedCallback() {
      this.style.display = 'block';
      zuix.loadComponent(this, '{{ app.zkit.libraryPath }}controllers/view-pager', 'ctrl');
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
