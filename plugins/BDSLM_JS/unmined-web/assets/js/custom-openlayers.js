let {olMap, options, dataProjection, viewProjection} = unmined;

const BDSLM_MARKER_LABEL_FONT = "12px Microsoft Yahei";


// 滑动控制条显示当前缩放级别
// olMap.on("moveend",function(e){
//     var zoom = olMap.getView().getZoom();  //获取当前地图的缩放级别
//     $(".ol-zoomslider button").text(String(zoom.toFixed(0)));
// });

// 网页聊天
if (options?.webChat?.isEnabled){
    $("#message-box").show();
    let isDisplayHistory = false;
    let logTimeDate = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
            2,
            "0"
        )}-${String(date.getDate()).padStart(2, "0")}`;
    let logTime = (date) =>
        `${String(date.getHours()).padStart(2, "0")}:${String(
            date.getMinutes()
        ).padStart(2, "0")}:${String(date.getSeconds()).padStart(
            2,
            "0"
        )}`;
    let lastRefeshTime = -1;
    let inputSystem = 0;

    //====================
    //====================
    // 调试
    // let msgs = [];
    // msgs = [{ "type": "onJoin", "realName": "Wn1027", "msg": "", "sendTime": 1715946508377 }, { "type": "chat", "realName": "Wn1027", "msg": "fsdf发射点发射点发撒旦发射的说法是", "sendTime": 1715946512929 }, { "type": "chat", "realName": "Wn1027", "msg": "艾弗森顶顶顶顶顶反反复复烦烦烦烦烦烦烦烦烦", "sendTime": 1715946513128 }, { "type": "chat", "realName": "Wn1027", "msg": "f", "sendTime": 1715946513269 }, { "type": "chat", "realName": "Wn1027", "msg": "昂贵的地方烦烦烦烦烦烦烦烦烦烦烦烦", "sendTime": 1715946513425 }, { "type": "chat", "realName": "Wn1027", "msg": "f", "sendTime": 1715946513570 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946518428 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946518598 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946518730 }, { "type": "chat", "realName": "Wn1027", "msg": "dd", "sendTime": 1715946519170 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946522283 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946522437 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946522614 }, { "type": "chat", "realName": "Wn1027", "msg": "dd", "sendTime": 1715946523029 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946523198 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946523321 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946523446 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946523608 }, { "type": "chat", "realName": "Wn1027", "msg": "dd", "sendTime": 1715946523906 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946524157 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946524319 }, { "type": "chat", "realName": "Wn1027", "msg": "d", "sendTime": 1715946524423 }, { "type": "chat", "realName": "Wn1027", "msg": "as", "sendTime": 1715946528501 }, { "type": "chat", "realName": "Wn1027", "msg": "das", "sendTime": 1715946528819 }, { "type": "chat", "realName": "Wn1027", "msg": "da", "sendTime": 1715946528971 }, { "type": "chat", "realName": "Wn1027", "msg": "sd", "sendTime": 1715946529173 }, { "type": "chat", "realName": "Wn1027", "msg": "asd", "sendTime": 1715946529341 }, { "type": "chat", "realName": "Wn1027", "msg": "asd", "sendTime": 1715946529634 }, { "type": "chat", "realName": "Wn1027", "msg": "ger", "sendTime": 1715946530106 }, { "type": "chat", "realName": "Wn1027", "msg": "ydfg", "sendTime": 1715946530492 }, { "type": "chat", "realName": "Wn1027", "msg": "dhg", "sendTime": 1715946530821 }, { "type": "chat", "realName": "Wn1027", "msg": "fhrt", "sendTime": 1715946531131 }, { "type": "chat", "realName": "Wn1027", "msg": "h", "sendTime": 1715946531380 }, { "type": "onLeft", "realName": "Wn1027", "msg": "", "sendTime": 1715946578046 }]
    // msgs = msgs.concat(msgs);
    // for (let i = 0; i < msgs.length; i++) {
    //     console.log("123 ", i)
    //     let chatObj = msgs[i];
    //     let str = buildChatMsg(chatObj)
    //     // 添加到历史消息
    //     let p = $("<p></p>").text(str);
    //     motdParser.toHtml(p.html(), function (err, res) {
    //         if (!err) {
    //             p.html(res);
    //             p.children(".mc").children("span").attr('title', `发送于 ${logTimeDate(new Date(chatObj.sendTime))} ${logTime(new Date(chatObj.sendTime))}`);
    //         } else {
    //             p.text(str);
    //             p.attr('title', `发送于 ${logTimeDate(new Date(chatObj.sendTime))} ${logTime(new Date(chatObj.sendTime))}`);
    //         }
    //     });
    //     $("#message-history").append(p);
    //     // 更新最后消息
    //     $("#message-lastmsg").empty();
    //     $("#message-lastmsg").append(p.clone());
    // }
    // lastRefeshTime = msgs[msgs.length - 1].sendTime;
    // $("#message-history").scrollTop($("#message-history").prop('scrollHeight'));
    //====================
    //====================

    // 收回历史消息
    $(document).on("click", function (event) {
        if (!isDisplayHistory) {
            return;
        }
        if ($(event.target).closest("#message-box").length == 0) {
            // 隐藏历史消息
            $("#message-history-container").slideUp("fast");
            // 隐藏输入框
            $("#message-input-container").hide();
            // 显示最后消息
            $("#message-lastmsg").show();
            isDisplayHistory = false;
            inputSystem = 0;
            return;
        }
    });

    // 显示历史消息并显示输入框
    $("#message-lastmsg").on("click", (event) => {
        if (window.innerWidth < 768) {
            // 小屏需两次才能唤起输入法
            if (inputSystem < 2) {
                inputSystem++;
            }
            if (inputSystem == 2) {
                $("#message-input").focus();
            }
        }

        if (isDisplayHistory) {
            return;
        }
        // 隐藏最后消息
        $("#message-lastmsg").hide();
        // 显示输入框
        $("#message-input-container").show();
        if (window.innerWidth >= 768) {
            $("#message-input").focus();
        }
        // 显示历史消息
        $("#message-history-container").slideDown("fast");
        $("#message-history").scrollTop(
            $("#message-history").prop("scrollHeight")
        );
        // 防抖
        setTimeout(() => {
            isDisplayHistory = true;
        }, 100);
    });

    // 选项卡
    $("#message-navbar div").on("click", function (event) {
        // 获取点击元素的 data-target 属性值
        const targetId = $(this).data('target');
        // 隐藏所有显示容器
        $(".message-display-container > div").hide();
        // 显示对应的容器
        $(`#${targetId}`).show();
        // 设置当前点击元素的样式
        $(this).css({
            'background-color': '#000',
            'color': '#fff'
        });
        // 设置其他元素的样式
        $(this).siblings('div').css({
            'background-color': '#fff',
            'color': '#000'
        });
    });
    
    // 获取聊天消息
    let isFetchingMessage = false;
    setInterval(getMessage, 1000);
    function getMessage(){
        if (isFetchingMessage){return;}
        isFetchingMessage = true;
        $.get(
            "/api/chat/fetch",
            { lastRefeshTime: lastRefeshTime },
            (data) => {
                if (data == undefined || data?.length == 0) {
                    isFetchingMessage = false;
                    return;
                }
                for (let i = 0; i < data.length; i++) {
                    let chatObj = data[i];
                    let str = buildChatMsg(chatObj);
                    // 添加到历史消息
                    let p = buildMClog_p(str);
                    $("#message-history").append(p);
                    // 更新最后消息
                    $("#message-lastmsg").empty();
                    $("#message-lastmsg").append(p.clone());
                }
                lastRefeshTime = data[data.length - 1].sendTime;
                $("#message-history").scrollTop(
                    $("#message-history").prop("scrollHeight")
                );
                isFetchingMessage = false;
            }
        ).fail(() => {
            isFetchingMessage = false;
        });
    }

    // 登录
    let loginStatus = false;
    $("#login-button").on("click", () => {
        let username = $("#username").val().trim();
        let password = $("#password").val();
        let remember = $("#remember-me").is(":checked");
        if (username == "") {
            $("#username").prop("placeholder", "XboxID不能为空");
            return;
        }
        if (password == "") {
            $("#password").prop("placeholder", "密码不能为空");
            return;
        }
        $.post(
            "/api/login",
            { username: username, password: password, remember: remember}, 
            (data) => {
                if (data.code == 0) {
                    loginSuccess(data)
                    if (remember) {
                        localStorage.setItem('rememberUser', 'true');
                    } 
                }
                else {
                    alert(data.message);
                }
            }
        );
    })
    // 自动登录
    function autoLogin() {
        $.get('/api/check-auth', data => {
            if (data.code === 0) {
                loginSuccess(data)
            }
        });
    }
    // 页面加载时自动登录
    $(document).ready(() => {
        setTimeout(autoLogin, 500);
    });
    let heartbeatInterval;
    function loginSuccess(data) {
        loginStatus = true;
        $("#login-form").hide();
        $("#login-status").show();
        $("#login-status-str").html(buildMClog_p(`§e欢迎回来~ §a${data.data.username}`));
        fetchWebOnline();
        heartbeatInterval = setInterval(() => {
            fetch('/api/heartbeat')
                .catch(() => console.log('心跳检测失败'));
        }, 50 * 1000);
    }
    
    // 退出登录
    $("#logout-button").on("click", () => {
        loginStatus = false;
        $.post('/api/logout', () => {
            localStorage.removeItem('rememberUser');
            clearInterval(heartbeatInterval);
            $("#login-form").show();
            $("#login-status-str").empty();
            $("#login-status").hide();
            fetchWebOnline();
        });
    })

    // 获取玩家列表与网页在线
    let playerListTemp = []; 
    function fetchPlayerList(){
        $.get(
            "/api/playerlist",
            {},
            (data) => {
                if (data == undefined) {return;} 
                if (data.join(',')==playerListTemp.join(',')){
                    return;
                }
                playerListTemp = data;
                $(".message-playerlist").empty();
                data = data.map((realName)=>{return buildMClog_p('§a'+realName)});
                data.forEach(element => {
                    $(".message-playerlist").append(element);
                });
            } 
        );
    };
    // 获取网页在线
    let webOnlineTemp = [];
    function fetchWebOnline(){
        $.get(
            "/api/webOnline",
            {},
            (data) => {
                if (data == undefined) {return;}
                if (data.join(',')==webOnlineTemp.join(',')){
                    return;
                }
                webOnlineTemp = data;
                $(".message-webOnline").empty();
                data = data.map((realName)=>{return buildMClog_p('§b'+realName)});
                data.forEach(element => {
                    $(".message-webOnline").append(element); 
                })
            }
        );
    };
    $(document).ready(() => {
        setTimeout(()=>{
            fetchPlayerList();
            setInterval(fetchPlayerList, 10000);
            fetchWebOnline();
            setInterval(fetchWebOnline, 10000);
        },1000)
    })

    // 发送消息
    $("#message-input").on("keydown", (event) => {
        if (event.key === "Enter") {
            // 阻止默认的换行行为
            event.preventDefault();
            // 触发发送按钮的点击事件
            $("#message-send-button").click();
        }
    });
    let isSending = false;
    $("#message-send-button").on("click", () => {
        if (!loginStatus) {return;}
        let msg = $("#message-input").val().trim();
        if (msg == "") {
            $("#message-input").prop("placeholder", "");
            setTimeout(() => {
                $("#message-input").prop("placeholder", "消息不能为空");
            }, 100);
            return;
        }
        if (msg.length > (options?.webChat?.maxMsgLength ?? Infinity)) {
            alert(`消息不能超过${options?.webChat?.maxMsgLength}个字符`);
            return;
        }
        if (isSending) {return;}
        isSending = true
        $.post(
            "/api/chat/send",
            { msg: msg },
            (data) => {
                if (data.code == 0) {
                    $("#message-input").val("");
                    getMessage();
                }else{
                    alert(data.message);
                }
                isSending = false;
            } 
        ).fail(() => {
            isSending = false;
        });
    })
    
    function buildMClog_p(content){
        let p = $("<p></p>").text(content);
        motdParser.toHtml(p.html(), function (err, res) {
            if (!err) {
                p.html(res);
                p.children(".mc").children("span");
            } else {
                p.text(str);
            }
        });
        p.children(".mc").children("span");
        return p;
    }
    
    function buildChatMsg(chatObj) {
        let str;
        let time = logTime(new Date(chatObj.sendTime));
        switch (chatObj.type) {
            case "chat":
                str = `§b${time} ${chatObj.source=='web'?'[web]':''}§a<${chatObj.realName}>§r  ${chatObj.msg}`;
                break;
            case "onJoin":
                str = `§b${time} §e<${chatObj.realName}>  加入了服务器`;
                break;
            case "onLeft":
                str = `§b${time} §e<${chatObj.realName}>  离开了服务器`;
                break;
            default:
                str = `§b${time} §a<${chatObj.realName}>§r  ${chatObj.msg}`;
                break;
        }
        return str;
    }
}

