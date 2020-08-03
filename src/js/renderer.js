import Two from "two.js"

/*
{ width: 500, height: 500 }
*/
class Renderer {
    constructor(selector, options) {
        let el = document.querySelector(selector)
        if(el == null){
            throw("Invalid selector")
        }
      this.two = new Two(options).appendTo(el)
    }

    render(tree, layout){
        this.tree = tree
        this.layout = layout
    }
}

export default Renderer