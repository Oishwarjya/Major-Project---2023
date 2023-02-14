export function throttle(func, wait) {
    let timeout = null;
    let request = null;
    let previous = 0;
    let pending = false;
    let resolver;
    const fn = function () {
        return new Promise((resolve, reject) => {
            resolver = resolve;
            const later = function () {
                previous = Date.now();
                timeout = null;
                request = null;
                pending = false;
                try {
                    func();
                    resolve();
                }
                catch (error) {
                    reject(error);
                }
            };
            const now = Date.now();
            const remaining = wait - (now - previous);
            if (remaining <= 0 && !pending) {
                if (timeout != null) {
                    clearTimeout(timeout);
                }
                pending = true;
                request = requestAnimationFrame(later);
            }
            else if (timeout == null && !pending) {
                timeout = setTimeout(() => request = requestAnimationFrame(later), remaining);
            }
            else {
                resolve();
            }
        });
    };
    fn.stop = function () {
        if (timeout != null)
            clearTimeout(timeout);
        if (request != null)
            cancelAnimationFrame(request);
        resolver();
    };
    return fn;
}
//# sourceMappingURL=throttle.js.map