const PLUGIN_NAME = "ZXland";
const PLUGIN_DESC = "ZXland领地系统";
const PLUGIN_VERSION = [1, 1, 0];

ll.registerPlugin(PLUGIN_NAME, PLUGIN_DESC, PLUGIN_VERSION, {});

const BASE_DIR = `./plugins/${PLUGIN_NAME}/`;
const CONFIG_PATH = BASE_DIR + "config.json";
const DB_DIR = BASE_DIR + "data";

if (!File.exists(BASE_DIR)) {
    File.createDir(BASE_DIR);
}

const defaultConfig = {
    economy: {
        type: "llmoney",
        scoreboardObj: "money",
        taxEnabled: false,
        taxInterval: 86400,
        taxRate: 0.05,
        taxMissMaxCount: 3
    },
    prices: {
        base2D: 3000,
        base3D: 1000,
        perBlock2D: 1.0,
        perBlock3D: 0.2,
        maxDiscount: 0.5,
        minPrice: 100,
        blockPriceDecreaseThreshold: 5000,
        additionalMemberCost: 50,
        upgradeMultiplier: 1.5,
        flightPermCost: 1000,
        flightTimeCost: 100,
        flightTimeDuration: 1
    },
    limits: {
        maxLandsPerPlayer: 5,
        maxSizePerLand: 10000,
        minSize: 100,
        maxMembers: 10,
        enableSubLand: true,
        maxSubLandsPerLand: 10,
        allowMemberBuySubLand: false,
        worldHeightMin: -64,
        worldHeightMax: 320,
        onlyOpCanCreateLand: false
    },
    visualization: {
        particleType: "minecraft:heart_particle",
        showHeight: true,
        particleInterval: 2,
        displayDuration: 30,
        selectionDisplayDuration: 20,
        showFormAfterPos2: true,
        showTitleOnEnter: true,
        landEnterDisplayType: "actionbar",
        titleStayTime: 3,
        titleFadeIn: 0.5,
        titleFadeOut: 1.0,
        verticalLinesOnly2D: true,
        verticalLineHeight: 10,
        verticalLineSpacing: 5,
        promptFrequency: 60,
        showBossBarCenterPercentage: false,
    },
    defaultPermissions: {
        build: false,
        destroy: false,
        interact: false,
        useContainers: false,
        useDoors: true,
        useRedstone: false,
        attackEntities: false,
        pvp: false,
        itemUse: true,
        teleport: true,
        farmland: true,
        pickupItems: true,
        dropItems: true,
        exp: true,
        throwPotion: false,
        useVehicle: true,
        useFrames: false,
        useBed: true,
        usePortal: true,
        fly: false,
    },
    permissionGroups: {
        visitor: {
            name: "访客",
            permissions: {
                build: false,
                destroy: false,
                interact: false,
                useContainers: false,
                useDoors: true,
                useRedstone: false,
                attackEntities: false,
                pvp: false,
                itemUse: true,
                teleport: true,
                farmland: true,
                pickupItems: true,
                dropItems: true,
                exp: true,
                throwPotion: false,
                useVehicle: true,
                useFrames: false,
                useBed: true,
                usePortal: true,
                fly: false,
            }
        },
        member: {
            name: "成员",
            permissions: {
                build: true,
                destroy: true,
                interact: true,
                useContainers: true,
                useDoors: true,
                useRedstone: true,
                attackEntities: false,
                pvp: false,
                itemUse: true,
                teleport: true,
                farmland: true,
                pickupItems: true,
                dropItems: true,
                exp: true,
                throwPotion: false,
                useVehicle: true,
                useFrames: true,
                useBed: true,
                usePortal: true,
                fly: false,
            }
        },
        admin: {
            name: "管理员",
            permissions: {
                build: true,
                destroy: true,
                interact: true,
                useContainers: true,
                useDoors: true,
                useRedstone: true,
                attackEntities: true,
                pvp: true,
                itemUse: true,
                teleport: true,
                farmland: true,
                pickupItems: true,
                dropItems: true,
                exp: true,
                throwPotion: true,
                useVehicle: true,
                useFrames: true,
                useBed: true,
                usePortal: true,
                fly: false,
            }
        },
        vip: {
            name: "VIP",
            permissions: {
                build: true,
                destroy: true,
                interact: true,
                useContainers: true,
                useDoors: true,
                useRedstone: true,
                attackEntities: false,
                pvp: false,
                itemUse: true,
                teleport: true,
                farmland: true,
                pickupItems: true,
                dropItems: true,
                exp: true,
                throwPotion: true,
                useVehicle: true,
                useFrames: true,
                useBed: true,
                usePortal: true,
                fly: true,
            }
        }
    },
    protection: {
        preventExplosions: true,
        preventTNT: true,
        preventCreeper: true,
        preventFireSpread: true,
        preventMobSpawning: false,
        preventPistonPush: true,
        preventLiquidFlow: true,
        preventFarmlandDecay: true,
        preventLeafDecay: false,
        preventIceMelt: true,
        preventSnowMelt: true,
        preventBoneMeal: false, 
        preventCoralsFromDying: true,
        protectionRange: 0,
        enableFlyInLand: true,
        fishingProtection: true,
        allowPlayerEntry: true,
        preventEndermanTake: true,
        preventRespawnAnchorExplode: true,
        preventHopperInput: false,
        preventHopperOutput: false,
        preventRedstoneUpdate: false,
        preventCmdBlockExecute: true,
        logContainerChange: false,
        preventFrameInteract: true,
        preventBucketPlace: true,
        preventBucketTake: true,
        preventArmorStandChange: true,
        preventRide: false,
        preventPressurePlate: false,
        preventProjectileSpawn: false
    },
    appearance: {
        mainMenuTitle: "§l§6ZXland领地系统",
        mainMenuContent: "§e欢迎使用ZXland领地系统\n选择你想要执行的操作：",
        primaryColor: "§6",
        secondaryColor: "§b",
        highlightColor: "§a",
        warningColor: "§c",
        infoColor: "§e"
    }
};

let config = {};
if (!File.exists(CONFIG_PATH)) {
    File.writeTo(CONFIG_PATH, JSON.stringify(defaultConfig, null, 4));
    config = { ...defaultConfig };
} else {
    try {
        let raw = File.readFrom(CONFIG_PATH);
        let loadedConfig = JSON.parse(raw);
        config = mergeConfig(loadedConfig, defaultConfig);
        
        if (JSON.stringify(config) !== JSON.stringify(loadedConfig)) {
            saveConfig();
        }
    } catch (e) {
        logger.error(`[${PLUGIN_NAME}] 读取配置文件失败: ${e}`);
        config = { ...defaultConfig };
    }
}

if (!File.exists(DB_DIR)) {
    File.createDir(DB_DIR);
}
const db = new KVDatabase(DB_DIR);

const OLD_LANDS_PATH = BASE_DIR + "lands.json";
const OLD_SELECTION_PATH = BASE_DIR + "selections.json";
const OLD_INVITATIONS_PATH = BASE_DIR + "invitations.json";

(function migrateFromOldVersion() {
    let migrated = false;
    
    if (File.exists(OLD_LANDS_PATH)) {
        try {
            let existingData = db.get("lands");
            let oldData = File.readFrom(OLD_LANDS_PATH);
            let oldLands = JSON.parse(oldData);
            
            if (Object.keys(oldLands).length > 0) {
                if (!existingData || existingData === "{}" || existingData === "{}") {
                    db.set("lands", JSON.stringify(oldLands));
                    logger.info(`[${PLUGIN_NAME}] 已从旧版本迁移 ${Object.keys(oldLands).length} 个领地数据`);
                    migrated = true;
                } else {
                    let existingLands = JSON.parse(existingData);
                    let mergedCount = 0;
                    for (let landId in oldLands) {
                        if (!existingLands[landId]) {
                            existingLands[landId] = oldLands[landId];
                            mergedCount++;
                        }
                    }
                    if (mergedCount > 0) {
                        db.set("lands", JSON.stringify(existingLands));
                        logger.info(`[${PLUGIN_NAME}] 已从旧版本合并 ${mergedCount} 个领地数据`);
                        migrated = true;
                    }
                }
            }
            
            let backupPath = OLD_LANDS_PATH + ".migrated";
            File.writeTo(backupPath, oldData);
            File.delete(OLD_LANDS_PATH);
            logger.info(`[${PLUGIN_NAME}] 旧版本lands.json已备份为 ${backupPath}`);
        } catch (e) {
            logger.error(`[${PLUGIN_NAME}] 迁移领地数据失败: ${e}`);
        }
    }
    
    if (File.exists(OLD_SELECTION_PATH)) {
        try {
            let existingData = db.get("selections");
            let oldData = File.readFrom(OLD_SELECTION_PATH);
            let oldSelections = JSON.parse(oldData);
            
            if (Object.keys(oldSelections).length > 0) {
                if (!existingData || existingData === "{}") {
                    db.set("selections", JSON.stringify(oldSelections));
                    logger.info(`[${PLUGIN_NAME}] 已从旧版本迁移 ${Object.keys(oldSelections).length} 个选区数据`);
                    migrated = true;
                } else {
                    let existingSelections = JSON.parse(existingData);
                    let mergedCount = 0;
                    for (let xuid in oldSelections) {
                        if (!existingSelections[xuid]) {
                            existingSelections[xuid] = oldSelections[xuid];
                            mergedCount++;
                        }
                    }
                    if (mergedCount > 0) {
                        db.set("selections", JSON.stringify(existingSelections));
                        logger.info(`[${PLUGIN_NAME}] 已从旧版本合并 ${mergedCount} 个选区数据`);
                        migrated = true;
                    }
                }
            }
            
            let backupPath = OLD_SELECTION_PATH + ".migrated";
            File.writeTo(backupPath, oldData);
            File.delete(OLD_SELECTION_PATH);
            logger.info(`[${PLUGIN_NAME}] 旧版本selections.json已备份为 ${backupPath}`);
        } catch (e) {
            logger.error(`[${PLUGIN_NAME}] 迁移选区数据失败: ${e}`);
        }
    }
    
    if (File.exists(OLD_INVITATIONS_PATH)) {
        try {
            let existingData = db.get("invitations");
            let oldData = File.readFrom(OLD_INVITATIONS_PATH);
            let oldInvitations = JSON.parse(oldData);
            
            if (Object.keys(oldInvitations).length > 0) {
                if (!existingData || existingData === "{}") {
                    db.set("invitations", JSON.stringify(oldInvitations));
                    logger.info(`[${PLUGIN_NAME}] 已从旧版本迁移 ${Object.keys(oldInvitations).length} 个邀请数据`);
                    migrated = true;
                } else {
                    let existingInvitations = JSON.parse(existingData);
                    let mergedCount = 0;
                    for (let playerName in oldInvitations) {
                        if (!existingInvitations[playerName]) {
                            existingInvitations[playerName] = oldInvitations[playerName];
                            mergedCount++;
                        } else {
                            let existingIds = existingInvitations[playerName].map(inv => inv.landId);
                            for (let inv of oldInvitations[playerName]) {
                                if (!existingIds.includes(inv.landId)) {
                                    existingInvitations[playerName].push(inv);
                                    mergedCount++;
                                }
                            }
                        }
                    }
                    if (mergedCount > 0) {
                        db.set("invitations", JSON.stringify(existingInvitations));
                        logger.info(`[${PLUGIN_NAME}] 已从旧版本合并 ${mergedCount} 个邀请数据`);
                        migrated = true;
                    }
                }
            }
            
            let backupPath = OLD_INVITATIONS_PATH + ".migrated";
            File.writeTo(backupPath, oldData);
            File.delete(OLD_INVITATIONS_PATH);
            logger.info(`[${PLUGIN_NAME}] 旧版本invitations.json已备份为 ${backupPath}`);
        } catch (e) {
            logger.error(`[${PLUGIN_NAME}] 迁移邀请数据失败: ${e}`);
        }
    }
    
    if (migrated) {
        logger.info(`[${PLUGIN_NAME}] 旧版本数据迁移完成！原文件已备份为.migrated后缀文件`);
    }
})();

function loadLandsData() {
    let data = db.get("lands");
    return data ? JSON.parse(data) : {};
}

function loadSelectionsData() {
    let data = db.get("selections");
    return data ? JSON.parse(data) : {};
}

function loadInvitationsData() {
    let data = db.get("invitations");
    return data ? JSON.parse(data) : {};
}

function loadLandAdmins() {
    let data = db.get("landAdmins");
    return data ? JSON.parse(data) : {};
}

function saveLandAdmins() {
    db.set("landAdmins", JSON.stringify(landAdmins));
}

let landsData = loadLandsData();
let landAdmins = loadLandAdmins();

const CHUNK_SIZE = 16;
let landChunkIndex = {};

function getChunkKey(x, z, dimid) {
    return `${Math.floor(x / CHUNK_SIZE)}_${Math.floor(z / CHUNK_SIZE)}_${dimid}`;
}

function rebuildLandIndex() {
    landChunkIndex = {};
    for (let id in landsData) {
        indexLand(id, landsData[id]);
    }
}

function indexLand(id, land) {
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    
    let minCX = Math.floor(minX / CHUNK_SIZE);
    let maxCX = Math.floor(maxX / CHUNK_SIZE);
    let minCZ = Math.floor(minZ / CHUNK_SIZE);
    let maxCZ = Math.floor(maxZ / CHUNK_SIZE);
    
    for (let cx = minCX; cx <= maxCX; cx++) {
        for (let cz = minCZ; cz <= maxCZ; cz++) {
            let key = `${cx}_${cz}_${land.dim}`;
            if (!landChunkIndex[key]) landChunkIndex[key] = new Set();
            landChunkIndex[key].add(id);
        }
    }
}

function removeFromIndex(id) {
    for (let key in landChunkIndex) {
        landChunkIndex[key].delete(id);
    }
}

rebuildLandIndex();

(function migrateLandsData() {
    let needUpdate = false;
    for (let landId in landsData) {
        let land = landsData[landId];
        
        if (!land.teleportPos) {
            let minX = Math.min(land.pos1.x, land.pos2.x);
            let maxX = Math.max(land.pos1.x, land.pos2.x);
            let minZ = Math.min(land.pos1.z, land.pos2.z);
            let maxZ = Math.max(land.pos1.z, land.pos2.z);
            
            let centerX = Math.floor((minX + maxX) / 2);
            let centerZ = Math.floor((minZ + maxZ) / 2);
            let y = land.is2D ? 100 : Math.floor((Math.min(land.pos1.y, land.pos2.y) + Math.max(land.pos1.y, land.pos2.y)) / 2);
            
            landsData[landId].teleportPos = {
                x: centerX,
                y: y,
                z: centerZ,
                dimid: land.dim
            };
            needUpdate = true;
        }
        
        if (!land.lastPromptTime) {
            landsData[landId].lastPromptTime = 0;
            needUpdate = true;
        }
        
        if (!land.protection) {
            landsData[landId].protection = { ...config.protection };
            needUpdate = true;
        }
        
        if (!land.statistics) {
            landsData[landId].statistics = {
                visits: 0,
                blocksPlaced: 0,
                blocksDestroyed: 0,
                entitiesKilled: 0,
                lastActivity: Date.now(),
                playerActivity: {},
                blockTypes: {}
            };
            needUpdate = true;
        }
        
        if (!land.temporaryFlight) {
            landsData[landId].temporaryFlight = {};
            needUpdate = true;
        }
        
        if (land.members) {
            for (let memberXuid in land.members) {
                let member = land.members[memberXuid];
                if (!member.permissionGroup) {
                    let groupName = "member";
                    if (member.permLevel === 1) groupName = "visitor";
                    else if (member.permLevel === 3) groupName = "admin";
                    else groupName = "member";
                    
                    member.permissionGroup = groupName;
                    member.permissions = { ...config.permissionGroups[groupName].permissions };
                    needUpdate = true;
                } else if (member.permissions) {
                    let groupPerms = config.permissionGroups[member.permissionGroup];
                    if (groupPerms) {
                        for (let perm in groupPerms.permissions) {
                            if (member.permissions[perm] === undefined) {
                                member.permissions[perm] = groupPerms.permissions[perm];
                                needUpdate = true;
                            }
                        }
                    }
                }
            }
        }
    }
    
    if (needUpdate) {
        saveLandsData();
    }
})();

let selectionsData = loadSelectionsData();

let subSelectionsData = {};
const playerCurrentLands = {};
const flyingPlayers = {};
const temporaryFlying = {};
const lastPositions = {};
const activePlayers = {};
const lastToolClickTime = {};

let invitationsData = loadInvitationsData();

function saveInvitationsData() {
    db.set("invitations", JSON.stringify(invitationsData));
}

function sendLandInvitation(fromXuid, fromName, targetName, landId, landName) {
    if (!invitationsData[targetName]) {
        invitationsData[targetName] = [];
    }
    
    for (let inv of invitationsData[targetName]) {
        if (inv.landId === landId) {
            return false;
        }
    }
    
    invitationsData[targetName].push({
        landId: landId,
        landName: landName,
        fromXuid: fromXuid,
        fromName: fromName,
        time: Date.now()
    });
    
    saveInvitationsData();
    return true;
}

function checkPlayerInvitations(player) {
    let playerName = player.realName;
    
    if (invitationsData[playerName] && invitationsData[playerName].length > 0) {
        setTimeout(() => {
            let invites = invitationsData[playerName];
            if (invites.length === 1) {
                let inv = invites[0];
                player.sendModalForm(
                    `${config.appearance.highlightColor}领地邀请`,
                    `${config.appearance.infoColor}你收到了来自 ${config.appearance.highlightColor}${inv.fromName}${config.appearance.infoColor} 的领地邀请！\n\n` +
                    `${config.appearance.secondaryColor}领地名称: ${config.appearance.highlightColor}${inv.landName}\n` +
                    `${config.appearance.secondaryColor}邀请时间: ${config.appearance.infoColor}${new Date(inv.time).toLocaleString()}\n\n` +
                    `${config.appearance.infoColor}是否接受邀请并加入该领地？`,
                    `${config.appearance.highlightColor}接受`,
                    `${config.appearance.warningColor}拒绝`,
                    (pl, result) => {
                        if (result) {
                            acceptInvitation(pl, inv.landId, inv.fromName);
                        } else {
                            declineInvitation(pl, inv.landId);
                        }
                    }
                );
            } else {
                showInvitationsListMenu(player);
            }
        }, 3000);
    }
}

function acceptInvitation(player, landId, fromName) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}该领地已不存在`);
        removeInvitation(player.realName, landId);
        return;
    }
    
    if (!land.members) {
        land.members = {};
    }
    
    land.members[player.xuid] = {
        name: player.realName,
        joinTime: Date.now(),
        permLevel: 1,
        permissionGroup: "member"
    };
    
    saveLandsData();
    removeInvitation(player.realName, landId);
    
    player.tell(`${config.appearance.highlightColor}你已加入领地 "${land.name}"`);
    
    let owner = mc.getPlayer(land.owner);
    if (owner) {
        owner.tell(`${config.appearance.highlightColor}${player.realName} 已接受你的邀请，加入了领地 "${land.name}"`);
    }
}

function declineInvitation(player, landId) {
    let land = landsData[landId];
    let landName = land ? land.name : "未知领地";
    
    removeInvitation(player.realName, landId);
    player.tell(`${config.appearance.secondaryColor}你已拒绝加入领地 "${landName}"`);
}

function removeInvitation(playerName, landId) {
    if (!invitationsData[playerName]) return;
    
    invitationsData[playerName] = invitationsData[playerName].filter(inv => inv.landId !== landId);
    
    if (invitationsData[playerName].length === 0) {
        delete invitationsData[playerName];
    }
    
    saveInvitationsData();
}

function showInvitationsListMenu(player) {
    let playerName = player.realName;
    let invites = invitationsData[playerName] || [];
    
    if (invites.length === 0) {
        player.tell(`${config.appearance.infoColor}你没有待处理的领地邀请`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}领地邀请列表`);
    form.setContent(`${config.appearance.infoColor}你有 ${config.appearance.highlightColor}${invites.length}${config.appearance.infoColor} 个待处理的邀请`);
    
    invites.forEach(inv => {
        form.addButton(`${config.appearance.highlightColor}${inv.landName}\n${config.appearance.secondaryColor}来自: ${inv.fromName}`, "textures/ui/invite_base");
    });
    
    form.addButton(`${config.appearance.warningColor}关闭`, "textures/ui/cancel");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === invites.length) return;
        
        let inv = invites[id];
        pl.sendModalForm(
            `${config.appearance.highlightColor}邀请详情`,
            `${config.appearance.secondaryColor}领地: ${config.appearance.highlightColor}${inv.landName}\n` +
            `${config.appearance.secondaryColor}邀请人: ${config.appearance.infoColor}${inv.fromName}\n` +
            `${config.appearance.secondaryColor}时间: ${config.appearance.infoColor}${new Date(inv.time).toLocaleString()}\n\n` +
            `${config.appearance.infoColor}是否接受此邀请？`,
            `${config.appearance.highlightColor}接受`,
            `${config.appearance.warningColor}拒绝`,
            (p, result) => {
                if (result) {
                    acceptInvitation(p, inv.landId, inv.fromName);
                } else {
                    declineInvitation(p, inv.landId);
                }
                showInvitationsListMenu(p);
            }
        );
    });
}

function showSendInvitationForm(player, landId) {
    let land = landsData[landId];
    if (!land || land.owner !== player.xuid) {
        player.tell(`${config.appearance.warningColor}你不是这个领地的所有者`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}发送领地邀请`);
    form.addLabel(`${config.appearance.infoColor}输入要邀请的玩家名称，玩家上线时将收到邀请通知。`);
    form.addInput(`${config.appearance.secondaryColor}玩家名称`, "输入玩家名");
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showFastLandManager(pl, landId);
            return;
        }
        
        let targetName = data[1].trim();
        if (!targetName) {
            pl.tell(`${config.appearance.warningColor}玩家名称不能为空`);
            showFastLandManager(pl, landId);
            return;
        }
        
        if (land.members && Object.values(land.members).some(m => m.name.toLowerCase() === targetName.toLowerCase())) {
            pl.tell(`${config.appearance.warningColor}该玩家已经是领地成员`);
            showFastLandManager(pl, landId);
            return;
        }
        
        if (sendLandInvitation(pl.xuid, pl.realName, targetName, landId, land.name)) {
            pl.tell(`${config.appearance.highlightColor}已向 ${targetName} 发送领地邀请`);
            
            let targetPlayer = mc.getPlayer(targetName);
            if (targetPlayer) {
                targetPlayer.tell(`${config.appearance.highlightColor}${pl.realName} 邀请你加入领地 "${land.name}"，输入 /land 查看邀请`);
            }
        } else {
            pl.tell(`${config.appearance.warningColor}已经向该玩家发送过邀请`);
        }
        
        showFastLandManager(pl, landId);
    });
}

const APPLICATIONS_PATH = `${BASE_DIR}applications.json`;
let applicationsData = {};
if (!File.exists(APPLICATIONS_PATH)) {
    File.writeTo(APPLICATIONS_PATH, JSON.stringify({}, null, 4));
} else {
    try {
        let raw = File.readFrom(APPLICATIONS_PATH);
        applicationsData = JSON.parse(raw);
    } catch (e) {
        logger.error(`[${PLUGIN_NAME}] 读取申请数据失败: ${e}`);
        applicationsData = {};
    }
}

function saveApplicationsData() {
    File.writeTo(APPLICATIONS_PATH, JSON.stringify(applicationsData, null, 4));
}

function sendJoinApplication(playerXuid, playerName, landId) {
    if (!applicationsData[landId]) {
        applicationsData[landId] = [];
    }
    
    for (let app of applicationsData[landId]) {
        if (app.xuid === playerXuid) {
            return false;
        }
    }
    
    applicationsData[landId].push({
        xuid: playerXuid,
        name: playerName,
        time: Date.now()
    });
    
    saveApplicationsData();
    return true;
}

function getApplicationCount(landId) {
    return applicationsData[landId] ? applicationsData[landId].length : 0;
}

function removeApplication(landId, playerXuid) {
    if (!applicationsData[landId]) return;
    
    applicationsData[landId] = applicationsData[landId].filter(app => app.xuid !== playerXuid);
    
    if (applicationsData[landId].length === 0) {
        delete applicationsData[landId];
    }
    
    saveApplicationsData();
}

function showApplyJoinLandForm(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (land.owner === player.xuid) {
        player.tell(`${config.appearance.warningColor}你是这个领地的主人`);
        return;
    }
    
    if (land.members && land.members[player.xuid]) {
        player.tell(`${config.appearance.warningColor}你已经是该领地的成员`);
        return;
    }
    
    if (applicationsData[landId]) {
        for (let app of applicationsData[landId]) {
            if (app.xuid === player.xuid) {
                player.tell(`${config.appearance.warningColor}你已经申请过该领地，请等待审核`);
                return;
            }
        }
    }
    
    player.sendModalForm(
        `${config.appearance.highlightColor}申请加入领地`,
        `${config.appearance.infoColor}你正在申请加入领地:\n\n` +
        `${config.appearance.secondaryColor}领地名称: ${config.appearance.highlightColor}${land.name}\n` +
        `${config.appearance.secondaryColor}领地主人: ${config.appearance.infoColor}${land.ownerName || "未知"}\n\n` +
        `${config.appearance.infoColor}提交申请后，领地主人或管理员将收到通知。`,
        `${config.appearance.highlightColor}提交申请`,
        `${config.appearance.secondaryColor}取消`,
        (pl, result) => {
            if (result) {
                if (sendJoinApplication(pl.xuid, pl.realName, landId)) {
                    pl.tell(`${config.appearance.highlightColor}申请已提交，请等待领地主人审核`);
                    
                    let owner = mc.getPlayer(land.owner);
                    if (owner) {
                        owner.tell(`${config.appearance.highlightColor}${pl.realName} 申请加入你的领地 "${land.name}"，请在成员管理中查看`);
                    }
                } else {
                    pl.tell(`${config.appearance.warningColor}你已经提交过申请，请等待审核`);
                }
            }
        }
    );
}

function showApplicationsListMenu(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let applications = applicationsData[landId] || [];
    
    if (applications.length === 0) {
        player.tell(`${config.appearance.infoColor}当前没有待处理的加入申请`);
        showLandMembersMenu(player, landId);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}加入申请列表`);
    form.setContent(`${config.appearance.infoColor}共有 ${config.appearance.highlightColor}${applications.length}${config.appearance.infoColor} 个待处理的申请`);
    
    applications.forEach(app => {
        let timeStr = new Date(app.time).toLocaleString();
        form.addButton(`${config.appearance.highlightColor}${app.name}\n${config.appearance.secondaryColor}${timeStr}`, "textures/ui/icon_steve");
    });
    
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === applications.length) {
            showLandMembersMenu(pl, landId);
            return;
        }
        
        let app = applications[id];
        showApplicationDetailMenu(pl, landId, app);
    });
}

function showApplicationDetailMenu(player, landId, application) {
    let land = landsData[landId];
    if (!land) return;
    
    player.sendModalForm(
        `${config.appearance.highlightColor}申请详情`,
        `${config.appearance.secondaryColor}玩家: ${config.appearance.highlightColor}${application.name}\n` +
        `${config.appearance.secondaryColor}申请时间: ${config.appearance.infoColor}${new Date(application.time).toLocaleString()}\n\n` +
        `${config.appearance.infoColor}是否同意该玩家加入领地？`,
        `${config.appearance.highlightColor}同意`,
        `${config.appearance.warningColor}拒绝`,
        (pl, result) => {
            if (result) {
                acceptApplication(pl, landId, application);
            } else {
                rejectApplication(pl, landId, application);
            }
            showApplicationsListMenu(pl, landId);
        }
    );
}

function acceptApplication(player, landId, application) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        removeApplication(landId, application.xuid);
        return;
    }
    
    if (!land.members) {
        land.members = {};
    }
    
    let memberCount = Object.keys(land.members).length;
    if (memberCount >= config.limits.maxMembers) {
        player.tell(`${config.appearance.warningColor}成员数量已达上限`);
        return;
    }
    
    land.members[application.xuid] = {
        name: application.name,
        joinTime: Date.now(),
        permLevel: 1,
        permissionGroup: "member"
    };
    
    saveLandsData();
    removeApplication(landId, application.xuid);
    
    player.tell(`${config.appearance.highlightColor}已同意 ${application.name} 的加入申请`);
    
    let applicant = mc.getPlayer(application.xuid);
    if (applicant) {
        applicant.tell(`${config.appearance.highlightColor}你的加入申请已被通过，现在你是领地 "${land.name}" 的成员了！`);
    }
}

function rejectApplication(player, landId, application) {
    let land = landsData[landId];
    let landName = land ? land.name : "未知领地";
    
    removeApplication(landId, application.xuid);
    player.tell(`${config.appearance.secondaryColor}已拒绝 ${application.name} 的加入申请`);
    
    let applicant = mc.getPlayer(application.xuid);
    if (applicant) {
        applicant.tell(`${config.appearance.warningColor}你申请加入领地 "${landName}" 的请求已被拒绝`);
    }
}
function mergeConfig(source, defaults) {
    if (!source) return { ...defaults };
    
    let result = { ...source };
    
    for (let key in defaults) {
        if (defaults[key] === null || defaults[key] === undefined) {
            continue;
        }
        
        if (typeof defaults[key] === 'object' && !Array.isArray(defaults[key])) {
            if (typeof source[key] !== 'object' || Array.isArray(source[key])) {
                result[key] = { ...defaults[key] };
            } else {
                result[key] = mergeConfig(source[key], defaults[key]);
            }
        } else if (source[key] === undefined) {
            result[key] = defaults[key];
        }
    }
    
    return result;
}
function saveConfig() {
    if (!File.exists(BASE_DIR)) {
        File.createDir(BASE_DIR);
    }
    File.writeTo(CONFIG_PATH, JSON.stringify(config, null, 4));
}
function saveLandsData() {
    db.set("lands", JSON.stringify(landsData));
}
function saveSelectionsData() {
    db.set("selections", JSON.stringify(selectionsData));
}
function getBalance(xuid) {
    if (config.economy.type === "scoreboard") {
        let pl = mc.getPlayer(xuid);
        if (!pl) return 0;
        let objName = config.economy.scoreboardObj || "money";
        if (!mc.getScoreObjective(objName)) {
            mc.newScoreObjective(objName, objName);
        }
        let sc = pl.getScore(objName);
        if (typeof sc !== "number" || isNaN(sc)) sc = 0;
        return sc;
    } else {
        let bal = money.get(xuid);
        if (!bal || isNaN(bal)) return 0;
        return bal;
    }
}
function reduceMoney(xuid, amt) {
    if (config.economy.type === "scoreboard") {
        let pl = mc.getPlayer(xuid);
        if (!pl) return false;
        let objName = config.economy.scoreboardObj || "money";
        if (!mc.getScoreObjective(objName)) {
            mc.newScoreObjective(objName, objName);
        }
        let sc = pl.getScore(objName);
        if (typeof sc !== "number" || isNaN(sc)) sc = 0;
        if (sc < amt) return false;
        pl.setScore(objName, sc - amt);
        return true;
    } else {
        return money.reduce(xuid, amt);
    }
}
function addMoney(xuid, amt) {
    if (config.economy.type === "scoreboard") {
        let pl = mc.getPlayer(xuid);
        if (!pl) return false;
        let objName = config.economy.scoreboardObj || "money";
        if (!mc.getScoreObjective(objName)) {
            mc.newScoreObjective(objName, objName);
        }
        let sc = pl.getScore(objName);
        if (typeof sc !== "number" || isNaN(sc)) sc = 0;
        pl.setScore(objName, sc + amt);
        return true;
    } else {
        return money.add(xuid, amt);
    }
}
function getPlayerSelection(xuid) {
    if (!selectionsData[xuid]) {
        selectionsData[xuid] = { pos1: null, pos2: null };
    }
    return selectionsData[xuid];
}
function setSelectionPoint(xuid, point, x, y, z, dimid) {
    let selection = getPlayerSelection(xuid);
    selection[point] = { x, y, z, dimid };
    saveSelectionsData();
    return selection;
}
function clearPlayerSelection(xuid) {
    if (selectionsData[xuid]) {
        selectionsData[xuid] = { pos1: null, pos2: null };
        saveSelectionsData();
    }
}
const SELECTION_TOOL_TAG = "ZXland_SelectionTool";
const SELECTION_TOOL_NAME = "§6§l✦ 领地选区工具 ✦";

function isSelectionTool(item) {
    if (!item || item.type !== "minecraft:wooden_axe") return false;
    try {
        let nbt = item.getNbt();
        let tag = nbt.getTag("tag");
        if (tag && tag.getTag(SELECTION_TOOL_TAG)) return true;
        let nbtStr = nbt.toSNBT();
        if (nbtStr.includes(SELECTION_TOOL_TAG) || nbtStr.includes("领地选区工具")) return true;
    } catch (e) {}
    return false;
}

function giveSelectionTool(player) {
    let container = player.getInventory();
    for (let i = 0; i < container.size; i++) {
        let invItem = container.getItem(i);
        if (isSelectionTool(invItem)) {
            player.tell(`${config.appearance.warningColor}你已经拥有选区工具了`);
            return false;
        }
    }
    let item = mc.newItem("minecraft:wooden_axe", 1);
    item.setDisplayName(SELECTION_TOOL_NAME);
    item.setLore([
        "§3━━━━━━━━━━━━━━━━━━",
        "§e✧ ZXland 领地选区工具",
        "§3━━━━━━━━━━━━━━━━━━",
        "§b⚡ 左键点击方块: §f设置点1",
        "§b⚡ 右键点击方块: §f设置点2", 
        "§3━━━━━━━━━━━━━━━━━━",
        "§c⚠ 仅此工具可用于领地选区"
    ]);
    let nbt = item.getNbt();
    let tag = nbt.getTag("tag");
    if (!tag) {
        tag = new NbtCompound();
    }
    tag.setByte(SELECTION_TOOL_TAG, 1);
    nbt.setTag("tag", tag);
    item.setNbt(nbt);
    player.giveItem(item);
    player.tell(`${config.appearance.highlightColor}已获取 ${SELECTION_TOOL_NAME}`);
    return true;
}
function getPlayerSubSelection(xuid) {
    if (!subSelectionsData[xuid]) {
        subSelectionsData[xuid] = { pos1: null, pos2: null };
    }
    return subSelectionsData[xuid];
}
function setSubSelectionPoint(xuid, point, x, y, z, dimid) {
    let selection = getPlayerSubSelection(xuid);
    selection[point] = { x, y, z, dimid };
    return selection;
}
function clearPlayerSubSelection(xuid) {
    if (subSelectionsData[xuid]) {
        subSelectionsData[xuid] = { pos1: null, pos2: null };
    }
}
function calculateSelectionVolume(selection, is2D = false) {
    if (!selection.pos1 || !selection.pos2) return 0;
    if (selection.pos1.dimid !== selection.pos2.dimid) return 0;
    
    let minX = Math.min(selection.pos1.x, selection.pos2.x);
    let maxX = Math.max(selection.pos1.x, selection.pos2.x);
    let minZ = Math.min(selection.pos1.z, selection.pos2.z);
    let maxZ = Math.max(selection.pos1.z, selection.pos2.z);
    
    let area = (maxX - minX + 1) * (maxZ - minZ + 1);
    
    if (is2D) {
        return area * (config.limits.worldHeightMax - config.limits.worldHeightMin + 1);
    } else {
        let minY = Math.min(selection.pos1.y, selection.pos2.y);
        let maxY = Math.max(selection.pos1.y, selection.pos2.y);
        return area * (maxY - minY + 1);
    }
}
function checkSelectionOverlap(selection, exclude = null) {
    if (!selection.pos1 || !selection.pos2) return false;
    
    let minX = Math.min(selection.pos1.x, selection.pos2.x);
    let maxX = Math.max(selection.pos1.x, selection.pos2.x);
    let minZ = Math.min(selection.pos1.z, selection.pos2.z);
    let maxZ = Math.max(selection.pos1.z, selection.pos2.z);
    let dimid = selection.pos1.dimid;
    let minY = selection.is2D ? config.limits.worldHeightMin : Math.min(selection.pos1.y, selection.pos2.y);
    let maxY = selection.is2D ? config.limits.worldHeightMax : Math.max(selection.pos1.y, selection.pos2.y);
    
    for (let landId in landsData) {
        if (exclude && landId === exclude) continue;
        
        let land = landsData[landId];
        if (land.dim !== dimid) continue;
        
        let landMinX = Math.min(land.pos1.x, land.pos2.x);
        let landMaxX = Math.max(land.pos1.x, land.pos2.x);
        let landMinZ = Math.min(land.pos1.z, land.pos2.z);
        let landMaxZ = Math.max(land.pos1.z, land.pos2.z);
        if (maxX >= landMinX && minX <= landMaxX && maxZ >= landMinZ && minZ <= landMaxZ) {
            if (land.is2D || selection.is2D) return true;
            let landMinY = Math.min(land.pos1.y, land.pos2.y);
            let landMaxY = Math.max(land.pos1.y, land.pos2.y);
            
            if (maxY >= landMinY && minY <= landMaxY) {
                return true;
            }
        }
    }
    
    return false;
}

function searchSafeBlockDownForTP(player, x, bottomY, topY, z, dim) {
    for (let y = topY; y >= bottomY + 1; y--) {
        let blockBelow = mc.getBlock(new IntPos(x, y - 1, z, dim));
        let blockPos = mc.getBlock(new IntPos(x, y, z, dim));
        let blockAbove = mc.getBlock(new IntPos(x, y + 1, z, dim));
        
        if (!blockBelow || !blockPos || !blockAbove) continue;
        
        let bName = blockBelow.type || "";
        let pName = blockPos.type || "";
        let aName = blockAbove.type || "";
        
        if (bName.includes("water") || bName.includes("lava") || 
            pName.includes("water") || pName.includes("lava") || 
            aName.includes("water") || aName.includes("lava")) {
            continue;
        }
        
        if (isSolidBlockForTP(bName) && isAirBlockForTP(pName) && isAirBlockForTP(aName)) {
            if (dim === 0) {
                let airCount = 0;
                for (let checkY = y; checkY <= Math.min(y + 10, topY); checkY++) {
                    let checkBlock = mc.getBlock(new IntPos(x, checkY, z, dim));
                    if (checkBlock && isAirBlockForTP(checkBlock.type || "")) {
                        airCount++;
                    } else {
                        break;
                    }
                }
                if (airCount < 5) continue;
            }
            
            let ok = player.teleport(new FloatPos(x + 0.5, y, z + 0.5, dim));
            if (ok) {
                player.addEffect(28, 10 * 20, 5, false);
            }
            return ok;
        }
    }
    
    for (let offsetX = -2; offsetX <= 2; offsetX++) {
        for (let offsetZ = -2; offsetZ <= 2; offsetZ++) {
            if (offsetX === 0 && offsetZ === 0) continue;
            
            let newX = x + offsetX;
            let newZ = z + offsetZ;
            
            for (let y = topY; y >= bottomY + 1; y--) {
                let blockBelow = mc.getBlock(new IntPos(newX, y - 1, newZ, dim));
                let blockPos = mc.getBlock(new IntPos(newX, y, newZ, dim));
                let blockAbove = mc.getBlock(new IntPos(newX, y + 1, newZ, dim));
                
                if (!blockBelow || !blockPos || !blockAbove) continue;
                
                let bName = blockBelow.type || "";
                let pName = blockPos.type || "";
                let aName = blockAbove.type || "";
                
                if (bName.includes("water") || bName.includes("lava") || 
                    pName.includes("water") || pName.includes("lava") || 
                    aName.includes("water") || aName.includes("lava")) {
                    continue;
                }
                
                if (isSolidBlockForTP(bName) && isAirBlockForTP(pName) && isAirBlockForTP(aName)) {
                    if (dim === 0) {
                        let airCount = 0;
                        for (let checkY = y; checkY <= Math.min(y + 10, topY); checkY++) {
                            let checkBlock = mc.getBlock(new IntPos(newX, checkY, newZ, dim));
                            if (checkBlock && isAirBlockForTP(checkBlock.type || "")) {
                                airCount++;
                            } else {
                                break;
                            }
                        }
                        if (airCount < 5) continue;
                    }
                    
                    let ok = player.teleport(new FloatPos(newX + 0.5, y, newZ + 0.5, dim));
                    if (ok) {
                        player.addEffect(28, 10 * 20, 5, false);
                        return true;
                    }
                }
            }
        }
    }
    
    return false;
}

function searchSafeBlockUpForTP(player, x, bottomY, topY, z, dim) {
    if (bottomY < 0) bottomY = 0;
    
    for (let y = bottomY; y <= topY - 2; y++) {
        let blockBelow = mc.getBlock(new IntPos(x, y, z, dim));
        let blockPos = mc.getBlock(new IntPos(x, y + 1, z, dim));
        let blockAbove = mc.getBlock(new IntPos(x, y + 2, z, dim));
        
        if (!blockBelow || !blockPos || !blockAbove) continue;
        
        let bName = blockBelow.type || "";
        let pName = blockPos.type || "";
        let aName = blockAbove.type || "";
        
        if (isSolidBlockForTP(bName) && isAirBlockForTP(pName) && isAirBlockForTP(aName)) {
            let ok = player.teleport(new FloatPos(x + 0.5, y + 1, z + 0.5, dim));
            if (ok) {
                player.addEffect(28, 10 * 20, 5, false);
            }
            return ok;
        }
    }
    
    for (let offsetX = -2; offsetX <= 2; offsetX++) {
        for (let offsetZ = -2; offsetZ <= 2; offsetZ++) {
            if (offsetX === 0 && offsetZ === 0) continue;
            
            let newX = x + offsetX;
            let newZ = z + offsetZ;
            
            for (let y = bottomY; y <= topY - 2; y++) {
                let blockBelow = mc.getBlock(new IntPos(newX, y, newZ, dim));
                let blockPos = mc.getBlock(new IntPos(newX, y + 1, newZ, dim));
                let blockAbove = mc.getBlock(new IntPos(newX, y + 2, newZ, dim));
                
                if (!blockBelow || !blockPos || !blockAbove) continue;
                
                let bName = blockBelow.type || "";
                let pName = blockPos.type || "";
                let aName = blockAbove.type || "";
                
                if (isSolidBlockForTP(bName) && isAirBlockForTP(pName) && isAirBlockForTP(aName)) {
                    let ok = player.teleport(new FloatPos(newX + 0.5, y + 1, newZ + 0.5, dim));
                    if (ok) {
                        player.addEffect(28, 10 * 20, 5, false);
                        return true;
                    }
                }
            }
        }
    }
    
    return false;
}

function isSolidBlockForTP(name) {
    if (!name) return false;
    let blockName = name.toLowerCase();
    
    let unsafeBlocks = [
        "air", "water", "lava", "flowing_water", "flowing_lava",
        "fire", "soul_fire", "campfire", "soul_campfire",
        "magma", "cactus", "sweet_berry_bush", "wither_rose",
        "powder_snow", "scaffolding", "structure_void"
    ];
    
    for (let unsafe of unsafeBlocks) {
        if (blockName.includes(unsafe)) return false;
    }
    
    return true;
}

function isAirBlockForTP(name) {
    if (!name) return true;
    return name.includes("air");
}
function calculateLandPrice(volume, is2D) {
    let basePrice = is2D ? config.prices.base2D : config.prices.base3D;
    let perBlockPrice = is2D ? config.prices.perBlock2D : config.prices.perBlock3D;
    
    let price = basePrice + volume * perBlockPrice;
    if (volume > config.prices.blockPriceDecreaseThreshold) {
        let excessBlocks = volume - config.prices.blockPriceDecreaseThreshold;
        let maxDiscount = config.prices.maxDiscount;
        
        let discount = Math.min(maxDiscount, excessBlocks / 100000 * maxDiscount);
        
        price = price * (1 - discount);
    }
    
    return Math.max(config.prices.minPrice, Math.floor(price));
}
function isPositionInLand(x, y, z, dimid, land) {
    if (land.dim !== dimid) return false;
    
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    if (x < minX || x >= maxX + 1 || z < minZ || z >= maxZ + 1) {
        return false;
    }
    
    if (land.is2D) {
        return y >= config.limits.worldHeightMin && y <= config.limits.worldHeightMax;
    }
    
    let minY = Math.min(land.pos1.y, land.pos2.y);
    let maxY = Math.max(land.pos1.y, land.pos2.y);
    
    return y >= minY && y < maxY + 1;
}
function getLandAt(x, y, z, dimid) {
    let candidates = [];
    let chunkKey = getChunkKey(x, z, dimid);
    let landIds = landChunkIndex[chunkKey];
    
    if (landIds && landIds.size > 0) {
        for (let id of landIds) {
            let land = landsData[id];
            if (land && isPositionInLand(x, y, z, dimid, land)) {
                let volume = calculateSelectionVolume({
                    pos1: land.pos1,
                    pos2: land.pos2
                }, land.is2D);
                
                candidates.push({
                    id: id,
                    land: land,
                    volume: volume,
                    priority: land.parentId ? 1 : 0
                });
            }
        }
    }
    
    if (candidates.length > 0) {
        candidates.sort((a, b) => {
            if (a.volume !== b.volume) return a.volume - b.volume;
            return b.priority - a.priority;
        });
        return { id: candidates[0].id, land: candidates[0].land };
    }
    
    if (config.protection.protectionRange > 0) {
        let extCandidates = [];
        let range = config.protection.protectionRange;
        let checkChunks = new Set();
        for (let dx = -range; dx <= range; dx += CHUNK_SIZE) {
            for (let dz = -range; dz <= range; dz += CHUNK_SIZE) {
                checkChunks.add(getChunkKey(x + dx, z + dz, dimid));
            }
        }
        checkChunks.add(getChunkKey(x - range, z - range, dimid));
        checkChunks.add(getChunkKey(x + range, z + range, dimid));
        
        for (let ck of checkChunks) {
            let ids = landChunkIndex[ck];
            if (!ids) continue;
            for (let id of ids) {
                let land = landsData[id];
                if (land && isPositionInExtendedRange(x, y, z, dimid, land, range)) {
                    let volume = calculateSelectionVolume({
                        pos1: land.pos1,
                        pos2: land.pos2
                    }, land.is2D);
                    extCandidates.push({ id, land, volume });
                }
            }
        }
        
        if (extCandidates.length > 0) {
            extCandidates.sort((a, b) => a.volume - b.volume);
            return { id: extCandidates[0].id, land: extCandidates[0].land, isExtended: true };
        }
    }
    
    return null;
}

function getLandAtPos(pos) {
    if (!pos) return null;
    let result = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    return result ? result.id : null;
}
function isPositionInExtendedRange(x, y, z, dimid, land, range) {
    if (land.dim !== dimid) return false;
    
    let minX = Math.min(land.pos1.x, land.pos2.x) - range;
    let maxX = Math.max(land.pos1.x, land.pos2.x) + range;
    let minZ = Math.min(land.pos1.z, land.pos2.z) - range;
    let maxZ = Math.max(land.pos1.z, land.pos2.z) + range;
    
    if (x < minX || x > maxX || z < minZ || z > maxZ) {
        return false;
    }
    
    if (land.is2D) {
        return y >= config.limits.worldHeightMin && y <= config.limits.worldHeightMax;
    }
    
    let minY = Math.min(land.pos1.y, land.pos2.y) - range;
    let maxY = Math.max(land.pos1.y, land.pos2.y) + range;
    
    return y >= minY && y <= maxY;
}
function generateLandId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}
function createLand(player, name, is2D = true) {
    let xuid = player.xuid;
    let selection = getPlayerSelection(xuid);
    
    if (!selection.pos1 || !selection.pos2) {
        player.tell(`${config.appearance.warningColor}请先完成选区（使用 /land pos1 和 /land pos2）`);
        return false;
    }
    
    if (selection.pos1.dimid !== selection.pos2.dimid) {
        player.tell(`${config.appearance.warningColor}选区必须在同一维度内`);
        return false;
    }
    selection.is2D = is2D;
    let volume = calculateSelectionVolume(selection, is2D);
    
    if (volume < config.limits.minSize) {
        player.tell(`${config.appearance.warningColor}选区太小了，最小需要 ${config.limits.minSize} 方块`);
        return false;
    }
    
    if (volume > config.limits.maxSizePerLand) {
        player.tell(`${config.appearance.warningColor}选区太大了，最大只能有 ${config.limits.maxSizePerLand} 方块`);
        return false;
    }
    
    let playerLands = 0;
    for (let landId in landsData) {
        if (landsData[landId].owner === xuid) {
            playerLands++;
        }
    }
    
    if (playerLands >= config.limits.maxLandsPerPlayer) {
        player.tell(`${config.appearance.warningColor}你已达到领地上限 (${config.limits.maxLandsPerPlayer})`);
        return false;
    }
    
    if (checkSelectionOverlap(selection)) {
        player.tell(`${config.appearance.warningColor}选区与现有领地重叠`);
        return false;
    }
    
    let price = calculateLandPrice(volume, is2D);
    
    if (isLandAdmin(player)) {
        player.tell(`${config.appearance.infoColor}[管理员] 免费创建领地`);
    } else {
        let balance = getBalance(xuid);
        if (balance < price) {
            player.tell(`${config.appearance.warningColor}你的余额不足，需要 ${price}，当前余额 ${balance}`);
            return false;
        }
        
        if (!reduceMoney(xuid, price)) {
            player.tell(`${config.appearance.warningColor}扣除余额失败`);
            return false;
        }
    }
    
    let landId = generateLandId();
    let dim = selection.pos1.dimid;
    let dimName = getDimensionName(dim);
    
    let minX = Math.min(selection.pos1.x, selection.pos2.x);
    let maxX = Math.max(selection.pos1.x, selection.pos2.x);
    let minZ = Math.min(selection.pos1.z, selection.pos2.z);
    let maxZ = Math.max(selection.pos1.z, selection.pos2.z);
    let centerX = Math.floor((minX + maxX) / 2);
    let centerZ = Math.floor((minZ + maxZ) / 2);
    let centerY = is2D ? 100 : Math.floor((Math.min(selection.pos1.y, selection.pos2.y) + Math.max(selection.pos1.y, selection.pos2.y)) / 2);
    
    landsData[landId] = {
        id: landId,
        name: name,
        owner: xuid,
        ownerName: player.name,
        pos1: { ...selection.pos1 },
        pos2: { ...selection.pos2 },
        dim: dim,
        dimName: dimName,
        is2D: is2D,
        createdTime: Date.now(),
        lastTaxTime: Date.now(),
        lastPromptTime: 0,
        members: {},
        permissions: { ...config.defaultPermissions },
        protection: { ...config.protection },
        flags: {},
        teleportPos: {
            x: centerX,
            y: centerY,
            z: centerZ,
            dimid: dim
        },
        temporaryFlight: {},
        warps: {},
        blacklist: {},
        allowMemberBuySubLand: false,
        playSoundOnEnter: true,
        playSoundOnLeave: true,
        customEnterMessage: null,
        customLeaveMessage: null,
        enterDisplayType: null
    };
    
    indexLand(landId, landsData[landId]);
    saveLandsData();
    clearPlayerSelection(xuid);
    
    player.tell(`${config.appearance.highlightColor}成功创建领地 "${name}"，花费 ${price}`);
    player.sendToast(`${config.appearance.highlightColor}领地创建成功`, `已创建领地: ${name}`);
    
    return { success: true, landId: landId };
}
function getDimensionName(dimid) {
    switch (dimid) {
        case 0: return "主世界";
        case 1: return "地狱";
        case 2: return "末地";
        default: return `未知维度(${dimid})`;
    }
}
function getPlayerLandPermission(landId, xuid) {
    let land = landsData[landId];
    if (!land) return null;
    
    if (land.owner === xuid) {
        return { owner: true, permLevel: 100 };
    }
    
    if (land.members && land.members[xuid]) {
        return {
            owner: false,
            permLevel: land.members[xuid].permLevel || 0,
            permissions: land.members[xuid].permissions || {}
        };
    }
    
    return {
        owner: false,
        permLevel: 0,
        permissions: land.permissions
    };
}
function hasPermission(landId, xuid, permission) {
    let perm = getPlayerLandPermission(landId, xuid);
    if (!perm) return false;
    
    if (perm.owner) return true;
    
    if (perm.permissions && perm.permissions[permission] !== undefined) {
        return perm.permissions[permission];
    }
    
    return false;
}
function addLandMember(landId, ownerXuid, memberXuid, memberName, permLevel = 2) {
    let land = landsData[landId];
    if (!land) return false;
    
    if (!canManageLand(landId, ownerXuid)) return false;
    
    let memberCount = Object.keys(land.members || {}).length;
    if (memberCount >= config.limits.maxMembers) return false;
    
    if (!land.members) land.members = {};
    
    let groupName = "member";
    if (permLevel === 1) groupName = "visitor";
    else if (permLevel === 3) groupName = "admin";
    
    land.members[memberXuid] = {
        xuid: memberXuid,
        name: memberName,
        permLevel: permLevel,
        joinTime: Date.now(),
        permissionGroup: groupName,
        permissions: { ...config.permissionGroups[groupName].permissions }
    };
    
    saveLandsData();
    return true;
}
function removeLandMember(landId, ownerXuid, memberXuid) {
    let land = landsData[landId];
    if (!land) return false;
    
    if (!canManageLand(landId, ownerXuid)) return false;
    
    if (!land.members || !land.members[memberXuid]) return false;
    
    let isOperatorOwner = land.owner === ownerXuid;
    let targetMember = land.members[memberXuid];
    let targetIsAdmin = targetMember.permLevel === 3 || targetMember.permissionGroup === "admin";
    
    if (!isOperatorOwner && !playerIsAdmin(ownerXuid) && targetIsAdmin) {
        return false;
    }
    
    delete land.members[memberXuid];
    
    saveLandsData();
    return true;
}
function setMemberPermission(landId, ownerXuid, memberXuid, permissionName, value) {
    let land = landsData[landId];
    if (!land) return false;
    
    if (!canManageLand(landId, ownerXuid)) return false;
    
    if (!land.members || !land.members[memberXuid]) return false;
    
    if (!land.members[memberXuid].permissions) {
        land.members[memberXuid].permissionGroup = "member";
        land.members[memberXuid].permissions = { ...config.permissionGroups.member.permissions };
    }
    
    land.members[memberXuid].permissions[permissionName] = value;
    saveLandsData();
    return true;
}
function setMemberPermissionGroup(landId, ownerXuid, memberXuid, groupName) {
    let land = landsData[landId];
    if (!land) return {success: false, message: "领地不存在"};
    
    if (!canManageLand(landId, ownerXuid)) {
        return {success: false, message: "你没有权限管理这个领地"};
    }
    
    if (!land.members || !land.members[memberXuid]) {
        return {success: false, message: "该玩家不是领地成员"};
    }
    
    if (!config.permissionGroups[groupName]) {
        return {success: false, message: "权限组不存在"};
    }
    
    land.members[memberXuid].permissionGroup = groupName;
    land.members[memberXuid].permissions = { ...config.permissionGroups[groupName].permissions };
    saveLandsData();
    return {success: true, message: `已将成员设置为${config.permissionGroups[groupName].name}权限组`};
}
function batchSetMemberPermissions(landId, ownerXuid, memberXuids, permissions) {
    let land = landsData[landId];
    if (!land) return {success: false, message: "领地不存在"};
    
    if (land.owner !== ownerXuid && !playerIsAdmin(ownerXuid)) {
        return {success: false, message: "你不是这个领地的所有者"};
    }
    
    let successCount = 0;
    for (let memberXuid of memberXuids) {
        if (land.members && land.members[memberXuid]) {
            if (!land.members[memberXuid].permissions) {
                land.members[memberXuid].permissions = { ...config.defaultPermissions };
            }
            Object.assign(land.members[memberXuid].permissions, permissions);
            successCount++;
        }
    }
    
    saveLandsData();
    return {success: true, message: `已为${successCount}个成员批量设置权限`};
}
function createCustomPermissionGroup(ownerXuid, groupName, groupDisplayName, permissions) {
    if (!playerIsAdmin(ownerXuid)) {
        return {success: false, message: "仅管理员可以创建自定义权限组"};
    }
    
    if (config.permissionGroups[groupName]) {
        return {success: false, message: "权限组名称已存在"};
    }
    
    config.permissionGroups[groupName] = {
        name: groupDisplayName,
        permissions: permissions,
        custom: true
    };
    
    saveConfig();
    return {success: true, message: "自定义权限组创建成功"};
}
function setMemberFlightPermission(landId, ownerXuid, memberXuid, enabled) {
    let land = landsData[landId];
    if (!land) return false;
    
    if (land.owner !== ownerXuid && !playerIsAdmin(ownerXuid)) return false;
    if (config.protection.adminControlledFlight && !playerIsAdmin(ownerXuid)) {
        return false;
    }
    
    if (!land.members || !land.members[memberXuid]) return false;
    
    if (!land.members[memberXuid].permissions) {
        land.members[memberXuid].permissions = { ...config.defaultPermissions };
    }
    
    land.members[memberXuid].permissions.fly = enabled;
    
    saveLandsData();
    return true;
}
function setGlobalPermission(landId, ownerXuid, permission, value) {
    let land = landsData[landId];
    if (!land) return false;
    
    if (land.owner !== ownerXuid && !playerIsAdmin(ownerXuid)) return false;
    
    land.permissions[permission] = value;
    
    saveLandsData();
    return true;
}
function playerIsAdmin(xuid) {
    return landAdmins[xuid] === true;
}

function isLandAdmin(player) {
    return player && landAdmins[player.xuid] === true;
}
function canManageLand(landId, xuid) {
    let land = landsData[landId];
    if (!land) return false;
    
    if (land.owner === xuid) return true;
    
    if (playerIsAdmin(xuid)) return true;
    
    if (land.members && land.members[xuid]) {
        let member = land.members[xuid];
        if (member.permLevel === 3 || member.permissionGroup === "admin") {
            return true;
        }
    }
    
    return false;
}

function checkPrison(player) {
    const isPlayerInPrison = ll.imports("PrisonSystem", "isPlayerInPrison");
    if (isPlayerInPrison && isPlayerInPrison(player.xuid)) {
        player.tell("§c你在监狱中无法使用传送！");
        return true;
    }
    return false;
}
function teleportToLand(player, landId) {
    if (checkPrison(player)) return false;
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return false;
    }
    
    if (land.teleportPos) {
        let dimid = land.teleportPos.dimid !== undefined ? land.teleportPos.dimid : land.dim;
        let pos = new FloatPos(land.teleportPos.x + 0.5, land.teleportPos.y, land.teleportPos.z + 0.5, dimid);
        player.teleport(pos);
        player.tell(`${config.appearance.highlightColor}已传送到领地 "${land.name}"`);
        return true;
    }

    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    
    let centerX = Math.floor((minX + maxX) / 2);
    let centerZ = Math.floor((minZ + maxZ) / 2);
    
    let targetY;
    
    if (land.is2D) {
        targetY = config.limits.worldHeightMax;
        for (let y = config.limits.worldHeightMax; y > config.limits.worldHeightMin; y--) {
            let blockBelow = mc.getBlock(centerX, y - 1, centerZ, land.dim);
            let blockAt = mc.getBlock(centerX, y, centerZ, land.dim);
            let blockAbove = mc.getBlock(centerX, y + 1, centerZ, land.dim);
            
            if (blockBelow && blockAt && blockAbove) {
                let belowType = blockBelow.type;
                let atType = blockAt.type;
                let aboveType = blockAbove.type;
                
                if (isSolidBlock(belowType) && isAirBlock(atType) && isAirBlock(aboveType)) {
                    targetY = y;
                    break;
                }
            }
        }
    } else {
        let minY = Math.min(land.pos1.y, land.pos2.y);
        let maxY = Math.max(land.pos1.y, land.pos2.y);
        targetY = Math.floor((minY + maxY) / 2);
        for (let y = targetY; y < maxY; y++) {
            let blockAt = mc.getBlock(centerX, y, centerZ, land.dim);
            let blockAbove = mc.getBlock(centerX, y + 1, centerZ, land.dim);
            
            if (blockAt && blockAbove) {
                let atType = blockAt.type;
                let aboveType = blockAbove.type;
                
                if (isAirBlock(atType) && isAirBlock(aboveType)) {
                    targetY = y;
                    break;
                }
            }
        }
    }
    
    let pos = new FloatPos(centerX + 0.5, targetY, centerZ + 0.5, land.dim);
    player.teleport(pos);
    player.tell(`${config.appearance.highlightColor}已传送到领地 "${land.name}"`);
    return true;
}
function setLandTeleportPos(landId, ownerXuid, x, y, z) {
    let land = landsData[landId];
    if (!land) return false;
    
    if (land.owner !== ownerXuid && !playerIsAdmin(ownerXuid)) return false;
    
    if (!isPositionInLand(x, y, z, land.dim, land)) {
        return false;
    }
    
    land.teleportPos = {
        x: x,
        y: y,
        z: z,
        dimid: land.dim
    };
    
    saveLandsData();
    return true;
}
function addLandWarp(landId, ownerXuid, warpName, pos, isPublic = true) {
    let land = landsData[landId];
    if (!land) return {success: false, message: "领地不存在"};
    
    if (!canManageLand(landId, ownerXuid)) {
        return {success: false, message: "你没有权限管理这个领地"};
    }
    
    let x = pos.x, y = pos.y, z = pos.z;
    
    if (!isPositionInLand(x, y, z, land.dim, land)) {
        return {success: false, message: "传送点必须在领地内"};
    }
    
    if (warpName.length > 12) {
        return {success: false, message: "传送点名称不要超过12个字符"};
    }
    
    if (!land.warps) {
        land.warps = {};
    }
    
    if (land.warps[warpName]) {
        return {success: false, message: "传送点名称已存在"};
    }
    
    land.warps[warpName] = {
        x: x,
        y: y,
        z: z,
        dimid: land.dim,
        isPublic: isPublic,
        createdAt: Date.now()
    };
    
    saveLandsData();
    return {success: true, message: "传送点添加成功"};
}
function removeLandWarp(landId, ownerXuid, warpName) {
    let land = landsData[landId];
    if (!land) return {success: false, message: "领地不存在"};
    
    if (!canManageLand(landId, ownerXuid)) {
        return {success: false, message: "你没有权限管理这个领地"};
    }
    
    if (!land.warps || !land.warps[warpName]) {
        return {success: false, message: "传送点不存在"};
    }
    
    delete land.warps[warpName];
    saveLandsData();
    return {success: true, message: "传送点删除成功"};
}
function teleportToWarp(player, landId, warpName) {
    if (checkPrison(player)) return false;
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return false;
    }
    
    if (!land.warps || !land.warps[warpName]) {
        player.tell(`${config.appearance.warningColor}传送点不存在`);
        return false;
    }
    
    let warp = land.warps[warpName];
    
    if (!warp.isPublic && land.owner !== player.xuid && (!land.members || !land.members[player.xuid])) {
        player.tell(`${config.appearance.warningColor}这是私密传送点，仅限领地成员使用`);
        return false;
    }
    
    player.teleport(new FloatPos(warp.x, warp.y, warp.z, warp.dimid));
    player.tell(`${config.appearance.highlightColor}已传送到 ${land.name} 的传送点: ${warpName}`);
    return true;
}
function addToBlacklist(landId, ownerXuid, targetXuid, targetName) {
    let land = landsData[landId];
    if (!land) return {success: false, message: "领地不存在"};
    
    if (!canManageLand(landId, ownerXuid)) {
        return {success: false, message: "你没有权限管理这个领地"};
    }
    
    if (targetXuid === land.owner) {
        return {success: false, message: "不能将所有者加入黑名单"};
    }
    
    if (!land.blacklist) {
        land.blacklist = {};
    }
    
    if (land.blacklist[targetXuid]) {
        return {success: false, message: "该玩家已在黑名单中"};
    }
    
    land.blacklist[targetXuid] = {
        name: targetName,
        addedAt: Date.now()
    };
    
    if (land.members && land.members[targetXuid]) {
        delete land.members[targetXuid];
    }
    
    saveLandsData();
    return {success: true, message: "已将玩家加入黑名单"};
}
function removeFromBlacklist(landId, ownerXuid, targetXuid) {
    let land = landsData[landId];
    if (!land) return {success: false, message: "领地不存在"};
    
    if (!canManageLand(landId, ownerXuid)) {
        return {success: false, message: "你没有权限管理这个领地"};
    }
    
    if (!land.blacklist || !land.blacklist[targetXuid]) {
        return {success: false, message: "该玩家不在黑名单中"};
    }
    
    delete land.blacklist[targetXuid];
    saveLandsData();
    return {success: true, message: "已将玩家从黑名单移除"};
}
function isInBlacklist(landId, playerXuid) {
    let land = landsData[landId];
    if (!land || !land.blacklist) return false;
    return !!land.blacklist[playerXuid];
}
function setLandProtectionSettings(landId, owner, settings) {
    let land = landsData[landId];
    if (!land) return false;
    
    if (land.owner !== owner && !playerIsAdmin(owner)) return false;
    
    if (!land.protection) {
        land.protection = { ...config.protection };
    }
    
    for (let key in settings) {
        if (land.protection[key] !== undefined) {
            land.protection[key] = settings[key];
        }
    }
    
    saveLandsData();
    return true;
}
function isSolidBlock(type) {
    if (!type) return false;
    
    const nonSolidBlocks = [
        "air", "water", "lava", "fire", "tall_grass", "flower", 
        "torch", "ladder", "vine", "snow_layer", "red_flower", "yellow_flower",
        "wheat", "carrots", "potatoes", "beetroots", "melon_stem", "pumpkin_stem",
        "reeds", "sapling", "leaves", "deadbush", "web", "double_plant",
        "red_mushroom", "brown_mushroom", "carpet", "rail", "powered_rail", "detector_rail",
        "activator_rail", "lever", "redstone_wire", "redstone_torch", "tripwire", "tripwire_hook",
        "button", "wooden_button", "stone_button", "pressure_plate", "light_weighted_pressure_plate",
        "heavy_weighted_pressure_plate", "wooden_pressure_plate", "stone_pressure_plate"
    ];
    
    for (let block of nonSolidBlocks) {
        if (type.includes(block)) return false;
    }
    
    return true;
}
function isAirBlock(type) {
    if (!type) return true;
    return type.includes("air") || type === "minecraft:air";
}
function isWaterOrLava(type) {
    if (!type) return false;
    return type.includes("water") || type.includes("lava");
}
function isIceBlock(type) {
    if (!type) return false;
    return type.includes("ice") && !type.includes("packed");
}
function isSnowBlock(type) {
    if (!type) return false;
    return type.includes("snow") && type !== "minecraft:snow_block";
}
function isCoralBlock(type) {
    if (!type) return false;
    return type.includes("coral");
}
function isTntRelated(type) {
    if (!type) return false;
    return type.includes("tnt") || type === "minecraft:tnt";
}
function isFarmlandBlock(type) {
    if (!type) return false;
    return type.includes("farmland") || type === "minecraft:farmland";
}
function enablePlayerFlight(player, landId) {
    if (!config.protection.enableFlyInLand) return false;
    
    if (player.gameMode === 1) return false;
    
    if (!hasPermission(landId, player.xuid, "fly")) {
        return false;
    }
    
    if (!player.setAbility) {
        logger.warn(`[${PLUGIN_NAME}] setAbility method not available for player ${player.name}`);
        return false;
    }
    
    player.setAbility(ABILITY.MAY_FLY, true);
    flyingPlayers[player.xuid] = landId;
    
    return true;
}
function enableTemporaryFlight(player, landId, duration) {
    return false;
}
function disablePlayerFlight(player) {
    if (player.gameMode === 1) return;
    
    if (player.setAbility) {
        player.setAbility(ABILITY.MAY_FLY, false);
        player.setAbility(ABILITY.FLYING, false);
    } else {
        logger.warn(`[${PLUGIN_NAME}] setAbility method not available for player ${player.name}`);
    }
    
    if (player.removeBossBar) {
        player.removeBossBar(888888);
    }
    
    delete flyingPlayers[player.xuid];
    delete temporaryFlying[player.xuid];
}
const ABILITY = {
    BUILD: 0,
    MINE: 1,
    DOORS_AND_SWITCHES: 2,
    OPEN_CONTAINERS: 3,
    ATTACK_PLAYERS: 4,
    ATTACK_MOBS: 5,
    OPERATOR: 6,
    TELEPORT: 7,
    INVULNERABLE: 8,
    FLYING: 9,
    MAY_FLY: 10,
    INSTABUILD: 11,
    LIGHTNING: 12,
    FLY_SPEED: 13,
    WALK_SPEED: 14,
    MUTED: 15,
    WORLD_BUILDER: 16,
    NO_CLIP: 17
};
mc.listen("onDestroyBlock", (player, block) => {
    let item = player.getHand();
    if (isSelectionTool(item)) return true;
    
    let landInfo = getLandAt(block.pos.x, block.pos.y, block.pos.z, block.pos.dimid);
    if (!landInfo) return true;
    
    if (!hasPermission(landInfo.id, player.xuid, "destroy")) {
        player.tell(`${config.appearance.warningColor}你没有权限在这个领地破坏方块`);
        return false;
    }
    return true;
});
mc.listen("onPlaceBlock", (player, block) => {
    let landInfo = getLandAt(block.pos.x, block.pos.y, block.pos.z, block.pos.dimid);
    if (!landInfo) return true;
    
    if (!hasPermission(landInfo.id, player.xuid, "build")) {
        player.tell(`${config.appearance.warningColor}你没有权限在这个领地放置方块`);
        return false;
    }
    
    if (isTntRelated(block.type) && landInfo.land.protection.preventTNT) {
        player.tell(`${config.appearance.warningColor}此领地禁止放置TNT`);
        return false;
    }
    return true;
});
mc.listen("onBlockInteracted", (player, block) => {
    let landInfo = getLandAt(block.pos.x, block.pos.y, block.pos.z, block.pos.dimid);
    if (!landInfo) return true;
    
    let blockType = block.type;
    
    if (blockType.includes("chest") || 
        blockType.includes("barrel") || 
        blockType.includes("shulker") ||
        blockType.includes("dispenser") ||
        blockType.includes("dropper") ||
        blockType.includes("hopper")) {
        
        if (!hasPermission(landInfo.id, player.xuid, "useContainers")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地使用容器`);
            return false;
        }
    } 
    else if (blockType.includes("door") || 
            blockType.includes("trapdoor") || 
            blockType.includes("fence_gate")) {
        
        if (!hasPermission(landInfo.id, player.xuid, "useDoors")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地使用门`);
            return false;
        }
    }
    else if (blockType.includes("button") || 
            blockType.includes("lever") || 
            blockType.includes("pressure_plate") ||
            blockType.includes("repeater") ||
            blockType.includes("comparator")) {
        
        if (!hasPermission(landInfo.id, player.xuid, "useRedstone")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地使用红石装置`);
            return false;
        }
    }
    else if (blockType.includes("frame")) {
        if (!hasPermission(landInfo.id, player.xuid, "useFrames")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地使用展示框`);
            return false;
        }
    }
    else if (blockType.includes("bed")) {
        if (!hasPermission(landInfo.id, player.xuid, "useBed")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地使用床`);
            return false;
        }
    }
    else if (blockType.includes("furnace") || 
            blockType.includes("blast_furnace") || 
            blockType.includes("smoker") ||
            blockType.includes("brewing_stand") ||
            blockType.includes("anvil") ||
            blockType.includes("enchanting_table") ||
            blockType.includes("grindstone") ||
            blockType.includes("stonecutter") ||
            blockType.includes("cartography_table") ||
            blockType.includes("loom") ||
            blockType.includes("smithing_table") ||
            blockType.includes("crafting_table") ||
            blockType.includes("fletching_table")) {
        
        if (!hasPermission(landInfo.id, player.xuid, "useContainers")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地使用工作台`);
            return false;
        }
    }
    else if (blockType.includes("sign")) {
        if (!hasPermission(landInfo.id, player.xuid, "interact")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地编辑告示牌`);
            return false;
        }
    }
    else {
        if (!hasPermission(landInfo.id, player.xuid, "interact")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地与方块交互`);
            return false;
        }
    }
});
mc.listen("onAttackEntity", (player, entity) => {
    let landInfo = getLandAt(entity.pos.x, entity.pos.y, entity.pos.z, entity.pos.dimid);
    if (!landInfo) return true;
    
    if (entity.isPlayer()) {
        if (!hasPermission(landInfo.id, player.xuid, "pvp")) {
            player.tell(`${config.appearance.warningColor}这个领地禁止PVP`);
            return false;
        }
    } 
    else {
        if (!hasPermission(landInfo.id, player.xuid, "attackEntities")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地攻击实体`);
            return false;
        }
    }
    return true;
});
mc.listen("onUseItem", (player, item) => {
    let pos = player.pos;
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return;
    
    if (!hasPermission(landInfo.id, player.xuid, "itemUse")) {
        player.tell(`${config.appearance.warningColor}你没有权限在这个领地使用物品`);
        return false;
    }
    
    let itemName = item.type;
    
    if (itemName.includes("potion") || itemName.includes("splash")) {
        if (!hasPermission(landInfo.id, player.xuid, "throwPotion")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地扔药水`);
            return false;
        }
    }
    
    if (itemName.includes("tnt") || itemName.includes("flint_and_steel") || itemName.includes("fire_charge")) {
        if (landInfo.land.protection.preventTNT) {
            player.tell(`${config.appearance.warningColor}此领地禁止使用爆炸物和火焰`);
            return false;
        }
    }
    
    if (itemName.includes("bone_meal") && landInfo.land.protection.preventBoneMeal) {
        if (!hasPermission(landInfo.id, player.xuid, "build")) {
            player.tell(`${config.appearance.warningColor}此领地禁止使用骨粉`);
            return false;
        }
    }
    
    if (itemName.includes("fishing_rod") && landInfo.land.protection.fishingProtection) {
        if (!hasPermission(landInfo.id, player.xuid, "itemUse")) {
            player.tell(`${config.appearance.warningColor}此领地禁止使用钓鱼竿`);
            return false;
        }
    }
});
mc.listen("onDropItem", (player, item) => {
    let pos = player.pos;
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return;
    
    if (!hasPermission(landInfo.id, player.xuid, "dropItems")) {
        player.tell(`${config.appearance.warningColor}你没有权限在这个领地丢弃物品`);
        return false;
    }
});
mc.listen("onTakeItem", (player, entity, item) => {
    let pos = entity.pos;
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return;
    
    if (!hasPermission(landInfo.id, player.xuid, "pickupItems")) {
        player.tell(`${config.appearance.warningColor}你没有权限在这个领地拾取物品`);
        return false;
    }
});
mc.listen("onFarmLandDecay", (pos, entity) => {
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return;
    if (landInfo.land.protection.preventFarmlandDecay) {
        return false;
    }
    
    if (entity && entity.isPlayer()) {
        let player = entity.toPlayer();
        if (hasPermission(landInfo.id, player.xuid, "farmland")) {
            return;
        }
    }
    
    return false;
});
function checkExplosionProtection(pos, radius, dimid, sourceEntity) {
    let checkRadius = Math.ceil(radius) + 2;
    
    let minX = Math.floor(pos.x - checkRadius);
    let maxX = Math.ceil(pos.x + checkRadius);
    let minZ = Math.floor(pos.z - checkRadius);
    let maxZ = Math.ceil(pos.z + checkRadius);
    let minY = Math.floor(pos.y - checkRadius);
    let maxY = Math.ceil(pos.y + checkRadius);
    
    let isCreeper = sourceEntity && sourceEntity.type === "minecraft:creeper";
    let isTNT = sourceEntity && (sourceEntity.type === "minecraft:tnt" || sourceEntity.type === "minecraft:tnt_minecart");
    
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.dim !== dimid) continue;
        let shouldProtect = false;
        if (land.protection.preventExplosions) {
            shouldProtect = true;
        } else if (isCreeper && land.protection.preventCreeper) {
            shouldProtect = true;
        } else if (isTNT && land.protection.preventTNT) {
            shouldProtect = true;
        }
        
        if (!shouldProtect) continue;
        let landMinX = Math.min(land.pos1.x, land.pos2.x);
        let landMaxX = Math.max(land.pos1.x, land.pos2.x);
        let landMinZ = Math.min(land.pos1.z, land.pos2.z);
        let landMaxZ = Math.max(land.pos1.z, land.pos2.z);
        if (maxX >= landMinX && minX <= landMaxX && maxZ >= landMinZ && minZ <= landMaxZ) {
            if (!land.is2D) {
                let landMinY = Math.min(land.pos1.y, land.pos2.y);
                let landMaxY = Math.max(land.pos1.y, land.pos2.y);
                
                if (maxY >= landMinY && minY <= landMaxY) {
                    return true;
                }
            } else {
                return true;
            }
        }
    }
    
    return false;
}
mc.listen("onEntityExplode", (source, pos, radius, maxResistance, isDestroy, isFire) => {
    if (checkExplosionProtection(pos, radius, pos.dimid, source)) {
        return false;
    }
});
mc.listen("onBlockExplode", (source, pos, radius, maxResistance, isDestroy, isFire) => {
    if (checkExplosionProtection(pos, radius, pos.dimid, null)) {
        return false;
    }
});
mc.listen("onWitherBossDestroy", (witherBoss, AAbb, aaBB) => {
    if (!witherBoss || !AAbb || !aaBB) return true;
    
    let minX = Math.min(AAbb.x, aaBB.x);
    let maxX = Math.max(AAbb.x, aaBB.x);
    let minY = Math.min(AAbb.y, aaBB.y);
    let maxY = Math.max(AAbb.y, aaBB.y);
    let minZ = Math.min(AAbb.z, aaBB.z);
    let maxZ = Math.max(AAbb.z, aaBB.z);
    let dimid = AAbb.dimid;
    
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.dim !== dimid) continue;
        
        if (!land.protection || !land.protection.preventExplosions) continue;
        
        let landMinX = Math.min(land.pos1.x, land.pos2.x);
        let landMaxX = Math.max(land.pos1.x, land.pos2.x);
        let landMinZ = Math.min(land.pos1.z, land.pos2.z);
        let landMaxZ = Math.max(land.pos1.z, land.pos2.z);
        
        if (maxX < landMinX || minX > landMaxX || maxZ < landMinZ || minZ > landMaxZ) {
            continue;
        }
        
        if (land.is2D) {
            return false;
        }
        
        let landMinY = Math.min(land.pos1.y, land.pos2.y);
        let landMaxY = Math.max(land.pos1.y, land.pos2.y);
        
        if (!(maxY < landMinY || minY > landMaxY)) {
            return false;
        }
    }
    
    return true;
});
mc.listen("onFireSpread", (pos) => {
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return;
    
    if (landInfo.land.protection.preventFireSpread) {
        return false;
    }
});

mc.listen("onEndermanTakeBlock", (entity, block, pos) => {
    if (!block || !pos) return true;
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return true;
    
    if (landInfo.land.protection.preventEndermanTake) {
        return false;
    }
    return true;
});

mc.listen("onRespawnAnchorExplode", (pos, player) => {
    if (!pos) return true;
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return true;
    
    if (landInfo.land.protection.preventRespawnAnchorExplode) {
        if (player) {
            player.tell(`${config.appearance.warningColor}此领地禁止使用重生锚`);
        }
        return false;
    }
    return true;
});

mc.listen("onHopperSearchItem", (pos, isMinecart, item) => {
    if (!pos) return;
    let hopperLandInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    
    let sourcePos = { x: pos.x, y: pos.y + 1, z: pos.z, dimid: pos.dimid };
    let sourceLandInfo = getLandAt(sourcePos.x, sourcePos.y, sourcePos.z, sourcePos.dimid);
    
    if (sourceLandInfo && sourceLandInfo.land.protection.preventHopperOutput) {
        if (!hopperLandInfo || hopperLandInfo.id !== sourceLandInfo.id) {
            return false;
        }
    }
    
    if (hopperLandInfo && hopperLandInfo.land.protection.preventHopperInput) {
        return false;
    }
});

mc.listen("onHopperPushOut", (pos, isMinecart, item) => {
    if (!pos) return;
    let hopperLandInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    
    if (hopperLandInfo && hopperLandInfo.land.protection.preventHopperOutput) {
        return false;
    }
    
    let targetPositions = [
        { x: pos.x, y: pos.y - 1, z: pos.z },
        { x: pos.x + 1, y: pos.y, z: pos.z },
        { x: pos.x - 1, y: pos.y, z: pos.z },
        { x: pos.x, y: pos.y, z: pos.z + 1 },
        { x: pos.x, y: pos.y, z: pos.z - 1 }
    ];
    
    for (let targetPos of targetPositions) {
        let targetLandInfo = getLandAt(targetPos.x, targetPos.y, targetPos.z, pos.dimid);
        if (targetLandInfo && targetLandInfo.land.protection.preventHopperInput) {
            if (!hopperLandInfo || hopperLandInfo.id !== targetLandInfo.id) {
                return false;
            }
        }
    }
});

mc.listen("onRedStoneUpdate", (block, level, isActive) => {
    if (!block || !block.pos) return;
    let landInfo = getLandAt(block.pos.x, block.pos.y, block.pos.z, block.pos.dimid);
    if (!landInfo) return;
    
    if (landInfo.land.protection.preventRedstoneUpdate) {
        return false;
    }
});

mc.listen("onCmdBlockExecute", (cmd, pos, isMinecart) => {
    if (!pos) return;
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return;
    
    if (landInfo.land.protection.preventCmdBlockExecute) {
        return false;
    }
});

mc.listen("onContainerChange", (player, container, slotNum, oldItem, newItem) => {
    if (!player || !container || !container.pos) return;
    let landInfo = getLandAt(container.pos.x, container.pos.y, container.pos.z, container.pos.dimid);
    if (!landInfo) return;
    
    if (landInfo.land.protection.logContainerChange) {
        let action = "";
        if (oldItem && oldItem.isNull && oldItem.isNull() && newItem && !newItem.isNull()) {
            action = "放入";
        } else if (oldItem && !oldItem.isNull() && newItem && newItem.isNull && newItem.isNull()) {
            action = "取出";
        } else {
            action = "修改";
        }
        let itemName = newItem && !newItem.isNull() ? newItem.name : (oldItem && !oldItem.isNull() ? oldItem.name : "未知物品");
    }
});

mc.listen("onUseFrameBlock", (player, block) => {
    if (!player || !block || !block.pos) return true;
    let landInfo = getLandAt(block.pos.x, block.pos.y, block.pos.z, block.pos.dimid);
    if (!landInfo) return true;
    
    if (landInfo.land.protection.preventFrameInteract) {
        if (!hasPermission(landInfo.id, player.xuid, "useFrames")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地操作展示框`);
            return false;
        }
    }
    return true;
});

mc.listen("onUseBucketPlace", (player, item, block, side, pos) => {
    if (!player || !pos) return true;
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return true;
    
    if (landInfo.land.protection.preventBucketPlace) {
        if (!hasPermission(landInfo.id, player.xuid, "build")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地倒出液体`);
            return false;
        }
    }
    return true;
});

mc.listen("onUseBucketTake", (player, item, target, side, pos) => {
    if (!player || !pos) return true;
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return true;
    
    if (landInfo.land.protection.preventBucketTake) {
        if (!hasPermission(landInfo.id, player.xuid, "destroy")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地装取液体`);
            return false;
        }
    }
    return true;
});

mc.listen("onChangeArmorStand", (armorStand, player, slot) => {
    if (!player || !armorStand || !armorStand.pos) return true;
    let landInfo = getLandAt(armorStand.pos.x, armorStand.pos.y, armorStand.pos.z, armorStand.pos.dimid);
    if (!landInfo) return true;
    
    if (landInfo.land.protection.preventArmorStandChange) {
        if (!hasPermission(landInfo.id, player.xuid, "interact")) {
            player.tell(`${config.appearance.warningColor}你没有权限在这个领地操作盔甲架`);
            return false;
        }
    }
    return true;
});

mc.listen("onRide", (rider, entity) => {
    if (!entity || !entity.pos) return true;
    let landInfo = getLandAt(entity.pos.x, entity.pos.y, entity.pos.z, entity.pos.dimid);
    if (!landInfo) return true;
    
    if (landInfo.land.protection.preventRide) {
        if (rider && rider.isPlayer && rider.isPlayer()) {
            let player = rider.toPlayer();
            if (player && !hasPermission(landInfo.id, player.xuid, "useVehicle")) {
                player.tell(`${config.appearance.warningColor}你没有权限在这个领地骑乘实体`);
                return false;
            }
        }
    }
    return true;
});

mc.listen("onStepOnPressurePlate", (entity, pressurePlate) => {
    if (!entity || !pressurePlate || !pressurePlate.pos) return true;
    let landInfo = getLandAt(pressurePlate.pos.x, pressurePlate.pos.y, pressurePlate.pos.z, pressurePlate.pos.dimid);
    if (!landInfo) return true;
    
    if (landInfo.land.protection.preventPressurePlate) {
        if (entity.isPlayer && entity.isPlayer()) {
            let player = entity.toPlayer();
            if (player && !hasPermission(landInfo.id, player.xuid, "useRedstone")) {
                return false;
            }
        } else {
            return false;
        }
    }
    return true;
});

mc.listen("onSpawnProjectile", (shooter, type) => {
    if (!shooter || !shooter.pos) return true;
    let landInfo = getLandAt(shooter.pos.x, shooter.pos.y, shooter.pos.z, shooter.pos.dimid);
    if (!landInfo) return true;
    
    if (landInfo.land.protection.preventProjectileSpawn) {
        if (shooter.isPlayer && shooter.isPlayer()) {
            let player = shooter.toPlayer();
            if (player && !hasPermission(landInfo.id, player.xuid, "attackEntities")) {
                player.tell(`${config.appearance.warningColor}你没有权限在这个领地发射弹射物`);
                return false;
            }
        }
    }
    return true;
});
mc.listen("onPistonTryPush", (pistonPos, block) => {
    if (!block) return;
    
    let targetPos = block.pos;
    let landInfo = getLandAt(targetPos.x, targetPos.y, targetPos.z, targetPos.dimid);
    let pistonLandInfo = getLandAt(pistonPos.x, pistonPos.y, pistonPos.z, pistonPos.dimid);
    
    if (landInfo && landInfo.land.protection.preventPistonPush) {
        return false;
    }
    
    let direction = getDirectionFromPiston(pistonPos, targetPos);
    if (direction) {
        let newX = targetPos.x + direction.x;
        let newY = targetPos.y + direction.y;
        let newZ = targetPos.z + direction.z;
        let targetLandInfo = getLandAt(newX, newY, newZ, targetPos.dimid);
        
        if (targetLandInfo && targetLandInfo.land.protection.preventPistonPush) {
            if (!landInfo || landInfo.id !== targetLandInfo.id) {
                return false;
            }
        }
    }
    
    let pistonBlock = mc.getBlock(pistonPos);
    if (pistonBlock && pistonBlock.type.includes("sticky_piston")) {
        if (landInfo && landInfo.land.protection.preventPistonPush) {
            if (!pistonLandInfo || pistonLandInfo.id !== landInfo.id) {
                return false;
            }
        }
        
        let pullDirection = {
            x: pistonPos.x - targetPos.x,
            y: pistonPos.y - targetPos.y,
            z: pistonPos.z - targetPos.z
        };
        if (Math.abs(pullDirection.x) + Math.abs(pullDirection.y) + Math.abs(pullDirection.z) === 1) {
            let pullDestX = targetPos.x + pullDirection.x;
            let pullDestY = targetPos.y + pullDirection.y;
            let pullDestZ = targetPos.z + pullDirection.z;
            let pullDestLandInfo = getLandAt(pullDestX, pullDestY, pullDestZ, targetPos.dimid);
            
            if (landInfo && landInfo.land.protection.preventPistonPush) {
                if (!pullDestLandInfo || pullDestLandInfo.id !== landInfo.id) {
                    return false;
                }
            }
        }
    }
});
mc.listen("onPistonPush", (pistonPos, block) => {
    if (!block) return;
    
    let targetPos = block.pos;
    let landInfo = getLandAt(targetPos.x, targetPos.y, targetPos.z, targetPos.dimid);
    
    if (!landInfo) return;
    if (!landInfo.land.protection.preventPistonPush) return;
    
    let blockType = block.type;
    let blockTileData = block.tileData;
    let direction = getDirectionFromPiston(pistonPos, targetPos);
    
    setTimeout(() => {
        let currentBlock = mc.getBlock(targetPos);
        if (currentBlock && currentBlock.type !== blockType) {
            mc.setBlock(targetPos, blockType, blockTileData);
        }
        if (direction) {
            let newX = targetPos.x + direction.x;
            let newY = targetPos.y + direction.y;
            let newZ = targetPos.z + direction.z;
            
            let newPosBlock = mc.getBlock(new IntPos(newX, newY, newZ, targetPos.dimid));
            if (newPosBlock && newPosBlock.type === blockType) {
                mc.setBlock(new IntPos(newX, newY, newZ, targetPos.dimid), "minecraft:air", 0);
            }
        }
    }, 50);
});
function formatTime(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    
    seconds %= 60;
    minutes %= 60;
    
    let result = "";
    if (hours > 0) result += `${hours}小时`;
    if (minutes > 0) result += `${minutes}分钟`;
    if (seconds > 0 || (hours === 0 && minutes === 0)) result += `${seconds}秒`;
    
    return result;
}
mc.listen("onBlockChanged", (beforeBlock, afterBlock) => {
    if (!beforeBlock || !afterBlock || !beforeBlock.pos) return;
    
    let landInfo = getLandAt(beforeBlock.pos.x, beforeBlock.pos.y, beforeBlock.pos.z, beforeBlock.pos.dimid);
    if (!landInfo) return;
    
    let beforeType = beforeBlock.type || "";
    let afterType = afterBlock.type || "";
    
    if (beforeType.includes("leaves") && afterType.includes("air") && landInfo.land.protection.preventLeafDecay) {
        return false;
    }
    
    if (beforeType.includes("ice") && afterType.includes("water") && landInfo.land.protection.preventIceMelt) {
        return false;
    }
    
    if (beforeType.includes("snow") && afterType.includes("air") && landInfo.land.protection.preventSnowMelt) {
        return false;
    }
    
    if (beforeType.includes("coral") && !beforeType.includes("dead") && afterType.includes("dead") && landInfo.land.protection.preventCoralsFromDying) {
        return false;
    }
    
    if (landInfo.land.protection.preventPistonPush && !beforeType.includes("air") && afterType.includes("air")) {
        let pos = beforeBlock.pos;
        let directions = [
            {x: 1, y: 0, z: 0}, {x: -1, y: 0, z: 0},
            {x: 0, y: 1, z: 0}, {x: 0, y: -1, z: 0},
            {x: 0, y: 0, z: 1}, {x: 0, y: 0, z: -1}
        ];
        for (let dir of directions) {
            let checkPos = new IntPos(pos.x + dir.x, pos.y + dir.y, pos.z + dir.z, pos.dimid);
            let adjacentBlock = mc.getBlock(checkPos);
            if (adjacentBlock && adjacentBlock.type.includes("sticky_piston")) {
                let adjacentLandInfo = getLandAt(checkPos.x, checkPos.y, checkPos.z, checkPos.dimid);
                if (!adjacentLandInfo || adjacentLandInfo.id !== landInfo.id) {
                    setTimeout(() => {
                        mc.setBlock(pos, beforeType, beforeBlock.tileData || 0);
                    }, 1);
                    return false;
                }
            }
        }
    }
});
mc.listen("onMobTrySpawn", (typeName, pos) => {
    if (!typeName || !pos) return;
    
    let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
    if (!landInfo) return;
    
    if (landInfo.land.protection.preventMobSpawning) {
        let hostileMobs = ["zombie", "skeleton", "creeper", "spider", "enderman", "witch", "phantom", "slime"];
        for (let hostile of hostileMobs) {
            if (typeName.includes(hostile)) {
                return false;
            }
        }
    }
});
mc.listen("onLeft", (player) => {
    let xuid = player.xuid;
    
    stopVisualizeLand(player);
    
    let selection = getPlayerSelection(xuid);
    if (selection && (!selection.pos1 || !selection.pos2)) {
        clearPlayerSelection(xuid);
    }
    
    if (player.removeBossBar) {
        player.removeBossBar(888888);
    }
    
    delete playerCurrentLands[xuid];
    delete flyingPlayers[xuid];
    delete lastPositions[xuid];
    delete activePlayers[xuid];
});
setInterval(() => {
    let players = mc.getOnlinePlayers();
    let activeLandIds = new Set();
    let playerLandMap = {};
    
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (!player) continue;
        
        let pos = player.pos;
        let landInfo = getLandAt(pos.x, pos.y, pos.z, pos.dimid);
        
        if (landInfo && !landInfo.isExtended) {
            activeLandIds.add(landInfo.id);
            playerLandMap[player.xuid] = landInfo;
        }
    }
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (!player) continue;
        
        let xuid = player.xuid;
        let pos = player.pos;
        let landInfo = playerLandMap[xuid];
        let currentLandId = playerCurrentLands[xuid] ? playerCurrentLands[xuid].id : null;
        if (landInfo && (!currentLandId || currentLandId !== landInfo.id)) {
            let land = landInfo.land;
            if (land.blacklist && land.blacklist[xuid] && !isLandAdmin(player)) {
                let minX = Math.min(land.pos1.x, land.pos2.x);
                let maxX = Math.max(land.pos1.x, land.pos2.x);
                let minZ = Math.min(land.pos1.z, land.pos2.z);
                let maxZ = Math.max(land.pos1.z, land.pos2.z);
                
                let safePosFound = false;
                
                for (let distance = 20; distance <= 30 && !safePosFound; distance++) {
                    let directions = [
                        {x: minX - distance, z: Math.floor((minZ + maxZ) / 2)},
                        {x: maxX + distance, z: Math.floor((minZ + maxZ) / 2)},
                        {x: Math.floor((minX + maxX) / 2), z: minZ - distance},
                        {x: Math.floor((minX + maxX) / 2), z: maxZ + distance}
                    ];
                    
                    for (let dir of directions) {
                        let testX = Math.floor(dir.x);
                        let testZ = Math.floor(dir.z);
                        
                        let testLandInfo = getLandAt(testX, pos.y, testZ, pos.dimid);
                        if (testLandInfo && testLandInfo.id === landInfo.id) {
                            continue;
                        }
                        
                        let yMin = pos.dimid === 1 ? 0 : -64;
                        let yMax = pos.dimid === 1 ? 120 : 320;
                        
                        if (pos.dimid === 1) {
                            if (searchSafeBlockUpForTP(player, testX, yMin, yMax, testZ, pos.dimid)) {
                                player.tell(`${config.appearance.warningColor}你在该领地的黑名单中，已将你传送出领地`);
                                safePosFound = true;
                                break;
                            }
                        } else {
                            if (searchSafeBlockDownForTP(player, testX, yMin, yMax, testZ, pos.dimid)) {
                                player.tell(`${config.appearance.warningColor}你在该领地的黑名单中，已将你传送出领地`);
                                safePosFound = true;
                                break;
                            }
                        }
                    }
                }
                
                if (!safePosFound) {
                    player.teleport(new FloatPos(minX - 25, 150, Math.floor((minZ + maxZ) / 2) + 0.5, pos.dimid));
                    player.tell(`${config.appearance.warningColor}你在该领地的黑名单中`);
                }
                
                continue;
            }
            if (land.protection && land.protection.allowPlayerEntry === false) {
                if (land.owner !== xuid && (!land.members || !land.members[xuid]) && !isLandAdmin(player)) {
                    let minX = Math.min(land.pos1.x, land.pos2.x);
                    let maxX = Math.max(land.pos1.x, land.pos2.x);
                    let minZ = Math.min(land.pos1.z, land.pos2.z);
                    let maxZ = Math.max(land.pos1.z, land.pos2.z);
                    
                    let safePosFound = false;
                    
                    for (let distance = 20; distance <= 30 && !safePosFound; distance++) {
                        let directions = [
                            {x: minX - distance, z: Math.floor((minZ + maxZ) / 2)},
                            {x: maxX + distance, z: Math.floor((minZ + maxZ) / 2)},
                            {x: Math.floor((minX + maxX) / 2), z: minZ - distance},
                            {x: Math.floor((minX + maxX) / 2), z: maxZ + distance}
                        ];
                        
                        for (let dir of directions) {
                            let testX = Math.floor(dir.x);
                            let testZ = Math.floor(dir.z);
                            
                            let testLandInfo = getLandAt(testX, pos.y, testZ, pos.dimid);
                            if (testLandInfo && testLandInfo.id === landInfo.id) {
                                continue;
                            }
                            
                            let yMin = pos.dimid === 1 ? 0 : -64;
                            let yMax = pos.dimid === 1 ? 120 : 320;
                            
                            if (pos.dimid === 1) {
                                if (searchSafeBlockUpForTP(player, testX, yMin, yMax, testZ, pos.dimid)) {
                                    player.tell(`${config.appearance.warningColor}这个领地禁止外人进入`);
                                    safePosFound = true;
                                    break;
                                }
                            } else {
                                if (searchSafeBlockDownForTP(player, testX, yMin, yMax, testZ, pos.dimid)) {
                                    player.tell(`${config.appearance.warningColor}这个领地禁止外人进入`);
                                    safePosFound = true;
                                    break;
                                }
                            }
                        }
                    }
                    
                    if (!safePosFound) {
                        player.teleport(new FloatPos(minX - 25, 150, Math.floor((minZ + maxZ) / 2) + 0.5, pos.dimid));
                        player.tell(`${config.appearance.warningColor}这个领地禁止外人进入`);
                    }
                    
                    continue;
                }
            }
            
            playerCurrentLands[xuid] = landInfo;
            if (land.playSoundOnEnter !== false) {
                mc.runcmdEx(`execute as "${player.name}" at @s run playsound random.orb @s ~ ~ ~ 1 1`);
            }
            let displayType = land.enterDisplayType || config.visualization.landEnterDisplayType || "actionbar";
            
            if (displayType === "actionbar") {
                let message = "";
                
                if (land.customEnterMessage) {
                    message = land.customEnterMessage
                        .replace(/{land}/g, land.name)
                        .replace(/{owner}/g, land.ownerName);
                } else {
                    if (land.owner === xuid) {
                        message = `${config.appearance.highlightColor}欢迎回家 ${config.appearance.secondaryColor}| 领地: ${land.name}`;
                    } else {
                        message = `${config.appearance.secondaryColor}进入 ${land.ownerName} 的领地: ${config.appearance.infoColor}${land.name}`;
                        if (land.members && land.members[xuid]) {
                            message += ` ${config.appearance.highlightColor}[成员]`;
                        }
                    }
                    
                    if (land.parentId) {
                        let parentLand = landsData[land.parentId];
                        if (parentLand) {
                            message += ` ${config.appearance.secondaryColor}(子领地)`;
                        }
                    }
                }
                
                player.sendText(message, 1);
            } else if (displayType === "bossbar") {
                let barColor = 2;
                if (land.owner === xuid) {
                    barColor = 3;
                } else if (land.members && land.members[xuid]) {
                    barColor = 1;
                }
                
                let message = "";
                let percentage = 100;
                
                if (config.visualization.showBossBarCenterPercentage) {
                    let minX = Math.min(land.pos1.x, land.pos2.x);
                    let maxX = Math.max(land.pos1.x, land.pos2.x);
                    let minZ = Math.min(land.pos1.z, land.pos2.z);
                    let maxZ = Math.max(land.pos1.z, land.pos2.z);
                    let centerX = (minX + maxX) / 2;
                    let centerZ = (minZ + maxZ) / 2;
                    let distToCenter = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.z - centerZ, 2));
                    let maxDist = Math.sqrt(Math.pow((maxX - minX) / 2, 2) + Math.pow((maxZ - minZ) / 2, 2));
                    percentage = Math.max(0, Math.min(100, ((maxDist - distToCenter) / maxDist) * 100));
                    
                    if (land.customEnterMessage) {
                        message = land.customEnterMessage.replace(/{land}/g, land.name).replace(/{owner}/g, land.ownerName);
                    } else if (land.owner === xuid) {
                        message = `${land.name} - 中心度: ${percentage.toFixed(0)}%`;
                    } else {
                        message = `${land.name} - ${land.ownerName} - 中心度: ${percentage.toFixed(0)}%`;
                    }
                } else {
                    if (land.customEnterMessage) {
                        message = land.customEnterMessage.replace(/{land}/g, land.name).replace(/{owner}/g, land.ownerName);
                    } else if (land.owner === xuid) {
                        message = `${land.name}`;
                    } else {
                        message = `${land.name} - ${land.ownerName}`;
                    }
                }
                
                player.removeBossBar(999999);
                player.setBossBar(999999, message, percentage, barColor);
            } else if (displayType !== "none") {
                let title = "";
                let subtitle = "";
                
                if (land.customEnterMessage) {
                    title = land.customEnterMessage
                        .replace(/{land}/g, land.name)
                        .replace(/{owner}/g, land.ownerName);
                    subtitle = "";
                } else {
                    if (land.owner === xuid) {
                        title = `${config.appearance.highlightColor}欢迎回家`;
                        subtitle = `${config.appearance.secondaryColor}领地: ${land.name}`;
                    } else {
                        title = `${config.appearance.secondaryColor}欢迎来到 ${land.ownerName} 的领地`;
                        subtitle = `${config.appearance.infoColor}领地: ${land.name}`;
                        if (land.members && land.members[xuid]) {
                            subtitle += ` | ${config.appearance.highlightColor}你是成员`;
                        }
                    }
                    
                    if (land.parentId) {
                        let parentLand = landsData[land.parentId];
                        if (parentLand) {
                            subtitle += `\n${config.appearance.secondaryColor}(子领地 | 主领地: ${parentLand.name})`;
                        }
                    }
                }
                
                player.setTitle(title, 2);
                if (subtitle) player.setTitle(subtitle, 3);
            }
            
            land.lastPromptTime = Date.now();
            if (!config.visualization.actionBarMode || config.visualization.actionBarMode === 0) {
                updateActionBar(player, land, xuid);
            }
            if (config.protection.enableFlyInLand) {
                enablePlayerFlight(player, landInfo.id);
            }
        } 
        else if (!landInfo && currentLandId) {
            let previousLand = landsData[currentLandId];
            
            delete playerCurrentLands[xuid];
            
            if (previousLand) {
                if (previousLand.playSoundOnLeave !== false) {
                    mc.runcmdEx(`execute as "${player.name}" at @s run playsound random.pop @s ~ ~ ~ 1 0.8`);
                }
                let displayType = previousLand.enterDisplayType || config.visualization.landEnterDisplayType || "actionbar";
                
                if (previousLand.customLeaveMessage) {
                    let message = previousLand.customLeaveMessage
                        .replace(/{land}/g, previousLand.name)
                        .replace(/{owner}/g, previousLand.ownerName);
                    
                    if (displayType === "actionbar") {
                        player.sendText(message, 1);
                    } else if (displayType === "bossbar") {
                        player.removeBossBar(999999);
                        player.setBossBar(999999, message, 100, 4);
                        setTimeout(() => {
                            try {
                                let pl = mc.getPlayer(xuid);
                                if (pl) pl.removeBossBar(999999);
                            } catch (e) {}
                        }, 3000);
                    } else if (displayType !== "none") {
                        player.setTitle(message, 2);
                    }
                } else {
                    player.setTitle(`${config.appearance.infoColor}已离开领地区域`, 2);
                }
            } else {
                player.setTitle(`${config.appearance.infoColor}已离开领地区域`, 2);
            }
            
            player.setTitle("", 3);
            player.setTitle("", 4);
            if (flyingPlayers[xuid]) {
                disablePlayerFlight(player);
            }
            if (player.removeBossBar) {
                player.removeBossBar(888888);
                player.removeBossBar(999999);
            }
        }
        if (landInfo) {
            let land = landInfo.land;
            
            if (config.visualization.actionBarMode === 1) {
                updateActionBar(player, land, xuid);
            }
            let displayType = land.enterDisplayType || config.visualization.landEnterDisplayType || "actionbar";
            if (displayType === "bossbar" && config.visualization.showBossBarCenterPercentage) {
                let minX = Math.min(land.pos1.x, land.pos2.x);
                let maxX = Math.max(land.pos1.x, land.pos2.x);
                let minZ = Math.min(land.pos1.z, land.pos2.z);
                let maxZ = Math.max(land.pos1.z, land.pos2.z);
                let centerX = (minX + maxX) / 2;
                let centerZ = (minZ + maxZ) / 2;
                let distToCenter = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.z - centerZ, 2));
                let maxDist = Math.sqrt(Math.pow((maxX - minX) / 2, 2) + Math.pow((maxZ - minZ) / 2, 2));
                let percentage = Math.max(0, Math.min(100, ((maxDist - distToCenter) / maxDist) * 100));
                
                let barColor = land.owner === xuid ? 3 : (land.members && land.members[xuid] ? 1 : 2);
                let message = land.customEnterMessage 
                    ? land.customEnterMessage.replace(/{land}/g, land.name).replace(/{owner}/g, land.ownerName)
                    : (land.owner === xuid ? `${land.name} - 中心度: ${percentage.toFixed(0)}%` : `${land.name} - ${land.ownerName} - 中心度: ${percentage.toFixed(0)}%`);
                
                player.removeBossBar(999999);
                player.setBossBar(999999, message, percentage, barColor);
            }
        }
        lastPositions[xuid] = { x: pos.x, y: pos.y, z: pos.z, dimid: pos.dimid };
    }
}, 1000);
function updateActionBar(player, land, xuid) {
    let color = config.appearance.infoColor;
    if (land.owner === xuid) color = config.appearance.highlightColor;
    else if (land.members && land.members[xuid]) color = config.appearance.primaryColor;
    
    let subLandInfo = "";
    if (land.parentId) {
        subLandInfo = ` ${config.appearance.secondaryColor}(子领地)`;
    }
    
    let line1 = `${color}当前领地: ${land.name}${subLandInfo} | 所有者: ${land.ownerName}`;
    
    player.setTitle(line1, 4);
}

const visualizingPlayers = {};

function visualizeLand(player, landId) {
    let land = landsData[landId];
    if (!land) return false;
    
    let xuid = player.xuid;
    
    if (visualizingPlayers[xuid]) {
        clearInterval(visualizingPlayers[xuid].intervalId);
    }
    
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    let dim = land.dim;
    
    let minY, maxY;
    
    if (land.is2D) {
        minY = Math.max(player.pos.y - 10, config.limits.worldHeightMin);
        maxY = Math.min(player.pos.y + config.visualization.verticalLineHeight, config.limits.worldHeightMax);
    } else {
        minY = Math.min(land.pos1.y, land.pos2.y);
        maxY = Math.max(land.pos1.y, land.pos2.y);
    }
    
    let ps = mc.newParticleSpawner(150, true, true);
    
    let intervalId = setInterval(() => {
        let p = mc.getPlayer(xuid);
        if (!p) {
            clearInterval(intervalId);
            delete visualizingPlayers[xuid];
            return;
        }
        if (p.pos.dimid !== dim) return;
        
        let interval = config.visualization.particleInterval || 2;
        let verticalLineSpacing = config.visualization.verticalLineSpacing || 5;
        
        try {
            let particleType = config.visualization.particleType || "minecraft:heart_particle";
            if (land.is2D && config.visualization.verticalLinesOnly2D) {
                minY = Math.max(p.pos.y - 5, config.limits.worldHeightMin);
                maxY = Math.min(p.pos.y + config.visualization.verticalLineHeight, config.limits.worldHeightMax);
                for (let x = minX; x <= maxX; x += verticalLineSpacing) {
                    for (let y = minY; y <= maxY; y += interval) {
                        ps.spawnParticle(new FloatPos(x, y, minZ, dim), particleType);
                    }
                    for (let y = minY; y <= maxY; y += interval) {
                        ps.spawnParticle(new FloatPos(x, y, maxZ, dim), particleType);
                    }
                }
                for (let z = minZ; z <= maxZ; z += verticalLineSpacing) {
                    for (let y = minY; y <= maxY; y += interval) {
                        ps.spawnParticle(new FloatPos(minX, y, z, dim), particleType);
                    }
                    for (let y = minY; y <= maxY; y += interval) {
                        ps.spawnParticle(new FloatPos(maxX, y, z, dim), particleType);
                    }
                }
            } else {
                for (let x = minX; x <= maxX; x += interval) {
                    let pos1 = new FloatPos(x, minY, minZ, dim);
                    let pos2 = new FloatPos(x, minY, maxZ, dim);
                    ps.spawnParticle(pos1, particleType);
                    ps.spawnParticle(pos2, particleType);
                }
                
                for (let z = minZ; z <= maxZ; z += interval) {
                    let pos1 = new FloatPos(minX, minY, z, dim);
                    let pos2 = new FloatPos(maxX, minY, z, dim);
                    ps.spawnParticle(pos1, particleType);
                    ps.spawnParticle(pos2, particleType);
                }
                if (config.visualization.showHeight) {
                    for (let x = minX; x <= maxX; x += interval) {
                        let pos1 = new FloatPos(x, maxY, minZ, dim);
                        let pos2 = new FloatPos(x, maxY, maxZ, dim);
                        ps.spawnParticle(pos1, particleType);
                        ps.spawnParticle(pos2, particleType);
                    }
                    
                    for (let z = minZ; z <= maxZ; z += interval) {
                        let pos1 = new FloatPos(minX, maxY, z, dim);
                        let pos2 = new FloatPos(maxX, maxY, z, dim);
                        ps.spawnParticle(pos1, particleType);
                        ps.spawnParticle(pos2, particleType);
                    }
                    for (let y = minY; y <= maxY; y += interval) {
                        let pos1 = new FloatPos(minX, y, minZ, dim);
                        let pos2 = new FloatPos(minX, y, maxZ, dim);
                        let pos3 = new FloatPos(maxX, y, minZ, dim);
                        let pos4 = new FloatPos(maxX, y, maxZ, dim);
                        ps.spawnParticle(pos1, particleType);
                        ps.spawnParticle(pos2, particleType);
                        ps.spawnParticle(pos3, particleType);
                        ps.spawnParticle(pos4, particleType);
                    }
                } else if (land.is2D) {
                    for (let y = minY; y <= maxY; y += interval) {
                        ps.spawnParticle(new FloatPos(minX, y, minZ, dim), particleType);
                        ps.spawnParticle(new FloatPos(maxX, y, minZ, dim), particleType);
                        ps.spawnParticle(new FloatPos(minX, y, maxZ, dim), particleType);
                        ps.spawnParticle(new FloatPos(maxX, y, maxZ, dim), particleType);
                    }
                }
            }
            if (config.protection.protectionRange > 0) {
                let range = config.protection.protectionRange;
                let extMinX = minX - range;
                let extMaxX = maxX + range;
                let extMinZ = minZ - range;
                let extMaxZ = maxZ + range;
                
                let rangeInterval = interval * 3;
                for (let x = extMinX; x <= extMaxX; x += rangeInterval) {
                    ps.spawnParticle(new FloatPos(x, minY, extMinZ, dim), particleType);
                    ps.spawnParticle(new FloatPos(x, minY, extMaxZ, dim), particleType);
                }
                
                for (let z = extMinZ; z <= extMaxZ; z += rangeInterval) {
                    ps.spawnParticle(new FloatPos(extMinX, minY, z, dim), particleType);
                    ps.spawnParticle(new FloatPos(extMaxX, minY, z, dim), particleType);
                }
            }
        } catch (e) {
            logger.error(`[${PLUGIN_NAME}] 显示领地边界时出错: ${e}`);
        }
    }, 500);
    visualizingPlayers[xuid] = { 
        landId: landId,
        intervalId: intervalId 
    };
    setTimeout(() => {
        if (visualizingPlayers[xuid] && visualizingPlayers[xuid].landId === landId) {
            stopVisualizeLand(player);
        }
    }, config.visualization.displayDuration * 1000);
    
    return true;
}
function stopVisualizeLand(player) {
    let xuid = player.xuid;
    if (!visualizingPlayers[xuid]) return false;
    
    clearInterval(visualizingPlayers[xuid].intervalId);
    delete visualizingPlayers[xuid];
    
    player.tell(`${config.appearance.highlightColor}已停止显示领地边界`);
    return true;
}
function visualizeSelectionWithDuration(player, selection, durationSeconds) {
    if (!selection.pos1 || !selection.pos2) return false;
    if (selection.pos1.dimid !== selection.pos2.dimid) return false;
    
    let minX = Math.min(selection.pos1.x, selection.pos2.x);
    let maxX = Math.max(selection.pos1.x, selection.pos2.x);
    let minY = Math.min(selection.pos1.y, selection.pos2.y);
    let maxY = Math.max(selection.pos1.y, selection.pos2.y);
    let minZ = Math.min(selection.pos1.z, selection.pos2.z);
    let maxZ = Math.max(selection.pos1.z, selection.pos2.z);
    let dim = selection.pos1.dimid;
    
    let ps = mc.newParticleSpawner(150, true, true);
    let interval = config.visualization.particleInterval || 2;
    let particleType = config.visualization.particleType || "minecraft:heart_particle";
    
    let counter = 0;
    let maxCount = Math.floor(durationSeconds * 2);
    
    let intervalId = setInterval(() => {
        if (counter >= maxCount) {
            clearInterval(intervalId);
            return;
        }
        
        try {
            for (let x = minX; x <= maxX; x += interval) {
                ps.spawnParticle(new FloatPos(x, minY, minZ, dim), particleType);
                ps.spawnParticle(new FloatPos(x, minY, maxZ, dim), particleType);
            }
            
            for (let z = minZ; z <= maxZ; z += interval) {
                ps.spawnParticle(new FloatPos(minX, minY, z, dim), particleType);
                ps.spawnParticle(new FloatPos(maxX, minY, z, dim), particleType);
            }
            
            for (let x = minX; x <= maxX; x += interval) {
                ps.spawnParticle(new FloatPos(x, maxY, minZ, dim), particleType);
                ps.spawnParticle(new FloatPos(x, maxY, maxZ, dim), particleType);
            }
            
            for (let z = minZ; z <= maxZ; z += interval) {
                ps.spawnParticle(new FloatPos(minX, maxY, z, dim), particleType);
                ps.spawnParticle(new FloatPos(maxX, maxY, z, dim), particleType);
            }
            
            for (let y = minY; y <= maxY; y += interval) {
                ps.spawnParticle(new FloatPos(minX, y, minZ, dim), particleType);
                ps.spawnParticle(new FloatPos(minX, y, maxZ, dim), particleType);
                ps.spawnParticle(new FloatPos(maxX, y, minZ, dim), particleType);
                ps.spawnParticle(new FloatPos(maxX, y, maxZ, dim), particleType);
            }
        } catch (e) {
            logger.error(`[${PLUGIN_NAME}] 显示选区边界时出错: ${e}`);
        }
        
        counter++;
    }, 500);
    
    return true;
}
function visualizeSelection(player, selection) {
    if (!selection.pos1 || !selection.pos2) return false;
    if (selection.pos1.dimid !== selection.pos2.dimid) return false;
    
    let minX = Math.min(selection.pos1.x, selection.pos2.x);
    let maxX = Math.max(selection.pos1.x, selection.pos2.x);
    let minY = Math.min(selection.pos1.y, selection.pos2.y);
    let maxY = Math.max(selection.pos1.y, selection.pos2.y);
    let minZ = Math.min(selection.pos1.z, selection.pos2.z);
    let maxZ = Math.max(selection.pos1.z, selection.pos2.z);
    let dim = selection.pos1.dimid;
    
    let ps = mc.newParticleSpawner(150, true, true);
    
    let interval = config.visualization.particleInterval || 2;
    try {
        let particleType = config.visualization.particleType || "minecraft:heart_particle";
        for (let x = minX; x <= maxX; x += interval) {
            ps.spawnParticle(new FloatPos(x, minY, minZ, dim), particleType);
            ps.spawnParticle(new FloatPos(x, minY, maxZ, dim), particleType);
        }
        
        for (let z = minZ; z <= maxZ; z += interval) {
            ps.spawnParticle(new FloatPos(minX, minY, z, dim), particleType);
            ps.spawnParticle(new FloatPos(maxX, minY, z, dim), particleType);
        }
        for (let x = minX; x <= maxX; x += interval) {
            ps.spawnParticle(new FloatPos(x, maxY, minZ, dim), particleType);
            ps.spawnParticle(new FloatPos(x, maxY, maxZ, dim), particleType);
        }
        
        for (let z = minZ; z <= maxZ; z += interval) {
            ps.spawnParticle(new FloatPos(minX, maxY, z, dim), particleType);
            ps.spawnParticle(new FloatPos(maxX, maxY, z, dim), particleType);
        }
        for (let y = minY; y <= maxY; y += interval) {
            ps.spawnParticle(new FloatPos(minX, y, minZ, dim), particleType);
            ps.spawnParticle(new FloatPos(minX, y, maxZ, dim), particleType);
            ps.spawnParticle(new FloatPos(maxX, y, minZ, dim), particleType);
            ps.spawnParticle(new FloatPos(maxX, y, maxZ, dim), particleType);
        }
    } catch (e) {
        logger.error(`[${PLUGIN_NAME}] 显示选区边界时出错: ${e}`);
        return false;
    }
    
    return true;
}
function calculateLandTax(land) {
    if (!config.economy.taxEnabled) return 0;
    
    let volume = calculateSelectionVolume({
        pos1: land.pos1,
        pos2: land.pos2
    }, land.is2D);
    let tax = volume * config.economy.taxRate / 1000;
    
    return Math.max(10, Math.floor(tax));
}
function checkAndCollectTax() {
    if (!config.economy.taxEnabled) return;
    
    let now = Date.now();
    let taxInterval = config.economy.taxInterval * 1000;
    
    for (let landId in landsData) {
        let land = landsData[landId];
        if (now - land.lastTaxTime >= taxInterval) {
            let taxAmount = calculateLandTax(land);
            let owner = mc.getPlayer(land.owner);
            let ownerBalance = getBalance(land.owner);
            if (ownerBalance >= taxAmount) {
                reduceMoney(land.owner, taxAmount);
                land.lastTaxTime = now;
                if (owner) {
                    owner.tell(`${config.appearance.infoColor}已收取领地 "${land.name}" 的税金：${taxAmount}`);
                }
            } else {
                if (owner) {
                    owner.tell(`${config.appearance.warningColor}警告：你的余额不足以支付领地 "${land.name}" 的税金 (${taxAmount})！如果长时间不缴纳税金，领地将被删除。`);
                }
                land.taxMissed = (land.taxMissed || 0) + 1;
                if (land.taxMissed >= config.economy.taxMissMaxCount) {
                    removeFromIndex(landId);
                    delete landsData[landId];
                    
                    if (owner) {
                        owner.tell(`${config.appearance.warningColor}由于长期未缴纳税金，你的领地 "${land.name}" 已被删除！`);
                    }
                }
            }
        }
    }
    
    saveLandsData();
}
if (config.economy.taxEnabled) {
    setInterval(checkAndCollectTax, 3600000);
}

function showMainMenu(player) {
    let xuid = player.xuid;
    let pos = player.blockPos;
    let landId = getLandAtPos(pos);
    
    let ownedCount = 0;
    for (let lid in landsData) {
        if (landsData[lid].owner === xuid && !landsData[lid].parentId) {
            ownedCount++;
        }
    }
    
    let canApply = false;
    let applyLandId = null;
    let applyLandName = null;
    
    if (landId && landsData[landId]) {
        let land = landsData[landId];
        if (land.owner !== xuid && (!land.members || !land.members[xuid])) {
            canApply = true;
            applyLandId = landId;
            applyLandName = land.name;
        }
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(config.appearance.mainMenuTitle);
    
    let content = `${config.appearance.mainMenuContent}\n\n${config.appearance.secondaryColor}你拥有 ${config.appearance.highlightColor}${ownedCount}${config.appearance.secondaryColor} 块领地`;
    if (canApply) {
        content += `\n\n${config.appearance.highlightColor}你正在领地 "${applyLandName}" 中`;
    }
    form.setContent(content);
    
    if (canApply) {
        form.addButton(`${config.appearance.highlightColor}申请加入领地\n${config.appearance.infoColor}申请加入 ${applyLandName}`, "textures/ui/invite_base");
    }
    
    form.addButton(`${config.appearance.highlightColor}创建领地\n${config.appearance.infoColor}选区并购买新领地`, "textures/ui/icon_iron_pickaxe");
    form.addButton(`${config.appearance.secondaryColor}我的领地\n${config.appearance.infoColor}管理你的领地`, "textures/ui/confirm");
    form.addButton(`${config.appearance.primaryColor}领地传送\n${config.appearance.infoColor}传送到你的领地`, "textures/ui/World");
    form.addButton(`${config.appearance.highlightColor}领地帮助\n${config.appearance.infoColor}查看使用说明`, "textures/ui/icon_bookshelf");
    
    if (isLandAdmin(player)) {
        form.addButton(`${config.appearance.warningColor}管理员面板\n${config.appearance.infoColor}系统管理与配置`, "textures/ui/op");
    }
    
    form.addButton(`${config.appearance.secondaryColor}关闭`, "textures/ui/icon_import");
    
    player.sendForm(form, (pl, id) => {
        if (id == null) return;
        
        let idx = 0;
        if (canApply && id === idx++) {
            showApplyJoinLandForm(pl, applyLandId);
        } else if (id === idx++) {
            showCreateLandMenu(pl);
        } else if (id === idx++) {
            showMyLandsMenu(pl);
        } else if (id === idx++) {
            showLandTeleportMenu(pl);
        } else if (id === idx++) {
            showHelpMenu(pl);
        } else if (isLandAdmin(pl) && id === idx++) {
            showAdminMenu(pl);
        }
    });
}

function showLandInfoForMember(player, landId) {
    let land = landsData[landId];
    if (!land) {
        showMainMenu(player);
        return;
    }
    
    let xuid = player.xuid;
    let memberInfo = land.members[xuid];
    let permGroup = memberInfo.permissionGroup || "default";
    
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minY = Math.min(land.pos1.y, land.pos2.y);
    let maxY = Math.max(land.pos1.y, land.pos2.y);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    
    let size = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    let flyStatus = land.permissions && land.permissions.fly ? "§a已开启" : "§c未开启";
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}${land.name}`);
    form.setContent(
        `${config.appearance.infoColor}领地名称: ${config.appearance.highlightColor}${land.name}\n` +
        `${config.appearance.secondaryColor}所有者: §e${land.ownerName}\n` +
        `${config.appearance.secondaryColor}类型: ${land.is2D ? "§a2D领地" : "§b3D领地"}\n` +
        `${config.appearance.secondaryColor}大小: §a${size}§3 方块\n` +
        `${config.appearance.secondaryColor}范围: §3X(${minX}~${maxX}) Y(${minY}~${maxY}) Z(${minZ}~${maxZ})\n` +
        `${config.appearance.secondaryColor}飞行: ${flyStatus}\n\n` +
        `${config.appearance.primaryColor}你的身份: §e成员\n` +
        `${config.appearance.primaryColor}权限组: §e${permGroup}`
    );
    
    if (land.teleportPos) {
        form.addButton(`${config.appearance.primaryColor}传送到领地\n${config.appearance.infoColor}前往领地传送点`, "textures/ui/World");
    }
    form.addButton(`${config.appearance.secondaryColor}查看我的权限\n${config.appearance.infoColor}查看当前权限`, "textures/ui/permissions_member_star");
    form.addButton(`${config.appearance.warningColor}退出领地\n${config.appearance.infoColor}离开此领地成员`, "textures/ui/cancel");
    form.addButton(`${config.appearance.secondaryColor}返回主菜单`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null) return;
        
        let idx = 0;
        if (land.teleportPos && id === idx++) {
            let tpPos = land.teleportPos;
            pl.teleport(new FloatPos(tpPos.x, tpPos.y, tpPos.z, land.dim));
            pl.tell(`${config.appearance.highlightColor}已传送到领地 "${land.name}"`);
        } else if (id === idx++) {
            showMemberPermissions(pl, landId);
        } else if (id === idx++) {
            showLeaveLandConfirm(pl, landId);
        }
    });
}

function showMemberPermissions(player, landId) {
    let land = landsData[landId];
    if (!land) return;
    
    let xuid = player.xuid;
    let memberInfo = land.members[xuid];
    if (!memberInfo) {
        player.tell(`${config.appearance.warningColor}你不是此领地的成员`);
        return;
    }
    
    let permGroup = memberInfo.permissionGroup || "default";
    let perms = land.memberPermissions && land.memberPermissions[permGroup] ? land.memberPermissions[permGroup] : (land.permissions || {});
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}我的权限`);
    
    let content = `${config.appearance.infoColor}领地: §e${land.name}\n`;
    content += `${config.appearance.primaryColor}权限组: §e${permGroup}\n\n`;
    content += `${config.appearance.highlightColor}当前权限:\n`;
    content += `${config.appearance.secondaryColor}破坏方块: ${perms.break ? "§a允许" : "§c禁止"}\n`;
    content += `${config.appearance.secondaryColor}放置方块: ${perms.place ? "§a允许" : "§c禁止"}\n`;
    content += `${config.appearance.secondaryColor}使用物品: ${perms.useItem ? "§a允许" : "§c禁止"}\n`;
    content += `${config.appearance.secondaryColor}打开容器: ${perms.openContainer ? "§a允许" : "§c禁止"}\n`;
    content += `${config.appearance.secondaryColor}攻击实体: ${perms.attackEntity ? "§a允许" : "§c禁止"}\n`;
    content += `${config.appearance.secondaryColor}与实体交互: ${perms.interactEntity ? "§a允许" : "§c禁止"}\n`;
    content += `${config.appearance.secondaryColor}拾取物品: ${perms.pickupItem ? "§a允许" : "§c禁止"}\n`;
    content += `${config.appearance.secondaryColor}丢弃物品: ${perms.dropItem ? "§a允许" : "§c禁止"}\n`;
    
    form.setContent(content);
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        showLandInfoForMember(pl, landId);
    });
}

function showLeaveLandConfirm(player, landId) {
    let land = landsData[landId];
    if (!land) return;
    
    player.sendModalForm(
        `${config.appearance.warningColor}退出领地`,
        `${config.appearance.infoColor}确定要退出领地 "${land.name}" 吗?\n\n${config.appearance.warningColor}退出后你将失去该领地的所有权限。`,
        "§c确认退出",
        "§a取消",
        (pl, result) => {
            if (result) {
                if (land.members && land.members[pl.xuid]) {
                    delete land.members[pl.xuid];
                    saveLandsData();
                    pl.tell(`${config.appearance.highlightColor}你已退出领地 "${land.name}"`);
                    showMainMenu(pl);
                } else {
                    pl.tell(`${config.appearance.warningColor}你不是此领地的成员`);
                }
            } else {
                showLandInfoForMember(pl, landId);
            }
        }
    );
}

function showFastLandManager(player, landId) {
    let land = landsData[landId];
    if (!land) {
        showMainMenu(player);
        return;
    }
    
    let isOwner = land.owner === player.xuid || isLandAdmin(player);
    let flyStatus = land.permissions && land.permissions.fly ? "§a已开启" : "§c未开启";
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}领地快捷管理`);
    form.setContent(`${config.appearance.infoColor}当前领地: ${config.appearance.highlightColor}${land.name}\n${config.appearance.secondaryColor}选择要执行的操作:`);
    
    form.addButton(`${config.appearance.highlightColor}领地信息\n${config.appearance.infoColor}查看详细信息`, "textures/ui/icon_book_writable");
    form.addButton(`${config.appearance.primaryColor}传送点管理\n${config.appearance.infoColor}设置领地传送点`, "textures/ui/World");
    form.addButton(`${config.appearance.secondaryColor}领地设置\n${config.appearance.infoColor}配置领地选项`, "textures/ui/icon_setting");
    form.addButton(`${config.appearance.primaryColor}权限管理\n${config.appearance.infoColor}设置访客权限`, "textures/ui/permissions_member_star");
    form.addButton(`${config.appearance.highlightColor}成员管理\n${config.appearance.infoColor}添加/移除成员`, "textures/ui/dressing_room_skins");
    form.addButton(`${config.appearance.primaryColor}邀请成员\n${config.appearance.infoColor}邀请离线玩家加入`, "textures/ui/invite_base");
    form.addButton(`${config.appearance.secondaryColor}领地飞行 ${flyStatus}\n${config.appearance.infoColor}切换飞行权限`, "textures/ui/flyingascend");
    form.addButton(`${config.appearance.primaryColor}扩大领地\n${config.appearance.infoColor}扩展领地范围`, "textures/ui/anvil_icon");
    form.addButton(`${config.appearance.highlightColor}领地转让\n${config.appearance.infoColor}转让给其他玩家`, "textures/ui/friend_glyph_desaturated");
    form.addButton(`${config.appearance.warningColor}删除领地\n${config.appearance.infoColor}永久删除此领地`, "textures/ui/trash_default");
    form.addButton(`${config.appearance.warningColor}关闭`, "textures/ui/cancel");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 10) return;
        
        switch (id) {
            case 0:
                showLandInformation(pl, landId);
                break;
            case 1:
                showSetTeleportPosMenu(pl, landId);
                break;
            case 2:
                showLandSettingsMenu(pl, landId);
                break;
            case 3:
                showLandPermissionsMenu(pl, landId);
                break;
            case 4:
                showLandMembersMenu(pl, landId);
                break;
            case 5:
                showSendInvitationForm(pl, landId);
                break;
            case 6:
                toggleLandFly(pl, landId);
                break;
            case 7:
                showExpandLandMenu(pl, landId);
                break;
            case 8:
                showTransferLandMenu(pl, landId);
                break;
            case 9:
                showDeleteLandConfirmation(pl, landId);
                break;
        }
    });
}

function showLandInformation(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    let ownerName = land.ownerName || "未知";
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    let volume = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    let memberCount = land.members ? Object.keys(land.members).length : 0;
    let maxMembers = config.limits.maxMembersPerLand || 6;
    let dimName = getDimensionName(land.dim);
    let landType = land.is2D ? "2D" : "3D (有高度限制)";
    let createTime = land.createTime ? new Date(land.createTime).toLocaleString() : "未知";
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}领地详情: ${land.name}`);
    
    let content = `${config.appearance.secondaryColor}领地信息:\n`;
    content += `${config.appearance.highlightColor}所有者: ${config.appearance.infoColor}${ownerName}\n`;
    content += `${config.appearance.highlightColor}创建时间: ${config.appearance.infoColor}${createTime}\n`;
    content += `${config.appearance.highlightColor}维度: ${config.appearance.infoColor}${dimName}\n`;
    content += `${config.appearance.highlightColor}类型: ${config.appearance.infoColor}${landType}\n`;
    content += `${config.appearance.highlightColor}范围: ${config.appearance.infoColor}${minX},${minZ} 至 ${maxX},${maxZ}\n`;
    content += `${config.appearance.highlightColor}大小: ${config.appearance.infoColor}${volume}方块\n`;
    content += `${config.appearance.highlightColor}成员数: ${config.appearance.infoColor}${memberCount} / ${maxMembers}`;
    form.setContent(content);
    
    form.addButton(`${config.appearance.highlightColor}传送到领地`, "textures/ui/World");
    form.addButton(`${config.appearance.primaryColor}显示领地边界`, "textures/ui/magnifyingGlass");
    form.addButton(`${config.appearance.secondaryColor}管理成员`, "textures/ui/dressing_room_skins");
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 3) {
            showFastLandManager(pl, landId);
            return;
        }
        
        switch (id) {
            case 0:
                teleportToLand(pl, landId);
                break;
            case 1:
                visualizeLand(pl, landId);
                pl.tell(`${config.appearance.highlightColor}正在显示领地边界`);
                showLandInformation(pl, landId);
                break;
            case 2:
                showLandMembersMenu(pl, landId);
                break;
        }
    });
}

function showEditLandNicknameForm(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.primaryColor}修改领地名称`);
    form.addLabel(`${config.appearance.infoColor}输入新的领地名称:`);
    form.addInput("", land.name, land.name);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showFastLandManager(pl, landId);
            return;
        }
        
        let newName = data[1];
        if (!newName || newName.trim() === "") {
            pl.tell(`${config.appearance.warningColor}领地名称不能为空`);
            showFastLandManager(pl, landId);
            return;
        }
        
        newName = newName.replace(/%/g, "％");
        landsData[landId].name = newName;
        saveLandsData();
        
        pl.sendModalForm(
            `${config.appearance.highlightColor}修改成功`,
            `${config.appearance.infoColor}领地名称已更新为: ${config.appearance.highlightColor}${newName}`,
            `${config.appearance.primaryColor}返回`,
            `${config.appearance.secondaryColor}关闭`,
            (p, r) => { if (r) showFastLandManager(p, landId); }
        );
    });
}

function showEditLandDescribeForm(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let currentDesc = land.description || land.enterMessage || "";
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.primaryColor}编辑领地描述`);
    form.addLabel(`${config.appearance.infoColor}输入领地描述/进入提示:`);
    form.addInput("", currentDesc || "欢迎来到我的领地!", currentDesc);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showFastLandManager(pl, landId);
            return;
        }
        
        let newDesc = data[1] || "";
        newDesc = newDesc.replace(/%/g, "％");
        landsData[landId].description = newDesc;
        landsData[landId].enterMessage = newDesc;
        saveLandsData();
        
        pl.sendModalForm(
            `${config.appearance.highlightColor}修改成功`,
            `${config.appearance.infoColor}领地描述已更新`,
            `${config.appearance.primaryColor}返回`,
            `${config.appearance.secondaryColor}关闭`,
            (p, r) => { if (r) showFastLandManager(p, landId); }
        );
    });
}

function showReselectLandMenu(player, landId) {
    let land = landsData[landId];
    if (!land || land.owner !== player.xuid) {
        player.tell(`${config.appearance.warningColor}你不是这块领地的主人`);
        return;
    }
    
    player.sendModalForm(
        `${config.appearance.primaryColor}重新选区`,
        `${config.appearance.infoColor}你即将重新选择领地 ${config.appearance.highlightColor}${land.name}${config.appearance.infoColor} 的范围。\n\n${config.appearance.warningColor}请使用 /land pos1 和 /land pos2 选择新的范围,\n然后使用 /land reselect ${land.name} 确认。\n\n${config.appearance.secondaryColor}注意: 扩大需要支付额外费用，缩小会退还部分费用。`,
        `${config.appearance.highlightColor}知道了`,
        `${config.appearance.secondaryColor}取消`,
        (pl, result) => {
            if (result) {
                pl.tell(`${config.appearance.highlightColor}请使用 /land pos1 和 /land pos2 选择新范围`);
                playerReselectingLand[pl.xuid] = landId;
            }
            showFastLandManager(pl, landId);
        }
    );
}

function showLandTeleportMenu(player) {
    let xuid = player.xuid;
    let ownedLands = [];
    let trustedLands = [];
    
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.parentId) continue;
        
        if (land.owner === xuid) {
            let tpPos = land.teleportPos || { x: land.pos1.x, y: land.pos1.y, z: land.pos1.z, dimid: land.dim };
            ownedLands.push({
                id: landId,
                name: land.name,
                dim: getDimensionName(land.dim),
                pos: `${tpPos.x}, ${tpPos.y}, ${tpPos.z}`
            });
        } else if (land.members && land.members[xuid]) {
            let tpPos = land.teleportPos || { x: land.pos1.x, y: land.pos1.y, z: land.pos1.z, dimid: land.dim };
            trustedLands.push({
                id: landId,
                name: land.name,
                ownerName: land.ownerName,
                dim: getDimensionName(land.dim),
                pos: `${tpPos.x}, ${tpPos.y}, ${tpPos.z}`
            });
        }
    }
    
    if (ownedLands.length === 0 && trustedLands.length === 0) {
        player.tell(`${config.appearance.warningColor}你没有可传送的领地`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}领地传送`);
    form.setContent(`${config.appearance.infoColor}选择要传送的领地:`);
    
    form.addButton(`${config.appearance.secondaryColor}关闭`, "textures/ui/icon_import");
    
    for (let item of ownedLands) {
        form.addButton(`${config.appearance.highlightColor}${item.name}\n${config.appearance.infoColor}${item.dim} (${item.pos})`, "textures/ui/world_glyph_color");
    }
    
    for (let item of trustedLands) {
        form.addButton(`${config.appearance.secondaryColor}[成员] ${item.name}\n${config.appearance.infoColor}${item.dim} (${item.pos})`, "textures/ui/world_glyph_color");
    }
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 0) return;
        
        let actualId = id - 1;
        let targetLandId;
        
        if (actualId < ownedLands.length) {
            targetLandId = ownedLands[actualId].id;
        } else {
            targetLandId = trustedLands[actualId - ownedLands.length].id;
        }
        
        teleportToLand(pl, targetLandId);
    });
}

const playerReselectingLand = {};
function showHelpMenu(player) {
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}ZXland 领地帮助`);
    form.setContent(`${config.appearance.infoColor}选择要了解的功能模块：`);
    
    form.addButton(`${config.appearance.highlightColor}基础操作\n${config.appearance.infoColor}选区、创建、传送`, "textures/ui/oozing_effect");
    form.addButton(`${config.appearance.secondaryColor}权限管理\n${config.appearance.infoColor}成员、权限组、保护`, "textures/ui/permissions_member_star");
    form.addButton(`${config.appearance.primaryColor}传送点系统\n${config.appearance.infoColor}公共/私密传送点`, "textures/ui/worldsIcon");
    form.addButton(`${config.appearance.warningColor}黑名单功能\n${config.appearance.infoColor}禁止特定玩家进入`, "textures/ui/friend_glyph_desaturated");
    
    if (config.limits.enableSubLand !== false) {
        form.addButton(`${config.appearance.highlightColor}子领地系统\n${config.appearance.infoColor}在领地内创建子区域`, "textures/ui/color_plus");
    }
    
    form.addButton(`${config.appearance.secondaryColor}飞行系统\n${config.appearance.infoColor}领地内飞行权限`, "textures/ui/levitation_effect");
    form.addButton(`${config.appearance.primaryColor}返回主菜单`, "textures/ui/arrow_left");
    
    let returnIndex = config.limits.enableSubLand !== false ? 6 : 5;
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === returnIndex) {
            showMainMenu(pl);
            return;
        }
        
        let helpIndex = 0;
        
        if (id === helpIndex++) {
            showHelpBasic(pl);
        } else if (id === helpIndex++) {
            showHelpPermissions(pl);
        } else if (id === helpIndex++) {
            showHelpWarps(pl);
        } else if (id === helpIndex++) {
            showHelpBlacklist(pl);
        } else if (config.limits.enableSubLand !== false && id === helpIndex) {
            showHelpSubLand(pl);
            return;
        }
        
        if (config.limits.enableSubLand !== false) helpIndex++;
        
        if (id === helpIndex) {
            showHelpFlight(pl);
        }
    });
}
function showHelpBasic(player) {
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}基础操作帮助`);
    
    let content = `${config.appearance.infoColor}=== 创建领地 ===\n\n`;
    content += `${config.appearance.secondaryColor}1. 选择领地范围：\n`;
    content += `${config.appearance.infoColor}   /land pos1 - 设置选区点1\n`;
    content += `${config.appearance.infoColor}   /land pos2 - 设置选区点2\n\n`;
    content += `${config.appearance.secondaryColor}2. 创建领地：\n`;
    content += `${config.appearance.infoColor}   打开主菜单选择"创建领地"\n`;
    content += `${config.appearance.infoColor}   输入领地名称并选择类型\n`;
    content += `${config.appearance.warningColor}   ※ 2D领地无高度限制\n`;
    content += `${config.appearance.warningColor}   ※ 3D领地有高度限制，价格更低\n\n`;
    content += `${config.appearance.secondaryColor}3. 管理领地：\n`;
    content += `${config.appearance.infoColor}   /land - 打开主菜单\n`;
    content += `${config.appearance.infoColor}   /land my - 查看我的领地\n`;
    content += `${config.appearance.infoColor}   /land tp <名称> - 传送到领地\n\n`;
    content += `${config.appearance.secondaryColor}4. 其他命令：\n`;
    content += `${config.appearance.infoColor}   /land info - 查看当前位置领地信息\n`;
    content += `${config.appearance.infoColor}   /land warp <名称> - 传送到传送点`;
    
    form.setContent(content);
    form.addButton(`${config.appearance.primaryColor}返回帮助菜单`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        showHelpMenu(pl);
    });
}
function showHelpPermissions(player) {
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.secondaryColor}权限管理帮助`);
    
    let content = `${config.appearance.infoColor}=== 权限系统 ===\n\n`;
    content += `${config.appearance.secondaryColor}1. 添加成员：\n`;
    content += `${config.appearance.infoColor}   在领地详情中选择"管理成员"\n`;
    content += `${config.appearance.infoColor}   点击"添加成员"并输入玩家名\n\n`;
    content += `${config.appearance.secondaryColor}2. 权限组：\n`;
    content += `${config.appearance.highlightColor}   visitor - 访客（仅基础权限）\n`;
    content += `${config.appearance.highlightColor}   member - 成员（建筑权限）\n`;
    content += `${config.appearance.highlightColor}   admin - 管理员（高级权限）\n`;
    content += `${config.appearance.highlightColor}   vip - VIP（特殊权限）\n\n`;
    content += `${config.appearance.secondaryColor}3. 保护设置：\n`;
    content += `${config.appearance.infoColor}   在领地详情选择"保护设置"\n`;
    content += `${config.appearance.infoColor}   可配置破坏、放置、PVP等\n\n`;
    content += `${config.appearance.secondaryColor}4. 全局权限：\n`;
    content += `${config.appearance.infoColor}   在权限菜单中可设置所有人的权限\n`;
    content += `${config.appearance.warningColor}   ※ 成员权限会覆盖全局权限`;
    
    form.setContent(content);
    form.addButton(`${config.appearance.primaryColor}返回帮助菜单`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        showHelpMenu(pl);
    });
}
function showHelpWarps(player) {
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}传送点帮助`);
    
    let content = `${config.appearance.infoColor}=== 传送点系统 ===\n\n`;
    content += `${config.appearance.secondaryColor}1. 默认传送点：\n`;
    content += `${config.appearance.infoColor}   在领地详情选择"传送点管理"\n`;
    content += `${config.appearance.infoColor}   选择"设置默认传送点"\n`;
    content += `${config.appearance.infoColor}   用于 /land tp 命令\n\n`;
    content += `${config.appearance.secondaryColor}2. 公共传送点：\n`;
    content += `${config.appearance.infoColor}   所有人都可以使用\n`;
    content += `${config.appearance.infoColor}   /land warp <名称> 进行传送\n\n`;
    content += `${config.appearance.secondaryColor}3. 私密传送点：\n`;
    content += `${config.appearance.infoColor}   仅领地主人和成员可用\n`;
    content += `${config.appearance.warningColor}   ※ 建议名称不超过12个字符\n\n`;
    content += `${config.appearance.secondaryColor}4. 管理传送点：\n`;
    content += `${config.appearance.infoColor}   在"传送点管理"中可添加/删除\n`;
    content += `${config.appearance.infoColor}   支持手动输入坐标`;
    
    form.setContent(content);
    form.addButton(`${config.appearance.primaryColor}返回帮助菜单`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        showHelpMenu(pl);
    });
}
function showHelpBlacklist(player) {
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.warningColor}黑名单帮助`);
    
    let content = `${config.appearance.infoColor}=== 黑名单功能 ===\n\n`;
    content += `${config.appearance.secondaryColor}1. 添加黑名单：\n`;
    content += `${config.appearance.infoColor}   在领地详情选择"黑名单管理"\n`;
    content += `${config.appearance.infoColor}   输入要禁止的玩家名称\n\n`;
    content += `${config.appearance.secondaryColor}2. 效果：\n`;
    content += `${config.appearance.warningColor}   黑名单玩家无法进入领地\n`;
    content += `${config.appearance.warningColor}   尝试进入会被传送出去\n`;
    content += `${config.appearance.warningColor}   已加入成员会被自动移除\n\n`;
    content += `${config.appearance.secondaryColor}3. 移除黑名单：\n`;
    content += `${config.appearance.infoColor}   在"黑名单管理"中选择玩家\n`;
    content += `${config.appearance.infoColor}   点击即可移出黑名单\n\n`;
    content += `${config.appearance.secondaryColor}4. 注意事项：\n`;
    content += `${config.appearance.warningColor}   ※ 领地主人无法被拉黑\n`;
    content += `${config.appearance.warningColor}   ※ OP不受黑名单限制`;
    
    form.setContent(content);
    form.addButton(`${config.appearance.primaryColor}返回帮助菜单`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        showHelpMenu(pl);
    });
}
function showHelpSubLand(player) {
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}子领地帮助`);
    
    let content = `${config.appearance.infoColor}=== 子领地系统 ===\n\n`;
    content += `${config.appearance.secondaryColor}1. 什么是子领地：\n`;
    content += `${config.appearance.infoColor}   在主领地内划分的独立区域\n`;
    content += `${config.appearance.infoColor}   拥有独立的权限和保护设置\n\n`;
    content += `${config.appearance.secondaryColor}2. 创建子领地：\n`;
    content += `${config.appearance.highlightColor}   主人创建（免费）：\n`;
    content += `${config.appearance.infoColor}   使用 /land pos1 和 pos2 选区\n`;
    content += `${config.appearance.infoColor}   在领地详情选择"创建子领地"\n\n`;
    content += `${config.appearance.highlightColor}   成员购买：\n`;
    content += `${config.appearance.infoColor}   主人需先开启"允许成员购买"\n`;
    content += `${config.appearance.infoColor}   使用 /land z1 和 z2 选区\n`;
    content += `${config.appearance.infoColor}   价格为主领地的50%\n\n`;
    content += `${config.appearance.secondaryColor}3. 子领地权限：\n`;
    content += `${config.appearance.infoColor}   购买者拥有完全控制权\n`;
    content += `${config.appearance.infoColor}   可设置成员、权限、保护等\n\n`;
    content += `${config.appearance.secondaryColor}4. 注意事项：\n`;
    content += `${config.appearance.warningColor}   ※ 必须在主领地范围内\n`;
    content += `${config.appearance.warningColor}   ※ 数量受限制`;
    
    form.setContent(content);
    form.addButton(`${config.appearance.primaryColor}返回帮助菜单`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        showHelpMenu(pl);
    });
}
function showHelpFlight(player) {
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.secondaryColor}飞行系统帮助`);
    
    let content = `${config.appearance.infoColor}=== 领地飞行 ===\n\n`;
    content += `${config.appearance.secondaryColor}1. 购买飞行：\n`;
    content += `${config.appearance.infoColor}   在领地详情选择"购买领地飞行"\n`;
    content += `${config.appearance.highlightColor}   永久飞行 - 一次性支付\n`;
    content += `${config.appearance.highlightColor}   限时飞行 - 按天购买\n\n`;
    content += `${config.appearance.secondaryColor}2. 飞行权限：\n`;
    content += `${config.appearance.infoColor}   领地主人可开启/关闭飞行\n`;
    content += `${config.appearance.infoColor}   仅在领地内生效\n`;
    content += `${config.appearance.infoColor}   离开领地自动关闭\n\n`;
    content += `${config.appearance.secondaryColor}3. 成员飞行：\n`;
    content += `${config.appearance.infoColor}   领地主人可为成员设置\n`;
    content += `${config.appearance.infoColor}   在成员权限中开启"飞行"\n\n`;
    content += `${config.appearance.secondaryColor}4. 注意事项：\n`;
    content += `${config.appearance.warningColor}   ※ 需要先购买飞行功能\n`;
    content += `${config.appearance.warningColor}   ※ 限时飞行可续费`;
    
    form.setContent(content);
    form.addButton(`${config.appearance.primaryColor}返回帮助菜单`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        showHelpMenu(pl);
    });
}
function showCreateLandMenu(player) {
    if (config.limits.onlyOpCanCreateLand && !isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}只有管理员才能创建领地`);
        return;
    }
    
    let selection = getPlayerSelection(player.xuid);
    let hasFullSelection = selection.pos1 && selection.pos2;
    let hasAnySelection = selection.pos1 || selection.pos2;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}创建领地`);
    
    let content = `${config.appearance.primaryColor}===== 创建领地说明 =====\n\n`;
    content += `${config.appearance.infoColor}使用小木斧工具点击方块选区\n\n`;
    
    if (hasFullSelection && selection.pos1.dimid === selection.pos2.dimid) {
        content += `${config.appearance.highlightColor}✓ 当前选区状态：已完成\n`;
        content += `${config.appearance.secondaryColor}点1: §f${selection.pos1.x}, ${selection.pos1.y}, ${selection.pos1.z}\n`;
        content += `${config.appearance.secondaryColor}点2: §f${selection.pos2.x}, ${selection.pos2.y}, ${selection.pos2.z}\n`;
    } else if (hasAnySelection) {
        content += `${config.appearance.warningColor}✗ 当前选区状态：未完成\n`;
        if (selection.pos1) content += `${config.appearance.secondaryColor}点1: §f${selection.pos1.x}, ${selection.pos1.y}, ${selection.pos1.z}\n`;
        if (selection.pos2) content += `${config.appearance.secondaryColor}点2: §f${selection.pos2.x}, ${selection.pos2.y}, ${selection.pos2.z}\n`;
    } else {
        content += `${config.appearance.warningColor}✗ 当前选区状态：未设置\n`;
    }
    
    form.setContent(content);
    
    form.addButton(`${config.appearance.primaryColor}获取选区工具\n${config.appearance.infoColor}获取小木斧`, "textures/ui/icon_iron_pickaxe");
    
    if (hasFullSelection && selection.pos1.dimid === selection.pos2.dimid) {
        form.addButton(`${config.appearance.highlightColor}确认创建领地\n${config.appearance.infoColor}继续购买流程`, "textures/ui/confirm");
    }
    
    if (hasAnySelection) {
        form.addButton(`${config.appearance.warningColor}取消当前选区\n${config.appearance.infoColor}清除已选择的点`, "textures/ui/cancel");
    }
    
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/icon_import");
    
    player.sendForm(form, (pl, id) => {
        if (id == null) {
            showMainMenu(pl);
            return;
        }
        
        let idx = 0;
        if (id === idx++) {
            giveSelectionTool(pl);
            showCreateLandMenu(pl);
        } else if (hasFullSelection && selection.pos1.dimid === selection.pos2.dimid && id === idx++) {
            processCreateLandMenu(pl);
        } else if (hasAnySelection && id === idx++) {
            delete selectionsData[pl.xuid];
            saveSelectionsData();
            pl.tell(`${config.appearance.highlightColor}已取消当前选区`);
            showCreateLandMenu(pl);
        } else if (id === idx++) {
            showMainMenu(pl);
        }
    });
}
function processCreateLandMenu(player) {
    let selection = getPlayerSelection(player.xuid);
    
    if (!selection.pos1 || !selection.pos2) {
        player.tell(`${config.appearance.warningColor}请先完成选区（使用 /land pos1 和 /land pos2）`);
        return;
    }
    
    if (selection.pos1.dimid !== selection.pos2.dimid) {
        player.tell(`${config.appearance.warningColor}选区必须在同一维度内`);
        return;
    }
    let volume2D = calculateSelectionVolume(selection, true);
    let volume3D = calculateSelectionVolume(selection, false);
    
    let price2D = calculateLandPrice(volume2D, true);
    let price3D = calculateLandPrice(volume3D, false);
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}创建领地`);
    
    let dimName = getDimensionName(selection.pos1.dimid);
    let minX = Math.min(selection.pos1.x, selection.pos2.x);
    let minY = Math.min(selection.pos1.y, selection.pos2.y);
    let minZ = Math.min(selection.pos1.z, selection.pos2.z);
    let maxX = Math.max(selection.pos1.x, selection.pos2.x);
    let maxY = Math.max(selection.pos1.y, selection.pos2.y);
    let maxZ = Math.max(selection.pos1.z, selection.pos2.z);
    
    let infoText = `${config.appearance.infoColor}选区信息：\n` +
                `${config.appearance.secondaryColor}维度: ${config.appearance.infoColor}${dimName}\n` +
                `${config.appearance.secondaryColor}范围: ${config.appearance.infoColor}${minX},${minY},${minZ} 至 ${maxX},${maxY},${maxZ}\n` +
                `${config.appearance.secondaryColor}面积: ${config.appearance.infoColor}${(maxX - minX + 1) * (maxZ - minZ + 1)} 方块 (XZ平面)\n` +
                `${config.appearance.secondaryColor}体积: ${config.appearance.infoColor}${volume3D} 方块 (XYZ空间)\n\n` +
                `${config.appearance.highlightColor}2D领地价格: ${config.appearance.infoColor}${price2D} ${config.appearance.secondaryColor}(整个高度范围)\n` +
                `${config.appearance.highlightColor}3D领地价格: ${config.appearance.infoColor}${price3D} ${config.appearance.secondaryColor}(仅选区高度)`;
    
    form.addLabel(infoText);
    form.addInput(`${config.appearance.secondaryColor}领地名称`, "我的家", "");
    form.addDropdown(`${config.appearance.secondaryColor}领地类型`, ["2D领地 (整个高度)", "3D领地 (限定高度)"], 0);
    let overlap = checkSelectionOverlap(selection);
    if (overlap) {
        form.addLabel(`${config.appearance.warningColor}警告: 选区与现有领地重叠！无法创建领地。`);
    }
    
    player.sendForm(form, (pl, data) => {
        if (!data) return;
        
        let landName = data[1].trim();
        let landType = data[2];
        
        if (!landName) {
            pl.tell(`${config.appearance.warningColor}领地名称不能为空`);
            return;
        }
        
        if (landName.length > 20) {
            pl.tell(`${config.appearance.warningColor}领地名称不能超过20个字符`);
            return;
        }
        
        if (overlap) {
            pl.tell(`${config.appearance.warningColor}选区与现有领地重叠，无法创建`);
            return;
        }
        
        let is2D = (landType === 0);
        let result = createLand(pl, landName, is2D);
        
        if (result && result.success) {
            let form = mc.newSimpleForm();
            form.setTitle(`${config.appearance.highlightColor}创建成功`);
            form.setContent(`${config.appearance.infoColor}恭喜！你已成功创建领地 "${landName}"。\n\n你现在可以：`);
            form.addButton(`${config.appearance.secondaryColor}设置领地权限`, "textures/ui/icon_setting");
            form.addButton(`${config.appearance.primaryColor}添加领地成员`, "textures/ui/icon_multiplayer");
            form.addButton(`${config.appearance.highlightColor}返回主菜单`, "textures/ui/arrow_left");
            
            pl.sendForm(form, (player, id) => {
                if (id === null || id === 2) {
                    showMainMenu(player);
                    return;
                }
                
                let landId = result.landId;
                
                if (id === 0) {
                    showLandPermissionsMenu(player, landId);
                } else if (id === 1) {
                    showLandMembersMenu(player, landId);
                }
            });
        }
    });
}
function showMyLandsMenu(player) {
    let xuid = player.xuid;
    let ownedLands = [];
    let memberLands = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.parentId) continue;
        
        if (land.owner === xuid) {
            ownedLands.push({ id: landId, land: land });
        } else if (land.members && land.members[xuid]) {
            memberLands.push({ id: landId, land: land });
        }
    }
    
    if (ownedLands.length === 0 && memberLands.length === 0) {
        player.tell(`${config.appearance.warningColor}你没有任何领地`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.secondaryColor}我的领地`);
    
    let content = `${config.appearance.infoColor}选择要管理的领地：\n\n`;
    if (ownedLands.length > 0) {
        content += `${config.appearance.highlightColor}▶ 你拥有的领地：\n`;
    }
    if (memberLands.length > 0) {
        content += `\n${config.appearance.primaryColor}▶ 你作为成员的领地：\n`;
    }
    
    form.setContent(content);
    ownedLands.forEach(item => {
        let land = item.land;
        let area = calculateSelectionVolume({
            pos1: land.pos1,
            pos2: land.pos2
        }, land.is2D);
        
        let type = land.is2D ? "2D" : "3D";
        let memberCount = land.members ? Object.keys(land.members).length : 0;
        let buttonText = `${config.appearance.highlightColor}【领地主人】${land.name}\n${config.appearance.infoColor}${land.dimName} | ${type} | ${area}方块 | 成员:${memberCount}`;
        form.addButton(buttonText, "textures/ui/icon_multiplayer");
    });
    memberLands.forEach(item => {
        let land = item.land;
        let type = land.is2D ? "2D" : "3D";
        let permGroup = "member";
        if (land.members && land.members[xuid] && land.members[xuid].permissionGroup) {
            permGroup = land.members[xuid].permissionGroup;
        }
        let groupName = config.permissionGroups[permGroup] ? config.permissionGroups[permGroup].name : "成员";
        let buttonText = `${config.appearance.secondaryColor}【领地${groupName}】${land.name}\n${config.appearance.infoColor}所有者: ${land.ownerName} | ${land.dimName} | ${type}`;
        form.addButton(buttonText, "textures/ui/icon_multiplayer");
    });
    
    form.addButton(`${config.appearance.warningColor}返回主菜单`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === ownedLands.length + memberLands.length) {
            showMainMenu(pl);
            return;
        }
        
        if (id < ownedLands.length) {
            let selected = ownedLands[id];
            showFastLandManager(pl, selected.id);
        } else {
            let memberIndex = id - ownedLands.length;
            if (memberIndex < memberLands.length) {
                let selected = memberLands[memberIndex];
                showFastLandManager(pl, selected.id);
            }
        }
    });
}

function showExpandLandMenu(player, landId) {
    let land = landsData[landId];
    if (!land || (land.owner !== player.xuid && !isLandAdmin(player))) {
        player.tell(`${config.appearance.warningColor}你不是这块领地的主人`);
        return;
    }
    
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minY = Math.min(land.pos1.y, land.pos2.y);
    let maxY = Math.max(land.pos1.y, land.pos2.y);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    
    let currentSize = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}扩大领地`);
    form.setContent(
        `${config.appearance.infoColor}当前领地: §e${land.name}\n` +
        `${config.appearance.secondaryColor}类型: ${land.is2D ? "§a2D领地" : "§b3D领地"}\n` +
        `${config.appearance.secondaryColor}当前大小: §a${currentSize}§3 方块\n` +
        `${config.appearance.secondaryColor}范围: §3X(${minX}~${maxX}) Y(${minY}~${maxY}) Z(${minZ}~${maxZ})\n\n` +
        `${config.appearance.highlightColor}选择扩大模式:`
    );
    
    form.addButton(`${config.appearance.highlightColor}快捷扩大\n${config.appearance.infoColor}四周均匀扩大1~10圈`, "textures/ui/speed_effect");
    form.addButton(`${config.appearance.primaryColor}单面扩大\n${config.appearance.infoColor}东/南/西/北/上/下`, "textures/ui/sidebar_icons/realms");
    form.addButton(`${config.appearance.secondaryColor}水平四面扩大\n${config.appearance.infoColor}同时扩大东南西北`, "textures/ui/icon_recipe_nature");
    form.addButton(`${config.appearance.highlightColor}精确扩大\n${config.appearance.infoColor}自定义每个方向`, "textures/ui/magnifyingGlass");
    if (!land.is2D) {
        form.addButton(`${config.appearance.primaryColor}垂直扩大\n${config.appearance.infoColor}向上/向下扩大`, "textures/ui/up_arrow");
    }
    form.addButton(`${config.appearance.secondaryColor}全方位扩大\n${config.appearance.infoColor}同时扩大六个方向`, "textures/ui/anvil_icon");
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null) {
            showFastLandManager(pl, landId);
            return;
        }
        
        let idx = 0;
        if (id === idx++) {
            showQuickExpandMenu(pl, landId);
        } else if (id === idx++) {
            showSingleFaceExpandMenu(pl, landId);
        } else if (id === idx++) {
            showHorizontalFourFacesExpandMenu(pl, landId);
        } else if (id === idx++) {
            showPreciseExpandMenu(pl, landId);
        } else if (!land.is2D && id === idx++) {
            showVerticalExpandMenu(pl, landId);
        } else if (id === idx++) {
            showFullExpandMenu(pl, landId);
        } else {
            showFastLandManager(pl, landId);
        }
    });
}

function getLandBounds(land) {
    return {
        minX: Math.min(land.pos1.x, land.pos2.x),
        maxX: Math.max(land.pos1.x, land.pos2.x),
        minY: Math.min(land.pos1.y, land.pos2.y),
        maxY: Math.max(land.pos1.y, land.pos2.y),
        minZ: Math.min(land.pos1.z, land.pos2.z),
        maxZ: Math.max(land.pos1.z, land.pos2.z)
    };
}

function calculateExpandCost(land, addedBlocks) {
    let pricePerBlock = land.is2D ? config.prices.perBlock2D : config.prices.perBlock3D;
    let cost = Math.ceil(addedBlocks * pricePerBlock);
    return cost < 0 ? 0 : cost;
}

function showQuickExpandMenu(player, landId) {
    let land = landsData[landId];
    if (!land) return;
    
    let bounds = getLandBounds(land);
    let currentSize = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    let pricePerBlock = land.is2D ? config.prices.perBlock2D : config.prices.perBlock3D;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}快捷扩大`);
    
    let options = [1, 2, 3, 5, 10];
    let content = `${config.appearance.infoColor}当前领地: §e${land.name}\n`;
    content += `${config.appearance.secondaryColor}当前大小: §a${currentSize}§3 方块\n\n`;
    content += `${config.appearance.highlightColor}选择扩大圈数 (水平四周均匀扩大):\n`;
    
    for (let rings of options) {
        let newMinX = bounds.minX - rings;
        let newMaxX = bounds.maxX + rings;
        let newMinZ = bounds.minZ - rings;
        let newMaxZ = bounds.maxZ + rings;
        let newMinY = land.is2D ? config.limits.worldHeightMin : bounds.minY;
        let newMaxY = land.is2D ? config.limits.worldHeightMax : bounds.maxY;
        
        let newSize = calculateSelectionVolume({ pos1: { x: newMinX, y: newMinY, z: newMinZ }, pos2: { x: newMaxX, y: newMaxY, z: newMaxZ } }, land.is2D);
        let addedBlocks = newSize - currentSize;
        let cost = Math.ceil(addedBlocks * pricePerBlock);
        if (cost < 0) cost = 0;
        
        content += `§3- ${rings}圈: +${addedBlocks}方块, 费用§e${cost}\n`;
    }
    
    form.setContent(content);
    
    for (let rings of options) {
        form.addButton(`${config.appearance.highlightColor}扩大 ${rings} 圈`, "textures/ui/plus");
    }
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id >= options.length) {
            showExpandLandMenu(pl, landId);
            return;
        }
        
        let rings = options[id];
        let newMinX = bounds.minX - rings;
        let newMaxX = bounds.maxX + rings;
        let newMinZ = bounds.minZ - rings;
        let newMaxZ = bounds.maxZ + rings;
        let newMinY = land.is2D ? config.limits.worldHeightMin : bounds.minY;
        let newMaxY = land.is2D ? config.limits.worldHeightMax : bounds.maxY;
        
        let newPos1 = { x: newMinX, y: newMinY, z: newMinZ, dimid: land.dim };
        let newPos2 = { x: newMaxX, y: newMaxY, z: newMaxZ, dimid: land.dim };
        
        let overlapLand = checkExpandOverlap(landId, land, newPos1, newPos2);
        if (overlapLand) {
            pl.tell(`${config.appearance.warningColor}扩大后会与领地 §e${overlapLand.name}§c 重叠，无法扩大！`);
            showQuickExpandMenu(pl, landId);
            return;
        }
        
        let newSize = calculateSelectionVolume({ pos1: newPos1, pos2: newPos2 }, land.is2D);
        let addedBlocks = newSize - currentSize;
        let cost = calculateExpandCost(land, addedBlocks);
        
        confirmExpandLand(pl, landId, newPos1, newPos2, addedBlocks, cost);
    });
}

function showSingleFaceExpandMenu(player, landId) {
    let land = landsData[landId];
    if (!land) return;
    
    let bounds = getLandBounds(land);
    let currentSize = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}单面扩大`);
    form.setContent(
        `${config.appearance.infoColor}当前领地: §e${land.name}\n` +
        `${config.appearance.secondaryColor}当前大小: §a${currentSize}§3 方块\n` +
        `${config.appearance.secondaryColor}范围: §3X(${bounds.minX}~${bounds.maxX}) Y(${bounds.minY}~${bounds.maxY}) Z(${bounds.minZ}~${bounds.maxZ})\n\n` +
        `${config.appearance.highlightColor}选择要扩大的方向:`
    );
    
    form.addButton(`§a向东扩大 (+X)\n${config.appearance.infoColor}扩大东边边界`, "textures/ui/arrow");
    form.addButton(`§a向西扩大 (-X)\n${config.appearance.infoColor}扩大西边边界`, "textures/ui/arrow");
    form.addButton(`§b向南扩大 (+Z)\n${config.appearance.infoColor}扩大南边边界`, "textures/ui/arrow");
    form.addButton(`§b向北扩大 (-Z)\n${config.appearance.infoColor}扩大北边边界`, "textures/ui/arrow");
    if (!land.is2D) {
        form.addButton(`§e向上扩大 (+Y)\n${config.appearance.infoColor}扩大顶部边界`, "textures/ui/up_arrow");
        form.addButton(`§e向下扩大 (-Y)\n${config.appearance.infoColor}扩大底部边界`, "textures/ui/down_arrow");
    }
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null) {
            showExpandLandMenu(pl, landId);
            return;
        }
        
        let directions = ["east", "west", "south", "north"];
        if (!land.is2D) {
            directions.push("up", "down");
        }
        
        if (id >= directions.length) {
            showExpandLandMenu(pl, landId);
            return;
        }
        
        showSingleFaceSlider(pl, landId, directions[id]);
    });
}

function showSingleFaceSlider(player, landId, direction) {
    let land = landsData[landId];
    if (!land) return;
    
    let bounds = getLandBounds(land);
    let currentSize = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    
    let dirNames = {
        east: "向东 (+X)",
        west: "向西 (-X)",
        south: "向南 (+Z)",
        north: "向北 (-Z)",
        up: "向上 (+Y)",
        down: "向下 (-Y)"
    };
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}${dirNames[direction]}扩大`);
    form.addLabel(`${config.appearance.infoColor}当前领地: §e${land.name}\n当前大小: ${currentSize}方块`);
    form.addSlider(`§a扩大格数`, 1, 100, 1, 5);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showSingleFaceExpandMenu(pl, landId);
            return;
        }
        
        let expandAmount = data[1] || 0;
        if (expandAmount <= 0) {
            pl.tell(`${config.appearance.warningColor}扩大数量必须大于0`);
            showSingleFaceExpandMenu(pl, landId);
            return;
        }
        
        let newMinX = bounds.minX, newMaxX = bounds.maxX;
        let newMinY = bounds.minY, newMaxY = bounds.maxY;
        let newMinZ = bounds.minZ, newMaxZ = bounds.maxZ;
        
        switch (direction) {
            case "east": newMaxX += expandAmount; break;
            case "west": newMinX -= expandAmount; break;
            case "south": newMaxZ += expandAmount; break;
            case "north": newMinZ -= expandAmount; break;
            case "up": newMaxY += expandAmount; break;
            case "down": newMinY -= expandAmount; break;
        }
        
        if (land.is2D) {
            newMinY = config.limits.worldHeightMin;
            newMaxY = config.limits.worldHeightMax;
        }
        
        let newPos1 = { x: newMinX, y: newMinY, z: newMinZ, dimid: land.dim };
        let newPos2 = { x: newMaxX, y: newMaxY, z: newMaxZ, dimid: land.dim };
        
        let overlapLand = checkExpandOverlap(landId, land, newPos1, newPos2);
        if (overlapLand) {
            pl.tell(`${config.appearance.warningColor}扩大后会与领地 §e${overlapLand.name}§c 重叠，无法扩大！`);
            showSingleFaceExpandMenu(pl, landId);
            return;
        }
        
        let newSize = calculateSelectionVolume({ pos1: newPos1, pos2: newPos2 }, land.is2D);
        let addedBlocks = newSize - currentSize;
        let cost = calculateExpandCost(land, addedBlocks);
        
        confirmExpandLand(pl, landId, newPos1, newPos2, addedBlocks, cost);
    });
}

function showHorizontalFourFacesExpandMenu(player, landId) {
    let land = landsData[landId];
    if (!land) return;
    
    let bounds = getLandBounds(land);
    let currentSize = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    let pricePerBlock = land.is2D ? config.prices.perBlock2D : config.prices.perBlock3D;
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}水平四面扩大`);
    
    let content = `${config.appearance.infoColor}当前领地: §e${land.name}\n`;
    content += `当前大小: ${currentSize}方块\n`;
    content += `范围: X(${bounds.minX}~${bounds.maxX}) Z(${bounds.minZ}~${bounds.maxZ})\n\n`;
    content += `§3同时向东南西北四个方向扩大`;
    
    form.addLabel(content);
    form.addSlider("§a每个方向扩大格数", 1, 50, 1, 5);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showExpandLandMenu(pl, landId);
            return;
        }
        
        let expandAmount = data[1] || 0;
        if (expandAmount <= 0) {
            pl.tell(`${config.appearance.warningColor}扩大数量必须大于0`);
            showHorizontalFourFacesExpandMenu(pl, landId);
            return;
        }
        
        let newMinX = bounds.minX - expandAmount;
        let newMaxX = bounds.maxX + expandAmount;
        let newMinZ = bounds.minZ - expandAmount;
        let newMaxZ = bounds.maxZ + expandAmount;
        let newMinY = land.is2D ? config.limits.worldHeightMin : bounds.minY;
        let newMaxY = land.is2D ? config.limits.worldHeightMax : bounds.maxY;
        
        let newPos1 = { x: newMinX, y: newMinY, z: newMinZ, dimid: land.dim };
        let newPos2 = { x: newMaxX, y: newMaxY, z: newMaxZ, dimid: land.dim };
        
        let overlapLand = checkExpandOverlap(landId, land, newPos1, newPos2);
        if (overlapLand) {
            pl.tell(`${config.appearance.warningColor}扩大后会与领地 §e${overlapLand.name}§c 重叠，无法扩大！`);
            showHorizontalFourFacesExpandMenu(pl, landId);
            return;
        }
        
        let newSize = calculateSelectionVolume({ pos1: newPos1, pos2: newPos2 }, land.is2D);
        let addedBlocks = newSize - currentSize;
        let cost = calculateExpandCost(land, addedBlocks);
        
        confirmExpandLand(pl, landId, newPos1, newPos2, addedBlocks, cost);
    });
}

function showPreciseExpandMenu(player, landId) {
    let land = landsData[landId];
    if (!land) return;
    
    let bounds = getLandBounds(land);
    let currentSize = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}精确扩大`);
    
    let content = `${config.appearance.infoColor}当前领地: §e${land.name}\n`;
    content += `当前大小: ${currentSize}方块\n`;
    content += `范围: X(${bounds.minX}~${bounds.maxX}) Y(${bounds.minY}~${bounds.maxY}) Z(${bounds.minZ}~${bounds.maxZ})`;
    
    form.addLabel(content);
    form.addSlider("§a向东扩大 (+X)", 0, 100, 1, 0);
    form.addSlider("§a向西扩大 (-X)", 0, 100, 1, 0);
    form.addSlider("§b向南扩大 (+Z)", 0, 100, 1, 0);
    form.addSlider("§b向北扩大 (-Z)", 0, 100, 1, 0);
    if (!land.is2D) {
        form.addSlider("§e向上扩大 (+Y)", 0, 100, 1, 0);
        form.addSlider("§e向下扩大 (-Y)", 0, 100, 1, 0);
    }
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showExpandLandMenu(pl, landId);
            return;
        }
        
        let expandEast = data[1] || 0;
        let expandWest = data[2] || 0;
        let expandSouth = data[3] || 0;
        let expandNorth = data[4] || 0;
        let expandUp = 0, expandDown = 0;
        
        if (!land.is2D) {
            expandUp = data[5] || 0;
            expandDown = data[6] || 0;
        }
        
        if (expandEast === 0 && expandWest === 0 && expandSouth === 0 && expandNorth === 0 && expandUp === 0 && expandDown === 0) {
            pl.tell(`${config.appearance.warningColor}未选择任何扩展范围`);
            showPreciseExpandMenu(pl, landId);
            return;
        }
        
        let newMinX = bounds.minX - expandWest;
        let newMaxX = bounds.maxX + expandEast;
        let newMinZ = bounds.minZ - expandNorth;
        let newMaxZ = bounds.maxZ + expandSouth;
        let newMinY = land.is2D ? config.limits.worldHeightMin : (bounds.minY - expandDown);
        let newMaxY = land.is2D ? config.limits.worldHeightMax : (bounds.maxY + expandUp);
        
        let newPos1 = { x: newMinX, y: newMinY, z: newMinZ, dimid: land.dim };
        let newPos2 = { x: newMaxX, y: newMaxY, z: newMaxZ, dimid: land.dim };
        
        let overlapLand = checkExpandOverlap(landId, land, newPos1, newPos2);
        if (overlapLand) {
            pl.tell(`${config.appearance.warningColor}扩大后会与领地 §e${overlapLand.name}§c 重叠，无法扩大！`);
            showPreciseExpandMenu(pl, landId);
            return;
        }
        
        let newSize = calculateSelectionVolume({ pos1: newPos1, pos2: newPos2 }, land.is2D);
        let addedBlocks = newSize - currentSize;
        let cost = calculateExpandCost(land, addedBlocks);
        
        confirmExpandLand(pl, landId, newPos1, newPos2, addedBlocks, cost);
    });
}

function showVerticalExpandMenu(player, landId) {
    let land = landsData[landId];
    if (!land || land.is2D) {
        showExpandLandMenu(player, landId);
        return;
    }
    
    let bounds = getLandBounds(land);
    let currentSize = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}垂直扩大`);
    form.setContent(
        `${config.appearance.infoColor}当前领地: §e${land.name}\n` +
        `${config.appearance.secondaryColor}当前Y范围: §a${bounds.minY} ~ ${bounds.maxY}\n` +
        `${config.appearance.secondaryColor}当前大小: §a${currentSize}§3 方块\n\n` +
        `${config.appearance.highlightColor}选择Y轴扩展方式:`
    );
    
    form.addButton(`${config.appearance.highlightColor}向上扩大\n${config.appearance.infoColor}增加顶部高度`, "textures/ui/up_arrow");
    form.addButton(`${config.appearance.primaryColor}向下扩大\n${config.appearance.infoColor}增加底部深度`, "textures/ui/down_arrow");
    form.addButton(`${config.appearance.secondaryColor}双向扩大\n${config.appearance.infoColor}同时向上向下`, "textures/ui/anvil_icon");
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 3) {
            showExpandLandMenu(pl, landId);
            return;
        }
        
        let mode = ["up", "down", "both"][id];
        showVerticalExpandSlider(pl, landId, mode);
    });
}

function showVerticalExpandSlider(player, landId, mode) {
    let land = landsData[landId];
    if (!land) return;
    
    let bounds = getLandBounds(land);
    let currentSize = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    
    let modeText = mode === "up" ? "向上扩大" : (mode === "down" ? "向下扩大" : "上下双向扩大");
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}${modeText}`);
    
    form.addLabel(`${config.appearance.infoColor}当前Y范围: ${bounds.minY} ~ ${bounds.maxY}\n当前大小: ${currentSize}方块`);
    
    if (mode === "up" || mode === "both") {
        form.addSlider("§a向上扩大格数", 1, 100, 1, 10);
    }
    if (mode === "down" || mode === "both") {
        form.addSlider("§b向下扩大格数", 1, 100, 1, 10);
    }
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showVerticalExpandMenu(pl, landId);
            return;
        }
        
        let expandUp = 0, expandDown = 0;
        if (mode === "up") {
            expandUp = data[1] || 0;
        } else if (mode === "down") {
            expandDown = data[1] || 0;
        } else {
            expandUp = data[1] || 0;
            expandDown = data[2] || 0;
        }
        
        if (expandUp === 0 && expandDown === 0) {
            pl.tell(`${config.appearance.warningColor}未选择任何扩展范围`);
            showVerticalExpandMenu(pl, landId);
            return;
        }
        
        let newMinY = bounds.minY - expandDown;
        let newMaxY = bounds.maxY + expandUp;
        
        let newPos1 = { x: bounds.minX, y: newMinY, z: bounds.minZ, dimid: land.dim };
        let newPos2 = { x: bounds.maxX, y: newMaxY, z: bounds.maxZ, dimid: land.dim };
        
        let overlapLand = checkExpandOverlap(landId, land, newPos1, newPos2);
        if (overlapLand) {
            pl.tell(`${config.appearance.warningColor}扩大后会与领地 §e${overlapLand.name}§c 重叠，无法扩大！`);
            showVerticalExpandMenu(pl, landId);
            return;
        }
        
        let newSize = calculateSelectionVolume({ pos1: newPos1, pos2: newPos2 }, land.is2D);
        let addedBlocks = newSize - currentSize;
        let cost = calculateExpandCost(land, addedBlocks);
        
        confirmExpandLand(pl, landId, newPos1, newPos2, addedBlocks, cost);
    });
}

function showFullExpandMenu(player, landId) {
    let land = landsData[landId];
    if (!land) return;
    
    let bounds = getLandBounds(land);
    let currentSize = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}全方位扩大`);
    
    let content = `${config.appearance.infoColor}当前领地: §e${land.name}\n`;
    content += `当前大小: ${currentSize}方块\n`;
    content += `范围: X(${bounds.minX}~${bounds.maxX}) Y(${bounds.minY}~${bounds.maxY}) Z(${bounds.minZ}~${bounds.maxZ})\n\n`;
    if (land.is2D) {
        content += `§3同时向水平四个方向扩大(2D领地不可调整Y轴)`;
    } else {
        content += `§3同时向六个方向扩大`;
    }
    
    form.addLabel(content);
    form.addSlider("§a水平方向扩大格数 (东南西北)", 0, 50, 1, 5);
    if (!land.is2D) {
        form.addSlider("§e向上扩大格数", 0, 50, 1, 0);
        form.addSlider("§e向下扩大格数", 0, 50, 1, 0);
    }
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showExpandLandMenu(pl, landId);
            return;
        }
        
        let horizontalExpand = data[1] || 0;
        let expandUp = 0, expandDown = 0;
        
        if (!land.is2D) {
            expandUp = data[2] || 0;
            expandDown = data[3] || 0;
        }
        
        if (horizontalExpand === 0 && expandUp === 0 && expandDown === 0) {
            pl.tell(`${config.appearance.warningColor}未选择任何扩展范围`);
            showFullExpandMenu(pl, landId);
            return;
        }
        
        let newMinX = bounds.minX - horizontalExpand;
        let newMaxX = bounds.maxX + horizontalExpand;
        let newMinZ = bounds.minZ - horizontalExpand;
        let newMaxZ = bounds.maxZ + horizontalExpand;
        let newMinY = land.is2D ? config.limits.worldHeightMin : (bounds.minY - expandDown);
        let newMaxY = land.is2D ? config.limits.worldHeightMax : (bounds.maxY + expandUp);
        
        let newPos1 = { x: newMinX, y: newMinY, z: newMinZ, dimid: land.dim };
        let newPos2 = { x: newMaxX, y: newMaxY, z: newMaxZ, dimid: land.dim };
        
        let overlapLand = checkExpandOverlap(landId, land, newPos1, newPos2);
        if (overlapLand) {
            pl.tell(`${config.appearance.warningColor}扩大后会与领地 §e${overlapLand.name}§c 重叠，无法扩大！`);
            showFullExpandMenu(pl, landId);
            return;
        }
        
        let newSize = calculateSelectionVolume({ pos1: newPos1, pos2: newPos2 }, land.is2D);
        let addedBlocks = newSize - currentSize;
        let cost = calculateExpandCost(land, addedBlocks);
        
        confirmExpandLand(pl, landId, newPos1, newPos2, addedBlocks, cost);
    });
}

function checkExpandOverlap(landId, land, newPos1, newPos2) {
    let newMinX = Math.min(newPos1.x, newPos2.x);
    let newMaxX = Math.max(newPos1.x, newPos2.x);
    let newMinY = Math.min(newPos1.y, newPos2.y);
    let newMaxY = Math.max(newPos1.y, newPos2.y);
    let newMinZ = Math.min(newPos1.z, newPos2.z);
    let newMaxZ = Math.max(newPos1.z, newPos2.z);
    
    for (let lid in landsData) {
        if (lid === landId) continue;
        let otherLand = landsData[lid];
        if (otherLand.dim !== land.dim) continue;
        if (otherLand.parentId === landId) continue;
        
        let oMinX = Math.min(otherLand.pos1.x, otherLand.pos2.x);
        let oMaxX = Math.max(otherLand.pos1.x, otherLand.pos2.x);
        let oMinZ = Math.min(otherLand.pos1.z, otherLand.pos2.z);
        let oMaxZ = Math.max(otherLand.pos1.z, otherLand.pos2.z);
        let oMinY = Math.min(otherLand.pos1.y, otherLand.pos2.y);
        let oMaxY = Math.max(otherLand.pos1.y, otherLand.pos2.y);
        
        if (land.is2D || otherLand.is2D) {
            if (!(newMaxX < oMinX || newMinX > oMaxX || newMaxZ < oMinZ || newMinZ > oMaxZ)) {
                return otherLand;
            }
        } else {
            if (!(newMaxX < oMinX || newMinX > oMaxX || newMaxZ < oMinZ || newMinZ > oMaxZ || newMaxY < oMinY || newMinY > oMaxY)) {
                return otherLand;
            }
        }
    }
    return null;
}

function confirmExpandLand(player, landId, newPos1, newPos2, addedBlocks, cost) {
    let land = landsData[landId];
    if (!land) return;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}确认扩大领地`);
    form.setContent(
        `${config.appearance.infoColor}领地: §e${land.name}\n\n` +
        `${config.appearance.secondaryColor}新增方块数: §a${addedBlocks}\n` +
        `${config.appearance.secondaryColor}扩大费用: §e${cost}\n\n` +
        `${config.appearance.warningColor}确认扩大领地?`
    );
    
    form.addButton(`${config.appearance.highlightColor}确认扩大 (扣除 ${cost})`, "textures/ui/confirm");
    form.addButton(`${config.appearance.secondaryColor}取消`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id !== 0) {
            showExpandLandMenu(pl, landId);
            return;
        }
        
        let currentLand = landsData[landId];
        if (!currentLand || (currentLand.owner !== pl.xuid && !isLandAdmin(pl))) {
            pl.tell(`${config.appearance.warningColor}领地状态已改变或你没有权限`);
            return;
        }
        
        if (isLandAdmin(pl)) {
            pl.tell(`${config.appearance.infoColor}[管理员] 免费扩大领地`);
        } else {
            let balance = getBalance(pl.xuid);
            if (balance < cost) {
                pl.tell(`${config.appearance.warningColor}余额不足! 需要 ${cost}，当前余额 ${balance}`);
                showFastLandManager(pl, landId);
                return;
            }
            
            if (!reduceMoney(pl.xuid, cost)) {
                pl.tell(`${config.appearance.warningColor}扣款失败`);
                showFastLandManager(pl, landId);
                return;
            }
        }
        
        currentLand.pos1 = newPos1;
        currentLand.pos2 = newPos2;
        saveLandsData();
        
        pl.tell(`${config.appearance.highlightColor}领地 §e${currentLand.name}§a 扩大成功! 新增 ${addedBlocks} 方块`);
        showFastLandManager(pl, landId);
    });
}

function showTransferLandMenu(player, landId) {
    let land = landsData[landId];
    if (!land || land.owner !== player.xuid) {
        player.tell(`${config.appearance.warningColor}你不是这块领地的主人`);
        return;
    }
    
    let onlinePlayers = mc.getOnlinePlayers();
    let availablePlayers = [];
    
    for (let i = 0; i < onlinePlayers.length; i++) {
        let p = onlinePlayers[i];
        if (p.xuid !== player.xuid) {
            availablePlayers.push(p);
        }
    }
    
    if (availablePlayers.length === 0) {
        player.tell(`${config.appearance.warningColor}当前没有其他在线玩家可以接收领地`);
        showFastLandManager(player, landId);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}领地转让`);
    form.setContent(`${config.appearance.infoColor}选择要将领地 §e${land.name}§r 转让给的玩家：\n\n${config.appearance.warningColor}⚠ 转让后你将失去该领地的所有权限！`);
    
    for (let i = 0; i < availablePlayers.length; i++) {
        form.addButton(`${config.appearance.primaryColor}${availablePlayers[i].name}`, "textures/ui/icon_steve");
    }
    form.addButton(`${config.appearance.warningColor}取消`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === availablePlayers.length) {
            showFastLandManager(pl, landId);
            return;
        }
        
        let targetPlayer = availablePlayers[id];
        confirmTransferLand(pl, landId, targetPlayer);
    });
}

function confirmTransferLand(player, landId, targetPlayer) {
    let land = landsData[landId];
    if (!land) return;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.warningColor}确认转让`);
    form.setContent(
        `${config.appearance.warningColor}⚠ 警告 ⚠\n\n` +
        `${config.appearance.infoColor}你确定要将领地 §e${land.name}§r 转让给 §a${targetPlayer.name}§r 吗？\n\n` +
        `${config.appearance.warningColor}转让后：\n` +
        `${config.appearance.infoColor}• 你将失去该领地的所有权限\n` +
        `${config.appearance.infoColor}• 对方将成为新的领地主人\n` +
        `${config.appearance.infoColor}• 此操作无法撤销！\n`
    );
    
    form.addButton(`${config.appearance.warningColor}确认转让`, "textures/ui/realms_red_x");
    form.addButton(`${config.appearance.secondaryColor}取消`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id !== 0) {
            showTransferLandMenu(pl, landId);
            return;
        }
        
        let currentLand = landsData[landId];
        if (!currentLand || currentLand.owner !== pl.xuid) {
            pl.tell(`${config.appearance.warningColor}转让失败：领地状态已改变`);
            return;
        }
        
        let target = mc.getPlayer(targetPlayer.xuid);
        if (!target) {
            pl.tell(`${config.appearance.warningColor}转让失败：目标玩家已离线`);
            showFastLandManager(pl, landId);
            return;
        }
        
        let oldOwnerName = currentLand.ownerName;
        currentLand.owner = target.xuid;
        currentLand.ownerName = target.name;
        
        if (currentLand.members && currentLand.members[target.xuid]) {
            delete currentLand.members[target.xuid];
        }
        
        saveLandsData();
        
        pl.tell(`${config.appearance.highlightColor}领地 §e${currentLand.name}§r 已成功转让给 §a${target.name}`);
        target.tell(`${config.appearance.highlightColor}玩家 §e${oldOwnerName}§r 将领地 §a${currentLand.name}§r 转让给了你！`);
        
        showMyLandsMenu(pl);
    });
}
function showCreateSubLandMenu(player, parentLandId) {
    let parentLand = landsData[parentLandId];
    if (!parentLand) return;
    
    let selection = getPlayerSelection(player.xuid);
    
    if (!selection.pos1 || !selection.pos2) {
        player.tell(`${config.appearance.warningColor}请先在领地内选区（使用 /land pos1 和 /land pos2）`);
        return;
    }
    
    if (selection.pos1.dimid !== selection.pos2.dimid || selection.pos1.dimid !== parentLand.dim) {
        player.tell(`${config.appearance.warningColor}选区必须在同一维度且在父领地内`);
        return;
    }
    let pMinX = Math.min(parentLand.pos1.x, parentLand.pos2.x);
    let pMaxX = Math.max(parentLand.pos1.x, parentLand.pos2.x);
    let pMinZ = Math.min(parentLand.pos1.z, parentLand.pos2.z);
    let pMaxZ = Math.max(parentLand.pos1.z, parentLand.pos2.z);
    
    let sMinX = Math.min(selection.pos1.x, selection.pos2.x);
    let sMaxX = Math.max(selection.pos1.x, selection.pos2.x);
    let sMinZ = Math.min(selection.pos1.z, selection.pos2.z);
    let sMaxZ = Math.max(selection.pos1.z, selection.pos2.z);
    
    if (sMinX < pMinX || sMaxX > pMaxX || sMinZ < pMinZ || sMaxZ > pMaxZ) {
        player.tell(`${config.appearance.warningColor}子领地选区必须完全在父领地范围内`);
        return;
    }
    if (!parentLand.is2D) {
        let pMinY = Math.min(parentLand.pos1.y, parentLand.pos2.y);
        let pMaxY = Math.max(parentLand.pos1.y, parentLand.pos2.y);
        let sMinY = Math.min(selection.pos1.y, selection.pos2.y);
        let sMaxY = Math.max(selection.pos1.y, selection.pos2.y);
        
        if (sMinY < pMinY || sMaxY > pMaxY) {
            player.tell(`${config.appearance.warningColor}子领地选区高度必须在父领地范围内`);
            return;
        }
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}创建子领地`);
    form.addLabel(`${config.appearance.infoColor}将在领地 "${parentLand.name}" 内创建一个子领地。\n子领地拥有独立的权限设置。`);
    form.addInput(`${config.appearance.secondaryColor}子领地名称`, "子区域", "");
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showFastLandManager(pl, parentLandId);
            return;
        }
        
        let name = data[1].trim();
        if (!name) {
            pl.tell(`${config.appearance.warningColor}名称不能为空`);
            return;
        }
        let landId = generateLandId();
        let centerX = Math.floor((sMinX + sMaxX) / 2);
        let centerZ = Math.floor((sMinZ + sMaxZ) / 2);
        let centerY = parentLand.is2D ? 100 : Math.floor((Math.min(selection.pos1.y, selection.pos2.y) + Math.max(selection.pos1.y, selection.pos2.y)) / 2);
        
        landsData[landId] = {
            id: landId,
            name: name,
            parentId: parentLandId,
            owner: pl.xuid,
            ownerName: pl.name,
            pos1: { ...selection.pos1 },
            pos2: { ...selection.pos2 },
            dim: parentLand.dim,
            dimName: parentLand.dimName,
            is2D: parentLand.is2D,
            createdTime: Date.now(),
            lastTaxTime: Date.now(),
            lastPromptTime: 0,
            members: {},
            permissions: { ...config.defaultPermissions },
            protection: { ...config.protection },
            flags: {},
            teleportPos: {
                x: centerX,
                y: centerY,
                z: centerZ,
                dimid: parentLand.dim
            }
        };
        
        indexLand(landId, landsData[landId]);
        saveLandsData();
        clearPlayerSelection(pl.xuid);
        
        pl.tell(`${config.appearance.highlightColor}成功创建子领地 "${name}"`);
        showFastLandManager(pl, landId);
    });
}
function showBuySubLandForm(player, parentLandId) {
    let parentLand = landsData[parentLandId];
    if (!parentLand) return;
    
    let subSelection = getPlayerSubSelection(player.xuid);
    
    if (!subSelection.pos1 || !subSelection.pos2) {
        player.tell(`${config.appearance.warningColor}请先使用 /land z1 和 /land z2 设置子领地选区`);
        return;
    }
    
    if (subSelection.pos1.dimid !== subSelection.pos2.dimid || subSelection.pos1.dimid !== parentLand.dim) {
        player.tell(`${config.appearance.warningColor}子领地选区必须在同一维度且在父领地内`);
        return;
    }
    
    let sMinX = Math.min(subSelection.pos1.x, subSelection.pos2.x);
    let sMaxX = Math.max(subSelection.pos1.x, subSelection.pos2.x);
    let sMinZ = Math.min(subSelection.pos1.z, subSelection.pos2.z);
    let sMaxZ = Math.max(subSelection.pos1.z, subSelection.pos2.z);
    
    let pMinX = Math.min(parentLand.pos1.x, parentLand.pos2.x);
    let pMaxX = Math.max(parentLand.pos1.x, parentLand.pos2.x);
    let pMinZ = Math.min(parentLand.pos1.z, parentLand.pos2.z);
    let pMaxZ = Math.max(parentLand.pos1.z, parentLand.pos2.z);
    
    if (sMinX < pMinX || sMaxX > pMaxX || sMinZ < pMinZ || sMaxZ > pMaxZ) {
        player.tell(`${config.appearance.warningColor}子领地选区必须完全在父领地范围内`);
        return;
    }
    
    if (!parentLand.is2D) {
        let pMinY = Math.min(parentLand.pos1.y, parentLand.pos2.y);
        let pMaxY = Math.max(parentLand.pos1.y, parentLand.pos2.y);
        let sMinY = Math.min(subSelection.pos1.y, subSelection.pos2.y);
        let sMaxY = Math.max(subSelection.pos1.y, subSelection.pos2.y);
        
        if (sMinY < pMinY || sMaxY > pMaxY) {
            player.tell(`${config.appearance.warningColor}子领地选区高度必须在父领地范围内`);
            return;
        }
    }
    
    let existingSubLands = 0;
    for (let landId in landsData) {
        if (landsData[landId].parentId === parentLandId) {
            existingSubLands++;
        }
    }
    
    if (existingSubLands >= config.limits.maxSubLandsPerLand) {
        player.tell(`${config.appearance.warningColor}该领地的子领地数量已达上限 (${config.limits.maxSubLandsPerLand})`);
        return;
    }
    
    let volume = calculateSelectionVolume(subSelection, parentLand.is2D);
    let price = Math.floor(calculateLandPrice(volume, parentLand.is2D) * 0.5);
    let balance = getBalance(player.xuid);
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}购买子领地`);
    
    let infoText = `${config.appearance.infoColor}在领地 "${parentLand.name}" 内购买子领地\n\n`;
    infoText += `${config.appearance.secondaryColor}体积: ${config.appearance.infoColor}${volume} 方块\n`;
    infoText += `${config.appearance.highlightColor}价格: ${config.appearance.infoColor}${price} (主领地50%折扣)\n`;
    infoText += `${config.appearance.secondaryColor}你的余额: ${config.appearance.infoColor}${balance}\n\n`;
    infoText += `${config.appearance.primaryColor}购买后你将拥有该子领地的完全控制权`;
    
    form.addLabel(infoText);
    form.addInput(`${config.appearance.secondaryColor}子领地名称`, "我的子区域", "");
    
    player.sendForm(form, (pl, data) => {
        if (!data) return;
        
        let name = data[1].trim();
        if (!name) {
            pl.tell(`${config.appearance.warningColor}名称不能为空`);
            return;
        }
        
        if (name.length > 20) {
            pl.tell(`${config.appearance.warningColor}名称不能超过20个字符`);
            return;
        }
        
        if (isLandAdmin(pl)) {
            pl.tell(`${config.appearance.infoColor}[管理员] 免费创建子领地`);
        } else {
            if (balance < price) {
                pl.tell(`${config.appearance.warningColor}余额不足，需要 ${price}，当前余额 ${balance}`);
                return;
            }
            
            if (!reduceMoney(pl.xuid, price)) {
                pl.tell(`${config.appearance.warningColor}扣除余额失败`);
                return;
            }
        }
        
        let landId = generateLandId();
        let centerX = Math.floor((sMinX + sMaxX) / 2);
        let centerZ = Math.floor((sMinZ + sMaxZ) / 2);
        let centerY = parentLand.is2D ? 100 : Math.floor((Math.min(subSelection.pos1.y, subSelection.pos2.y) + Math.max(subSelection.pos1.y, subSelection.pos2.y)) / 2);
        
        landsData[landId] = {
            id: landId,
            name: name,
            parentId: parentLandId,
            owner: pl.xuid,
            ownerName: pl.name,
            pos1: { ...subSelection.pos1 },
            pos2: { ...subSelection.pos2 },
            dim: parentLand.dim,
            dimName: parentLand.dimName,
            is2D: parentLand.is2D,
            createdTime: Date.now(),
            lastTaxTime: Date.now(),
            lastPromptTime: 0,
            members: {},
            permissions: { ...config.defaultPermissions },
            protection: { ...config.protection },
            flags: {},
            teleportPos: {
                x: centerX,
                y: centerY,
                z: centerZ,
                dimid: parentLand.dim
            },
            warps: {},
            blacklist: {},
            allowMemberBuySubLand: false
        };
        
        indexLand(landId, landsData[landId]);
        saveLandsData();
        clearPlayerSubSelection(pl.xuid);
        
        pl.tell(`${config.appearance.highlightColor}成功购买子领地 "${name}"，花费 ${price}`);
        pl.sendToast(`${config.appearance.highlightColor}子领地购买成功`, `已购买子领地: ${name}`);
        showFastLandManager(pl, landId);
    });
}
function showSubLandsManagementMenu(player, parentLandId) {
    let parentLand = landsData[parentLandId];
    if (!parentLand) return;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}管理子领地`);
    
    let subLands = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.parentId === parentLandId) {
            subLands.push({ id: landId, land: land });
        }
    }
    
    let content = `${config.appearance.infoColor}领地: ${parentLand.name}\n`;
    content += `${config.appearance.secondaryColor}子领地数量: ${config.appearance.infoColor}${subLands.length}/${config.limits.maxSubLandsPerLand}\n\n`;
    content += `${config.appearance.secondaryColor}点击子领地查看详情：`;
    
    form.setContent(content);
    
    subLands.forEach(item => {
        let land = item.land;
        let area = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
        form.addButton(`${config.appearance.highlightColor}${land.name}\n${config.appearance.infoColor}所有者: ${land.ownerName} | ${area}方块`, "textures/ui/icon_recipe_item");
    });
    
    form.addButton(`${config.appearance.secondaryColor}返回领地详情`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === subLands.length) {
            showFastLandManager(pl, parentLandId);
            return;
        }
        
        if (id < subLands.length) {
            showFastLandManager(pl, subLands[id].id);
        }
    });
}
function showBuyLandFlightMenu(player, landId) {
    let land = landsData[landId];
    if (!land) return;
    
    if (land.owner !== player.xuid && !isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}只有领地所有者可以购买飞行功能`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}购买领地飞行`);
    
    let timeCost = config.prices.flightTimeCost !== undefined ? config.prices.flightTimeCost : 100;
    let timeDuration = config.prices.flightTimeDuration !== undefined ? config.prices.flightTimeDuration : 1;
    let permCost = config.prices.flightPermCost !== undefined ? config.prices.flightPermCost : 1000;
    
    let content = `${config.appearance.infoColor}为领地 "${land.name}" 解锁飞行功能。\n\n`;
    content += `${config.appearance.secondaryColor}当前状态: ${config.appearance.infoColor}`;
    
    if (land.flightUnlockType === "perm") {
        content += "已永久解锁\n\n";
        content += `${config.appearance.highlightColor}无需再次购买。`;
        form.setContent(content);
        form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
        
        player.sendForm(form, (pl, id) => {
            showLandFlightMenu(pl, landId);
        });
        return;
    } else if (land.flightUnlockType === "time") {
        let remainingHours = (land.flightTimeRemaining / 3600000).toFixed(2);
        content += `剩余时间: ${remainingHours} 小时\n\n`;
        content += `${config.appearance.highlightColor}注意：时间仅在领地内有人飞行时扣除。\n多人飞行会倍速扣除时间。`;
    } else {
        content += "未解锁\n\n";
        content += `${config.appearance.infoColor}解锁后，领地内允许飞行，你可以控制开启或关闭。`;
    }
    
    form.setContent(content);
    
    let buttons = [];
    if (timeCost > 0) {
        buttons.push({
            text: `${config.appearance.secondaryColor}购买飞行时间 (${timeDuration}小时)\n${config.appearance.infoColor}价格: ${timeCost}`,
            image: "textures/ui/timer",
            type: "time",
            cost: timeCost,
            duration: timeDuration
        });
    }
    
    buttons.push({
        text: `${config.appearance.highlightColor}购买永久飞行\n${config.appearance.infoColor}价格: ${permCost}`,
        image: "textures/ui/slow_falling_effect",
        type: "perm",
        cost: permCost
    });
    
    buttons.forEach(btn => {
        form.addButton(btn.text, btn.image);
    });
    
    form.addButton(`${config.appearance.warningColor}取消`, "textures/ui/cancel");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === buttons.length) {
            showLandFlightMenu(pl, landId);
            return;
        }
        
        let btn = buttons[id];
        let isAdmin = isLandAdmin(pl);
        
        if (!isAdmin && getBalance(pl.xuid) < btn.cost) {
            pl.tell(`${config.appearance.warningColor}余额不足，需要 ${btn.cost}`);
            return;
        }
        
        let paySuccess = isAdmin || reduceMoney(pl.xuid, btn.cost);
        if (paySuccess) {
            if (isAdmin) {
                pl.tell(`${config.appearance.infoColor}[管理员] 免费购买飞行`);
            }
            if (btn.type === "perm") {
                land.flightUnlockType = "perm";
                delete land.flightTimeRemaining;
                pl.tell(`${config.appearance.highlightColor}成功购买永久领地飞行！`);
            } else {
                land.flightUnlockType = "time";
                let addTime = btn.duration * 3600 * 1000;
                land.flightTimeRemaining = (land.flightTimeRemaining || 0) + addTime;
                
                pl.tell(`${config.appearance.highlightColor}成功购买飞行时间！当前剩余: ${(land.flightTimeRemaining / 3600000).toFixed(2)} 小时`);
            }
            if (!land.permissions.fly) {
                land.permissions.fly = true;
            }
            
            saveLandsData();
        } else {
            pl.tell(`${config.appearance.warningColor}购买失败`);
        }
        
        showLandFlightMenu(pl, landId);
    });
}

function updateLandFlightTime() {
    let players = mc.getOnlinePlayers();
    let needSave = false;
    let flyingPlayersWithBar = new Set();
    
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (!player) continue;
        
        let landInfo = getLandAt(player.pos.x, player.pos.y, player.pos.z, player.pos.dimid);
        if (!landInfo || landInfo.isExtended) {
            if (player.removeBossBar) {
                player.removeBossBar(888888);
            }
            continue;
        }
        
        let land = landsData[landInfo.id];
        if (!land) continue;
        
        if (player.isFlying) {
            flyingPlayersWithBar.add(player.xuid);
            
            if (land.flightUnlockType === "perm") {
                if (player.removeBossBar) {
                    player.removeBossBar(888888);
                }
            } else if (land.flightUnlockType === "time" && land.flightTimeRemaining > 0) {
                let flyingCountInLand = 0;
                for (let j = 0; j < players.length; j++) {
                    let p = players[j];
                    if (!p || !p.isFlying) continue;
                    let pLand = getLandAt(p.pos.x, p.pos.y, p.pos.z, p.pos.dimid);
                    if (pLand && !pLand.isExtended && pLand.id === landInfo.id) {
                        flyingCountInLand++;
                    }
                }
                
                let deduction = 1000 * flyingCountInLand;
                land.flightTimeRemaining -= deduction;
                
                if (land.flightTimeRemaining <= 0) {
                    land.flightTimeRemaining = 0;
                    delete land.flightUnlockType;
                    land.permissions.fly = false;
                    needSave = true;
                    
                    for (let j = 0; j < players.length; j++) {
                        let p = players[j];
                        let pLand = getLandAt(p.pos.x, p.pos.y, p.pos.z, p.pos.dimid);
                        if (pLand && !pLand.isExtended && pLand.id === landInfo.id) {
                            disablePlayerFlight(p);
                        }
                    }
                    
                    let owner = mc.getPlayer(land.owner);
                    if (owner) {
                        owner.tell(`${config.appearance.warningColor}你的领地 "${land.name}" 的飞行时间已耗尽！`);
                    }
                } else {
                    let percent = Math.max(0, Math.min(100, (land.flightTimeRemaining / (config.prices.flightTimeDuration * 60 * 1000)) * 100));
                    let timeStr = formatTime(land.flightTimeRemaining);
                    if (player.setBossBar) {
                        player.setBossBar(888888, `§e领地飞行剩余: ${timeStr}`, percent, 4);
                    }
                }
            }
        } else {
            if (player.removeBossBar) {
                player.removeBossBar(888888);
            }
        }
    }
    
    if (needSave) {
        saveLandsData();
    }
}
setInterval(() => {
    saveLandsData();
}, 60000);
setInterval(updateLandFlightTime, 1000);
function showBuyTemporaryFlightMenu(player, landId) {
    showBuyLandFlightMenu(player, landId);
}
function showLandProtectionMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    if (!land.protection) {
        land.protection = { ...config.protection };
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.secondaryColor}领地保护设置: ${land.name}`);
    
    form.addLabel(`${config.appearance.infoColor}为领地 "${land.name}" 配置保护功能：`);
    
    form.addSwitch(`${config.appearance.warningColor}防止爆炸`, land.protection.preventExplosions !== false);
    form.addSwitch(`${config.appearance.warningColor}防止TNT`, land.protection.preventTNT !== false);
    form.addSwitch(`${config.appearance.warningColor}防止苦力怕爆炸`, land.protection.preventCreeper !== false);
    form.addSwitch(`${config.appearance.warningColor}防止火焰蔓延`, land.protection.preventFireSpread !== false);
    form.addSwitch(`${config.appearance.warningColor}防止怪物生成`, land.protection.preventMobSpawning || false);
    form.addSwitch(`${config.appearance.warningColor}防止活塞推动`, land.protection.preventPistonPush !== false);
    form.addSwitch(`${config.appearance.warningColor}防止液体流动`, land.protection.preventLiquidFlow !== false);
    form.addSwitch(`${config.appearance.warningColor}防止耕地退化`, land.protection.preventFarmlandDecay !== false);
    form.addSwitch(`${config.appearance.warningColor}防止树叶腐烂`, land.protection.preventLeafDecay || false);
    form.addSwitch(`${config.appearance.warningColor}防止冰块融化`, land.protection.preventIceMelt !== false);
    form.addSwitch(`${config.appearance.warningColor}防止雪融化`, land.protection.preventSnowMelt !== false);
    form.addSwitch(`${config.appearance.warningColor}防止珊瑚死亡`, land.protection.preventCoralsFromDying !== false);
    form.addSwitch(`${config.appearance.warningColor}防止钓鱼竿钓人`, land.protection.fishingProtection !== false);
    form.addSwitch(`${config.appearance.warningColor}禁止使用骨粉`, land.protection.preventBoneMeal || false);
    form.addSwitch(`${config.appearance.highlightColor}允许玩家进入领地`, land.protection.allowPlayerEntry !== false);
    form.addSwitch(`${config.appearance.primaryColor}允许成员购买子领地`, land.allowMemberBuySubLand || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止末影人搬运方块`, land.protection.preventEndermanTake !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止重生锚爆炸`, land.protection.preventRespawnAnchorExplode !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止漏斗吸取物品`, land.protection.preventHopperInput || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止漏斗输出物品`, land.protection.preventHopperOutput || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止红石信号传入`, land.protection.preventRedstoneUpdate || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止命令方块执行`, land.protection.preventCmdBlockExecute !== false);
    form.addSwitch(`${config.appearance.secondaryColor}记录容器操作日志`, land.protection.logContainerChange || false);
    form.addSwitch(`${config.appearance.secondaryColor}保护展示框`, land.protection.preventFrameInteract !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止桶倒出液体`, land.protection.preventBucketPlace !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止桶装取液体`, land.protection.preventBucketTake !== false);
    form.addSwitch(`${config.appearance.secondaryColor}保护盔甲架`, land.protection.preventArmorStandChange !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止骑乘实体`, land.protection.preventRide || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止非成员触发压力板`, land.protection.preventPressurePlate || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止发射弹射物`, land.protection.preventProjectileSpawn || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showLandSettingsMenu(pl, landId);
            return;
        }
        
        land.protection.preventExplosions = data[1];
        land.protection.preventTNT = data[2];
        land.protection.preventCreeper = data[3];
        land.protection.preventFireSpread = data[4];
        land.protection.preventMobSpawning = data[5];
        land.protection.preventPistonPush = data[6];
        land.protection.preventLiquidFlow = data[7];
        land.protection.preventFarmlandDecay = data[8];
        land.protection.preventLeafDecay = data[9];
        land.protection.preventIceMelt = data[10];
        land.protection.preventSnowMelt = data[11];
        land.protection.preventCoralsFromDying = data[12];
        land.protection.fishingProtection = data[13];
        land.protection.preventBoneMeal = data[14];
        land.protection.allowPlayerEntry = data[15];
        land.allowMemberBuySubLand = data[16];
        land.protection.preventEndermanTake = data[17];
        land.protection.preventRespawnAnchorExplode = data[18];
        land.protection.preventHopperInput = data[19];
        land.protection.preventHopperOutput = data[20];
        land.protection.preventRedstoneUpdate = data[21];
        land.protection.preventCmdBlockExecute = data[22];
        land.protection.logContainerChange = data[23];
        land.protection.preventFrameInteract = data[24];
        land.protection.preventBucketPlace = data[25];
        land.protection.preventBucketTake = data[26];
        land.protection.preventArmorStandChange = data[27];
        land.protection.preventRide = data[28];
        land.protection.preventPressurePlate = data[29];
        land.protection.preventProjectileSpawn = data[30];
        
        setLandProtectionSettings(landId, pl.xuid, land.protection);
        
        pl.tell(`${config.appearance.highlightColor}已更新领地 "${land.name}" 的保护设置`);
        showLandSettingsMenu(pl, landId);
    });
}

function showLandSettingsMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}领地设置: ${land.name}`);
    form.setContent(`${config.appearance.infoColor}选择要配置的设置类别:`);
    
    form.addButton(`${config.appearance.highlightColor}进入提示设置\n${config.appearance.infoColor}显示方式/消息/音效`, "textures/ui/book_edit_default");
    form.addButton(`${config.appearance.secondaryColor}事件控制设置\n${config.appearance.infoColor}爆炸/火焰/活塞等`, "textures/ui/icon_setting");
    form.addButton(`${config.appearance.primaryColor}传送点设置\n${config.appearance.infoColor}设置领地传送位置`, "textures/ui/worldsIcon");
    form.addButton(`${config.appearance.highlightColor}保护设置\n${config.appearance.infoColor}领地保护功能`, "textures/ui/lock_color");
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 4) {
            showFastLandManager(pl, landId);
            return;
        }
        
        switch (id) {
            case 0:
                showLandEnterSettingsMenu(pl, landId);
                break;
            case 1:
                showLandEventSettingsMenu(pl, landId);
                break;
            case 2:
                showSetTeleportPosMenu(pl, landId);
                break;
            case 3:
                showLandProtectionMenu(pl, landId);
                break;
        }
    });
}

function showLandEnterSettingsMenu(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.primaryColor}进入提示设置`);
    
    form.addLabel(`${config.appearance.infoColor}配置领地 "${land.name}" 的进入/离开提示:`);
    
    form.addSwitch(`${config.appearance.highlightColor}对主人显示进入提示`, land.signToMe !== false);
    form.addSwitch(`${config.appearance.secondaryColor}对访客显示进入提示`, land.signToOther !== false);
    form.addSwitch(`${config.appearance.primaryColor}底部显示领地信息`, land.signBottom || false);
    
    let displayOptions = ["ActionBar", "BossBar(显示中心度)", "标题显示", "不显示"];
    let currentDisplayType = land.enterDisplayType || config.visualization.landEnterDisplayType || "actionbar";
    let displayIdx = 0;
    if (currentDisplayType === "bossbar") displayIdx = 1;
    else if (currentDisplayType === "title") displayIdx = 2;
    else if (currentDisplayType === "none") displayIdx = 3;
    form.addDropdown(`${config.appearance.secondaryColor}显示方式`, displayOptions, displayIdx);
    
    form.addSwitch(`${config.appearance.primaryColor}播放进入音效`, land.playSoundOnEnter !== false);
    form.addSwitch(`${config.appearance.secondaryColor}播放离开音效`, land.playSoundOnLeave !== false);
    
    let defaultEnterMsg = `欢迎来到 {land}`;
    let defaultLeaveMsg = `离开了 {land}`;
    form.addInput(`${config.appearance.highlightColor}进入消息`, "{land}=领地名, {owner}=主人, {visitor}=访客", land.customEnterMessage || defaultEnterMsg);
    form.addInput(`${config.appearance.secondaryColor}离开消息`, "{land}=领地名, {owner}=主人, {visitor}=访客", land.customLeaveMessage || defaultLeaveMsg);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showLandSettingsMenu(pl, landId);
            return;
        }
        
        land.signToMe = data[1];
        land.signToOther = data[2];
        land.signBottom = data[3];
        
        let displayTypes = ["actionbar", "bossbar", "title", "none"];
        land.enterDisplayType = displayTypes[data[4]];
        
        land.playSoundOnEnter = data[5];
        land.playSoundOnLeave = data[6];
        land.customEnterMessage = data[7] && data[7].trim() !== "" ? data[7].trim() : null;
        land.customLeaveMessage = data[8] && data[8].trim() !== "" ? data[8].trim() : null;
        
        saveLandsData();
        
        pl.sendModalForm(
            `${config.appearance.highlightColor}设置成功`,
            `${config.appearance.infoColor}进入提示设置已更新`,
            `${config.appearance.primaryColor}返回`,
            `${config.appearance.secondaryColor}关闭`,
            (p, r) => { if (r) showLandSettingsMenu(p, landId); }
        );
    });
}

function showLandEventSettingsMenu(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    if (!land.eventSettings) {
        land.eventSettings = {
            allowExplosion: false,
            allowFireSpread: false,
            allowPistonPush: false,
            allowFarmlandDecay: false,
            allowRedstoneUpdate: true
        };
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.primaryColor}事件控制设置`);
    
    form.addLabel(`${config.appearance.infoColor}配置领地内的游戏事件行为:\n${config.appearance.warningColor}关闭=阻止该事件发生`);
    
    form.addSwitch(`${config.appearance.secondaryColor}允许爆炸`, land.eventSettings.allowExplosion || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许火焰蔓延`, land.eventSettings.allowFireSpread || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许活塞推动方块进入领地`, land.eventSettings.allowPistonPush || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许耕地被踩坏`, land.eventSettings.allowFarmlandDecay || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许红石信号更新`, land.eventSettings.allowRedstoneUpdate !== false);
    form.addSwitch(`${config.appearance.secondaryColor}允许液体流入领地`, land.eventSettings.allowLiquidFlow || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许怪物生成`, land.eventSettings.allowMobSpawn || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showLandSettingsMenu(pl, landId);
            return;
        }
        
        land.eventSettings.allowExplosion = data[1];
        land.eventSettings.allowFireSpread = data[2];
        land.eventSettings.allowPistonPush = data[3];
        land.eventSettings.allowFarmlandDecay = data[4];
        land.eventSettings.allowRedstoneUpdate = data[5];
        land.eventSettings.allowLiquidFlow = data[6];
        land.eventSettings.allowMobSpawn = data[7];
        
        saveLandsData();
        
        pl.sendModalForm(
            `${config.appearance.highlightColor}设置成功`,
            `${config.appearance.infoColor}事件控制设置已更新`,
            `${config.appearance.primaryColor}返回`,
            `${config.appearance.secondaryColor}关闭`,
            (p, r) => { if (r) showLandSettingsMenu(p, landId); }
        );
    });
}
function showSetTeleportPosMenu(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}设置传送点`);
    
    let content = `${config.appearance.infoColor}为领地 "${land.name}" 设置自定义传送点。\n\n`;
    
    if (land.teleportPos) {
        content += `${config.appearance.secondaryColor}当前传送点：${config.appearance.infoColor}X: ${Math.floor(land.teleportPos.x)}, Y: ${Math.floor(land.teleportPos.y)}, Z: ${Math.floor(land.teleportPos.z)}\n\n`;
    }
    
    content += `${config.appearance.infoColor}选择设置方式：`;
    form.setContent(content);
    
    form.addButton(`${config.appearance.highlightColor}使用当前位置\n${config.appearance.infoColor}将当前站立位置设为传送点`, "textures/ui/worldsIcon");
    form.addButton(`${config.appearance.secondaryColor}手动输入坐标\n${config.appearance.infoColor}输入自定义坐标`, "textures/ui/editIcon");
    form.addButton(`${config.appearance.primaryColor}恢复默认位置\n${config.appearance.infoColor}使用领地中心作为传送点`, "textures/ui/refresh");
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 3) {
            showFastLandManager(pl, landId);
            return;
        }
        
        switch (id) {
            case 0:
                if (!isPositionInLand(pl.pos.x, pl.pos.y, pl.pos.z, pl.pos.dimid, land)) {
                    pl.tell(`${config.appearance.warningColor}你必须站在领地内才能设置传送点`);
                    showSetTeleportPosMenu(pl, landId);
                    return;
                }
                
                setLandTeleportPos(landId, pl.xuid, Math.floor(pl.pos.x), Math.floor(pl.pos.y), Math.floor(pl.pos.z));
                pl.tell(`${config.appearance.highlightColor}已设置领地传送点为当前位置`);
                showFastLandManager(pl, landId);
                break;
                
            case 1:
                showCustomTeleportPosForm(pl, landId);
                break;
                
            case 2:
                let minX = Math.min(land.pos1.x, land.pos2.x);
                let maxX = Math.max(land.pos1.x, land.pos2.x);
                let minZ = Math.min(land.pos1.z, land.pos2.z);
                let maxZ = Math.max(land.pos1.z, land.pos2.z);
                
                let centerX = Math.floor((minX + maxX) / 2);
                let centerZ = Math.floor((minZ + maxZ) / 2);
                let centerY = land.is2D ? 100 : Math.floor((Math.min(land.pos1.y, land.pos2.y) + Math.max(land.pos1.y, land.pos2.y)) / 2);
                
                setLandTeleportPos(landId, pl.xuid, centerX, centerY, centerZ);
                pl.tell(`${config.appearance.highlightColor}已重置领地传送点为默认位置`);
                showFastLandManager(pl, landId);
                break;
        }
    });
}
function showCustomTeleportPosForm(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minY = Math.min(land.pos1.y, land.pos2.y);
    let maxY = Math.max(land.pos1.y, land.pos2.y);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    if (land.is2D) {
        minY = config.limits.worldHeightMin;
        maxY = config.limits.worldHeightMax;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}设置传送点坐标`);
    
    let infoText = `${config.appearance.infoColor}为领地 "${land.name}" 设置自定义传送点。\n` +
                  `${config.appearance.secondaryColor}领地范围：${config.appearance.infoColor}X: ${minX}~${maxX}, Y: ${minY}~${maxY}, Z: ${minZ}~${maxZ}\n` +
                  `${config.appearance.warningColor}注意：坐标必须在领地范围内！`;
    
    form.addLabel(infoText);
    let defaultX = land.teleportPos ? land.teleportPos.x : Math.floor((minX + maxX) / 2);
    let defaultY = land.teleportPos ? land.teleportPos.y : (land.is2D ? 100 : Math.floor((minY + maxY) / 2));
    let defaultZ = land.teleportPos ? land.teleportPos.z : Math.floor((minZ + maxZ) / 2);
    
    form.addSlider(`${config.appearance.secondaryColor}X 坐标`, minX, maxX, 1, Math.floor(defaultX));
    form.addSlider(`${config.appearance.secondaryColor}Y 坐标`, minY, maxY, 1, Math.floor(defaultY));
    form.addSlider(`${config.appearance.secondaryColor}Z 坐标`, minZ, maxZ, 1, Math.floor(defaultZ));
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showSetTeleportPosMenu(pl, landId);
            return;
        }
        
        let x = data[1];
        let y = data[2];
        let z = data[3];
        if (x < minX || x > maxX || y < minY || y > maxY || z < minZ || z > maxZ) {
            pl.tell(`${config.appearance.warningColor}坐标超出领地范围，请重新设置`);
            return;
        }
        
        if (setLandTeleportPos(landId, pl.xuid, x, y, z)) {
            pl.tell(`${config.appearance.highlightColor}已设置领地传送点为：X: ${x}, Y: ${y}, Z: ${z}`);
        } else {
            pl.tell(`${config.appearance.warningColor}设置传送点失败，请确保坐标在领地内`);
        }
        
        showFastLandManager(pl, landId);
    });
}

function showLandFlightMenu(player, landId) {
    let land = landsData[landId];
    if (!land || land.owner !== player.xuid && !isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你不是这个领地的所有者`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}领地飞行管理`);
    
    let serverEnabled = config.protection.enableFlyInLand !== false;
    let hasPurchased = land.flightUnlockType === "perm" || (land.flightUnlockType === "time" && land.flightTimeRemaining > 0);
    let flyEnabled = land.permissions && land.permissions.fly;
    
    let content = `${config.appearance.secondaryColor}领地: ${config.appearance.highlightColor}${land.name}\n\n`;
    
    content += `${config.appearance.primaryColor}服务器飞行功能: `;
    if (serverEnabled) {
        content += `${config.appearance.highlightColor}已开启\n`;
    } else {
        content += `${config.appearance.warningColor}未开启\n`;
    }
    
    content += `${config.appearance.primaryColor}飞行解锁状态: `;
    if (land.flightUnlockType === "perm") {
        content += `${config.appearance.highlightColor}永久解锁\n`;
    } else if (land.flightUnlockType === "time" && land.flightTimeRemaining > 0) {
        let remainingHours = (land.flightTimeRemaining / 3600000).toFixed(2);
        content += `${config.appearance.infoColor}限时解锁 (剩余${remainingHours}小时)\n`;
    } else {
        content += `${config.appearance.warningColor}未购买\n`;
    }
    
    content += `${config.appearance.primaryColor}飞行权限: `;
    if (flyEnabled) {
        content += `${config.appearance.highlightColor}已开启\n`;
    } else {
        content += `${config.appearance.secondaryColor}已关闭\n`;
    }
    
    form.setContent(content);
    
    let buttons = [];
    
    if (!serverEnabled) {
        form.addButton(`${config.appearance.secondaryColor}服务器未开启飞行功能`, "textures/ui/cancel");
        buttons.push("disabled");
    } else if (!hasPurchased) {
        form.addButton(`${config.appearance.highlightColor}购买领地飞行\n${config.appearance.infoColor}解锁飞行功能`, "textures/ui/MCoin");
        buttons.push("buy");
    } else {
        if (flyEnabled) {
            form.addButton(`${config.appearance.warningColor}关闭飞行权限\n${config.appearance.infoColor}禁止领地内飞行`, "textures/ui/flyingdescend");
            buttons.push("disable");
        } else {
            form.addButton(`${config.appearance.highlightColor}开启飞行权限\n${config.appearance.infoColor}允许领地内飞行`, "textures/ui/flyingascend");
            buttons.push("enable");
        }
        
        if (land.flightUnlockType === "time") {
            form.addButton(`${config.appearance.primaryColor}续费飞行时间\n${config.appearance.infoColor}增加飞行时长`, "textures/ui/MCoin");
            buttons.push("renew");
        }
    }
    
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    buttons.push("back");
    
    player.sendForm(form, (pl, id) => {
        if (id === null) {
            showFastLandManager(pl, landId);
            return;
        }
        
        let action = buttons[id];
        switch (action) {
            case "disabled":
                pl.tell(`${config.appearance.warningColor}服务器管理员未开启领地飞行功能`);
                showLandFlightMenu(pl, landId);
                break;
            case "buy":
            case "renew":
                showBuyLandFlightMenu(pl, landId);
                break;
            case "enable":
                land.permissions.fly = true;
                saveLandsData();
                pl.tell(`${config.appearance.highlightColor}已开启领地飞行权限`);
                showLandFlightMenu(pl, landId);
                break;
            case "disable":
                land.permissions.fly = false;
                saveLandsData();
                pl.tell(`${config.appearance.secondaryColor}已关闭领地飞行权限`);
                showLandFlightMenu(pl, landId);
                break;
            case "back":
                showFastLandManager(pl, landId);
                break;
        }
    });
}

function toggleLandFly(player, landId) {
    showLandFlightMenu(player, landId);
}
function showWarpManagementMenu(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}传送点管理`);
    
    let warpCount = land.warps ? Object.keys(land.warps).length : 0;
    let content = `${config.appearance.infoColor}领地: ${land.name}\n`;
    content += `${config.appearance.secondaryColor}传送点数量: ${config.appearance.infoColor}${warpCount}\n\n`;
    
    if (land.teleportPos) {
        content += `${config.appearance.highlightColor}默认传送点: ${config.appearance.infoColor}X:${Math.floor(land.teleportPos.x)} Y:${Math.floor(land.teleportPos.y)} Z:${Math.floor(land.teleportPos.z)}\n\n`;
    }
    
    if (warpCount > 0) {
        content += `${config.appearance.secondaryColor}现有传送点:\n`;
        for (let warpName in land.warps) {
            let warp = land.warps[warpName];
            let type = warp.isPublic ? "公共" : "私密";
            content += `${config.appearance.infoColor}  • ${warpName} [${type}]\n`;
        }
    }
    
    form.setContent(content);
    
    form.addButton(`${config.appearance.highlightColor}设置默认传送点`, "textures/ui/worldsIcon");
    form.addButton(`${config.appearance.primaryColor}添加传送点(公共)`, "textures/ui/color_plus");
    form.addButton(`${config.appearance.secondaryColor}添加传送点(私密)`, "textures/ui/color_plus");
    
    if (warpCount > 0) {
        form.addButton(`${config.appearance.warningColor}删除传送点`, "textures/ui/icon_trash");
    }
    
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === (warpCount > 0 ? 4 : 3)) {
            showFastLandManager(pl, landId);
            return;
        }
        
        if (id === 0) {
            showSetTeleportPosMenu(pl, landId);
        } else if (id === 1) {
            showAddWarpForm(pl, landId, true);
        } else if (id === 2) {
            showAddWarpForm(pl, landId, false);
        } else if (id === 3 && warpCount > 0) {
            showDeleteWarpMenu(pl, landId);
        }
    });
}
function showAddWarpForm(player, landId, isPublic) {
    let land = landsData[landId];
    if (!land) return;
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.primaryColor}添加传送点`);
    
    let typeText = isPublic ? "公共(所有人可用)" : "私密(仅成员可用)";
    form.addLabel(`${config.appearance.infoColor}为领地 "${land.name}" 添加${typeText}传送点\n${config.appearance.warningColor}名称建议不超过12个字符`);
    form.addInput("传送点名称", "例如: spawn", "");
    
    let posText = `${config.appearance.secondaryColor}当前位置: ${config.appearance.infoColor}X:${Math.floor(player.pos.x)} Y:${Math.floor(player.pos.y)} Z:${Math.floor(player.pos.z)}`;
    form.addLabel(posText);
    form.addSwitch("使用当前位置", true);
    form.addInput("X坐标(可选)", "留空使用当前位置", "");
    form.addInput("Y坐标(可选)", "留空使用当前位置", "");
    form.addInput("Z坐标(可选)", "留空使用当前位置", "");
    
    player.sendForm(form, (pl, data) => {
        if (data === null) {
            showWarpManagementMenu(pl, landId);
            return;
        }
        
        let warpName = data[1].trim();
        if (!warpName) {
            pl.tell(`${config.appearance.warningColor}请输入传送点名称`);
            return;
        }
        
        let x, y, z;
        if (data[3]) {
            x = Math.floor(pl.pos.x);
            y = Math.floor(pl.pos.y);
            z = Math.floor(pl.pos.z);
        } else {
            x = data[4] ? parseFloat(data[4]) : Math.floor(pl.pos.x);
            y = data[5] ? parseFloat(data[5]) : Math.floor(pl.pos.y);
            z = data[6] ? parseFloat(data[6]) : Math.floor(pl.pos.z);
            
            if (isNaN(x) || isNaN(y) || isNaN(z)) {
                pl.tell(`${config.appearance.warningColor}坐标格式错误`);
                return;
            }
        }
        
        let result = addLandWarp(landId, pl.xuid, warpName, x, y, z, isPublic);
        pl.tell(result.success ? `${config.appearance.highlightColor}${result.message}` : `${config.appearance.warningColor}${result.message}`);
        
        if (result.success) {
            showWarpManagementMenu(pl, landId);
        }
    });
}
function showDeleteWarpMenu(player, landId) {
    let land = landsData[landId];
    if (!land || !land.warps) return;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.warningColor}删除传送点`);
    form.setContent(`${config.appearance.infoColor}选择要删除的传送点:`);
    
    let warpList = [];
    for (let warpName in land.warps) {
        warpList.push(warpName);
        let warp = land.warps[warpName];
        let type = warp.isPublic ? "公共" : "私密";
        form.addButton(`${config.appearance.secondaryColor}${warpName}\n${config.appearance.infoColor}[${type}]`, "textures/ui/icon_trash");
    }
    
    form.addButton(`${config.appearance.primaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === warpList.length) {
            showWarpManagementMenu(pl, landId);
            return;
        }
        
        let warpName = warpList[id];
        let result = removeLandWarp(landId, pl.xuid, warpName);
        pl.tell(result.success ? `${config.appearance.highlightColor}${result.message}` : `${config.appearance.warningColor}${result.message}`);
        showWarpManagementMenu(pl, landId);
    });
}
function showBlacklistManagementMenu(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.warningColor}黑名单管理`);
    
    let blacklistCount = land.blacklist ? Object.keys(land.blacklist).length : 0;
    let content = `${config.appearance.infoColor}领地: ${land.name}\n`;
    content += `${config.appearance.secondaryColor}黑名单人数: ${config.appearance.infoColor}${blacklistCount}\n\n`;
    
    if (blacklistCount > 0) {
        content += `${config.appearance.secondaryColor}黑名单玩家:\n`;
        for (let xuid in land.blacklist) {
            let info = land.blacklist[xuid];
            content += `${config.appearance.infoColor}  • ${info.name}\n`;
        }
    }
    
    form.setContent(content);
    
    form.addButton(`${config.appearance.warningColor}添加到黑名单`, "textures/ui/icon_ban");
    
    if (blacklistCount > 0) {
        form.addButton(`${config.appearance.highlightColor}移出黑名单`, "textures/ui/check");
    }
    
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === (blacklistCount > 0 ? 2 : 1)) {
            showFastLandManager(pl, landId);
            return;
        }
        
        if (id === 0) {
            showAddToBlacklistForm(pl, landId);
        } else if (id === 1 && blacklistCount > 0) {
            showRemoveFromBlacklistMenu(pl, landId);
        }
    });
}
function showAddToBlacklistForm(player, landId) {
    let land = landsData[landId];
    if (!land) return;
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.warningColor}添加到黑名单`);
    
    form.addLabel(`${config.appearance.infoColor}将玩家添加到领地 "${land.name}" 的黑名单\n${config.appearance.warningColor}黑名单玩家将无法进入领地`);
    form.addInput("玩家名称", "输入玩家名称", "");
    
    player.sendForm(form, (pl, data) => {
        if (data === null) {
            showBlacklistManagementMenu(pl, landId);
            return;
        }
        
        let targetName = data[1].trim();
        if (!targetName) {
            pl.tell(`${config.appearance.warningColor}请输入玩家名称`);
            return;
        }
        
        let targetPlayer = mc.getPlayer(targetName);
        if (!targetPlayer) {
            pl.tell(`${config.appearance.warningColor}找不到玩家: ${targetName}`);
            return;
        }
        
        let result = addToBlacklist(landId, pl.xuid, targetPlayer.xuid, targetPlayer.realName);
        pl.tell(result.success ? `${config.appearance.highlightColor}${result.message}` : `${config.appearance.warningColor}${result.message}`);
        
        if (result.success) {
            showBlacklistManagementMenu(pl, landId);
        }
    });
}
function showRemoveFromBlacklistMenu(player, landId) {
    let land = landsData[landId];
    if (!land || !land.blacklist) return;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}移出黑名单`);
    form.setContent(`${config.appearance.infoColor}选择要移出黑名单的玩家:`);
    
    let blacklistArray = [];
    for (let xuid in land.blacklist) {
        blacklistArray.push({xuid: xuid, info: land.blacklist[xuid]});
        form.addButton(`${config.appearance.secondaryColor}${land.blacklist[xuid].name}`, "textures/ui/check");
    }
    
    form.addButton(`${config.appearance.primaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === blacklistArray.length) {
            showBlacklistManagementMenu(pl, landId);
            return;
        }
        
        let targetXuid = blacklistArray[id].xuid;
        let result = removeFromBlacklist(landId, pl.xuid, targetXuid);
        pl.tell(result.success ? `${config.appearance.highlightColor}${result.message}` : `${config.appearance.warningColor}${result.message}`);
        showBlacklistManagementMenu(pl, landId);
    });
}
function showSelectLandForPermissionsMenu(player) {
    let xuid = player.xuid;
    let ownedLands = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.owner === xuid || isLandAdmin(player)) {
            ownedLands.push({ id: landId, land: land });
        }
    }
    
    if (ownedLands.length === 0) {
        player.tell(`${config.appearance.warningColor}你没有任何领地`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}选择领地`);
    form.setContent(`${config.appearance.infoColor}选择要设置权限的领地：`);
    ownedLands.forEach(item => {
        let land = item.land;
        let type = land.is2D ? "2D" : "3D";
        form.addButton(`${config.appearance.highlightColor}${land.name}\n${config.appearance.infoColor}${land.dimName} | ${type}`, "textures/ui/permissions_member_star");
    });
    
    form.addButton(`${config.appearance.warningColor}返回主菜单`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === ownedLands.length) {
            showMainMenu(pl);
            return;
        }
        
        if (id < ownedLands.length) {
            let selected = ownedLands[id];
            showLandPermissionsMenu(pl, selected.id);
        }
    });
}
function showLandPermissionsMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let memberCount = land.members ? Object.keys(land.members).length : 0;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}权限设置: ${land.name}`);
    
    let content = `${config.appearance.infoColor}选择要设置的权限类型：\n\n`;
    content += `${config.appearance.highlightColor}【访客权限】${config.appearance.infoColor}适用于所有非成员玩家\n`;
    content += `${config.appearance.secondaryColor}【成员权限】${config.appearance.infoColor}单独设置每个成员的权限\n`;
    content += `${config.appearance.warningColor}当前成员数: ${memberCount}`;
    
    form.setContent(content);
    
    form.addButton(`${config.appearance.highlightColor}访客权限设置\n${config.appearance.infoColor}非成员玩家的默认权限`, "textures/ui/normalArm");
    form.addButton(`${config.appearance.secondaryColor}成员权限管理\n${config.appearance.infoColor}单独配置每个成员权限`, "textures/ui/permissions_member_star");
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 2) {
            showFastLandManager(pl, landId);
            return;
        }
        
        switch (id) {
            case 0:
                showGlobalPermissionsMenu(pl, landId);
                break;
            case 1:
                showMemberPermissionsSelectMenu(pl, landId);
                break;
        }
    });
}

function showGlobalPermissionsMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}访客权限设置`);
    form.setContent(`${config.appearance.infoColor}领地: ${config.appearance.highlightColor}${land.name}\n${config.appearance.secondaryColor}选择要配置的权限类别:`);
    
    form.addButton(`${config.appearance.highlightColor}基础权限\n${config.appearance.infoColor}建造/破坏/放置`, "textures/ui/icon_iron_pickaxe");
    form.addButton(`${config.appearance.secondaryColor}功能方块权限\n${config.appearance.infoColor}容器/门/床/按钮`, "textures/ui/recipe_book_icon");
    form.addButton(`${config.appearance.primaryColor}其他权限\n${config.appearance.infoColor}攻击/骑乘/物品等`, "textures/ui/icon_bookshelf");
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 3) {
            showLandPermissionsMenu(pl, landId);
            return;
        }
        
        switch (id) {
            case 0:
                showBasicPermissionsForm(pl, landId);
                break;
            case 1:
                showFunctionBlockPermissionsForm(pl, landId);
                break;
            case 2:
                showOtherPermissionsForm(pl, landId);
                break;
        }
    });
}

function showBasicPermissionsForm(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) return;
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}基础权限设置`);
    
    form.addLabel(`${config.appearance.infoColor}配置访客的基础操作权限:`);
    form.addSwitch(`${config.appearance.secondaryColor}允许建造方块`, land.permissions.build || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许破坏方块`, land.permissions.destroy || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许使用桶放置液体`, land.permissions.useBucket || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许使用打火石`, land.permissions.useFlint || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showGlobalPermissionsMenu(pl, landId);
            return;
        }
        
        land.permissions.build = data[1];
        land.permissions.destroy = data[2];
        land.permissions.useBucket = data[3];
        land.permissions.useFlint = data[4];
        
        saveLandsData();
        
        pl.sendModalForm(
            `${config.appearance.highlightColor}设置成功`,
            `${config.appearance.infoColor}基础权限已更新`,
            `${config.appearance.primaryColor}返回`,
            `${config.appearance.secondaryColor}关闭`,
            (p, r) => { if (r) showGlobalPermissionsMenu(p, landId); }
        );
    });
}

function showFunctionBlockPermissionsForm(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) return;
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.secondaryColor}功能方块权限`);
    
    form.addLabel(`${config.appearance.infoColor}配置访客使用功能方块的权限:`);
    form.addSwitch(`${config.appearance.highlightColor}使用容器(箱子/桶/潜影盒)`, land.permissions.useContainers || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用门/活板门/栅栏门`, land.permissions.useDoors || false);
    form.addSwitch(`${config.appearance.primaryColor}使用床`, land.permissions.useBed || false);
    form.addSwitch(`${config.appearance.highlightColor}使用按钮`, land.permissions.useButton || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用拉杆`, land.permissions.useLever || false);
    form.addSwitch(`${config.appearance.primaryColor}使用压力板`, land.permissions.usePressurePlate || false);
    form.addSwitch(`${config.appearance.highlightColor}使用工作台`, land.permissions.useCrafting || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用熔炉/高炉/烟熏炉`, land.permissions.useFurnace || false);
    form.addSwitch(`${config.appearance.primaryColor}使用附魔台`, land.permissions.useEnchant || false);
    form.addSwitch(`${config.appearance.highlightColor}使用铁砧`, land.permissions.useAnvil || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用酿造台`, land.permissions.useBrewing || false);
    form.addSwitch(`${config.appearance.primaryColor}使用信标`, land.permissions.useBeacon || false);
    form.addSwitch(`${config.appearance.highlightColor}使用唱片机/音符盒`, land.permissions.useJukebox || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用讲台`, land.permissions.useLectern || false);
    form.addSwitch(`${config.appearance.primaryColor}使用炼药锅`, land.permissions.useCauldron || false);
    form.addSwitch(`${config.appearance.highlightColor}使用营火`, land.permissions.useCampfire || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用堆肥桶`, land.permissions.useComposter || false);
    form.addSwitch(`${config.appearance.primaryColor}使用重生锚`, land.permissions.useRespawnAnchor || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showGlobalPermissionsMenu(pl, landId);
            return;
        }
        
        let idx = 1;
        land.permissions.useContainers = data[idx++];
        land.permissions.useDoors = data[idx++];
        land.permissions.useBed = data[idx++];
        land.permissions.useButton = data[idx++];
        land.permissions.useLever = data[idx++];
        land.permissions.usePressurePlate = data[idx++];
        land.permissions.useCrafting = data[idx++];
        land.permissions.useFurnace = data[idx++];
        land.permissions.useEnchant = data[idx++];
        land.permissions.useAnvil = data[idx++];
        land.permissions.useBrewing = data[idx++];
        land.permissions.useBeacon = data[idx++];
        land.permissions.useJukebox = data[idx++];
        land.permissions.useLectern = data[idx++];
        land.permissions.useCauldron = data[idx++];
        land.permissions.useCampfire = data[idx++];
        land.permissions.useComposter = data[idx++];
        land.permissions.useRespawnAnchor = data[idx++];
        
        saveLandsData();
        
        pl.sendModalForm(
            `${config.appearance.highlightColor}设置成功`,
            `${config.appearance.infoColor}功能方块权限已更新`,
            `${config.appearance.primaryColor}返回`,
            `${config.appearance.secondaryColor}关闭`,
            (p, r) => { if (r) showGlobalPermissionsMenu(p, landId); }
        );
    });
}

function showOtherPermissionsForm(player, landId) {
    let land = landsData[landId];
    if (!land || !canManageLand(landId, player.xuid)) return;
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.primaryColor}其他权限`);
    
    form.addLabel(`${config.appearance.infoColor}配置访客的其他操作权限:`);
    form.addSwitch(`${config.appearance.highlightColor}攻击动物`, land.permissions.attackAnimals || false);
    form.addSwitch(`${config.appearance.secondaryColor}攻击怪物`, land.permissions.attackMobs || false);
    form.addSwitch(`${config.appearance.primaryColor}攻击玩家(PVP)`, land.permissions.pvp || false);
    form.addSwitch(`${config.appearance.highlightColor}骑乘载具(船/矿车)`, land.permissions.useVehicle || false);
    form.addSwitch(`${config.appearance.secondaryColor}骑乘生物`, land.permissions.rideEntity || false);
    form.addSwitch(`${config.appearance.primaryColor}拾取物品`, land.permissions.pickupItems || false);
    form.addSwitch(`${config.appearance.highlightColor}丢弃物品`, land.permissions.dropItems || false);
    form.addSwitch(`${config.appearance.secondaryColor}射击弓箭/弩/三叉戟`, land.permissions.shoot || false);
    form.addSwitch(`${config.appearance.primaryColor}投掷药水`, land.permissions.throwPotion || false);
    form.addSwitch(`${config.appearance.highlightColor}使用展示框`, land.permissions.useFrames || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用盔甲架`, land.permissions.useArmorStand || false);
    form.addSwitch(`${config.appearance.primaryColor}使用钓鱼竿`, land.permissions.useFishing || false);
    form.addSwitch(`${config.appearance.highlightColor}进食`, land.permissions.eat || false);
    form.addSwitch(`${config.appearance.secondaryColor}获取经验`, land.permissions.exp || false);
    form.addSwitch(`${config.appearance.primaryColor}使用传送门`, land.permissions.usePortal || false);
    
    if (config.protection.enableFlyInLand) {
        form.addSwitch(`${config.appearance.highlightColor}允许飞行`, land.permissions.fly || false);
    }
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showGlobalPermissionsMenu(pl, landId);
            return;
        }
        
        let idx = 1;
        land.permissions.attackAnimals = data[idx++];
        land.permissions.attackMobs = data[idx++];
        land.permissions.pvp = data[idx++];
        land.permissions.useVehicle = data[idx++];
        land.permissions.rideEntity = data[idx++];
        land.permissions.pickupItems = data[idx++];
        land.permissions.dropItems = data[idx++];
        land.permissions.shoot = data[idx++];
        land.permissions.throwPotion = data[idx++];
        land.permissions.useFrames = data[idx++];
        land.permissions.useArmorStand = data[idx++];
        land.permissions.useFishing = data[idx++];
        land.permissions.eat = data[idx++];
        land.permissions.exp = data[idx++];
        land.permissions.usePortal = data[idx++];
        
        if (config.protection.enableFlyInLand) {
            land.permissions.fly = data[idx++];
        }
        
        saveLandsData();
        
        pl.sendModalForm(
            `${config.appearance.highlightColor}设置成功`,
            `${config.appearance.infoColor}其他权限已更新`,
            `${config.appearance.primaryColor}返回`,
            `${config.appearance.secondaryColor}关闭`,
            (p, r) => { if (r) showGlobalPermissionsMenu(p, landId); }
        );
    });
}
function showMemberPermissionsSelectMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    if (!land.members || Object.keys(land.members).length === 0) {
        player.tell(`${config.appearance.warningColor}这个领地没有成员`);
        showLandPermissionsMenu(player, landId);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.secondaryColor}选择成员`);
    form.setContent(`${config.appearance.infoColor}选择要设置权限的成员：`);
    
    let memberXuids = [];
    for (let memberXuid in land.members) {
        let member = land.members[memberXuid];
        let permLevel = member.permLevel || 1;
        
        form.addButton(`${config.appearance.highlightColor}${member.name}\n${config.appearance.infoColor}权限等级: ${permLevel}`, "textures/ui/dressing_room_skins");
        memberXuids.push(memberXuid);
    }
    
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === memberXuids.length) {
            showLandPermissionsMenu(pl, landId);
            return;
        }
        
        if (id < memberXuids.length) {
            let memberXuid = memberXuids[id];
            showMemberPermissionsMenu(pl, landId, memberXuid);
        }
    });
}
function showMemberPermissionsMenu(player, landId, memberXuid) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    if (!land.members || !land.members[memberXuid]) {
        player.tell(`${config.appearance.warningColor}该成员不存在`);
        return;
    }
    
    let member = land.members[memberXuid];
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.primaryColor}成员权限: ${member.name}`);
    
    form.addSwitch(`${config.appearance.secondaryColor}允许建造`, member.permissions.build || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许破坏`, member.permissions.destroy || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许交互`, member.permissions.interact || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用容器`, member.permissions.useContainers || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用门`, member.permissions.useDoors || false);
    form.addSwitch(`${config.appearance.secondaryColor}使用红石`, member.permissions.useRedstone || false);
    form.addSwitch(`${config.appearance.secondaryColor}攻击实体`, member.permissions.attackEntities || false);
    form.addSwitch(`${config.appearance.secondaryColor}PVP`, member.permissions.pvp || false);
    form.addSwitch(`${config.appearance.secondaryColor}物品使用`, member.permissions.itemUse || false);
    form.addSwitch(`${config.appearance.secondaryColor}传送`, member.permissions.teleport || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showMemberPermissionsSelectMenu(pl, landId);
            return;
        }
        
        member.permissions.build = data[0];
        member.permissions.destroy = data[1];
        member.permissions.interact = data[2];
        member.permissions.useContainers = data[3];
        member.permissions.useDoors = data[4];
        member.permissions.useRedstone = data[5];
        member.permissions.attackEntities = data[6];
        member.permissions.pvp = data[7];
        member.permissions.itemUse = data[8];
        member.permissions.teleport = data[9];
        
        saveLandsData();
        
        pl.tell(`${config.appearance.highlightColor}已更新 ${member.name} 的权限`);
        showMemberPermissionsSelectMenu(pl, landId);
    });
}
function showAddWarpMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let warpCount = land.warps ? Object.keys(land.warps).length : 0;
    if (warpCount >= 10) {
        player.tell(`${config.appearance.warningColor}传送点数量已达上限`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}添加传送点: ${land.name}`);
    
    form.addLabel(`${config.appearance.infoColor}设置传送点信息`);
    form.addInput(`${config.appearance.secondaryColor}传送点名称`, "warp");
    form.addSwitch(`${config.appearance.secondaryColor}公开传送点`, true);
    form.addSwitch(`${config.appearance.secondaryColor}使用当前位置`, true);
    
    let pos = player.pos;
    form.addInput(`${config.appearance.secondaryColor}X坐标`, `${Math.floor(pos.x)}`, `${Math.floor(pos.x)}`);
    form.addInput(`${config.appearance.secondaryColor}Y坐标`, `${Math.floor(pos.y)}`, `${Math.floor(pos.y)}`);
    form.addInput(`${config.appearance.secondaryColor}Z坐标`, `${Math.floor(pos.z)}`, `${Math.floor(pos.z)}`);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showWarpManagementMenu(pl, landId);
            return;
        }
        
        let warpName = data[1];
        let isPublic = data[2];
        let useCurrentPos = data[3];
        
        if (!warpName || warpName.trim() === "") {
            pl.tell(`${config.appearance.warningColor}传送点名称不能为空`);
            return;
        }
        
        let result = addLandWarp(landId, pl.xuid, warpName, useCurrentPos ? pl.pos : {
            x: parseFloat(data[4]) || pl.pos.x,
            y: parseFloat(data[5]) || pl.pos.y,
            z: parseFloat(data[6]) || pl.pos.z,
            dimid: pl.pos.dimid
        }, isPublic);
        
        pl.tell(result.success ? `${config.appearance.highlightColor}${result.message}` : `${config.appearance.warningColor}${result.message}`);
        showWarpManagementMenu(pl, landId);
    });
}
function showRemoveWarpMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    if (!land.warps || Object.keys(land.warps).length === 0) {
        player.tell(`${config.appearance.warningColor}这个领地没有传送点`);
        showWarpManagementMenu(player, landId);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.warningColor}删除传送点`);
    form.setContent(`${config.appearance.infoColor}选择要删除的传送点：`);
    
    let warpList = Object.keys(land.warps);
    for (let i = 0; i < warpList.length; i++) {
        let warpName = warpList[i];
        let warp = land.warps[warpName];
        form.addButton(`${config.appearance.warningColor}${warpName}\n${config.appearance.infoColor}${warp.isPublic ? "公开" : "私密"}`, "textures/ui/trash_icon");
    }
    
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === warpList.length) {
            showWarpManagementMenu(pl, landId);
            return;
        }
        
        let warpName = warpList[id];
        let result = removeLandWarp(landId, pl.xuid, warpName);
        pl.tell(result.success ? `${config.appearance.highlightColor}${result.message}` : `${config.appearance.warningColor}${result.message}`);
        showWarpManagementMenu(pl, landId);
    });
}
function showDeleteLandConfirmation(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (land.owner !== player.xuid && !isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你不是这块领地的主人`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.warningColor}删除领地`);
    form.setContent(`${config.appearance.infoColor}确定要删除领地 "${land.name}" 吗？\n\n${config.appearance.warningColor}这个操作不可逆！`);
    form.addButton(`${config.appearance.warningColor}确认删除`, "textures/ui/trash_icon");
    form.addButton(`${config.appearance.highlightColor}取消`, "textures/ui/cancel");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 1) {
            showFastLandManager(pl, landId);
            return;
        }
        
        if (id === 0) {
            removeFromIndex(landId);
            delete landsData[landId];
            saveLandsData();
            
            pl.tell(`${config.appearance.highlightColor}已删除领地 "${land.name}"`);
            
            pl.sendToast(`${config.appearance.warningColor}领地已删除`, `${land.name} 已被删除`);
            
            showMyLandsMenu(pl);
        }
    });
}
function showLandMembersMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let memberCount = land.members ? Object.keys(land.members).length : 0;
    let applicationCount = getApplicationCount(landId);
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}成员管理: ${land.name}`);
    
    let content = `${config.appearance.infoColor}当前成员数: ${config.appearance.highlightColor}${memberCount}/${config.limits.maxMembers}`;
    if (applicationCount > 0) {
        content += `\n${config.appearance.warningColor}待处理申请: ${config.appearance.highlightColor}${applicationCount}`;
    }
    content += `\n\n${config.appearance.infoColor}选择操作:`;
    form.setContent(content);
    
    let buttons = [];
    
    form.addButton(`${config.appearance.highlightColor}添加成员`, "textures/ui/color_plus");
    buttons.push("add");
    
    if (applicationCount > 0) {
        form.addButton(`${config.appearance.primaryColor}查看申请 (${applicationCount})\n${config.appearance.infoColor}处理加入申请`, "textures/ui/invite_base");
        buttons.push("applications");
    }
    
    if (memberCount > 0) {
        form.addButton(`${config.appearance.warningColor}移除成员`, "textures/ui/trash_icon");
        buttons.push("remove");
        form.addButton(`${config.appearance.primaryColor}管理权限组`, "textures/ui/permissions_member_star");
        buttons.push("permissions");
    }
    
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    buttons.push("back");
    
    player.sendForm(form, (pl, id) => {
        if (id === null) {
            showFastLandManager(pl, landId);
            return;
        }
        
        let action = buttons[id];
        switch (action) {
            case "add":
                showAddMemberMenu(pl, landId);
                break;
            case "applications":
                showApplicationsListMenu(pl, landId);
                break;
            case "remove":
                showRemoveMemberMenu(pl, landId);
                break;
            case "permissions":
                showMemberPermissionGroupMenu(pl, landId);
                break;
            case "back":
                showFastLandManager(pl, landId);
                break;
        }
    });
}
function showAddMemberMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let memberCount = land.members ? Object.keys(land.members).length : 0;
    if (memberCount >= config.limits.maxMembers) {
        player.tell(`${config.appearance.warningColor}成员数量已达上限 (${config.limits.maxMembers})`);
        return;
    }
    
    let availablePlayers = mc.getOnlinePlayers().filter(p => {
        if (p.xuid === land.owner) return false;
        if (land.members && land.members[p.xuid]) return false;
        return true;
    });
    
    if (availablePlayers.length === 0) {
        player.tell(`${config.appearance.warningColor}没有可添加的在线玩家`);
        showLandMembersMenu(player, landId);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}添加成员: ${land.name}`);
    
    let playerNames = availablePlayers.map(p => p.name);
    form.addDropdown(`${config.appearance.infoColor}选择玩家`, playerNames, 0);
    
    let permLevels = ["访客(仅基本权限)", "成员(建造/破坏/容器)", "管理员(完整权限)"];
    form.addDropdown(`${config.appearance.secondaryColor}权限等级`, permLevels, 1);
    
    form.addLabel(`${config.appearance.infoColor}成员默认拥有建造、破坏、容器访问等权限\n管理员可使用更多功能\n访客仅有基本访问权限`);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showLandMembersMenu(pl, landId);
            return;
        }
        
        let selectedPlayer = availablePlayers[data[0]];
        let permLevel = data[1] + 1;
        
        if (addLandMember(landId, pl.xuid, selectedPlayer.xuid, selectedPlayer.realName, permLevel)) {
            pl.tell(`${config.appearance.highlightColor}已添加 ${selectedPlayer.realName} 为领地成员`);
        } else {
            pl.tell(`${config.appearance.warningColor}添加成员失败`);
        }
        
        showLandMembersMenu(pl, landId);
    });
}
function showRemoveMemberMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    if (!land.members || Object.keys(land.members).length === 0) {
        player.tell(`${config.appearance.warningColor}这个领地没有成员`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.warningColor}移除成员: ${land.name}`);
    form.setContent(`${config.appearance.infoColor}选择要移除的成员：`);
    
    let memberXuids = [];
    for (let memberXuid in land.members) {
        let member = land.members[memberXuid];
        let permLevel = member.permLevel || 1;
        let levelNames = ["访客", "成员", "管理员"];
        
        form.addButton(`${config.appearance.warningColor}${member.name}\n${config.appearance.infoColor}权限等级: ${levelNames[permLevel - 1]}`, "textures/ui/player_offline_icon");
        memberXuids.push(memberXuid);
    }
    
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === memberXuids.length) {
            showLandMembersMenu(pl, landId);
            return;
        }
        
        let targetXuid = memberXuids[id];
        let targetName = land.members[targetXuid].name;
        
        if (removeLandMember(landId, pl.xuid, targetXuid)) {
            pl.tell(`${config.appearance.highlightColor}已移除成员 ${targetName}`);
        } else {
            pl.tell(`${config.appearance.warningColor}移除成员失败`);
        }
        
        showLandMembersMenu(pl, landId);
    });
}
function showMemberPermissionGroupMenu(player, landId) {
    let land = landsData[landId];
    if (!land || !land.members) {
        player.tell(`${config.appearance.warningColor}领地不存在或没有成员`);
        return;
    }
    
    if (!canManageLand(landId, player.xuid)) {
        player.tell(`${config.appearance.warningColor}你没有权限管理这个领地`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}权限组管理: ${land.name}`);
    
    let memberXuids = Object.keys(land.members);
    
    let content = `${config.appearance.infoColor}选择要修改权限组的成员：\n\n`;
    form.setContent(content);
    
    for (let i = 0; i < memberXuids.length; i++) {
        let member = land.members[memberXuids[i]];
        let groupName = member.permissionGroup || "member";
        let displayName = config.permissionGroups[groupName] ? config.permissionGroups[groupName].name : groupName;
        
        form.addButton(`${config.appearance.highlightColor}${member.name}\n${config.appearance.infoColor}当前: ${displayName}`, "textures/ui/dressing_room_skins");
    }
    
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === memberXuids.length) {
            showLandMembersMenu(pl, landId);
            return;
        }
        
        showMemberGroupSelectMenu(pl, landId, memberXuids[id]);
    });
}
function showMemberGroupSelectMenu(player, landId, memberXuid) {
    let land = landsData[landId];
    if (!land || !land.members || !land.members[memberXuid]) {
        player.tell(`${config.appearance.warningColor}成员不存在`);
        return;
    }
    
    let member = land.members[memberXuid];
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.secondaryColor}设置权限组: ${member.name}`);
    form.setContent(`${config.appearance.infoColor}选择新的权限组：`);
    
    let groupNames = Object.keys(config.permissionGroups);
    for (let i = 0; i < groupNames.length; i++) {
        let group = config.permissionGroups[groupNames[i]];
        let isCurrent = member.permissionGroup === groupNames[i];
        form.addButton(`${isCurrent ? config.appearance.highlightColor : config.appearance.secondaryColor}${group.name}${isCurrent ? " (当前)" : ""}`, "textures/ui/permissions_member_star");
    }
    
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === groupNames.length) {
            showMemberPermissionGroupMenu(pl, landId);
            return;
        }
        
        let result = setMemberPermissionGroup(landId, pl.xuid, memberXuid, groupNames[id]);
        pl.tell(result.success ? `${config.appearance.highlightColor}${result.message}` : `${config.appearance.warningColor}${result.message}`);
        showMemberPermissionGroupMenu(pl, landId);
    });
}
function showUpgradeTo2DConfirmation(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    if (land.owner !== player.xuid && !isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你不是这个领地的所有者`);
        return;
    }
    
    if (land.is2D) {
        player.tell(`${config.appearance.warningColor}这个领地已经是2D领地了`);
        return;
    }
    let volume3D = calculateSelectionVolume({
        pos1: land.pos1,
        pos2: land.pos2
    }, false);
    
    let volume2D = calculateSelectionVolume({
        pos1: land.pos1,
        pos2: land.pos2
    }, true);
    
    let price3D = calculateLandPrice(volume3D, false);
    let price2D = calculateLandPrice(volume2D, true);
    let upgradeCost = Math.max(0, price2D - price3D);
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}升级领地`);
    form.setContent(`${config.appearance.infoColor}将领地 "${land.name}" 从3D升级到2D？\n\n` +
                   `${config.appearance.secondaryColor}升级费用: ${config.appearance.infoColor}${upgradeCost}\n` +
                   `${config.appearance.highlightColor}升级后，领地将保护整个Y轴范围，而不仅仅是当前的高度范围。\n` +
                   `${config.appearance.warningColor}注意：这是扩大保护范围的升级，而非降级。`);
    form.addButton(`${config.appearance.highlightColor}确认升级`, "textures/ui/oozing_effect");
    form.addButton(`${config.appearance.warningColor}取消`, "textures/ui/cancel");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 1) {
            showFastLandManager(pl, landId);
            return;
        }
        
        if (id === 0) {
            if (isLandAdmin(pl)) {
                pl.tell(`${config.appearance.infoColor}[管理员] 免费升级领地`);
            } else {
                let balance = getBalance(pl.xuid);
                if (balance < upgradeCost) {
                    pl.tell(`${config.appearance.warningColor}余额不足，需要 ${upgradeCost}，当前余额 ${balance}`);
                    return;
                }
                if (!reduceMoney(pl.xuid, upgradeCost)) {
                    pl.tell(`${config.appearance.warningColor}扣除余额失败`);
                    return;
                }
            }
            land.is2D = true;
            saveLandsData();
            
            pl.tell(`${config.appearance.highlightColor}已将领地 "${land.name}" 升级为2D领地`);
            
            pl.sendToast(`${config.appearance.highlightColor}领地升级成功`, `${land.name} 已升级为2D领地`);
            
            showFastLandManager(pl, landId);
        }
    });
}

function showAdminMenu(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此功能`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}管理员面板`);
    form.setContent(`${config.appearance.infoColor}选择管理类型:`);
    
    form.addButton(`${config.appearance.highlightColor}领地管理\n${config.appearance.infoColor}管理所有领地`, "textures/ui/worldsIcon");
    form.addButton(`${config.appearance.secondaryColor}插件配置\n${config.appearance.infoColor}系统参数设置`, "textures/ui/icon_setting");
    form.addButton(`${config.appearance.primaryColor}监听器管理\n${config.appearance.infoColor}事件保护开关`, "textures/ui/icon_bookshelf");
    form.addButton(`${config.appearance.warningColor}关闭`, "textures/ui/cancel");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 3) return;
        
        switch (id) {
            case 0:
                showAdminLandManageMenu(pl);
                break;
            case 1:
                showAdminPluginConfigMenu(pl);
                break;
            case 2:
                showAdminListenerMenu(pl);
                break;
        }
    });
}

function showAdminLandManageMenu(player) {
    if (!isLandAdmin(player)) return;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}领地管理`);
    form.setContent(`${config.appearance.infoColor}选择管理方式:`);
    
    form.addButton(`${config.appearance.highlightColor}按玩家管理\n${config.appearance.infoColor}选择玩家查看其领地`, "textures/ui/dressing_room_skins");
    form.addButton(`${config.appearance.secondaryColor}按领地管理\n${config.appearance.infoColor}查看所有领地列表`, "textures/ui/worldsIcon");
    form.addButton(`${config.appearance.primaryColor}脚下领地\n${config.appearance.infoColor}管理当前所在领地`, "textures/ui/icon_recipe_equipment");
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 3) {
            showAdminMenu(pl);
            return;
        }
        
        switch (id) {
            case 0:
                showAdminSelectPlayerMenu(pl);
                break;
            case 1:
                showAdminAllLandsListMenu(pl);
                break;
            case 2:
                let pos = pl.blockPos;
                let landId = getLandAtPos(pos);
                if (landId) {
                    showAdminLandActionMenu(pl, landId);
                } else {
                    pl.tell(`${config.appearance.warningColor}你当前不在任何领地内`);
                    showAdminLandManageMenu(pl);
                }
                break;
        }
    });
}

function showAdminSelectPlayerMenu(player) {
    if (!isLandAdmin(player)) return;
    
    let playerLands = {};
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.parentId) continue;
        let ownerXuid = land.owner;
        if (!playerLands[ownerXuid]) {
            playerLands[ownerXuid] = {
                name: land.ownerName || "未知玩家",
                count: 0
            };
        }
        playerLands[ownerXuid].count++;
    }
    
    let playerList = Object.keys(playerLands);
    
    if (playerList.length === 0) {
        player.tell(`${config.appearance.warningColor}当前没有任何领地`);
        showAdminLandManageMenu(player);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}选择玩家`);
    form.setContent(`${config.appearance.infoColor}选择要管理的玩家:`);
    
    for (let xuid of playerList) {
        let info = playerLands[xuid];
        form.addButton(`${config.appearance.highlightColor}${info.name}\n${config.appearance.infoColor}领地数: ${info.count}`, "textures/ui/icon_steve");
    }
    
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === playerList.length) {
            showAdminLandManageMenu(pl);
            return;
        }
        
        let targetXuid = playerList[id];
        showAdminPlayerLandsMenu(pl, targetXuid, playerLands[targetXuid].name);
    });
}

function showAdminPlayerLandsMenu(player, targetXuid, targetName) {
    if (!isLandAdmin(player)) return;
    
    let lands = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.owner === targetXuid && !land.parentId) {
            lands.push({ id: landId, land: land });
        }
    }
    
    if (lands.length === 0) {
        player.tell(`${config.appearance.warningColor}该玩家没有领地`);
        showAdminSelectPlayerMenu(player);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}${targetName} 的领地`);
    form.setContent(`${config.appearance.infoColor}选择要管理的领地:`);
    
    for (let item of lands) {
        let land = item.land;
        let type = land.is2D ? "2D" : "3D";
        let dim = land.dimName || getDimensionName(land.dim);
        form.addButton(`${config.appearance.highlightColor}${land.name}\n${config.appearance.infoColor}${type} | ${dim}`, "textures/ui/worldsIcon");
    }
    
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === lands.length) {
            showAdminSelectPlayerMenu(pl);
            return;
        }
        
        showAdminLandActionMenu(pl, lands[id].id);
    });
}

function showAdminAllLandsListMenu(player, page = 0) {
    if (!isLandAdmin(player)) return;
    
    let allLands = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.parentId) continue;
        allLands.push({
            id: landId,
            name: land.name,
            ownerName: land.ownerName || "未知",
            type: land.is2D ? "2D" : "3D",
            dim: land.dimName || getDimensionName(land.dim)
        });
    }
    
    if (allLands.length === 0) {
        player.tell(`${config.appearance.warningColor}当前没有任何领地`);
        showAdminLandManageMenu(player);
        return;
    }
    
    const perPage = 10;
    let totalPages = Math.ceil(allLands.length / perPage);
    let startIdx = page * perPage;
    let endIdx = Math.min(startIdx + perPage, allLands.length);
    let currentPageLands = allLands.slice(startIdx, endIdx);
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.highlightColor}所有领地 (${page + 1}/${totalPages})`);
    form.setContent(`${config.appearance.infoColor}共 ${allLands.length} 块领地，选择要管理的领地:`);
    
    for (let item of currentPageLands) {
        form.addButton(`${config.appearance.highlightColor}${item.name}\n${config.appearance.infoColor}${item.type} ${item.dim} | ${item.ownerName}`, "textures/ui/worldsIcon");
    }
    
    if (page > 0) {
        form.addButton(`${config.appearance.secondaryColor}上一页`, "textures/ui/arrow_left");
    }
    if (page < totalPages - 1) {
        form.addButton(`${config.appearance.primaryColor}下一页`, "textures/ui/arrow_right");
    }
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null) {
            showAdminLandManageMenu(pl);
            return;
        }
        
        if (id < currentPageLands.length) {
            showAdminLandActionMenu(pl, currentPageLands[id].id);
            return;
        }
        
        let btnIdx = currentPageLands.length;
        if (page > 0 && id === btnIdx) {
            showAdminAllLandsListMenu(pl, page - 1);
            return;
        }
        if (page > 0) btnIdx++;
        
        if (page < totalPages - 1 && id === btnIdx) {
            showAdminAllLandsListMenu(pl, page + 1);
            return;
        }
        
        showAdminLandManageMenu(pl);
    });
}

function showAdminLandActionMenu(player, landId) {
    if (!isLandAdmin(player)) return;
    
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        showAdminLandManageMenu(player);
        return;
    }
    
    player.sendModalForm(
        `${config.appearance.primaryColor}领地操作`,
        `${config.appearance.infoColor}领地: ${config.appearance.highlightColor}${land.name}\n${config.appearance.secondaryColor}所有者: ${config.appearance.infoColor}${land.ownerName}\n\n${config.appearance.infoColor}选择操作方式:`,
        `${config.appearance.highlightColor}作为领主管理`,
        `${config.appearance.primaryColor}传送到领地`,
        (pl, result) => {
            if (result) {
                showFastLandManager(pl, landId);
            } else {
                teleportToLand(pl, landId);
            }
        }
    );
}

function showAdminPluginConfigMenu(player) {
    if (!isLandAdmin(player)) return;
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.secondaryColor}插件配置`);
    form.setContent(`${config.appearance.infoColor}选择要配置的项目:`);
    
    form.addButton(`${config.appearance.highlightColor}基础设置\n${config.appearance.infoColor}经济/限制/功能`, "textures/ui/glyph_mashup_pack");
    form.addButton(`${config.appearance.secondaryColor}价格设置\n${config.appearance.infoColor}领地和功能价格`, "textures/ui/MCoin");
    form.addButton(`${config.appearance.primaryColor}保护设置\n${config.appearance.infoColor}默认保护功能`, "textures/ui/lock_color");
    form.addButton(`${config.appearance.highlightColor}默认权限\n${config.appearance.infoColor}访客默认权限`, "textures/ui/permissions_member_star");
    form.addButton(`${config.appearance.warningColor}税收系统\n${config.appearance.infoColor}领地税收配置`, "textures/ui/MCoin");
    form.addButton(`${config.appearance.secondaryColor}可视化设置\n${config.appearance.infoColor}显示效果配置`, "textures/ui/icon_fall");
    form.addButton(`${config.appearance.warningColor}重载配置\n${config.appearance.infoColor}重新加载配置`, "textures/ui/refresh_light");
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 7) {
            showAdminMenu(pl);
            return;
        }
        
        switch (id) {
            case 0:
                showBasicConfigMenu(pl);
                break;
            case 1:
                showPriceConfigMenu(pl);
                break;
            case 2:
                showProtectionConfigMenu(pl);
                break;
            case 3:
                showDefaultPermissionsConfigMenu(pl);
                break;
            case 4:
                showTaxConfigMenu(pl);
                break;
            case 5:
                showVisualizerConfigMenu(pl);
                break;
            case 6:
                reloadPluginConfig(pl);
                break;
        }
    });
}

function showAdminListenerMenu(player) {
    if (!isLandAdmin(player)) return;
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.primaryColor}事件监听器管理`);
    form.addLabel(`${config.appearance.infoColor}配置领地保护事件的启用状态:`);
    
    form.addSwitch(`${config.appearance.secondaryColor}阻止方块破坏`, config.protection.preventExplosions !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止方块放置`, config.protection.preventTNT !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止物品使用`, config.protection.preventFireSpread !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止实体攻击`, config.protection.preventCreeper !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止爆炸`, config.protection.preventExplosions !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止TNT爆炸`, config.protection.preventTNT !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止重生锚爆炸`, config.protection.preventRespawnAnchorExplode !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止物品拾取`, config.defaultPermissions.pickupItems !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止物品丢弃`, config.defaultPermissions.dropItems !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止方块交互`, config.defaultPermissions.interact !== true);
    form.addSwitch(`${config.appearance.secondaryColor}阻止展示框使用`, config.protection.preventFrameInteract !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止弹射物生成`, config.protection.preventProjectileSpawn || false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止压力板触发`, config.protection.preventPressurePlate || false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止骑乘`, config.protection.preventRide || false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止凋零破坏`, config.protection.preventExplosions !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止耕地踩踏`, config.protection.preventFarmlandDecay !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止活塞推动`, config.protection.preventPistonPush !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止火焰蔓延`, config.protection.preventFireSpread !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止盔甲架操作`, config.protection.preventArmorStandChange !== false);
    form.addSwitch(`${config.appearance.secondaryColor}阻止进食`, config.defaultPermissions.itemUse !== true);
    form.addSwitch(`${config.appearance.secondaryColor}阻止红石更新`, config.protection.preventRedstoneUpdate || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showAdminMenu(pl);
            return;
        }
        
        pl.sendModalForm(
            `${config.appearance.highlightColor}完成`,
            `${config.appearance.infoColor}事件监听器配置已更新`,
            `${config.appearance.primaryColor}返回`,
            `${config.appearance.secondaryColor}关闭`,
            (p, r) => { if (r) showAdminMenu(p); }
        );
    });
}
function showBasicConfigMenu(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此功能`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}基础设置`);
    
    form.addLabel(`${config.appearance.infoColor}配置经济系统、限制和飞行功能：`);
    let ecoTypes = ["LLMoney", "计分板"];
    let currentType = config.economy.type === "scoreboard" ? 1 : 0;
    
    form.addDropdown(`${config.appearance.secondaryColor}经济系统类型`, ecoTypes, currentType);
    form.addInput(`${config.appearance.secondaryColor}计分板经济记分项`, "money", config.economy.scoreboardObj || "money");
    form.addLabel(`${config.appearance.highlightColor}领地限制设置：`);
    form.addInput(`${config.appearance.secondaryColor}每玩家最大领地数`, "5", String(config.limits.maxLandsPerPlayer));
    form.addInput(`${config.appearance.secondaryColor}每领地最大大小(方块数)`, "10000", String(config.limits.maxSizePerLand));
    form.addInput(`${config.appearance.secondaryColor}领地最小大小(方块数)`, "100", String(config.limits.minSize));
    form.addInput(`${config.appearance.secondaryColor}每领地最大成员数`, "10", String(config.limits.maxMembers));
    form.addInput(`${config.appearance.secondaryColor}世界最小高度`, "-64", String(config.limits.worldHeightMin));
    form.addInput(`${config.appearance.secondaryColor}世界最大高度`, "320", String(config.limits.worldHeightMax));
    form.addLabel(`${config.appearance.highlightColor}领地拓展保护设置：`);
    form.addInput(`${config.appearance.secondaryColor}领地边界外保护范围(方块)`, "0", String(config.protection.protectionRange));
    form.addLabel(`${config.appearance.highlightColor}功能开关设置：`);
    form.addSwitch(`${config.appearance.primaryColor}启用子领地功能`, config.limits.enableSubLand !== false);
    form.addSwitch(`${config.appearance.secondaryColor}启用领地飞行功能`, config.protection.enableFlyInLand !== false);
    form.addSwitch(`${config.appearance.warningColor}仅OP可创建领地`, config.limits.onlyOpCanCreateLand || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showAdminMenu(pl);
            return;
        }
        let ecoTypeIndex = data[1];
        let scoreboardObj = data[2];
        
        let maxLandsPerPlayer = parseInt(data[4]);
        let maxSizePerLand = parseInt(data[5]);
        let minSize = parseInt(data[6]);
        let maxMembers = parseInt(data[7]);
        let worldHeightMin = parseInt(data[8]);
        let worldHeightMax = parseInt(data[9]);
        
        let protectionRange = parseInt(data[11]);
        
        let enableSubLand = data[13];
        let enableFlyInLand = data[14];
        let onlyOpCanCreateLand = data[15];
        config.economy.type = ecoTypeIndex === 1 ? "scoreboard" : "llmoney";
        config.economy.scoreboardObj = scoreboardObj || "money";
        if (isNaN(maxLandsPerPlayer) || maxLandsPerPlayer < 1) maxLandsPerPlayer = 5;
        if (isNaN(maxSizePerLand) || maxSizePerLand < 100) maxSizePerLand = 10000;
        if (isNaN(minSize) || minSize < 1) minSize = 100;
        if (isNaN(maxMembers) || maxMembers < 1) maxMembers = 10;
        if (isNaN(worldHeightMin)) worldHeightMin = -64;
        if (isNaN(worldHeightMax)) worldHeightMax = 320;
        if (worldHeightMin >= worldHeightMax) {
            worldHeightMin = -64;
            worldHeightMax = 320;
        }
        
        if (isNaN(protectionRange) || protectionRange < 0) protectionRange = 0;
        config.limits.maxLandsPerPlayer = maxLandsPerPlayer;
        config.limits.maxSizePerLand = maxSizePerLand;
        config.limits.minSize = minSize;
        config.limits.maxMembers = maxMembers;
        config.limits.worldHeightMin = worldHeightMin;
        config.limits.worldHeightMax = worldHeightMax;
        
        config.limits.enableSubLand = enableSubLand;
        config.limits.onlyOpCanCreateLand = onlyOpCanCreateLand;
        config.protection.protectionRange = protectionRange;
        config.protection.enableFlyInLand = enableFlyInLand;
        
        saveConfig();
        
        pl.tell(`${config.appearance.highlightColor}基础设置已更新`);
        showAdminMenu(pl);
    });
}
function showPriceConfigMenu(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此功能`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.secondaryColor}价格配置`);
    
    form.addLabel(`${config.appearance.infoColor}注意：2D领地包含整个Y轴范围，通常比3D领地更贵`);
    form.addInput(`${config.appearance.highlightColor}2D领地基础价格`, "3000", String(config.prices.base2D));
    form.addInput(`${config.appearance.highlightColor}3D领地基础价格`, "1000", String(config.prices.base3D));
    form.addInput(`${config.appearance.secondaryColor}2D领地每方块价格`, "1.0", String(config.prices.perBlock2D));
    form.addInput(`${config.appearance.secondaryColor}3D领地每方块价格`, "0.2", String(config.prices.perBlock3D));
    form.addInput(`${config.appearance.infoColor}大领地最大折扣`, "0.5", String(config.prices.maxDiscount));
    form.addInput(`${config.appearance.warningColor}折扣起始方块数`, "5000", String(config.prices.blockPriceDecreaseThreshold));
    form.addInput(`${config.appearance.secondaryColor}最低价格`, "100", String(config.prices.minPrice));
    form.addInput(`${config.appearance.primaryColor}额外成员价格`, "50", String(config.prices.additionalMemberCost));
    form.addInput(`${config.appearance.warningColor}升级倍数`, "1.5", String(config.prices.upgradeMultiplier));
    form.addLabel(`${config.appearance.highlightColor}飞行相关价格：`);
    form.addInput(`${config.appearance.secondaryColor}永久飞行权限价格`, "1000", String(config.prices.flightPermCost));
    form.addInput(`${config.appearance.secondaryColor}飞行时长价格`, "100", String(config.prices.flightTimeCost || 100));
    form.addInput(`${config.appearance.secondaryColor}飞行时长(小时)`, "1", String(config.prices.flightTimeDuration || 1));
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showAdminMenu(pl);
            return;
        }
        let base2D = parseFloat(data[1]);
        let base3D = parseFloat(data[2]);
        let perBlock2D = parseFloat(data[3]);
        let perBlock3D = parseFloat(data[4]);
        let maxDiscount = parseFloat(data[5]);
        let discountThreshold = parseInt(data[6]);
        let minPrice = parseInt(data[7]);
        let memberCost = parseInt(data[8]);
        let upgradeMultiplier = parseFloat(data[9]);
        let flightPermCost = parseInt(data[11]);
        let flightTimeCost = parseInt(data[12]);
        let flightTimeDuration = parseFloat(data[13]);
        if (isNaN(base2D) || base2D < 0) base2D = 3000;
        if (isNaN(base3D) || base3D < 0) base3D = 1000;
        if (isNaN(perBlock2D) || perBlock2D < 0) perBlock2D = 1.0;
        if (isNaN(perBlock3D) || perBlock3D < 0) perBlock3D = 0.2;
        if (isNaN(maxDiscount) || maxDiscount < 0 || maxDiscount > 1) maxDiscount = 0.5;
        if (isNaN(discountThreshold) || discountThreshold < 0) discountThreshold = 5000;
        if (isNaN(minPrice) || minPrice < 0) minPrice = 100;
        if (isNaN(memberCost) || memberCost < 0) memberCost = 50;
        if (isNaN(upgradeMultiplier) || upgradeMultiplier < 0) upgradeMultiplier = 1.5;
        if (isNaN(flightPermCost)) flightPermCost = 1000;
        if (flightPermCost < 0) flightPermCost = 0;
        if (isNaN(flightTimeCost)) flightTimeCost = 100;
        if (flightTimeCost < 0) flightTimeCost = 0;
        if (isNaN(flightTimeDuration) || flightTimeDuration <= 0) flightTimeDuration = 1;
        config.prices.base2D = base2D;
        config.prices.base3D = base3D;
        config.prices.perBlock2D = perBlock2D;
        config.prices.perBlock3D = perBlock3D;
        config.prices.maxDiscount = maxDiscount;
        config.prices.blockPriceDecreaseThreshold = discountThreshold;
        config.prices.minPrice = minPrice;
        config.prices.additionalMemberCost = memberCost;
        config.prices.upgradeMultiplier = upgradeMultiplier;
        config.prices.flightPermCost = flightPermCost;
        config.prices.flightTimeCost = flightTimeCost;
        config.prices.flightTimeDuration = flightTimeDuration;
        
        saveConfig();
        
        pl.tell(`${config.appearance.highlightColor}价格配置已更新`);
        showAdminMenu(pl);
    });
}
function showProtectionConfigMenu(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此功能`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.secondaryColor}领地保护默认设置`);
    
    form.addLabel(`${config.appearance.infoColor}配置新建领地的默认保护功能：`);
    
    form.addSwitch(`${config.appearance.warningColor}阻止爆炸`, config.protection.preventExplosions !== false);
    form.addSwitch(`${config.appearance.warningColor}阻止TNT`, config.protection.preventTNT !== false);
    form.addSwitch(`${config.appearance.warningColor}阻止苦力怕爆炸`, config.protection.preventCreeper !== false);
    form.addSwitch(`${config.appearance.warningColor}阻止火焰蔓延`, config.protection.preventFireSpread !== false);
    form.addSwitch(`${config.appearance.warningColor}阻止怪物生成`, config.protection.preventMobSpawning || false);
    form.addSwitch(`${config.appearance.warningColor}阻止活塞推动`, config.protection.preventPistonPush !== false);
    form.addSwitch(`${config.appearance.warningColor}阻止液体流动`, config.protection.preventLiquidFlow !== false);
    form.addSwitch(`${config.appearance.warningColor}防止耕地退化`, config.protection.preventFarmlandDecay !== false);
    form.addSwitch(`${config.appearance.warningColor}防止树叶腐烂`, config.protection.preventLeafDecay || false);
    form.addSwitch(`${config.appearance.warningColor}防止冰块融化`, config.protection.preventIceMelt !== false);
    form.addSwitch(`${config.appearance.warningColor}防止雪融化`, config.protection.preventSnowMelt !== false);
    form.addSwitch(`${config.appearance.warningColor}防止珊瑚死亡`, config.protection.preventCoralsFromDying !== false);
    form.addSwitch(`${config.appearance.warningColor}禁止使用骨粉`, config.protection.preventBoneMeal || false);
    form.addSwitch(`${config.appearance.warningColor}防止钓鱼竿钓人`, config.protection.fishingProtection !== false);
    form.addSwitch(`${config.appearance.highlightColor}允许玩家进入领地`, config.protection.allowPlayerEntry !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止末影人搬运方块`, config.protection.preventEndermanTake !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止重生锚爆炸`, config.protection.preventRespawnAnchorExplode !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止漏斗吸取物品`, config.protection.preventHopperInput || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止漏斗输出物品`, config.protection.preventHopperOutput || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止红石信号传入`, config.protection.preventRedstoneUpdate || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止命令方块执行`, config.protection.preventCmdBlockExecute !== false);
    form.addSwitch(`${config.appearance.secondaryColor}记录容器操作日志`, config.protection.logContainerChange || false);
    form.addSwitch(`${config.appearance.secondaryColor}保护展示框`, config.protection.preventFrameInteract !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止桶倒出液体`, config.protection.preventBucketPlace !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止桶装取液体`, config.protection.preventBucketTake !== false);
    form.addSwitch(`${config.appearance.secondaryColor}保护盔甲架`, config.protection.preventArmorStandChange !== false);
    form.addSwitch(`${config.appearance.secondaryColor}防止骑乘实体`, config.protection.preventRide || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止非成员触发压力板`, config.protection.preventPressurePlate || false);
    form.addSwitch(`${config.appearance.secondaryColor}防止发射弹射物`, config.protection.preventProjectileSpawn || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showAdminMenu(pl);
            return;
        }
        
        config.protection.preventExplosions = data[1];
        config.protection.preventTNT = data[2];
        config.protection.preventCreeper = data[3];
        config.protection.preventFireSpread = data[4];
        config.protection.preventMobSpawning = data[5];
        config.protection.preventPistonPush = data[6];
        config.protection.preventLiquidFlow = data[7];
        config.protection.preventFarmlandDecay = data[8];
        config.protection.preventLeafDecay = data[9];
        config.protection.preventIceMelt = data[10];
        config.protection.preventSnowMelt = data[11];
        config.protection.preventCoralsFromDying = data[12];
        config.protection.preventBoneMeal = data[13];
        config.protection.fishingProtection = data[14];
        config.protection.allowPlayerEntry = data[15];
        config.protection.preventEndermanTake = data[16];
        config.protection.preventRespawnAnchorExplode = data[17];
        config.protection.preventHopperInput = data[18];
        config.protection.preventHopperOutput = data[19];
        config.protection.preventRedstoneUpdate = data[20];
        config.protection.preventCmdBlockExecute = data[21];
        config.protection.logContainerChange = data[22];
        config.protection.preventFrameInteract = data[23];
        config.protection.preventBucketPlace = data[24];
        config.protection.preventBucketTake = data[25];
        config.protection.preventArmorStandChange = data[26];
        config.protection.preventRide = data[27];
        config.protection.preventPressurePlate = data[28];
        config.protection.preventProjectileSpawn = data[29];
        
        saveConfig();
        
        pl.tell(`${config.appearance.highlightColor}领地保护默认设置已更新`);
        showAdminMenu(pl);
    });
}
function showDefaultPermissionsConfigMenu(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此功能`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}默认权限配置`);
    
    form.addLabel(`${config.appearance.highlightColor}设置新领地的默认全局权限：`);
    form.addLabel(`${config.appearance.infoColor}这些权限将应用于所有访客（非领地成员）`);
    form.addSwitch(`${config.appearance.secondaryColor}允许建造`, config.defaultPermissions.build || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许破坏`, config.defaultPermissions.destroy || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许交互`, config.defaultPermissions.interact || false);
    
    form.addSwitch(`${config.appearance.secondaryColor}允许使用容器`, config.defaultPermissions.useContainers || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许使用门`, config.defaultPermissions.useDoors || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许使用红石`, config.defaultPermissions.useRedstone || false);
    
    form.addSwitch(`${config.appearance.secondaryColor}允许攻击实体`, config.defaultPermissions.attackEntities || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许PVP`, config.defaultPermissions.pvp || false);
    
    form.addSwitch(`${config.appearance.secondaryColor}允许使用物品`, config.defaultPermissions.itemUse || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许传送`, config.defaultPermissions.teleport || false);
    
    form.addSwitch(`${config.appearance.secondaryColor}允许使用耕地`, config.defaultPermissions.farmland || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许拾取物品`, config.defaultPermissions.pickupItems || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许丢弃物品`, config.defaultPermissions.dropItems || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许获取经验`, config.defaultPermissions.exp || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许扔药水`, config.defaultPermissions.throwPotion || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许使用载具`, config.defaultPermissions.useVehicle || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许使用展示框`, config.defaultPermissions.useFrames || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许使用床`, config.defaultPermissions.useBed || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许使用传送门`, config.defaultPermissions.usePortal || false);
    form.addSwitch(`${config.appearance.secondaryColor}允许飞行`, config.defaultPermissions.fly || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showAdminMenu(pl);
            return;
        }
        config.defaultPermissions.build = data[2];
        config.defaultPermissions.destroy = data[3];
        config.defaultPermissions.interact = data[4];
        config.defaultPermissions.useContainers = data[5];
        config.defaultPermissions.useDoors = data[6];
        config.defaultPermissions.useRedstone = data[7];
        config.defaultPermissions.attackEntities = data[8];
        config.defaultPermissions.pvp = data[9];
        config.defaultPermissions.itemUse = data[10];
        config.defaultPermissions.teleport = data[11];
        config.defaultPermissions.farmland = data[12];
        config.defaultPermissions.pickupItems = data[13];
        config.defaultPermissions.dropItems = data[14];
        config.defaultPermissions.exp = data[15];
        config.defaultPermissions.throwPotion = data[16];
        config.defaultPermissions.useVehicle = data[17];
        config.defaultPermissions.useFrames = data[18];
        config.defaultPermissions.useBed = data[19];
        config.defaultPermissions.usePortal = data[20];
        config.defaultPermissions.fly = data[21];
        
        saveConfig();
        
        pl.tell(`${config.appearance.highlightColor}默认权限配置已更新`);
        showAdminMenu(pl);
    });
}
function showTaxConfigMenu(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此功能`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.highlightColor}税收配置`);
    
    form.addSwitch(`${config.appearance.highlightColor}启用税收系统`, config.economy.taxEnabled || false);
    form.addInput(`${config.appearance.secondaryColor}税收间隔(秒)`, "86400", String(config.economy.taxInterval || 86400));
    form.addInput(`${config.appearance.secondaryColor}税率(0-1之间)`, "0.05", String(config.economy.taxRate || 0.05));
    form.addInput(`${config.appearance.warningColor}最大欠税次数`, "3", String(config.economy.taxMissMaxCount || 3));
    form.addLabel(`${config.appearance.infoColor}说明：当玩家欠税次数达到最大值时，领地将被自动删除`);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showAdminMenu(pl);
            return;
        }
        let taxEnabled = data[0];
        let taxInterval = parseInt(data[1]);
        let taxRate = parseFloat(data[2]);
        let taxMissMaxCount = parseInt(data[3]);
        if (isNaN(taxInterval) || taxInterval < 3600) taxInterval = 86400;
        if (isNaN(taxRate) || taxRate < 0 || taxRate > 1) taxRate = 0.05;
        if (isNaN(taxMissMaxCount) || taxMissMaxCount < 1) taxMissMaxCount = 3;
        config.economy.taxEnabled = taxEnabled;
        config.economy.taxInterval = taxInterval;
        config.economy.taxRate = taxRate;
        config.economy.taxMissMaxCount = taxMissMaxCount;
        
        saveConfig();
        if (taxEnabled && !taxInterval) {
            setInterval(checkAndCollectTax, 3600000);
        }
        
        pl.tell(`${config.appearance.highlightColor}税收配置已更新`);
        showAdminMenu(pl);
    });
}
function showVisualizerConfigMenu(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此功能`);
        return;
    }
    
    let form = mc.newCustomForm();
    form.setTitle(`${config.appearance.primaryColor}可视化配置`);
    let defaultParticle = config.visualization.particleType || "minecraft:heart_particle";
    
    form.addInput(`${config.appearance.secondaryColor}粒子类型`, "minecraft:heart_particle", defaultParticle);
    form.addSwitch(`${config.appearance.secondaryColor}显示高度边界`, config.visualization.showHeight);
    form.addSlider(`${config.appearance.secondaryColor}粒子间隔(方块)`, 1, 5, 1, config.visualization.particleInterval || 2);
    form.addSlider(`${config.appearance.secondaryColor}显示持续时间(秒)`, 5, 60, 5, config.visualization.displayDuration || 30);
    
    form.addSwitch(`${config.appearance.highlightColor}2D领地仅显示竖线`, config.visualization.verticalLinesOnly2D !== false);
    form.addSlider(`${config.appearance.secondaryColor}2D竖线高度`, 5, 30, 1, config.visualization.verticalLineHeight || 10);
    form.addSlider(`${config.appearance.secondaryColor}2D竖线间隔`, 1, 10, 1, config.visualization.verticalLineSpacing || 5);
    
    form.addSwitch(`${config.appearance.secondaryColor}选择pos2后显示创建表单`, config.visualization.showFormAfterPos2 !== false);
    form.addSlider(`${config.appearance.secondaryColor}进入标题显示时间(秒)`, 1, 10, 1, config.visualization.titleStayTime || 3);
    let modes = ["仅进入时提示一次", "物品栏上方一直显示"];
    form.addDropdown(`${config.appearance.secondaryColor}物品栏上方提示模式`, modes, config.visualization.actionBarMode || 0);
    form.addSwitch(`${config.appearance.highlightColor}BossBar显示中心度百分比`, config.visualization.showBossBarCenterPercentage || false);
    
    player.sendForm(form, (pl, data) => {
        if (!data) {
            showAdminMenu(pl);
            return;
        }
        let particleType = data[0];
        let showHeight = data[1];
        let particleInterval = data[2];
        let displayDuration = data[3];
        let verticalLinesOnly2D = data[4];
        let verticalLineHeight = data[5];
        let verticalLineSpacing = data[6];
        let showFormAfterPos2 = data[7];
        let titleStayTime = data[8];
        let actionBarMode = data[9];
        let showBossBarCenterPercentage = data[10];
        config.visualization.particleType = particleType;
        config.visualization.showHeight = showHeight;

        config.visualization.particleInterval = particleInterval;
        config.visualization.displayDuration = displayDuration;
        config.visualization.verticalLinesOnly2D = verticalLinesOnly2D;
        config.visualization.verticalLineHeight = verticalLineHeight;
        config.visualization.verticalLineSpacing = verticalLineSpacing;
        config.visualization.showFormAfterPos2 = showFormAfterPos2;
        config.visualization.titleStayTime = titleStayTime;
        config.visualization.actionBarMode = actionBarMode;
        config.visualization.showBossBarCenterPercentage = showBossBarCenterPercentage;
        delete config.visualization.showTitleOnEnter;
        delete config.visualization.promptFrequency;
        
        saveConfig();
        try {
            let ps = mc.newParticleSpawner(150, true, true);
            ps.spawnParticle(new FloatPos(pl.pos.x, pl.pos.y + 2, pl.pos.z, pl.pos.dimid), config.visualization.particleType);
        } catch (e) {
            logger.error(`[${PLUGIN_NAME}] 预览粒子时出错: ${e}`);
        }
        
        pl.tell(`${config.appearance.highlightColor}可视化配置已更新`);
        showAdminMenu(pl);
    });
}
function showAllLandsMenu(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此功能`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.secondaryColor}所有领地`);
    
    let landCount = Object.keys(landsData).length;
    let content = `${config.appearance.infoColor}共有 ${landCount} 个领地\n`;
    content += `${config.appearance.highlightColor}点击领地查看详情或进行管理\n`;
    
    form.setContent(content);
    
    let landIds = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        let ownerName = land.ownerName || "未知";
        let type = land.is2D ? "2D" : "3D";
        let area = calculateSelectionVolume({
            pos1: land.pos1,
            pos2: land.pos2
        }, land.is2D);
        
        form.addButton(`${config.appearance.secondaryColor}${land.name}\n${config.appearance.infoColor}所有者: ${ownerName} | ${land.dimName} | ${type} | ${area}方块`, "textures/ui/worldsIcon");
        landIds.push(landId);
    }
    
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === landIds.length) {
            showAdminMenu(pl);
            return;
        }
        
        if (id < landIds.length) {
            showAdminLandDetailsMenu(pl, landIds[id]);
        }
    });
}
function showAdminLandDetailsMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.secondaryColor}领地详情: ${land.name}`);
    
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let minY = Math.min(land.pos1.y, land.pos2.y);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let maxY = Math.max(land.pos1.y, land.pos2.y);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    
    let area = calculateSelectionVolume({
        pos1: land.pos1,
        pos2: land.pos2
    }, land.is2D);
    
    let type = land.is2D ? "2D (无高度限制)" : "3D (完整空间)";
    let createTime = new Date(land.createdTime).toLocaleString();
    let memberCount = land.members ? Object.keys(land.members).length : 0;
    
    let content = `${config.appearance.infoColor}领地信息：\n` +
                `${config.appearance.secondaryColor}所有者: ${config.appearance.infoColor}${land.ownerName} (${land.owner})\n` +
                `${config.appearance.secondaryColor}创建时间: ${config.appearance.infoColor}${createTime}\n` +
                `${config.appearance.secondaryColor}维度: ${config.appearance.infoColor}${land.dimName}\n` +
                `${config.appearance.secondaryColor}类型: ${config.appearance.infoColor}${type}\n` +
                `${config.appearance.secondaryColor}范围: ${config.appearance.infoColor}${minX},${minY},${minZ} 至 ${maxX},${maxY},${maxZ}\n` +
                `${config.appearance.secondaryColor}大小: ${config.appearance.infoColor}${area}方块\n` +
                `${config.appearance.secondaryColor}成员数: ${config.appearance.infoColor}${memberCount} / ${config.limits.maxMembers}\n`;
    if (land.teleportPos) {
        content += `${config.appearance.secondaryColor}传送点: ${config.appearance.infoColor}${Math.floor(land.teleportPos.x)}, ${Math.floor(land.teleportPos.y)}, ${Math.floor(land.teleportPos.z)}\n`;
    }
    if (config.protection.enableFlyInLand && !config.protection.adminControlledFlight) {
        let flightStatus = "未购买";
        if (land.flightUnlockType === "perm") {
            flightStatus = "已永久解锁";
        } else if (land.flightUnlockType === "temp") {
            let expireTime = new Date(land.flightExpireTime).toLocaleString();
            flightStatus = `临时解锁 (至 ${expireTime})`;
        }
        content += `${config.appearance.secondaryColor}领地飞行: ${config.appearance.infoColor}${flightStatus}\n`;
    }
    if (config.economy.taxEnabled) {
        let taxAmount = calculateLandTax(land);
        let nextTaxTime = new Date(land.lastTaxTime + config.economy.taxInterval * 1000).toLocaleString();
        let missedTaxes = land.taxMissed || 0;
        content += `${config.appearance.secondaryColor}税金: ${config.appearance.infoColor}${taxAmount} (下次: ${nextTaxTime})\n`;
        content += `${config.appearance.secondaryColor}欠税次数: ${config.appearance.infoColor}${missedTaxes} / ${config.economy.taxMissMaxCount}\n`;
    }
    
    form.setContent(content);
    
    form.addButton(`${config.appearance.highlightColor}传送到领地`, "textures/ui/icon_teleport");
    form.addButton(`${config.appearance.secondaryColor}显示领地边界`, "textures/ui/icon_recipe_item");
    form.addButton(`${config.appearance.primaryColor}查看成员列表`, "textures/ui/dressing_room_skins");
    form.addButton(`${config.appearance.highlightColor}设置权限`, "textures/ui/permissions_member_star");
    form.addButton(`${config.appearance.secondaryColor}修改保护设置`, "textures/ui/shield");
    form.addButton(`${config.appearance.warningColor}强制删除领地`, "textures/ui/InvalidWorldDemoScreen");
    form.addButton(`${config.appearance.secondaryColor}返回列表`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 6) {
            showAllLandsMenu(pl);
            return;
        }
        
        switch (id) {
            case 0:
                teleportToLand(pl, landId);
                break;
            case 1:
                visualizeLand(pl, landId);
                pl.tell(`${config.appearance.highlightColor}正在显示领地边界，持续${config.visualization.displayDuration}秒`);
                setTimeout(() => {
                    stopVisualizeLand(pl);
                }, config.visualization.displayDuration * 1000);
                break;
            case 2:
                showAdminLandMembersMenu(pl, landId);
                break;
            case 3:
                showLandPermissionsMenu(pl, landId);
                break;
            case 4:
                showLandProtectionMenu(pl, landId);
                break;
            case 5:
                showAdminDeleteLandConfirmation(pl, landId);
                break;
        }
    });
}
function showAdminLandMembersMenu(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.secondaryColor}领地成员: ${land.name}`);
    
    let content = `${config.appearance.infoColor}所有者: ${config.appearance.highlightColor}${land.ownerName}\n\n`;
    
    if (!land.members || Object.keys(land.members).length === 0) {
        content += `${config.appearance.warningColor}该领地没有成员`;
    } else {
        content += `${config.appearance.highlightColor}领地成员列表:`;
    }
    
    form.setContent(content);
    
    let memberXuids = [];
    if (land.members) {
        for (let memberXuid in land.members) {
            let member = land.members[memberXuid];
            let permLevel = member.permLevel || 1;
            let levelNames = ["访客", "成员", "管理员"];
            
            form.addButton(`${config.appearance.secondaryColor}${member.name}\n${config.appearance.infoColor}权限等级: ${levelNames[permLevel - 1]} | XUID: ${memberXuid}`, "textures/ui/player_online_icon");
            memberXuids.push(memberXuid);
        }
    }
    
    form.addButton(`${config.appearance.primaryColor}添加成员`, "textures/ui/color_plus");
    form.addButton(`${config.appearance.warningColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === memberXuids.length + 1) {
            showAdminLandDetailsMenu(pl, landId);
            return;
        }
        
        if (id < memberXuids.length) {
            showAdminMemberDetailsMenu(pl, landId, memberXuids[id]);
        }
        else if (id === memberXuids.length) {
            showAddMemberMenu(pl, landId);
        }
    });
}
function showAdminMemberDetailsMenu(player, landId, memberXuid) {
    let land = landsData[landId];
    if (!land || !land.members || !land.members[memberXuid]) {
        player.tell(`${config.appearance.warningColor}成员不存在`);
        return;
    }
    
    let member = land.members[memberXuid];
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.primaryColor}成员详情: ${member.name}`);
    
    let levelNames = ["访客", "成员", "管理员"];
    let permLevel = member.permLevel || 1;
    
    let content = `${config.appearance.infoColor}成员信息：\n` +
                `${config.appearance.secondaryColor}名称: ${config.appearance.infoColor}${member.name}\n` +
                `${config.appearance.secondaryColor}XUID: ${config.appearance.infoColor}${memberXuid}\n` +
                `${config.appearance.secondaryColor}权限等级: ${config.appearance.infoColor}${levelNames[permLevel - 1]} (${permLevel})\n` +
                `${config.appearance.secondaryColor}加入时间: ${config.appearance.infoColor}${new Date(member.joinTime).toLocaleString()}\n\n` +
                `${config.appearance.highlightColor}选择操作:`;
    
    form.setContent(content);
    
    form.addButton(`${config.appearance.highlightColor}设置权限`, "textures/ui/permissions_member_star");
    form.addButton(`${config.appearance.warningColor}移除成员`, "textures/ui/trash_icon");
    form.addButton(`${config.appearance.secondaryColor}返回`, "textures/ui/arrow_left");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 2) {
            showAdminLandMembersMenu(pl, landId);
            return;
        }
        
        switch (id) {
            case 0:
                showMemberPermissionsMenu(pl, landId, memberXuid);
                break;
            case 1:
                showAdminRemoveMemberConfirmation(pl, landId, memberXuid);
                break;
        }
    });
}
function showAdminRemoveMemberConfirmation(player, landId, memberXuid) {
    let land = landsData[landId];
    if (!land || !land.members || !land.members[memberXuid]) {
        player.tell(`${config.appearance.warningColor}成员不存在`);
        return;
    }
    
    let member = land.members[memberXuid];
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.warningColor}移除成员`);
    form.setContent(`${config.appearance.infoColor}确定要从领地 "${land.name}" 中移除成员 ${member.name} 吗？`);
    form.addButton(`${config.appearance.warningColor}确认移除`, "textures/ui/trash_icon");
    form.addButton(`${config.appearance.highlightColor}取消`, "textures/ui/cancel");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 1) {
            showAdminMemberDetailsMenu(pl, landId, memberXuid);
            return;
        }
        
        if (id === 0) {
            delete land.members[memberXuid];
            saveLandsData();
            
            pl.tell(`${config.appearance.highlightColor}已移除成员 ${member.name}`);
            let targetPlayer = mc.getPlayer(memberXuid);
            if (targetPlayer) {
                targetPlayer.tell(`${config.appearance.warningColor}管理员已将你从领地 "${land.name}" 中移除`);
            }
            
            showAdminLandMembersMenu(pl, landId);
        }
    });
}
function showAdminDeleteLandConfirmation(player, landId) {
    let land = landsData[landId];
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        return;
    }
    
    let form = mc.newSimpleForm();
    form.setTitle(`${config.appearance.warningColor}删除领地`);
    form.setContent(`${config.appearance.infoColor}确定要删除领地 "${land.name}" 吗？\n\n${config.appearance.warningColor}这个操作不可逆！\n${config.appearance.warningColor}所有者: ${land.ownerName}`);
    form.addButton(`${config.appearance.warningColor}确认删除`, "textures/ui/trash_icon");
    form.addButton(`${config.appearance.highlightColor}取消`, "textures/ui/cancel");
    
    player.sendForm(form, (pl, id) => {
        if (id === null || id === 1) {
            showAdminLandDetailsMenu(pl, landId);
            return;
        }
        
        if (id === 0) {
            removeFromIndex(landId);
            delete landsData[landId];
            saveLandsData();
            
            pl.tell(`${config.appearance.highlightColor}已删除领地 "${land.name}"`);
            let owner = mc.getPlayer(land.owner);
            if (owner) {
                owner.tell(`${config.appearance.warningColor}管理员已删除你的领地 "${land.name}"`);
            }
            
            showAllLandsMenu(pl);
        }
    });
}
function reloadPluginConfig(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此功能`);
        return;
    }
    
    try {
        let raw = File.readFrom(CONFIG_PATH);
        let loadedConfig = JSON.parse(raw);
        config = mergeConfig(loadedConfig, defaultConfig);
        
        saveConfig();
        
        player.tell(`${config.appearance.highlightColor}插件配置已重新加载`);
    } catch (e) {
        player.tell(`${config.appearance.warningColor}重载配置失败: ${e}`);
    }
    
    showAdminMenu(player);
}

mc.regPlayerCmd("land", `${config.appearance.primaryColor}ZXland领地系统`, (player, args) => {
    if (args.length === 0) {
        showMainMenu(player);
        return;
    }
    
    switch (args[0].toLowerCase()) {
        case "new":
            cmdStartNewLand(player);
            break;
        case "pos1":
            cmdSetPos1(player);
            break;
        case "pos2":
            cmdSetPos2(player);
            break;
        case "set":
            cmdPushSelectionPoint(player);
            break;
        case "giveup":
        case "cancel":
            cmdGiveupSelection(player);
            break;
        case "buy":
        case "create":
            showCreateLandMenu(player);
            break;
        case "ok":
        case "confirm":
            cmdConfirmReselect(player);
            break;
        case "gui":
        case "list":
        case "my":
            showMyLandsMenu(player);
            break;
        case "tp":
        case "teleport":
            if (args.length >= 2) {
                let subCmd = args[1].toLowerCase();
                if (subCmd === "set") {
                    cmdSetTeleportPoint(player);
                } else if (subCmd === "rm" || subCmd === "remove" || subCmd === "del") {
                    cmdRemoveTeleportPoint(player);
                } else {
                    cmdTeleportToLand(player, args.slice(1).join(" "));
                }
            } else {
                showLandTeleportMenu(player);
            }
            break;
        case "info":
            if (args.length >= 2) {
                cmdLandInfo(player, args.slice(1).join(" "));
            } else {
                cmdLandInfoAtPosition(player);
            }
            break;
        case "add":
        case "invite":
            if (args.length >= 3) {
                cmdAddMember(player, args[1], args[2]);
            } else {
                player.tell(`${config.appearance.warningColor}用法: /land add <领地名> <玩家名>`);
            }
            break;
        case "remove":
        case "kick":
            if (args.length >= 3) {
                cmdRemoveMember(player, args[1], args[2]);
            } else {
                player.tell(`${config.appearance.warningColor}用法: /land remove <领地名> <玩家名>`);
            }
            break;
        case "perm":
        case "permission":
            showSelectLandForPermissionsMenu(player);
            break;
        case "members":
            showSelectLandForMembersMenu(player);
            break;
        case "delete":
            if (args.length >= 2) {
                cmdDeleteLand(player, args.slice(1).join(" "));
            } else {
                player.tell(`${config.appearance.warningColor}用法: /land delete <领地名>`);
            }
            break;
        case "show":
        case "vis":
        case "visualize":
            if (args.length >= 2) {
                cmdVisualizeLand(player, args.slice(1).join(" "));
            } else {
                cmdVisualizeAtPosition(player);
            }
            break;
        case "protect":
            if (args.length >= 2) {
                cmdSetProtection(player, args.slice(1));
            } else {
                player.tell(`${config.appearance.warningColor}用法: /land protect <领地名> <保护选项> <开关>`);
            }
            break;
        case "fly":
            if (args.length >= 2) {
                cmdToggleFly(player, args.slice(1).join(" "));
            } else {
                player.tell(`${config.appearance.warningColor}用法: /land fly <领地名> [on/off]`);
            }
            break;
        case "mgr":
        case "admin":
            if (isLandAdmin(player)) {
                if (args.length >= 2 && args[1].toLowerCase() === "selectool") {
                    cmdSetOpSelectTool(player);
                } else {
                    showAdminMenu(player);
                }
            } else {
                player.tell(`${config.appearance.warningColor}你没有权限使用此命令`);
            }
            break;
        case "help":
            showHelpMessage(player);
            break;
        case "z1":
            cmdSetSubPos1(player);
            break;
        case "z2":
            cmdSetSubPos2(player);
            break;
        case "warp":
            if (args.length >= 2) {
                let warpName = args.slice(1).join(" ");
                let foundLandId = null;
                for (let landId in landsData) {
                    let land = landsData[landId];
                    if (land.warps && land.warps[warpName]) {
                        if (land.warps[warpName].isPublic || land.owner === player.xuid || (land.members && land.members[player.xuid])) {
                            foundLandId = landId;
                            break;
                        }
                    }
                }
                if (foundLandId) {
                    teleportToWarp(player, foundLandId, warpName);
                } else {
                    player.tell(`${config.appearance.warningColor}找不到名为 "${warpName}" 的公共传送点`);
                }
            } else {
                player.tell(`${config.appearance.warningColor}用法: /land warp <传送点名称>`);
            }
            break;
        case "reload":
            if (isLandAdmin(player)) {
                reloadPluginConfig(player);
            } else {
                player.tell(`${config.appearance.warningColor}你没有管理员权限`);
            }
            break;
        default:
            player.tell(`${config.appearance.warningColor}未知的子命令，输入 /land help 查看帮助`);
            break;
    }
});

mc.listen("onConsoleCmd", (cmd) => {
    let args = cmd.split(/\s+/);
    if (args[0].toLowerCase() !== "zxland") return true;
    
    if (args.length < 2) {
        logger.info("[ZXland] 用法: zxland op <add|remove|list> [玩家名]");
        return false;
    }
    
    let subCmd = args[1].toLowerCase();
    
    if (subCmd === "op") {
        if (args.length < 3) {
            logger.info("[ZXland] 用法: zxland op <add|remove|list> [玩家名]");
            return false;
        }
        
        let action = args[2].toLowerCase();
        
        if (action === "list") {
            let adminList = Object.keys(landAdmins).filter(k => landAdmins[k]);
            if (adminList.length === 0) {
                logger.info("[ZXland] 当前没有领地管理员");
            } else {
                logger.info(`[ZXland] 领地管理员列表 (${adminList.length}人):`);
                for (let xuid of adminList) {
                    let player = mc.getPlayer(xuid);
                    let name = player ? player.realName : `XUID:${xuid}`;
                    logger.info(`  - ${name}`);
                }
            }
            return false;
        }
        
        if (args.length < 4) {
            logger.info("[ZXland] 用法: zxland op add/remove <玩家名>");
            return false;
        }
        
        let playerName = args.slice(3).join(" ");
        let targetPlayer = mc.getPlayer(playerName);
        
        if (!targetPlayer) {
            logger.warn(`[ZXland] 找不到在线玩家: ${playerName}`);
            return false;
        }
        
        let targetXuid = targetPlayer.xuid;
        let targetRealName = targetPlayer.realName;
        
        if (action === "add") {
            if (landAdmins[targetXuid]) {
                logger.info(`[ZXland] ${targetRealName} 已经是领地管理员`);
            } else {
                landAdmins[targetXuid] = true;
                saveLandAdmins();
                logger.info(`[ZXland] 已将 ${targetRealName} 设为领地管理员`);
                targetPlayer.tell(`${config.appearance.highlightColor}你已被设为领地管理员`);
            }
        } else if (action === "remove") {
            if (!landAdmins[targetXuid]) {
                logger.info(`[ZXland] ${targetRealName} 不是领地管理员`);
            } else {
                delete landAdmins[targetXuid];
                saveLandAdmins();
                logger.info(`[ZXland] 已移除 ${targetRealName} 的领地管理员权限`);
                targetPlayer.tell(`${config.appearance.warningColor}你的领地管理员权限已被移除`);
            }
        } else {
            logger.info("[ZXland] 未知操作，使用 add/remove/list");
        }
        return false;
    }
    
    logger.info("[ZXland] 未知命令，用法: zxland op <add|remove|list> [玩家名]");
    return false;
});

function cmdSetPos1(player) {
    let x = Math.floor(player.pos.x);
    let y = Math.floor(player.pos.y);
    let z = Math.floor(player.pos.z);
    let dimid = player.pos.dimid;
    
    setSelectionPoint(player.xuid, "pos1", x, y, z, dimid);
    
    player.tell(`${config.appearance.highlightColor}已设置选区点1: (${x}, ${y}, ${z}) 维度:${getDimensionName(dimid)}`);
}
function cmdSetPos2(player) {
    let x = Math.floor(player.pos.x);
    let y = Math.floor(player.pos.y);
    let z = Math.floor(player.pos.z);
    let dimid = player.pos.dimid;
    
    setSelectionPoint(player.xuid, "pos2", x, y, z, dimid);
    
    player.tell(`${config.appearance.highlightColor}已设置选区点2: (${x}, ${y}, ${z}) 维度:${getDimensionName(dimid)}`);
    let selection = getPlayerSelection(player.xuid);
    if (selection.pos1 && selection.pos2) {
        if (selection.pos1.dimid !== selection.pos2.dimid) {
            player.tell(`${config.appearance.warningColor}选区跨维度，无法创建领地`);
        } else {
            let volume2D = calculateSelectionVolume(selection, true);
            let volume3D = calculateSelectionVolume(selection, false);
            let price2D = calculateLandPrice(volume2D, true);
            let price3D = calculateLandPrice(volume3D, false);
            
            player.tell(`${config.appearance.secondaryColor}选区信息:`);
            player.tell(`${config.appearance.secondaryColor}面积: ${config.appearance.infoColor}${(Math.abs(selection.pos1.x - selection.pos2.x) + 1) * (Math.abs(selection.pos1.z - selection.pos2.z) + 1)} 方块 (XZ平面)`);
            player.tell(`${config.appearance.secondaryColor}体积: ${config.appearance.infoColor}${volume3D} 方块 (XYZ空间)`);
            player.tell(`${config.appearance.highlightColor}2D领地价格: ${config.appearance.infoColor}${price2D}`);
            player.tell(`${config.appearance.highlightColor}3D领地价格: ${config.appearance.infoColor}${price3D}`);
            visualizeSelectionWithDuration(player, selection, 10);
            player.tell(`${config.appearance.highlightColor}正在显示选区边界，持续10秒`);
            let overlap = checkSelectionOverlap(selection);
            if (overlap) {
                player.tell(`${config.appearance.warningColor}警告: 选区与现有领地重叠`);
            } else {
                player.tell(`${config.appearance.highlightColor}选区合法，可以创建领地。`);
                if (config.visualization.showFormAfterPos2) {
                    showCreateLandMenu(player);
                }
            }
        }
    }
}

function cmdStartNewLand(player) {
    let xuid = player.xuid;
    
    if (playerReselectingLand[xuid]) {
        player.tell(`${config.appearance.warningColor}你正在重选领地模式中，请先完成或放弃`);
        return;
    }
    
    let selection = getPlayerSelection(xuid);
    if (selection.pos1 || selection.pos2) {
        player.tell(`${config.appearance.warningColor}你已经有选区了，使用 /land giveup 放弃或 /land buy 购买`);
        return;
    }
    
    let ownedCount = 0;
    for (let lid in landsData) {
        if (landsData[lid].owner === xuid && !landsData[lid].parentId) {
            ownedCount++;
        }
    }
    
    if (ownedCount >= config.limits.maxLandsPerPlayer && !isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你的领地数量已达上限 (${config.limits.maxLandsPerPlayer})`);
        return;
    }
    
    player.tell(`${config.appearance.highlightColor}已开启选区模式`);
    player.tell(`${config.appearance.infoColor}使用 /land set 或手持 ${config.features.selectionTool || "木斧"} 点击方块设置选区`);
    player.tell(`${config.appearance.infoColor}或使用 /land pos1 和 /land pos2 直接设置选区点`);
    player.tell(`${config.appearance.secondaryColor}完成后使用 /land buy 购买领地`);
    
    if (!playerSelections[xuid]) {
        playerSelections[xuid] = {};
    }
    playerSelections[xuid].selectingMode = true;
}

function cmdPushSelectionPoint(player) {
    let xuid = player.xuid;
    let selection = getPlayerSelection(xuid);
    
    let x = Math.floor(player.pos.x);
    let y = Math.floor(player.pos.y);
    let z = Math.floor(player.pos.z);
    let dimid = player.pos.dimid;
    
    if (!selection.pos1) {
        setSelectionPoint(xuid, "pos1", x, y, z, dimid);
        player.tell(`${config.appearance.highlightColor}已设置选区点1: (${x}, ${y}, ${z})`);
    } else if (!selection.pos2) {
        setSelectionPoint(xuid, "pos2", x, y, z, dimid);
        player.tell(`${config.appearance.highlightColor}已设置选区点2: (${x}, ${y}, ${z})`);
        cmdSetPos2(player);
    } else {
        setSelectionPoint(xuid, "pos1", x, y, z, dimid);
        if (playerSelections[xuid]) {
            playerSelections[xuid].pos2 = null;
        }
        player.tell(`${config.appearance.highlightColor}已重置选区，设置点1: (${x}, ${y}, ${z})`);
    }
}

function cmdGiveupSelection(player) {
    let xuid = player.xuid;
    
    if (playerReselectingLand[xuid]) {
        delete playerReselectingLand[xuid];
        clearPlayerSelection(xuid);
        player.tell(`${config.appearance.highlightColor}已放弃重选领地`);
        return;
    }
    
    let selection = getPlayerSelection(xuid);
    if (!selection.pos1 && !selection.pos2) {
        player.tell(`${config.appearance.warningColor}你没有正在进行的选区`);
        return;
    }
    
    clearPlayerSelection(xuid);
    player.tell(`${config.appearance.highlightColor}已放弃当前选区`);
}

function cmdConfirmReselect(player) {
    let xuid = player.xuid;
    let reselectInfo = playerReselectingLand[xuid];
    
    if (!reselectInfo) {
        player.tell(`${config.appearance.warningColor}你没有正在进行的重选操作`);
        return;
    }
    
    let landId = reselectInfo.landId;
    let land = landsData[landId];
    
    if (!land) {
        player.tell(`${config.appearance.warningColor}领地不存在`);
        delete playerReselectingLand[xuid];
        return;
    }
    
    let selection = getPlayerSelection(xuid);
    if (!selection.pos1 || !selection.pos2) {
        player.tell(`${config.appearance.warningColor}请先设置新的选区范围`);
        return;
    }
    
    if (selection.pos1.dimid !== selection.pos2.dimid) {
        player.tell(`${config.appearance.warningColor}选区跨维度，无法重选`);
        return;
    }
    
    let oldVolume = calculateSelectionVolume({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
    let newVolume = calculateSelectionVolume(selection, land.is2D);
    let oldPrice = calculateLandPrice(oldVolume, land.is2D);
    let newPrice = calculateLandPrice(newVolume, land.is2D);
    let priceDiff = newPrice - oldPrice;
    
    if (priceDiff > 0) {
        let playerMoney = money.get(xuid);
        if (playerMoney < priceDiff) {
            player.tell(`${config.appearance.warningColor}余额不足，需要支付 ${priceDiff}，你只有 ${playerMoney}`);
            return;
        }
        money.reduce(xuid, priceDiff);
        player.tell(`${config.appearance.highlightColor}已支付扩展费用: ${priceDiff}`);
    } else if (priceDiff < 0) {
        let refund = Math.abs(priceDiff) * (config.economic.sellRefundRate || 0.8);
        money.add(xuid, refund);
        player.tell(`${config.appearance.highlightColor}已退还缩减费用: ${Math.floor(refund)}`);
    }
    
    land.pos1 = { x: selection.pos1.x, y: selection.pos1.y, z: selection.pos1.z };
    land.pos2 = { x: selection.pos2.x, y: selection.pos2.y, z: selection.pos2.z };
    land.dim = selection.pos1.dimid;
    
    saveLandsData();
    clearPlayerSelection(xuid);
    delete playerReselectingLand[xuid];
    
    player.tell(`${config.appearance.highlightColor}领地 "${land.name}" 范围已更新`);
}

function cmdSetTeleportPoint(player) {
    let pos = player.blockPos;
    let landId = getLandAtPos(pos);
    
    if (!landId) {
        player.tell(`${config.appearance.warningColor}你当前不在任何领地内`);
        return;
    }
    
    let land = landsData[landId];
    if (land.owner !== player.xuid && !isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你不是这个领地的主人`);
        return;
    }
    
    land.teleportPos = {
        x: pos.x,
        y: pos.y + 1,
        z: pos.z
    };
    saveLandsData();
    
    player.tell(`${config.appearance.highlightColor}已设置领地 "${land.name}" 的传送点为当前位置`);
}

function cmdRemoveTeleportPoint(player) {
    let pos = player.blockPos;
    let landId = getLandAtPos(pos);
    
    if (!landId) {
        player.tell(`${config.appearance.warningColor}你当前不在任何领地内`);
        return;
    }
    
    let land = landsData[landId];
    if (land.owner !== player.xuid && !isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你不是这个领地的主人`);
        return;
    }
    
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    let centerX = Math.floor((minX + maxX) / 2);
    let centerZ = Math.floor((minZ + maxZ) / 2);
    let centerY = land.is2D ? 100 : Math.floor((Math.min(land.pos1.y, land.pos2.y) + Math.max(land.pos1.y, land.pos2.y)) / 2);
    
    land.teleportPos = { x: centerX, y: centerY, z: centerZ };
    saveLandsData();
    
    player.tell(`${config.appearance.highlightColor}已重置领地 "${land.name}" 的传送点为默认位置`);
}

function cmdSetOpSelectTool(player) {
    if (!isLandAdmin(player)) {
        player.tell(`${config.appearance.warningColor}你没有权限使用此命令`);
        return;
    }
    
    let item = player.getHand();
    if (!item || item.isNull()) {
        player.tell(`${config.appearance.warningColor}请手持一个物品`);
        return;
    }
    
    config.features.selectionTool = item.type;
    saveConfig();
    
    player.tell(`${config.appearance.highlightColor}已将选区工具设置为: ${item.type}`);
}
function cmdSetSubPos1(player) {
    if (config.limits.enableSubLand === false) {
        player.tell(`${config.appearance.warningColor}子领地功能已被管理员禁用`);
        return;
    }
    
    let x = Math.floor(player.pos.x);
    let y = Math.floor(player.pos.y);
    let z = Math.floor(player.pos.z);
    let dimid = player.pos.dimid;
    
    let landInfo = getLandAt(x, y, z, dimid);
    if (!landInfo) {
        player.tell(`${config.appearance.warningColor}你必须在领地内才能设置子领地选区`);
        return;
    }
    
    let land = landInfo.land;
    let canManageSubLand = (land.owner === player.xuid) || isLandAdmin(player);
    
    if (!canManageSubLand && !land.allowMemberBuySubLand) {
        player.tell(`${config.appearance.warningColor}领地主人未开启成员购买子领地功能`);
        return;
    }
    
    if (!canManageSubLand && land.allowMemberBuySubLand && (!land.members || !land.members[player.xuid])) {
        player.tell(`${config.appearance.warningColor}你必须是该领地的成员才能购买子领地`);
        return;
    }
    
    setSubSelectionPoint(player.xuid, "pos1", x, y, z, dimid);
    player.tell(`${config.appearance.highlightColor}已设置子领地选区点1: (${x}, ${y}, ${z})`);
}
function cmdSetSubPos2(player) {
    if (config.limits.enableSubLand === false) {
        player.tell(`${config.appearance.warningColor}子领地功能已被管理员禁用`);
        return;
    }
    
    let x = Math.floor(player.pos.x);
    let y = Math.floor(player.pos.y);
    let z = Math.floor(player.pos.z);
    let dimid = player.pos.dimid;
    
    let landInfo = getLandAt(x, y, z, dimid);
    if (!landInfo) {
        player.tell(`${config.appearance.warningColor}你必须在领地内才能设置子领地选区`);
        return;
    }
    
    let land = landInfo.land;
    let parentLandId = landInfo.id;
    let canManageSubLand = (land.owner === player.xuid) || isLandAdmin(player);
    
    if (!canManageSubLand && !land.allowMemberBuySubLand) {
        player.tell(`${config.appearance.warningColor}领地主人未开启成员购买子领地功能`);
        return;
    }
    
    if (!canManageSubLand && land.allowMemberBuySubLand && (!land.members || !land.members[player.xuid])) {
        player.tell(`${config.appearance.warningColor}你必须是该领地的成员才能购买子领地`);
        return;
    }
    
    setSubSelectionPoint(player.xuid, "pos2", x, y, z, dimid);
    player.tell(`${config.appearance.highlightColor}已设置子领地选区点2: (${x}, ${y}, ${z})`);
    
    let subSelection = getPlayerSubSelection(player.xuid);
    if (subSelection.pos1 && subSelection.pos2) {
        if (subSelection.pos1.dimid !== subSelection.pos2.dimid) {
            player.tell(`${config.appearance.warningColor}子领地选区跨维度，无法创建`);
            return;
        }
        
        let volume = calculateSelectionVolume(subSelection, land.is2D);
        let price = calculateLandPrice(volume, land.is2D) * 0.5;
        
        player.tell(`${config.appearance.secondaryColor}子领地选区信息:`);
        player.tell(`${config.appearance.secondaryColor}体积: ${config.appearance.infoColor}${volume} 方块`);
        player.tell(`${config.appearance.highlightColor}购买价格: ${config.appearance.infoColor}${price.toFixed(0)} (主领地50%折扣)`);
        
        visualizeSelectionWithDuration(player, subSelection, 10);
        player.tell(`${config.appearance.highlightColor}正在显示子领地边界，持续10秒`);
        
        if (config.visualization.showFormAfterPos2) {
            showBuySubLandForm(player, parentLandId);
        }
    }
}

function cmdTeleportToLand(player, landName) {
    let xuid = player.xuid;
    let targetLand = null;
    let targetLandId = null;
    
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.name.toLowerCase() === landName.toLowerCase()) {
            if (land.owner === xuid || (land.members && land.members[xuid]) || isLandAdmin(player)) {
                targetLand = land;
                targetLandId = landId;
                break;
            }
        }
    }
    
    if (!targetLand) {
        player.tell(`${config.appearance.warningColor}找不到名为 "${landName}" 的领地，或者你没有权限传送`);
        return;
    }
    
    teleportToLand(player, targetLandId);
}

function cmdToggleFly(player, landName) {
    let xuid = player.xuid;
    let targetLand = null;
    let targetLandId = null;
    
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.name.toLowerCase() === landName.toLowerCase() && (land.owner === xuid || isLandAdmin(player))) {
            targetLand = land;
            targetLandId = landId;
            break;
        }
    }
    
    if (!targetLand) {
        player.tell(`${config.appearance.warningColor}找不到名为 "${landName}" 的领地，或者你不是所有者`);
        return;
    }
    
    if (!targetLand.permissions) {
        targetLand.permissions = {};
    }
    targetLand.permissions.fly = !targetLand.permissions.fly;
    saveLandsData();
    
    let flyStatus = targetLand.permissions.fly ? "启用" : "禁用";
    player.tell(`${config.appearance.highlightColor}已${flyStatus}领地 "${landName}" 的飞行功能`);
}

function cmdLandInfo(player, landName) {
    let targetLandId = null;
    
    for (let landId in landsData) {
        if (landsData[landId].name.toLowerCase() === landName.toLowerCase()) {
            targetLandId = landId;
            break;
        }
    }
    
    if (!targetLandId) {
        player.tell(`${config.appearance.warningColor}找不到名为 "${landName}" 的领地`);
        return;
    }
    
    showLandInformation(player, targetLandId);
}

function cmdLandInfoAtPosition(player) {
    let pos = player.blockPos;
    let landId = getLandAtPos(pos);
    
    if (!landId) {
        player.tell(`${config.appearance.warningColor}你当前不在任何领地内`);
        return;
    }
    
    showLandInformation(player, landId);
}

function cmdAddMember(player, landName, targetName) {
    let xuid = player.xuid;
    let landId = null;
    
    for (let id in landsData) {
        if (landsData[id].name.toLowerCase() === landName.toLowerCase() && 
            (landsData[id].owner === xuid || isLandAdmin(player))) {
            landId = id;
            break;
        }
    }
    
    if (!landId) {
        player.tell(`${config.appearance.warningColor}找不到名为 "${landName}" 的领地，或者你不是所有者`);
        return;
    }
    
    let targetPlayer = mc.getPlayer(targetName);
    if (!targetPlayer) {
        player.tell(`${config.appearance.warningColor}找不到在线玩家 "${targetName}"`);
        return;
    }
    
    if (addLandMember(landId, xuid, targetPlayer.xuid, targetPlayer.realName)) {
        player.tell(`${config.appearance.highlightColor}已将玩家 ${targetPlayer.realName} 添加到领地 "${landName}" 的成员列表`);
    } else {
        player.tell(`${config.appearance.warningColor}添加成员失败`);
    }
}

function cmdRemoveMember(player, landName, targetName) {
    let xuid = player.xuid;
    let landId = null;
    
    for (let id in landsData) {
        if (landsData[id].name.toLowerCase() === landName.toLowerCase() && 
            (landsData[id].owner === xuid || isLandAdmin(player))) {
            landId = id;
            break;
        }
    }
    
    if (!landId) {
        player.tell(`${config.appearance.warningColor}找不到名为 "${landName}" 的领地，或者你不是所有者`);
        return;
    }
    
    let land = landsData[landId];
    let targetXuid = null;
    
    if (land.members) {
        for (let mXuid in land.members) {
            if (land.members[mXuid].name.toLowerCase() === targetName.toLowerCase()) {
                targetXuid = mXuid;
                break;
            }
        }
    }
    
    if (!targetXuid) {
        let targetPlayer = mc.getPlayer(targetName);
        if (targetPlayer) {
            targetXuid = targetPlayer.xuid;
        }
    }
    
    if (!targetXuid) {
        player.tell(`${config.appearance.warningColor}找不到成员 "${targetName}"`);
        return;
    }
    
    if (removeLandMember(landId, xuid, targetXuid)) {
        player.tell(`${config.appearance.highlightColor}已将玩家 ${targetName} 从领地 "${landName}" 的成员列表中移除`);
    } else {
        player.tell(`${config.appearance.warningColor}移除成员失败`);
    }
}

function cmdDeleteLand(player, landName) {
    let xuid = player.xuid;
    let landId = null;
    
    for (let id in landsData) {
        if (landsData[id].name.toLowerCase() === landName.toLowerCase() && 
            (landsData[id].owner === xuid || isLandAdmin(player))) {
            landId = id;
            break;
        }
    }
    
    if (!landId) {
        player.tell(`${config.appearance.warningColor}找不到名为 "${landName}" 的领地，或者你没有权限删除它`);
        return;
    }
    
    showDeleteLandConfirmation(player, landId);
}

function cmdVisualizeLand(player, landName) {
    let landId = null;
    
    for (let id in landsData) {
        if (landsData[id].name.toLowerCase() === landName.toLowerCase()) {
            landId = id;
            break;
        }
    }
    
    if (!landId) {
        player.tell(`${config.appearance.warningColor}找不到名为 "${landName}" 的领地`);
        return;
    }
    
    visualizeLand(player, landId);
    player.tell(`${config.appearance.highlightColor}正在显示领地 "${landName}" 的边界`);
}

function cmdVisualizeAtPosition(player) {
    let pos = player.blockPos;
    let landId = getLandAtPos(pos);
    
    if (landId) {
        visualizeLand(player, landId);
        player.tell(`${config.appearance.highlightColor}正在显示当前领地的边界`);
    } else {
        let selection = getPlayerSelection(player.xuid);
        if (selection && selection.pos1 && selection.pos2) {
            visualizeSelection(player, selection);
            player.tell(`${config.appearance.highlightColor}正在显示选区边界`);
        } else {
            player.tell(`${config.appearance.warningColor}你不在领地内，也没有活跃的选区`);
        }
    }
}

function cmdSetProtection(player, args) {
    if (args.length < 3) {
        player.tell(`${config.appearance.warningColor}用法: /land protect <领地名> <保护选项> <on/off>`);
        return;
    }
    
    let landName = args[0];
    let option = args[1].toLowerCase();
    let value = args[2].toLowerCase() === "on" || args[2].toLowerCase() === "true";
    
    let xuid = player.xuid;
    let landId = null;
    
    for (let id in landsData) {
        if (landsData[id].name.toLowerCase() === landName.toLowerCase() && 
            (landsData[id].owner === xuid || isLandAdmin(player))) {
            landId = id;
            break;
        }
    }
    
    if (!landId) {
        player.tell(`${config.appearance.warningColor}找不到名为 "${landName}" 的领地，或者你不是所有者`);
        return;
    }
    
    let land = landsData[landId];
    if (!land.protection) {
        land.protection = {};
    }
    
    land.protection[option] = value;
    saveLandsData();
    
    player.tell(`${config.appearance.highlightColor}已将领地 "${landName}" 的 ${option} 设置为 ${value ? "开启" : "关闭"}`);
}

function showHelpMessage(player) {
    let helpMsg = `${config.appearance.highlightColor}=== ZXland 领地系统帮助 ===
${config.appearance.primaryColor}【基础指令】
${config.appearance.secondaryColor}/land${config.appearance.infoColor} - 打开领地主菜单
${config.appearance.secondaryColor}/land new${config.appearance.infoColor} - 开始创建新领地
${config.appearance.secondaryColor}/land pos1${config.appearance.infoColor} - 设置选区点1
${config.appearance.secondaryColor}/land pos2${config.appearance.infoColor} - 设置选区点2
${config.appearance.secondaryColor}/land set${config.appearance.infoColor} - 推送选区点(交替设置)
${config.appearance.secondaryColor}/land buy${config.appearance.infoColor} - 购买选区领地
${config.appearance.secondaryColor}/land giveup${config.appearance.infoColor} - 放弃当前选区
${config.appearance.secondaryColor}/land ok${config.appearance.infoColor} - 确认重选领地

${config.appearance.primaryColor}【领地管理】
${config.appearance.secondaryColor}/land gui${config.appearance.infoColor} - 打开领地管理菜单
${config.appearance.secondaryColor}/land list${config.appearance.infoColor} - 查看我的领地
${config.appearance.secondaryColor}/land info [领地名]${config.appearance.infoColor} - 查看领地信息
${config.appearance.secondaryColor}/land show [领地名]${config.appearance.infoColor} - 显示领地边界
${config.appearance.secondaryColor}/land delete <领地名>${config.appearance.infoColor} - 删除领地

${config.appearance.primaryColor}【传送相关】
${config.appearance.secondaryColor}/land tp${config.appearance.infoColor} - 打开领地传送菜单
${config.appearance.secondaryColor}/land tp <领地名>${config.appearance.infoColor} - 传送到指定领地
${config.appearance.secondaryColor}/land tp set${config.appearance.infoColor} - 设置当前位置为传送点
${config.appearance.secondaryColor}/land tp rm${config.appearance.infoColor} - 重置传送点为默认

${config.appearance.primaryColor}【成员权限】
${config.appearance.secondaryColor}/land add <领地名> <玩家名>${config.appearance.infoColor} - 添加成员
${config.appearance.secondaryColor}/land remove <领地名> <玩家名>${config.appearance.infoColor} - 移除成员
${config.appearance.secondaryColor}/land perm${config.appearance.infoColor} - 设置领地权限
${config.appearance.secondaryColor}/land members${config.appearance.infoColor} - 管理领地成员

${config.appearance.primaryColor}【其他功能】
${config.appearance.secondaryColor}/land fly <领地名>${config.appearance.infoColor} - 切换飞行权限
${config.appearance.secondaryColor}/land z1${config.appearance.infoColor} - 设置子领地选区点1
${config.appearance.secondaryColor}/land z2${config.appearance.infoColor} - 设置子领地选区点2`;

    if (isLandAdmin(player)) {
        helpMsg += `

${config.appearance.warningColor}【管理员指令】
${config.appearance.secondaryColor}/land mgr${config.appearance.infoColor} - 打开管理员面板
${config.appearance.secondaryColor}/land mgr selectool${config.appearance.infoColor} - 设置选区工具`;
    }
    
    player.tell(helpMsg);
}
ll.exports((landId, xuid, permission) => {
    return hasPermission(landId, xuid, permission);
}, "ZXland", "hasPermission");

ll.exports((x, y, z, dimid) => {
    return getLandAt(x, y, z, dimid);
}, "ZXland", "getLandAt");

ll.exports((landId) => {
    return landsData[landId] || null;
}, "ZXland", "getLandInfo");

ll.exports((player, landId) => {
    return visualizeLand(player, landId);
}, "ZXland", "visualizeLand");

ll.exports((player) => {
    return stopVisualizeLand(player);
}, "ZXland", "stopVisualizeLand");

ll.exports((player, landId) => {
    if (!config.protection.enableFlyInLand) return false;
    return enablePlayerFlight(player, landId);
}, "ZXland", "enableFlight");

ll.exports((player) => {
    if (!config.protection.enableFlyInLand) return false;
    disablePlayerFlight(player);
    return true;
}, "ZXland", "disableFlight");
ll.exports((landName, ownerXuid) => {
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.name.toLowerCase() === landName.toLowerCase() && 
            (ownerXuid === null || land.owner === ownerXuid)) {
            return landId;
        }
    }
    return null;
}, "ZXland", "getLandIdByName");

ll.exports((xuid) => {
    let result = [];
    for (let landId in landsData) {
        if (landsData[landId].owner === xuid) {
            result.push(landId);
        }
    }
    return result;
}, "ZXland", "getPlayerLands");

ll.exports((landId, settings) => {
    if (!landsData[landId]) return false;
    
    if (!landsData[landId].protection) {
        landsData[landId].protection = { ...config.protection };
    }
    
    for (let key in settings) {
        if (landsData[landId].protection[key] !== undefined) {
            landsData[landId].protection[key] = settings[key];
        }
    }
    
    saveLandsData();
    return true;
}, "ZXland", "updateLandProtection");

ll.exports((landId, ownerXuid, warpName, x, y, z, isPublic) => {
    return addLandWarp(landId, ownerXuid, warpName, x, y, z, isPublic);
}, "ZXland", "addWarp");

ll.exports((landId, ownerXuid, warpName) => {
    return removeLandWarp(landId, ownerXuid, warpName);
}, "ZXland", "removeWarp");

ll.exports((player, landId, warpName) => {
    return teleportToWarp(player, landId, warpName);
}, "ZXland", "teleportToWarp");

ll.exports((landId) => {
    let land = landsData[landId];
    return land && land.warps ? Object.keys(land.warps) : [];
}, "ZXland", "getWarpList");

ll.exports((landId, ownerXuid, targetXuid, targetName) => {
    return addToBlacklist(landId, ownerXuid, targetXuid, targetName);
}, "ZXland", "addToBlacklist");

ll.exports((landId, ownerXuid, targetXuid) => {
    return removeFromBlacklist(landId, ownerXuid, targetXuid);
}, "ZXland", "removeFromBlacklist");

ll.exports((landId, playerXuid) => {
    return isInBlacklist(landId, playerXuid);
}, "ZXland", "isInBlacklist");

ll.exports((landId) => {
    let land = landsData[landId];
    return land && land.blacklist ? Object.keys(land.blacklist) : [];
}, "ZXland", "getBlacklist");

ll.exports((landId, ownerXuid, memberXuid, groupName) => {
    return setMemberPermissionGroup(landId, ownerXuid, memberXuid, groupName);
}, "ZXland", "setMemberPermissionGroup");

ll.exports((landId, ownerXuid, memberXuids, permissions) => {
    return batchSetMemberPermissions(landId, ownerXuid, memberXuids, permissions);
}, "ZXland", "batchSetMemberPermissions");

ll.exports(() => {
    return Object.keys(config.permissionGroups);
}, "ZXland", "getPermissionGroups");

ll.exports((groupName) => {
    return config.permissionGroups[groupName] || null;
}, "ZXland", "getPermissionGroupInfo");

ll.exports((ownerXuid, groupName, displayName, permissions) => {
    return createCustomPermissionGroup(ownerXuid, groupName, displayName, permissions);
}, "ZXland", "createPermissionGroup");

ll.exports(() => {
    return Object.keys(landsData).length;
}, "ZXland", "getLandCount");

ll.exports((xuid) => {
    let count = 0;
    for (let landId in landsData) {
        if (landsData[landId].owner === xuid) count++;
    }
    return count;
}, "ZXland", "getPlayerLandCount");

ll.exports((landId, ownerXuid, memberXuid) => {
    return addLandMember(landId, ownerXuid, memberXuid);
}, "ZXland", "addMember");

ll.exports((landId, ownerXuid, memberXuid) => {
    return removeLandMember(landId, ownerXuid, memberXuid);
}, "ZXland", "removeMember");

ll.exports((landId) => {
    let land = landsData[landId];
    return land && land.members ? Object.keys(land.members) : [];
}, "ZXland", "getMemberList");

ll.exports((landId, memberXuid) => {
    let land = landsData[landId];
    if (!land || !land.members || !land.members[memberXuid]) return null;
    return land.members[memberXuid];
}, "ZXland", "getMemberInfo");

ll.exports(() => {
    return config;
}, "ZXland", "getConfig");

ll.exports(() => {
    return landsData;
}, "ZXland", "getAllLands");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return null;
    return {
        xuid: land.owner,
        name: land.ownerName || "未知"
    };
}, "ZXland", "getLandOwner");

ll.exports((landId, xuid) => {
    let land = landsData[landId];
    if (!land) return false;
    return land.owner === xuid;
}, "ZXland", "isOwner");

ll.exports((landId, xuid) => {
    let land = landsData[landId];
    if (!land) return false;
    return land.members && land.members[xuid] !== undefined;
}, "ZXland", "isMember");

ll.exports((landId, xuid) => {
    let land = landsData[landId];
    if (!land) return false;
    return land.owner === xuid || (land.members && land.members[xuid] !== undefined);
}, "ZXland", "isLandResident");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return null;
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minY = Math.min(land.pos1.y, land.pos2.y);
    let maxY = Math.max(land.pos1.y, land.pos2.y);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    return {
        min: { x: minX, y: minY, z: minZ },
        max: { x: maxX, y: maxY, z: maxZ },
        dim: land.dim
    };
}, "ZXland", "getLandBounds");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return null;
    let minX = Math.min(land.pos1.x, land.pos2.x);
    let maxX = Math.max(land.pos1.x, land.pos2.x);
    let minY = Math.min(land.pos1.y, land.pos2.y);
    let maxY = Math.max(land.pos1.y, land.pos2.y);
    let minZ = Math.min(land.pos1.z, land.pos2.z);
    let maxZ = Math.max(land.pos1.z, land.pos2.z);
    let sizeX = maxX - minX + 1;
    let sizeY = maxY - minY + 1;
    let sizeZ = maxZ - minZ + 1;
    return {
        volume: land.is2D ? sizeX * sizeZ : sizeX * sizeY * sizeZ,
        area: sizeX * sizeZ,
        dimensions: { x: sizeX, y: sizeY, z: sizeZ }
    };
}, "ZXland", "getLandSize");

ll.exports((x, y, z, dimid, landId) => {
    let land = landsData[landId];
    if (!land) return false;
    return isPositionInLand(x, y, z, dimid, land);
}, "ZXland", "isPositionInLand");

ll.exports((pos, range, dimid) => {
    let result = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.dim !== dimid) continue;
        let centerX = (land.pos1.x + land.pos2.x) / 2;
        let centerZ = (land.pos1.z + land.pos2.z) / 2;
        let dist = Math.sqrt(Math.pow(pos.x - centerX, 2) + Math.pow(pos.z - centerZ, 2));
        if (dist <= range) {
            result.push(landId);
        }
    }
    return result;
}, "ZXland", "getLandsInRange");

ll.exports((dimid) => {
    let result = [];
    for (let landId in landsData) {
        if (landsData[landId].dim === dimid) {
            result.push(landId);
        }
    }
    return result;
}, "ZXland", "getLandsByDimension");

ll.exports((keyword) => {
    let result = [];
    let lowerKeyword = keyword.toLowerCase();
    for (let landId in landsData) {
        if (landsData[landId].name.toLowerCase().includes(lowerKeyword)) {
            result.push(landId);
        }
    }
    return result;
}, "ZXland", "searchLands");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return null;
    return land.permissions || {};
}, "ZXland", "getAllPermissions");

ll.exports((landId, permission) => {
    let land = landsData[landId];
    if (!land || !land.permissions) return null;
    return land.permissions[permission];
}, "ZXland", "getPermission");

ll.exports((landId, permission, value) => {
    let land = landsData[landId];
    if (!land) return false;
    if (!land.permissions) land.permissions = {};
    land.permissions[permission] = value;
    saveLandsData();
    return true;
}, "ZXland", "setPermission");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return null;
    return land.protection || {};
}, "ZXland", "getAllProtections");

ll.exports((landId, key) => {
    let land = landsData[landId];
    if (!land || !land.protection) return null;
    return land.protection[key];
}, "ZXland", "getProtection");

ll.exports((landId, key, value) => {
    let land = landsData[landId];
    if (!land) return false;
    if (!land.protection) land.protection = {};
    land.protection[key] = value;
    saveLandsData();
    return true;
}, "ZXland", "setProtection");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return false;
    land.protection = { ...config.protection };
    saveLandsData();
    return true;
}, "ZXland", "resetProtections");

ll.exports((player, landId) => {
    return teleportToLand(player, landId);
}, "ZXland", "teleportPlayer");

ll.exports((landId, x, y, z) => {
    let land = landsData[landId];
    if (!land) return false;
    land.teleportPos = { x: x, y: y, z: z, dimid: land.dim };
    saveLandsData();
    return true;
}, "ZXland", "setTeleportPos");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land || !land.teleportPos) return null;
    return land.teleportPos;
}, "ZXland", "getTeleportPos");

ll.exports(() => {
    let result = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.warps) {
            for (let warpName in land.warps) {
                if (land.warps[warpName].isPublic) {
                    result.push({
                        landId: landId,
                        landName: land.name,
                        warpName: warpName,
                        pos: land.warps[warpName]
                    });
                }
            }
        }
    }
    return result;
}, "ZXland", "getPublicWarps");

ll.exports((fromXuid, fromName, targetName, landId) => {
    let land = landsData[landId];
    if (!land) return false;
    return sendLandInvitation(fromXuid, fromName, targetName, landId, land.name);
}, "ZXland", "sendInvitation");

ll.exports((playerName) => {
    return invitationsData[playerName] || [];
}, "ZXland", "getInvitations");

ll.exports((playerXuid, landId) => {
    let player = mc.getPlayer(playerXuid);
    if (!player) return false;
    let land = landsData[landId];
    if (!land) return false;
    acceptInvitation(player, landId, land.ownerName);
    return true;
}, "ZXland", "acceptInvitationByXuid");

ll.exports((playerName, landId) => {
    removeInvitation(playerName, landId);
    return true;
}, "ZXland", "declineInvitationByName");

ll.exports((playerXuid, playerName, landId) => {
    return sendJoinApplication(playerXuid, playerName, landId);
}, "ZXland", "sendApplication");

ll.exports((landId) => {
    return applicationsData[landId] || [];
}, "ZXland", "getApplications");

ll.exports((landId, playerXuid) => {
    let land = landsData[landId];
    if (!land) return false;
    let apps = applicationsData[landId] || [];
    let app = apps.find(a => a.xuid === playerXuid);
    if (!app) return false;
    if (!land.members) land.members = {};
    land.members[playerXuid] = {
        name: app.name,
        joinTime: Date.now(),
        permLevel: 1,
        permissionGroup: "member"
    };
    saveLandsData();
    removeApplication(landId, playerXuid);
    return true;
}, "ZXland", "acceptApplicationByXuid");

ll.exports((landId, playerXuid) => {
    removeApplication(landId, playerXuid);
    return true;
}, "ZXland", "declineApplicationByXuid");

ll.exports((parentId) => {
    let result = [];
    for (let landId in landsData) {
        if (landsData[landId].parentId === parentId) {
            result.push(landId);
        }
    }
    return result;
}, "ZXland", "getSubLands");

ll.exports((landId) => {
    let land = landsData[landId];
    return land ? land.parentId || null : null;
}, "ZXland", "getParentLand");

ll.exports((landId) => {
    let land = landsData[landId];
    return land && land.parentId !== undefined && land.parentId !== null;
}, "ZXland", "isSubLand");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return false;
    land.permissions.fly = !land.permissions.fly;
    saveLandsData();
    return land.permissions.fly;
}, "ZXland", "toggleFlight");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land || !land.permissions) return false;
    return land.permissions.fly || false;
}, "ZXland", "getFlightStatus");

ll.exports((playerXuid) => {
    return flyingPlayers[playerXuid] !== undefined;
}, "ZXland", "isPlayerFlying");

ll.exports((landId, eventKey, value) => {
    let land = landsData[landId];
    if (!land) return false;
    if (!land.eventSettings) land.eventSettings = {};
    land.eventSettings[eventKey] = value;
    saveLandsData();
    return true;
}, "ZXland", "setEventSetting");

ll.exports((landId, eventKey) => {
    let land = landsData[landId];
    if (!land || !land.eventSettings) return null;
    return land.eventSettings[eventKey];
}, "ZXland", "getEventSetting");

ll.exports((landId, message) => {
    let land = landsData[landId];
    if (!land) return false;
    land.customEnterMessage = message;
    saveLandsData();
    return true;
}, "ZXland", "setEnterMessage");

ll.exports((landId, message) => {
    let land = landsData[landId];
    if (!land) return false;
    land.customLeaveMessage = message;
    saveLandsData();
    return true;
}, "ZXland", "setLeaveMessage");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return null;
    return {
        enter: land.customEnterMessage || null,
        leave: land.customLeaveMessage || null
    };
}, "ZXland", "getLandMessages");

ll.exports((pos1, pos2, is2D) => {
    return calculateSelectionPrice({ pos1: pos1, pos2: pos2 }, is2D);
}, "ZXland", "calculatePrice");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return 0;
    return calculateSelectionPrice({ pos1: land.pos1, pos2: land.pos2 }, land.is2D);
}, "ZXland", "getLandValue");

ll.exports((ownerXuid, name, pos1, pos2, dimid, is2D) => {
    let landId = generateLandId();
    let player = mc.getPlayer(ownerXuid);
    let ownerName = player ? player.realName : "未知";
    landsData[landId] = {
        name: name,
        owner: ownerXuid,
        ownerName: ownerName,
        pos1: { x: pos1.x, y: pos1.y, z: pos1.z },
        pos2: { x: pos2.x, y: pos2.y, z: pos2.z },
        dim: dimid,
        is2D: is2D,
        createTime: Date.now(),
        permissions: { ...config.defaultPermissions },
        protection: { ...config.protection },
        members: {}
    };
    indexLand(landId, landsData[landId]);
    saveLandsData();
    return landId;
}, "ZXland", "createLand");

ll.exports((landId, operatorXuid) => {
    let land = landsData[landId];
    if (!land) return false;
    let player = mc.getPlayer(operatorXuid);
    if (!player) return false;
    if (land.owner !== operatorXuid && !isLandAdmin(player)) return false;
    removeFromIndex(landId);
    delete landsData[landId];
    saveLandsData();
    return true;
}, "ZXland", "deleteLand");

ll.exports((landId, operatorXuid, newName) => {
    let land = landsData[landId];
    if (!land) return false;
    let player = mc.getPlayer(operatorXuid);
    if (!player) return false;
    if (land.owner !== operatorXuid && !isLandAdmin(player)) return false;
    land.name = newName;
    saveLandsData();
    return true;
}, "ZXland", "renameLand");

ll.exports((landId, fromXuid, toXuid) => {
    let land = landsData[landId];
    if (!land) return false;
    if (land.owner !== fromXuid) return false;
    let newOwner = mc.getPlayer(toXuid);
    land.owner = toXuid;
    land.ownerName = newOwner ? newOwner.realName : "未知";
    saveLandsData();
    return true;
}, "ZXland", "transferLand");

ll.exports((xuid) => {
    let result = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        if (land.members && land.members[xuid]) {
            result.push(landId);
        }
    }
    return result;
}, "ZXland", "getPlayerTrustedLands");

ll.exports((landId, memberXuid) => {
    let land = landsData[landId];
    if (!land || !land.members || !land.members[memberXuid]) return 0;
    return land.members[memberXuid].permLevel || 1;
}, "ZXland", "getMemberLevel");

ll.exports((landId, memberXuid, level) => {
    let land = landsData[landId];
    if (!land || !land.members || !land.members[memberXuid]) return false;
    land.members[memberXuid].permLevel = level;
    saveLandsData();
    return true;
}, "ZXland", "setMemberLevel");

ll.exports((landId) => {
    let land = landsData[landId];
    if (!land) return null;
    return {
        id: landId,
        name: land.name,
        owner: land.owner,
        ownerName: land.ownerName,
        dim: land.dim,
        is2D: land.is2D,
        createTime: land.createTime,
        memberCount: land.members ? Object.keys(land.members).length : 0,
        hasSubLands: Object.values(landsData).some(l => l.parentId === landId)
    };
}, "ZXland", "getLandSummary");

ll.exports(() => {
    let result = [];
    for (let landId in landsData) {
        let land = landsData[landId];
        if (!land.parentId) {
            result.push({
                id: landId,
                name: land.name,
                ownerName: land.ownerName,
                dim: land.dim
            });
        }
    }
    return result;
}, "ZXland", "getAllLandsList");

ll.exports((landId, xuid, operation) => {
    return canManageLand(landId, xuid) || hasPermission(landId, xuid, operation);
}, "ZXland", "canOperate");

logger.info(`[${PLUGIN_NAME}] ZXland领地系统 v${PLUGIN_VERSION.join('.')} 已加载`);
logger.info(`[${PLUGIN_NAME}] 使用 /land 命令访问领地系统`);

mc.listen("onServerStarted", () => {
    if (config.economy.taxEnabled) {
        checkAndCollectTax();
    }
    
    setTimeout(() => {
        let players = mc.getOnlinePlayers();
        for (let i = 0; i < players.length; i++) {
            stopVisualizeLand(players[i]);
        }
    }, 1000);
});

function getDirectionFromPiston(pistonPos, blockPos) {
    let dx = blockPos.x - pistonPos.x;
    let dy = blockPos.y - pistonPos.y;
    let dz = blockPos.z - pistonPos.z;
    
    if (Math.abs(dx) + Math.abs(dy) + Math.abs(dz) != 1) return null;
    
    return {
        x: dx,
        y: dy,
        z: dz
    };
}
mc.listen("onLiquidFlow", (from, to) => {
    try {
        if (!from || !to) return;
        
        let fromX, fromY, fromZ, fromDimid;
        let toX, toY, toZ, toDimid;
        
        if (from.pos) {
            fromX = from.pos.x;
            fromY = from.pos.y;
            fromZ = from.pos.z;
            fromDimid = from.pos.dimid;
        } else if (from.x !== undefined && from.y !== undefined && from.z !== undefined) {
            fromX = from.x;
            fromY = from.y;
            fromZ = from.z;
            fromDimid = from.dimid !== undefined ? from.dimid : 0;
        } else {
            return;
        }
        
        if (to.pos) {
            toX = to.pos.x;
            toY = to.pos.y;
            toZ = to.pos.z;
            toDimid = to.pos.dimid;
        } else if (to.x !== undefined && to.y !== undefined && to.z !== undefined) {
            toX = to.x;
            toY = to.y;
            toZ = to.z;
            toDimid = to.dimid !== undefined ? to.dimid : fromDimid;
        } else {
            return;
        }
        
        let fromLandInfo = getLandAt(fromX, fromY, fromZ, fromDimid);
        let toLandInfo = getLandAt(toX, toY, toZ, toDimid);
        
        if (!fromLandInfo && !toLandInfo) return;
        
        if (fromLandInfo && fromLandInfo.land && fromLandInfo.land.protection && fromLandInfo.land.protection.preventLiquidFlow) {
            return false;
        }
        
        if (toLandInfo && toLandInfo.land && toLandInfo.land.protection && toLandInfo.land.protection.preventLiquidFlow) {
            return false;
        }
        
        if (fromLandInfo && toLandInfo && fromLandInfo.id !== toLandInfo.id) {
            return false;
        }
    } catch (e) {
        logger.error(`[${PLUGIN_NAME}] onLiquidFlow error: ${e}`);
    }
});

function handleLandSelectionTool(pl, block) {
    let now = Date.now();
    let lastClick = lastToolClickTime[pl.xuid] || 0;
    
    if (now - lastClick < 300) {
        return false;
    }
    
    lastToolClickTime[pl.xuid] = now;
    
    if (!selectionsData[pl.xuid]) selectionsData[pl.xuid] = {};
    
    if (!selectionsData[pl.xuid].pos1) {
        selectionsData[pl.xuid].pos1 = { x: block.pos.x, y: block.pos.y, z: block.pos.z, dimid: block.pos.dimid };
        saveSelectionsData();
        pl.tell(`${config.appearance.highlightColor}点1 已设置: ${block.pos.x}, ${block.pos.y}, ${block.pos.z}`);
        pl.tell(`${config.appearance.infoColor}请点击方块设置点2`);
        return true;
    }
    
    if (!selectionsData[pl.xuid].pos2) {
        selectionsData[pl.xuid].pos2 = { x: block.pos.x, y: block.pos.y, z: block.pos.z, dimid: block.pos.dimid };
        saveSelectionsData();
        pl.tell(`${config.appearance.highlightColor}点2 已设置: ${block.pos.x}, ${block.pos.y}, ${block.pos.z}`);
        return true;
    }
    
    selectionsData[pl.xuid] = {};
    selectionsData[pl.xuid].pos1 = { x: block.pos.x, y: block.pos.y, z: block.pos.z, dimid: block.pos.dimid };
    saveSelectionsData();
    pl.tell(`${config.appearance.highlightColor}选区已重置，点1 已设置: ${block.pos.x}, ${block.pos.y}, ${block.pos.z}`);
    pl.tell(`${config.appearance.infoColor}请点击方块设置点2`);
    return true;
}

mc.listen("onStartDestroyBlock", (pl, block) => {
    let item = pl.getHand();
    if (!isSelectionTool(item)) return true;
    
    handleLandSelectionTool(pl, block);
    
    if (selectionsData[pl.xuid] && selectionsData[pl.xuid].pos1 && selectionsData[pl.xuid].pos2) {
        let pos1 = selectionsData[pl.xuid].pos1;
        let pos2 = selectionsData[pl.xuid].pos2;
        
        let minX = Math.min(pos1.x, pos2.x);
        let maxX = Math.max(pos1.x, pos2.x);
        let minY = Math.min(pos1.y, pos2.y);
        let maxY = Math.max(pos1.y, pos2.y);
        let minZ = Math.min(pos1.z, pos2.z);
        let maxZ = Math.max(pos1.z, pos2.z);
        
        let sizeX = maxX - minX + 1;
        let sizeY = maxY - minY + 1;
        let sizeZ = maxZ - minZ + 1;
        let area = sizeX * sizeZ;
        let volume = sizeX * sizeY * sizeZ;
        
        pl.tell(`${config.appearance.primaryColor}========== 当前选区信息 ==========`);
        pl.tell(`${config.appearance.highlightColor}点1: §f${pos1.x}, ${pos1.y}, ${pos1.z}`);
        pl.tell(`${config.appearance.highlightColor}点2: §f${pos2.x}, ${pos2.y}, ${pos2.z}`);
        pl.tell(`${config.appearance.infoColor}尺寸: §f${sizeX} x ${sizeY} x ${sizeZ}`);
        pl.tell(`${config.appearance.infoColor}面积: §f${area} 方块²`);
        pl.tell(`${config.appearance.infoColor}体积: §f${volume} 方块³`);
        pl.tell(`${config.appearance.primaryColor}==============================`);
        
        visualizeSelectionWithDuration(pl, selectionsData[pl.xuid], 10);
        
        pl.tell(`${config.appearance.warningColor}请输入 ${config.appearance.highlightColor}/land${config.appearance.warningColor} 打开菜单进行购买`);
        
        if (config.visualization.showFormAfterPos2) {
            setTimeout(() => {
                showCreateLandMenu(pl);
            }, 500);
        }
    }
    
    return false;
});

mc.listen("onUseItemOn", (pl, item, block, side) => {
    if (!item) return true;
    if (isSelectionTool(item)) {
        return false;
    }
    return true;
});

mc.listen("onJoin", (player) => {
    setTimeout(() => {
        checkPlayerInvitations(player);
    }, 2000);
});