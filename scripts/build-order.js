"use strict";

module.exports = [

    //=========================================================================
    // 1. CORE
    //=========================================================================

    "src/Header.js",
    "src/Version.js",
    "src/Constants.js",

    //=========================================================================
    // 2. BASE MANAGERS (no dependencies)
    //=========================================================================

    "src/managers/LPAssets.js",          // Asset loading
    "src/managers/LPLayout.js",          // Layout definitions

    //=========================================================================
    // 3. Key bindings
    //=========================================================================

    "src/managers/LPBindings.js",        // Key bindings

    //=========================================================================
    // 4. PROVIDER (data layer)
    //=========================================================================

    "src/managers/LPHUDProvider.js",    // PROVIDER (data layer)


    //=========================================================================
    // 5. CONTROLLER (depends on Provider, Input, Bindings)
    //=========================================================================

    "src/managers/LPHUDController.js",  // Tab switching, focus, cart logic


    //=========================================================================
    // 6. UI MAIN Components
    //=========================================================================

    "src/ui/LPHUDPortrait.js",          // Live Portrait Animation
    "src/ui/LPHUDCity.js",              // Live City Animation
    "src/ui/UIHUDButton.js",            // Buttons Logic
    "src/ui/LPHUDStatus.js",            // HUD Status
    "src/ui/LPHUDQuest.js",             //  HUD Quest

    //=========================================================================
    // 7. SCENE (depends on everything)
    //=========================================================================

    "src/scenes/LPHUDScene.js",         // Full HUD scene

    //=========================================================================
    // 8. ENTRY POINT
    //=========================================================================

    "src/Main.js"                        // Plugin entry point

];