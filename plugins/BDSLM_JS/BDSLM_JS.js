
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require("path");
let fsApi = null;
try { fsApi = require("fs"); } catch (e) {}

let default_config = {
    "webserver": {
        "port": 5110,
        "mapTitle": "default"
    },
    "mapRender": {
        "zoomin": 1,
        "zoomout": -5
    },
    "autoRend":{
        "isEnabled": true,
        "cycle": 120
    },
    "openlayers": {
        "options":{
            enableGrid: true,
            showGrid: true, 
            binaryGrid: true,
            showScaleBar: false,
            denseGrid: false,
            showMarkers: true,
            showPlayers: true,
            centerX: 0,
            centerZ: 0
        },
        "playerMarker": {
            "isEnabled": true,
            "layerName": "playerMarker",
            "layerPropertites": {
                "minZoom": 0,
                "maxZomm": 7,    // 限制仅1-7级别显示
                "zIndex": 999,  // 图层顺序
                "opacity": 1    // 透明度
            },
            "controlConfig": {
                "isEnabled": true,
                "img": "assets/ui/marker/marker_white.png",
                "openTitle": "玩家(开)",
                "closeTitle": "玩家(关)"
            },
            "markerConfig": {
                "image": "assets/ui/marker/marker_cyan.png",
                "imageRotation": true,
                "imageAnchor": [0.5, 0.5],
                "imageScale": "1.5",
                "textAlign": "center",
                "textJustify": "center",
                "textPadding": [2, 8, 2, 8],
                "textColor": "white",
                "textStrokeColor": null,
                "textStrokeWidth": 1,
                "textBackgroundColor": "rgba(69,69,69,0.42)",
                "textBackgroundRadius": 6,
                "textBackgroundStrokeColor": null,
                "textBackgroundStrokeWidth": 1,
                "offsetX": 0,
                "offsetY": 17,
                "font": "12px Microsoft Yahei"
            }
        }
    },
    "webChat": {
        "isEnabled": true,
        "tempMsgMaxNum": 100, // 历史消息最大条数
        "tempMsgExpires": 24 * 60, // 历史消息过期时间，单位分钟
        "maxMsgLength": 100, // 消息最大长度
        "maxSendMsgNumPerMinute": 30, // 每分钟最大发送消息数
    },
    "yeEssentialSync": {
        "enabled": true,
        "debounceMs": 400,
        "homeDataPath": "./plugins/YEssential/data/homedata.json",
        "warpDataPath": "./plugins/YEssential/data/warpdata.json",
        "warpLayerName": "公共传送点",
        "homeLayerName": "公开的家",
        "warpControlImg": "assets/ui/marker/marker_circle.png",
        "homeControlImg": "assets/ui/marker/marker_mansion.png",
        "warpOpenTitle": "公共传送点(开)",
        "warpCloseTitle": "公共传送点(关)",
        "homeOpenTitle": "公开的家(开)",
        "homeCloseTitle": "公开的家(关)"
    }
};
let config_json = new JsonConfigFile("./plugins/BDSLM_JS/data/config.json", JSON.stringify(default_config));
let chatTemp_json = new JsonConfigFile("./plugins/BDSLM_JS/data/chatTemp.json", JSON.stringify({chat:[]})); // 插件配置路径
let customMarkerLayers_json = new JsonConfigFile("./plugins/BDSLM_JS/data/customMarkerLayers.json", JSON.stringify({customMarkerLayers:[]}));
let config = JSON.parse(config_json.read());

let xyzConfig_json = new JsonConfigFile("./plugins/BDSLM_JS/data/xyzConfig.json", JSON.stringify(
    {   
        "iconList": [
            "maker_triangle_red.png",
            "maker_x.png",
            "marker_aa.png",
            "marker_blue.png",
            "marker_circle.png",
            "marker_cyan.png",
            "marker_green.png",
            "marker_orange.png",
            "marker_red.png",
            "marker_white.png",
            "marker_yello.png"
        ],
        "customMarkerLayers_default":{
            //"layerName": "qitianshenxiang",
            "layerPropertites": {
                "minZoom": null,
                "maxZomm": null,    // 限制仅4、5、6、7级别显示
                "zIndex": null,
                "opacity": 1
            },
            "controlConfig": {
                "isEnabled": true,
                //"img": "assets/ui/svg/PhHouseLineLight.svg",
                // "openTitle": "自定义标记(开)",
                // "closeTitle": "自定义标记(关)",
            },
            "markers_default": {
                // "x": 0,
                // "z": 100,
                // "text": "Orange apple",
                //"image": "assets/ui/marker/marker_white.png",
                "imageRotation": null,
                "imageAnchor": [
                    0.5,
                    0.5
                ],
                "imageScale": 1.5,
                "textColor": "white",
                "offsetX": 0,
                "offsetY": 18,
                "font": "12px Microsoft Yahei",
                "textAlign": "center",
                "textJustify": "center",
                "textPadding": [
                    2,
                    8,
                    2,
                    8
                ],
                "textStrokeColor": "black",
                "textStrokeWidth": 1,
                "textBackgroundColor": "rgba(105,105,105,0.42)",
                "textBackgroundRadius": 6,
                "textBackgroundStrokeColor": null,
                "textBackgroundStrokeWidth": 1
            }
        },
        "customMarkerLayers":[{
            "layerName": "test_example",
            "layerPropertites": {
                "minZoom": 4,
                "maxZomm": 5,    // 限制仅4、5、6、7级别显示
                "zIndex": 3,
                "opacity": 1
            },
            "controlConfig": {
                "isEnabled": false,
                "img": "assets/ui/marker/marker_cyan.png",
                "openTitle": "§c特殊地形(开)",
                "closeTitle": "§c特殊地形(关)"
            },
            "markers_default":{
                "image": "assets/ui/marker/marker_cyan.png",
            }
        }]
    }
)); // 插件配置路径

let userAccount_json = new JsonConfigFile("./plugins/BDSLM_JS/data/userAccount.json", JSON.stringify({}));

// 变量
let lastMsgTime = chatTemp_json.get('chat').slice(-1)[0]?.sendTime ?? 0; // 上次消息时间

if (config.webChat.secretKey == null){
    config.webChat.secretKey = system.randomGuid();
    config_json.set('webChat', config.webChat);
}
const SECRET_KEY = config.webChat.secretKey; // JWT令牌密钥

