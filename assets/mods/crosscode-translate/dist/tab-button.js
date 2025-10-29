"use strict";
function createPatch(gameMenuModule, getConstructor, minLargeWidth) {
    ig.module(`crosscode-translate.fixes.tab-button.${gameMenuModule}`)
        .requires(`game.feature.menu.gui.${gameMenuModule}`, 'localize-me.final-locale.ready')
        .defines(() => {
        if (ig.currentLang !== 'uk_UA')
            return;
        getConstructor().prototype.UI2_INCREASE_TAB_BUTTON_WIDTH = minLargeWidth;
    });
}
createPatch('arena.arena-list', () => sc.ArenaCupList, 145);
createPatch('botanics.botanics-list', () => sc.BotanicsListBox, 160);
createPatch('enemies.enemy-list', () => sc.EnemyListBox, 120);
createPatch('lore.lore-list', () => sc.LoreListBoxNew, 120);
createPatch('options.options-list', () => sc.OptionsTabBox, 105);
createPatch('quest-hub.quest-hub-list', () => sc.QuestHubList, 120);
createPatch('quests.quest-tab-list', () => sc.QuestListBox, 120);
createPatch('social.social-list', () => sc.SocialList, 95);
createPatch('trade.trader-list', () => sc.TradersListBox, 160);
//# sourceMappingURL=tab-button.js.map