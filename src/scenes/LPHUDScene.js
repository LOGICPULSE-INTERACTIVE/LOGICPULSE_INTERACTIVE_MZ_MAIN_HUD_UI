LOGICPULSE.Scene_HUD = class extends Scene_Base {
    constructor() {
        super();
        // No timers here – they're inside the dedicated objects
    }

    create() {
        super.create();
        this._controller = new LOGICPULSE.HUDController(this);

        // 1. Full background
        this.createBackgroundImage();

        // 2. City (animated background)
        this.createCity();

        // 3. Boxes (static sprites)
        this.createBoxes();

        // 4. Portrait (on top of portrait box)
        this.createPortrait();

        // 5. Header texts (top header)
        this.createHeaderContent();

        // 6. Status content (gauges + stats)
        this.createStatusContent();

        // 7. Quest content
        this.createQuestContent();

        // 8. Buttons (on top)
        this.createButtons();

        this._fadeIn = true;
    }

    // ---- Background ----
    createBackgroundImage() {
        var bgName = LOGICPULSE.Assets.Images.HUD.Background;
        var sprite = LOGICPULSE.Assets.createSprite(LOGICPULSE.Assets.Folders.HUD, bgName);
        sprite.x = 0;
        sprite.y = 0;
        this.addChild(sprite);
        this._backgroundSprite = sprite;
    }

    // ---- Boxes ----
    createBoxes() {
        var layoutImages = LOGICPULSE.HUDLayout.Images;
        for (var i = 0; i < layoutImages.length; i++) {
            var img = layoutImages[i];
            if (img.key === "Background") continue;
            var sprite = LOGICPULSE.Assets.createSprite(LOGICPULSE.Assets.Folders.HUD, img.name);
            sprite.x = img.x;
            sprite.y = img.y;
            this.addChild(sprite);
            if (img.key === "TopHeader") this._headerSprite = sprite;
            else if (img.key === "CaseNotesBox") this._caseNotesBoxSprite = sprite;
            else if (img.key === "CharacterStatusBox") this._statusBoxSprite = sprite;
            else if (img.key === "QuestBox") this._questBoxSprite = sprite;
            else if (img.key === "MapBox") this._mapBoxSprite = sprite;
            else if (img.key === "PortraitBox") this._portraitBoxSprite = sprite;
        }
    }

    // ---- City ----
    createCity() {
        var layout = LOGICPULSE.HUDLayout.animations.CityPicture;
        this._city = new LOGICPULSE.UI.CityBackground({
            x: layout.x,
            y: layout.y,
            overlayIntervalMin: 150,
            overlayIntervalMax: 450,
            skyIntervalMin: 20,
            skyIntervalMax: 60,
            lightningIntervalMin: 1200,
            lightningIntervalMax: 2400,
            lightningDuration: 90,
            blinkPeriod: 10,
            blinkDuration: 5
        });
        this.addChild(this._city);
    }

    // ---- Portrait ----
    createPortrait() {
        var layout = LOGICPULSE.HUDLayout.animations.Portrait;
        var actor = LOGICPULSE.HUDProvider.getActor();
        var actorId = actor ? actor.actorId() : 1;
        this._portrait = new LOGICPULSE.UI.PortraitAnimator({
            x: layout.x,
            y: layout.y,
            actorId: actorId,
            interval: 4
        });
        this.addChild(this._portrait);
    }

    // ---- Header Texts ----
    createHeaderContent() {
        this._headerTexts = {};
        var layout = LOGICPULSE.HUDLayout.TopHeaderText;
        for (var key in layout) {
            var cfg = layout[key];
            var textOptions = {
                x: cfg.x,
                y: cfg.y,
                width: cfg.w,
                height: cfg.h,
                fontSize: cfg.fontSize,
                textColor: cfg.color,
                align: cfg.align || "left"
            };

            // --- Apply glow outline to "Level" text ---
            if (key === "Level") {
                // Use the same color as the text but with transparency and wider outline
                textOptions.outlineColor = "rgba(46,89,169,0.6)";
                textOptions.outlineWidth = 4;
            } else if (key === "LevelValue") {
                textOptions.outlineColor = "rgba(46,89,169,0.6)"; // match its text color
                textOptions.outlineWidth = 4;
            } else {
                // Default outline (black, 4px) for other texts
                textOptions.outlineColor = "rgba(0,0,0,0.8)";
                textOptions.outlineWidth = 4;
            }

            var text = new LOGICPULSE.UI.Text(textOptions);
            this.addChild(text);
            this._headerTexts[key] = text;
        }
        this.updateHeaderTexts();
    }

    updateHeaderTexts() {
        var provider = LOGICPULSE.HUDProvider;
        this._headerTexts.Level.setText("Lv.");
        this._headerTexts.LevelValue.setText(provider.getLevel());
        this._headerTexts.Gold.setText("Credit");
        this._headerTexts.GoldValue.setText(provider.getGold());
    }

    // ---- Status Content ----
    createStatusContent() {
        this._statusDisplay = new LOGICPULSE.UI.StatusDisplay();
        this.addChild(this._statusDisplay);
    }

    // ---- Quest Content ----
    createQuestContent() {
        this._questDisplay = new LOGICPULSE.UI.QuestDisplay();
        this.addChild(this._questDisplay);
    }

    // ---- Buttons ----
    createButtons() {
        this._buttons = [];
        var leftLayout = LOGICPULSE.HUDLayout.LeftButtons;
        var rightLayout = LOGICPULSE.HUDLayout.RightButtons;
        var folders = LOGICPULSE.Assets.Folders;
        var images = LOGICPULSE.Assets.Images.HUD;

        var leftKeys = ["Inventory", "Skill", "SaveLoad", "Setting"];
        var leftActions = {
            Inventory: function() { SceneManager.push(LOGICPULSE.Scenes.Inventory); },
            Skill: function() { SceneManager.push(Scene_Skill); },
            SaveLoad: function() { SceneManager.push(LOGICPULSE.Scenes.SaveLoad); },
            Setting: function() { SceneManager.push(Scene_Options); }
        };
        var LeftTexts = ["Inventory", "Skill Database", "Save/Load", "Setting"];

        for (var i = 0; i < leftKeys.length; i++) {
            var key = leftKeys[i];
            var cfg = leftLayout[key];
            var btn = new LOGICPULSE.UI.HUDButton({
                x: cfg.x,
                y: cfg.y,
                width: cfg.width,
                height: cfg.height,
                idleBitmap: LOGICPULSE.Assets.load(folders.HUD, images.LeftButtonIdle),
                hoverBitmap: LOGICPULSE.Assets.load(folders.HUD, images.LeftButtonHover),
                text: LeftTexts[i],   // <-- fixed
                fontSize: 30,
                textColor: "#ffffff",
                onClick: leftActions[key]
            });
            this.addChild(btn);
            this._buttons.push(btn);
            this._controller.registerButton(btn);
        }

        var rightKeys = ["Map", "Exit"];
        var rightActions = {
            Map: function() { /* placeholder */ },
            Exit: function() { SceneManager.exit(); }
        };
        var rightIdle = [images.ButtonMapIdle, images.ButtonExitIdle];
        var rightHover = [images.ButtonMapHover, images.ButtonExitHover];
        var rightTexts = ["Inspect Map", "Exit The Game"];
        for (var j = 0; j < rightKeys.length; j++) {
            var key = rightKeys[j];
            var cfg = rightLayout[key];
            var btn = new LOGICPULSE.UI.HUDButton({
                x: cfg.x,
                y: cfg.y,
                width: cfg.width,
                height: cfg.height,
                idleBitmap: LOGICPULSE.Assets.load(folders.HUD, rightIdle[j]),
                hoverBitmap: LOGICPULSE.Assets.load(folders.HUD, rightHover[j]),
                text: rightTexts[j],
                fontSize: 30,
                textColor: "#ffffff",
                onClick: rightActions[key]
            });
            this.addChild(btn);
            this._buttons.push(btn);
            this._controller.registerButton(btn);
        }
    }

    // ---- Update loop ----
    update() {
        super.update();

        // Update animations
        if (this._city) this._city.update();
        if (this._portrait) this._portrait.update();

        // Update HUD data
        this.updateHeaderTexts();
        if (this._statusDisplay) this._statusDisplay.updateAll();
        if (this._questDisplay) this._questDisplay.updateAll();

        // Buttons
        this._controller.update();

        // Cancel
        if (Input.isTriggered('cancel')) {
            SceneManager.pop();
        }
    }
};