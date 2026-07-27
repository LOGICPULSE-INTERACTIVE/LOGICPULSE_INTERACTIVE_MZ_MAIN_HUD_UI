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
    // Quest data – uses game variables (adjust indices to match your project)
    getCaseTitle: function() {
        return $gameVariables.value(1) || "No Case";
    },
    getCaseNumber: function() {
        return $gameVariables.value(2) || "";
    },
    getHint1: function() {
        return $gameVariables.value(3) || "";
    },
    getHint2: function() {
        return $gameVariables.value(4) || "";
    },
    getHint3: function() {
        return $gameVariables.value(5) || "";
    },
    getDescription: function() {
        return $gameVariables.value(6) || "";
    }
};