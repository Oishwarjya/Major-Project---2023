import { AnnularWedge, Annulus, Arc, Bezier, Block, Circle, Ellipse, HArea, HBar, HexTile, Image, ImageRGBA, ImageURL, Line, MultiLine, MultiPolygons, Patch, Patches, Quad, Quadratic, Ray, Rect, Scatter, Segment, Spline, Step, Text, VArea, VBar, Wedge, } from "../models/glyphs";
export class GlyphAPI {
    annular_wedge(...args) {
        return this._glyph(AnnularWedge, ["x", "y", "inner_radius", "outer_radius", "start_angle", "end_angle"], args);
    }
    annulus(...args) {
        return this._glyph(Annulus, ["x", "y", "inner_radius", "outer_radius"], args);
    }
    arc(...args) {
        return this._glyph(Arc, ["x", "y", "radius", "start_angle", "end_angle"], args);
    }
    bezier(...args) {
        return this._glyph(Bezier, ["x0", "y0", "x1", "y1", "cx0", "cy0", "cx1", "cy1"], args);
    }
    block(...args) {
        return this._glyph(Block, ["x", "y", "width", "height"], args);
    }
    circle(...args) {
        return this._glyph(Circle, ["x", "y"], args);
    }
    ellipse(...args) {
        return this._glyph(Ellipse, ["x", "y", "width", "height"], args);
    }
    harea(...args) {
        return this._glyph(HArea, ["x1", "x2", "y"], args);
    }
    hbar(...args) {
        return this._glyph(HBar, ["y", "height", "right", "left"], args);
    }
    hex_tile(...args) {
        return this._glyph(HexTile, ["q", "r"], args);
    }
    image(...args) {
        return this._glyph(Image, ["color_mapper", "image", "x", "y", "dw", "dh"], args);
    }
    image_rgba(...args) {
        return this._glyph(ImageRGBA, ["image", "x", "y", "dw", "dh"], args);
    }
    image_url(...args) {
        return this._glyph(ImageURL, ["url", "x", "y", "w", "h"], args);
    }
    line(...args) {
        return this._glyph(Line, ["x", "y"], args);
    }
    multi_line(...args) {
        return this._glyph(MultiLine, ["xs", "ys"], args);
    }
    multi_polygons(...args) {
        return this._glyph(MultiPolygons, ["xs", "ys"], args);
    }
    patch(...args) {
        return this._glyph(Patch, ["x", "y"], args);
    }
    patches(...args) {
        return this._glyph(Patches, ["xs", "ys"], args);
    }
    quad(...args) {
        return this._glyph(Quad, ["left", "right", "bottom", "top"], args);
    }
    quadratic(...args) {
        return this._glyph(Quadratic, ["x0", "y0", "x1", "y1", "cx", "cy"], args);
    }
    ray(...args) {
        return this._glyph(Ray, ["x", "y", "length"], args);
    }
    rect(...args) {
        return this._glyph(Rect, ["x", "y", "width", "height"], args);
    }
    segment(...args) {
        return this._glyph(Segment, ["x0", "y0", "x1", "y1"], args);
    }
    spline(...args) {
        return this._glyph(Spline, ["x", "y"], args);
    }
    step(...args) {
        return this._glyph(Step, ["x", "y", "mode"], args);
    }
    text(...args) {
        return this._glyph(Text, ["x", "y", "text"], args);
    }
    varea(...args) {
        return this._glyph(VArea, ["x", "y1", "y2"], args);
    }
    vbar(...args) {
        return this._glyph(VBar, ["x", "width", "top", "bottom"], args);
    }
    wedge(...args) {
        return this._glyph(Wedge, ["x", "y", "radius", "start_angle", "end_angle"], args);
    }
    _scatter(args, marker) {
        return this._glyph(Scatter, ["x", "y"], args, marker != null ? { marker } : undefined);
    }
    scatter(...args) {
        return this._scatter(args);
    }
    asterisk(...args) {
        return this._scatter(args, "asterisk");
    }
    circle_cross(...args) {
        return this._scatter(args, "circle_cross");
    }
    circle_dot(...args) {
        return this._scatter(args, "circle_dot");
    }
    circle_x(...args) {
        return this._scatter(args, "circle_x");
    }
    circle_y(...args) {
        return this._scatter(args, "circle_y");
    }
    cross(...args) {
        return this._scatter(args, "cross");
    }
    dash(...args) {
        return this._scatter(args, "dash");
    }
    diamond(...args) {
        return this._scatter(args, "diamond");
    }
    diamond_cross(...args) {
        return this._scatter(args, "diamond_cross");
    }
    diamond_dot(...args) {
        return this._scatter(args, "diamond_dot");
    }
    dot(...args) {
        return this._scatter(args, "dot");
    }
    hex(...args) {
        return this._scatter(args, "hex");
    }
    hex_dot(...args) {
        return this._scatter(args, "hex_dot");
    }
    inverted_triangle(...args) {
        return this._scatter(args, "inverted_triangle");
    }
    plus(...args) {
        return this._scatter(args, "plus");
    }
    square(...args) {
        return this._scatter(args, "square");
    }
    square_cross(...args) {
        return this._scatter(args, "square_cross");
    }
    square_dot(...args) {
        return this._scatter(args, "square_dot");
    }
    square_pin(...args) {
        return this._scatter(args, "square_pin");
    }
    square_x(...args) {
        return this._scatter(args, "square_x");
    }
    star(...args) {
        return this._scatter(args, "star");
    }
    star_dot(...args) {
        return this._scatter(args, "star_dot");
    }
    triangle(...args) {
        return this._scatter(args, "triangle");
    }
    triangle_dot(...args) {
        return this._scatter(args, "triangle_dot");
    }
    triangle_pin(...args) {
        return this._scatter(args, "triangle_pin");
    }
    x(...args) {
        return this._scatter(args, "x");
    }
    y(...args) {
        return this._scatter(args, "y");
    }
}
GlyphAPI.__name__ = "GlyphAPI";
//# sourceMappingURL=glyph_api.js.map