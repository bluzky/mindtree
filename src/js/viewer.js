import Two from "two.js"
import Renderer from "./renderer"
import "two.js/extras/zui"

/*
{ width: 500, height: 500 }
*/
class MindmapViewer {
    constructor(selector, options) {
        let el = document.querySelector(selector)
        if (el == null) {
            throw ("Invalid selector")
        }

        this.width = el.offsetWidth
        this.height = el.offsetHeight
        this.two = new Two({ width: this.width, height: this.height }).appendTo(el)
        this.renderer = new Renderer(this.two, options)

        this.zui = new Two.ZUI(this.two.scene, el);
        this.zui.addLimits(0.06, 8);


        this.scale = 1
        this.zoom = 0
        this.center = {
            x: this.offsetWidth / 2,
            y: this.offsetHeight / 2
        }
        this.bindMouseEvent()
        this.bindMouseDrag()
        this.mindMap = null
    }

    setScale(scale) {
        if (scale <= 0) {
            raise("Scale must be greater than 0")
        } else {
            this.scale = scale
            this.two.scene.scale = this.scale
            this.two.update()
        }
    }

    render(mindMap) {
        this.mindMap = mindMap
        this.renderer.render(mindMap)
        this.fitView()
    }

    zoomIn(percent, x = 0, y = 0) {
        this.zoomBy(percent, x, y)
    }

    zoomOut(percent, x = 0, y = 0) {
        this.zoomBy(-percent)
    }

    zoomBy(percent, x = 0, y = 0) {
        let dx = x * (this.scale + percent) - x * this.scale
        let dy = y * (this.scale + percent) - y * this.scale
        this.zoom += percent
        // this.setScale(this.zoom / 100)
        // this.zui.zoomBy(percent, x, y)
        this.two.scene.scale = this.scale = 1 + this.zoom

        this.translateBy(-dx, -dy)
        this.two.update()
    }

    centerView() {
        let clientRect = this.mindMap.getBoundingBox()
        let centerX = (clientRect.left + clientRect.width / 2) * this.scale
        let centerY = (clientRect.top + clientRect.height / 2) * this.scale
        let clientCenterX = this.width / 2
        let clientCenterY = this.height / 2
        let dx = clientCenterX - centerX
        let dy = clientCenterY - centerY

        this.two.scene.translation.set(0, 0)
        this.two.scene.translation.set(dx, dy)

    }

    fitView() {
        let clientRect = this.mindMap.getBoundingBox()
        let scaleX = this.width / clientRect.width
        let scaleY = this.height / clientRect.height
        this.scale = Math.min(scaleX, scaleY)
        this.two.scene.scale = this.scale
        this.zoom = this.scale - 1
        this.centerView()
        this.two.update()

    }

    translateBy(dx, dy) {
        // this.zui.translateSurface(dx, dy)
        this.two.scene.translation.add(dx, dy)
        this.two.update()
    }

    bindMouseEvent() {
        var stage = this.two.renderer.domElement;
        stage.addEventListener('wheel', (e) => {

            e.stopPropagation();
            e.preventDefault();

            var dy = e.deltaY / 100;
            this.zoomBy(dy, e.clientX, e.clientY);
        });
    }

    bindMouseDrag() {
        var stage = this.two.renderer.domElement;

        var onDrag = (e) => {
            let dx = e.movementX * this.zui.scale
            let dy = e.movementY * this.zui.scale
            this.translateBy(dx, dy)
        }

        var onDragEnd = (e) => {
            stage.removeEventListener("mousemove", onDrag)
            stage.removeEventListener("mouseup", onDragEnd)
        }

        stage.addEventListener("mousedown", (e) => {
            e.stopPropagation();
            e.preventDefault();
            stage.addEventListener("mousemove", onDrag)
            stage.addEventListener("mouseup", onDragEnd)
        })
    }
}
export default MindmapViewer    