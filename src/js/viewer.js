import Two from "two.js"
import Renderer from "./renderer"

/*
{ width: 500, height: 500 }
*/
class MindmapViewer {
    constructor(selector, options) {
        let el = document.querySelector(selector)
        if (el == null) {
            throw ("Invalid selector")
        }
        this.two = new Two(options).appendTo(el)
        this.renderer = new Renderer(this.two, options)
    }

    render(mindMap) {
        this.renderer.render(mindMap)
    }
}
export default MindmapViewer    