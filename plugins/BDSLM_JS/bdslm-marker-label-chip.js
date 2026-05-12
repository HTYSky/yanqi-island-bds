/**
 * 地图标记文字标签：圆角半透明背景（Canvas）+ 底层绘制，重启/渲染后由 BDSLM 从插件目录写回。
 * 依赖：OpenLayers 已在页面加载（仅在使用样式函数时需要 ol 全局对象）。
 */
(function (global) {
    var CHIP_CACHE = Object.create(null);
    /** bump 以使浏览器丢弃旧 PNG 缓存（逻辑/绘图变更时递增） */
    var CHIP_RENDER_VER = 8;

    function padNorm(p) {
        if (!Array.isArray(p) || p.length < 4) return [2, 8, 2, 8];
        var t = +p[0], r = +p[1], b = +p[2], l = +p[3];
        if (t === 0 && r === 0 && b === 0 && l === 0) return [2, 8, 2, 8];
        return [t, r, b, l];
    }

    function fontSizePx(font) {
        if (!font || typeof font !== "string") return 12;
        var m = font.match(/(\d+(?:\.\d+)?)\s*px/i);
        return m ? parseFloat(m[1], 10) : 12;
    }

    /** 底板偏深灰黑（保持半透明）；命名颜色供旧 JSON 或未写 rgba 时兜底 */
    var NAMED_RGBA = {
        dimgray: "rgba(32,32,32,0.52)",
        dimgrey: "rgba(32,32,32,0.52)",
        gray: "rgba(42,42,42,0.50)",
        grey: "rgba(42,42,42,0.50)"
    };

    function darkenCh(channel, factor) {
        var n = Number(channel);
        if (!Number.isFinite(n)) n = 0;
        return Math.max(0, Math.min(255, Math.round(n * factor)));
    }

    /**
     * 将配置转为 rgba：RGB 向黑色压一档，alpha 与配置保持一致（不降透明度）。
     */
    function parseFillToRgba(color) {
        if (color === undefined || color === null) return "rgba(32,32,32,0.52)";
        var s = String(color).trim();
        var nk = s.toLowerCase().replace(/\s/g, "");
        if (NAMED_RGBA[nk]) return NAMED_RGBA[nk];

        var CH_DARKEN = 0.62;

        var rgbaM = s.match(/^rgba\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9.]+)\s*\)\s*$/i);
        if (rgbaM) {
            var r = darkenCh(rgbaM[1], CH_DARKEN);
            var gg = darkenCh(rgbaM[2], CH_DARKEN);
            var bb = darkenCh(rgbaM[3], CH_DARKEN);
            var a = parseFloat(rgbaM[4]);
            if (!isFinite(a)) a = 0.52;
            a = Math.min(1, a);
            return "rgba(" + r + "," + gg + "," + bb + "," + a + ")";
        }

        var rgbM = s.match(/^rgb\s*\(\s*([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\s*\)\s*$/i);
        if (rgbM) {
            var r2 = darkenCh(rgbM[1], CH_DARKEN);
            var g2 = darkenCh(rgbM[2], CH_DARKEN);
            var b2 = darkenCh(rgbM[3], CH_DARKEN);
            return "rgba(" + r2 + "," + g2 + "," + b2 + ",0.52)";
        }

        if (/^#([0-9a-f]{8})$/i.test(s)) {
            var h8 = s.slice(1);
            var rr = darkenCh(parseInt(h8.slice(0, 2), 16), CH_DARKEN);
            var g8 = darkenCh(parseInt(h8.slice(2, 4), 16), CH_DARKEN);
            var b8 = darkenCh(parseInt(h8.slice(4, 6), 16), CH_DARKEN);
            var aa = parseInt(h8.slice(6, 8), 16) / 255;
            if (!isFinite(aa)) aa = 0.52;
            aa = Math.min(1, aa);
            return "rgba(" + rr + "," + g8 + "," + b8 + "," + aa + ")";
        }

        if (/^#([0-9a-f]{6})$/i.test(s)) {
            var h = s.slice(1);
            var r6 = darkenCh(parseInt(h.slice(0, 2), 16), CH_DARKEN);
            var g6 = darkenCh(parseInt(h.slice(2, 4), 16), CH_DARKEN);
            var b6 = darkenCh(parseInt(h.slice(4, 6), 16), CH_DARKEN);
            return "rgba(" + r6 + "," + g6 + "," + b6 + ",0.52)";
        }

        return "rgba(32,32,32,0.52)";
    }

    function measureBox(item, font) {
        var pad = padNorm(item.textPadding);
        var c = document.createElement("canvas").getContext("2d");
        c.font = font;
        var tw = Math.ceil(c.measureText(String(item.text || "")).width);
        var sw = item.textStrokeWidth != null ? Number(item.textStrokeWidth) : 0;
        if (!isFinite(sw) || sw < 0) sw = 0;
        tw += Math.ceil(sw * 2);
        var fs = fontSizePx(font);
        var lineH = Math.ceil(fs * 1.22 + sw * 2);
        var w = tw + pad[1] + pad[3];
        var h = lineH + pad[0] + pad[2];
        w = Math.max(w, tw + Math.ceil(fs * 0.35));
        h = Math.max(h, Math.ceil(fs + pad[0] + pad[2]));
        return { w: Math.max(4, Math.round(w)), h: Math.max(4, Math.round(h)) };
    }

    function roundRectPath(ctx, x, y, w, h, r) {
        var rr = Math.min(+r || 0, w / 2, h / 2);
        ctx.beginPath();
        if (typeof ctx.roundRect === "function" && rr > 0) {
            ctx.roundRect(x, y, w, h, rr);
            return;
        }
        if (rr <= 0 || w <= 0 || h <= 0) {
            ctx.rect(x, y, w, h);
            return;
        }
        ctx.moveTo(x + rr, y);
        ctx.lineTo(x + w - rr, y);
        ctx.arcTo(x + w, y, x + w, y + rr, rr);
        ctx.lineTo(x + w, y + h - rr);
        ctx.arcTo(x + w, y + h, x + w - rr, y + h, rr);
        ctx.lineTo(x + rr, y + h);
        ctx.arcTo(x, y + h, x, y + h - rr, rr);
        ctx.lineTo(x, y + rr);
        ctx.arcTo(x, y, x + rr, y, rr);
        ctx.closePath();
    }

    function chipDataUrl(w, h, fillCss, radiusPx) {
        var iw = Math.max(4, Math.round(w));
        var ih = Math.max(4, Math.round(h));
        var key =
            CHIP_RENDER_VER + "\0" + iw + "\0" + ih + "\0" + fillCss + "\0" + radiusPx;
        if (CHIP_CACHE[key]) return CHIP_CACHE[key];
        var canvas = document.createElement("canvas");
        canvas.width = iw;
        canvas.height = ih;
        var ctx = canvas.getContext("2d");
        roundRectPath(ctx, 0, 0, iw, ih, radiusPx);
        ctx.fillStyle = fillCss;
        ctx.fill();
        var url = canvas.toDataURL("image/png");
        CHIP_CACHE[key] = url;
        return url;
    }

    /**
     * 返回 ol.style.Style 或 Style[]。
     * @param {object} ol OpenLayers 命名空间
     * @param {object} item 单条 marker 配置
     * @param {object} [opts]
     * @param {string} [opts.fontFallback]
     * @param {function} [opts.iconScaleFn]  (item) => number
     */
    global.bdslmCreateMarkerStyleArray = function (ol, item, opts) {
        if (!ol || !item) return null;
        opts = opts || {};
        var fontFb = opts.fontFallback || "12px Microsoft Yahei";
        var font = item.font || fontFb;
        var iconScaleFn = opts.iconScaleFn || function (it) {
            var raw = it.imageScale;
            var n = (raw !== undefined && raw !== null && raw !== "") ? Number(raw) : 1;
            return Number.isFinite(n) ? n : 1;
        };

        var styles = [];
        var suppressLabelAndChip = !!opts.suppressLabelAndChip;
        var useChip = !suppressLabelAndChip && !!(item.text && item.textBackgroundColor);

        /** 标记图标单独一层，始终在标签之下 */
        if (item.image) {
            var imgOpts = {
                src: item.image,
                anchor: item.imageAnchor,
                scale: iconScaleFn(item),
                rotation: item.imageRotation,
                rotateWithView: item.imageRotateWithView
            };
            if (item.imageRotation === undefined) delete imgOpts.rotation;
            if (item.imageRotateWithView === undefined) delete imgOpts.rotateWithView;
            styles.push(
                new ol.style.Style({
                    image: new ol.style.Icon(imgOpts)
                })
            );
        }

        /** 圆角底板 + 文字必须在同一 Style：分开多层时 OL 对 Icon/Text 的合成顺序易导致底板与文字错位 */
        if (item.text && !suppressLabelAndChip) {
            var strokeOpt = item.textStrokeColor
                ? new ol.style.Stroke({
                    color: item.textStrokeColor,
                    width: item.textStrokeWidth
                })
                : undefined;
            var ox = Number(item.offsetX) || 0;
            var oy = Number(item.offsetY) || 0;

            if (useChip) {
                var box = measureBox(item, font);
                var radRaw = item.textBackgroundRadius;
                var rad =
                    radRaw !== undefined && radRaw !== null && String(radRaw) !== ""
                        ? Number(radRaw)
                        : 6;
                if (!isFinite(rad) || rad < 0) rad = 6;
                var fill = parseFillToRgba(item.textBackgroundColor);
                var url = chipDataUrl(box.w, box.h, fill, rad);
                /**
                 * OL Icon.displacement：正 Y 为「向上」；Text.offsetY：正 Y 为「向下」。
                 * 二者共用 JSON 里的 offset 时必须对 Icon 的 Y 取反，否则底板与文字会分列在图标两侧。
                 */
                var chipIconOpts = {
                    src: url,
                    anchor: [0.5, 0.5],
                    scale: 1,
                    displacement: [ox, -oy]
                };
                var textOptsChip = {
                    text: item.text,
                    font: font,
                    offsetX: item.offsetX,
                    offsetY: item.offsetY,
                    /** 与 chip Icon 锚点 [0.5,0.5] 对齐：必须以几何点为同一视觉中心 */
                    textBaseline: item.textBaseline != null ? item.textBaseline : "middle"
                };
                if (item.textAlign !== undefined && item.textAlign !== null) {
                    textOptsChip.textAlign = item.textAlign;
                } else {
                    textOptsChip.textAlign = "center";
                }
                if (item.textColor) textOptsChip.fill = new ol.style.Fill({ color: item.textColor });
                if (strokeOpt !== undefined) textOptsChip.stroke = strokeOpt;
                if (item.textJustify !== undefined && item.textJustify !== null)
                    textOptsChip.justify = item.textJustify;

                try {
                    styles.push(
                        new ol.style.Style({
                            image: new ol.style.Icon(chipIconOpts),
                            text: new ol.style.Text(textOptsChip)
                        })
                    );
                } catch (eChip) {
                    styles.push(
                        new ol.style.Style({
                            image: new ol.style.Icon({
                                src: url,
                                anchor: [0.5, 0.5],
                                scale: 1,
                                displacement: [ox, -oy]
                            }),
                            text: new ol.style.Text(textOptsChip)
                        })
                    );
                }
            } else {
                var textOptsPlain = {
                    text: item.text,
                    font: font,
                    offsetX: item.offsetX,
                    offsetY: item.offsetY,
                    padding:
                        item.textPadding != null ? item.textPadding : [2, 4, 2, 4]
                };
                if (item.textColor) textOptsPlain.fill = new ol.style.Fill({ color: item.textColor });
                if (strokeOpt !== undefined) textOptsPlain.stroke = strokeOpt;
                if (item.textAlign !== undefined && item.textAlign !== null)
                    textOptsPlain.textAlign = item.textAlign;
                if (item.textJustify !== undefined && item.textJustify !== null)
                    textOptsPlain.justify = item.textJustify;
                if (item.textBackgroundColor) {
                    textOptsPlain.backgroundFill = new ol.style.Fill({
                        color: item.textBackgroundColor
                    });
                }
                if (item.textBackgroundStrokeColor) {
                    textOptsPlain.backgroundStroke = new ol.style.Stroke({
                        color: item.textBackgroundStrokeColor,
                        width: item.textBackgroundStrokeWidth
                    });
                }
                styles.push(
                    new ol.style.Style({
                        text: new ol.style.Text(textOptsPlain)
                    })
                );
            }
        }

        if (styles.length === 0) return null;
        if (styles.length === 1) return styles[0];
        return styles;
    };
})(typeof window !== "undefined" ? window : this);

