import Yace from "https://unpkg.com/yace?module";
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

const Parser = mindtree.Parsers.TextParser;
const viewer = new mindtree.Viewer("#drawing", {});
const layout = mindtree.MindmapLayouts.Standard;

function highlighter(value) {
  return hljs.highlight("markdown", value).value;
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
