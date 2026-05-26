# ZXland 领地系统 API 文档

> **版本**: 1.4.0  
> **作者**: EVILZIXIE  
> **适用于**: LeviLamina / LegacyScriptEngine


## 快速开始

 导入API


// 导入单个API
let getLandAt = ll.imports("ZXland", "getLandAt");

// 使用API
let landInfo = getLandAt(100, 64, 200, 0);
if (landInfo) {
    logger.info(`找到领地: ${landInfo.landId}`);
}


 API命名空间

所有API均在 `ZXland` 命名空间下，使用 `ll.imports("ZXland", "API名称")` 导入。

 
## 目录

- [领地查询](#领地查询)
- [领地操作](#领地操作)
- [成员管理](#成员管理)
- [权限管理](#权限管理)
- [保护设置](#保护设置)
- [传送功能](#传送功能)
- [邀请系统](#邀请系统)
- [申请系统](#申请系统)
- [子领地管理](#子领地管理)
- [飞行管理](#飞行管理)
- [黑名单管理](#黑名单管理)
- [传送点管理](#传送点管理)
- [事件设置](#事件设置)
- [经济相关](#经济相关)
- [配置与数据](#配置与数据)
- [可视化](#可视化)


## 领地查询

 getLandAt

根据坐标获取领地信息。


let getLandAt = ll.imports("ZXland", "getLandAt");
let result = getLandAt(x, y, z, dimid);


| 参数 | 类型 | 说明 |
|------|------|------|
| x | Number | X坐标 |
| y | Number | Y坐标 |
| z | Number | Z坐标 |
| dimid | Number | 维度ID (0=主世界, 1=下界, 2=末地) |

**返回值**: `Object | null`

{
    landId: "xxx",      // 领地ID
    land: {...},        // 领地完整数据
    isOwner: false,     // 是否为主人
    isMember: false,    // 是否为成员
    permLevel: 0        // 权限等级
}



 getLandInfo

获取领地完整信息。


let getLandInfo = ll.imports("ZXland", "getLandInfo");
let land = getLandInfo(landId);


| 参数 | 类型 | 说明 |
|------|------|------|
| landId | String | 领地ID |

**返回值**: `Object | null` - 领地完整数据对象


 getLandSummary

获取领地摘要信息。


let getLandSummary = ll.imports("ZXland", "getLandSummary");
let summary = getLandSummary(landId);


**返回值**:

{
    id: "xxx",
    name: "我的领地",
    owner: "玩家XUID",
    ownerName: "玩家名",
    dim: 0,
    is2D: false,
    createTime: 1234567890,
    memberCount: 3,
    hasSubLands: true
}



 getLandIdByName

根据名称查找领地ID。


let getLandIdByName = ll.imports("ZXland", "getLandIdByName");
let landId = getLandIdByName(landName, ownerXuid);


| 参数 | 类型 | 说明 |
|------|------|------|
| landName | String | 领地名称 |
| ownerXuid | String \| null | 主人XUID，传null则不限制 |

**返回值**: `String | null`


 getLandOwner

获取领地主人信息。


let getLandOwner = ll.imports("ZXland", "getLandOwner");
let owner = getLandOwner(landId);


**返回值**:

{
    xuid: "玩家XUID",
    name: "玩家名"
}



 getLandBounds

获取领地边界坐标。


let getLandBounds = ll.imports("ZXland", "getLandBounds");
let bounds = getLandBounds(landId);


**返回值**:

{
    min: { x: 0, y: 0, z: 0 },
    max: { x: 100, y: 100, z: 100 },
    dim: 0
}



 getLandSize

获取领地大小。


let getLandSize = ll.imports("ZXland", "getLandSize");
let size = getLandSize(landId);


**返回值**:

{
    volume: 10000,      // 体积（方块数）
    area: 100,          // 面积（底面积）
    dimensions: { x: 10, y: 100, z: 10 }
}



 isPositionInLand

检查坐标是否在指定领地内。


let isPositionInLand = ll.imports("ZXland", "isPositionInLand");
let result = isPositionInLand(x, y, z, dimid, landId);


**返回值**: `Boolean`


 getLandsInRange

获取指定范围内的所有领地。


let getLandsInRange = ll.imports("ZXland", "getLandsInRange");
let lands = getLandsInRange(pos, range, dimid);


| 参数 | 类型 | 说明 |
|------|------|------|
| pos | Object | 中心坐标 {x, z} |
| range | Number | 搜索半径 |
| dimid | Number | 维度ID |

**返回值**: `Array<String>` - 领地ID数组


 getLandsByDimension

获取指定维度的所有领地。


let getLandsByDimension = ll.imports("ZXland", "getLandsByDimension");
let lands = getLandsByDimension(dimid);


**返回值**: `Array<String>` - 领地ID数组


 searchLands

按名称搜索领地。


let searchLands = ll.imports("ZXland", "searchLands");
let lands = searchLands(keyword);


**返回值**: `Array<String>` - 匹配的领地ID数组


 getPlayerLands

获取玩家拥有的所有领地。


let getPlayerLands = ll.imports("ZXland", "getPlayerLands");
let lands = getPlayerLands(xuid);


**返回值**: `Array<String>` - 领地ID数组


 getPlayerTrustedLands

获取玩家被信任的所有领地（作为成员）。


let getPlayerTrustedLands = ll.imports("ZXland", "getPlayerTrustedLands");
let lands = getPlayerTrustedLands(xuid);


**返回值**: `Array<String>` - 领地ID数组


 getLandCount

获取总领地数量。


let getLandCount = ll.imports("ZXland", "getLandCount");
let count = getLandCount();


**返回值**: `Number`


 getPlayerLandCount

获取玩家拥有的领地数量。


let getPlayerLandCount = ll.imports("ZXland", "getPlayerLandCount");
let count = getPlayerLandCount(xuid);


**返回值**: `Number`


 getAllLandsList

获取所有领地列表（简要信息）。


let getAllLandsList = ll.imports("ZXland", "getAllLandsList");
let list = getAllLandsList();


**返回值**:

[
    { id: "xxx", name: "领地1", ownerName: "玩家A", dim: 0 },
    { id: "yyy", name: "领地2", ownerName: "玩家B", dim: 0 }
]



## 领地操作

 createLand

创建新领地。


let createLand = ll.imports("ZXland", "createLand");
let landId = createLand(ownerXuid, name, pos1, pos2, dimid, is2D);


| 参数 | 类型 | 说明 |
|------|------|------|
| ownerXuid | String | 主人XUID |
| name | String | 领地名称 |
| pos1 | Object | 角点1 {x, y, z} |
| pos2 | Object | 角点2 {x, y, z} |
| dimid | Number | 维度ID |
| is2D | Boolean | 是否为2D领地 |

**返回值**: `String` - 新领地ID


 deleteLand

删除领地。


let deleteLand = ll.imports("ZXland", "deleteLand");
let success = deleteLand(landId, operatorXuid);


| 参数 | 类型 | 说明 |
|------|------|------|
| landId | String | 领地ID |
| operatorXuid | String | 操作者XUID（需为主人或OP） |

**返回值**: `Boolean`


 renameLand

重命名领地。


let renameLand = ll.imports("ZXland", "renameLand");
let success = renameLand(landId, operatorXuid, newName);


**返回值**: `Boolean`


 transferLand

转让领地。


let transferLand = ll.imports("ZXland", "transferLand");
let success = transferLand(landId, fromXuid, toXuid);


**返回值**: `Boolean`


## 成员管理

 addMember

添加成员。


let addMember = ll.imports("ZXland", "addMember");
let success = addMember(landId, ownerXuid, memberXuid);


**返回值**: `Boolean`


 removeMember

移除成员。


let removeMember = ll.imports("ZXland", "removeMember");
let success = removeMember(landId, ownerXuid, memberXuid);


**返回值**: `Boolean`


 getMemberList

获取成员列表。


let getMemberList = ll.imports("ZXland", "getMemberList");
let members = getMemberList(landId);


**返回值**: `Array<String>` - 成员XUID数组


 getMemberInfo

获取成员详细信息。


let getMemberInfo = ll.imports("ZXland", "getMemberInfo");
let info = getMemberInfo(landId, memberXuid);


**返回值**:

{
    name: "玩家名",
    joinTime: 1234567890,
    permLevel: 1,
    permissionGroup: "member"
}



 getMemberLevel

获取成员权限等级。


let getMemberLevel = ll.imports("ZXland", "getMemberLevel");
let level = getMemberLevel(landId, memberXuid);


**返回值**: `Number` (0-3)


 setMemberLevel

设置成员权限等级。


let setMemberLevel = ll.imports("ZXland", "setMemberLevel");
let success = setMemberLevel(landId, memberXuid, level);


**返回值**: `Boolean`


 setMemberPermissionGroup

设置成员权限组。


let setMemberPermissionGroup = ll.imports("ZXland", "setMemberPermissionGroup");
let success = setMemberPermissionGroup(landId, ownerXuid, memberXuid, groupName);


**返回值**: `Boolean`


 isOwner

检查是否为领地主人。


let isOwner = ll.imports("ZXland", "isOwner");
let result = isOwner(landId, xuid);


**返回值**: `Boolean`


 isMember

检查是否为领地成员。


let isMember = ll.imports("ZXland", "isMember");
let result = isMember(landId, xuid);


**返回值**: `Boolean`


 isLandResident

检查是否为领地居民（主人或成员）。


let isLandResident = ll.imports("ZXland", "isLandResident");
let result = isLandResident(landId, xuid);


**返回值**: `Boolean`


## 权限管理

 hasPermission

检查玩家是否有特定权限。


let hasPermission = ll.imports("ZXland", "hasPermission");
let result = hasPermission(landId, xuid, permission);


| 参数 | 类型 | 说明 |
|------|------|------|
| landId | String | 领地ID |
| xuid | String | 玩家XUID |
| permission | String | 权限名称 |

**可用权限名称**:
- `build` - 建造
- `destroy` - 破坏
- `openChest` - 打开箱子
- `useItem` - 使用物品
- `attackEntity` - 攻击实体
- `interact` - 交互
- `useDoor` - 使用门
- `useBed` - 使用床
- `useButton` - 使用按钮
- `useLever` - 使用拉杆
- `pickupItem` - 拾取物品
- `dropItem` - 丢弃物品
- `fly` - 飞行

**返回值**: `Boolean`


 getAllPermissions

获取领地所有权限设置。


let getAllPermissions = ll.imports("ZXland", "getAllPermissions");
let permissions = getAllPermissions(landId);


**返回值**: `Object` - 权限键值对


 getPermission

获取单项权限值。


let getPermission = ll.imports("ZXland", "getPermission");
let value = getPermission(landId, permission);


**返回值**: `Boolean | null`


 setPermission

设置单项权限。


let setPermission = ll.imports("ZXland", "setPermission");
let success = setPermission(landId, permission, value);


**返回值**: `Boolean`


 canOperate

检查玩家能否执行操作。


let canOperate = ll.imports("ZXland", "canOperate");
let result = canOperate(landId, xuid, operation);


**返回值**: `Boolean`


 getPermissionGroups

获取所有权限组名称。


let getPermissionGroups = ll.imports("ZXland", "getPermissionGroups");
let groups = getPermissionGroups();


**返回值**: `Array<String>`


 getPermissionGroupInfo

获取权限组详情。


let getPermissionGroupInfo = ll.imports("ZXland", "getPermissionGroupInfo");
let info = getPermissionGroupInfo(groupName);


**返回值**: `Object | null`


 createPermissionGroup

创建自定义权限组。


let createPermissionGroup = ll.imports("ZXland", "createPermissionGroup");
let success = createPermissionGroup(ownerXuid, groupName, displayName, permissions);


**返回值**: `Boolean`


## 保护设置

 getAllProtections

获取所有保护设置。


let getAllProtections = ll.imports("ZXland", "getAllProtections");
let protections = getAllProtections(landId);


**返回值**: `Object`


 getProtection

获取单项保护设置。


let getProtection = ll.imports("ZXland", "getProtection");
let value = getProtection(landId, key);


**可用保护键名**:
- `preventExplosions` - 防止爆炸
- `preventTNT` - 防止TNT
- `preventCreeper` - 防止苦力怕
- `preventFireSpread` - 防止火焰蔓延
- `preventMobSpawning` - 防止怪物生成
- `preventPistonPush` - 防止活塞推动
- `preventLiquidFlow` - 防止液体流动
- `preventFarmlandDecay` - 防止耕地退化
- `allowPlayerEntry` - 允许玩家进入

**返回值**: `Boolean | null`


 setProtection

设置单项保护。


let setProtection = ll.imports("ZXland", "setProtection");
let success = setProtection(landId, key, value);


**返回值**: `Boolean`


 updateLandProtection

批量更新保护设置。


let updateLandProtection = ll.imports("ZXland", "updateLandProtection");
let success = updateLandProtection(landId, settings);


| 参数 | 类型 | 说明 |
|------|------|------|
| landId | String | 领地ID |
| settings | Object | 保护设置键值对 |

**返回值**: `Boolean`


 resetProtections

重置保护设置为默认值。


let resetProtections = ll.imports("ZXland", "resetProtections");
let success = resetProtections(landId);


**返回值**: `Boolean`


## 传送功能

 teleportPlayer

传送玩家到领地。


let teleportPlayer = ll.imports("ZXland", "teleportPlayer");
let success = teleportPlayer(player, landId);


| 参数 | 类型 | 说明 |
|------|------|------|
| player | Player | 玩家对象 |
| landId | String | 领地ID |

**返回值**: `Boolean`


 setTeleportPos

设置领地传送点。


let setTeleportPos = ll.imports("ZXland", "setTeleportPos");
let success = setTeleportPos(landId, x, y, z);


**返回值**: `Boolean`


 getTeleportPos

获取领地传送点。


let getTeleportPos = ll.imports("ZXland", "getTeleportPos");
let pos = getTeleportPos(landId);


**返回值**: `{x, y, z, dimid} | null`


## 邀请系统

 sendInvitation

发送领地邀请。


let sendInvitation = ll.imports("ZXland", "sendInvitation");
let success = sendInvitation(fromXuid, fromName, targetName, landId);


**返回值**: `Boolean`


 getInvitations

获取玩家待处理的邀请。


let getInvitations = ll.imports("ZXland", "getInvitations");
let invites = getInvitations(playerName);


**返回值**:

[
    {
        landId: "xxx",
        landName: "领地名",
        fromXuid: "xxx",
        fromName: "邀请人",
        time: 1234567890
    }
]



 acceptInvitationByXuid

接受邀请。


let acceptInvitationByXuid = ll.imports("ZXland", "acceptInvitationByXuid");
let success = acceptInvitationByXuid(playerXuid, landId);


**返回值**: `Boolean`


 declineInvitationByName

拒绝邀请。


let declineInvitationByName = ll.imports("ZXland", "declineInvitationByName");
let success = declineInvitationByName(playerName, landId);


**返回值**: `Boolean`


## 申请系统

 sendApplication

发送加入申请。


let sendApplication = ll.imports("ZXland", "sendApplication");
let success = sendApplication(playerXuid, playerName, landId);


**返回值**: `Boolean`


 getApplications

获取领地待处理的申请。


let getApplications = ll.imports("ZXland", "getApplications");
let apps = getApplications(landId);


**返回值**:

[
    {
        xuid: "xxx",
        name: "申请人",
        time: 1234567890
    }
]



 acceptApplicationByXuid

接受申请。


let acceptApplicationByXuid = ll.imports("ZXland", "acceptApplicationByXuid");
let success = acceptApplicationByXuid(landId, playerXuid);


**返回值**: `Boolean`


 declineApplicationByXuid

拒绝申请。


let declineApplicationByXuid = ll.imports("ZXland", "declineApplicationByXuid");
let success = declineApplicationByXuid(landId, playerXuid);


**返回值**: `Boolean`


## 子领地管理

 getSubLands

获取子领地列表。


let getSubLands = ll.imports("ZXland", "getSubLands");
let subLands = getSubLands(parentId);


**返回值**: `Array<String>` - 子领地ID数组


 getParentLand

获取父领地ID。


let getParentLand = ll.imports("ZXland", "getParentLand");
let parentId = getParentLand(landId);


**返回值**: `String | null`


 isSubLand

检查是否为子领地。


let isSubLand = ll.imports("ZXland", "isSubLand");
let result = isSubLand(landId);


**返回值**: `Boolean`


## 飞行管理

 enableFlight

启用玩家在领地内飞行。


let enableFlight = ll.imports("ZXland", "enableFlight");
let success = enableFlight(player, landId);


**返回值**: `Boolean`


 disableFlight

禁用玩家飞行。


let disableFlight = ll.imports("ZXland", "disableFlight");
let success = disableFlight(player);


**返回值**: `Boolean`


 toggleFlight

切换领地飞行状态。


let toggleFlight = ll.imports("ZXland", "toggleFlight");
let newStatus = toggleFlight(landId);


**返回值**: `Boolean` - 切换后的状态


 getFlightStatus

获取领地飞行状态。


let getFlightStatus = ll.imports("ZXland", "getFlightStatus");
let status = getFlightStatus(landId);


**返回值**: `Boolean`


 isPlayerFlying

检查玩家是否正在领地飞行。


let isPlayerFlying = ll.imports("ZXland", "isPlayerFlying");
let result = isPlayerFlying(playerXuid);


**返回值**: `Boolean`


## 黑名单管理

 addToBlacklist

添加到黑名单。


let addToBlacklist = ll.imports("ZXland", "addToBlacklist");
let success = addToBlacklist(landId, ownerXuid, targetXuid, targetName);


**返回值**: `Boolean`


 removeFromBlacklist

从黑名单移除。


let removeFromBlacklist = ll.imports("ZXland", "removeFromBlacklist");
let success = removeFromBlacklist(landId, ownerXuid, targetXuid);


**返回值**: `Boolean`


 isInBlacklist

检查是否在黑名单中。


let isInBlacklist = ll.imports("ZXland", "isInBlacklist");
let result = isInBlacklist(landId, playerXuid);


**返回值**: `Boolean`


 getBlacklist

获取黑名单列表。


let getBlacklist = ll.imports("ZXland", "getBlacklist");
let list = getBlacklist(landId);


**返回值**: `Array<String>` - XUID数组


## 传送点管理

 addWarp

添加传送点。


let addWarp = ll.imports("ZXland", "addWarp");
let success = addWarp(landId, ownerXuid, warpName, x, y, z, isPublic);


**返回值**: `Boolean`


 removeWarp

删除传送点。


let removeWarp = ll.imports("ZXland", "removeWarp");
let success = removeWarp(landId, ownerXuid, warpName);


**返回值**: `Boolean`


 teleportToWarp

传送到传送点。


let teleportToWarp = ll.imports("ZXland", "teleportToWarp");
let success = teleportToWarp(player, landId, warpName);


**返回值**: `Boolean`


 getWarpList

获取传送点列表。


let getWarpList = ll.imports("ZXland", "getWarpList");
let warps = getWarpList(landId);


**返回值**: `Array<String>` - 传送点名称数组


 getPublicWarps

获取所有公开传送点。


let getPublicWarps = ll.imports("ZXland", "getPublicWarps");
let warps = getPublicWarps();


**返回值**:

[
    {
        landId: "xxx",
        landName: "领地名",
        warpName: "传送点名",
        pos: { x, y, z, isPublic }
    }
]



## 事件设置

 setEventSetting

设置事件控制。


let setEventSetting = ll.imports("ZXland", "setEventSetting");
let success = setEventSetting(landId, eventKey, value);


**可用事件键名**:
- `allowExplosion` - 允许爆炸
- `allowFireSpread` - 允许火焰蔓延
- `allowPistonPush` - 允许活塞推动
- `allowFarmlandDecay` - 允许耕地退化
- `allowRedstoneUpdate` - 允许红石更新

**返回值**: `Boolean`


 getEventSetting

获取事件设置。


let getEventSetting = ll.imports("ZXland", "getEventSetting");
let value = getEventSetting(landId, eventKey);


**返回值**: `Boolean | null`


 setEnterMessage

设置进入消息。


let setEnterMessage = ll.imports("ZXland", "setEnterMessage");
let success = setEnterMessage(landId, message);


**返回值**: `Boolean`


 setLeaveMessage

设置离开消息。


let setLeaveMessage = ll.imports("ZXland", "setLeaveMessage");
let success = setLeaveMessage(landId, message);


**返回值**: `Boolean`


 getLandMessages

获取领地进入/离开消息。


let getLandMessages = ll.imports("ZXland", "getLandMessages");
let messages = getLandMessages(landId);


**返回值**:

{
    enter: "欢迎来到xxx",
    leave: "你离开了xxx"
}



## 经济相关

 calculatePrice

计算领地价格。


let calculatePrice = ll.imports("ZXland", "calculatePrice");
let price = calculatePrice(pos1, pos2, is2D);


| 参数 | 类型 | 说明 |
|------|------|------|
| pos1 | Object | 角点1 {x, y, z} |
| pos2 | Object | 角点2 {x, y, z} |
| is2D | Boolean | 是否为2D领地 |

**返回值**: `Number`


 getLandValue

获取领地当前价值。


let getLandValue = ll.imports("ZXland", "getLandValue");
let value = getLandValue(landId);


**返回值**: `Number`


## 配置与数据

 getConfig

获取插件配置。


let getConfig = ll.imports("ZXland", "getConfig");
let config = getConfig();


**返回值**: `Object` - 完整配置对象


 getAllLands

获取所有领地数据。


let getAllLands = ll.imports("ZXland", "getAllLands");
let lands = getAllLands();


**返回值**: `Object` - 完整领地数据对象


## 可视化

 visualizeLand

显示领地边界粒子效果。


let visualizeLand = ll.imports("ZXland", "visualizeLand");
let success = visualizeLand(player, landId);


**返回值**: `Boolean`


 stopVisualizeLand

停止显示领地边界。


let stopVisualizeLand = ll.imports("ZXland", "stopVisualizeLand");
let success = stopVisualizeLand(player);


**返回值**: `Boolean`


## 示例代码

 检查玩家权限并执行操作


let getLandAt = ll.imports("ZXland", "getLandAt");
let hasPermission = ll.imports("ZXland", "hasPermission");

mc.listen("onDestroyBlock", (player, block) => {
    let landInfo = getLandAt(block.pos.x, block.pos.y, block.pos.z, block.pos.dimid);
    
    if (landInfo) {
        if (!hasPermission(landInfo.landId, player.xuid, "destroy")) {
            player.tell("§c你没有权限在这里破坏方块！");
            return false;
        }
    }
    return true;
});


 创建领地并添加成员


let createLand = ll.imports("ZXland", "createLand");
let addMember = ll.imports("ZXland", "addMember");

function createLandForPlayer(player, name, pos1, pos2) {
    let landId = createLand(
        player.xuid,
        name,
        pos1,
        pos2,
        player.pos.dimid,
        false
    );
    
    if (landId) {
        player.tell(`§a领地 "${name}" 创建成功！`);
        return landId;
    }
    return null;
}


 批量管理领地保护


let updateLandProtection = ll.imports("ZXland", "updateLandProtection");
let getPlayerLands = ll.imports("ZXland", "getPlayerLands");

function enableAllProtections(playerXuid) {
    let lands = getPlayerLands(playerXuid);
    
    for (let landId of lands) {
        updateLandProtection(landId, {
            preventExplosions: true,
            preventTNT: true,
            preventFireSpread: true,
            preventMobSpawning: true
        });
    }
}



## 注意事项

1. **玩家对象有效性**: 部分API需要传入Player对象，请确保玩家在线
2. **权限验证**: 修改操作类API通常需要主人或OP权限
3. **数据持久化**: 所有修改操作会自动保存到文件
4. **维度ID**: 0=主世界, 1=下界, 2=末地
5. **返回值检查**: 操作类API返回Boolean表示成功与否，查询类API可能返回null


## 更新日志

 v1.0.0
- 新增申请加入领地系统
- 新增离线邀请系统
- 新增 60+ 个API接口
- 优化菜单返回逻辑


**如有问题，请联系作者: 2990621753**
