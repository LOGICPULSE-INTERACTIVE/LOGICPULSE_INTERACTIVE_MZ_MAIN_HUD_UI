LOGICPULSE.HUDLayout = {
    Images: [
        {key: "Background", name: LOGICPULSE.Assets.Images.HUD.Background, x: 0, y: 0},
        {key: "TopHeader", name: LOGICPULSE.Assets.Images.HUD.TopHeader, x: 0, y: 0},
        {key: "CaseNotesBox", name: LOGICPULSE.Assets.Images.HUD.CaseNotesBox, x: 330, y: 530},
        {key: "CharacterStatusBox", name: LOGICPULSE.Assets.Images.HUD.CharacterStatusBox, x: 1009, y: 69},
        {key: "QuestBox", name: LOGICPULSE.Assets.Images.HUD.QuestBox, x: 330, y: 208},
        {key: "MapBox", name: LOGICPULSE.Assets.Images.HUD.MapBox, x: 29, y: 420},
        {key: "PortraitBox", name: LOGICPULSE.Assets.Images.HUD.PortraitBox, x: 8, y: 76},
    ],
    animations: {
        CityPicture: {x: 307, y: 61},
        Portrait: {x: -8, y: 75},
    },
    CharacterStatusBox: {
        Gauges: {
            HP: {x: 50, y: 35, W: 170, H: 20, color: "#15e837", fontSize: 16},
            MP: {x: 50, y: 57, W: 170, H: 20, color: "#0d72b0", fontSize: 16},
            TP: {x: 50, y: 79, W: 170, H: 20, color: "#d32396", fontSize: 16},
        },
        Attack: {x: 25, y: 100, w: 100, h: 20, align: "left", font: "aria bold", fontSize: 16, color: "#dbffe3"},
        Defence: {x: 25, y: 120, w: 100, h: 20, align: "left", font: "Arno Pro", fontSize: 16, color: "#dbffe3"},
        agility: {x: 25, y: 140, w: 100, h: 20, align: "left", font: "Arno Pro", fontSize: 16, color: "#dbffe3"},
        MagicAttack: {x: 25, y: 160, w: 100, h: 20, align: "left", font: "Arno Pro", fontSize: 16, color: "#dbffe3"},
        MagicDefence: {x: 25, y: 180, w: 100, h: 20, align: "left", font: "Arno Pro", fontSize: 16, color: "#dbffe3"},
        Weapon: {x: 125, y: 100, w: 100, h: 20, align: "left", font: "Arno Pro", fontSize: 16, color: "#dbffe3"},
        Shield: {x: 125, y: 120, w: 100, h: 20, align: "left", font: "Arno Pro", fontSize: 16, color: "#dbffe3"},
        Head: {x: 125, y: 140, w: 100, h: 20, align: "left", font: "Arno Pro", fontSize: 16, color: "#dbffe3"},
        Body: {x: 125, y: 160, w: 100, h: 20, align: "left", font: "Arno Pro", fontSize: 16, color: "#dbffe3"},
        Accessory: {x: 125, y: 180, w: 100, h: 20, align: "left", font: "Arno Pro", fontSize: 16, color: "#dbffe3"},
    },
    LeftButtons: {
        Inventory:   {x: 1007, y: 310, width: 270, height: 58, text: "Inventory", textOffsetX: 4, textOffsetY: 0},
        Equipment:   {x: 1007, y: 368, width: 270, height: 58, text: "Equipment", textOffsetX: 4, textOffsetY: 0},
        QuestDB:     {x: 1007, y: 426, width: 270, height: 58, text: "Quest Database", textOffsetX: 4, textOffsetY: 0},
        Skill:       {x: 1007, y: 484, width: 270, height: 58, text: "Skill Database", textOffsetX: 4, textOffsetY: 0},
        SaveLoad:    {x: 1007, y: 542, width: 270, height: 58, text: "Save/Load", textOffsetX: 4, textOffsetY: 0},
        Setting:     {x: 1007, y: 600, width: 270, height: 58, text: "Setting", textOffsetX: 4, textOffsetY: 0},
        Exit:        {x: 1007, y: 658, width: 270, height: 58, text: "Exit Game", textOffsetX: 4, textOffsetY: 0},
    },
    RightButtons: {
        Map: {x: 45, y: 654, width: 237, height: 54, text: "Inspect Map", textOffsetX: -3,  textOffsetY: -2 },
    },
    TopHeaderText: {
        Level: {x: 60, y: 30, w: 120, h: 40, align: "left", fontSize: 18, color: "#89c3fc"},
        LevelValue: {x: 120, y: 30, w: 120, h: 40, align: "left", fontSize: 18, color: "#89e7fc"},
        Gold: {x: 160, y: 30, w: 120, h: 40, align: "left", fontSize: 18, color: "#fcc189"},
        GoldValue: {x: 280, y: 30, w: 120, h: 40, align: "left", fontSize: 18, color: "#ffffff"},
    },
    QuestBox: {
        CaseTitle: {x: 60, y: 5, w: 560, h: 32, align: "left", fontSize: 32, color: "#ff8000"},
        CaseNumber: {x: 405, y: 320, w: 540, h: 32, align: "left", fontSize: 20, color: "#ff8000"},
        Hint1: {x: 415, y: 365, w: 540, h: 32, align: "left", fontSize: 20, color: "#ffffff"},
        Hint2: {x: 415, y: 400, w: 540, h: 32, align: "left", fontSize: 20, color: "#ffffff"},
        Hint3: {x: 415, y: 435, w: 540, h: 32, align: "left", fontSize: 20, color: "#ffffff"},
        Description: {x: 380, y: 540, w: 580, h: 86, align: "left", fontSize: 20, color: "#ffffff"}
    }
};