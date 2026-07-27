LOGICPULSE.HUDController = class {
    constructor(scene) {
        this._scene = scene;
        this._buttons = [];
        this._selectedIndex = 0;          // start with first button selected
        this._mouseX = 0;
        this._mouseY = 0;
        this._mouseMoved = false;
        this._confirmPressed = false;
    }

    registerButton(button) {
        this._buttons.push(button);
        // If this is the first button, select it
        if (this._buttons.length === 1) {
            this.setSelected(0);
        }
    }

    setSelected(index) {
        if (index < 0 || index >= this._buttons.length) return;
        this._selectedIndex = index;
        this._updateButtonStates();
    }

    _updateButtonStates() {
        for (var i = 0; i < this._buttons.length; i++) {
            this._buttons[i].setHovered(i === this._selectedIndex);
        }
    }

    _getButtonAt(mx, my) {
        for (var i = 0; i < this._buttons.length; i++) {
            var btn = this._buttons[i];
            if (btn.containsPoint(mx, my)) {
                return i;
            }
        }
        return -1;
    }

    // ---- Keyboard navigation ----
    _handleKeyboard() {
        var pressed = false;
        var current = this._selectedIndex;
        var total = this._buttons.length;
        if (total === 0) return;

        // Column mapping: left buttons (0-3), right buttons (4-5)
        var leftColStart = 0;
        var leftColEnd = 3;
        var rightColStart = 4;
        var rightColEnd = 5;

        // Up / Down
        if (Input.isTriggered('up') || Input.isTriggered('w')) {
            if (current >= leftColStart && current <= leftColEnd) {
                // Move within left column
                current = (current - 1 < leftColStart) ? leftColEnd : current - 1;
            } else if (current >= rightColStart && current <= rightColEnd) {
                current = (current - 1 < rightColStart) ? rightColEnd : current - 1;
            }
            pressed = true;
        } else if (Input.isTriggered('down') || Input.isTriggered('s')) {
            if (current >= leftColStart && current <= leftColEnd) {
                current = (current + 1 > leftColEnd) ? leftColStart : current + 1;
            } else if (current >= rightColStart && current <= rightColEnd) {
                current = (current + 1 > rightColEnd) ? rightColStart : current + 1;
            }
            pressed = true;
        }

        // Left / Right – switch columns
        if (Input.isTriggered('left') || Input.isTriggered('a')) {
            if (current >= rightColStart && current <= rightColEnd) {
                // Map right column index to left column (same row, clamp)
                var row = current - rightColStart; // 0 or 1
                var leftIndex = Math.min(leftColStart + row, leftColEnd);
                current = leftIndex;
                pressed = true;
            }
        } else if (Input.isTriggered('right') || Input.isTriggered('d')) {
            if (current >= leftColStart && current <= leftColEnd) {
                var row = current - leftColStart;
                var rightIndex = Math.min(rightColStart + row, rightColEnd);
                current = rightIndex;
                pressed = true;
            }
        }

        if (pressed && current !== this._selectedIndex) {
            this.setSelected(current);
            SoundManager.playCursor();
        }

        // Confirm (Enter / Space)
        if (Input.isTriggered('ok') || Input.isTriggered('space')) {
            this._confirmPressed = true;
        }
    }

    // ---- Mouse handling ----
    _handleMouse() {
        var mx = LOGICPULSE.Mouse.x();
        var my = LOGICPULSE.Mouse.y();
        if (mx !== this._mouseX || my !== this._mouseY) {
            this._mouseX = mx;
            this._mouseY = my;
            this._mouseMoved = true;
        } else {
            this._mouseMoved = false;
        }

        if (this._mouseMoved) {
            var hovered = this._getButtonAt(mx, my);
            if (hovered !== -1) {
                this.setSelected(hovered);
            }
            // If mouse moves away from all buttons, we keep the current selection
        }
    }

    // ---- Click handling ----
    _handleClick() {
        if (TouchInput.isTriggered()) {
            var mx = LOGICPULSE.Mouse.x();
            var my = LOGICPULSE.Mouse.y();
            var clicked = this._getButtonAt(mx, my);
            if (clicked !== -1) {
                this.setSelected(clicked);
                this._buttons[clicked].onClick();
                SoundManager.playOk();
            }
        }
    }

    // ---- Public update ----
    update() {
        this._handleKeyboard();
        this._handleMouse();
        this._handleClick();

        // Check if confirm was triggered by keyboard
        if (this._confirmPressed) {
            this._confirmPressed = false;
            var btn = this._buttons[this._selectedIndex];
            if (btn) {
                btn.onClick();
                SoundManager.playOk();
            }
        }
    }
};