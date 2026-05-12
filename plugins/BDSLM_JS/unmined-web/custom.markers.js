/*

This is a JavaScript file you can edit to add custom markers to the map.
uNmINeD does not overwrite this file during map generation.

Steps:

    1. Edit this file using Notepad or a code editor (do not use document editors like Microsoft Word)
    2. Change the line "isEnabled: false," to "isEnabled: true," to display the markers
    3. Change or remove the example markers
    4. Add your own markers

Marker format:

    {
        x: X coordinate of the marker (in Minecraft block units),
        z: Z coordinate of the marker (in Minecraft block units),
        image: marker image URL to display (in quotes),
        imageScale: scale of the image (e.g. 1 = display full size, 0.5 = display half size),
        imageAnchor: [0.5, 1] means the tip of the pin is at the center-bottom of the image (see OpenLayers documentation for more info),
        text: marker text do display (in quotes),
        textColor: text color in HTML/CSS format (in quotes),
        offsetX: horizontal pixel offset of the text,
        offsetY: vertical pixel offset of the text,
        font: text font in HTML/CSS format (in quotes),
    },

Things to keep in mind:

* There are opening and closing brackets for each marker "{" and "}"
* Property names are case sensitive (i.e. "textColor" is okay, "TextColor" is not)
* There is a comma (",") at the end of each line except the opening brackets ("{")

You can use https://mapmarker.io/editor to generate custom pin images.
Use the imageScale property if the pin image is too large.

*/

UnminedCustomMarkerLayers = {
    isEnabled: true,
    customMarkerLayers: [
        
    ],
    example: [
        // 图层1
        {
            layerName: "qitianshenxiang",
            layerPropertites: {
                minZoom: 3,
                maxZomm: 7,    // 限制仅4、5、6、7级别显示
                zIndex: null,  // 图层顺序
                opacity: 1,    // 透明度
            },
            controlConfig: {
                isEnabled: true,
                img: "assets/ui/svg/PhHouseLineLight.svg",
                openTitle: "自定义标记(开)",
                closeTitle: "自定义标记(关)",
            },
            markers: [
                {
                    "x": 0,
                    "z": 100,
                    "text": "Orange apple",
                    "image": "assets/ui/marker/marker_white.png",
                    "imageRotation": null,
                    "imageAnchor": [0.5, 0.5],
                    "imageScale": 2,  // 图标缩放比例
                    "textColor": "white",
                    "offsetX": 0,
                    "offsetY": 32, // 文字下移像素
                    "font": "bolder 20px Microsoft Yahei",
                    "textAlign": "center",
                    "textJustify": "center",
                    "textPadding": [0,0,0,0],
                    "textStrokeColor": "black",
                    "textStrokeWidth": 1,
                    "textBackgroundColor": null,
                    "textBackgroundStrokeColor": null,
                    "textBackgroundStrokeWidth": 1,
                    "menu": []
                        
                },
                {
                    "x": 0,
                    "z": 0,
                    "text": "风起地",
                    "image": "assets/ui/marker/qitianshenxiang.png",
                    "imageRotation": null,
                    "imageAnchor": [0.5, 0.5],
                    "imageScale": 0.5,  // 图标缩放比例
                    "textColor": "white",
                    "offsetX": 0,
                    "offsetY": 32, // 文字下移像素
                    "font": "bolder 20px Microsoft Yahei",
                    "textAlign": "center",
                    "textJustify": "center",
                    "textPadding": [0,0,0,0],
                    "textStrokeColor": "black",
                    "textStrokeWidth": 1,
                    "textBackgroundColor": null,
                    "textBackgroundStrokeColor": null,
                    "textBackgroundStrokeWidth": 1,
                    "menu": []
                        
                }
            ]
        },

        // 图层2
        {
            layerName: "maodian",
            controlConfig: {
                isEnabled: true,
                img: "assets/ui/marker/maodian.png",
                openTitle: "自定义标记(开)",
                closeTitle: "自定义标记(关)",
            },
            markers: [
                {
                    "x": 100,
                    "z": 0,
                    "text": "铭记之谷",
                    "image": "assets/ui/marker/yiji.png",
                    "imageRotation": null,
                    "imageAnchor": [0.5, 0.5],
                    "imageScale": 0.7,
                    "textColor": "white",
                    "offsetX": 0,
                    "offsetY": 27,
                    "font": "12px Microsoft Yahei",
                    "textAlign": "center",
                    "textJustify": "center",
                    "textPadding": [0,0,0,0],
                    "textStrokeColor": "black",
                    "textStrokeWidth": 1,
                    "textBackgroundColor": null,
                    "textBackgroundStrokeColor": null,
                    "textBackgroundStrokeWidth": 1
                },
                {
                    "x": 100,
                    "z": 100,
                    "text": "石门",
                    "image": "assets/ui/marker/maodian.png",
                    "imageRotation": null,
                    "imageAnchor": [0.5, 0.5],
                    "imageScale": 0.7,
                    "textColor": "white",
                    "offsetX": 0,
                    "offsetY": 27,
                    "font": "12px Microsoft Yahei",
                    "textAlign": "center",
                    "textJustify": "center",
                    "textPadding": [0,0,0,0],
                    "textStrokeColor": "black",
                    "textStrokeWidth": 1,
                    "textBackgroundColor": null,
                    "textBackgroundStrokeColor": null,
                    "textBackgroundStrokeWidth": 1
                }
            ]
        },
    ]
};
