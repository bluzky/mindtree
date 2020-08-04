import drawLink from './draw-link.js'
import drawNode from './draw-node.js'

/*
{ width: 500, height: 500 }
*/
class Renderer {
    constructor(twoCtx, options) {
        this.two = twoCtx
        this.options = options
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