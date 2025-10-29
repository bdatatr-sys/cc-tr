"use strict";
if (sc.ua.debug == null)
    sc.ua.debug = {};
sc.ua.debug.showUntranslatedStrings = false;
ig.module('crosscode-translate.debug.timer-steps')
    .requires('impact.base.event')
    .defines(() => {
    sc.ua.debug.consoleTimers = new Map();
    ig.EVENT_STEP.CONSOLE_TIME_START = ig.EventStepBase.extend({
        label: '',
        init(settings) {
            this.label = settings.label;
        },
        start() {
            sc.ua.debug.consoleTimers.set(this.label, performance.now());
        },
    });
    ig.EVENT_STEP.CONSOLE_TIME_END = ig.EventStepBase.extend({
        label: '',
        init(settings) {
            this.label = settings.label;
        },
        start() {
            let endTime = performance.now();
            let startTime = sc.ua.debug.consoleTimers.get(this.label);
            if (startTime != null) {
                let delta = endTime - startTime;
                console.log(`${this.label}: ${delta.toFixed(3)}ms`);
                sc.ua.debug.consoleTimers.delete(this.label);
            }
            else {
                console.warn(`Timer '${this.label}' does not exist`);
            }
        },
    });
});
//# sourceMappingURL=debug.js.map