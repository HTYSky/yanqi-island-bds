//暮光大陆服务器原创插件，作者：鱼肝
//论坛发布版本
const PLAYTIME_OBJ = "playtime";
let tickCount = 0;
let lastTime = Date.now();
let currentTPS = 20.0;
const STATUS_BAR_UID = 1001;
const DIRECTION_BAR_UID = 1002;
const STATUS_BAR_TAG = "hide_statusbar";
const CONFIG_FILE = "plugins/MGStatusBar/StatusBarConfig.json";
let config = null;
let hasMGTeam = false;
let playerDeathTimes = {};
let playerNetherPortalPositions = {};
const TOTAL_SPACES = 81;
const DEATH_ICON = "\ue2ce";
const RESPAWN_ICON = "\ue2cd";
const LODESTONE_ICON = "\ue2cf";
const ANCHOR_A_ICON = "\ue2ef";
const ANCHOR_B_ICON = "\ue2ee";
const ANCHOR_C_ICON = "\ue2ed";
const NORTH_ICON = "\ue2fc";
const PORTAL_ICON = "\ue2cc";
const TRACKER_ICON = "\ue2ec";
const RESPAWN_MAX_DISTANCE = 200;
const DEATH_DISPLAY_DURATION = 5 * 60 * 1000;
let playerIconPositions = {};
const SMOOTH_MOVE_DURATION = 500;
const SMOOTH_MOVE_INTERVAL = 50;
// 倒计时相关变量
let timerTotalSeconds = 0;
let timerRemainingSeconds = 0;
let timerInterval = null;
let timerFlashState = false;

// 玩家定位器相关变量
let trackedPlayer = null;
let trackedPlayerPos = null;
let trackerInterval = null;
function getPlayerSettings(uuid) {
const defaultSettings = {
isHidden: false,
showName: true,
showOnlineCount: true,
showBotSeparately: true,
showMoney: false,
showTeamFund: true,
showPlaytime: true,
showFault: true,
showAuxiliary: true,
showOnlineTeammates: false,
showDirectionBar: true,
lodestonePos: null
};
const settings = config.get(uuid);
if (typeof settings === 'boolean') {
return Object.assign({}, defaultSettings, { isHidden: settings });
}
if (!settings || typeof settings !== 'object') {
return defaultSettings;
}
return Object.assign({}, defaultSettings, settings);
}
mc.listen("onServerStarted", () => {
    mc.newScoreObjective(PLAYTIME_OBJ, PLAYTIME_OBJ);
    try {
        config = new JsonConfigFile(CONFIG_FILE);
    } catch (e) {
        config = new JsonConfigFile(CONFIG_FILE, "{}");
    }
    hasMGTeam = !!ll.getPluginInfo("MGTeam");
    if (hasMGTeam) {
        logger.info("[MGStatusBar] 检测到 MGTeam 插件，玩家加入团队后可显示相关团队信息。");
    } else {
        logger.info("[MGStatusBar] 未检测到 MGTeam 插件，所有团队联动功能将不启用。");
    }
    if (!config.get("serverAnchors")) {
        config.set("serverAnchors", {
            anchorA: null,
            anchorB: null,
            anchorC: null
        });
    }
    registerCommand();
    registerServerAnchorCommands();
});
mc.listen("onPlayerDie", (player, source) => {
playerDeathTimes[player.uuid] = Date.now();
});

