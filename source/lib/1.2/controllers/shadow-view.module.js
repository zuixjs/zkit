const setup = () => {
  customElements.define('shadow-view', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, 'default', 'ctrl', {
        container: this.attachShadow({
          mode: this.getAttribute(':mode') || 'closed'
        })
      });
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
      .then(() => setup());
} else setup();
