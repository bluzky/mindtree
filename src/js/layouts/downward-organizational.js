import Layout from './layout'
import autoLayout from '../algorithms/auto-layout'

class DownwardOrganizational extends Layout {
  doLayout() {
    const root = this.root
    return autoLayout(root, false)
  }
}

export default DownwardOrganizational
