/**
 * 必须在 init-conf.js 之后加载。
 * 加载后先显示空闲标题；拉取 /api/playerlist 后：人数>0 则「N人在线 - 雁栖岛服务器」，否则回到空闲标题。
 * BDSLM 通过 ensureBdslmWebTitleAssets 从本 master 同步到 unmined-web（防渲染覆盖）。
 */
(function () {
    var IDLE = "实况地图 - 雁栖岛服务器";
    var REALM = "雁栖岛服务器";

    window.__BDSLM_TITLE_IDLE = IDLE;
    window.__BDSLM_TITLE_REALM = REALM;

    function applyIdle() {
        document.title = IDLE;
    }

    function applyOnline(n) {
        document.title = String(n) + "人在线 - " + REALM;
    }

    function refreshTitle() {
        if (typeof $ === "undefined" || typeof $.get !== "function") {
            applyIdle();
            return;
        }
        $.get("/api/playerlist")
            .done(function (data) {
                var n = Array.isArray(data) ? data.length : 0;
                if (n > 0) {
                    applyOnline(n);
                } else {
                    applyIdle();
                }
            })
            .fail(function () {
                applyIdle();
            });
    }

    applyIdle();
    refreshTitle();
    setInterval(refreshTitle, 30000);
})();
