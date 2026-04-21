const setup = () => {
  customElements.define('ai-chat', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, '{{ app.zkit.libraryPath }}components/ai-chat', '', {
        container: this.attachShadow({mode: 'closed'})
      });
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js')
    .then(() => setup());
} else setup();