/**
 * 须在 unmined.js 之后、custom-openlayers.js 之前执行。
 * 覆盖 Unmined 与全局 createMarkersLayer；图层样式函数配合 localStorage 控制非玩家标记文字显示。
 */
(function bdslmInstallMarkerLabelLayerPatches() {
    if (typeof ol === "undefined" || typeof bdslmCreateMarkerStyleArray !== "function") return;
    var FONT_FB = "12px Microsoft Yahei";
    var root =
        typeof window !== "undefined"
            ? window
            : typeof globalThis !== "undefined"
              ? globalThis
              : this;

    root.bdslmMarkerLabelPeekUid = null;

    /** 默认不显示文字标签；仅当 localStorage 为 "true" 时全局显示（缺省键视为关闭） */
    root.bdslmMarkerLabelsGloballyVisible = function () {
        try {
            var v = localStorage.getItem("bdslm.markerLabels.visible");
            if (v === null || v === "") return false;
            return v === "true";
        } catch (e1) {
            return false;
        }
    };

    root.bdslmSetMarkerLabelsVisible = function (on) {
        try {
            localStorage.setItem("bdslm.markerLabels.visible", on ? "true" : "false");
        } catch (e2) {}
        root.bdslmMarkerLabelPeekUid = null;
        if (typeof root.bdslmRefreshNonPlayerMarkerLayers === "function") {
            root.bdslmRefreshNonPlayerMarkerLayers();
        }
    };

    root.bdslmRefreshNonPlayerMarkerLayers = function () {
        var u = typeof unmined !== "undefined" ? unmined : null;
        var map = u && u.olMap;
        if (!map || !map.getLayers) return;
        map.getLayers().forEach(function (layer) {
            if (!(layer instanceof ol.layer.Vector)) return;
            if (layer.get("bdslmAlwaysShowMarkerLabels")) return;
            layer.changed();
        });
    };

    function bdslmGetFeatureUid(feature) {
        if (!feature) return null;
        if (typeof ol !== "undefined" && ol.util && typeof ol.util.getUid === "function") {
            return ol.util.getUid(feature);
        }
        return feature.ol_uid != null ? feature.ol_uid : null;
    }

    function iconScaleFn(it) {
        if (typeof bdsLMResolvedMarkerIconScale === "function") return bdsLMResolvedMarkerIconScale(it);
        var raw = it.imageScale;
        var n = (raw !== undefined && raw !== null && raw !== "") ? Number(raw) : 1;
        return Number.isFinite(n) ? n : 1;
    }

    function customFontFallback() {
        return typeof BDSLM_MARKER_LABEL_FONT !== "undefined" ? BDSLM_MARKER_LABEL_FONT : FONT_FB;
    }

    function serializeMarkerItem(item) {
        try {
            return JSON.parse(JSON.stringify(item));
        } catch (e3) {
            return item;
        }
    }

    function makeBdslmMarkerLayerStyle(vectorLayer, fontFallbackStr) {
        return function (feature, resolution) {
            var item = feature.get("bdslmMarkerItem");
            if (!item) return null;
            var always = vectorLayer.get("bdslmAlwaysShowMarkerLabels") === true;
            var suppress = false;
            if (!always) {
                var globOn =
                    typeof root.bdslmMarkerLabelsGloballyVisible !== "function" ||
                    root.bdslmMarkerLabelsGloballyVisible();
                var peek =
                    typeof root.bdslmMarkerLabelPeekUid !== "undefined" ? root.bdslmMarkerLabelPeekUid : null;
                var uid = bdslmGetFeatureUid(feature);
                suppress = !globOn && uid !== peek;
            }
            var resolved = bdslmCreateMarkerStyleArray(ol, item, {
                fontFallback: fontFallbackStr,
                iconScaleFn: iconScaleFn,
                suppressLabelAndChip: suppress
            });
            if (resolved) return resolved;
            if (suppress && item.image) {
                var imgOpts = {
                    src: item.image,
                    anchor: item.imageAnchor,
                    scale: iconScaleFn(item),
                    rotation: item.imageRotation,
                    rotateWithView: item.imageRotateWithView
                };
                if (item.imageRotation === undefined) delete imgOpts.rotation;
                if (item.imageRotateWithView === undefined) delete imgOpts.rotateWithView;
                return new ol.style.Style({
                    image: new ol.style.Icon(imgOpts)
                });
            }
            return null;
        };
    }

    function unminedCreateMarkersLayer(markers) {
        var features = [];
        for (var i = 0; i < markers.length; i++) {
            var item = markers[i];
            var feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([item.x, item.z], this.dataProjection, this.viewProjection))
            });
            feature.set("bdslmMarkerItem", serializeMarkerItem(item));
            features.push(feature);
        }
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ features: features })
        });
        vectorLayer.set("bdslmAlwaysShowMarkerLabels", false);
        vectorLayer.setStyle(makeBdslmMarkerLayerStyle(vectorLayer, FONT_FB));
        return vectorLayer;
    }

    function customCreateMarkersLayer(markers, dataProjection, viewProjection, layerPropertites) {
        layerPropertites = layerPropertites || {};
        var features = [];
        for (var i = 0; i < markers.length; i++) {
            var item = markers[i];
            var longitude = item.x;
            var latitude = item.z;
            var feature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], dataProjection, viewProjection))
            });
            feature.set("bdslmMarkerItem", serializeMarkerItem(item));
            features.push(feature);
        }
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({ features: features }),
            ...layerPropertites
        });
        vectorLayer.layerName = layerPropertites.layerName;
        vectorLayer.set(
            "bdslmAlwaysShowMarkerLabels",
            layerPropertites.layerName === "playerMarker"
        );
        vectorLayer.setStyle(makeBdslmMarkerLayerStyle(vectorLayer, customFontFallback()));
        return vectorLayer;
    }

    if (typeof Unmined !== "undefined" && Unmined.prototype) {
        Unmined.prototype.createMarkersLayer = unminedCreateMarkersLayer;
    }
    /** 供 custom-openlayers：全局 function createMarkersLayer 会覆盖 window.createMarkersLayer，必须用独立引用避免栈溢出 */
    root.__bdslmCreateMarkersLayerCore = customCreateMarkersLayer;
    root.createMarkersLayer = customCreateMarkersLayer;

    (function bdslmInstallMarkerLabelPeekClick() {
        function attach(map) {
            if (!map || map.get("bdslmMarkerPeekClickInstalled")) return;
            map.set("bdslmMarkerPeekClickInstalled", true);
            map.on("singleclick", function (evt) {
                var globOff =
                    typeof root.bdslmMarkerLabelsGloballyVisible === "function" &&
                    !root.bdslmMarkerLabelsGloballyVisible();
                if (!globOff) return;

                var found = false;
                map.forEachFeatureAtPixel(
                    evt.pixel,
                    function (feature, layer) {
                        if (!feature.get("bdslmMarkerItem")) return;
                        if (layer && layer.get("bdslmAlwaysShowMarkerLabels")) return;
                        root.bdslmMarkerLabelPeekUid = bdslmGetFeatureUid(feature);
                        found = true;
                        return true;
                    },
                    {
                        hitTolerance: 10,
                        layerFilter: function (layer) {
                            return (
                                layer instanceof ol.layer.Vector &&
                                layer.get("bdslmAlwaysShowMarkerLabels") !== true
                            );
                        }
                    }
                );
                if (!found) {
                    root.bdslmMarkerLabelPeekUid = null;
                }
                root.bdslmRefreshNonPlayerMarkerLayers();
            });
        }
        function tryAttach() {
            var u = typeof unmined !== "undefined" ? unmined : null;
            if (u && u.olMap) {
                attach(u.olMap);
                return true;
            }
            return false;
        }
        if (!tryAttach()) {
            var n = 0;
            var id = setInterval(function () {
                n++;
                if (tryAttach() || n > 400) clearInterval(id);
            }, 25);
        }
    })();

    (function bdslmSyncMarkerLabelCheckboxFromStorage() {
        function sync() {
            var el = document.getElementById("bdslm_marker_labels_visible");
            if (!el || typeof root.bdslmMarkerLabelsGloballyVisible !== "function") return false;
            el.checked = root.bdslmMarkerLabelsGloballyVisible();
            return true;
        }
        if (!sync()) {
            var n = 0;
            var id = setInterval(function () {
                n++;
                if (sync() || n > 200) clearInterval(id);
            }, 25);
        }
    })();
})();
