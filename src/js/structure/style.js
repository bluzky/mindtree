
const DEFAULT_STYLE = {
    "shape": "rounded-rectangle",
    "background-color": "#aaaaaa",
    "color": "#666666",
    "font-size": 13,
    "font-weight": 400,
    "font-style": "normal"
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
    }
    getAttribute(name) {
        name = snakeToCamel(name)
        return this[name]
    }
}

export default Style