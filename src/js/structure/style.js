
const DEFAULT_STYLE = {
    // "shape": "rounded-rectangle",
    // "background-color": "#aaaaaa",
    // "color": "#666666",
    // "font-size": 13,
    // "font-weight": 400,
    // "font-style": "normal",
    // "line-color": "inherit",
    // "line-width": 2
}


const snakeToCamel = (str) => str.replace(
    /([-_][a-z])/g,
    (group) => group.toUpperCase()
        .replace('-', '')
        .replace('_', '')
);


class Style {
    constructor(style) {
        style = Object.assign({}, DEFAULT_STYLE, style || {})
        this.shape = style["shape"]
        this.backgroundColor = style["background-color"]

        this.fontSize = style["font-size"]
        this.fontFamily = style["font-size"]
        this.fontWeight = style["font-weight"]
        this.fontStyle = style["font-style"]
        this.color = style["color"]

        this.lineColor = style["line-color"]
        this.lineWidth = style["line-width"]
    }

    mergeMissingAttribute(otherStyle) {
        for (const att in this) {
            if (att in otherStyle && this[att] == null) {
                this[att] = otherStyle[att]
            }
        }
        return this
    }

    getAttribute(name) {
        name = snakeToCamel(name)
        return this[name]
    }
}

export default Style