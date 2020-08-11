import Style from "./style"

const DEFAULT_THEME = {
    "background": "teal",
    "classes": {
        "root": {
            "shape": "rounded_rectangle",
            "background-color": "red",
            "font-size": "10",
            "font-family": "Arial",
            "color": "#333"
        },
        "main-branch": {
            "shape": "rounded_rectangle",
            "background-color": "red",
            "font-size": "10",
            "font-family": "Arial",
            "color": "#333"
        },
        "sub-branch": {
            "shape": "none",
            "background-color": "red",
            "font-size": "10",
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
            this.classes[className] = new Style(theme["className"])
        }
    }

    getClass(className) {
        return this.classes[className]
    }
}

export default Theme