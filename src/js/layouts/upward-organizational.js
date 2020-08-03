import Layout from './layout'
import autoLayout from '../algorithms/auto-layout'

class UpwardOrganizational extends Layout {
  doLayout() {
    const root = this.root
    autoLayout(root, false)
    root.down2up()
    return root
  }
}

export default UpwardOrganizational
