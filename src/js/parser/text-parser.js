

function parse(text) {
    let lines = text.match(/[^\r\n]+/g);
    let root = null
    let levelStack = []
    let currentLevel = 0

    for (let line of lines) {
        if (root == null) {
            root = {
                content: getContent(line),
                children: []
            }
            levelStack.push({ node: root, level: 0 })
        } else {
            let content = getContent(line)
            let level = getLevel(line)
            let node = {
                content: content,
                children: []
            }

            if (level == 0) {
                break
            }

            let lastIndex = levelStack.length - 1

            while (levelStack[levelStack.length - 1].level > level) {
                levelStack.pop()
                currentLevel -= 1
            }

            if (level != currentLevel) {
                levelStack[levelStack.length - 1].node.children.push(node)
                levelStack.push({ node: node, level: level })
                currentLevel = level
            } else {
                levelStack.pop()
                levelStack[levelStack.length - 1].node.children.push(node)
                levelStack.push({ node: node, level: level })
            }
        }
    }
    console.log(root)
    return {
        root
    }
}

function getLevel(line) {
    line = line.replace(/\t/, "    ")
    let leadingWs = line.match(/^\s*/)
    leadingWs = leadingWs[0] || ""
    return Math.round(leadingWs.length / 4)
}

function getContent(line) {
    line = line.trim()
    line = line.replace(/^[+\-_*]\s*/, "")
    return line
}

export default { parse: parse }