mc.listen("onChangeDim", (player, dimid) => {
try {
if (dimid === 1) {
const maxAttempts = 40;
let attempts = 0;
const checkInterval = setInterval(() => {
attempts++;
try {
if (player && player.pos && player.pos.dimid === 1) {
const pos = player.pos;
playerNetherPortalPositions[player.uuid] = {
x: pos.x,
y: pos.y,
z: pos.z,
dimid: 1
};
clearInterval(checkInterval);
return;
}
} catch (e) {
logger.error("[MGStatusBar] 检测传送门位置失败: " + e);
}
if (attempts >= maxAttempts) {
clearInterval(checkInterval);
}
}, 500);
}
} catch (e) {
logger.error("[MGStatusBar] 记录传送门位置失败: " + e);
}
});
function saveLodestonePos(player, block) {
const uuid = player.uuid;
const settings = getPlayerSettings(uuid);
const newLodestonePos = {
x: block.pos.x,
y: block.pos.y,
z: block.pos.z,
dimid: block.pos.dimid
};
const existingLodestonePos = settings.lodestonePos;
if (existingLodestonePos) {
if (existingLodestonePos.x === newLodestonePos.x && existingLodestonePos.y === newLodestonePos.y && existingLodestonePos.z === newLodestonePos.z && existingLodestonePos.dimid === newLodestonePos.dimid) {
return;
}
}
const newSettings = Object.assign({}, settings, {
lodestonePos: newLodestonePos
});
try {
config.set(uuid, newSettings);
player.tell("§a[MGStatusBar] 磁石锚点已设置，再次点击以删除");
} catch (e) {
logger.error("[MGStatusBar] 保存磁石锚点失败: " + e);
}
}
mc.listen("onUseItemOn", (player, item, block, side, pos) => {
try {
if (!player || !block) return true;
const uuid = player.uuid;
const settings = getPlayerSettings(uuid);
const existingLodestonePos = settings.lodestonePos;
if (existingLodestonePos) {
if (existingLodestonePos.x === block.pos.x && existingLodestonePos.y === block.pos.y && existingLodestonePos.z === block.pos.z && existingLodestonePos.dimid === block.pos.dimid) {
const newSettings = Object.assign({}, settings, {
lodestonePos: null
});
try {
config.set(uuid, newSettings);
player.tell("§a[MGStatusBar] 磁石锚点已删除");
} catch (e) {
logger.error("[MGStatusBar] 删除磁石锚点失败: " + e);
}
return true;
}
}
if (item) {
let isCompass = false;
let itemType = item.type || "";
let itemId = item.id || "";
let itemName = item.name || "";
if (itemType === "compass" || itemType === "minecraft:compass" || itemId === "compass" || itemName === "compass" || itemName.includes("compass")) {
isCompass = true;
}
let isLodestone = false;
let blockName = block.name || "";
let blockType = block.type || "";
let blockId = block.id || "";
if (blockName === "lodestone" || blockName === "minecraft:lodestone" || blockType === "lodestone" || blockType === "minecraft:lodestone" || blockId === "lodestone" || blockId === "minecraft:lodestone") {
isLodestone = true;
}
if (isCompass && isLodestone) {
saveLodestonePos(player, block);
}
}
} catch (e) {
logger.error("[MGStatusBar] 处理磁石事件失败: " + e);
}
return true;
});
function registerCommand() {
const cmd = mc.newCommand("statusbar", "开关状态栏显示", PermType.Any);
cmd.overload();
cmd.setCallback((_cmd, ori, out, _res) => {
if (!ori.player) {
out.error("该指令只能由玩家执行");
return;
}
const player = ori.player;
const uuid = player.uuid;
const settings = getPlayerSettings(uuid);
const form = mc.newCustomForm();
form.setTitle("§d§lMGStatusBar-Settings");
form.addSwitch("§b\ue2d6 总开关：状态栏显示", !settings.isHidden);
        form.addSwitch("§b\ue2d2 玩家名称", settings.showName);
        form.addSwitch("§b\ue2d3 在线人数", settings.showOnlineCount);
        form.addSwitch("§b\ue2dc └──→区分玩家与假人", settings.showBotSeparately);
        form.addSwitch("§b\ue2d4 个人钱包余额", settings.showMoney);
        form.addSwitch("§b\ue2d5 在线时长", settings.showPlaytime);
        form.addSwitch("§b\ue2de 异常提醒", settings.showFault);
        form.addSwitch("§b\ue2cb 辅助功能", settings.showAuxiliary);
        form.addSwitch("§b\ue2cd 定位栏", settings.showDirectionBar);
        let canShowTeamOption = false;
        if (hasMGTeam) {
            try {
                const getOrgNum = ll.import('orgEX', 'orgEX_getPlayerOrgNum');
                if (getOrgNum && getOrgNum(player.xuid)) {
                    canShowTeamOption = true;
                }
            } catch (e) {}
        }
        if (canShowTeamOption) {
            form.addSwitch("§b§b\ue2d4 团队钱包余额（显示在个人钱包余额之后，需要开启个人余额显示）", settings.showTeamFund);
        }
player.sendForm(form, (player, data) => {
if (data === null || data === undefined) {
player.tell("§c[MGStatusBar] 表单已关闭，未进行修改");
return;
}
let idx = 0;
let newSettings = {
isHidden: !data[idx++],
showName: data[idx++],
showOnlineCount: data[idx++],
showBotSeparately: data[idx++],
showMoney: data[idx++],
showPlaytime: data[idx++],
showFault: data[idx++],
showAuxiliary: data[idx++],
showDirectionBar: data[idx++],
showTeamFund: settings.showTeamFund,
showOnlineTeammates: settings.showOnlineTeammates,
lodestonePos: settings.lodestonePos
};
if (canShowTeamOption) {
newSettings.showTeamFund = data[idx++];
}
try {
config.set(uuid, newSettings);
} catch (e) {
logger.error("[MGStatusBar] 保存配置文件失败: " + e);
}
if (newSettings.isHidden) {
player.addTag(STATUS_BAR_TAG);
player.removeBossBar(STATUS_BAR_UID);
player.tell("§a[MGStatusBar] 状态栏已隐藏");
} else {
player.removeTag(STATUS_BAR_TAG);
player.tell("§a[MGStatusBar] 设置已应用");
}
});
});
cmd.setup();
}
function registerServerAnchorCommands() {
const cmdSet = mc.newCommand("barlandset", "放置服务器锚点", PermType.GameMasters);
cmdSet.overload();
cmdSet.setCallback((_cmd, ori, out, _res) => {
if (!ori.player) {
out.error("该指令只能由玩家执行");
return;
}
const player = ori.player;
const pos = player.pos;
const serverAnchors = config.get("serverAnchors") || {};
const anchorOrder = ['anchorA', 'anchorB', 'anchorC'];
const anchorLabels = {anchorA: 'A', anchorB: 'B', anchorC: 'C'};
let targetAnchor = null;
// 查找空的锚点位置
for (let i = 0; i < anchorOrder.length; i++) {
const key = anchorOrder[i];
if (!serverAnchors[key]) {
targetAnchor = key;
break;
}
}
// 如果没有空位，查找最早的锚点覆盖
if (!targetAnchor) {
let earliestTime = Infinity;
let earliestAnchor = null;
for (let i = 0; i < anchorOrder.length; i++) {
const key = anchorOrder[i];
const anchor = serverAnchors[key];
if (anchor && anchor.placeTime && anchor.placeTime < earliestTime) {
earliestTime = anchor.placeTime;
earliestAnchor = key;
}
}
targetAnchor = earliestAnchor || 'anchorA';
}
// 放置锚点
serverAnchors[targetAnchor] = {
x: pos.x,
y: pos.y,
z: pos.z,
dimid: pos.dimid,
placeTime: Date.now()
};
config.set("serverAnchors", serverAnchors);
player.tell("§a[MGStatusBar] 服务器锚点" + anchorLabels[targetAnchor] + "已设置: " + Math.floor(pos.x) + ", " + Math.floor(pos.y) + ", " + Math.floor(pos.z));
});
cmdSet.setup();
const cmdRemove = mc.newCommand("barlandremove", "删除所有服务器锚点", PermType.GameMasters);
cmdRemove.overload();
cmdRemove.setCallback((_cmd, ori, out, _res) => {
config.set("serverAnchors", {
anchorA: null,
anchorB: null,
anchorC: null
});
const msg = "§a[MGStatusBar] 所有服务器锚点已删除";
if (ori.player) {
ori.player.tell(msg);
} else {
out.success(msg);
}
});
cmdRemove.setup();
const cmdTimer = mc.newCommand("bartimer", "设置状态栏倒计时", PermType.GameMasters);
cmdTimer.mandatory("seconds", ParamType.Int);
cmdTimer.overload(["seconds"]);
cmdTimer.setCallback((_cmd, ori, out, _res) => {
const seconds = _res.seconds || 0;
if (seconds <= 0) {
// 停止倒计时
if (timerInterval) {
clearInterval(timerInterval);
timerInterval = null;
}
timerTotalSeconds = 0;
timerRemainingSeconds = 0;
const msg = "§a[MGStatusBar] 倒计时已停止";
if (ori.player) {
ori.player.tell(msg);
} else {
out.success(msg);
}
return;
}
// 启动新倒计时
timerTotalSeconds = seconds;
timerRemainingSeconds = seconds;
if (timerInterval) {
clearInterval(timerInterval);
}
timerInterval = setInterval(() => {
timerRemainingSeconds--;
if (timerRemainingSeconds <= 0) {
timerRemainingSeconds = 0;
clearInterval(timerInterval);
timerInterval = null;
// 倒计时结束后1秒清零血条
setTimeout(() => {
timerTotalSeconds = 0;
timerRemainingSeconds = 0;
}, 1000);
}
}, 1000);
const msg = "§a[MGStatusBar] 倒计时已设置为 " + seconds + " 秒";
if (ori.player) {
ori.player.tell(msg);
} else {
out.success(msg);
}
});
cmdTimer.setup();

const cmdTracker = mc.newCommand("barpl", "追踪玩家位置", PermType.GameMasters);
cmdTracker.mandatory("playerName", ParamType.String);
cmdTracker.overload(["playerName"]);
cmdTracker.setCallback((_cmd, ori, out, _res) => {
if (!ori.player) {
out.error("该指令只能由玩家执行");
return;
}
const player = ori.player;
const playerName = _res.playerName;

const onlinePlayers = mc.getOnlinePlayers();
let targetPlayer = null;
for (let pl of onlinePlayers) {
if (pl.name === playerName) {
targetPlayer = pl;
break;
}
}

if (!targetPlayer) {
if (trackerInterval) {
clearInterval(trackerInterval);
trackerInterval = null;
}
trackedPlayer = null;
trackedPlayerPos = null;
player.tell("§c[MGStatusBar] 未找到该玩家，已停止追踪");
return;
}

trackedPlayer = playerName;
trackedPlayerPos = {
x: targetPlayer.pos.x,
y: targetPlayer.pos.y,
z: targetPlayer.pos.z,
dimid: targetPlayer.pos.dimid
};

if (trackerInterval) {
clearInterval(trackerInterval);
}

trackerInterval = setInterval(() => {
try {
const currentOnlinePlayers = mc.getOnlinePlayers();
let updatedPlayer = null;
for (let pl of currentOnlinePlayers) {
if (pl.name === trackedPlayer) {
updatedPlayer = pl;
break;
}
}

if (!updatedPlayer) {
clearInterval(trackerInterval);
trackerInterval = null;
trackedPlayer = null;
trackedPlayerPos = null;
return;
}

trackedPlayerPos = {
x: updatedPlayer.pos.x,
y: updatedPlayer.pos.y,
z: updatedPlayer.pos.z,
dimid: updatedPlayer.pos.dimid
};
} catch (e) {}
}, 1000);

player.tell("§a[MGStatusBar] 已开始追踪玩家: " + playerName);
});
cmdTracker.setup();
}
mc.listen("onTick", () => {
tickCount++;
const now = Date.now();
if (now - lastTime >= 1000) {
const diff = now - lastTime;
currentTPS = tickCount / (diff / 1000.0);
if (currentTPS > 20.0) currentTPS = 20.0;
tickCount = 0;
lastTime = now;
}
});
setInterval(() => {
try {
const onlinePlayers = mc.getOnlinePlayers();
onlinePlayers.forEach(player => {
try {
const currentValue = player.getScore(PLAYTIME_OBJ) || 0;
player.setScore(PLAYTIME_OBJ, currentValue + 1);
} catch (playerError) {}
});
} catch (error) {}
}, 60 * 1000);
function buildMainBar(player) {
let modules = [];
const settings = getPlayerSettings(player.uuid);
if (settings.showName) {
let nameModule = "";
if (player.isOP()) {
nameModule += "\ue2d6 ";
} else {
nameModule += "\ue2d2 ";
}
nameModule += "§d" + player.name;
modules.push(nameModule);
}
if (settings.showOnlineCount) {
const onlinePlayers = mc.getOnlinePlayers();
let realCount = 0;
let botCount = 0;
for (let pl of onlinePlayers) {
if (pl.isSimulatedPlayer()) {
botCount++;
} else {
realCount++;
}
}
let onlineModule = "";
if (settings.showBotSeparately) {
onlineModule = "§a\ue2d3 " + realCount;
if (botCount > 0) {
onlineModule += " §7\ue2dc " + botCount;
}
} else {
onlineModule = "§a\ue2d3 " + (realCount + botCount);
}
        if (hasMGTeam && settings.showAuxiliary && settings.showOnlineTeammates) {
            try {
                const getOrgNum = ll.import('orgEX', 'orgEX_getPlayerOrgNum');
                if (getOrgNum) {
                    const orgId = getOrgNum(player.xuid);
                    if (orgId) {
                        let teammateCount = 0;
                        for (let p of onlinePlayers) {
                            if (p.xuid !== player.xuid) {
                                const pOrgId = getOrgNum(p.xuid);
                                if (pOrgId === orgId) {
                                    teammateCount++;
                                }
                            }
                        }
                        if (teammateCount > 0) {
                            onlineModule += " §6\ue2cb " + teammateCount;
                        }
                    }
                }
            } catch (e) {}
        }
modules.push(onlineModule);
}
if (settings.showMoney) {
let moneyValue = null;
try {
moneyValue = player.getMoney();
} catch (e) {
moneyValue = null;
}
if (moneyValue !== null && moneyValue !== undefined) {
let isTeamFundActive = false;
let teamMoney = null;
            if (hasMGTeam && settings.showTeamFund) {
                try {
                    const getOrgNum = ll.import('orgEX', 'orgEX_getPlayerOrgNum');
                    const getOrgMoney = ll.import('orgEX', 'orgEX_orgGetMoney');
                    const getFundStatus = ll.import('MGteam', 'MGteam_getFundConsumeStatus');
                    if (getOrgNum && getOrgMoney) {
                        const orgId = getOrgNum(player.xuid);
                        if (orgId) {
                            teamMoney = getOrgMoney(orgId);
                            if (getFundStatus) {
                                isTeamFundActive = !!getFundStatus(player.xuid);
                            }
                        }
                    }
                } catch (e) {}
            }
let personalColor = isTeamFundActive ? "§f" : "§e";
let teamColor = isTeamFundActive ? "§e" : "§f";
let moneyModule = "§e\ue2d4 " + personalColor + moneyValue;
if (teamMoney !== null && teamMoney !== undefined) {
moneyModule += "§f/" + teamColor + teamMoney;
}
modules.push(moneyModule);
}
}
if (settings.showPlaytime) {
let playtimeValue = null;
try {
playtimeValue = player.getScore(PLAYTIME_OBJ);
} catch (e) {
playtimeValue = null;
}
if (playtimeValue !== null && playtimeValue !== undefined) {
modules.push("§b\ue2d5 " + playtimeValue + "min");
}
}
if (settings.showFault) {
let faults = [];
try {
const entities = mc.getAllEntities();
const entityCount = entities.length;
if (entityCount > 600) {
faults.push("\ue2d8§c " + entityCount);
}
} catch (e) {}
const tpsValue = Math.ceil(currentTPS);
if (tpsValue < 18) {
faults.push("\ue2dd§c " + tpsValue + "tk");
}
try {
const device = player.getDevice();
const pingValue = Math.round(device.lastPing || 0);
if (pingValue > 100) {
faults.push("§c\ue2de " + pingValue + "ms");
}
} catch (e) {}
if (faults.length > 0) {
modules.push(faults.join(" "));
}
}
// 添加倒计时显示（隶属于辅助功能）
if (settings.showAuxiliary && timerRemainingSeconds > 0) {
const minutes = Math.floor(timerRemainingSeconds / 60);
const seconds = timerRemainingSeconds % 60;
const timeStr = minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
modules.push("§c\ue2eb " + timeStr);
}
return modules.join(" §i|| ");
}
function calculateDirectionOffset(player, targetPos) {
if (!targetPos) return null;

const currentPos = player.pos;

// 检查维度是否相同
let adjustedTargetPos = targetPos;

// 只有磁石锚点、死亡点、世界锚点参与维度换算
// 检查是否是这些类型的锚点（通过检查dimid属性）
if (targetPos.dimid !== undefined) {
const playerDim = currentPos.dimid;
const targetDim = targetPos.dimid;

// 检查是否一个在末地，一个不在末地
if ((playerDim === 2 && targetDim !== 2) || (playerDim !== 2 && targetDim === 2)) {
// 末地不参与换算，返回null不显示
return null;
}

// 维度换算：主世界 <-> 下界
if (playerDim !== targetDim) {
adjustedTargetPos = JSON.parse(JSON.stringify(targetPos)); // 深拷贝

if (playerDim === 0 && targetDim === 1) {
// 玩家在主世界，目标在下界：主世界坐标 = 下界坐标 * 8
adjustedTargetPos.x = targetPos.x * 8;
adjustedTargetPos.z = targetPos.z * 8;
} else if (playerDim === 1 && targetDim === 0) {
// 玩家在下界，目标在主世界：下界坐标 = 主世界坐标 / 8
adjustedTargetPos.x = targetPos.x / 8;
adjustedTargetPos.z = targetPos.z / 8;
}
// 保持y坐标不变
}
}

const dx = adjustedTargetPos.x - currentPos.x;
const dz = adjustedTargetPos.z - currentPos.z;

if (dx === 0 && dz === 0) return null;

const absAngle = Math.atan2(dz, dx) * (180 / Math.PI);
const playerYaw = player.direction.yaw;
let facingAngle = playerYaw + 90;
// 优化角度调整，使用取模运算代替while循环
facingAngle = (facingAngle + 180) % 360 - 180;
let relAngle = absAngle - facingAngle;
// 优化角度调整，使用取模运算代替while循环
relAngle = (relAngle + 180) % 360 - 180;

let offset = Math.round(relAngle);
if (offset < -40) offset = -40;
if (offset > 40) offset = 40;

return 40 + offset;
}

