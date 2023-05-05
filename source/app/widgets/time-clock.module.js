import 'https://cdn.jsdelivr.net/npm/zuix-dist@{{ app.zkit.zuixVersion }}/js/zuix.module.min.js';

customElements.define('time-clock', class extends HTMLElement {
  connectedCallback() {
    zuix.loadComponent(this, 'https://zuixjs.github.io/zkit/app/widgets/time-clock', '', {
      container: this.attachShadow({mode: 'closed'})
    });
  }
});
