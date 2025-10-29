/* eslint-disable @typescript-eslint/no-explicit-any */
// import registerLocalePatches from './locale-json-patches.js';
// registerLocalePatches(sc.ui2.runtimeLocaleJsonPatchesLib);

const { jsonPatches } = ccmod.resources;


// jsonPatches.add('data/maps/rookie-harbor/teleporter.json', (data) => {
//     if (ig.currentLang !== 'uk_UA')
//         return;
//     let entity = data.entities.find((ent) => ent.type === 'EventTrigger' && ent.settings.name === 'Entrance Sequence');
//     let tutorialStep = entity.settings.event.find((stp) => stp.type === 'SHOW_TUTORIAL_START');
//     let step = tutorialStep.acceptStep.find((stp) => stp.type === 'SHOW_TUTORIAL_MSG' &&
//         stp.pos.x === 205 &&
//         stp.pos.y === 0 &&
//         stp.size.x === 118 &&
//         stp.size.y === 25);
//     if (step == null)
//         return;
//     step.pos.x = 131;
//     step.size.x = 122;
// });
//# sourceMappingURL=json-patches.js.map