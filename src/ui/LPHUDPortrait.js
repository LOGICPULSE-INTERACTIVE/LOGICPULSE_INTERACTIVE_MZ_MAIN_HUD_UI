LOGICPULSE.UI = LOGICPULSE.UI || {};

LOGICPULSE.UI.PortraitAnimator = class extends PIXI.Container {
    constructor(options) {
        super();
        options = options || {};
        this._folder = options.folder || LOGICPULSE.Assets.Folders.Portrait;
        this._actorId = options.actorId || 1;
        this._frameNames = LOGICPULSE.Assets.loadPortraitFrames(this._actorId);
        this._interval = options.interval || 2;   // matches the scene: 2 frames
        this._timer = 0;
        this._frameIndex = 0;
        this._direction = 1;

        this.x = options.x || 0;
        this.y = options.y || 0;

        this._createSprites();
    }

    _createSprites() {
        this._portraitSprites = [];
        for (var i = 0; i < this._frameNames.length; i++) {
            var sprite = LOGICPULSE.Assets.createSprite(this._folder, this._frameNames[i]);
            sprite.visible = false;
            this.addChild(sprite);
            this._portraitSprites.push(sprite);
        }
        if (this._portraitSprites.length > 0) {
            this._portraitSprites[0].visible = true;
            this._frameIndex = 0;
        }
    }

    update() {
        if (this._portraitSprites.length === 0) return;
        this._timer++;
        if (this._timer < this._interval) return;
        this._timer = 0;

        // Hide current
        this._portraitSprites[this._frameIndex].visible = false;

        // Move index (ping-pong)
        this._frameIndex += this._direction;
        if (this._frameIndex >= this._portraitSprites.length) {
            this._frameIndex = this._portraitSprites.length - 2;
            this._direction = -1;
        } else if (this._frameIndex < 0) {
            this._frameIndex = 1;
            this._direction = 1;
        }

        // Show new
        this._portraitSprites[this._frameIndex].visible = true;
    }
};