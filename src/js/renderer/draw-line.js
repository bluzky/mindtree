import Two from "two.js"

const lineColor = '#999'

function drawLine(n, c, two, isHorizontal = false, scale = 1) {
  let beginNode = n
  let endNode = c
  let beginX
  let beginY
  let endX
  let endY
  if (isHorizontal) {
    if (n.x > c.x) {
      beginNode = c
      endNode = n
    }
    beginX = Math.round(beginNode.x + beginNode.width - beginNode.hgap)
    beginY = Math.round(beginNode.y + beginNode.height / 2)
    endX = Math.round(endNode.x + endNode.hgap)
    endY = Math.round(endNode.y + endNode.height / 2)
  } else {
    if (n.y > c.y) {
      beginNode = c
      endNode = n
    }
    beginX = Math.round(beginNode.x + beginNode.width / 2)
    beginY = Math.round(beginNode.y + beginNode.height - beginNode.vgap)
    endX = Math.round(endNode.x + endNode.width / 2)
    endY = Math.round(endNode.y + endNode.vgap)
  }
  if (beginNode.isRoot()) {
    beginX = Math.round(beginNode.x + beginNode.width / 2)
    beginY = Math.round(beginNode.y + beginNode.height / 2)
  }
  if (endNode.isRoot()) {
    endX = Math.round(endNode.x + endNode.width / 2)
    endY = Math.round(endNode.y + endNode.height / 2)
  }
  // console.log(`(${beginX}, ${beginY}), (${endX}, ${endY})`)
  let anchors = []

  if (isHorizontal) {
    anchors.push(new Two.Anchor(beginX, beginY, 0, 0, (beginNode.hgap + endNode.hgap) / 2, 0))
    anchors.push(new Two.Anchor(endX, endY, - (beginNode.hgap + endNode.hgap) / 2, 0, 0, 0))
  } else {

    anchors.push(new Two.Anchor(beginX, beginY, 0, 0, 0, (beginNode.vgap + endNode.vgap) / 2))
    anchors.push(new Two.Anchor(endX, endY, 0, - (beginNode.vgap + endNode.vgap) / 2, 0, 0))
  }

  let path = new Two.Path(anchors, false, true)
  path.stroke = lineColor
  two.add(path)
}

export default drawLine

