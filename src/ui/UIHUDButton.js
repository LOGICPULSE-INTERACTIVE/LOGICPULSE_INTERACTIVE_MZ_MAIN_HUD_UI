LOGICPULSE.UI.HUDButton = class extends LOGICPULSE.UI.Element {
    constructor(options) {
        super();
        options = options || {};
        this._idleBitmap = options.idleBitmap;
        this._hoverBitmap = options.hoverBitmap;
        this._width = options.width || 100;
        this._height = options.height || 40;
        this._text = options.text || "";
        this._onClick = options.onClick || null;
        this._isHovered = false;
        this.move(options.x || 0, options.y || 0);
        this.create();
    }

    create() {
        // Idle sprite
        if (this._idleBitmap) {
            this._idleSprite = new Sprite(this._idleBitmap);
            this._idleSprite.width = this._width;
            this._idleSprite.height = this._height;
            this.addChild(this._idleSprite);
        }
        // Hover sprite
        if (this._hoverBitmap) {
            this._hoverSprite = new Sprite(this._hoverBitmap);
            this._hoverSprite.width = this._width;
            this._hoverSprite.height = this._height;
            this._hoverSprite.visible = false;
            this.addChild(this._hoverSprite);
        }
        // Text
        if (this._text) {
            this._textSprite = new Sprite(new Bitmap(this._width, this._height));
            this._textSprite.bitmap.fontFace = $gameSystem.mainFontFace();
            this._textSprite.bitmap.fontSize = this.options && this.options.fontSize ? this.options.fontSize : 20;
            this._textSprite.bitmap.textColor = "#ffffff";
            this._textSprite.bitmap.outlineColor = "rgba(0,0,0,0.8)";
            this._textSprite.bitmap.outlineWidth = 4;
            this._textSprite.bitmap.drawText(this._text, 0, 0, this._width, this._height, "center");
            this.addChild(this._textSprite);
        }
    }

    setHovered(hovered) {
        if (this._isHovered === hovered) return;
        this._isHovered = hovered;
        if (this._idleSprite) this._idleSprite.visible = !hovered;
        if (this._hoverSprite) this._hoverSprite.visible = hovered;
    }

    containsPoint(x, y) {
        var wx = this.x;
        var wy = this.y;
        var parent = this.parent;
        while (parent && parent !== SceneManager._scene) {
            wx += parent.x || 0;
            wy += parent.y || 0;
            parent = parent.parent;
        }
        return x >= wx && x <= wx + this._width &&
            y >= wy && y <= wy + this._height;
    }

    onClick() {
        if (this._onClick) this._onClick();
    }

    destroy(options) {
        if (this._idleSprite) { this._idleSprite.destroy(); this._idleSprite = null; }
        if (this._hoverSprite) { this._hoverSprite.destroy(); this._hoverSprite = null; }
        if (this._textSprite) { this._textSprite.destroy(); this._textSprite = null; }
        super.destroy(options);
    }
};