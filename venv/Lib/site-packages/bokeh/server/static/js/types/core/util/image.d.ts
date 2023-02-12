export declare type Image = HTMLImageElement;
export declare type ImageHandlers = {
    loaded?: (image: Image) => void;
    failed?: () => void;
};
export declare type LoaderOptions = {
    attempts?: number;
    timeout?: number;
};
export declare function load_image(url: string, options?: LoaderOptions): Promise<Image>;
export declare class ImageLoader {
    readonly image: HTMLImageElement;
    promise: Promise<Image>;
    constructor(url: string, config?: ImageHandlers & LoaderOptions);
    private _finished;
    get finished(): boolean;
}
//# sourceMappingURL=image.d.ts.map