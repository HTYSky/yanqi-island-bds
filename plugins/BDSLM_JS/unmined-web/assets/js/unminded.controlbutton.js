class LayerVisbleControl extends ol.control.Control {
    /**
     * @param {Object} [opt_options] Control options.
     */
    constructor(opt_options) {
        let options = opt_options || {};
        let element =  $("<div></div>");
        element.addClass("ol-unselectable");
        element.css({
            // "position": "absolute",
            "flex-direction": "column",
            "display": "flex",
            "right": ".7em",
            "bottom":  "42px",
            "background-color": "unset",
            "position": "absolute",
            "overflow": "hidden", /* 隐藏溢出的内容 */
            "transition": "height 0.2s", /* 平滑过渡效果 */
            "background-color": "#00000099",
            "padding": "2px",
            "border-radius": "5px",
        });
        options.controlButtonList = options.controlButtonList ?? [];

        let isExpanded = true;
        let button = $(`<button type="button" class="layui-btn layui-bg-blue layui-btn-sm">收起</button>`);
        button.attr("id", `btn_layerControl_Expand`);
        element.append(button);

        let labelRow = $('<div style="display:flex;align-items:center;color:#fff;font-size:12px;padding:3px 8px 5px 8px;gap:8px;cursor:pointer;user-select:none;white-space:nowrap;"></div>');
        let labelChk = $('<input type="checkbox" id="bdslm_marker_labels_visible" />');
        let labelSpan = $('<span>文字标签</span>');
        labelRow.append(labelChk).append(labelSpan);
        element.append(labelRow);
        labelRow.on("click", function (e) {
            if (e.target === labelChk[0]) return;
            labelChk.prop("checked", !labelChk.prop("checked")).trigger("change");
        });
        labelChk.on("change", function () {
            if (typeof bdslmSetMarkerLabelsVisible === "function") {
                bdslmSetMarkerLabelsVisible(this.checked);
            }
        });

        for (let [index, buttonConfig] of options.controlButtonList.entries()){
            //element.append($(`<div style="color:white;width:100%;height:3px"><div>`));
            let button = $(`<button type="button" class="layui-btn layui-btn-primary layui-border-green layui-btn-sm"></button>`);
            motdParser.toHtml(buttonConfig["layerName"], function(err, res) {
                if (!err){
                    button.html(`<img src="${buttonConfig["img"]}" alt="图标" style="float: left;  height: 70%; vertical-align: middle; margin-right: 5px;"/>${res}`);
                }else{
                    button.html(`<img src="${buttonConfig["img"]}" alt="图标" style="float: left;  height: 70%; vertical-align: middle; margin-right: 5px;"/>${buttonConfig["layerName"]}`);
                }
            });
            button.attr("id", `btn_${buttonConfig["layerName"]}_${index}`);
            var layerOn = buttonConfig.layerInitiallyVisible !== false;
            button.attr("title", layerOn ? buttonConfig["openTitle"] : buttonConfig["closeTitle"]);
            if (layerOn) {
                button.removeClass("layui-btn-primary layui-btn-sm");
                button.addClass("layui-btn-sm");
            }
            button.attr("style", "align-items: center; display: flex;margin-left: 0px;")
            element.append(button);

            // let button = $("<button></button>");//.html('N');
            // button.attr("id", `btn_${buttonConfig["layerName"]}_${index}`);
            // button.attr("title", buttonConfig["openTitle"]);
            // button.css({
            //     "background": `url(${buttonConfig["img"]}) no-repeat center`,
            //     "background-size": "18px 18px",
            //     "box-shadow": "inset 0px 0px 6px 0px DarkGray",
            //     "background-color": "white"
            // });
            // let div_btn = $("<div></div>");
            // div_btn.addClass("ol-unselectable ol-control");
            // div_btn.css({
            //     "outline": "1px black",
            //     "position": "relative",
            //     //"width": "max-content"
            // });
            // div_btn.append(button);
            // element.append(div_btn);
        }
        super({
            element: element[0],
            target: options.target,
        });
        let that = this;
        $(document).on('click', `#btn_layerControl_Expand`, ()=>buttonExpand());
        for (let [index, buttonConfig] of options.controlButtonList.entries()){
            $(document).on('click', `#btn_${buttonConfig["layerName"]}_${index}`, ()=>buttonClick(index, buttonConfig));
        }
        function buttonExpand(){
            if (isExpanded){
                // $(`#btn_layerControl_Expand`).removeClass("layui-btn layui-bg-blue layui-btn-sm");
                // $(`#btn_layerControl_Expand`).addClass("layui-btn layui-btn-primary layui-border-blue layui-btn-sm");
                element.animate({
                    height: '30px'
                  }, 50); // 500毫秒内完成动画
                  $("#btn_layerControl_Expand").html('展开');
                  isExpanded = false;
            }else{
                // $(`#btn_layerControl_Expand`).removeClass("layui-btn layui-btn-primary layui-border-blue layui-btn-sm");
                // $(`#btn_layerControl_Expand`).addClass("layui-btn layui-bg-blue layui-btn-sm");
                var newHeight = options.controlButtonList.length * 30 + 30 + 26 + 'px';
                element.animate({
                    height: newHeight
                }, 50);
                $("#btn_layerControl_Expand").html('收起');
                isExpanded = true;
            }
        }
        function buttonClick(index, buttonConfig) {
            let map = that.getMap();
            let markersLayer = map.getAllLayers().find(layer=>layer.layerName == buttonConfig["layerName"]);
            if (markersLayer.getVisible()){
                $(`#btn_${buttonConfig["layerName"]}_${index}`).removeClass("layui-btn layui-btn-sm");
                $(`#btn_${buttonConfig["layerName"]}_${index}`).addClass("layui-btn layui-btn-primary  layui-btn-sm");
                $(`#btn_${buttonConfig["layerName"]}_${index}`).attr("title", buttonConfig["closeTitle"]);
                // $(`#btn_${buttonConfig["layerName"]}_${index}`).css({
                //     "box-shadow": "none",
                //     "background-color": "white"
                // });
                markersLayer.setVisible(false);
            }else{
                $(`#btn_${buttonConfig["layerName"]}_${index}`).removeClass("layui-btn layui-btn-primary  layui-btn-sm");
                $(`#btn_${buttonConfig["layerName"]}_${index}`).addClass("layui-btn layui-btn-sm");
                $(`#btn_${buttonConfig["layerName"]}_${index}`).attr("title", buttonConfig["openTitle"]);
                // $(`#btn_${buttonConfig["layerName"]}_${index}`).css({
                //     "box-shadow": "inset 0px 0px 6px 0px DarkGray",
                //     "background-color": "white"
                //     //"background-color": "Gainsboro"
                // });
                markersLayer.setVisible(true);
            }
        }
    }
}