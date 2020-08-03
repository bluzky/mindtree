import Node from './structure/node'


class MindMap {
    constructor(data, layout, options) {
        this.data = data
        this.options = options
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
}

export default MindMap