// 添加自定义标记图层与右下角控件（无自定义图层时仍显示「文字标签」开关）
/* BDSLM:always-layer-visible-control */
{
    let controlButtonList = [];
    if (options.customMarkerLayers) {
        for (let layerConfig of options.customMarkerLayers) {
            let markersLayer = createMarkersLayer(layerConfig.markers, dataProjection, viewProjection, {
                layerName: layerConfig.layerName,
                ...layerConfig.layerPropertites,
            });
            olMap.addLayer(markersLayer);
            let layerInitiallyVisible = layerConfig.layerInitiallyVisible !== false;
            markersLayer.setVisible(layerInitiallyVisible);
            if (layerConfig?.controlConfig?.isEnabled) {
                controlButtonList.push({
                    layerName: layerConfig.layerName,
                    layerInitiallyVisible: layerInitiallyVisible,
                    ...layerConfig.controlConfig,
                });
            }
        }
    }
    /* 不传 target：由 OpenLayers 挂到 overlay 容器，否则会插在 #map 内被瓦片层盖住 */
    let customControl = new LayerVisbleControl({
        controlButtonList: controlButtonList,
    });
    olMap.addControl(customControl);
}
// 添加玩家位置图层
if (options.playerMarker && options.playerMarker.isEnabled){
    //需添加玩家玩家位置控件 
    let playerMarkerLayer;
    setInterval(() => {
        $.ajax({
            url: "/api/getPlayerMarkers",
            type: "GET",
            dataType: "json",
            success: data => {
                if (playerMarkerLayer != null){
                    olMap.removeLayer(playerMarkerLayer);
                }
                playerMarkerLayer = createMarkersLayer(data["playerMarkers"], dataProjection, viewProjection, 
                    {
                        layerName: "playerMarker",
                        minZoom: data?.layerPropertites?.minZoom,
                        maxZoom: data?.layerPropertites?.maxZoom,
                        zIndex: data?.layerPropertites?.zIndex,
                        opacity: data?.layerPropertites?.opacity,
                    }
                );
                olMap.addLayer(playerMarkerLayer);
            }
        });
    }, 1000);
}

