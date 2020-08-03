import { Tree } from 'non-layered-tidy-tree-layout'
import Layout from './layout'

class HorizontalLayout extends Layout {
    /**
     * Returns Tree to layout, with bounding boxes added to each node.
     */
    convert(treeData, x = 0) {
        if (treeData === null) return null

        const { width, height } = this.bb.addBoundingBox(
            treeData.height,
            treeData.width
        )
        let children = []
        if (treeData.children && treeData.children.length) {
            for (let i = 0; i < treeData.children.length; i++) {
                children[i] = this.convert(treeData.children[i], x + height)
            }
        }

        return new Tree(width, height, x, children)
    }

    /**
     * Assign layout tree x, y coordinates back to treeData,
     * with bounding boxes removed.
     */
    assignCoordinates(tree, treeData) {
        const { x, y } = this.bb.removeBoundingBox(tree.x, tree.y)
        treeData.x = y
        treeData.y = x
        for (let i = 0; i < tree.c.length; i++) {
            this.assignCoordinates(tree.c[i], treeData.children[i])
        }
        return treeData
    }
}

export default HorizontalLayout