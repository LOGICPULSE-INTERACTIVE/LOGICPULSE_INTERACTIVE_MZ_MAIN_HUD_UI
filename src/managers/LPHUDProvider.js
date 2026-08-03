LOGICPULSE.HUDProvider = {
    getActor: function() {
        return $gameParty.leader();
    },
    getLevel: function() {
        var actor = this.getActor();
        return actor ? actor.level : 0;
    },
    getGold: function() {
        return $gameParty.gold();
    },
    getHp: function() {
        var actor = this.getActor();
        return actor ? actor.hp : 0;
    },
    getMaxHp: function() {
        var actor = this.getActor();
        return actor ? actor.mhp : 0;
    },
    getMp: function() {
        var actor = this.getActor();
        return actor ? actor.mp : 0;
    },
    getMaxMp: function() {
        var actor = this.getActor();
        return actor ? actor.mmp : 0;
    },
    getTp: function() {
        var actor = this.getActor();
        return actor ? actor.tp : 0;
    },
    getMaxTp: function() {
        return 100;
    },
    getAttack: function() {
        var actor = this.getActor();
        return actor ? actor.atk : 0;
    },
    getDefence: function() {
        var actor = this.getActor();
        return actor ? actor.def : 0;
    },
    getAgility: function() {
        var actor = this.getActor();
        return actor ? actor.agi : 0;
    },
    getMagicAttack: function() {
        var actor = this.getActor();
        return actor ? actor.mat : 0;
    },
    getMagicDefence: function() {
        var actor = this.getActor();
        return actor ? actor.mdf : 0;
    },
    getWeapon: function() {
        var actor = this.getActor();
        if (actor) {
            var weapon = actor.weapons()[0];
            return weapon ? weapon.name : "None";
        }
        return "None";
    },
    getShield: function() {
        var actor = this.getActor();
        if (actor) {
            var shield = actor.equips()[1];
            return shield ? shield.name : "None";
        }
        return "None";
    },
    getHead: function() {
        var actor = this.getActor();
        if (actor) {
            var head = actor.equips()[2];
            return head ? head.name : "None";
        }
        return "None";
    },
    getBody: function() {
        var actor = this.getActor();
        if (actor) {
            var body = actor.equips()[3];
            return body ? body.name : "None";
        }
        return "None";
    },
    getAccessory: function() {
        var actor = this.getActor();
        if (actor) {
            var acc = actor.equips()[4];
            return acc ? acc.name : "None";
        }
        return "None";
    },


    // ---- Quest data – priority quest from quest plugin ----
    getPriorityQuest: function() {
        if (!LOGICPULSE.QuestManager) return null;
        return LOGICPULSE.QuestManager.getPriorityQuest();
    },

    getPriorityQuestDetails: function() {
        if (!LOGICPULSE.QuestManager) {
            console.warn('[HUD] QuestManager not available.');
            return null;
        }
        var priority = LOGICPULSE.QuestManager.getPriorityQuest();
        if (!priority) {
            console.log('[HUD] No priority quest set.');
            return null;
        }
        var details = LOGICPULSE.QuestManager.getQuestDetails(priority.chapterId, priority.questId);
        console.log('[HUD] Priority quest details:', details);
        return details;
    },

    getCaseTitle: function() {
        var details = this.getPriorityQuestDetails();
        return details ? details.name : "No Priority Quest";
    },

    getCaseNumber: function() {
        var priority = this.getPriorityQuest();
        if (!priority) return "";
        return "Chapter " + priority.chapterId + " Quest " + priority.questId;
    },

    // ---- Objectives for the scrollable list ----
    getObjectives: function() {
        var details = this.getPriorityQuestDetails();
        if (!details || !details.objectives) return [];
        return details.objectives;
    },

    // ---- Extra note from the on‑screen hint (for the active objective) ----
    getExtraNote: function() {
        var priority = this.getPriorityQuest();
        if (!priority) return null;
        // We need to find which objective is active and has an extra note.
        // If multiple are active, we could show the first one or combine them.
        var details = this.getPriorityQuestDetails();
        if (!details || !details.objectives) return null;
        for (var obj of details.objectives) {
            if (obj.state === LOGICPULSE.Constants.Quest.ObjectiveState.Active) {
                // Check if this objective has an extra note stored
                if (LOGICPULSE.QuestManager) {
                    var note = LOGICPULSE.QuestManager.getOnScreenExtraNote(priority.chapterId, priority.questId, obj.id);
                    if (note) return note;
                }
            }
        }
        return null;
    },

    getDescription: function() {
        var details = this.getPriorityQuestDetails();
        return details ? details.description || "" : "";
    }
};