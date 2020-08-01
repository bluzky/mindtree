import randomTree from './renderer/random-tree'
import drawLink from './renderer/draw-line'
import drawNode from './renderer/draw-node'
import MindmapLayouts from "./minddown"

import Two from "two.js"

// import * as $ from 'jquery'


const formNode = document.getElementById('layout-props')
const layoutTimeNode = document.getElementById('layout-time')
const renderTimeNode = document.getElementById('render-time')

const PEM = 18
const two = new Two({ width: document.body.scrollWidth, height: document.body.scrollHeight }).appendTo(document.getElementById("drawing"));

const HORIZONTAL_LAYOUTS = [
    'LeftLogical',
    'RightLogical',
    'Standard'
]
function isHorizontal(type) {
    return HORIZONTAL_LAYOUTS.indexOf(type) > -1
}



function render() {
    const count = formNode.dataSize.value
    const layoutType = formNode.layoutType.value
    const root = randomTree(count)

    Object.assign(root, {
        isRoot: true
    })


    const MindmapLayout = MindmapLayouts[layoutType]
    const layout = new MindmapLayout(root, {
        getHeight(d) {
            if (d.isRoot) {
                return PEM * 2.4
            }
            return PEM * 1.6
        },
        getWidth(d) {
            var text = new Two.Text(d.name, 0, 0)
            text.size = PEM

            if (d.isRoot) {
                return text.getBoundingClientRect().width * 2 + PEM * 1.6
            }
            return text.getBoundingClientRect().width + PEM * 1.6
        },
        getHGap(d) {
            if (d.isRoot) {
                return PEM * 2
            }
            return Math.round(PEM / 2)
        },
        getVGap(d) {
            if (d.isRoot) {
                return PEM * 2
            }
            return Math.round(PEM / 2)
        }
    })

    const t0 = window.performance.now()

    const rootNode = layout.doLayout()

    const t1 = window.performance.now()

    const scale = 1


    if (two) {
        two.clear()
        rootNode.eachNode(node => {
            node.children.forEach(child => {
                drawLink(node, child, two, isHorizontal(layoutType), scale)
            })
            drawNode(node, two, scale)
        })
    }

    // var anchors = [
    //     new Two.Anchor(30, 30, 0, 0, 60, 0),
    //     new Two.Anchor(150, 160, -60, 0, 0, 0, Two.Commands.curve)
    // ]
    // var path = new Two.Path(anchors, false, true)
    // path.stroke = "#8e44ad";
    // path.linewidth = 3;
    // path.noFill()
    // two.add(path)

    // debug(anchors[1])

    two.update()
    const t2 = window.performance.now()

    layoutTimeNode.innerHTML = Math.round(t1 - t0)
    renderTimeNode.innerHTML = Math.round(t2 - t1)

}

formNode.addEventListener('change', render)
formNode.addEventListener('submit', (e) => {
    e.preventDefault()
    render()
    return false
})

// var radius = 40, editColor = 'rgb(79, 128, 255)';
// function debug(anchor) {

//     var p = two.makeCircle(0, 0, radius / 4);
//     var l = two.makeCircle(0, 0, radius / 4);
//     l.fill = "#fbc531"
//     var r = two.makeCircle(0, 0, radius / 4);
//     r.fill = "#44bd32"

//     p.translation.copy(anchor);
//     l.translation.copy(anchor.controls.left).addSelf(anchor);
//     r.translation.copy(anchor.controls.right).addSelf(anchor);
//     p.noStroke().fill = editColor
//     l.noStroke()
//     r.noStroke();

//     var ll = new Two.Path([
//         new Two.Anchor().copy(p.translation),
//         new Two.Anchor().copy(l.translation)
//     ]);
//     var rl = new Two.Path([
//         new Two.Anchor().copy(p.translation),
//         new Two.Anchor().copy(r.translation)
//     ]);
//     rl.noFill().stroke = ll.noFill().stroke = editColor;

//     var g = two.makeGroup(rl, ll, p, l, r);

//     // letter.add(g);

//     p.translation.bind(Two.Events.change, function () {
//         anchor.copy(this);
//         l.translation.copy(anchor.controls.left).addSelf(this);
//         r.translation.copy(anchor.controls.right).addSelf(this);
//         ll.vertices[0].copy(this);
//         rl.vertices[0].copy(this);
//         ll.vertices[1].copy(l.translation);
//         rl.vertices[1].copy(r.translation);
//     });
//     l.translation.bind(Two.Events.change, function () {
//         anchor.controls.left.copy(this).subSelf(anchor);
//         ll.vertices[1].copy(this);
//     });
//     r.translation.bind(Two.Events.change, function () {
//         anchor.controls.right.copy(this).subSelf(anchor);
//         rl.vertices[1].copy(this);
//     });

//     // Update the renderer in order to generate the actual elements.
//     two.update();

//     // Add Interactivity
//     addInteractivity(p);
//     addInteractivity(l);
//     addInteractivity(r);

// }

// function addInteractivity(shape) {

//     var offset = Two.Vector.add(shape.parent.parent.translation, shape.parent.translation);

//     var drag = function (e) {
//         e.preventDefault();
//         var x = e.clientX - offset.x;
//         var y = e.clientY - offset.y;
//         shape.translation.set(x, y);
//     };
//     var touchDrag = function (e) {
//         e.preventDefault();
//         var touch = e.originalEvent.changedTouches[0];
//         drag({
//             preventDefault: function () { },
//             clientX: touch.pageX,
//             clientY: touch.pageY
//         });
//         return false;
//     };
//     var dragEnd = function (e) {
//         e.preventDefault();
//         $(window)
//             .unbind('mousemove', drag)
//             .unbind('mouseup', dragEnd);
//     };
//     var touchEnd = function (e) {
//         e.preventDefault();
//         $(window)
//             .unbind('touchmove', touchDrag)
//             .unbind('touchend', touchEnd);
//         return false;
//     };

//     $(shape._renderer.elem)
//         .css({
//             cursor: 'pointer'
//         })
//         .bind('mousedown', function (e) {
//             e.preventDefault();
//             $(window)
//                 .bind('mousemove', drag)
//                 .bind('mouseup', dragEnd);
//         })
//         .bind('touchstart', function (e) {
//             e.preventDefault();
//             $(window)
//                 .bind('touchmove', touchDrag)
//                 .bind('touchend', touchEnd);
//             return false;
//         });

// }


function fitView(two) {
    let viewWidth = two.width - 30
    let canvasWidth = two.scene.getBoundingClientRect().width
    two.scene.scale = Math.floor(viewWidth / canvasWidth * 100) / 100
    two.update()
}

function randomGraph() {
    render()
    fitView(two)
}


window.onresize = () => {
    randomGraph()
}

randomGraph()






