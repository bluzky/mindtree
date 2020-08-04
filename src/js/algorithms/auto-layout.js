import { BoundingBox } from 'non-layered-tidy-tree-layout'
import Layout from './layout'
import HorizontalLayout from './horizontal-layout'


function autoLayout(root, isHorizontal) {
  const bb = new BoundingBox(0, 0)
  if (isHorizontal) {
    const layout = new HorizontalLayout(bb)
    layout.layout(root)
  } else {
    const layout = new Layout(bb)
    layout.layout(root)
  }

  return root
}

export default autoLayout
