// update next line if component path was changed
const componentId = 'three-cards-game';

const setup = () => {
  const elementTag = 'three-cards-game';
  if (customElements.get(elementTag) != null) return;
  // register custom element tag
  customElements.define(elementTag, class extends HTMLElement {
    context = null;
    connectedCallback() {
      if (this.context === null) {
        this.context = false;
        zuix.loadComponent(this, componentId, undefined, {
          container: this.attachShadow({mode: 'closed'}),
          ready: (ctx) => this.context = ctx
        });
      }
    }
  });
};
if (self.zuix === undefined) {
  import('https://cdn.jsdelivr.net/npm/zuix-dist@1.2.7/js/zuix.module.min.js')
      .then(() => setup());
} else setup();