let XYZ;
mc.listen("onServerStarted",()=>{
    // 导入接口
    if (ll.hasExported("xyz", "getPublic")) {
        XYZ = {                 //API导入
            getPublic: ll.import('xyz', 'getPublic'),
            getPerson: ll.import('xyz', 'getPerson'),
            addPosPublic: ll.import('xyz', 'addPosPublic'),
            addPosPerson: ll.import('xyz', 'addPosPerson'),
            removePosPublic: ll.import('xyz', 'removePosPublic'),
            removePosPerson: ll.import('xyz', 'removePosPerson'),
            navigationStart: ll.import('xyz', 'navigationStart'),
            navigationStop: ll.import('xyz', 'navigationStop'),
            navigationHas: ll.import('xyz', 'navigationHas'),
        };
    }else{
        //logger.warn('坐标记录插件(XYZ)未安装, 坐标记录功能不会启用');
    }

    // 注册命令
    {
        let scmd = mc.newCommand("slmrender", "重新&继续渲染卫星图", PermType.GameMasters); 
        //PermType.Any: 任何人,  PermType.GameMasters: 仅OP, PermType.Console: 仅控制台
        scmd.setEnum("ReloadAction", ["reload"]);
        scmd.mandatory("action", ParamType.Enum, "ReloadAction", 1);
        
        scmd.overload([]);
        scmd.overload(["ReloadAction"]);
        scmd.setCallback((_cmd, _ori, out, res) => {
            if (res.action == "reload"){
                applyBdslmMapWebPatches();
                config_json.reload();
                chatTemp_json.reload();
                customMarkerLayers_json.reload();
                xyzConfig_json.reload();
                config = JSON.parse(config_json.read());
                syncYeEssentialToCustomMarkerLayersJson();
                out.success("已重载json文件, 部分功能需重启BDS才能生效");
                return;
            }
            system.cmd(`taskkill /f /t /im unmined-cli.exe`,function(_exitcode, _output){
                logger.info(`结束之前渲染进程: ${!_exitcode}`);
                //logger.info(`结束nginx进程: ${!_exitcode}\n ${_output}`);
                RendMap();
            });
            out.success("开始渲染..");
        });
        scmd.setup();
    }

    {
        let scmd = mc.newCommand("bdslm", "卫星图菜单", PermType.Any); 
        //PermType.Any: 任何人,  PermType.GameMasters: 仅OP, PermType.Console: 仅控制台
        scmd.overload([]);
        scmd.setCallback((_cmd, _ori, out, res) => {
            let pl = _ori.player;
            if (pl == null){
                out.error("此命令的执行者须为玩家");
                return;
            } 
            bdslmForm(pl);
            out.success("");
        });
        scmd.setup();
    }

    // 启动
    setTimeout(()=>{
        applyBdslmMapWebPatches();

        syncYeEssentialToCustomMarkerLayersJson();
        startYeEssentialDataWatchers();

        // 启用web服务
        httpServer(); 

        // 注册自动渲染
        if (config["autoRend"]["isEnabled"]) {
            setTimeout(()=>{
                setInterval(RendMap, config["autoRend"]["cycle"] * 60 * 1000);
            }, config["autoRend"]["cycle"] * 60 * 1000);
            logger.info(`自动渲染提示: ${config["autoRend"]["cycle"]}分钟后自动进行渲染`);
        }
		logger.info('输入命令 /slmrender 手动渲染卫星图');
    },3000);

});

