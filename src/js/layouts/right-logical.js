import Layout from './layout'
import autoLayout from '../algorithms/auto-layout'

class RightLogical extends Layout {
  isHorizontal() {
    return true
  }

  doLayout() {
    const root = this.root
    return autoLayout(root, true)
  }
}

export { RightLogical }
