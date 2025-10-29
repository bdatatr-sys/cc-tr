"use strict";
ig.module('crosscode-translate.fixes.status-combat-arts')
    .requires('game.feature.menu.gui.status.status-view-combat-arts', 'localize-me.final-locale.ready')
    .defines(() => {
    if (ig.currentLang !== 'uk_UA')
        return;
    sc.StatusViewCombatArtsEntry.inject({
        getConditionType() {
            let conditions = ig.lang.get('sc.gui.menu.status.conditions');
            return `\\i[status-cond-${sc.menu.statusElement}]${conditions[sc.menu.statusElement]}`;
        },
    });
});
//# sourceMappingURL=status-combat-arts.js.map