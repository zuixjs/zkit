import 'https://cdn.jsdelivr.net/npm/zuix-dist@1.1.29/js/zuix.module.min.js';

customElements.define('time-clock', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/app/widgets/time-clock', '', {
      container: this.attachShadow({mode: 'closed'})
    });
  }
});
