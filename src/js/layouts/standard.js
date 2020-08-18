import Layout from "./layout";
import Node from "../structure/node";
import autoLayout from "../algorithms/auto-layout";

class Standard extends Layout {
  isHorizontal() {
    return true;
  }

  doLayout() {
    const me = this;
    const root = me.root;
    const options = me.options;
    // separate into left and right trees
    const leftTree = new Node(root.data, options, true);
    const rightTree = new Node(root.data, options, true);
    const treeSize = root.children.length;
    const rightTreeSize = Math.round(treeSize / 2);
    for (let i = 0; i < treeSize; i++) {
      const child = root.children[i];
      if (i < rightTreeSize) {
        rightTree.children.push(child);
      } else {
        leftTree.children.push(child);
      }
    }

    leftTree.children.reverse();
    // do layout for left and right trees
    autoLayout(rightTree, true);
    autoLayout(leftTree, true);
    leftTree.right2left();
    // combine left and right trees
    rightTree.translate(leftTree.x - rightTree.x, leftTree.y - rightTree.y);
    // translate root
    root.x = leftTree.x;
    root.y = rightTree.y;
    const bb = root.getBoundingBox();
    if (bb.top < 0) {
      root.translate(0, -bb.top);
    }
    return root;
  }
}

export default Standard;
