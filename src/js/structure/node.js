const PEM = 18
const DEFAULT_HEIGHT = PEM * 2
const DEFAULT_GAP = PEM

const DEFAULT_OPTIONS = {
  styles: {
    "font-size": PEM
  },
  horizontal_gap: PEM,
  vertical_gap: PEM,
  getHeight(d) {
    return d.height || DEFAULT_HEIGHT
  },
  getWidth(d) {
    const name = d.name || ' '
    return d.width || (name.split('').length * PEM)
  }
}

function fallbackExecuteOnData(func1, func2, data) {
  if (func1) return func1(data)
  return func2(data)
}

class Node {
  constructor(data, options = {}, isolated, parent) {
    if (data instanceof Node) return data

    options = Object.assign({}, DEFAULT_OPTIONS, options)

    this.id = data.id
    this.data = data
    this.content = data.content
    this.vgap = this.hgap = 0
    this.x = this.y = 0
    this.width = fallbackExecuteOnData(options.getWidth, DEFAULT_OPTIONS.getWidth, data)
    this.height = fallbackExecuteOnData(options.getHeight, DEFAULT_OPTIONS.getHeight, data)
    this.x = this.y = 0

    /* Next milestone */
    this.styles = {}
    this.shape = null
    this.type = null // box | line
    this.className = ""
    /* end */

    this.depth = parent == null ? 0 : parent.depth + 1
    this.parent = parent
    this.children = []

    if (!isolated && !data.isCollapsed) {
      if (!this.data.isCollapsed) {
        const children = this.data.children || []
        for (const item of children) {
          const child = new Node(item, options, false, this)
          this.children.push(child)
        }

      }
    }

    this.addGap(options.horizontal_gap, options.vertical_gap)
  }

  isRoot() {
    return (this.depth === 0)
  }

  addGap(hgap, vgap) {
    this.hgap += hgap
    this.vgap += vgap
    this.width += 2 * hgap
    this.height += 2 * vgap
  }

  eachNode(callback) {

    let nodes = [this]
    let current = null
    while (current = nodes.pop()) {
      callback(current)
      nodes = nodes.concat(current.children)
    }
  }

  getBoundingBox() {
    const bb = {
      left: Number.MAX_VALUE,
      top: Number.MAX_VALUE,
      width: 0,
      height: 0
    }
    this.eachNode(node => {
      bb.left = Math.min(bb.left, node.x)
      bb.top = Math.min(bb.top, node.y)
      bb.width = Math.max(bb.width, node.x + node.width)
      bb.height = Math.max(bb.height, node.y + node.height)
    })
    return bb
  }

  translate(tx = 0, ty = 0) {
    this.eachNode(node => {
      node.x += tx
      node.y += ty
    })
  }

  right2left() {
    const bb = this.getBoundingBox()
    this.eachNode(node => {
      node.x = node.x - (node.x - bb.left) * 2 - node.width
    })
    this.translate(bb.width, 0)
  }

  down2up() {
    const bb = this.getBoundingBox()
    this.eachNode(node => {
      node.y = node.y - (node.y - bb.top) * 2 - node.height
    })
    this.translate(0, bb.height)
  }
}


export default Node  
