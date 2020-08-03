import { BoundingBox, Tree, layout } from 'non-layered-tidy-tree-layout'

class Layout {
  constructor(boundingBox) {
    this.bb = boundingBox
  }

  /**
   * Layout treeData.
   * Return modified treeData and the bounding box encompassing all the nodes.
   * 
   * See getSize() for more explanation.
   */
  layout(treeData) {
    const tree = this.convert(treeData)
    layout(tree)
    const { boundingBox, result } = this.assignLayout(tree, treeData)

    return { result, boundingBox }
  }

  /**
   * Returns Tree to layout, with bounding boxes added to each node.
   */
  convert(treeData, y = 0) {
    if (treeData === null) return null

    const { width, height } = this.bb.addBoundingBox(
      treeData.width,
      treeData.height
    )
    let children = []
    if (treeData.children && treeData.children.length) {
      for (let i = 0; i < treeData.children.length; i++) {
        children[i] = this.convert(treeData.children[i], y + height)
      }
    }

    return new Tree(width, height, y, children)
  }

  /**
   * Assign layout tree x, y coordinates back to treeData,
   * with bounding boxes removed.
   */
  assignCoordinates(tree, treeData) {
    const { x, y } = this.bb.removeBoundingBox(tree.x, tree.y)
    treeData.x = x
    treeData.y = y
    for (let i = 0; i < tree.c.length; i++) {
      this.assignCoordinates(tree.c[i], treeData.children[i])
    }
    return treeData
  }

  /**
   * This function does assignCoordinates and getSize in one pass.
   */
  assignLayout(tree, treeData, box = null) {
    return {
      result: this.assignCoordinates(tree, treeData)
    }
  }
}

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

// node utils
function moveRight(node, delta, isHorizontal) {
  let tx = 0, ty = 0

  if (isHorizontal) {
    ty = delta
  } else {
    tx = delta
  }

  node.translate(tx, ty)
}



function autoLayout(root, isHorizontal) {
  const bb = new BoundingBox(10, 20)
  if (isHorizontal) {
    const layout = new HorizontalLayout(bb)
    const { result, boundingBox } = layout.layout(root)
  } else {
    const layout = new Layout(bb)
    const { result, boundingBox } = layout.layout(root)
  }

  return root
}

export default autoLayout
