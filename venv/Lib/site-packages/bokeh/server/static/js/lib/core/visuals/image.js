import { VisualProperties, VisualUniforms } from "./visual";
import * as mixins from "../property_mixins";
export class Image extends VisualProperties {
    get doit() {
        const alpha = this.global_alpha.get_value();
        return !(alpha == 0);
    }
    apply(ctx) {
        const { doit } = this;
        if (doit) {
            this.set_value(ctx);
        }
        return doit;
    }
    values() {
        return {
            global_alpha: this.global_alpha.get_value(),
        };
    }
    set_value(ctx) {
        const alpha = this.global_alpha.get_value();
        ctx.globalAlpha = alpha;
    }
}
Image.__name__ = "Image";
export class ImageScalar extends VisualUniforms {
    get doit() {
        const alpha = this.global_alpha.value;
        return !(alpha == 0);
    }
    apply(ctx) {
        const { doit } = this;
        if (doit) {
            this.set_value(ctx);
        }
        return doit;
    }
    values() {
        return {
            global_alpha: this.global_alpha.value,
        };
    }
    set_value(ctx) {
        const alpha = this.global_alpha.value;
        ctx.globalAlpha = alpha;
    }
}
ImageScalar.__name__ = "ImageScalar";
export class ImageVector extends VisualUniforms {
    get doit() {
        const { global_alpha } = this;
        if (global_alpha.is_Scalar() && global_alpha.value == 0)
            return false;
        return true;
    }
    v_doit(i) {
        if (this.global_alpha.get(i) == 0)
            return false;
        return true;
    }
    apply(ctx, i) {
        const doit = this.v_doit(i);
        if (doit) {
            this.set_vectorize(ctx, i);
        }
        return doit;
    }
    values(i) {
        return {
            alpha: this.global_alpha.get(i),
        };
    }
    set_vectorize(ctx, i) {
        const alpha = this.global_alpha.get(i);
        ctx.globalAlpha = alpha;
    }
}
ImageVector.__name__ = "ImageVector";
Image.prototype.type = "image";
Image.prototype.attrs = Object.keys(mixins.Image);
ImageScalar.prototype.type = "image";
ImageScalar.prototype.attrs = Object.keys(mixins.ImageScalar);
ImageVector.prototype.type = "image";
ImageVector.prototype.attrs = Object.keys(mixins.ImageVector);
//# sourceMappingURL=image.js.map