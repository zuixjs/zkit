class ToggleWidget extends ControllerInstance {
    
    state = {
        isOn: false
    };

    onCreate() {
        const self = this;
        
        // Declare methods that are available to the View's scripting scope
        this.declare({
            toggleState: () => self.toggle()
        });
        
        this.refreshUI();
    }

    toggle() {
        this.state.isOn = !this.state.isOn;
        this.refreshUI();
    }

    refreshUI() {
        const btn = this.field('toggle_btn');
        const label = this.field('status_text');

        // CSS class management (we use add/remove as standard)
        if (this.state.isOn) {
            btn.addClass('active');
            label.html('ON');
        } else {
            btn.removeClass('active');
            label.html('OFF');
        }
    }
}