// 处理单个图标的碰撞检测
function resolveCollision(offset, offsetMap, maxAttempts = TOTAL_SPACES) {
function isOccupied(pos) {
return offsetMap.has(pos) || offsetMap.has(pos + 1);
}
if (!isOccupied(offset)) {
return offset;
}

let finalOffset = offset;
let attempts = 0;
let direction = 1;

while (isOccupied(finalOffset) && attempts < maxAttempts) {
if (finalOffset > 0 && finalOffset < TOTAL_SPACES - 2) {
finalOffset += direction;
direction = -direction;
} else if (finalOffset <= 0) {
finalOffset++;
direction = 1;
} else if (finalOffset >= TOTAL_SPACES - 2) {
finalOffset--;
direction = -1;
} else {
break;
}
attempts++;
}

return finalOffset;
}

// 处理单个图标的平滑移动
function updateSmoothMovement(iconState, targetOffset) {
if (targetOffset === null) {
return null;
}

if (iconState === null) {
return targetOffset;
}

if (iconState === targetOffset) {
return iconState;
}

const distance = Math.abs(targetOffset - iconState);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));

if (iconState < targetOffset) {
return Math.min(iconState + step, targetOffset);
} else if (iconState > targetOffset) {
return Math.max(iconState - step, targetOffset);
}

