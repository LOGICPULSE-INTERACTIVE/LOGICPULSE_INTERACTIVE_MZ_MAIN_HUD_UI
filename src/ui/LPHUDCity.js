LOGICPULSE.UI = LOGICPULSE.UI || {};

LOGICPULSE.UI.CityBackground = class extends PIXI.Container {
    constructor(options) {
        super();
        options = options || {};
        this._folder = options.folder || LOGICPULSE.Assets.Folders.CityPicture;
        this._components = LOGICPULSE.Assets.loadCityComponents();

        this.x = options.x || 0;
        this.y = options.y || 0;

        // Timers (mirroring the scene)
        this._cityFrameTimer = 0;
        this._citySkyTimer = 0;
        this._cityLightningTimer = 0;
        this._lightningHideTimer = undefined;
        this._blinkTimer = 0;

        // Config (hardcoded to match the scene)
        this._overlayIntervalMin = 150;
        this._overlayIntervalMax = 450;
        this._skyIntervalMin = 20;
        this._skyIntervalMax = 60;
        this._lightningIntervalMin = 1200;
        this._lightningIntervalMax = 2400;
        this._lightningDuration = 90;
        this._blinkPeriod = 120;
        this._blinkDuration = 60;

        this._createLayers();
        this._initRandom();
    }

    _createLayers() {
        var folder = this._folder;
        var comp = this._components;

        // Main
        var mainSprite = LOGICPULSE.Assets.createSprite(folder, comp.main);
        this.addChild(mainSprite);
        this._cityMain = mainSprite;

        // Overlays (B1-B14)
        this._overlaySprites = [];
        for (var i = 0; i < comp.overlays.length; i++) {
            var sprite = LOGICPULSE.Assets.createSprite(folder, comp.overlays[i]);
            sprite.visible = false;
            this.addChild(sprite);
            this._overlaySprites.push(sprite);
        }

        // Sky (S1, S2)
        this._skySprites = [];
        for (var j = 0; j < comp.sky.length; j++) {
            var sprite = LOGICPULSE.Assets.createSprite(folder, comp.sky[j]);
            sprite.visible = false;
            this.addChild(sprite);
            this._skySprites.push(sprite);
        }

        // Lightning sprites (array)
        this._lightningSprites = [];
        var lightningFiles = comp.lightning;
        for (var l = 0; l < lightningFiles.length; l++) {
            var sprite = LOGICPULSE.Assets.createSprite(folder, lightningFiles[l]);
            sprite.visible = false;
            this.addChild(sprite);
            this._lightningSprites.push(sprite);
        }

        // Blink sprite
        this._blinkSprite = LOGICPULSE.Assets.createSprite(folder, comp.blink);
        this._blinkSprite.visible = false;
        this.addChild(this._blinkSprite);

        // Frame
        var frameSprite = LOGICPULSE.Assets.createSprite(folder, comp.frame);
        this.addChild(frameSprite);
    }

    _initRandom() {
        if (this._overlaySprites.length > 0) {
            this._cityOverlayIndex = Math.floor(Math.random() * this._overlaySprites.length);
            this._overlaySprites[this._cityOverlayIndex].visible = true;
        }
        if (this._skySprites.length > 0) {
            this._citySkyIndex = Math.floor(Math.random() * this._skySprites.length);
            this._skySprites[this._citySkyIndex].visible = true;
        }
    }

    update() {
        // ---- Overlays – stay visible for 150~450 frames ----
        this._cityFrameTimer++;
        if (this._cityFrameTimer > this._overlayIntervalMin + Math.floor(Math.random() * (this._overlayIntervalMax - this._overlayIntervalMin))) {
            this._cityFrameTimer = 0;
            for (var i = 0; i < this._overlaySprites.length; i++) {
                this._overlaySprites[i].visible = false;
            }
            var count = 1 + Math.floor(Math.random() * 3);
            for (var j = 0; j < count; j++) {
                var idx = Math.floor(Math.random() * this._overlaySprites.length);
                this._overlaySprites[idx].visible = true;
            }
        }

        // ---- Sky – change every 20~60 frames ----
        this._citySkyTimer++;
        if (this._citySkyTimer > this._skyIntervalMin + Math.floor(Math.random() * (this._skyIntervalMax - this._skyIntervalMin))) {
            this._citySkyTimer = 0;
            for (var k = 0; k < this._skySprites.length; k++) {
                this._skySprites[k].visible = false;
            }
            var idx = Math.floor(Math.random() * this._skySprites.length);
            this._skySprites[idx].visible = true;
        }

        // ---- Lightning – trigger every ~1200-2400 frames ----
        this._cityLightningTimer++;
        if (this._cityLightningTimer > this._lightningIntervalMin + Math.floor(Math.random() * (this._lightningIntervalMax - this._lightningIntervalMin))) {
            this._cityLightningTimer = 0;
            for (var l = 0; l < this._lightningSprites.length; l++) {
                this._lightningSprites[l].visible = false;
            }
            var randomIndex = Math.floor(Math.random() * this._lightningSprites.length);
            this._lightningSprites[randomIndex].visible = true;
            this._lightningHideTimer = this._lightningDuration;
        }
        if (this._lightningHideTimer !== undefined && this._lightningHideTimer > 0) {
            this._lightningHideTimer--;
            if (this._lightningHideTimer <= 0) {
                for (var l = 0; l < this._lightningSprites.length; l++) {
                    this._lightningSprites[l].visible = false;
                }
                this._lightningHideTimer = undefined;
            }
        }

        // ---- Blink – flash every 10 frames, visible for 5 frames ----
        this._blinkTimer = (this._blinkTimer + 1) % this._blinkPeriod;
        this._blinkSprite.visible = (this._blinkTimer < this._blinkDuration);
    }
};