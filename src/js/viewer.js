import Two from "two.js";
import Renderer from "./renderer";

/*
{ width: 500, height: 500 }
*/
class MindmapViewer {
  constructor(selector, options) {
    let el = document.querySelector(selector);
    if (el == null) {
      throw "Invalid selector";
    }

    this.container = el;
    this.width = el.offsetWidth;
    this.height = el.offsetHeight;
    this.two = new Two({ width: this.width, height: this.height }).appendTo(el);
    this.renderer = new Renderer(this.two, options);

    this.scale = 1;
    this.center = {
      x: this.offsetWidth / 2,
      y: this.offsetHeight / 2,
    };
    this.bindMouseEvent();
    this.bindMouseDrag();
    this.mindMap = null;
  }

  setScale(scale) {
    if (scale <= 0) {
      raise("Scale must be greater than 0");
    } else {
      this.scale = scale;
      this.two.scene.scale = this.scale;
      this.two.update();
    }
  }

  render(mindMap) {
    this.mindMap = mindMap;
    this.container.style.backgroundColor = mindMap.theme.style.getAttribute(
      "background-color"
    );
    this.renderer.render(mindMap);
  }

  zoomIn(percent, x = 0, y = 0) {
    this.zoomBy(percent, x, y);
  }

  zoomOut(percent, x = 0, y = 0) {
    this.zoomBy(-percent);
  }

  zoomBy(percent, x = 0, y = 0) {
    let translation = this.two.scene.translation.clone()
    let currentCoord = this.clientToLocalCoord(x, y, this.scale)
    let newScale = this.scale + this.scale * percent
    let newCoord = this.clientToLocalCoord(x, y, newScale)

    let dx = (newCoord.x - currentCoord.x)
    let dy = (newCoord.y - currentCoord.y)
    let newTranslation = this.localToClientCoord(dx, dy, newScale)
    this.two.scene.scale = this.scale = newScale;

    // this.translateBy(-dx, -dy);
    this.two.scene.translation.copy(newTranslation)
    this.two.update();
  }


  clientToLocalCoord(x, y, scale) {
    let translation = this.two.scene.translation.clone()
    let localCoord = new Two.Vector(x, y)
    localCoord.subSelf(translation)
    localCoord.divideScalar(scale)
    return localCoord
  }

  localToClientCoord(x, y, scale) {
    let clientCoord = new Two.Vector(x, y)
    clientCoord.multiplyScalar(scale)
    clientCoord.addSelf(this.two.scene.translation)
    return clientCoord
  }



  centerView() {
    let clientRect = this.mindMap.getBoundingBox();
    let centerX = (clientRect.left + clientRect.width / 2) * this.scale;
    let centerY = (clientRect.top + clientRect.height / 2) * this.scale;
    let clientCenterX = this.width / 2;
    let clientCenterY = this.height / 2;
    let dx = clientCenterX - centerX;
    let dy = clientCenterY - centerY;

    this.two.scene.translation.set(0, 0);
    this.two.scene.translation.set(dx, dy);
  }

  fitView() {
    let clientRect = this.mindMap.getBoundingBox();
    let scaleX = this.width / clientRect.width;
    let scaleY = this.height / clientRect.height;
    this.scale = Math.min(scaleX, scaleY);
    this.two.scene.scale = this.scale;
    this.centerView();
    this.two.update();
  }

  translateBy(dx, dy) {
    this.two.scene.translation.add(dx, dy);
    this.two.update();
  }

  bindMouseEvent() {
    var stage = this.two.renderer.domElement;
    stage.addEventListener("wheel", (e) => {
      e.stopPropagation();
      e.preventDefault();

      const direction = e.deltaY > 0 ? -1 : 1;
      const factor = 0.03;
      const zoom = direction * factor

      let coord = this.getClientCoord(e)
      this.zoomBy(zoom, coord.x, coord.y);
    });

    stage.addEventListener("click", (e) => {
      let coord = this.getClientCoord(e)
      this.clientToLocalCoord(coord.x, coord.y, this.scale)
    })
  }

