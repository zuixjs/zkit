const setup = () => {
  customElements.define('transpose-fx', class extends HTMLElement {
    connectedCallback() {
      const contextId = this.getAttribute('z-context');
      zuix.loadComponent(this.parentElement, '{{ app.zkit.libraryPath }}controllers/transpose-fx', 'ctrl', {
        contextId, ready: (ctx) => zuix.$(this).trigger('component:ready', ctx)
      });
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
