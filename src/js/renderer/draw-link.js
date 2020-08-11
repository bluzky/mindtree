import Two from "two.js"

const lineColor = '#999'

function drawLine(a, b, two, isHorizontal = false) {
  if (!isHorizontal) {
    return drawVerticalLink(a, b, two)
  } else {
    return drawHorizontalLink(a, b, two)
  }
}

function drawVerticalLink(a, b, two) {
  let beginNode = a
  let endNode = b
  let startPoint, endPoint


  if (a.y > b.y) {
    beginNode = b
    endNode = a
  }
  startPoint = beginNode.getLinkingPoints().bottom
  endPoint = endNode.getLinkingPoints().top


  if (beginNode.isRoot()) {
    startPoint = beginNode.getCenter()
  }
  if (endNode.isRoot()) {
    endPoint = endNode.getCenter()
  }

  drawSLine(endPoint, startPoint, false, two, a)
}

function drawHorizontalLink(a, b, two) {
  let beginNode = a
  let endNode = b
  let startPoint, endPoint


  if (a.x > b.x) {
    beginNode = b
    endNode = a
  }
  startPoint = beginNode.getLinkingPoints().right
  endPoint = endNode.getLinkingPoints().left


  if (beginNode.isRoot()) {
    startPoint = beginNode.getCenter()
  }
  if (endNode.isRoot()) {
    endPoint = endNode.getCenter()
  }

  drawSLine(endPoint, startPoint, true, two, a)
}

function drawSLine(startPoint, endPoint, isHorizontal, two, style) {
  let anchors = []
  let startAnchor, endAnchor

  if (isHorizontal) {
    startAnchor = { x: Math.round((endPoint.x - startPoint.x) / 2), y: 0 }
    endAnchor = { x: Math.round((startPoint.x - endPoint.x) / 2), y: 0 }
  } else {
    startAnchor = { x: 0, y: Math.round((endPoint.y - startPoint.y) / 2) }
    endAnchor = { x: 0, y: Math.round((startPoint.y - endPoint.y) / 2) }
  }

  anchors.push(new Two.Anchor(startPoint.x, startPoint.y, 0, 0, startAnchor.x, startAnchor.y))
  anchors.push(new Two.Anchor(endPoint.x, endPoint.y, endAnchor.x, endAnchor.y, 0, 0))

  let path = new Two.Path(anchors, false, true)
  path.stroke = style.getStyle("line-color")
  path.linewidth = style.getStyle("line-width")
  path.noFill()
  two.add(path)
}



function drawPoint({ x, y }, two) {
  two.makeCircle(x, y, 5).fill = 'rgb(0, 200, 255)';
}

export default drawLine