return iconState;
}
function buildDeathDirectionBar(player) {
const settings = getPlayerSettings(player.uuid);
if (!settings.showDirectionBar) {
return "";
}

try {
const deathPos = player.lastDeathPos;
const respawnPos = player.getRespawnPosition();
const lodestonePos = settings.lodestonePos;
const serverAnchors = config.get("serverAnchors") || {};

let deathOffset = null;
let respawnOffset = null;
let lodestoneOffset = null;
let anchorAOffset = null;
let anchorBOffset = null;
let anchorCOffset = null;
let northOffset = null;
let portalOffset = null;
let trackerOffset = null;
try {
const currentPos = player.pos;
const northPos = {
x: currentPos.x,
y: currentPos.y,
z: currentPos.z - 100,
dimid: currentPos.dimid
};
northOffset = calculateDirectionOffset(player, northPos);
// 北方图标只在玩家看向北方附近时显示
// 检查计算出的偏移是否在中间附近（北方方向）
// 中间位置是40，所以当偏移在10-70之间时显示
if (northOffset < 10 || northOffset > 70) {
northOffset = null;
}
} catch (e) {}

// 计算传送门位置方向（只在下界显示）
try {
const currentPos = player.pos;
// 只有在下界时才显示传送门图标
if (currentPos.dimid === 1) {
const portalPos = playerNetherPortalPositions[player.uuid];
if (portalPos) {
portalOffset = calculateDirectionOffset(player, portalPos);
}
}
} catch (e) {}

if (deathPos) {
const deathTime = playerDeathTimes[player.uuid];
if (deathTime && (Date.now() - deathTime <= DEATH_DISPLAY_DURATION)) {
deathOffset = calculateDirectionOffset(player, deathPos);
}
}
if (respawnPos) {
try {
if (respawnPos.dimid === player.pos.dimid) {
const distance = player.distanceTo(respawnPos);
if (distance <= RESPAWN_MAX_DISTANCE) {
respawnOffset = calculateDirectionOffset(player, respawnPos);
}
}
} catch (e) {}
}
if (lodestonePos) {
try {
lodestoneOffset = calculateDirectionOffset(player, lodestonePos);
} catch (e) {
logger.error("[MGStatusBar] 磁石偏移计算失败: " + e);
}
}
if (serverAnchors.anchorA) {
try {
anchorAOffset = calculateDirectionOffset(player, serverAnchors.anchorA);
} catch (e) {}
}
if (serverAnchors.anchorB) {
try {
anchorBOffset = calculateDirectionOffset(player, serverAnchors.anchorB);
} catch (e) {}
}
if (serverAnchors.anchorC) {
try {
anchorCOffset = calculateDirectionOffset(player, serverAnchors.anchorC);
} catch (e) {}
}
if (trackedPlayerPos) {
try {
trackerOffset = calculateDirectionOffset(player, trackedPlayerPos);
} catch (e) {}
}
if (deathOffset === null && respawnOffset === null && lodestoneOffset === null && anchorAOffset === null && anchorBOffset === null && anchorCOffset === null && northOffset === null && portalOffset === null && trackerOffset === null) {
if (playerIconPositions[player.uuid]) {
delete playerIconPositions[player.uuid];
}
return "";
}
const offsets = [deathOffset, respawnOffset, lodestoneOffset, anchorAOffset, anchorBOffset, anchorCOffset, northOffset, portalOffset, trackerOffset].filter(o => o !== null);
const uniqueOffsets = new Set(offsets);
if (offsets.length !== uniqueOffsets.size) {
const offsetMap = new Set();
if (deathOffset !== null) {
const finalOffset = resolveCollision(deathOffset, offsetMap);
offsetMap.add(finalOffset);
offsetMap.add(finalOffset + 1);
deathOffset = finalOffset;
}
if (respawnOffset !== null) {
const finalOffset = resolveCollision(respawnOffset, offsetMap);
offsetMap.add(finalOffset);
offsetMap.add(finalOffset + 1);
respawnOffset = finalOffset;
}
if (lodestoneOffset !== null) {
const finalOffset = resolveCollision(lodestoneOffset, offsetMap);
offsetMap.add(finalOffset);
offsetMap.add(finalOffset + 1);
lodestoneOffset = finalOffset;
}
if (anchorAOffset !== null) {
const finalOffset = resolveCollision(anchorAOffset, offsetMap);
offsetMap.add(finalOffset);
offsetMap.add(finalOffset + 1);
anchorAOffset = finalOffset;
}
if (anchorBOffset !== null) {
const finalOffset = resolveCollision(anchorBOffset, offsetMap);
offsetMap.add(finalOffset);
offsetMap.add(finalOffset + 1);
anchorBOffset = finalOffset;
}
if (anchorCOffset !== null) {
const finalOffset = resolveCollision(anchorCOffset, offsetMap);
offsetMap.add(finalOffset);
offsetMap.add(finalOffset + 1);
anchorCOffset = finalOffset;
}
if (northOffset !== null) {
const finalOffset = resolveCollision(northOffset, offsetMap);
offsetMap.add(finalOffset);
offsetMap.add(finalOffset + 1);
northOffset = finalOffset;
}
if (portalOffset !== null) {
const finalOffset = resolveCollision(portalOffset, offsetMap);
offsetMap.add(finalOffset);
offsetMap.add(finalOffset + 1);
portalOffset = finalOffset;
}
if (trackerOffset !== null) {
const finalOffset = resolveCollision(trackerOffset, offsetMap);
offsetMap.add(finalOffset);
offsetMap.add(finalOffset + 1);
trackerOffset = finalOffset;
}
}
const uuid = player.uuid;
if (!playerIconPositions[uuid]) {
playerIconPositions[uuid] = {
death: deathOffset,
respawn: respawnOffset,
lodestone: lodestoneOffset,
anchorA: anchorAOffset,
anchorB: anchorBOffset,
anchorC: anchorCOffset,
north: northOffset,
portal: portalOffset,
tracker: trackerOffset,
lastUpdate: Date.now()
};
} else {
const currentTime = Date.now();
const elapsed = currentTime - playerIconPositions[uuid].lastUpdate;
if (elapsed >= SMOOTH_MOVE_INTERVAL) {
if (deathOffset !== null) {
if (playerIconPositions[uuid].death !== deathOffset) {
if (playerIconPositions[uuid].death === null) {
playerIconPositions[uuid].death = deathOffset;
} else {
const distance = Math.abs(deathOffset - playerIconPositions[uuid].death);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));
if (playerIconPositions[uuid].death < deathOffset) {
playerIconPositions[uuid].death = Math.min(playerIconPositions[uuid].death + step, deathOffset);
} else if (playerIconPositions[uuid].death > deathOffset) {
playerIconPositions[uuid].death = Math.max(playerIconPositions[uuid].death - step, deathOffset);
}
}
}
} else {
playerIconPositions[uuid].death = null;
}
if (respawnOffset !== null) {
if (playerIconPositions[uuid].respawn !== respawnOffset) {
if (playerIconPositions[uuid].respawn === null) {
playerIconPositions[uuid].respawn = respawnOffset;
} else {
const distance = Math.abs(respawnOffset - playerIconPositions[uuid].respawn);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));
if (playerIconPositions[uuid].respawn < respawnOffset) {
playerIconPositions[uuid].respawn = Math.min(playerIconPositions[uuid].respawn + step, respawnOffset);
} else if (playerIconPositions[uuid].respawn > respawnOffset) {
playerIconPositions[uuid].respawn = Math.max(playerIconPositions[uuid].respawn - step, respawnOffset);
}
}
}
} else {
playerIconPositions[uuid].respawn = null;
}
if (lodestoneOffset !== null) {
if (playerIconPositions[uuid].lodestone !== lodestoneOffset) {
if (playerIconPositions[uuid].lodestone === null) {
playerIconPositions[uuid].lodestone = lodestoneOffset;
} else {
const distance = Math.abs(lodestoneOffset - playerIconPositions[uuid].lodestone);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));
if (playerIconPositions[uuid].lodestone < lodestoneOffset) {
playerIconPositions[uuid].lodestone = Math.min(playerIconPositions[uuid].lodestone + step, lodestoneOffset);
} else if (playerIconPositions[uuid].lodestone > lodestoneOffset) {
playerIconPositions[uuid].lodestone = Math.max(playerIconPositions[uuid].lodestone - step, lodestoneOffset);
}
}
}
} else {
playerIconPositions[uuid].lodestone = null;
}
if (anchorAOffset !== null) {
if (playerIconPositions[uuid].anchorA !== anchorAOffset) {
if (playerIconPositions[uuid].anchorA === null) {
playerIconPositions[uuid].anchorA = anchorAOffset;
} else {
const distance = Math.abs(anchorAOffset - playerIconPositions[uuid].anchorA);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));
if (playerIconPositions[uuid].anchorA < anchorAOffset) {
playerIconPositions[uuid].anchorA = Math.min(playerIconPositions[uuid].anchorA + step, anchorAOffset);
} else if (playerIconPositions[uuid].anchorA > anchorAOffset) {
playerIconPositions[uuid].anchorA = Math.max(playerIconPositions[uuid].anchorA - step, anchorAOffset);
}
}
}
} else {
playerIconPositions[uuid].anchorA = null;
}
if (anchorBOffset !== null) {
if (playerIconPositions[uuid].anchorB !== anchorBOffset) {
if (playerIconPositions[uuid].anchorB === null) {
playerIconPositions[uuid].anchorB = anchorBOffset;
} else {
const distance = Math.abs(anchorBOffset - playerIconPositions[uuid].anchorB);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));
if (playerIconPositions[uuid].anchorB < anchorBOffset) {
playerIconPositions[uuid].anchorB = Math.min(playerIconPositions[uuid].anchorB + step, anchorBOffset);
} else if (playerIconPositions[uuid].anchorB > anchorBOffset) {
playerIconPositions[uuid].anchorB = Math.max(playerIconPositions[uuid].anchorB - step, anchorBOffset);
}
}
}
} else {
playerIconPositions[uuid].anchorB = null;
}
if (anchorCOffset !== null) {
if (playerIconPositions[uuid].anchorC !== anchorCOffset) {
if (playerIconPositions[uuid].anchorC === null) {
playerIconPositions[uuid].anchorC = anchorCOffset;
} else {
const distance = Math.abs(anchorCOffset - playerIconPositions[uuid].anchorC);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));
if (playerIconPositions[uuid].anchorC < anchorCOffset) {
playerIconPositions[uuid].anchorC = Math.min(playerIconPositions[uuid].anchorC + step, anchorCOffset);
} else if (playerIconPositions[uuid].anchorC > anchorCOffset) {
playerIconPositions[uuid].anchorC = Math.max(playerIconPositions[uuid].anchorC - step, anchorCOffset);
}
}
}
} else {
playerIconPositions[uuid].anchorC = null;
}
if (northOffset !== null) {
if (playerIconPositions[uuid].north !== northOffset) {
if (playerIconPositions[uuid].north === null) {
playerIconPositions[uuid].north = northOffset;
} else {
const distance = Math.abs(northOffset - playerIconPositions[uuid].north);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));
if (playerIconPositions[uuid].north < northOffset) {
playerIconPositions[uuid].north = Math.min(playerIconPositions[uuid].north + step, northOffset);
} else if (playerIconPositions[uuid].north > northOffset) {
playerIconPositions[uuid].north = Math.max(playerIconPositions[uuid].north - step, northOffset);
}
}
}
} else {
playerIconPositions[uuid].north = null;
}
if (portalOffset !== null) {
if (playerIconPositions[uuid].portal !== portalOffset) {
if (playerIconPositions[uuid].portal === null) {
playerIconPositions[uuid].portal = portalOffset;
} else {
const distance = Math.abs(portalOffset - playerIconPositions[uuid].portal);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));
if (playerIconPositions[uuid].portal < portalOffset) {
playerIconPositions[uuid].portal = Math.min(playerIconPositions[uuid].portal + step, portalOffset);
} else if (playerIconPositions[uuid].portal > portalOffset) {
playerIconPositions[uuid].portal = Math.max(playerIconPositions[uuid].portal - step, portalOffset);
}
}
}
} else {
playerIconPositions[uuid].portal = null;
}
if (trackerOffset !== null) {
if (playerIconPositions[uuid].tracker !== trackerOffset) {
if (playerIconPositions[uuid].tracker === null) {
playerIconPositions[uuid].tracker = trackerOffset;
} else {
const distance = Math.abs(trackerOffset - playerIconPositions[uuid].tracker);
const step = Math.max(1, Math.min(distance, Math.ceil(distance * (SMOOTH_MOVE_INTERVAL / SMOOTH_MOVE_DURATION) * 10)));
if (playerIconPositions[uuid].tracker < trackerOffset) {
playerIconPositions[uuid].tracker = Math.min(playerIconPositions[uuid].tracker + step, trackerOffset);
} else if (playerIconPositions[uuid].tracker > trackerOffset) {
playerIconPositions[uuid].tracker = Math.max(playerIconPositions[uuid].tracker - step, trackerOffset);
}
}
}
} else {
playerIconPositions[uuid].tracker = null;
}

