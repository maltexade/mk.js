;(function () {

    var TouchController = function () {
        this.buttonStates = {};
        this.setupTouchListeners();
    };

    TouchController.prototype.setupTouchListeners = function () {
        var self = this;
        var buttons = document.querySelectorAll('button');

        buttons.forEach(function (btn) {
            // Touch start
            btn.addEventListener('touchstart', function (e) {
                e.preventDefault();
                self.onButtonPress.call(self, btn);
            }, false);

            // Touch end
            btn.addEventListener('touchend', function (e) {
                e.preventDefault();
                self.onButtonRelease.call(self, btn);
            }, false);

            // Mouse events for desktop testing
            btn.addEventListener('mousedown', function (e) {
                self.onButtonPress.call(self, btn);
            }, false);

            btn.addEventListener('mouseup', function (e) {
                self.onButtonRelease.call(self, btn);
            }, false);
        });
    };

    TouchController.prototype.onButtonPress = function (btn) {
        btn.classList.add('active');
        if (btn.dataset.action) {
            this.buttonStates[btn.dataset.action] = true;
            this.triggerAction(btn.dataset.action, 'press');
        }
    };

    TouchController.prototype.onButtonRelease = function (btn) {
        btn.classList.remove('active');
        if (btn.dataset.action) {
            this.buttonStates[btn.dataset.action] = false;
            this.triggerAction(btn.dataset.action, 'release');
        }
    };

    TouchController.prototype.triggerAction = function (action, state) {
        // This will be overridden by the game controller
        if (this.onAction) {
            this.onAction(action, state);
        }
    };

    TouchController.prototype.isPressed = function (action) {
        return !!this.buttonStates[action];
    };

    window.TouchController = TouchController;

}());
