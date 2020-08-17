// import MindmapLayouts from "./layouts"
// import MindMap from "./mindmap"
// import MindMapViewer from './viewer'
// import sample from './sample'
// import { TextParser } from './parser'

// import * as $ from 'jquery'

let text = `
Root

    - branch 1
        +branch 1.1

    - branch 2
        branch 2.1
        * branch 2.2
            branch 2.2.1

    -Branch 3
        - alo
        - ola
        - ollala

    -Branch 4
        - Branch 4.1
            - Branch 4.1.1
        - Branch 4.2
        - Branch 4.3`;

const formNode = document.getElementById("layout-props");
const layoutTimeNode = document.getElementById("layout-time");
const renderTimeNode = document.getElementById("render-time");

const viewer = new mindtree.Viewer("#drawing", {});

function render() {
  const count = formNode.dataSize.value;
  const layoutType = formNode.layoutType.value;
  const MindmapLayout = mindtree.MindmapLayouts[layoutType];
  const test = mindtree.Parsers.TextParser.parse(text);

  const t0 = window.performance.now();
  const mindMap = new mindtree.MindMap(test.root, MindmapLayout, {});
  mindMap.build();
  const t1 = window.performance.now();
  viewer.render(mindMap);
  window.viewer = viewer;
  const t2 = window.performance.now();

  layoutTimeNode.innerHTML = Math.round(t1 - t0);
  renderTimeNode.innerHTML = Math.round(t2 - t1);
}

formNode.addEventListener("change", render);
formNode.addEventListener("submit", (e) => {
  e.preventDefault();
  render();
  return false;
});

function randomGraph() {
  render();
}

window.onresize = () => {
  randomGraph();
};

randomGraph();
