LOGICPULSE.UI = LOGICPULSE.UI || {};

LOGICPULSE.UI.QuestDisplay = class extends PIXI.Container {
    constructor(options) {
        super();
        options = options || {};
        this._provider = options.provider || LOGICPULSE.HUDProvider;
        this._layout = options.layout || LOGICPULSE.HUDLayout.QuestBox;

        // Position at QuestBox location
        var boxPos = this._getBoxPosition("QuestBox");
        this.x = boxPos.x;
        this.y = boxPos.y;

        this._createTexts();
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

    _createTexts() {
        this._texts = {};
        var layout = this._layout;
        var keys = ["CaseTitle", "CaseNumber", "Hint1", "Hint2", "Hint3", "Description"];
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
            this._texts[key] = text;
        }
    }

    updateAll() {
        var provider = this._provider;
        this._texts.CaseTitle.setText(provider.getCaseTitle());
        this._texts.CaseNumber.setText(provider.getCaseNumber());
        this._texts.Hint1.setText(provider.getHint1());
        this._texts.Hint2.setText(provider.getHint2());
        this._texts.Hint3.setText(provider.getHint3());
        this._texts.Description.setText(provider.getDescription());
    }
};