// web服务
function httpServer(){
    const app = express();
    app.use(cookieParser()); 
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    /** 插件根目录（避免 embed/require 环境下 __dirname 异常导致静态目录错位） */
    let pluginRoot = __dirname;
    try {
        pluginRoot = path.dirname(require.resolve("./package.json"));
    } catch (_e) {}
    const webRoot = path.join(pluginRoot, "unmined-web");
    app.use(express.static(webRoot, { index: "index.html" }));
    app.get("/", (_req, res) => {
        res.sendFile(path.join(webRoot, "index.html"));
    });
    // app.get('/', (req, res) => {
    //     res.location("/unmined-web/unmined.index.html");
    //     res.end();
    // });
    app.get('/api/conf', (req, res)=>{
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });    
        res.end(JSON.stringify(config)); 
    });

    app.get('/api/getCustomMarkerLayers', (req, res) => {
        res.setHeader("Content-Type", "application/json;charset=utf-8");
        res.writeHead(200, { 'Content-Type': 'application/json' });    
        let resData = JSON.parse(customMarkerLayers_json.read());
        resData["customMarkerLayers"] ??= [];
        resData["customMarkerLayers"] = resData["customMarkerLayers"].concat(getXyzMarkerLayers());
        res.end(JSON.stringify(resData)); 
    });

    app.get('/api/playerlist', (req, res)=>{
        let plsname = mc.getOnlinePlayers().map((pl)=>pl.realName);
        res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });    
        res.end(JSON.stringify(plsname));
    });
    
    if (config["openlayers"]["playerMarker"].isEnabled){
        let playerMarkerTemplate = JSON.stringify(config["openlayers"]["playerMarker"]);
        let itemTemplate = JSON.stringify(config["openlayers"]["playerMarker"]["markerConfig"]);
        app.get('/api/getPlayerMarkers', (req, res) => {
            let writeOut = JSON.parse(playerMarkerTemplate);
            writeOut["playerMarkers"] = [];
            var pls = mc.getOnlinePlayers();
            for (let i = 0; i<pls.length; i++){
                let item = JSON.parse(itemTemplate);
                if (item.imageRotation === true){
                    item["imageRotation"] = (pls[i].direction.yaw+180)/360*(2*Math.PI);
                }
                item["x"] = pls[i].blockPos.x;
                item["z"] = pls[i].blockPos.z;
                item["text"] = stripMcColorCodes(pls[i].realName);
                writeOut["playerMarkers"].push(item);
            }
            delete writeOut["markerConfig"];
            res.setHeader("Content-Type", "application/json;charset=utf-8");
            res.writeHead(200, { 'Content-Type': 'application/json' });    
            res.end(JSON.stringify(writeOut)); 
        });
    }
    
    if (config?.webChat?.isEnabled){
        function addMsgTemp(chatObj){
            let msgTemp = chatTemp_json.get("chat");
            let date = new Date();
            chatObj["sendTime"] = date.getTime(),
            msgTemp.push(chatObj);
            if (msgTemp.length > config.webChat.tempMsgMaxNum){
                msgTemp.shift();
            }
            lastMsgTime = date.getTime();
            chatTemp_json.set("chat", msgTemp);
        }
        mc.listen("onJoin", (pl)=>{
            addMsgTemp({
                type: 'onJoin',
                source: 'bds',
                realName: pl.realName,
                msg: ""
            });
        });
        mc.listen("onLeft", (pl)=>{
            addMsgTemp({
                type: 'onLeft',
                source: 'bds',
                realName: pl.realName,
                msg: ""
            });
        });
        mc.listen("onChat", (pl, msg)=>{
            addMsgTemp({
                type: 'chat',
                source: 'bds',
                realName: pl.realName,
                msg: msg
            });
        });

        app.get('/api/chat/fetch', (req, res)=>{
            let msgTemp = chatTemp_json.get("chat");
            let lastRefeshTime = req.query.lastRefeshTime ?? 0;
            if (lastRefeshTime >= lastMsgTime){
                res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });    
                res.end(JSON.stringify([]));
                return;
            }
            let startIndex = msgTemp.findIndex((msg, index)=> msg.sendTime > lastRefeshTime);
            let json_data = msgTemp.slice(startIndex);
            res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });    
            res.end(JSON.stringify(json_data));
        });

        setInterval(()=>{
            let msgTemp = chatTemp_json.get("chat");
            let msgTemp_new = msgTemp.filter((msg)=>msg.sendTime+config.webChat.tempMsgExpires * 60 * 1000 > new Date().getTime());
            if (msgTemp_new.length == msgTemp.length){return;}
            chatTemp_json.set("chat", msgTemp_new);
        },60000);

        // 登录
        const onlineUsers = new Map(); // 在线用户
        const loginAttempts = new Map();
        const sendLimiter = new Map(); // 消息频率限制
        app.post('/api/login', async (req, res)=>{
            const ip = req.ip; 
            const attempts = loginAttempts.get(ip)  || 0;
            
            if (attempts >= 5) {
                return res.status(200).send({ code: 1, message: '尝试次数过多,1分钟后重试', data:{}});
            }

            const { username, password } = req.body;
            if (!username || !password) {
                res.status(200).json({ code: 1, message: '用户名和密码不能为空', data:{}});
                return;
            }
            let userAccount = userAccount_json.get(username);
            if (!userAccount){
                res.status(200).json({ code: 1, message: '用户名不存在', data:{}});
                return;
            }
            let isMatch = await bcrypt.compare(password, userAccount.password);
            if (isMatch) {
                // 生成Token
                const token = jwt.sign(
                    { username }, 
                    SECRET_KEY, 
                    { expiresIn: '30d' }
                );
                onlineUsers.set(username, { 
                    username,
                    lastActive: Date.now()
                });

                res.cookie('auth_token', token, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    // secure: true // 生产环境建议开启
                });
                res.status(200).json({ code: 0, message: '登录成功', data:{ username: username}});	
            }
            else {
                res.status(200).json({ code: 1, message: '密码错误', data:{}});
                loginAttempts.set(ip,  attempts + 1);
                if (attempts + 1 >= 5) {
                    setTimeout(() => loginAttempts.delete(ip),  60*1000);
                }
            }
        });

        // token验证接口
        app.get('/api/check-auth', (req, res) => {
            const token = req.cookies.auth_token;
            if (!token) return res.json({ code: 1 });
            
            try {
                const decoded = jwt.verify(token, SECRET_KEY);
                res.json({ code: 0, data: decoded });
            } catch (err) {
                res.clearCookie('auth_token');
                res.json({ code: 1 });
            }
        });

        // 用户认证中间件
        function authMiddleware(req, res, next) {
            const token = req.cookies.auth_token;
            if (!token) return res.status(200).json({ code: 1, message: '未登录' });
            
            try {
                const decoded = jwt.verify(token, SECRET_KEY);
                // 更新用户活跃时间
                onlineUsers.set(decoded.username, { 
                    ...decoded,
                    lastActive: Date.now()
                });
                req.user = decoded;
                next();
            } catch (err) {
                res.clearCookie('auth_token');
                res.status(200).json({ code: 1, message: '登录已过期' });
            }
        }
        // 用户在线心跳
        app.get('/api/heartbeat', authMiddleware, (req, res) => {
            res.json({ code: 0 });
        });

        // 定时清理不活跃用户
        setInterval(() => {
            onlineUsers.forEach((user, username) => {
                if (Date.now() - user.lastActive > 2 * 60 * 1000) {
                    onlineUsers.delete(username);
                }
            });
        }, 1 * 60 * 1000);

        // 获取网页在线玩家列表
        app.get('/api/webOnline', (req, res)=>{
            res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });    
            res.end(JSON.stringify(Array.from(onlineUsers.keys())));
        });

        // 发送消息
        app.post('/api/chat/send', authMiddleware, (req, res)=>{
            const { msg } = req.body;
            if (!msg || msg.trim() === '') {
                return res.status(200).json({ code: 1, message: '消息不能为空' });
            }
            if (msg.length > (config.webChat.maxMsgLength ?? Infinity)) {
                return res.status(200).json({ code: 1, message: `消息长度不能超过${config.webChat.maxMsgLength}个字符`});
            }

            // 消息频率限制
            const username = req.user.username;
            const now = Date.now();
            const userRecords = sendLimiter.get(username) || [];
            const recentMessages = userRecords.filter(t => now - t < 60 * 1000);
            if (recentMessages.length >= (config.webChat.maxSendMsgNumPerMinute ?? 30)) {
                return res.status(200).json({ 
                    code: 1, 
                    message: `每分钟最多发送${config.webChat.maxSendMsgNumPerMinute ?? 30}条消息`
                });
            }
            sendLimiter.set(username, [...recentMessages, now]);

            addMsgTemp({
                type: 'chat',
                source: 'web',
                realName: username, // 从token中获取用户名
                msg: msg.trim()
            });
            mc.broadcast(`§小§b[web]§3<${username}>§r ${msg}`);
            res.json({ code: 0 });
        });

        // 退出登录
        app.post('/api/logout', authMiddleware, (req, res) => {
            onlineUsers.delete(req.user.username);
            res.clearCookie('auth_token');
            res.json({ code: 0 });
        });
    }
    app.listen(config.webserver.port, () => {
        logger.info(`卫星图已启用: http://localhost:${config.webserver.port}`);
    });
}

