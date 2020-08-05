import Two from 'two.js'

const PEM = 18
const DEFAULT_HEIGHT = PEM * 2

const DEFAULT_OPTIONS = {
  styles: {
    font_size: PEM
  },
  horizontal_gap: PEM,
  vertical_gap: PEM
}


class Node {
  constructor(data, options = {}, isolated, parent) {
    if (data instanceof Node) return data

    options = Object.assign({}, DEFAULT_OPTIONS, options)

    this.id = data.id
    this.data = data
    this.content = data.name
    this.vgap = this.hgap = 0
    this.x = this.y = 0

    /* Next milestone */
    this.styles = options.styles
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

    this.width = this.getWidth()
    this.height = this.getHeight()
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

  getHeight() {
    if (this.isRoot()) {
      return this.styles.font_size * 2.4
    }
    return this.styles.font_size * 1.6
  }

  getWidth() {
    var text = new Two.Text(this.content, 0, 0)
    text.size = this.styles.font_size

    if (this.isRoot()) {
      return text.getBoundingClientRect().width * 1.5 + this.styles.font_size * 1.6
    }
    return text.getBoundingClientRect().width + this.styles.font_size * 1.6
  }



  eachNode(callback) {

    let nodes = [this]
    let current = null
    while (current = nodes.pop()) {
      callback(current)
      nodes = nodes.concat(current.children)
    }
  }

  getBox() {
    return {
      width: Math.floor(this.width - this.hgap * 2),
      height: Math.floor(this.height - this.vgap * 2),
      x: Math.floor(this.x + this.hgap),
      y: Math.floor(this.y - this.vgap)
    }
  }

  getCenter() {
    return {
      x: this.x + this.width / 2,
      y: this.y + this.height / 2
    }
  }

  getLinkingPoints() {
    let { x, y } = this.getCenter()
    let { width, height } = this.getBox()

    return {
      top: {
        x: x,
        y: Math.round(y - height / 2),
      },
      right: {
        x: Math.round(x + width / 2),
        y: y
      },
      bottom: {
        x: x,
        y: Math.round(y + height / 2),
      },
      left: {
        x: Math.round(x - width / 2),
        y: y
      }
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
