import Style from "./style"

const DEFAULT_THEME = {
    "background-color": "#fff",
    "classes": {
        "root": {
            "shape": "rounded_rectangle",
            "background-color": "#F6212D",
            "font-size": 28,
            "font-family": "Arial",
            "color": "#fff",
            "line-color": "#333333",
            "line-width": 4
        },
        "main-branch": {
            "shape": "rounded_rectangle",
            "background-color": "#0288D1",
            "font-size": 20,
            "font-family": "Arial",
            "color": "#333",
            "line-color": "inherit",
            "line-width": 2
        },
        "sub-branch": {
            "shape": "rounded_rectangle",
            "background-color": "none",
            "font-size": 14,
            "font-family": "Arial",
            "color": "#333"
        }
    }
}

class Theme {
    constructor(themeObject) {
        let theme = Object.assign({}, DEFAULT_THEME, themeObject || {})
        this.style = new Style(theme)
        this.classes = {}

        for (const className in theme["classes"]) {
            this.classes[className] = new Style(theme.classes[className])
        }
    }

    getClass(className) {
        return this.classes[className]
    }
}

export default Theme