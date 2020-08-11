import Node from './structure/node'
import Theme from './structure/theme'


class MindMap {
    constructor(data, layout, options) {
        this.data = data
        this.options = options
        console.log(options)
        this.theme = options["theme"] || new Theme(data["theme"])
        options["theme"] = this.theme
        this.rootNode = new Node(data, options)
        this.layout = new layout(this.rootNode, options)
    }

    build() {
        return this.layout.doLayout()
    }

    getRootNode() {
        return this.rootNode
    }

    isHorizontalLayout() {
        return this.layout.isHorizontal()
    }

    getBoundingBox() {
        return this.rootNode.getBoundingBox()
    }
}

export default MindMap