  getClientCoord(mouseEvent) {
    var obj = mouseEvent.currentTarget || mouseEvent.target
    obj = obj.parentNode;
    var objLeft = 0;
    var objTop = 0;
    var xpos;
    var ypos;

    while (obj.offsetParent) {
      objLeft += obj.offsetLeft;
      objTop += obj.offsetTop;
      obj = obj.offsetParent;
    }
    if (mouseEvent) {
      //FireFox
      xpos = mouseEvent.pageX;
      ypos = mouseEvent.pageY;
    }
    else {
      //IE
      xpos = window.event.x + document.body.scrollLeft - 2;
      ypos = window.event.y + document.body.scrollTop - 2;
    }
    xpos -= objLeft;
    ypos -= objTop;

    return { x: xpos, y: ypos }
  }

  bindMouseDrag() {
    var stage = this.two.renderer.domElement;

    var onDrag = (e) => {
      let dx = e.movementX;
      let dy = e.movementY;
      this.translateBy(dx, dy);
    };

    var onDragEnd = (e) => {
      stage.removeEventListener("mousemove", onDrag);
      stage.removeEventListener("mouseup", onDragEnd);
    };

    stage.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();
      stage.addEventListener("mousemove", onDrag);
      stage.addEventListener("mouseup", onDragEnd);
    });
  }

  getSvgData() {
    let svgText = this.container.innerHTML;
    if (!svgText.match(/xmlns=\"/im)) {
      svgText = svgText.replace(
        "<svg ",
        '<svg xmlns="http://www.w3.org/2000/svg" '
      );
    }

    return svgText;
  }

  downloadDataAsFile(data, filename) {
    var element = document.createElement("a");
    element.setAttribute("href", data);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  exportSvg(filename = "mindmap.svg") {
    this.downloadDataAsFile(
      "data:image/svg+xml;utf8," + encodeURIComponent(this.getSvgData()),
      filename
    );
  }

  exportPng(filename = "mindmap.png") {
    let bb = this.mindMap.getBoundingBox();

    // backup current value
    let scale = this.two.scene.scale;
    let translation = this.two.scene.translation.clone();

    // set svg full size
    this.two.scene.scale = 1;
    this.two.scene.translation.set(0, 0);
    this.two.width = bb.width;
    this.two.height = bb.height;

    // get svg data
    this.two.update();
    let svgText = this.getSvgData();

    // restore original size
    this.two.width = this.width;
    this.two.height = this.height;
    this.two.scene.scale = scale;
    this.two.scene.translation.copy(translation);
    this.two.update();

    let fill = this.mindMap.theme.style.getAttribute("background-color");
    this.svgToPng(svgText, 0, fill).then((data) =>
      this.downloadDataAsFile(data, filename)
    );
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
    var self = this;
    // convert an svg text to png using the browser
    return new Promise(function (resolve, reject) {
      try {
        // can use the domUrl function from the browser
        var domUrl = window.URL || window.webkitURL || window;
        if (!domUrl) {
          throw new Error("(browser doesnt support this)");
        }

        // get original size
        var match = svgText.match(/height=\"(\d+)/m);
        var height = match && match[1] ? parseInt(match[1], 10) : 200;
        var match = svgText.match(/width=\"(\d+)/m);
        var width = match && match[1] ? parseInt(match[1], 10) : 200;

        // it needs a namespace
        if (!svgText.match(/xmlns=\"/im)) {
          svgText = svgText.replace(
            "<svg ",
            '<svg xmlns="http://www.w3.org/2000/svg" '
          );
        }

        // create a canvas element to pass through
        var canvas = document.createElement("canvas");
        canvas.width = width + margin * 2;
        canvas.height = height + margin * 2;
        var ctx = canvas.getContext("2d");

        // make a blob from the svg
        var svg = new Blob([svgText], {
          type: "image/svg+xml;charset=utf-8",
        });

        // create a dom object for that image
        var url = domUrl.createObjectURL(svg);

        // create a new image to hold it the converted type
        var img = new Image();

        // when the image is loaded we can get it as base64 url
        img.onload = function () {
          // draw it to the canvas
          ctx.drawImage(this, margin, margin);

          // if it needs some styling, we need a new canvas
          console.log(fill);
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
        reject("failed to convert svg to png " + err);
      }
    });
  }
}
export default MindmapViewer;