// 点击标记菜单
// var markerMenu_overlayer = new ol.Overlay({
//     element: $(`#markerMenu`)[0],
//     index: "markerMenu",
//     autoPan: false,
//     autoPanAnimation: {
//         duration: 250
//     }
// });
// olMap.on('click',function(e){
//     var pixel = olMap.getEventPixel(e.originalEvent);
//     let selected = false;
//     olMap.forEachFeatureAtPixel(pixel, function(feature){
//         olMap.removeOverlay(markerMenu_overlayer);
//         selected = true;
//         var attr = feature.getProperties();
//         var coodinate = e.coordinate;
//         markerMenu_overlayer.setPosition(coodinate);
//         olMap.addOverlay(markerMenu_overlayer);
//         $("#markerMenu").show();
//         $("#markerMenu").unbind( "click" );
//         $("#markerMenu").click(()=>{
//             alert("hello");
//             $("#markerMenu").hide();
//             olMap.removeOverlay(markerMenu_overlayer);
//         });
//     });
//     if (!selected){
//         $("#markerMenu").hide();
//         olMap.removeOverlay(markerMenu_overlayer);
//     }
// });

/* BDSLM:createMarkersLayer-delegate — 必须调用 __bdslmCreateMarkersLayerCore：本文件的 function 声明会覆盖 window.createMarkersLayer 导致无限递归 */
function createMarkersLayer(markers, dataProjection, viewProjection, layerPropertites) {
    layerPropertites = layerPropertites || {};
    var impl = typeof window.__bdslmCreateMarkersLayerCore === "function"
        ? window.__bdslmCreateMarkersLayerCore
        : null;
    if (impl) {
        return impl(markers, dataProjection, viewProjection, layerPropertites);
    }
    throw new Error(
        "[BDSLM] __bdslmCreateMarkersLayerCore 未定义：请确认 assets/js/bdslm-marker-label-chip.js 已加载且在 unmined.js 之后。"
    );
}