playerIconPositions[uuid].lastUpdate = currentTime;
}
}
const smoothDeathOffset = playerIconPositions[uuid].death;
const smoothRespawnOffset = playerIconPositions[uuid].respawn;
const smoothLodestoneOffset = playerIconPositions[uuid].lodestone;
const smoothAnchorAOffset = playerIconPositions[uuid].anchorA;
const smoothAnchorBOffset = playerIconPositions[uuid].anchorB;
const smoothAnchorCOffset = playerIconPositions[uuid].anchorC;
const smoothNorthOffset = playerIconPositions[uuid].north;
const smoothPortalOffset = playerIconPositions[uuid].portal;
const smoothTrackerOffset = playerIconPositions[uuid].tracker;
let spaces = "";
for (let i = 0; i < TOTAL_SPACES; i++) {
if (i === smoothDeathOffset) {
spaces += DEATH_ICON;
} else if (i === smoothRespawnOffset) {
spaces += RESPAWN_ICON;
} else if (i === smoothLodestoneOffset) {
spaces += LODESTONE_ICON;
} else if (i === smoothAnchorAOffset) {
spaces += ANCHOR_A_ICON;
} else if (i === smoothAnchorBOffset) {
spaces += ANCHOR_B_ICON;
} else if (i === smoothAnchorCOffset) {
spaces += ANCHOR_C_ICON;
} else if (i === smoothNorthOffset) {
spaces += NORTH_ICON;
} else if (i === smoothPortalOffset) {
spaces += PORTAL_ICON;
} else if (i === smoothTrackerOffset) {
spaces += TRACKER_ICON;
} else {
spaces += " ";
}
}
return spaces;
} catch (e) {
return "";
}
}
function buildAuxiliaryBar(player) {
let modules = [];
const settings = getPlayerSettings(player.uuid);
if (!settings.showAuxiliary) {
return "";
}
if (player.pos.dimid === 0 && player.pos.y < 20) {
try {
const daytime = mc.getTime(0);
const isDay = daytime < 13000;
const icon = isDay ? "\ue2d9§f DAY§r" : "\ue2da§3 NIGHT§r";
modules.push(icon);
} catch (e) {}
}
if (modules.length === 0) return "";
return modules.join(" §i|| ");
}
function buildFullStatusBar(player) {
const main = buildMainBar(player);
const auxiliary = buildAuxiliaryBar(player);
let result = main;
if (auxiliary !== "") {
result += " §i|| " + auxiliary;
}
return result;
}
setInterval(() => {
try {
const onlinePlayers = mc.getOnlinePlayers();
onlinePlayers.forEach(player => {
try {
const uuid = player.uuid;
const settings = getPlayerSettings(uuid);
if (settings.isHidden || player.hasTag(STATUS_BAR_TAG)) {
player.removeBossBar(STATUS_BAR_UID);
player.removeBossBar(DIRECTION_BAR_UID);
return;
}
const statusText = buildFullStatusBar(player);
const directionText = buildDeathDirectionBar(player);
// 计算血条百分比：倒计时进度（隶属于辅助功能）
let bossPercent = 0;
let bossColor = 2; // 默认红色
if (settings.showAuxiliary && timerTotalSeconds > 0 && timerRemainingSeconds > 0) {
bossPercent = Math.round(((timerTotalSeconds - timerRemainingSeconds) / timerTotalSeconds) * 100);
// 剩余不足10秒时红白交替闪烁
if (timerRemainingSeconds <= 10) {
timerFlashState = !timerFlashState;
bossColor = timerFlashState ? 0 : 2; // 白色:红色
}
}
if (statusText !== "" && directionText !== "") {
// 两行都显示
player.setBossBar(STATUS_BAR_UID, statusText, bossPercent, bossColor);
player.setBossBar(DIRECTION_BAR_UID, directionText, 0, 7);
} else if (directionText !== "") {
// 只显示定位栏，用主状态栏显示
player.setBossBar(STATUS_BAR_UID, directionText, bossPercent, bossColor);
player.removeBossBar(DIRECTION_BAR_UID);
} else if (statusText !== "") {
// 只显示主状态栏
player.setBossBar(STATUS_BAR_UID, statusText, bossPercent, bossColor);
player.removeBossBar(DIRECTION_BAR_UID);
} else {
// 都不显示
player.removeBossBar(STATUS_BAR_UID);
player.removeBossBar(DIRECTION_BAR_UID);
}
} catch (e) {}
});
} catch (error) {}
}, 300);