function ensureBdslmMarkerLabelFontPatches() {
    const dataPaths = [
        "./plugins/BDSLM_JS/data/xyzConfig.json",
        "./plugins/BDSLM_JS/data/config.json",
        "./plugins/BDSLM_JS/data/customMarkerLayers.json"
    ];
    for (let di = 0; di < dataPaths.length; di++) {
        let dp = dataPaths[di];
        if (!File.exists(dp)) continue;
        let t = File.readFrom(dp);
        if (!t.includes("15px Microsoft Yahei")) continue;
        t = t.split("15px Microsoft Yahei").join("12px Microsoft Yahei");
        File.writeTo(dp, t);
    }
    try {
        xyzConfig_json.reload();
    } catch (e1) {}
    try {
        config_json.reload();
        config = JSON.parse(config_json.read());
    } catch (e2) {}
    try {
        customMarkerLayers_json.reload();
    } catch (e3) {}

    let cust = "./plugins/BDSLM_JS/unmined-web/assets/js/custom-openlayers.js";
    if (File.exists(cust)) {
        let cs = File.readFrom(cust);
        if (!cs.includes("font: item.font || BDSLM_MARKER_LABEL_FONT") && cs.includes("font: item.font,")) {
            if (!cs.includes("BDSLM_MARKER_LABEL_FONT")) {
                cs = cs.replace(
                    "let {olMap, options, dataProjection, viewProjection} = unmined;\n",
                    "let {olMap, options, dataProjection, viewProjection} = unmined;\n\nconst BDSLM_MARKER_LABEL_FONT = \"12px Microsoft Yahei\";\n\n"
                );
            }
            cs = cs.split("font: item.font,").join("font: item.font || BDSLM_MARKER_LABEL_FONT,");
            File.writeTo(cust, cs);
        }
    }
    let unpath = "./plugins/BDSLM_JS/unmined-web/unmined.js";
    if (File.exists(unpath)) {
        let u = File.readFrom(unpath);
        if (!u.includes('font: item.font || "12px Microsoft Yahei"') && u.includes("font: item.font,")) {
            u = u.split("font: item.font,").join('font: item.font || "12px Microsoft Yahei",');
            File.writeTo(unpath, u);
        }
    }
}

/** 从插件目录恢复圆角标签脚本并保证 index.html 中 chip 位于 unmined.js 与 custom-openlayers.js 之间（防渲染覆盖） */
function ensureBdslmMarkerLabelChipAsset() {
    const pluginChip = "./plugins/BDSLM_JS/bdslm-marker-label-chip.js";
    const webChip = "./plugins/BDSLM_JS/unmined-web/assets/js/bdslm-marker-label-chip.js";
    if (!File.exists(pluginChip)) {
        logger.warn("[BDSLM_JS] 缺少 plugins/BDSLM_JS/bdslm-marker-label-chip.js，圆角标签无法自动恢复");
        return;
    }
    try {
        File.writeTo(webChip, File.readFrom(pluginChip));
    } catch (e) {
        logger.warn("[BDSLM_JS] 写入 bdslm-marker-label-chip.js 到 unmined-web 失败: " + e);
    }

    const htmlPath = "./plugins/BDSLM_JS/unmined-web/index.html";
    if (!File.exists(htmlPath)) return;
    try {
        let html = File.readFrom(htmlPath);
        const chipLine = '<script type="text/javascript" src="assets/js/bdslm-marker-label-chip.js"></script>';
        const lines = html.split(/\r?\n/);
        const filtered = lines.filter(function (line) {
            return line.indexOf("bdslm-marker-label-chip.js") === -1;
        });
        html = filtered.join("\n");
        const needle = '<script type="text/javascript" src="unmined.js"></script>';
        if (html.indexOf(chipLine) === -1 && html.indexOf(needle) !== -1) {
            const injection = needle + "\n    " + chipLine;
            html = html.replace(needle, injection);
            File.writeTo(htmlPath, html);
            logger.info("[BDSLM_JS] 已同步圆角标签脚本并校正 index.html：chip 位于 unmined.js 与 custom-openlayers.js 之间");
        } else if (html.indexOf(chipLine) === -1) {
            logger.warn("[BDSLM_JS] index.html 未找到 unmined.js 引用，未能插入 bdslm-marker-label-chip.js");
        }
    } catch (e2) {
        logger.warn("[BDSLM_JS] 更新 index.html 圆角标签脚本引用失败: " + e2);
    }
}

/** 从 master 恢复右下角图层控件（含「文字标签」开关），渲染覆盖 unmined-web 后写回 */
function ensureBdslmUnminedControlButtonMasterAsset() {
    const master = "./plugins/BDSLM_JS/unminded.controlbutton.master.js";
    const web = "./plugins/BDSLM_JS/unmined-web/assets/js/unminded.controlbutton.js";
    if (!File.exists(master)) {
        logger.warn("[BDSLM_JS] 缺少 unminded.controlbutton.master.js，图层控件补丁无法自动恢复");
        return;
    }
    try {
        File.writeTo(web, File.readFrom(master));
    } catch (e) {
        logger.warn("[BDSLM_JS] 写入 unminded.controlbutton.js 失败: " + e);
    }
}

/** 若 vanilla 覆盖了 custom-openlayers.js，则从 master 恢复 BDSLM 图层控件与 createMarkersLayer 委托 */
function ensureBdslmCustomOpenlayersMasterAsset() {
    const master = "./plugins/BDSLM_JS/custom-openlayers.master.js";
    const web = "./plugins/BDSLM_JS/unmined-web/assets/js/custom-openlayers.js";
    if (!File.exists(master)) return;
    if (!File.exists(web)) return;
    try {
        let cur = File.readFrom(web);
        if (!cur.includes("/* BDSLM:always-layer-visible-control */")) {
            File.writeTo(web, File.readFrom(master));
            logger.info("[BDSLM_JS] 已从 custom-openlayers.master.js 恢复图层控件与标记图层委托");
        }
    } catch (e) {
        logger.warn("[BDSLM_JS] 恢复 custom-openlayers.js 失败: " + e);
    }
}

