import randomColor from '../sample/random-color'

const PEM = 18

function drawNode(node, ctx) {
  drawBox(node, ctx)
  drawText(node, ctx)
}

function drawBox(node, ctx) {

  const color = randomColor()
  let { width, height } = node.getBox()
  let { x, y } = node.getCenter()

  let rect = ctx.makeRoundedRectangle(x, y, width, height, 3)
  rect.stroke = color
  rect.fill = color
}

function drawText(node, ctx) {
  let { x, y } = node.getCenter()

  var text = new Two.Text(node.content, x, y);
  text.color = '#666'
  text.size = PEM
  ctx.add(text)
}

export default drawNode

