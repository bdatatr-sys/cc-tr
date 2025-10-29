"use strict";
// NOTE: Most of the commented out code in this file is a brilliant solution to
// the problem of duplicated lang labels in the `meta` object of files in
// `data/enemies/`: the lang labels `meta/species` and `meta/descriptions/*/text`
// are actually contained in `data/database.json` as well, their text values
// are 100% identical, and moreover the database contains more entries, but for
// some reason they are duplicated in the enemies files. But see, apparently the
// source code of the game doesn't contain even a single mention of the word
// `meta`, and the only class which loads those files (`sc.EnemyType`) doesn't
// access either of the duplicate lang labels, but the code I wrote was too
// brilliant, so I decided to keep it in the source tree.
const TRANSLATION_DATA_DIR = 'mod://crosscode-translate/assets/translation-tool/';
const LOCALIZE_ME_PACKS_DIR = `${TRANSLATION_DATA_DIR}localize-me-packs/`;
const LOCALIZE_ME_MAPPING_FILE = `${TRANSLATION_DATA_DIR}localize-me-mapping.json`;

const uaAlphabet = "АБВГҐДЕЄЖЗИІЇЙКЛМНОПРСТУФХЦЧШЩЬЮЯ'"
const UA_FONT_CHARACTERS_FULL = `${uaAlphabet.toUpperCase()}${uaAlphabet.toLowerCase()}`;
const PATCHED_FONT_URLS = [
    'media/font/uk_UA/hall-fetica-bold.png',
    'media/font/uk_UA/hall-fetica-small.png',
    'media/font/uk_UA/tiny.png',
];
// relevant Wikipedia page: https://ru.wikipedia.org/wiki/Падеж#Падежная_система_русского_языка
const LEA_SPELLING_CONVERSION_TABLES = new Map([
    [
        '1',
        new Map([
            ['Лія'],
            ['ЛІЯ'],
            ['Лії'],
            ['ЛІЇ'],
            ['Лії'],
            ['ЛІЇ'],
            ['Лію'],
            ['ЛІЮ'],
            ['Лією'],
            ['ЛІЄЮ'],
            ['Менлія'],
            ['МЕНЛІЯ'],
            ['Менлії'],
            ['МЕНЛІЇ'],
            ['Менлії'],
            ['МЕНЛІЇ'],
            ['Менлію'],
            ['МЕНЛІЮ'],
            ['Менлією'],
            ['МЕНЛІЄЮ'],
        ]),
    ],
]);
const IGNORED_LABELS = new Set([
    '',
    'en_US',
    'LOL, DO NOT TRANSLATE THIS!',
    'LOL, DO NOT TRANSLATE THIS! (hologram)',
    '\\c[1][DO NOT TRANSLATE THE FOLLOWING]\\c[0]',
    '\\c[1][DO NOT TRANSLATE FOLLOWING TEXTS]\\c[0]',
]);
let textFilter = (text) => text;
const leaSpellingTable = LEA_SPELLING_CONVERSION_TABLES.get('0');

localizeMe.add_locale('uk_UA', {
    from_locale: 'en_US',
    map_file: LOCALIZE_ME_MAPPING_FILE,
    url_prefix: LOCALIZE_ME_PACKS_DIR,
    language: {
        en_US: 'Ukrainian',
        de_DE: 'Ukrainisch',
        fr_FR: 'Ukrainien',
        zh_CN: '乌克兰语',
        ja_JP: 'ウクライナ語',
        ko_KR: '우크라이나어',
        uk_UA: 'Українська',
    },
    flag: 'media/font/uk_UA/flag.png',
    missing_cb: (langLabelOrString, dictPath) => {
        if (typeof langLabelOrString === 'string') {
            langLabelOrString = { en_US: langLabelOrString };
        }
        let original = langLabelOrString.en_US;
        // `missing_cb` is called even when the lang label actually contains a
        // corresponding language field. You see, a lot of lang labels were
        // "translated" into French simply by setting their translations to the
        // string "fr_FR". Unfortunately for Satcher, the author of Localize-me
        // and French-CC, this meant that they couldn't reliably detect
        // untranslated lang labels. So, translation is considered missing ONLY
        // AND ONLY IF the translation pack doesn't contain a translation. Which
        // kind of makes my life a bit harder because for now I want to put some
        // assets with localizable strings directly in the repository, before I
        // migrate them to Notabenoid or something else.
        let translated = langLabelOrString.uk_UA;
        if (translated)
            return translated;
        if (original === 'en_US')
            return 'uk_UA';
        // Pattern matches must be ordered by frequency of successful firing when
        // playing the game normally. database.json and gui.en_US.json for instance
        // are read every time the game is booted.
        if (/^database\.json\/areas\/[^/]+\/landmarks\/[^/]+\/teleportQuestion$/.test(dictPath)) {
            return '';
        }
        if (!sc.ua.debug.showUntranslatedStrings)
            return original;
        if (IGNORED_LABELS.has(original.trim())) {
            return original;
        }
        if (/^credits\/[^/]+\.json\/entries\/[^/]+\/names\/[^/]+$/.test(dictPath)) {
            return original;
        }
        return `--${original}`;
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    text_filter: textFilter,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pre_patch_font: async (context) => {
        var _a;
        (_a = context.patchedFonts) !== null && _a !== void 0 ? _a : (context.patchedFonts = {});
        let url = PATCHED_FONT_URLS[context.size_index];
        if (url != null) {
            context.patchedFonts.uk_UA = await sc.ui2.waitForLoadable(new ig.Font(url, context.char_height));
        }
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    patch_base_font: (canvas, context) => {
        let patchedFont = context.patchedFonts.uk_UA;
        if (patchedFont != null) {
            let ctx2d = canvas.getContext('2d');
            for (let i = 0; i < UA_FONT_CHARACTERS_FULL.length; i++) {
                let width = patchedFont.widthMap[i] + 1;
                let rect = context.reserve_char(canvas, width);
                let char = UA_FONT_CHARACTERS_FULL[i];
                context.set_char_pos(char, rect);
                let srcX = patchedFont.indicesX[i];
                let srcY = patchedFont.indicesY[i];
                ctx2d.drawImage(patchedFont.data, srcX, srcY, width, patchedFont.charHeight, rect.x, rect.y, rect.width, rect.height);
            }
        }
        return canvas;
    },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    misc_time_function: () => {
        let date = new Date();
        if (date.getHours() >= 11 && date.getHours() <= 13) {
            return ig.lang.get('sc.gui.misc-time-var.12-00');
        }
        let h = date.getHours().toString();
        let m = date.getMinutes().toString().padStart(2, '0');
        return `${h}:${m}`;
    },
});
//# sourceMappingURL=locale.js.map