/** 从 master 同步浏览器标题脚本，并在 index.html 中插入引用（防 unmined-cli 覆盖后丢失） */
function ensureBdslmWebTitleAssets() {
    const pluginMaster = "./plugins/BDSLM_JS/bdslm-document-title.master.js";
    const titleJsPath = "./plugins/BDSLM_JS/unmined-web/assets/js/bdslm-document-title.js";
    try {
        if (File.exists(pluginMaster)) {
            File.writeTo(titleJsPath, File.readFrom(pluginMaster));
        } else {
            logger.warn(
                "[BDSLM_JS] 缺少 plugins/BDSLM_JS/bdslm-document-title.master.js，无法同步标签页标题脚本（在线人数）"
            );
        }
    } catch (e) {
        logger.warn("[BDSLM_JS] 写入 bdslm-document-title.js 失败: " + e);
    }

    const htmlPath = "./plugins/BDSLM_JS/unmined-web/index.html";
    if (!File.exists(htmlPath)) return;
    try {
        let html = File.readFrom(htmlPath);
        if (html.includes("bdslm-document-title.js")) return;
        const marker = '<script type="text/javascript" src="assets/js/init-conf.js"></script>';
        const withTitle =
            marker + "\n    " + '<script type="text/javascript" src="assets/js/bdslm-document-title.js"></script>';
        if (html.includes(marker)) {
            html = html.replace(marker, withTitle);
            File.writeTo(htmlPath, html);
            logger.info("[BDSLM_JS] 已在 index.html 中加入 bdslm-document-title.js 引用");
        }
    } catch (e2) {
        logger.warn("[BDSLM_JS] 更新 index.html 标题脚本引用失败: " + e2);
    }
}

/** uNmINeD 渲染会覆盖 unmined-web/unmined.js 等文件，在此重新注入全局图标缩小逻辑 */
function applyBdslmMapWebPatches() {
    try {
        const markerHelper =
            `/* BDSLM marker icon scale — injected by plugin; do not remove */\n` +
            `var BDSLM_MARKER_ICON_GLOBAL_FACTOR = 0.72;\n` +
            `function bdsLMResolvedMarkerIconScale(markerItem) {\n` +
            `    var raw = markerItem.imageScale;\n` +
            `    var n = (raw !== undefined && raw !== null && raw !== "") ? Number(raw) : 1;\n` +
            `    if (!Number.isFinite(n)) n = 1;\n` +
            `    return n * BDSLM_MARKER_ICON_GLOBAL_FACTOR;\n` +
            `}\n`;
        let unpath = "./plugins/BDSLM_JS/unmined-web/unmined.js";
        if (File.exists(unpath)) {
            let s = File.readFrom(unpath);
            if (!s.includes("/* BDSLM marker icon scale — injected by plugin")) {
                let idx = s.indexOf("class Unmined");
                if (idx !== -1) {
                    s = s.slice(0, idx) + markerHelper + s.slice(idx);
                } else {
                    logger.warn("[BDSLM_JS] unmined.js 未找到「class Unmined」，跳过图标缩放辅助函数注入");
                }
            }
            if (!s.includes("bdsLMResolvedMarkerIconScale(item)")) {
                let beforeUn = s;
                if (s.includes("scale: item.imageScale,")) {
                    s = s.split("scale: item.imageScale,").join("scale: bdsLMResolvedMarkerIconScale(item),");
                } else if (s.includes("scale: item.imageScale")) {
                    s = s.split("scale: item.imageScale").join("scale: bdsLMResolvedMarkerIconScale(item)");
                }
                if (beforeUn === s) {
                    logger.warn("[BDSLM_JS] 未能自动替换 unmined.js 中的 Icon scale（可能 uNmINeD 版本不同）");
                }
            }
            File.writeTo(unpath, s);
        }
        ensureBdslmCustomOpenlayersMasterAsset();

        let cust = "./plugins/BDSLM_JS/unmined-web/assets/js/custom-openlayers.js";
        if (File.exists(cust)) {
            let cs = File.readFrom(cust);
            if (!cs.includes("bdsLMResolvedMarkerIconScale(item)")) {
                let beforeCs = cs;
                if (cs.includes("scale: item.imageScale,")) {
                    cs = cs.split("scale: item.imageScale,").join("scale: bdsLMResolvedMarkerIconScale(item),");
                } else if (cs.includes("scale: item.imageScale")) {
                    cs = cs.split("scale: item.imageScale").join("scale: bdsLMResolvedMarkerIconScale(item)");
                }
                if (beforeCs === cs) {
                    logger.warn("[BDSLM_JS] 未能自动替换 custom-openlayers.js 中的 Icon scale");
                }
            }
            File.writeTo(cust, cs);
        }

        ensureBdslmMarkerLabelFontPatches();

        ensureBdslmMarkerLabelChipAsset();

        ensureBdslmUnminedControlButtonMasterAsset();

        ensureBdslmWebTitleAssets();
    } catch (e) {
        logger.warn(`[BDSLM_JS] 应用卫星图图标缩小补丁失败(可手动检查 unmined.js / custom-openlayers.js): ${e}`);
    }
}

//unmined渲染
function RendMap() {
	logger.info("BDS正在准备备份文件…");
    mc.runcmd(`save hold`);
    let save_id = setInterval(()=>{
        if (!mc.runcmdEx(`save query`).success){return;}
        let zoomin = config["mapRender"]["zoomin"];
        let zoomout = config["mapRender"]["zoomout"];
        /*2、1、0、-1、-2、-3、-4、-5、-6
        放大倍数最大zoomin 应该是|1|
        放大倍数最小zoomout  应该是 |-6|*/
        clearInterval(save_id);
        logger.info(`BDS已准备好备份文件, 开启渲染进程, 继续或重新渲染 roomin: ${zoomin} roomout: ${zoomout}`);
        let cmd = `start ./plugins/BDSLM_JS/unmined/unmined-cli.exe web render --world="./worlds/${levelname()}" --output="./plugins/BDSLM_JS/unmined-web/" --imageformat=png --zoomin=${zoomin} --zoomout=${zoomout}`;
        let newdata = new Date();
        let start_time = newdata.getTime();
        system.cmd(cmd, function GetRendMapResult(_exitcode, _output) {
            let newdata = new Date();
            let total_time = ((newdata.getTime() - start_time)/1000/60).toFixed(2);
            if (_exitcode == 0){
                mc.runcmd("save resume");
                try {
                    applyBdslmMapWebPatches();
                    const mapIndexPath = "./plugins/BDSLM_JS/unmined-web/index.html";
                    const fixedTitle = "实况地图 - 雁栖岛服务器";
                    let html = File.readFrom(mapIndexPath);
                    html = html.replace(/<title>[^<]*<\/title>/i, "<title>" + fixedTitle + "</title>");
                    File.writeTo(mapIndexPath, html);
                } catch (e) {
                    logger.error("自动渲染后恢复 index.html 标题失败: " + e);
                }
                log(`结束渲染 | total: ${total_time} 分钟`);
            }else{
                mc.runcmd("save resume");
                logger.error(`渲染失败 | total: ${total_time} 分钟\n${ _output}`);

            }
        });
    },2000);
}

