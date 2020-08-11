import Two from 'two.js'
import Style from './style'

const PEM = 18

const DEFAULT_OPTIONS = {
  horizontal_gap: PEM,
  vertical_gap: PEM
}


class Node {
  constructor(data, options = {}, isolated, parent) {
    if (data instanceof Node) return data

    options = Object.assign({}, DEFAULT_OPTIONS, options)
    this.options = options

    this.id = data.id
    this.data = data
    this.content = data.name || data.content
    this.vgap = this.hgap = 0
    this.x = this.y = 0

    /* Next milestone */
    this.style = data["style"] && new Style(data["style"])
    this.shape = null
    this.type = null // box | line
    /* end */

    this.depth = parent == null ? 0 : parent.depth + 1
    this.parent = parent
    this.children = []
    this.className = ""
    this.decideClassName()

    this.width = this.getWidth()
    this.height = this.getHeight()
    this.addGap(options.horizontal_gap, options.vertical_gap)

    if (!isolated && !data.isCollapsed) {
      if (!this.data.isCollapsed) {
        const children = this.data.children || []
        for (const item of children) {
          const child = new Node(item, options, false, this)
          this.children.push(child)
        }

      }
    }
  }

  decideClassName() {
    switch (this.depth) {
      case 0:
        this.className = "root"
        break
      case 1:
        this.className = "main-branch"
        break
      default:
        this.className = "sub-branch"
    }
  }

  getStyle(attribute) {
    let style = this.getStyleObject()
    let value = style.getAttribute(attribute)

    if ((value == "inherit" || value == null) && this.parent != null) {
      return this.parent.getStyle(attribute)
    } else {
      return value
    }
  }

  getStyleObject() {
    if (this.style) {
      return this.style.mergeMissingAttribute(this.getClassStyle())
    } else {
      return this.getClassStyle()
    }

  }

  getClassStyle() {
    return this.options.theme.getClass(this.className)
  }

  clearStyle() {
    this.style = null
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
      return this.getStyle("font-size") * 2.4
    }
    return this.getStyle("font-size") * 1.6
  }

  getWidth() {
    var text = new Two.Text(this.content, 0, 0)
    text.size = this.getStyle("font-size")

    if (this.isRoot()) {
      return text.getBoundingClientRect().width * 1.5 + this.getStyle("font-size") * 1.6
    }
    return text.getBoundingClientRect().width + this.getStyle("font-size") * 1.6
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

    let data = {
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

    if (this.getStyle("shape") == "line") {
      let tmp = {
        right: {
          x: Math.round(x + width / 2),
          y: Math.round(y + height / 2)
        },
        left: {
          x: Math.round(x - width / 2),
          y: Math.round(y + height / 2)
        }
      }
      data = Object.assign({}, data, tmp)
    }

    return data
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
