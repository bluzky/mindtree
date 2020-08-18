# Mindtree

`Mindtree` is a library which helps to visualize your text content as a mind map. Currently, Mindtree support indented text, markdown support is on the road map.

- [Home page]()
- [Installation]()
- [Basic usage]()
- Document - comming soon

## Installation

- Install from npm

`yarn add @bluzky/mindtree`

- Add to your project assets
  Just copy `mindtree.js` to your assets directory

## Basic usage

You have to follow these steps to render a mindmap:

1. Build mind map data represented as a hierarchy tree
2. Which layout you want to render as
3. Build a `Mindmap` object from `data` and `layout`
4. Bind a `Viewer` to a DOM element and render `Mindmap`

### 1. Vanilla javascript

Add this to your html

```html
<script src="mindtree.js"></script>
```

```javascript
var text = `
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

// parse indented text to hierarchy tree
var data = mindtree.Parsers.TextParser.parse(text);
// choose a layout
var MindmapLayout = mindtree.MindmapLayouts.Standard;

// build Mindmap object
var mindMap = new mindtree.MindMap(data.root, MindmapLayout, {});
mindMap.build();

// binding viewer and render
var viewer = new mindtree.Viewer("#drawing", {});
viewer.render(mindMap);
```

### 2. With ES6

Import required classes

```javascript
import { MindMap, Viewer, Parsers, MindmapLayout } from "mindtree";
```

And then follows the same steps as above

## Features

- **Parser** - Indented text

- **Layout** - Standard - RightLogical
  - DownwardOrganizational
  - UpwardOrganizational
  - LeftLogical

## Credits

-     Thanks [leungwensen](https://github.com/leungwensen), This library is inspired by his repo [Mindmap layouts](https://github.com/leungwensen/mindmap-layouts). And I still copy the layout code from his source

- Thanks @stetrevor for his library [non-layered-tidy-tree-layout](https://github.com/stetrevor/non-layered-tidy-tree-layout)

- This project use [two.js](https://two.js.org/) for the rendering mindmap.