// 表单
function bdslmForm(pl){
    let form = mc.newCustomForm();
    form.setTitle("§lBDSLM 卫星图");
    form.addLabel("");
    form.addInput("§b网页端密码(后端已加密)", "请输入新密码(6-16位)", "");

    pl.sendForm(form, (pl, res)=>{
    	if (res == null){return;}
        let password = res[1];
        if (password == ""){
            pl.tell("§c密码不能为空");
            return;
        }
        if (password.length < 6 || password.length > 16){
            pl.tell("§c密码长度不能小于6位或大于16位");
            return;
        }
        if (password.includes(" ")){
            pl.tell("§c密码不能包含空格");
            return;
        }
        pl.sendModalForm("§l修改密码", "\n§b确认修改密码?", "§2§l确认", "§l取消", (pl,result,reason)=>{
        	if (result == true){
                userAccount_json.set(pl.realName,  {
                    "realName": pl.realName,
                    "uuid": pl.uuid,
                    "xuid": pl.xuid,
                    "password": bcrypt.hashSync(password, bcrypt.genSaltSync(10))
                });
                pl.tell("§aBDSLM密码修改成功!");
            }
        });
    });
}
mc.listen("onJoin", (pl)=>{
    if (userAccount_json.get(pl.realName) == undefined){
    	userAccount_json.set(pl.realName, {
            "realName": pl.realName,
            "uuid": pl.uuid,
            "xuid": pl.xuid,
    		"password": bcrypt.hashSync(Date.now().toString(), bcrypt.genSaltSync(10))
    	});
    }
});

// 获取存档名称
function levelname() {
	return /level-name=(.*)/.exec(File.readFrom('./server.properties'))[1].trim();
}

function getXyzMarkerLayers(){
    if (XYZ == undefined){return [];}
    let customMarkerLayers = [];
    //customMarkerLayers_json.get('customMarkerLayers');
    let xyzPublicData = XYZ.getPublic();
    const iconList = xyzConfig_json.get("iconList");
    let controlConfigImgIndex = 0;

    for (let category in xyzPublicData){
        let layer = deepMerge(xyzConfig_json.get("customMarkerLayers_default"), xyzConfig_json.get("customMarkerLayers").find(a=>a.layerName==category)?? {});
        layer["layerName"] = category;
        layer["openTitle"] ??= `${category}(开)`;
        layer["closeTitle"] ??= `${category}(关)`;
        if (layer["controlConfig"]["img"] == undefined){
            layer["controlConfig"]["img"] = `assets/ui/marker/${iconList[controlConfigImgIndex]}`;
            controlConfigImgIndex++;
            if (controlConfigImgIndex > iconList.length - 1){ controlConfigImgIndex = 0;}
        }else{
            layer["controlConfig"]["img"] =  layer["controlConfig"]["img"];
        }

        layer.markers = [];
        let xyzList = xyzPublicData[category];
        for (let warp of xyzList){
            if (warp.pos.dimid != 0){continue;}
            let markerConfig = JSON.parse(JSON.stringify(layer["markers_default"]));
            markerConfig.x = warp.pos.x;
            markerConfig.z = warp.pos.z;
            markerConfig.text = stripMcColorCodes(warp.name);
            markerConfig.image ??= layer["controlConfig"]["img"];
            layer.markers.push(markerConfig);
        }
        delete layer["markers_default"];
        customMarkerLayers.push(layer);
    }
    return customMarkerLayers;
}

function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
  
function deepMerge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
  
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          deepMerge(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  
    return deepMerge(target, ...sources);
}

// ---------- YEssential → customMarkerLayers 同步 ----------

const CUSTOM_MARKER_JSON_PATH = "./plugins/BDSLM_JS/data/customMarkerLayers.json";

/** YEssential 自动同步写入的图层名（固定）；配置中的 warpLayerName 仅用于扫描旧别名图层并合并至此 */
const YE_CANON_WARP_LAYER = "公共传送点";
const YE_CANON_HOME_LAYER = "公开的家";

let yeEssentialWatchTimer = null;
let yeFsWatchersStarted = false;

function getYeEssentialSyncConfig() {
    return Object.assign(
        {
            enabled: true,
            debounceMs: 400,
            homeDataPath: "./plugins/YEssential/data/homedata.json",
            warpDataPath: "./plugins/YEssential/data/warpdata.json",
            warpLayerName: "公共传送点",
            homeLayerName: "公开的家",
            warpControlImg: "assets/ui/marker/marker_circle.png",
            homeControlImg: "assets/ui/marker/marker_mansion.png",
            warpOpenTitle: "公共传送点(开)",
            warpCloseTitle: "公共传送点(关)",
            homeOpenTitle: "公开的家(开)",
            homeCloseTitle: "公开的家(关)"
        },
        config.yeEssentialSync ?? {}
    );
}

function yeEssentialSyncEnabled() {
    return getYeEssentialSyncConfig().enabled !== false;
}

function yeAliasNamesWarpSet() {
    let c = getYeEssentialSyncConfig();
    return new Set(
        ["YE_WARP", YE_CANON_WARP_LAYER, c.warpLayerName].filter(
            (x) => typeof x === "string" && x.length > 0
        )
    );
}

function yeAliasNamesHomeSet() {
    let c = getYeEssentialSyncConfig();
    return new Set(
        ["YE_PUBLIC_HOME", YE_CANON_HOME_LAYER, c.homeLayerName].filter(
            (x) => typeof x === "string" && x.length > 0
        )
    );
}

