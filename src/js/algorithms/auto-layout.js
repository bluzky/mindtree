import { BoundingBox, Layout, Tree, layout } from 'non-layered-tidy-tree-layout'

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

function getMin(node, isHorizontal) {
  let res = isHorizontal ? node.y : node.x
  node.children.forEach(child => {
    res = Math.min(getMin(child, isHorizontal), res)
  })
  return res
}

function normalize(node, isHorizontal) {
  const min = getMin(node, isHorizontal)
  console.log(min)
  moveRight(node, -min, isHorizontal)
}

function convertBack(converted/* Tree */, root/* TreeNode */, isHorizontal) {
  if (isHorizontal) {
    root.y = converted.x
  } else {
    root.x = converted.x
  }
  converted.c.forEach((child, i) => {
    convertBack(child, root.children[i], isHorizontal)
  })
}

function layer(node, isHorizontal, d = 0) {
  if (isHorizontal) {
    node.x = d
    d += node.width
  } else {
    node.y = d
    d += node.height
  }
  node.children.forEach(child => {
    layer(child, isHorizontal, d)
  })
}

function treeFromNode(root, isHorizontal) {
  if (!root) return null
  const children = []
  root.children.forEach((child) => {
    children.push(treeFromNode(child, isHorizontal))
  })
  if (isHorizontal) return new Tree(root.height, root.width, root.x, children)
  return new Tree(root.width, root.height, root.y, children)
}

function autoLayout(root, isHorizontal) {

  const bb = new BoundingBox(10, 20)
  const layout = new Layout(bb)
  const { result, boundingBox } = layout.layout(root)
  // layer(root, isHorizontal)
  // const tree = treeFromNode(root, isHorizontal)
  // layout(tree)
  // convertBack(tree, root, isHorizontal)
  // normalize(root, isHorizontal)

  return root
}

export default autoLayout
