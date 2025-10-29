/* eslint-disable @typescript-eslint/no-explicit-any */
export default function registerLocalePatches(localePatches) {
    localePatches.patchFile('data/lang/sc/gui.en_US.json', (data) => {
        data = localePatches.mergeObjects(data, {
            labels: {
                options: {
                },
                'misc-time-var': {
                    '12-00': "It's High Noon",
                },
            },
        });
        if (localePatches.isRuntime) {
            data = localePatches.mergeObjects(data, {
                labels: {
                    options: {},
                },
            });
        }
        return data;
    });
    localePatches.patchFile('data/database.json', (data) => {
        if (localePatches.getCurrentLang() !== 'uk_UA')
            return;
        for (let area of Object.values(data.areas)) {
            let { landmarks } = area;
            if (landmarks == null)
                continue;
            for (let landmark of Object.values(landmarks)) {
                if (landmark.teleportQuestion == null && landmark.name != null) {
                    let str = `Teleport to ${localePatches.getLangLabelText(landmark.name, 'en_US')}?`;
                    landmark.teleportQuestion = { en_US: str };
                }
            }
        }
    });
}
//# sourceMappingURL=locale-json-patches.js.map