function partitionYeAliasLayers(existingLayers) {
    let warpAl = yeAliasNamesWarpSet();
    let homeAl = yeAliasNamesHomeSet();
    /** @type {unknown[]} */
    let harvestedWarp = [];
    /** @type {unknown[]} */
    let harvestedHome = [];
    /** @type {unknown[]} */
    let kept = [];
    for (let layer of existingLayers ?? []) {
        if (!layer || typeof layer !== "object") continue;
        let nm = layer.layerName;
        if (typeof nm === "string" && warpAl.has(nm)) {
            harvestedWarp = harvestedWarp.concat(layer.markers ?? []);
            continue;
        }
        if (typeof nm === "string" && homeAl.has(nm)) {
            harvestedHome = harvestedHome.concat(layer.markers ?? []);
            continue;
        }
        kept.push(layer);
    }
    return { kept, harvestedWarp, harvestedHome };
}

function dedupeYeMarkers(markers) {
    /** @type {unknown[]} */
    let out = [];
    let seen = new Set();
    for (let m of markers ?? []) {
        if (!m || typeof m !== "object") continue;
        let k = `${Number(m.x)}|${Number(m.z)}|${String(m.text ?? "")}`;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push(m);
    }
    return out;
}

function readJsonSafeFromPath(relPath, fallback = {}) {
    try {
        if (!File.exists(relPath)) return JSON.parse(JSON.stringify(fallback));
        return JSON.parse(File.readFrom(relPath));
    } catch (e) {
        logger.warn(`[BDSLM_JS] JSON 读取失败(${relPath}): ${e}`);
        return JSON.parse(JSON.stringify(fallback));
    }
}

function parseDimId(v) {
    if (v === undefined || v === null) return NaN;
    let n = typeof v === "number" ? v : parseInt(String(v), 10);
    return Number.isFinite(n) ? n : NaN;
}

function parseXZ(v) {
    if (v === undefined || v === null) return null;
    let n = typeof v === "number" ? v : parseFloat(String(v));
    return Number.isFinite(n) ? n : null;
}

/**
 * 剥离 Minecraft 格式化代码（§ + 单个字符）。
 * 格式码：颜色 0-9 a-f，样式 k l m n o，重置 r。
 * § 在 Canvas/标记文本中无法渲染，会导致乱码。
 */
function stripMcColorCodes(text) {
    if (text == null) return "";
    return String(text).replace(/§[0-9a-fk-or]/gi, "");
}

/** 与 ShareHome / getXyzMarkerLayers 一致：仅主世界 dimid===0 */
function markerFromYzRecord(markerBase, imgUrl, labelText, rec) {
    let dimid = parseDimId(rec.dimid);
    if (dimid !== 0) return null;
    let x = parseXZ(rec.x);
    let z = parseXZ(rec.z);
    if (x === null || z === null) return null;
    let m = JSON.parse(JSON.stringify(markerBase));
    m.x = x;
    m.z = z;
    m.text = stripMcColorCodes(labelText);
    if (imgUrl) m.image = imgUrl;
    return m;
}

function buildYeEssentialLayersPayload(harvestedWarpMarkers, harvestedHomeMarkers) {
    // 注意：harvestedWarpMarkers / harvestedHomeMarkers 仅在从旧别名图层迁移时有用，
    // 此后标记完全以 YEssential 数据文件为准，不再合并旧标记，以避免已删除的传送点/家残留。
    let c = getYeEssentialSyncConfig();
    let layerTemplate = xyzConfig_json.get("customMarkerLayers_default");
    if (!layerTemplate || typeof layerTemplate !== "object") {
        layerTemplate = {};
    }

    let markerDefault = JSON.parse(JSON.stringify(layerTemplate.markers_default ?? {}));

    /** @type {unknown[]} */
    let out = [];

    let warpPayload = readJsonSafeFromPath(c.warpDataPath, {});
    let warpMarkersBuilt = [];
    if (warpPayload && typeof warpPayload === "object") {
        for (let name in warpPayload) {
            if (!Object.prototype.hasOwnProperty.call(warpPayload, name)) continue;
            let rec = warpPayload[name];
            if (!rec || typeof rec !== "object") continue;
            let mk = markerFromYzRecord(markerDefault, c.warpControlImg, name, rec);
            if (mk) warpMarkersBuilt.push(mk);
        }
    }
    let warpMarkers = dedupeYeMarkers(warpMarkersBuilt);
    if (warpMarkers.length > 0) {
        let L = JSON.parse(JSON.stringify(layerTemplate));
        L.layerName = YE_CANON_WARP_LAYER;
        L.layerPropertites = Object.assign({}, L.layerPropertites);
        L.controlConfig = Object.assign({}, L.controlConfig, {
            isEnabled: true,
            img: c.warpControlImg,
            openTitle: c.warpOpenTitle,
            closeTitle: c.warpCloseTitle
        });
        L.markers = warpMarkers;
        delete L.markers_default;
        out.push(L);
    }

    let homePayload = readJsonSafeFromPath(c.homeDataPath, {});
    let homeMarkersBuilt = [];
    if (homePayload && typeof homePayload === "object") {
        for (let owner in homePayload) {
            if (!Object.prototype.hasOwnProperty.call(homePayload, owner)) continue;
            let homes = homePayload[owner];
            if (!homes || typeof homes !== "object") continue;
            for (let homeName in homes) {
                if (!Object.prototype.hasOwnProperty.call(homes, homeName)) continue;
                let rec = homes[homeName];
                if (!rec || typeof rec !== "object") continue;
                if (!rec.isPublic) continue;
                let label = `${homeName} (${owner})`;
                let mk = markerFromYzRecord(markerDefault, c.homeControlImg, label, rec);
                if (mk) homeMarkersBuilt.push(mk);
            }
        }
    }
    let homeMarkers = dedupeYeMarkers(homeMarkersBuilt);
    if (homeMarkers.length > 0) {
        let L = JSON.parse(JSON.stringify(layerTemplate));
        L.layerName = YE_CANON_HOME_LAYER;
        L.layerPropertites = Object.assign({}, L.layerPropertites);
        L.controlConfig = Object.assign({}, L.controlConfig, {
            isEnabled: true,
            img: c.homeControlImg,
            openTitle: c.homeOpenTitle,
            closeTitle: c.homeCloseTitle
        });
        L.markers = homeMarkers;
        delete L.markers_default;
        out.push(L);
    }

    return out;
}

