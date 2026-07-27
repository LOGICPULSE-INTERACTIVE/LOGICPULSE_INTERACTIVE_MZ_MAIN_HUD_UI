LOGICPULSE.Scenes.HUD = LOGICPULSE.Scene_HUD;

// Plugin command
var _LOGICPULSE_MAIN_HUD_UI_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    _LOGICPULSE_MAIN_HUD_UI_pluginCommand.call(this, command, args);
    if (command === 'OpenHUD') {
        SceneManager.push(LOGICPULSE.Scene_HUD);
    }
};