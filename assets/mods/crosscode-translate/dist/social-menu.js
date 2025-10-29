"use strict";
ig.module('crosscode-translate.fixes.social-menu')
    .requires('ultimate-localized-ui.fixes.social-menu', 'localize-me.final-locale.ready')
    .defines(() => {
    if (ig.currentLang !== 'uk_UA')
        return;
    sc.SocialEntryButton.prototype.UI2_DRAW_STATUS_AS_TEXT_BLOCK = true;
});
//# sourceMappingURL=social-menu.js.map