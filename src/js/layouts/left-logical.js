import Layout from './layout'
import autoLayout from '../algorithms/auto-layout'

class LeftLogical extends Layout {
  isHorizontal() {
    return true
  }

  doLayout() {
    const root = this.root
    autoLayout(root, true)
    root.right2left()
    return root
  }
}

export default LeftLogical
