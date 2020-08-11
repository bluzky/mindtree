import randomColor from '../sample/random-color'

function drawNode(node, ctx) {
  drawShape(node, ctx)
  drawText(node, ctx)
}

function drawShape(node, ctx) {
  switch (node.getStyle("shape")) {
    case "line":
      drawLine(node, ctx)
      break
    default:
      drawRoundedRect(node, ctx)

  }
}

function drawRoundedRect(node, ctx) {
  let { width, height } = node.getBox()
  let { x, y } = node.getCenter()
  let rect = ctx.makeRoundedRectangle(x, y, width, height, 3)
  rect.stroke = node.getStyle("background-color")
  rect.fill = node.getStyle("background-color")
}

function drawLine(node, ctx) {
  let linkingPoints = node.getLinkingPoints()
  let line = ctx.makeLine(linkingPoints.left.x, linkingPoints.left.y, linkingPoints.right.x, linkingPoints.right.y)
  let parent = node.parent || node
  line.stroke = parent.getStyle("line-color")
  line.linewidth = parent.getStyle("line-width")
}

function drawText(node, ctx) {
  let { x, y } = node.getCenter()

  var text = new Two.Text(node.content, x, y);
  text.color = node.getStyle("color")
  text.size = node.getStyle("font-size")
  ctx.add(text)
}

export default drawNode

