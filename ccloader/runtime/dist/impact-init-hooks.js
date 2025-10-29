export const callbacks = [];
export function add(callback) {
    callbacks.push(callback);
}
export const namespace = { callbacks, add };
//# sourceMappingURL=impact-init-hooks.js.map