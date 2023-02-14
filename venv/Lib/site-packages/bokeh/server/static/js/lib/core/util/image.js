import { logger } from "../logging";
export async function load_image(url, options) {
    return new ImageLoader(url, options).promise;
}
export class ImageLoader {
    constructor(url, config = {}) {
        this.image = new Image();
        this._finished = false;
        const { attempts = 1, timeout = 1 } = config;
        this.promise = new Promise((resolve, _reject) => {
            this.image.crossOrigin = "anonymous";
            let retries = 0;
            this.image.onerror = () => {
                if (++retries == attempts) {
                    const message = `unable to load ${url} image after ${attempts} attempts`;
                    logger.warn(message);
                    if (this.image.crossOrigin != null) {
                        logger.warn(`attempting to load ${url} without a cross origin policy`);
                        this.image.crossOrigin = null;
                        retries = 0;
                    }
                    else {
                        if (config.failed != null)
                            config.failed();
                        return; // XXX reject(new Error(message))
                    }
                }
                setTimeout(() => this.image.src = url, timeout);
            };
            this.image.onload = () => {
                this._finished = true;
                if (config.loaded != null)
                    config.loaded(this.image);
                resolve(this.image);
            };
            this.image.src = url;
        });
    }
    get finished() {
        return this._finished;
    }
}
ImageLoader.__name__ = "ImageLoader";
//# sourceMappingURL=image.js.map