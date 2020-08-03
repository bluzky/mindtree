import Two from "two.js"
import drawLink from './renderer/draw-line'
import drawNode from './renderer/draw-node'

/*
{ width: 500, height: 500 }
*/
class Renderer {
    constructor(selector, options) {
        let el = document.querySelector(selector)
        if (el == null) {
            throw ("Invalid selector")
        }
        this.two = new Two(options).appendTo(el)
    }

    render(mindMap) {
        this.two.clear()
        mindMap
            .getRootNode()
            .eachNode(node => {
                node.children.forEach(child => {
                    drawLink(node, child, this.two, mindMap.isHorizontalLayout())
                })
                drawNode(node, this.two, 1)
            })
        this.two.update()
    }
}

export default Renderer