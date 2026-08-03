//=============================================================================
// LPHUDQuest.js – with auto‑select active objective
//=============================================================================

LOGICPULSE.UI = LOGICPULSE.UI || {};

LOGICPULSE.UI.HUDQuestDisplay = class extends PIXI.Container {
    constructor(options) {
        super();
        options = options || {};
        this._provider = options.provider || LOGICPULSE.HUDProvider;
        this._layout = options.layout || LOGICPULSE.HUDLayout.QuestBox;

        var boxPos = this._getBoxPosition("QuestBox");
        this.x = boxPos.x;
        this.y = boxPos.y;

        this._objScrollY = 0;
        this._objContentHeight = 0;
        this._descScrollY = 0;
        this._descContentHeight = 0;
        this._lastDescText = '';


        this._selectedObjectiveId = null;
        this._selectedObjectiveState = 0;
        this._objectiveRects = [];
        this._currentDetails = null;

        this._createStaticTexts();
        this._createNotesLabel();
        this._createObjectivesMaskAndContainer();
        this._createDescriptionMaskAndContainer();
        this._createHintText();
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

    _createStaticTexts() {
        this._texts = {};
        var layout = this._layout;
        var keys = ["CaseTitle", "CaseNumber"];
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
    _createNotesLabel() {
        const cfg = this._layout.Notes;
        if (!cfg) return;

        this._notesLabel = new LOGICPULSE.UI.Text({
            x: cfg.x,
            y: cfg.y,
            width: cfg.w,
            height: cfg.h,
            fontSize: cfg.fontSize || 32,
            textColor: cfg.color || "#ff8000",
            align: cfg.align || "left",
            fontFace: cfg.font || $gameSystem.mainFontFace(),
            text: "Current Case Note:"
        });

        this.addChild(this._notesLabel);
    }



    _createHintText() {
        const maskCfg = this._layout.HintMask;
        const textCfg = this._layout.HintText;

        if (!maskCfg) return;

        // --- MASK ---
        this._hintMask = new PIXI.Graphics();
        this._hintMask.beginFill(0xffffff);
        this._hintMask.drawRect(maskCfg.x, maskCfg.y, maskCfg.w, maskCfg.h);
        this._hintMask.endFill();
        this.addChild(this._hintMask);

        // --- CONTAINER ---
        this._hintContainer = new PIXI.Container();
        this._hintContainer.x = maskCfg.x;
        this._hintContainer.y = maskCfg.y;
        this._hintContainer.mask = this._hintMask;
        this.addChild(this._hintContainer);

        // --- TEXT STYLE ---
        this._hintStyle = new PIXI.TextStyle({
            fontFamily: $gameSystem.mainFontFace(),
            fontSize: textCfg.fontSize || maskCfg.fontSize || 16,
            fill: maskCfg.color || "#ff8000",
            align: textCfg.align || "left",
            wordWrap: true,
            wordWrapWidth: maskCfg.w
        });

        // --- TEXT INSIDE CONTAINER ---
        this._hintText = new PIXI.Text("", this._hintStyle);

        // IMPORTANT: relative to container, NOT screen
        this._hintText.x = textCfg.x || 0;
        this._hintText.y = textCfg.y || 0;   // ← moves text down inside the box

        this._hintContainer.addChild(this._hintText);
    }




    _createObjectivesMaskAndContainer() {
        var L = this._layout;
        var maskCfg = L.ObjectivesMask;
        var boxCfg = L.ObjectivesBox;

        this._objMask = new PIXI.Graphics();
        this._objMask.beginFill(0xffffff);
        this._objMask.drawRect(maskCfg.x, maskCfg.y, maskCfg.w, maskCfg.h);
        this._objMask.endFill();
        this._objMask.visible = true;
        this.addChild(this._objMask);

        this._objContainer = new PIXI.Container();
        this._objContainer.x = maskCfg.x;
        this._objContainer.y = maskCfg.y;
        this._objContainer.mask = this._objMask;
        this.addChild(this._objContainer);

        this._objMaskRect = { x: maskCfg.x, y: maskCfg.y, w: maskCfg.w, h: maskCfg.h };
        this._objBoxHeight = boxCfg.h || 36;
        var spacing = boxCfg.spacing || 5;
        if (spacing < 1) spacing = 5;
        this._objSpacing = spacing;
    }

    _createDescriptionMaskAndContainer() {
        var L = this._layout;
        var descMaskCfg = L.DescriptionMask;
        var descCfg = L.Description;

        this._descMask = new PIXI.Graphics();
        this._descMask.beginFill(0xffffff);
        this._descMask.drawRect(descMaskCfg.x, descMaskCfg.y, descMaskCfg.w, descMaskCfg.h);
        this._descMask.endFill();
        this._descMask.visible = true;
        this.addChild(this._descMask);

        this._descContainer = new PIXI.Container();
        this._descContainer.x = descMaskCfg.x;
        this._descContainer.y = descMaskCfg.y;
        this._descContainer.mask = this._descMask;
        this.addChild(this._descContainer);

        this._descText = new LOGICPULSE.UI.Text({
            x: descCfg.x || 0,
            y: descCfg.y || 0,
            width: descCfg.w || descMaskCfg.w,
            height: 999,
            fontSize: descCfg.fontSize || 20,
            textColor: descCfg.color || "#ffffff",
            align: descCfg.align || "left",
            fontFace: descCfg.font || $gameSystem.mainFontFace()
        });
        this._descContainer.addChild(this._descText);

        this._descMaskRect = { x: descMaskCfg.x, y: descMaskCfg.y, w: descMaskCfg.w, h: descMaskCfg.h };
    }

    updateAll() {
        var provider = this._provider;
        var details = provider.getPriorityQuestDetails();
        this._currentDetails = details;

        this._texts.CaseTitle.setText(provider.getCaseTitle());
        this._texts.CaseNumber.setText(provider.getCaseNumber());

        var showInactive = details ? details.showInactive : false;
        this._updateObjectives(details, showInactive);
        this._updateDescription(details);
        this._autoSelectDefaultObjective(); // ← auto‑select active objective
        this._updateHint();
    }

    _updateObjectives(details, showInactive) {
        this._objContainer.removeChildren();
        this._objectiveRects = [];

        if (!details || !details.objectives || details.objectives.length === 0) {
            this._objContentHeight = 0;
            this._objScrollY = 0;
            this._objContainer.y = this._objMaskRect.y;
            return;
        }

        var filteredObjectives = details.objectives;
        if (!showInactive) {
            filteredObjectives = details.objectives.filter(function(obj) {
                return obj.state !== 0;
            });
        }

        if (filteredObjectives.length === 0) {
            this._objContentHeight = 0;
            this._objScrollY = 0;
            this._objContainer.y = this._objMaskRect.y;
            return;
        }

        var y = 0;
        var S = LOGICPULSE.Constants.Quest.ObjectiveState;
        var boxH = this._objBoxHeight;
        var spacing = this._objSpacing;
        var maskW = this._objMaskRect.w;

        for (var obj of filteredObjectives) {
            var stateText = "Inactive";
            var color = "#ffffff";
            if (obj.state === S.Active) {
                stateText = "Active";
                color = "#ffffff";
            } else if (obj.state === S.Completed) {
                stateText = "Completed";
                color = "#44ff44";
            } else if (obj.state === S.Failed) {
                stateText = "Failed";
                color = "#ff4444";
            }

            // Background
            var boxSprite = LOGICPULSE.Assets.createSprite(
                LOGICPULSE.Assets.Folders.HUD,
                LOGICPULSE.Assets.Images.HUD.QuestObjectiveBox
            );
            if (boxSprite && boxSprite.texture) {
                boxSprite.width = maskW;
                boxSprite.height = boxH;
                boxSprite.x = 0;
                boxSprite.y = y;
                this._objContainer.addChild(boxSprite);
            } else {
                var bg = new PIXI.Graphics();
                bg.beginFill(0x333333);
                bg.drawRect(0, y, maskW, boxH);
                bg.endFill();
                this._objContainer.addChild(bg);
            }

            var textCfg = this._layout.ObjectivesTexts || { x: 40, y: 0, w: 595, h: 36, align: "center", fontSize: 20, color: "#ffffff" };
            var text = new LOGICPULSE.UI.Text({
                x: textCfg.x,
                y: y + textCfg.y,
                width: textCfg.w || maskW - textCfg.x - 10,
                height: textCfg.h || boxH,
                fontSize: textCfg.fontSize || 20,
                textColor: color,
                align: textCfg.align || "left",
                text: obj.description + " [" + stateText + "]",
                fontFace: textCfg.font || $gameSystem.mainFontFace()
            });
            this._objContainer.addChild(text);

            this._objectiveRects.push({
                id: obj.id,
                state: obj.state,
                y: y,
                height: boxH,
                hint: obj.hint || ""
            });

            y += boxH + spacing;
        }

        this._objContentHeight = Math.max(0, y - spacing);
        var maxScroll = Math.max(0, this._objContentHeight - this._objMaskRect.h);
        if (this._objScrollY < -maxScroll) this._objScrollY = -maxScroll;
        if (this._objScrollY > 0) this._objScrollY = 0;
        this._objContainer.y = this._objMaskRect.y + this._objScrollY;
    }

    _updateDescription(details) {
        var text = "";
        if (details && details.objectives) {
            var priority = this._provider.getPriorityQuest();
            if (priority) {
                for (var obj of details.objectives) {
                    if (obj.state === LOGICPULSE.Constants.Quest.ObjectiveState.Active) {
                        var note = LOGICPULSE.QuestManager.getOnScreenExtraNote(
                            priority.chapterId,
                            priority.questId,
                            obj.id
                        );
                        if (note) {
                            text = note;
                            break;
                        }
                    }
                }
            }
        }
        if (!text && details) {
            text = details.description || "";
        }

        if (text !== this._lastDescText) {
            this._lastDescText = text;
            this._descScrollY = 0;
        }

        this._descText.setText(text);

        var width = this._descText._width || this._descMaskRect.w;
        var fontSize = this._descText._fontSize || 20;
        var fontFace = this._descText._fontFace || $gameSystem.mainFontFace();

        var style = new PIXI.TextStyle({
            fontFamily: fontFace,
            fontSize: fontSize,
            fill: "#ffffff",
            align: this._descText._align || "left",
            wordWrap: true,
            wordWrapWidth: width,
            breakWords: true
        });
        var measureText = new PIXI.Text(text || " ", style);
        var textHeight = measureText.height;
        measureText.destroy();

        var padding = 20;
        var bottomPadding = 30;
        this._descContentHeight = Math.max(textHeight + padding + bottomPadding, this._descMaskRect.h);

        var maxScroll = Math.max(0, this._descContentHeight - this._descMaskRect.h);
        if (this._descScrollY < -maxScroll) this._descScrollY = -maxScroll;
        if (this._descScrollY > 0) this._descScrollY = 0;
        this._descContainer.y = this._descMaskRect.y + this._descScrollY;
    }

    // ---- Auto‑select the last active objective ----
    _autoSelectDefaultObjective() {
        if (!this._currentDetails || !this._currentDetails.objectives) return;

        // If we already have a selected objective that exists, keep it.
        var exists = this._objectiveRects.some(function(r) { return r.id === this._selectedObjectiveId; }.bind(this));
        if (exists) return;

        // Find active objectives (state === 1)
        var activeObjectives = this._currentDetails.objectives.filter(function(obj) {
            return obj.state === LOGICPULSE.Constants.Quest.ObjectiveState.Active;
        });

        var targetObj = null;
        if (activeObjectives.length > 0) {
            // Pick the last active objective (by index)
            targetObj = activeObjectives[activeObjectives.length - 1];
        } else {
            // If no active objective, pick the first visible objective (or first overall)
            // We'll pick the first objective that is not inactive, or first overall.
            var visibleObjectives = this._currentDetails.objectives.filter(function(obj) {
                return obj.state !== 0;
            });
            targetObj = visibleObjectives.length > 0 ? visibleObjectives[0] : this._currentDetails.objectives[0];
        }

        if (targetObj) {
            this._selectedObjectiveId = targetObj.id;
            this._selectedObjectiveState = targetObj.state;
        } else {
            this._selectedObjectiveId = null;
        }
    }

    // ---- Update OnScreenHint text and color ----
    _updateHint() {
        if (!this._hintText) return;
        var hint = "";
        var color = "#ff8000";
        var selected = this._objectiveRects.find(function(r) {
            return r.id === this._selectedObjectiveId;
        }.bind(this));

        if (selected) {
            hint = selected.hint || "";
            if (selected.state === LOGICPULSE.Constants.Quest.ObjectiveState.Active) {
                color = "#ffffff";
            } else if (selected.state === LOGICPULSE.Constants.Quest.ObjectiveState.Completed) {
                color = "#44ff44";
            } else if (selected.state === LOGICPULSE.Constants.Quest.ObjectiveState.Failed) {
                color = "#ff4444";
            } else {
                color = "#888888";
            }
        }

        this._hintText.text = hint || "";
        this._hintStyle.fill = color;
        this._hintText.style = this._hintStyle;
    }

    // ---- Click handling ----
    handleClick(mx, my) {
        var containerWorldX = this.x + this._objContainer.x;
        var containerWorldY = this.y + this._objContainer.y;
        var rects = this._objectiveRects;
        for (var i = 0; i < rects.length; i++) {
            var r = rects[i];
            var rectWorldY = containerWorldY + r.y;
            if (mx >= containerWorldX && mx <= containerWorldX + this._objMaskRect.w &&
                my >= rectWorldY && my <= rectWorldY + r.height) {
                this._selectedObjectiveId = r.id;
                this._selectedObjectiveState = r.state;
                this._updateHint();
                return true;
            }
        }
        return false;
    }

    // ---- Mouse wheel ----
    handleWheel(mx, my, delta) {
        var rect = this._objMaskRect;
        var worldX = this.x + rect.x;
        var worldY = this.y + rect.y;
        if (mx >= worldX && mx <= worldX + rect.w &&
            my >= worldY && my <= worldY + rect.h) {
            var maxScroll = Math.max(0, this._objContentHeight - rect.h);
            if (maxScroll > 0) {
                this._objScrollY -= delta * 10;
                this._objScrollY = Math.max(-maxScroll, Math.min(0, this._objScrollY));
                this._objContainer.y = rect.y + this._objScrollY;
                return true;
            }
            return false;
        }

        var descRect = this._descMaskRect;
        var worldX2 = this.x + descRect.x;
        var worldY2 = this.y + descRect.y;
        if (mx >= worldX2 && mx <= worldX2 + descRect.w &&
            my >= worldY2 && my <= worldY2 + descRect.h) {
            var maxScrollDesc = Math.max(0, this._descContentHeight - descRect.h);
            if (maxScrollDesc > 0) {
                this._descScrollY -= delta * 10;
                this._descScrollY = Math.max(-maxScrollDesc, Math.min(0, this._descScrollY));
                this._descContainer.y = descRect.y + this._descScrollY;
                return true;
            }
        }
        return false;
    }
};