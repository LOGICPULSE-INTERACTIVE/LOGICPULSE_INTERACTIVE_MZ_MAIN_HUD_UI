(function() {
    var Assets = LOGICPULSE.Assets;
    var Folders = Assets.Folders;
    var Images = Assets.Images;

    Folders.HUD = "img/LOGICPULSE_INTERACTIVE UI/MAIN HUD UI/";
    Folders.Portrait = Folders.HUD + "Character Live portrait/";
    Folders.CityPicture = Folders.HUD + "City live picture/";

    Images.HUD = {
        Background: "HUD Back Ground",
        TopHeader: "Top Header",
        CaseNotesBox: "Case Notes Box",
        CharacterStatusBox: "Character Status Box",
        QuestBox: "Current Quest Box",
        MapBox: "Map Box",
        PortraitBox: "Portrait Box",
        LeftButtonIdle: "Button Idle",
        LeftButtonHover: "Button Hover",
        ButtonMapIdle: "Button_Map Idle",
        ButtonMapHover: "Button_Map Hover",
        ButtonExitIdle: "Button_Exit Idle",
        ButtonExitHover: "Button_Exit Hover"
    };

    // Load portrait frames – no extension
    Assets.loadPortraitFrames = function(actorId) {
        var frames = [];
        var maxFrames = 151; // change this to match your actual frame count
        for (var i = 1; i <= maxFrames; i++) {
            var padded = String(i).padStart(3, '0');
            frames.push("frame_" + padded);
        }
        return frames;
    };

    // Load city picture components – no extension
    Assets.loadCityComponents = function() {
        var components = {
            main: "City picture",
            overlays: [],
            sky: [],
            lightning:  ["Lightning 1", "Lightning 2", "Lightning 3", "Lightning 4"],
            blink: "Blinks",
            frame: "City Frame"
        };
        for (var i = 1; i <= 14; i++) {
            components.overlays.push("B" + i);
        }
        components.sky.push("S1", "S2");
        return components;
    };
})();