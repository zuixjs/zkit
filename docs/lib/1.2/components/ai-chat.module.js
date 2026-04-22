const setup = () => {
  customElements.define('ai-chat', class extends HTMLElement {
    connectedCallback() {
      zuix.loadComponent(this, '/lib/1.2/components/ai-chat', '', {
        container: this.attachShadow({mode: 'closed'})
      });
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@1.2.7/js/zuix.module.min.js')
    .then(() => setup());
} else setup();
