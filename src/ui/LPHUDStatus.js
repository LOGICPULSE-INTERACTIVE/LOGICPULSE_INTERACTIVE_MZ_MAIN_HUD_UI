LOGICPULSE.UI = LOGICPULSE.UI || {};

LOGICPULSE.UI.StatusDisplay = class extends PIXI.Container {
    constructor(options) {
        super();
        options = options || {};
        this._provider = options.provider || LOGICPULSE.HUDProvider;
        this._layout = options.layout || LOGICPULSE.HUDLayout.CharacterStatusBox;

        // Position the container at the CharacterStatusBox location
        var boxPos = this._getBoxPosition("CharacterStatusBox");
        this.x = boxPos.x;
        this.y = boxPos.y;

        this._createGauges();
        this._createStatsTexts();
        this.updateAll();
    }

    _getBoxPosition(key) {
        var layoutImages = LOGICPULSE.HUDLayout.Images;
        for (var i = 0; i < layoutImages.length; i++) {
            if (layoutImages[i].key === key) {
                return { x: layoutImages[i].x, y: layoutImages[i].y };
            }
        }
        return { x: 0, y: 0 };
    }

    _createGauges() {
        this._gauges = {};
        var gaugeLayout = this._layout.Gauges;
        for (var key in gaugeLayout) {
            var cfg = gaugeLayout[key];
            var container = new PIXI.Container();
            container.x = cfg.x;
            container.y = cfg.y;

            // Prefix label (e.g., "HP")
            var labelWidth = 30;
            var labelText = new LOGICPULSE.UI.Text({
                x: -labelWidth - 4,
                y: 0,
                width: labelWidth,
                height: cfg.H,
                fontSize: cfg.fontSize || 16,
                textColor: cfg.color || "#ffffff",
                align: "right",
                fontFace: $gameSystem.mainFontFace()
            });
            labelText.setText(key);
            container.addChild(labelText);

            // Bar background
            var bg = new PIXI.Graphics();
            bg.beginFill(0x333333);
            bg.drawRect(0, 0, cfg.W, cfg.H);
            bg.endFill();
            container.addChild(bg);

            // Bar fill
            var fillColor = parseInt(cfg.color.replace('#', ''), 16) || 0xffffff;
            var fill = new PIXI.Graphics();
            fill.beginFill(fillColor);
            fill.drawRect(0, 0, cfg.W, cfg.H);
            fill.endFill();
            container.addChild(fill);

            this._gauges[key] = {
                container: container,
                fill: fill,
                maxWidth: cfg.W,
                height: cfg.H,
                color: fillColor
            };
            this.addChild(container);
        }
    }

    _createStatsTexts() {
        this._statsTexts = {};
        var layout = this._layout;
        var keys = ["Attack", "Defence", "agility", "MagicAttack", "MagicDefence", "Weapon", "Shield", "Head", "Body", "Accessory"];
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var cfg = layout[key];
            if (!cfg) continue;
            var text = new LOGICPULSE.UI.Text({
                x: cfg.x,
                y: cfg.y,
                width: cfg.w,
                height: cfg.h,
                fontSize: cfg.fontSize,
                textColor: cfg.color,
                align: cfg.align || "left",
                fontFace: cfg.font || $gameSystem.mainFontFace()
            });
            this.addChild(text);
            this._statsTexts[key] = text;
        }
    }

    updateAll() {
        this.updateGauges();
        this.updateStatsTexts();
    }

    updateGauges() {
        var provider = this._provider;
        var gauges = {
            HP: { value: provider.getHp(), max: provider.getMaxHp() },
            MP: { value: provider.getMp(), max: provider.getMaxMp() },
            TP: { value: provider.getTp(), max: provider.getMaxTp() }
        };
        for (var key in gauges) {
            var g = this._gauges[key];
            if (!g) continue;
            var val = gauges[key].value;
            var max = gauges[key].max || 1;
            var ratio = Math.min(1, Math.max(0, val / max));
            var newWidth = Math.floor(ratio * g.maxWidth);
            g.fill.clear();
            g.fill.beginFill(g.color);
            g.fill.drawRect(0, 0, newWidth, g.height);
            g.fill.endFill();
        }
    }

    updateStatsTexts() {
        var provider = this._provider;
        this._statsTexts.Attack.setText("ATK: " + provider.getAttack());
        this._statsTexts.Defence.setText("DEF: " + provider.getDefence());
        this._statsTexts.agility.setText("AGI: " + provider.getAgility());
        this._statsTexts.MagicAttack.setText("MAT: " + provider.getMagicAttack());
        this._statsTexts.MagicDefence.setText("MDF: " + provider.getMagicDefence());
        this._statsTexts.Weapon.setText("WPN: " + provider.getWeapon());
        this._statsTexts.Shield.setText("SH: " + provider.getShield());
        this._statsTexts.Head.setText("HD: " + provider.getHead());
        this._statsTexts.Body.setText("BD: " + provider.getBody());
        this._statsTexts.Accessory.setText("ACC: " + provider.getAccessory());
    }
};