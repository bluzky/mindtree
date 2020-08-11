import Style from "./style"

const DEFAULT_THEME = {
    "background": "teal",
    "classes": {
        "root": {
            "shape": "rounded_rectangle",
            "background-color": "#F79F1F",
            "font-size": 24,
            "font-family": "Arial",
            "color": "#333",
            "line-color": "#F79F1F",
            "line-width": 4
        },
        "main-branch": {
            "shape": "rounded_rectangle",
            "background-color": "#A3CB38",
            "font-size": 18,
            "font-family": "Arial",
            "color": "#333",
            "line-color": "#A3CB38",
            "line-width": 2
        },
        "sub-branch": {
            "shape": "line",
            "background-color": "#fff",
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