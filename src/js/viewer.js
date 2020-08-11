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

        this.container = el
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

    getSvgData() {
        let svgText = this.container.innerHTML
        if (!svgText.match(/xmlns=\"/mi)) {
            svgText = svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
        }

        return svgText

    }
    exportSvg(filename = "mindmap.svg") {

        var element = document.createElement('a');
        element.setAttribute('href', 'data:image/svg+xml,' + this.getSvgData);
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
    exportPng() {

    }

    /**
    * This function is shamelessly copy from https://sites.google.com/a/mcpher.com/share/Home/excelquirks/gassnips/svgtopng
    * converts an svg string to base64 png using the domUrl
    * @param {string} svgText the svgtext
    * @param {number} [margin=0] the width of the border - the image size will be height+margin by width+margin
    * @param {string} [fill] optionally backgrund canvas fill
    * @return {Promise} a promise to the bas64 png image
    */
    svgToPng(svgText, margin = 0, fill = null) {
        // convert an svg text to png using the browser
        return new Promise(function (resolve, reject) {
            try {
                // can use the domUrl function from the browser
                var domUrl = window.URL || window.webkitURL || window;
                if (!domUrl) {
                    throw new Error("(browser doesnt support this)")
                }

                // figure out the height and width from svg text
                var match = svgText.match(/height=\"(\d+)/m);
                var height = match && match[1] ? parseInt(match[1], 10) : 200;
                var match = svgText.match(/width=\"(\d+)/m);
                var width = match && match[1] ? parseInt(match[1], 10) : 200;
                margin = margin || 0;

                // it needs a namespace
                if (!svgText.match(/xmlns=\"/mi)) {
                    svgText = svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ');
                }

                // create a canvas element to pass through
                var canvas = document.createElement("canvas");
                canvas.width = height + margin * 2;
                canvas.height = width + margin * 2;
                var ctx = canvas.getContext("2d");


                // make a blob from the svg
                var svg = new Blob([svgText], {
                    type: "image/svg+xml;charset=utf-8"
                });

                // create a dom object for that image
                var url = domUrl.createObjectURL(svg);

                // create a new image to hold it the converted type
                var img = new Image;

                // when the image is loaded we can get it as base64 url
                img.onload = function () {
                    // draw it to the canvas
                    ctx.drawImage(this, margin, margin);

                    // if it needs some styling, we need a new canvas
                    if (fill) {
                        var styled = document.createElement("canvas");
                        styled.width = canvas.width;
                        styled.height = canvas.height;
                        var styledCtx = styled.getContext("2d");
                        styledCtx.save();
                        styledCtx.fillStyle = fill;
                        styledCtx.fillRect(0, 0, canvas.width, canvas.height);
                        styledCtx.strokeRect(0, 0, canvas.width, canvas.height);
                        styledCtx.restore();
                        styledCtx.drawImage(canvas, 0, 0);
                        canvas = styled;
                    }
                    // we don't need the original any more
                    domUrl.revokeObjectURL(url);
                    // now we can resolve the promise, passing the base64 url
                    resolve(canvas.toDataURL());
                };

                // load the image
                img.src = url;

            } catch (err) {
                reject('failed to convert svg to png ' + err);
            }
        });
    }
}
export default MindmapViewer    