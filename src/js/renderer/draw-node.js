import randomColor from '../sample/random-color'

const PEM = 18

function drawNode(node, two, scale = 1) {
  const origin = node.data
  const color = randomColor()

  const width = Math.round(node.width - node.hgap * 2)
  const height = Math.round(node.height - node.vgap * 2)
  const x = Math.round(node.x + node.hgap) + width / 2
  const y = Math.round(node.y + node.vgap) + height / 2


  let rect = two.makeRoundedRectangle(x, y, width, height, 3)
  rect.stroke = color
  rect.fill = color


  var text = new Two.Text(origin.name, x, y);
  text.color = '#666'
  text.size = PEM
  two.add(text)

}

export default drawNode

