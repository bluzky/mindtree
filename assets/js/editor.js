import Yace from "https://unpkg.com/yace?module";
let text = `
MindTree
	- What? 
		- Javascript library 
		- visualize text as a mindmap
	- Supported format 
		- Indented text 
		- Markdown text (on the roadmap) 
	- Supported layouts 
		- Central 
		- Left 
		- Right 
		- Upward 
		- Downward 
	- Roadmap 
		- Render mindmap from url
		- Save/load mindmap to/from google drive
		- Support theme
		- Support rich content
			- image
			- link
			- emoji`;

const Parser = mindtree.Parsers.TextParser;
const viewer = new mindtree.Viewer("#drawing", {});
const layout = mindtree.MindmapLayouts.Standard;

function highlighter(value) {
    return Prism.highlight(value, Prism.languages.md, "md");
}

const editor = new Yace("#editor", {
    value: text,
    lineNumbers: true,
    highlighter: highlighter,
    plugins: [tabPlugin],
});

function updateMindmap(text) {
    var data = Parser.parse(text);
    var mindMap = new mindtree.MindMap(data.root, layout, {});
    mindMap.build();
    viewer.render(mindMap);
}

updateMindmap(text);
viewer.fitView();
editor.update({ value: text });
editor.textarea.focus();

editor.onUpdate(function (code) {
    updateMindmap(code);
});

function tabPlugin(textareaProps, event) {
    const { value, selectionStart, selectionEnd } = textareaProps;
    const tabCharacter = "    ";

    if (event.type !== "keydown") {
        return;
    }

    // tab
    if (event.keyCode == 9) {
        event.preventDefault();
        if (selectionStart === selectionEnd) {
            const updatedSelection = selectionStart + tabCharacter.length;
            const newValue =
                value.substring(0, selectionStart) +
                tabCharacter +
                value.substring(selectionEnd);

            return {
                value: newValue,
                selectionStart: updatedSelection,
                selectionEnd: updatedSelection,
            };
        }

        const linesBeforeCaret = value.substring(0, selectionStart).split("\n");
        const startLine = linesBeforeCaret.length - 1;
        const endLine = value.substring(0, selectionEnd).split("\n").length - 1;

        return {
            value: value
                .split("\n")
                .map((line, i) => {
                    if (i >= startLine && i <= endLine) {
                        return tabCharacter + line;
                    }

                    return line;
                })
                .join("\n"),
            selectionStart: selectionStart + tabCharacter.length,
            selectionEnd:
                selectionEnd + tabCharacter.length * (endLine - startLine + 1),
        };
    }
}