function syncYeEssentialToCustomMarkerLayersJson() {
    if (!yeEssentialSyncEnabled()) return;

    /** @type {{ customMarkerLayers?: unknown[] }} */
    let root;
    try {
        root = JSON.parse(customMarkerLayers_json.read());
    } catch (e) {
        root = { customMarkerLayers: [] };
    }
    root.customMarkerLayers ??= [];

    let { kept, harvestedWarp, harvestedHome } = partitionYeAliasLayers(root.customMarkerLayers);

    let yeLayers = buildYeEssentialLayersPayload(harvestedWarp, harvestedHome);

    /** @type {{ customMarkerLayers: unknown[] }} */
    let next = {
        customMarkerLayers: kept.concat(yeLayers)
    };

    try {
        File.writeTo(CUSTOM_MARKER_JSON_PATH, JSON.stringify(next, null, 4));
        customMarkerLayers_json.reload();
    } catch (e) {
        logger.error(`[BDSLM_JS] 写入 ${CUSTOM_MARKER_JSON_PATH} 失败: ${e}`);
    }
}

function scheduleYeEssentialSync() {
    if (!yeEssentialSyncEnabled()) return;
    let ms = getYeEssentialSyncConfig().debounceMs ?? 400;
    if (yeEssentialWatchTimer !== null) {
        clearTimeout(yeEssentialWatchTimer);
    }
    yeEssentialWatchTimer = setTimeout(() => {
        yeEssentialWatchTimer = null;
        syncYeEssentialToCustomMarkerLayersJson();
    }, ms);
}

function startYeEssentialDataWatchers() {
    if (yeFsWatchersStarted) return;
    if (!yeEssentialSyncEnabled()) return;
    if (!fsApi || typeof fsApi.watch !== "function") {
        logger.warn("[BDSLM_JS] yeEssentialSync: 当前环境无 fs.watch，请依赖启动时同步或通过 /slmrender reload");
        yeFsWatchersStarted = true;
        return;
    }

    let c = getYeEssentialSyncConfig();
    let watchDir = path.dirname(c.warpDataPath || c.homeDataPath || "./plugins/YEssential/data/homedata.json");
    watchDir = watchDir.split(path.sep).join("/");

    try {
        if (!File.exists(watchDir)) {
            logger.warn(`[BDSLM_JS] yeEssentialSync: 目录不存在，无法监听 (${watchDir})，数据更新后可用 /slmrender reload`);
        } else {
            fsApi.watch(watchDir, { persistent: true }, (_evt, fname) => {
                if (!fname) {
                    scheduleYeEssentialSync();
                    return;
                }
                let low = String(fname).toLowerCase();
                if (low === "homedata.json" || low === "warpdata.json") {
                    scheduleYeEssentialSync();
                }
            });
            logger.info(`[BDSLM_JS] 已监听目录 ${watchDir}，检测到 homedata.json / warpdata.json 变动时写入 customMarkerLayers.json`);
        }
    } catch (e) {
        logger.warn(`[BDSLM_JS] yeEssentialSync: fs.watch 失败: ${e}`);
    }

    yeFsWatchersStarted = true;
}

// nodejs原生http模块
// const http = require('http');
// const server = http.createServer((req, res) => {  
//     if (req.method === 'GET' && req.url === '/api/getPlayerMarkers') {
//         let writeOut = {};
//         writeOut["isEnabled"] = true;
//         writeOut["markers"] = [];
//         res.setHeader("Content-Type", "application/json");
//         var pls = mc.getOnlinePlayers();
//         for (let i = 0; i<pls.length; i++){
//             let item = {};
//             item["x"] = pls[i].blockPos.x;
//             item["z"] = pls[i].blockPos.z;
//             item["text"] = pls[i].realName;
//             item["image"] = "portrait.png";
//             item["imageAnchor"] = ["0.5", 1];
//             item["imageScale"] = "1";
//             item["textColor"] = "red";
//             item["offsetX"] = 0;
//             item["offsetY"] = 20;
//             item["font"] = "bold 20px Calibri,sans serif";
//             writeOut["markers"].push(item);
//         }

//         res.writeHead(200, { 'Content-Type': 'application/json' });    
//         res.end(JSON.stringify(writeOut));  
//     }
// });
// server.listen(5001, () => {
// });


// QuickJS httpServer
// function startHttp(){
//     var apiSvr = new HttpServer();
//     apiSvr.onGet(`/api/getPlayerMarkers`, function(req,res){
//         let writeOut = {};
//         writeOut["isEnabled"] = true;
//         writeOut["markers"] = [];
//         res.setHeader("Content-Type", "application/json");
//         var pls = mc.getOnlinePlayers();
//         for (let i = 0; i<pls.length; i++){
//             let item = {};
//             item["x"] = pls[i].blockPos.x;
//             item["z"] = pls[i].blockPos.z;
//             item["text"] = pls[i].realName;
//             item["image"] = "portrait.png";
//             item["imageAnchor"] = ["0.5", 1];
//             item["imageScale"] = "1";
//             item["textColor"] = "red";
//             item["offsetX"] = 0;
//             item["offsetY"] = 20;
//             item["font"] = "bold 20px Calibri,sans serif";
//             writeOut["markers"].push(item);
//         }
//         res.write(writeOut);
//     }).onError((req, resp) => {
//         logger.error(resp);
//     }).listen(`0.0.0.0`, 5001);
// }




// function addMarkers() {
//     let markers = JSON.parse(File.readFrom("./plugins/BDSLM_JS/markers.json"));
//     let writeOut = {};
//     writeOut["isEnabled"] = true;
//     writeOut["markers"] = [];
//     markers.forEach((item, _index) => {
//         item["image"] = "custom.pin.png";
//         item["imageAnchor"] = ["0.5", 1];
//         item["imageScale"] = "0.3";
//         item["textColor"] = "red";
//         item["offsetX"] = 0;
//         item["offsetY"] = 20;
//         item["font"] = "bold 20px Calibri,sans serif";
//         writeOut["markers"].push(item);
//     });
//     writeOut = "UnminedCustomMarkers = " + data.toJson(writeOut, 4);
//     File.writeTo("./plugins/BDSLM_JS/unmined-web/custom.markers.js", writeOut);
// }
