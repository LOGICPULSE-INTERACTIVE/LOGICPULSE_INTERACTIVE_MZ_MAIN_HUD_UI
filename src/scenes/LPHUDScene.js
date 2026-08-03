LOGICPULSE.Scene_HUD = class extends Scene_Base {
    constructor() {
        super();
        // No timers here – they're inside the dedicated objects
    }

    create() {
        super.create();
        this._controller = new LOGICPULSE.HUDController(this);

        // 1. Background (full screen)
        this.createBackgroundImage();

        // 2. City (animated background)
        this.createCity();

        // 3. Boxes (all except MapBox)
        this.createBoxes();

        // 4. Portrait (on top of portrait box)
        this.createPortrait();

        // 5. MapBox (on top of portrait, behind buttons)
        this.createMapBox();

        // 6. Header texts (top header)
        this.createHeaderContent();

        // 7. Status content (gauges + stats)
        this.createStatusContent();

        // 8. Quest content
        this.createQuestContent();

        // 9. Buttons (on top)
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
            if (img.key === "MapBox") continue;   // we'll add it later
            var sprite = LOGICPULSE.Assets.createSprite(LOGICPULSE.Assets.Folders.HUD, img.name);
            sprite.x = img.x;
            sprite.y = img.y;
            this.addChild(sprite);
            if (img.key === "TopHeader") this._headerSprite = sprite;
            else if (img.key === "CaseNotesBox") this._caseNotesBoxSprite = sprite;
            else if (img.key === "CharacterStatusBox") this._statusBoxSprite = sprite;
            else if (img.key === "QuestBox") this._questBoxSprite = sprite;
            else if (img.key === "PortraitBox") this._portraitBoxSprite = sprite;
            // MapBox is handled separately
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

    createMapBox() {
        // Find the MapBox entry from the layout
        var layoutImages = LOGICPULSE.HUDLayout.Images;
        var mapBoxData = null;
        for (var i = 0; i < layoutImages.length; i++) {
            if (layoutImages[i].key === "MapBox") {
                mapBoxData = layoutImages[i];
                break;
            }
        }
        if (!mapBoxData) return;

        var sprite = LOGICPULSE.Assets.createSprite(
            LOGICPULSE.Assets.Folders.HUD,
            mapBoxData.name
        );
        sprite.x = mapBoxData.x;
        sprite.y = mapBoxData.y;
        this.addChild(sprite);
        this._mapBoxSprite = sprite;
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
        this._questDisplay = new LOGICPULSE.UI.HUDQuestDisplay();
        this.addChild(this._questDisplay);
    }

    // ---- Buttons ----
    createButtons() {
        this._buttons = [];
        var leftLayout = LOGICPULSE.HUDLayout.LeftButtons;
        var rightLayout = LOGICPULSE.HUDLayout.RightButtons;
        var folders = LOGICPULSE.Assets.Folders;
        var images = LOGICPULSE.Assets.Images.HUD;

        // ---- Left buttons ----
        var leftKeys = ["Inventory", "Equipment", "QuestDB", "Skill", "SaveLoad", "Setting", "Exit"];
        var leftActions = {
            Inventory: function () { SceneManager.push(LOGICPULSE.Scenes.Inventory); },
            Equipment: function () { SceneManager.push(Scene_Equip); },
            QuestDB: function () { SceneManager.push(LOGICPULSE.Scene_QuestLog); },
            Skill: function () { SceneManager.push(Scene_Skill); },
            SaveLoad: function () { SceneManager.push(LOGICPULSE.Scenes.SaveLoad); },
            Setting: function () { SceneManager.push(Scene_Options); },
            Exit: function () { SceneManager.exit(); }
        };
        // Default texts – you can override by adding a "text" field in the layout for each button
        var defaultLeftTexts = ["Inventory", "Equipment", "Quest Database", "Skill Database", "Save/Load", "Setting", "Exit Game"];

        for (var i = 0; i < leftKeys.length; i++) {
            var key = leftKeys[i];
            var cfg = leftLayout[key];
            if (!cfg) continue;

            // Use cfg.text if available, otherwise use default from array
            var buttonText = cfg.text || defaultLeftTexts[i];

            var idleBitmap, hoverBitmap;
            if (key === "Exit") {
                idleBitmap = LOGICPULSE.Assets.load(folders.HUD, images.ButtonExitIdle);
                hoverBitmap = LOGICPULSE.Assets.load(folders.HUD, images.ButtonExitHover);
            } else {
                idleBitmap = LOGICPULSE.Assets.load(folders.HUD, images.LeftButtonIdle);
                hoverBitmap = LOGICPULSE.Assets.load(folders.HUD, images.LeftButtonHover);
            }

            var btn = new LOGICPULSE.UI.HUDButton({
                x: cfg.x,
                y: cfg.y,
                width: cfg.width,
                height: cfg.height,
                idleBitmap: idleBitmap,
                hoverBitmap: hoverBitmap,
                text: buttonText,
                fontSize: 28,
                textColor: "#ffffff",
                textOffsetX: cfg.textOffsetX || 0,
                textOffsetY: cfg.textOffsetY || 0,
                onClick: leftActions[key]
            });
            this.addChild(btn);
            this._buttons.push(btn);
            this._controller.registerButton(btn);
        }

        // ---- Right buttons (Map) ----
        var rightKeys = ["Map"];
        var rightActions = {
            Map: function () { /* placeholder */ }
        };
        var rightIdle = [images.ButtonMapIdle];
        var rightHover = [images.ButtonMapHover];

        for (var j = 0; j < rightKeys.length; j++) {
            var key = rightKeys[j];
            var cfg = rightLayout[key];
            if (!cfg) continue;

            var buttonText = cfg.text || "Inspect Map";

            var btn = new LOGICPULSE.UI.HUDButton({
                x: cfg.x,
                y: cfg.y,
                width: cfg.width,
                height: cfg.height,
                idleBitmap: LOGICPULSE.Assets.load(folders.HUD, rightIdle[j]),
                hoverBitmap: LOGICPULSE.Assets.load(folders.HUD, rightHover[j]),
                text: buttonText,
                fontSize: 28,
                textColor: "#ffffff",
                textOffsetX: cfg.textOffsetX || 0,
                textOffsetY: cfg.textOffsetY || 0,
                onClick: rightActions[key]
            });
            this.addChild(btn);
            this._buttons.push(btn);
            this._controller.registerButton(btn);
        }
    }

    // ---- Update loop ----
    update() {
        LOGICPULSE.Mouse.update();
        super.update();

        // Update animations
        if (this._city) this._city.update();
        if (this._portrait) this._portrait.update();

        // Update HUD data
        this.updateHeaderTexts();
        if (this._statusDisplay) this._statusDisplay.updateAll();
        if (this._questDisplay) this._questDisplay.updateAll();

        // ---- Wheel handling for quest display ----
        var wheelDelta = LOGICPULSE.Mouse._wheelDelta;
        if (wheelDelta !== 0 && this._questDisplay) {
            var mx = LOGICPULSE.Mouse.x();
            var my = LOGICPULSE.Mouse.y();
            var consumed = this._questDisplay.handleWheel(mx, my, wheelDelta);
            if (consumed) {
                LOGICPULSE.Mouse._wheelDelta = 0; // reset to prevent further use
            }
        }
        // ---- Click handling for objectives ----
        if (TouchInput.isTriggered() && this._questDisplay) {
            var mx = TouchInput.x;
            var my = TouchInput.y;
            this._questDisplay.handleClick(mx, my);
        }

        // Buttons
        this._controller.update();

        // Cancel
        if (Input.isTriggered('cancel')) {
            SceneManager.pop();
        }
    }
};