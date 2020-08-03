export default {
    "version": "1.0",
    "author": "Dzung Nguyen",
    "email": "bluesky.1289@gmail.com",
    "theme": "classic",
    "structure": "center",
    "style": {
        "background": "teal",
        "classes": {
            "root": {
                "shape": "rounded_rectangle",
                "background-color": "red",
                "font-size": "10",
                "font-family": "Arial",
                "color": "#333"
            },
            "branch": {
                "shape": "rounded_rectangle",
                "background-color": "red",
                "font-size": "10",
                "font-family": "Arial",
                "color": "#333"
            },
            "sub-node": {
                "shape": "none",
                "background-color": "red",
                "font-size": "10",
                "font-family": "Arial",
                "color": "#333"
            }
        }    
    },
    "root": {
        "content": "Foods",
        "structure": "inherit",
        "class": "root",
        "level": 0,
        "childrend": [
            {
                "content": "vegetable",
                "structure": "inherit",
                "class": "branch",
                "level": 1,
                "style": {
                    "shape": "rounded_rectangle",
                    "background-color": "green",
                    "font-size": "10",
                    "font-family": "Arial",
                    "color": "#fff"
                },
                "childrend": [
                    {
                        "content": "Potato",
                        "level": 2
                    },
                    {
                        "content": "Tomato",
                        "level": 2
                    },
                    {
                        "content": "Green bean",
                        "level": 2
                    },
                    {
                        "content": "Mushroom",
                        "level": 2
                    }
                ]
            },
            {
                "content": "Fruit",
                "structure": "inherit",
                "class": "branch",
                "level": 1,
                "childrend": [
                    {
                        "content": "Mango",
                        "level": 2
                    },
                    {
                        "content": "Guava",
                        "level": 2
                    },
                    {
                        "content": "Banana",
                        "level": 2
                    }
                ]
            },
            {
                "content": "Bean & Nut",
                "structure": "inherit",
                "class": "branch",
                "level": 1,
                "childrend": [
                    {
                        "content": "Red bean",
                        "level": 2
                    },
                    {
                        "content": "Nutella",
                        "level": 2
                    },
                    {
                        "content": "Peanut",
                        "level": 2
                    },
                    {
                        "content": "dog brain",
                        "level": 2
                    }
                ]
            }     
        ]
    }
}