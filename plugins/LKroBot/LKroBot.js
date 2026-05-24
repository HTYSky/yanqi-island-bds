// LiteLoader-AIDS automatic generated
/// <reference path="d:\LL加载库/dts/helperlib/src/index.d.ts"/> 
//加载部分
ll.registerPlugin(
    /* name */ "LKroBot",
    /* introduction */ "LKroBot",
    /* version */[1, 2, 4],
);
//插件作者【https://www.minebbs.com/members/28248/】
//代码编写By: 出众年华 QQ: 2810223372

const pluginPath = './plugins/LKroBot/';
let plData = new JsonConfigFile(pluginPath + 'Config/PlayerData.json');
let config = new JsonConfigFile(pluginPath + 'Config/Config.json');
let whitelistData = new JsonConfigFile(pluginPath + 'Config/Whitelist.json');
let blacklistData = new JsonConfigFile(pluginPath + 'Config/Blacklist.json');
config.init('EconomyType', 1);//经济类型：0:计分板，1：llmoney
config.init('scoreboard', "money");//计分板名称
config.init('quotaMoney', 1000);//配额购买价格
config.init('rateMin', 20);//费率：每分钟N经济
config.init('default_quantity', 1);//默认配额数量
config.init('max_quantity', 3);//个人配额数量上限
config.init('whitelist', false)//是否开启白名单
config.init('blacklist', false)//是否开启黑名单
config.init('billingEnabled', true);//是否启用计费功能
config.init('saveInterval', 60000);//保存剩余时间间隔(毫秒)，默认1分钟
config.init('cleanupExpiredPlayerDataEnabled', true);//是否启用清除长时间不使用的玩家数据(新增假人和上线假人更新操作时间)
config.init('cleanupExpiredPlayerDataInterval', 10);//清理长时间不实用玩家数据时间间隔(天)
config.init('sleepAutoOffline', true);//是否启用睡觉时自动下线假人功能

/**
 * 获取当前在线的模拟玩家列表。
 * 
 * @returns {Array} 返回一个包含所有模拟玩家的数组。
 */
function getSimulatedPlayers() {
    return mc.getOnlinePlayers().filter(pl => pl.isSimulatedPlayer());
}

/**
 * 根据机器人名称获取对应的机器人对象
 * @param {string} botname - 要查找的机器人名称
 * @returns {SimulatedPlayer|undefined} 返回匹配名称的机器人对象,如果未找到则返回undefined
 */
function getBotsByPlayerName(botname) {
    return getSimulatedPlayers().find(pl => pl.name == botname);
};

/**
 * 根据机器人名称从数据中查找对应的配置项
 * @param {string} botname - 要查找的机器人名称
 * @returns {object|undefined} 返回匹配的机器人配置对象，未找到则返回undefined
 */
function SelectName(botname) {
    const dt = JSON.parse(plData.read());
    const array = Object.keys(dt);
    for (let i = 0; i < array.length; i++) {
        const entry = dt[array[i]];
        if (!entry || !entry.botList) continue;
        if (Object.keys(entry.botList).find(key => key == botname)) {
            return entry;
        }
    }
    return;
}

/**
 * 检测机器人名称是否已存在于数据中
 * @param {string} botname - 需要检测的机器人名称
 * @returns {boolean} 如果机器人名称存在返回 true，否则返回 false
 * @description 遍历数据中所有类型的机器人列表，检查指定的机器人名称是否已被使用
 */
function nameDetection(botname) {
    let all_keys = [];
    const dt = JSON.parse(plData.read());
    const array = Object.keys(dt);
    for (let i = 0; i < array.length; i++) { // 修正循环条件，防止数组越界
        const botListType = dt[array[i]];
        if (!botListType || !botListType.botList) continue;
        all_keys = all_keys.concat(Object.keys(botListType.botList));
    }
    return all_keys.indexOf(botname) !== -1; // 使用 !== -1 代替 ? : 简化代码
}

/**
 * 检查机器人是否具有击退抗性属性
 * @param {Object} bot - 机器人对象
 * @returns {boolean} 如果机器人具有击退抗性且值为1则返回true，否则返回false
 */
function checkPreventAndRepel(bot) {
    if (!bot) {
        return false;
    }
    const botAttributes = bot.getAttributes();
    if (!botAttributes || botAttributes.length === 0) {
        return false;
    }
    const botAttr = botAttributes.find(attr => attr.Name === "minecraft:knockback_resistance");
    return botAttr?.Current === 1;
}

/**
 * 检查机器人是否处于无敌状态
 * @param {Object} bot - 机器人实例
 * @returns {boolean} 如果机器人有11号效果(无敌效果)则返回true，否则返回false
 */
function checkInvincible(bot) {
    if (!bot) {
        return false;
    }
    const botEffects = bot.getAllEffects();
    if (!botEffects || botEffects.length === 0) {
        return false;
    }
    const botAttr = botEffects.find(attr => attr === 11);
    return !!botAttr;
}

function checkSaturation(bot) {
    if (!bot) {
        return false;
    }
    const botEffects = bot.getAllEffects();
    if (!botEffects || botEffects.length === 0) {
        return false;
    }
    const botAttr = botEffects.find(attr => attr === 23);
    return !!botAttr;
}
/**
 * 处理玩家经济系统操作
 * @param {Object} player - 玩家对象
 * @param {number} moneyvalue - 要操作的金额
 * @returns {boolean} 操作是否成功
 * @description 根据配置的经济类型(0=计分板/1=货币系统)执行扣款操作
 * 如果金额为0直接返回成功，否则检查玩家余额是否足够
 * 余额不足或计分板不存在时会发送提示信息
 */
function Economy(player, moneyvalue) {
    if (moneyvalue === 0) {
        return true;
    } else {
        switch (config.get('EconomyType')) {
            case 1:
                if (money.get(player.xuid) >= moneyvalue) {
                    money.reduce(player.xuid, moneyvalue);
                    return true;
                } else if (money.get(player.xuid) < moneyvalue) {
                    player.sendText("你太§c§l穷§r了", 0);
                    return false;
                }
            case 0:
                if (mc.getScoreObjective(config.get('scoreboard')) != null) {
                    if (player.getScore(config.get('scoreboard')) >= moneyvalue) {
                        player.reduceScore(config.get('scoreboard'), moneyvalue);
                        return true;
                    } else {
                        player.sendText("你太§c§l穷§r了", 0);
                        return false;
                    }
                } else {
                    player.sendText("计分板不存在", 0);
                    return false;
                }
            default:
                log("red", "未知的经济类型!")
                player.tell("§c未知的经济类型!!!", 4)
                return false;
        }
    }
}

/**
 * 检查玩家是否有权限使用假人系统
 * @param {Player} player - 要检查的玩家对象
 * @returns {boolean} 如果有权限则返回true
 */
function isPlayerInWhitelist(player) {
    if (player.isOP()) return true; // 如果是OP，不受任何限制

    // 检查黑白名单冲突
    const whitelistEnabled = config.get('whitelist');
    const blacklistEnabled = config.get('blacklist');

    if (whitelistEnabled && blacklistEnabled) {
        // 如果同时开启，自动关闭黑名单，优先使用白名单
        config.set('blacklist', false);
        config.read();
    }

    // 黑名单检查
    if (blacklistEnabled) {
        const blacklist = blacklistData.get('players') || [];
        const isInBlacklist = blacklist.some(p => p.uuid === player.uuid || p.name === player.realName);
        return !isInBlacklist; // 不在黑名单中才允许
    }

    // 白名单检查
    if (whitelistEnabled) {
        const whitelist = whitelistData.get('players') || [];
        return whitelist.some(p => p.uuid === player.uuid || p.name === player.realName);
    }

    // 都未开启则直接放行
    return true;
}

function clearBotItems(bot) {
    if (!bot) return;
    const inventoryItems = bot.getInventory().getAllItems();
    const armorItems = bot.getArmor().getAllItems();
    const allItems = inventoryItems.concat(armorItems);
    const pos = bot.pos;
    allItems.forEach(item => {
        if (item && item.type != 0) {
            mc.spawnItem(item, pos);
        }
    });
}
/**
 * 开始假人攻击
 * @param {SimulatedPlayer} bot - 假人对象
 * @param {number} interval - 攻击间隔（毫秒）
 * @param {number} maxAttacks - 最大攻击次数（-1 表示无限）
 */
function startAttack(bot, interval, maxAttacks) {
    if (bot.name == null) {
        return false;
    }
    if (attackLoopMap.has(bot.name)) {
        return false;
    }
    let attackCount = 0;
    const botName = bot.name;
    const attackInterval = setInterval(() => {
        // 检查 bot 是否失效
        if (!bot || bot.name == null) {
            stopAttack(null, botName); // 只传 botName，确保能清理
            return;
        }
        if (maxAttacks !== 0 && attackCount >= maxAttacks) {
            stopAttack(bot, botName);
        }
        if (bot.health <= 0) {
            stopAttack(bot, botName);
        }
        const entity = bot.getEntityFromViewVector();
        if (entity) {
            bot.simulateAttack(entity);
        } else {
            bot.simulateAttack();
        }
        if (maxAttacks != 0) {
            attackCount++;
        }
    }, interval);
    attackLoopMap.set(bot.name, attackInterval);
    return true;// 返回成功
}
/**
 * 停止假人攻击
 * @param {SimulatedPlayer} bot - 假人对象
 */
function stopAttack(bot, botName) {
    // 优先用 botName，兼容 bot 失效的情况
    const name = botName || (bot && bot.name);
    if (!name) return false;
    if (attackLoopMap.has(name)) {
        clearInterval(attackLoopMap.get(name));
        attackLoopMap.delete(name);
        return true;
    }
    return false;
}
/**
 * 开始持续破坏方块
 * @param {Bot} bot 机器人实例
 * @param {number} interval 破坏间隔时间(毫秒)
 * @returns {boolean} 是否成功开始破坏,如果机器人已在破坏则返回false
 */
function startDestroy(bot, interval, mode, player) {
    if (!bot || bot.name == null) {
        return false;
    }
    if (botDestroyMap.has(bot.name)) {
        return false;
    }
    const botName = bot.name;

    let targetBlockIds = [];
    if (mode === 1) {
        const inventory = player.getInventory();
        if (inventory) {
            for (let i = 0; i < 9; i++) {
                const item = inventory.getItem(i);
                if (item && item.isBlock) {
                    log(item.name);
                    targetBlockIds.push(item.id);
                }
            }
        }
        if (targetBlockIds.length === 0) {
            player.sendText("手持栏没有任何方块", 0);
            return false;
        }
    }

    const blockObj = bot.getBlockFromViewVector(true, false, 5, false);
    if (mode === 2) {
        // 目标所有方块
        if (!blockObj) {
            player.sendText("BOT视线上没有方块", 0);
            return false;
        }
    }

    const interact = setInterval(() => {
        // 检查 bot 是否失效
        if (!bot || bot.name == null) {
            stopDestroy(null, botName); // 只传 botName，确保能清理
            return;
        }
        if (bot.health <= 0) {
            stopDestroy(bot, botName);
            return;
        }
        let blockObj1;
        switch (mode) {
            case 0:
                bot.simulateDestroy();
                break;
            case 1:
                blockObj1 = bot.getBlockFromViewVector(true, false, 5, false);
                if (blockObj1 && targetBlockIds.includes(blockObj1.id)) {
                    bot.simulateDestroy(blockObj1.pos);
                }
                break;
            case 2:
                bot.simulateDestroy(blockObj.pos);
                break;
        }
    }, interval);
    botDestroyMap.set(botName, interact);
    return true;
}

function stopDestroy(bot, botName) {
    // 优先用 botName，兼容 bot 失效的情况
    const name = botName || (bot && bot.name);
    if (!name) return false;
    if (botDestroyMap.has(name)) {
        clearInterval(botDestroyMap.get(name));
        botDestroyMap.delete(name);
        // 只有 bot 有效时才调用模拟停止破坏
        if (bot.name) {
            bot.simulateStopDestroyingBlock();
        }
        return true;
    }
    return false;
}
/**
 * 启动机器人的自动交互功能
 * @param {Bot} bot - 需要启动交互的机器人实例
 * @param {number} interval - 交互的时间间隔(毫秒)
 * @returns {boolean} 启动是否成功,如果机器人已在交互列表中则返回false,否则返回true
 * @description 
 * 该函数会按照指定的时间间隔让机器人进行自动交互。
 * 如果机器人生命值降至0,将自动停止交互。
 * 每个机器人同一时间只能有一个交互实例。
 */
function startInteract(bot, interval) {
    if (bot.name == null) {
        return;
    }
    if (botInteractMap.has(bot.name)) {
        return false;
    }
    const botName = bot.name;
    const interact = setInterval(() => {
        // 检查 bot 是否失效
        if (!bot || bot.name == null) {
            stopInteract(null, botName); // 只传 botName，确保能清理
            return;
        }
        if (bot.health <= 0) {
            stopInteract(bot, botName);
            return;
        }
        bot.simulateInteract();
    }, interval);
    botInteractMap.set(bot.name, interact);
    return true;// 返回成功
}
function stopInteract(bot, botName) {
    // 优先用 botName，兼容 bot 失效的情况
    const name = botName || (bot && bot.name);
    if (!name) return false;
    if (botInteractMap.has(name)) {
        clearInterval(botInteractMap.get(name));
        botInteractMap.delete(name);
        // 只有 bot 有效时才调用模拟停止破坏
        if (bot.name) {
            bot.simulateStopInteracting();
        }
        return true;
    }
    return false;
}
function startJump(bot, interval) {
    if (bot.name == null) {
        return;
    }
    if (botJumpMap.has(bot.name)) {
        return false;
    }
    const botName = bot.name;
    const interact = setInterval(() => {
        // 检查 bot 是否失效
        if (!bot || bot.name == null) {
            stopJump(null, botName); // 只传 botName，确保能清理
            return;
        }
        if (bot.health <= 0) {
            stopJump(bot, botName);
            return;
        }
        bot.simulateJump();
    }, interval);
    botJumpMap.set(bot.name, interact);
    return true;// 返回成功
}
function stopJump(bot, botName) {
    // 优先用 botName，兼容 bot 失效的情况
    const name = botName || (bot && bot.name);
    if (!name) return false;
    if (botJumpMap.has(name)) {
        clearInterval(botJumpMap.get(name));
        botJumpMap.delete(name);
        return true;
    }
    return false;
}
function startUseOfItems(bot, data, interval, itemType) {
    if (bot.name == null) {
        return;
    }
    if (botUseOfItemsMap.has(bot.name)) {
        return false;
    }
    let interact;
    const botName = bot.name;
    if (data[2] == false) {
        if (data[3] == null) {
            return;
        }
        interact = setInterval(() => {
            if (!bot || bot.name == null) {
                stopUseOfItems(null, botName); // 只传 botName，确保能清理
                return;
            }
            if (bot.health <= 0) {
                stopUseOfItems(bot, botName);
                return;
            }
            bot.simulateUseItem(data[3]);
        }, interval);
    } else {
        interact = setInterval(() => {
            if (!bot || bot.name == null) {
                stopUseOfItems(null, botName); // 只传 botName，确保能清理
                return;
            }
            const botName = bot.name;
            if (bot.health <= 0) {
                stopUseOfItems(bot, botName);
                return;
            }
            const inventorys = bot.getInventory().getAllItems();
            const item = inventorys.find(item => item && item.type == itemType.type);
            if (item) {
                bot.simulateUseItem(item);
            }
            bot.refreshItems();//刷新物品栏和盔甲栏
        }, interval);
    }
    botUseOfItemsMap.set(bot.name, interact);
    return true;// 返回成功
}
function stopUseOfItems(bot, botName) {
    // 优先用 botName，兼容 bot 失效的情况
    const name = botName || (bot && bot.name);
    if (!name) return false;
    if (botUseOfItemsMap.has(name)) {
        clearInterval(botUseOfItemsMap.get(name));
        botUseOfItemsMap.delete(name);
        // 只有 bot 有效时才调用模拟停止破坏
        if (bot.name) {
            bot.simulateStopUsingItem();
            bot.refreshItems();//刷新物品栏和盔甲栏
        }
        return true;
    }
    return false;
}


// 添加一个全局 Map 来记录每个假人的攻击状态
const attackLoopMap = new Map();
//假人破坏方块名单
const botDestroyMap = new Map();
//假人交互名单
const botInteractMap = new Map();
//假人跳跃名单
const botJumpMap = new Map();
//假人使用物品
const botUseOfItemsMap = new Map();

// 计费系统相关变量
const playerBillingMap = new Map(); // 存储玩家计费状态 {playerUuid: {remainingTime: number, isActive: boolean, lastUpdate: number}}
const playerCleanupTimers = new Map(); // 存储玩家清理定时器 {playerUuid: intervalId}
const billingTimers = new Map(); // 存储玩家计费定时器 {playerUuid: intervalId}
const saveDataTimer = setInterval(saveAllPlayerData, config.get('saveInterval')); // 定时保存数据

function findBotInMaps(botName) {
    if (attackLoopMap.has(botName)) {
        return "假人§c§l攻击§r§6操作";
    }
    if (botDestroyMap.has(botName)) {
        return "假人§c§l破坏§r§6操作";
    }
    if (botInteractMap.has(botName)) {
        return "假人§c§l互动§r§6操作";
    }
    if (botUseOfItemsMap.has(botName)) {
        return "假人§c§l使用物品§r§6操作";
    }
    return null;
}

/**
 * 初始化玩家计费数据
 * @param {string} playerUuid - 玩家UUID
 * @param {number} timeMinutes - 购买的时间(分钟)
 */
function initPlayerBilling(playerUuid, timeMinutes) {
    if (!config.get('billingEnabled')) return;

    const currentTime = Date.now();
    const remainingTime = timeMinutes * 60 * 1000; // 转换为毫秒

    playerBillingMap.set(playerUuid, {
        remainingTime: remainingTime,
        isActive: false,
        lastUpdate: currentTime,
        totalTime: remainingTime
    });

    // 获取或创建玩家数据
    let pldt = plData.get(playerUuid);
    if (!pldt || pldt.boos == null) {
        // 第一次购买时创建玩家数据
        const player = mc.getPlayer(playerUuid);
        pldt = {
            boos: player ? player.realName : data.uuid2name(playerUuid) || "未知玩家",
            quantity: config.get('default_quantity', 1),
            botList: {}
        };
    }

    pldt.billingInfo = {
        remainingTime: remainingTime,
        lastUpdate: currentTime,
        totalTime: remainingTime
    };
    plData.set(playerUuid, pldt);
    plData.read();
}

/**
 * 检查玩家是否有在线的假人
 * @param {string} playerUuid - 玩家UUID
 * @returns {boolean} 是否有在线假人
 */
function hasOnlineBots(playerUuid) {
    const pldt = plData.get(playerUuid);
    if (!pldt || !pldt.botList) return false;

    const botNames = Object.keys(pldt.botList);
    return botNames.some(botName => getBotsByPlayerName(botName) !== undefined);
}

/**
 * 启动玩家计费
 * @param {string} playerUuid - 玩家UUID
 */
function startPlayerBilling(playerUuid) {
    if (!config.get('billingEnabled')) return;

    const billingData = playerBillingMap.get(playerUuid);
    if (!billingData || billingData.isActive) return;

    // 检查是否有在线假人
    if (!hasOnlineBots(playerUuid)) return;

    billingData.isActive = true;
    billingData.lastUpdate = Date.now();

    // 启动计费定时器
    const billingTimer = setInterval(() => {
        updatePlayerBilling(playerUuid);
    }, 60000); // 每分钟更新一次

    billingTimers.set(playerUuid, billingTimer);

    // 如果剩余时间少于10分钟，重新设置清理定时器
    if (billingData.remainingTime <= 10 * 60 * 1000 && !playerCleanupTimers.has(playerUuid)) {
        const cleanupTimer = setTimeout(() => {
            cleanupPlayerBots(playerUuid);
        }, billingData.remainingTime);

        playerCleanupTimers.set(playerUuid, cleanupTimer);
    }

}

/**
 * 停止玩家计费
 * @param {string} playerUuid - 玩家UUID
 * @param {boolean} skipUpdate - 是否跳过最后一次计费更新，用于避免无限循环
 */
function stopPlayerBilling(playerUuid, skipUpdate = false) {
    const billingData = playerBillingMap.get(playerUuid);
    if (!billingData || !billingData.isActive) return;

    // 只有在不跳过更新时才进行最后一次计费更新
    if (!skipUpdate) {
        // 手动更新计费，避免调用可能导致循环的updatePlayerBilling
        const currentTime = Date.now();
        const elapsedTime = currentTime - billingData.lastUpdate;

        // 检查是否还有在线假人

        billingData.remainingTime -= elapsedTime;
        billingData.lastUpdate = currentTime;
    }



    billingData.isActive = false;

    // 清除计费定时器
    if (billingTimers.has(playerUuid)) {
        clearInterval(billingTimers.get(playerUuid));
        billingTimers.delete(playerUuid);
    }

    // 清除延迟清理定时器，防止在停止计费后仍然执行清理
    if (playerCleanupTimers.has(playerUuid)) {
        clearInterval(playerCleanupTimers.get(playerUuid));
        playerCleanupTimers.delete(playerUuid);
    }

}

/**
 * 更新玩家计费
 * @param {string} playerUuid - 玩家UUID
 */
function updatePlayerBilling(playerUuid) {
    const billingData = playerBillingMap.get(playerUuid);
    if (!billingData || !billingData.isActive) return;

    const currentTime = Date.now();
    const elapsedTime = currentTime - billingData.lastUpdate;

    // 检查是否还有在线假人
    if (!hasOnlineBots(playerUuid)) {
        stopPlayerBilling(playerUuid);
        return;
    }

    billingData.remainingTime -= elapsedTime;
    billingData.lastUpdate = currentTime;

    // 检查剩余时间
    if (billingData.remainingTime <= 0) {
        // 时间用完，先停止计费再清理玩家数据
        billingData.isActive = false;

        // 清除计费定时器
        if (billingTimers.has(playerUuid)) {
            clearInterval(billingTimers.get(playerUuid));
            billingTimers.delete(playerUuid);
        }

        // 清理玩家数据
        cleanupPlayerBots(playerUuid);
        return;
    }

    // 如果剩余时间少于10分钟，设置清理定时器
    if (billingData.remainingTime <= 10 * 60 * 1000 && !playerCleanupTimers.has(playerUuid)) {
        const cleanupTimer = setTimeout(() => {
            cleanupPlayerBots(playerUuid);
        }, billingData.remainingTime);

        playerCleanupTimers.set(playerUuid, cleanupTimer);

        // 通知玩家
        const player = mc.getPlayer(playerUuid);
        if (player) {
            const formattedTime = getFormattedRemainingTime(playerUuid);
            player.sendText(`§c§l警告：您的假人使用时间还剩 ${formattedTime}！`, 0);
        }
    }
}

/**
 * 清理玩家的所有假人和数据
 * @param {string} playerUuid - 玩家UUID
 */
function cleanupPlayerBots(playerUuid) {
    const pldt = plData.get(playerUuid);
    if (!pldt || !pldt.botList) return;

    const botNames = Object.keys(pldt.botList);

    // 停止所有假人的操作并下线
    botNames.forEach(botName => {
        const bot = getBotsByPlayerName(botName);
        if (bot) {
            // 停止所有操作
            stopAttack(bot, botName);
            stopDestroy(bot, botName);
            stopInteract(bot, botName);
            stopJump(bot, botName);
            stopUseOfItems(bot, botName);

            // 清理物品
            clearBotItems(bot);

            // 下线假人
            bot.simulateDisconnect();
        }
    });

    // 清除清理定时器
    if (playerCleanupTimers.has(playerUuid)) {
        clearInterval(playerCleanupTimers.get(playerUuid));
        playerCleanupTimers.delete(playerUuid);
    }

    // 清除计费数据
    playerBillingMap.delete(playerUuid);

    // 完全删除该玩家的所有数据信息
    plData.delete(playerUuid);
    plData.read();

    // 通知玩家
    const player = mc.getPlayer(playerUuid);
    if (player) {
        player.sendText("§c§l您的假人使用时间已用完，所有假人已下线，所有数据已清除！", 0);
        player.sendText("§e§l如需继续使用，请重新购买时间。", 0);
    }

}

/**
 * 保存所有玩家的计费数据
 */
function saveAllPlayerData() {
    if (!config.get('billingEnabled')) return;

    playerBillingMap.forEach((billingData, playerUuid) => {
        if (billingData.isActive) {
            // 更新计费
            updatePlayerBilling(playerUuid);
        }

        // 保存到文件
        let pldt = plData.get(playerUuid) || {};
        pldt.billingInfo = {
            remainingTime: billingData.remainingTime,
            lastUpdate: billingData.lastUpdate,
            totalTime: billingData.totalTime
        };
        plData.set(playerUuid, pldt);
    });

    plData.read();
}

/**
 * 从文件加载玩家计费数据
 * @param {string} playerUuid - 玩家UUID
 */
function loadPlayerBillingData(playerUuid) {
    if (!config.get('billingEnabled')) return;

    const pldt = plData.get(playerUuid);
    if (pldt && pldt.billingInfo) {
        const currentTime = Date.now();
        const timeSinceLastUpdate = currentTime - pldt.billingInfo.lastUpdate;

        // 如果玩家有在线假人，需要扣除离线期间的时间
        let remainingTime = pldt.billingInfo.remainingTime;
        if (hasOnlineBots(playerUuid)) {
            remainingTime -= timeSinceLastUpdate;
        }

        if (remainingTime > 0) {
            playerBillingMap.set(playerUuid, {
                remainingTime: remainingTime,
                isActive: false,
                lastUpdate: currentTime,
                totalTime: pldt.billingInfo.totalTime
            });

            // 如果有在线假人，启动计费
            if (hasOnlineBots(playerUuid)) {
                startPlayerBilling(playerUuid);
            }
        } else {
            // 时间已用完，清理数据
            cleanupPlayerBots(playerUuid);
        }
    }
}

/**
 * 获取玩家剩余时间（分钟）- 实时计算
 * @param {string} playerUuid - 玩家UUID
 * @returns {number} 剩余时间（分钟）
 */
function getPlayerRemainingTime(playerUuid) {
    const billingData = playerBillingMap.get(playerUuid);
    if (!billingData) return 0;

    // 实时计算剩余时间
    let currentRemainingTime = billingData.remainingTime;

    // 如果正在计费且有在线假人，需要扣除从上次更新到现在的时间
    if (billingData.isActive && hasOnlineBots(playerUuid)) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - billingData.lastUpdate;
        currentRemainingTime = billingData.remainingTime - elapsedTime;
    }

    return Math.ceil(currentRemainingTime / (60 * 1000));
}

/**
 * 格式化剩余时间为时分秒显示（实时计算）
 * @param {string} playerUuid - 玩家UUID
 * @returns {string} 格式化的时间字符串 (如: "1小时23分45秒")
 */
function getFormattedRemainingTime(playerUuid) {
    const billingData = playerBillingMap.get(playerUuid);
    if (!billingData) return "0秒";

    // 实时计算剩余时间
    let currentRemainingTime = billingData.remainingTime;

    // 如果正在计费且有在线假人，需要扣除从上次更新到现在的时间
    if (billingData.isActive && hasOnlineBots(playerUuid)) {
        const currentTime = Date.now();
        const elapsedTime = currentTime - billingData.lastUpdate;
        currentRemainingTime = billingData.remainingTime - elapsedTime;
    }

    if (currentRemainingTime <= 0) return "0秒";

    const totalSeconds = Math.ceil(currentRemainingTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let timeStr = "";
    if (hours > 0) {
        timeStr += `${hours}小时`;
    }
    if (minutes > 0) {
        timeStr += `${minutes}分`;
    }
    if (seconds > 0 || timeStr === "") {
        timeStr += `${seconds}秒`;
    }

    return timeStr;
}
function cleanupExpiredPlayerData() {
    const pldt = JSON.parse(plData.read());
    const currentTime = Date.now();
    const expirationDays = config.get('cleanupExpiredPlayerDataInterval'); // 过期天数
    const expirationTime = expirationDays * 24 * 60 * 60 * 1000; // 转换为毫秒
    Object.keys(pldt).forEach(playerUuid => {
        const playerData = pldt[playerUuid];
        playerData.lastOperation = playerData.lastOperation || currentTime;
        plData.set(playerUuid, playerData);
        if (playerData.lastOperation) {
            const timeSinceLastOperation = currentTime - playerData.lastOperation;
            if (timeSinceLastOperation > expirationTime) {
                // 清理过期玩家数据
                cleanupPlayerBots(playerUuid);
                plData.delete(playerUuid);
                plData.read();
            }
        }
    });
};
//插件加载完成之后清理长时间不使用玩家的数据
if (config.get('cleanupExpiredPlayerDataEnabled')) {
    cleanupExpiredPlayerData();
}
mc.listen("onServerStarted", () => {
    const cmd = mc.newCommand("lkbot", "购买假人", PermType.Any);
    //cmd.setEnum("ListAction", ["player"]);
    //cmd.mandatory("玩家UUID", ParamType.RawText);
    cmd.overload([]);
    cmd.setCallback((_cmd, _ori, out, res) => {
        if (_ori.player !== null) {
            LkroBotMain(_ori.player);
        }
    });
    cmd.setup();

    // 加载所有玩家的计费数据
    const allPlayerData = JSON.parse(plData.read());
    Object.keys(allPlayerData).forEach(playerUuid => {
        loadPlayerBillingData(playerUuid);
    });

});

// 监听假人离开事件
mc.listen("onLeft", (player) => {
    if (player.isSimulatedPlayer()) {
        const botData = SelectName(player.name);
        if (botData && config.get('billingEnabled')) {
            const playerUuid = data.name2uuid(botData.boos);
            // 检查是否还有其他在线假人
            setTimeout(() => {
                if (!hasOnlineBots(playerUuid)) {
                    stopPlayerBilling(playerUuid);
                }
            }, 1000); // 延迟1秒检查，确保假人已完全下线
        }
    }
});

// 监听假人加入事件
mc.listen("onJoin", (player) => {
    if (player.isSimulatedPlayer()) {
        const botData = SelectName(player.name);
        if (botData && config.get('billingEnabled')) {
            const playerUuid = data.name2uuid(botData.boos);
            loadPlayerBillingData(playerUuid);
            if (hasOnlineBots(playerUuid)) {
                startPlayerBilling(playerUuid);
            }
        }
    }
});

function LkroBotMain(player) {
    if (!isPlayerInWhitelist(player)) {
        const whitelistEnabled = config.get('whitelist');
        const blacklistEnabled = config.get('blacklist');
        let message = '你没有权限使用假人系统！';

        if (whitelistEnabled) {
            message = '你不在假人系统白名单内，无法使用本功能！';
        } else if (blacklistEnabled) {
            message = '你在假人系统黑名单内，无法使用本功能！';
        }

        player.sendSimpleForm('提示', message, ['OK'], [""], function () { });
        return;
    }

    const pldt = plData.get(player.uuid);
    const main = mc.newSimpleForm();

    // 检查计费状态
    let isExpired = false;
    let hasValidTime = false;

    if (config.get('billingEnabled')) {
        const remainingTime = getPlayerRemainingTime(player.uuid);
        hasValidTime = remainingTime > 0;
        isExpired = !hasValidTime && pldt; // 有数据但时间用完了
    }

    // 设置主菜单标题
    if (isExpired) {
        main.setTitle("§c§l假人主菜单 - 已过期");
    } else if (!pldt && config.get('billingEnabled')) {
        main.setTitle("§7§l假人主菜单 - 未购买");
    } else {
        main.setTitle("§b§l假人主菜单");
    }

    let contentText = "";
    if (pldt && hasValidTime) {
        const botCount = pldt.botList ? Object.keys(pldt.botList).length : 0;
        const activeBotCount = pldt.botList ? Object.keys(pldt.botList).filter(name => getBotsByPlayerName(name)).length : 0;

        // 计费信息
        let billingText = "";
        if (config.get('billingEnabled')) {
            const formattedTime = getFormattedRemainingTime(player.uuid);
            const billingData = playerBillingMap.get(player.uuid);
            const isActive = billingData ? billingData.isActive : false;

            billingText = `\n§6§l剩余时间：§r§f${formattedTime} ${isActive ? '§a§l(计费中)' : '§7§l(暂停)'}`;
        }

        contentText = `§6§l假人状态：§r§f${botCount}个假人，${activeBotCount}个在线\n` +
            `§6§l配额数量：§r§f${pldt.quantity || 0}/${config.get('max_quantity')}个${billingText}`;
    } else if (isExpired) {
        contentText = `§c§l您的使用时间已过期\n§7请购买时间后继续使用`;
    } else {
        contentText = `§7欢迎使用假人系统`;
    }

    main.setContent(contentText);

    // 只有在有有效时间时才显示假人相关功能
    if (!config.get('billingEnabled') || hasValidTime) {
        main.addButton("§a§l新增假人", 'textures/ui/color_plus');
        main.addButton("§e§l管理假人", 'textures/ui/gear');
    }
    main.addButton("§d§l查询假人信息", 'textures/ui/magnifyingGlass');
    if (config.get('billingEnabled')) {
        main.addButton("§6§l购买时间", 'textures/ui/timer');
        // 只有在有有效时间时才显示购买配额按钮
        if (hasValidTime) {
            main.addButton("§b§l购买配额", 'textures/ui/dressing_room_skins');
        }
    }

    if (player.isOP()) {
        main.addButton("§c§l管理员操作", 'textures/ui/op');
    }

    player.sendForm(main, function (player, data) {
        if (data == null) {
            return;
        }
        let buttonIndex = 0;

        // 只有在有有效时间时才有假人相关按钮
        if (!config.get('billingEnabled') || hasValidTime) {
            // 新增假人
            if (data === buttonIndex++) {
                AddBot(player);
                return;
            }

            // 管理假人
            if (data === buttonIndex++) {
                ManageBot(player);
                return;
            }
        }
        // 查询假人信息
        if (data === buttonIndex++) {
            SelectBot(player);
            return;
        }
        // 购买时间（如果启用计费）
        if (config.get('billingEnabled') && data === buttonIndex++) {
            BuyTimeGui(player);
            return;
        }

        // 购买配额（如果启用计费且有有效时间）
        if (config.get('billingEnabled') && hasValidTime && data === buttonIndex++) {
            BuyQuotaGui(player);
            return;
        }

        // 管理员操作（如果是OP）
        if (player.isOP() && data === buttonIndex++) {
            AdminOperation(player);
            return;
        }
    });
}

// 添加假人表单美化
function AddBot(pl) {
    let pldt = plData.get(pl.uuid);
    // 检查计费状态
    if (config.get('billingEnabled')) {
        const remainingTime = getPlayerRemainingTime(pl.uuid);
        if (remainingTime <= 0) {
            pl.sendSimpleForm('§c§l提示', '§c您还没有购买时间或时间已用完，请先购买时间！', ['§aOK'], [""], function () {
                LkroBotMain(pl);
            });
            return;
        }
        // 如果玩家数据不存在，说明还没有购买过时间
        if (!pldt) {
            pl.sendSimpleForm('§c§l提示', '§c请先购买时间后再创建假人！', ['§aOK'], [""], function () {
                LkroBotMain(pl);
            });
            return;
        }
    }

    let fm = mc.newCustomForm();
    fm.setTitle("§a§l添加假人");
    if (pldt) {
        const botListKeys = Object.keys(pldt.botList || {});
        fm.addLabel(`§e已使用§l§a${botListKeys.length}§r§e个假人配额，持有配额§l§b${pldt.quantity}§r§e个假人，配额上限§l§c${config.get('max_quantity')}§r§e个`);
    } else {
        fm.addLabel(`§c欢迎使用假人系统`);
    }
    fm.addInput('§b输入假人的名字', '例如：监工1号')
    fm.addSwitch('§a开启假人无敌', true)
    fm.addSwitch('§e开启假人防击退', true)
    fm.addSwitch(`§d开启无限饱和度`, true)
    pl.sendForm(fm, function (player, data) {
        if (data == null) {
            return;
        }
        if (nameDetection(data[1] + `§b§l假人`)) {
            pl.sendSimpleForm('提示', `已经有人使用了这个名字`, ['OK'], [""], function (pl, id, reason) {
                if (id == null) {
                    return;
                }
                switch (id) {
                    case 0:
                        AddBot(pl);
                        break;
                    default:
                        return;
                }
            })
            return;
        }
        if (pldt?.botList && Object.keys(pldt?.botList).length >= pldt.quantity) {
            pl.sendSimpleForm('§c§l提示', `已达拥有配额${pldt.quantity}个上限。个人配额上限${config.get('max_quantity')}个`, ['§aOK'], [""], function (pl, id, reason) {
                if (id == null) {
                    return;
                }
                switch (id) {
                    case 0:
                        LkroBotMain(pl);
                        break;
                    default:
                        return;
                }
                return;
            })
            player.sendText(`已达拥有配额${pldt.quantity}个上限。个人配额上限${config.get('max_quantity')}个`, 0);
            return;
        }
        // 检查计费系统
        if (config.get('billingEnabled')) {
            const remainingTime = getPlayerRemainingTime(player.uuid);
            if (remainingTime <= 0) {
                pl.sendSimpleForm('§c§l提示', '§c您的使用时间已用完，请先购买时间！', ['§aOK'], [""], function (pl, id, reason) {
                    if (id == null) {
                        return;
                    }
                    switch (id) {
                        case 0:
                            LkroBotMain(pl);
                            break;
                        default:
                            return;
                    }
                });
                return;
            }
        }
        if (!pldt || pldt.boos == undefined) {
            const prev = pldt || {};
            pldt = {
                // 数据完整性检测（pldt 可能为 null，不可直接读 pldt.boos）
                boos: prev.boos == undefined ? player.realName : prev.boos,
                quantity: prev.quantity == undefined ? config.get('default_quantity', 1) : prev.quantity,
                botList: prev.botList == undefined ? {} : prev.botList
            };
            plData.set(pl.uuid, pldt);
            plData.read();
        }
        const bot = mc.spawnSimulatedPlayer(data[1] + `§b§l假人`, player.feetPos);
        let ab = bot.getNbt();
        const newRotation = new NbtList([
            new NbtFloat(pl.getNbt().getData('Rotation').getData(0)),
            new NbtFloat(pl.getNbt().getData('Rotation').getData(1))
        ])
        ab.setTag('Rotation', newRotation)
        bot.setNbt(ab);
        if (data[2]) {
            bot.addEffect(11, -1, 255, false)
        }
        if (data[3]) {
            bot.setKnockbackResistance(1)
        }
        if (data[4]) {
            bot.addEffect(23, -1, 255, false)
        }
        pldt.botList[bot.name] = {
            botPos: {
                x: bot.feetPos.x,
                y: bot.feetPos.y,
                z: bot.feetPos.z,
                dimid: bot.feetPos.dimid,
            },
            invincible: data[2],
            preventAndRepel: data[3],
            saturation: data[4]
        }
        // 更新操作时间
        const currentTime = Date.now();
        pldt.lastOperation = currentTime;

        plData.set(player.uuid, pldt)
        plData.read();

        // 启动计费
        if (config.get('billingEnabled')) {
            startPlayerBilling(player.uuid);
        }
    }
    )
}

// 管理假人表单美化
function ManageBot(pl) {
    const pldt = plData.get(pl.uuid);
    // 检查计费状态
    if (config.get('billingEnabled')) {
        // 检查是否有有效的假人数据
        if (!pldt) {
            pl.sendSimpleForm('§c§l提示', '§c请先购买时间后再管理假人', ['§aOK'], [""], function () {
                LkroBotMain(pl);
            });
            return;
        }
        const remainingTime = getPlayerRemainingTime(pl.uuid);
        if (remainingTime <= 0) {
            pl.sendSimpleForm('§c§l提示', '§c您的时间已用完或还没有购买时间，请先购买时间！', ['§aOK'], [""], function () {
                LkroBotMain(pl);
            });
            return;
        }
    }
    // 检查是否有有效的假人数据
    if (!pldt) {
        pl.sendSimpleForm('§c§l提示', '§c请先创建假人后再管理假人', ['§aOK'], [""], function () {
            LkroBotMain(pl);
        });
        return;
    }
    let fm = mc.newSimpleForm()
    fm.setTitle("§e§l我的假人");

    const botListKeys = Object.keys(pldt.botList || {});
    const activeBotCount = botListKeys.filter(name => getBotsByPlayerName(name)).length;

    fm.setContent(
        `§e已使用§l§a${botListKeys.length}§r§e个假人配额，持有配额§l§b${pldt.quantity}§r§e个假人，配额上限§l§c${config.get('max_quantity')}§r§e个\n` +
        `§6在线假人：§l§a${activeBotCount}§r§6个`
    );

    for (let index = 0; index < botListKeys.length; index++) {
        const botName = botListKeys[index];
        const bot = getBotsByPlayerName(botName);
        let statusText = "";

        if (bot) {
            if (bot.health <= 0) {
                statusText = "§a§l在线§r(§c死亡§r)";
            } else {
                statusText = "§a§l在线";
            }
        } else {
            statusText = "§c§l离线";
        }
        fm.addButton(`§b${botName} ${statusText}`, `textures/ui/icon_steve`);
    }

    pl.sendForm(fm, function (player, id, reason) {
        if (id == null) {
            return;
        }
        const botObj = getBotsByPlayerName(botListKeys[id])
        botControl(player, botObj, botListKeys[id])
    })
}
function botControl(pl, botObj, botname, isAdmin) {
    let fm = mc.newSimpleForm();
    if (botObj) {
        fm.setTitle(`§l§f当前假人：§b§l${botname}`);
        if (isAdmin) {
            const botData = SelectName(botname);
            fm.setContent(botData ? `§l主人：§a${botData.boos}` : "未找到该假人信息");
        }
        fm.addButton("§l下线假人", `textures/ui/cancel`);
        fm.addButton("§l删除假人", `textures/ui/icon_trash`);
        fm.addButton("§l重生假人", `textures/blocks/bed_head_side`);
        fm.addButton(`${attackLoopMap.has(botname) ? "§c§l停止攻击" : "§l攻击视线上实体"}`, `textures/ui/strength_effect`);
        fm.addButton(`§l抗击退：${checkPreventAndRepel(botObj) ? "§a§l已开启" : "§c§l已关闭"}`, `textures/ui/lock_color`);
        fm.addButton(`§l无敌：${checkInvincible(botObj) ? "§a§l已开启" : "§c§l已关闭"}`, `textures/ui/absorption_effect`);
        fm.addButton(`§l无限饱和度：${checkSaturation(botObj) ? "§a§l已开启" : "§c§l已关闭"}`, `textures/ui/hunger_effect`)
        fm.addButton(`${botDestroyMap.has(botname) ? "§c§l停止破坏方块" : "§l开启破坏方块"}`, `textures/ui/haste_effect`);
        fm.addButton(`${botInteractMap.has(botname) ? "§c§l停止交互" : "§l开启交互"}`, `textures/blocks/crafting_table_front`);
        fm.addButton(`${botJumpMap.has(botname) ? "§c§l停止跳跃" : "§l开启跳跃"}`, `textures/ui/jump_boost_effect`);
        fm.addButton(`§l看向§b(${botObj.getBlockFromViewVector(true, false, 5, false)?.name})方块§e或§a实体(${botObj.getEntityFromViewVector(5)?.name})`, `textures/ui/conduit_power_effect`);
        fm.addButton("§l查看假人物品栏", `textures/ui/icon_blackfriday`);
        fm.addButton(`§l${botUseOfItemsMap.has(botname) ? "§c§l停止使用物品" : "§l开启使用物品"}`, `textures/items/trident`);
        fm.addButton(`§l传送假人到我的位置`, `textures/ui/switch_accounts`);
        fm.addButton(`§l切换主手物品 §f[${botObj.getHand()?.name || '空'}]`, `textures/ui/attack`);
        if (isAdmin) {
            fm.addButton(`§l传送我到假人位置`, `textures/ui/switch_accounts`);
        }
        pl.sendForm(fm, function (player, id, reason) {
            if (id == null) {
                return;
            }
            switch (id) {
                case 0:
                    stopAttack(botObj, botname);
                    stopDestroy(botObj, botname);
                    stopInteract(botObj, botname);
                    stopJump(botObj, botname);
                    clearBotItems(botObj);
                    stopUseOfItems(botObj, botname);
                    botObj.simulateDisconnect();

                    // 检查是否还有其他在线假人，如果没有则停止计费
                    if (config.get('billingEnabled')) {
                        const botData = SelectName(botname);
                        if (botData) {
                            const playerUuid = data.name2uuid(botData.boos);
                            if (!hasOnlineBots(playerUuid)) {
                                stopPlayerBilling(playerUuid);
                            }
                        }
                    }

                    if (isAdmin) {
                        BotListGui(pl);
                    } else {
                        ManageBot(pl);
                    }
                    break;
                case 1:
                    stopAttack(botObj, botname);
                    stopDestroy(botObj, botname);
                    stopInteract(botObj, botname);
                    stopJump(botObj, botname);
                    clearBotItems(botObj);
                    stopUseOfItems(botObj, botname);
                    botObj.simulateDisconnect();
                    if (SelectName(botname)) {
                        const botData = SelectName(botname)
                        const plUuid = data.name2uuid(botData.boos)
                        let pldt = plData.get(plUuid);
                        delete pldt.botList[botname]
                        plData.set(plUuid, pldt);
                        plData.read();
                        if (isAdmin) {
                            BotListGui(pl);
                        } else {
                            ManageBot(pl);
                        }
                    }
                    break;
                case 2:
                    botObj.simulateRespawn();
                    if (isAdmin) {
                        BotListGui(pl);
                    } else {
                        ManageBot(pl);
                    }
                    break;
                case 3:
                    if (attackLoopMap.has(botname)) {
                        if (stopAttack(botObj, botname)) {
                            pl.tell("§a§l停止攻击成功", 0)
                        } else {
                            pl.tell("§c§l停止攻击失败", 0)
                        }
                    } else {
                        if (findBotInMaps(botname) != null) {
                            pl.sendSimpleForm('§l提示', `§l§6请先停止${findBotInMaps(botname)}!!!`, ['OK'], [""], function (pl, id, reason) {
                                if (id == null) {
                                    return;
                                }
                                switch (id) {
                                    case 0:
                                        if (isAdmin) {
                                            BotListGui(pl);
                                        } else {
                                            ManageBot(pl);
                                        }
                                        break;
                                    default:
                                        return;
                                }
                            })
                            return;
                        }
                        let fm = mc.newCustomForm();
                        fm.setTitle("§l假人攻击设置")
                        fm.addInput('攻击间隔(最低500ms)', `最低500ms`, `500`);
                        fm.addSlider(`攻击次数(默认0无限)`, 0, 1000);
                        pl.sendForm(fm, function (player, data, reason) {
                            if (data == null) {
                                return;
                            }
                            const interval = parseInt(data[0]);
                            if (isNaN(interval) || interval < 500) {
                                pl.sendSimpleForm('提示', '攻击间隔必须为大于等于 200 的数字！', ['OK'], [""], function (pl, id, reason) {
                                    if (id == null) {
                                        return;
                                    }
                                    switch (id) {
                                        case 0:
                                            if (isAdmin) {
                                                BotListGui(pl);
                                            } else {
                                                ManageBot(pl);
                                            }
                                            break;
                                        default:
                                            return;
                                    }
                                })
                                return;
                            }
                            startAttack(botObj, interval, parseInt(data[1]));
                            pl.tell("§a§l模拟攻击成功", 0)
                        })
                    }
                    break;
                case 4:
                    if (botObj.health <= 0) {
                        pl.sendSimpleForm('提示', '请先让假人复活再操作', ['OK'], [""], function (pl, id, reason) {
                            if (id == null) {
                                return;
                            }
                            switch (id) {
                                case 0:
                                    if (isAdmin) {
                                        BotListGui(pl);
                                    } else {
                                        ManageBot(pl);
                                    }
                                    break;
                                default:
                                    return;
                            }
                        })
                        break;
                    } else {
                        if (botObj.name == null) {
                            break;
                        }
                        const b_state = checkPreventAndRepel(botObj);
                        botObj.setKnockbackResistance(b_state ? 0 : 1);
                        if (SelectName(botname)) {
                            const botData = SelectName(botname)
                            const plUuid = data.name2uuid(botData.boos)
                            let pldt = plData.get(plUuid);
                            pldt.botList[botname].preventAndRepel = !b_state;
                            plData.set(plUuid, pldt);
                            plData.read();
                        }
                        if (isAdmin) {
                            BotListGui(pl);
                        } else {
                            ManageBot(pl);
                        }
                        break;
                    }
                case 5:
                    {
                        if (botObj.health <= 0) {
                            pl.sendSimpleForm('提示', '请先让假人复活再操作', ['OK'], [""], function (pl, id, reason) {
                                if (id == null) {
                                    return;
                                }
                                switch (id) {
                                    case 0:
                                        if (isAdmin) {
                                            BotListGui(pl);
                                        } else {
                                            ManageBot(pl);
                                        }
                                        break;
                                    default:
                                        return;
                                }
                            })
                            break;
                        } else {
                            if (botObj.name == null) {
                                break;
                            }
                            const b_state = checkInvincible(botObj);
                            b_state ? botObj.removeEffect(11) : botObj.addEffect(11, -1, 255, false);
                            if (SelectName(botname)) {
                                const botData = SelectName(botname)
                                const plUuid = data.name2uuid(botData.boos)
                                let pldt = plData.get(plUuid);
                                pldt.botList[botname].invincible = !b_state;
                                plData.set(plUuid, pldt);
                                plData.read();
                            }
                            if (isAdmin) {
                                BotListGui(pl);
                            } else {
                                ManageBot(pl);
                            }
                            break;
                        }
                    }
                case 6: {
                    if (botObj.health <= 0) {
                        pl.sendSimpleForm('提示', '请先让假人复活再操作', ['OK'], [""], function (pl, id, reason) {
                            if (id == null) {
                                return;
                            }
                            switch (id) {
                                case 0:
                                    if (isAdmin) {
                                        BotListGui(pl);
                                    } else {
                                        ManageBot(pl);
                                    }
                                    break;
                                default:
                                    return;
                            }
                        })
                        break;
                    } else {
                        if (botObj.name == null) {
                            break;
                        }
                        const b_state = checkSaturation(botObj);
                        b_state ? botObj.removeEffect(23) : botObj.addEffect(23, -1, 255, false);
                        if (SelectName(botname)) {
                            const botData = SelectName(botname)
                            const plUuid = data.name2uuid(botData.boos)
                            let pldt = plData.get(plUuid);
                            pldt.botList[botname].saturation = !b_state;
                            plData.set(plUuid, pldt);
                            plData.read();
                        }
                        if (isAdmin) {
                            BotListGui(pl);
                        } else {
                            ManageBot(pl);
                        }
                        break;
                    }
                }
                case 7:
                    if (botDestroyMap.has(botname)) {
                        if (stopDestroy(botObj, botname)) {
                            pl.tell("§a§l已停止破坏方块", 0)
                        } else {
                            pl.tell("§c§l停止破坏方块失败", 0)
                        }
                    } else {
                        if (findBotInMaps(botname) != null) {
                            pl.sendSimpleForm('§l提示', `§l§6请先停止${findBotInMaps(botname)}!!!`, ['OK'], [""], function (pl, id, reason) {
                                if (id == null) {
                                    return;
                                }
                                switch (id) {
                                    case 0:
                                        if (isAdmin) {
                                            BotListGui(pl);
                                        } else {
                                            ManageBot(pl);
                                        }
                                        break;
                                    default:
                                        return;
                                }
                            })
                            return;
                        }
                        let fm = mc.newCustomForm();
                        fm.setTitle("§l假人破坏方块设置")
                        fm.addLabel(`§l§6请选择破坏模式`)
                        fm.addDropdown('破坏模式', ['破坏视线方向的任何方块', '指定方块类型（玩家手持栏1-9为指定方块）', '固定坐标破坏（视线上第一个方块坐标）'], 0)
                        fm.addInput('破坏间隔(最低100ms)', `最低100ms`, `500`);
                        pl.sendForm(fm, function (player, data, reason) {
                            if (data == null) {
                                return;
                            }
                            const mode = parseInt(data[1]);
                            const interval = parseInt(data[2]);
                            if (isNaN(interval) || interval < 100) {
                                pl.sendSimpleForm('提示', '破坏间隔必须为大于等于 100 的数字！', ['OK'], [""], function (pl, id, reason) {
                                    if (id == null) {
                                        return;
                                    }
                                    switch (id) {
                                        case 0:
                                            if (isAdmin) {
                                                BotListGui(pl);
                                            } else {
                                                ManageBot(pl);
                                            }
                                            break;
                                        default:
                                            return;
                                    }
                                })
                                return;
                            }
                            // 开始模拟破坏
                            if (startDestroy(botObj, interval, mode, pl)) {
                                pl.tell("§a§l模拟破坏成功", 0)
                            } else {
                                pl.tell("§c§l模拟破坏失败", 0)
                            }
                        })
                    }
                    break;
                case 8:
                    if (botInteractMap.has(botname)) {
                        if (stopInteract(botObj, botname)) {
                            pl.tell("§a§l已停止交互", 0)
                        } else {
                            pl.tell("§c§l停止交互失败", 0)
                        }
                    } else {
                        if (findBotInMaps(botname) != null) {
                            pl.sendSimpleForm('§l提示', `§l§6请先停止${findBotInMaps(botname)}!!!`, ['OK'], [""], function (pl, id, reason) {
                                if (id == null) {
                                    return;
                                }
                                switch (id) {
                                    case 0:
                                        if (isAdmin) {
                                            BotListGui(pl);
                                        } else {
                                            ManageBot(pl);
                                        }
                                        break;
                                    default:
                                        return;
                                }
                            })
                            return;
                        }
                        let fm = mc.newCustomForm();
                        fm.setTitle("§l假人交互设置")
                        fm.addInput('交互间隔(最低100ms)', `最低100ms`, `500`);
                        pl.sendForm(fm, function (player, data, reason) {
                            if (data == null) {
                                return;
                            }
                            const interval = parseInt(data[0]);
                            if (isNaN(interval) || interval < 100) {
                                pl.sendSimpleForm('提示', '交互间隔必须为大于等于 100 的数字！', ['OK'], [""], function (pl, id, reason) {
                                    if (id == null) {
                                        return;
                                    }
                                    switch (id) {
                                        case 0:
                                            if (isAdmin) {
                                                BotListGui(pl);
                                            } else {
                                                ManageBot(pl);
                                            }
                                            break;
                                        default:
                                            return;
                                    }
                                })
                                return;
                            }
                            startInteract(botObj, parseInt(data[0]));
                            pl.tell("§a§l模拟交互成功", 0)
                        })
                    }
                    break;
                case 9:
                    if (botJumpMap.has(botname)) {
                        if (stopJump(botObj, botname)) {
                            pl.tell("§a§l已停止跳跃", 0)
                        } else {
                            pl.tell("§c§l停止跳跃失败", 0)
                        }
                    } else {
                        let fm = mc.newCustomForm();
                        fm.setTitle("§l假人交互设置")
                        fm.addInput('跳跃间隔(最低100ms)', `最低100ms`, `500`);
                        pl.sendForm(fm, function (player, data, reason) {
                            if (data == null) {
                                return;
                            }
                            const interval = parseInt(data[0]);
                            if (isNaN(interval) || interval < 100) {
                                pl.sendSimpleForm('提示', '跳跃间隔必须为大于等于 100 的数字！', ['OK'], [""], function (pl, id, reason) {
                                    if (id == null) {
                                        return;
                                    }
                                    switch (id) {
                                        case 0:
                                            if (isAdmin) {
                                                BotListGui(pl);
                                            } else {
                                                ManageBot(pl);
                                            }
                                            break;
                                        default:
                                            return;
                                    }
                                })
                                return;
                            }
                            startJump(botObj, parseInt(data[0]));
                            pl.tell("§a§l模拟跳跃成功", 0)
                        })
                    }
                    break;
                case 10:
                    let fm = mc.newCustomForm();
                    fm.addLabel(`目标为自己所看的方块或实体`)
                    fm.addStepSlider(`看向类型`, ['§l§d方块', '§l§e实体'])
                    fm.addStepSlider(`模拟玩家看向目标的持续时间`, [`§l§e立刻`, `§l§d持续`, `§l§c直到目标移动`], 1)
                    pl.sendForm(fm, function (player, data, reason) {
                        if (data == null) {
                            return;
                        }
                        switch (data[1]) {
                            case 0:
                                let blockObj = pl.getBlockFromViewVector(true, false, 5, false);
                                if (blockObj == null) {
                                    pl.tell("§c§l请先看向一个方块", 0)
                                } else {
                                    switch (data[2]) {
                                        case 0:
                                            botObj.simulateLookAt(blockObj, 0);
                                            pl.tell(`§a§l方块名称：§l§r${blockObj.name}`, 0)
                                            break;
                                        case 1:
                                            botObj.simulateLookAt(blockObj, 1);
                                            pl.tell(`§a§l方块名称：§l§r${blockObj.name}`, 0)
                                            break;
                                        case 2:
                                            botObj.simulateLookAt(blockObj, 2);
                                            pl.tell(`§a§l方块名称：§l§r${blockObj.name}`, 0)
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            case 1:
                                let enObj = pl.getEntityFromViewVector(6);
                                if (enObj == null) {
                                    pl.tell("§c§l请先看向一个实体", 0)
                                } else {
                                    switch (data[2]) {
                                        case 0:
                                            botObj.simulateLookAt(enObj, 0);
                                            pl.tell(`§a§l实体名称：§l§r${enObj.name}`, 0)
                                            break;
                                        case 1:
                                            botObj.simulateLookAt(enObj, 1);
                                            pl.tell(`§a§l实体名称：§l§r${enObj.name}`, 0)
                                            break;
                                        case 2:
                                            botObj.simulateLookAt(enObj, 2);
                                            pl.tell(`§a§l实体名称：§l§r${enObj.name}`, 0)
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                break;
                            default:
                                break;
                        }
                    })
                    break;
                case 11:
                    if (botObj.name == null) {
                        return;
                    }
                    const botCt = botObj.getInventory();
                    let ctindex = [];
                    let fmui = mc.newCustomForm();
                    fmui.setTitle(`${botname}的物品栏`)
                    for (let id = 0; id < botCt.size; id++) {
                        const item = botCt.getItem(id);
                        if (item.name == '') {
                            continue;
                        }
                        fmui.addSwitch(`${id}格  【${botCt.getItem(id).name}】  X  ${botCt.getItem(id).count}`, true, `丢弃？`)
                        ctindex.push(id);
                    }
                    fmui.setSubmitButton(`丢弃物品到自己脚下`)
                    pl.sendForm(fmui, function (player, data, reason) {
                        if (data == null) {
                            return;
                        }
                        if (botObj.name == null) {
                            return;
                        }
                        // 遍历所有开关，丢弃选中的物品
                        for (let id = 0; id < ctindex.length; id++) {
                            // data[id]为true表示选中丢弃
                            if (data[id] === true) {
                                // 始终用botCt.getItem(id)获取当前物品对象
                                const itemObj = botCt.getItem(ctindex[id]);
                                if (itemObj && itemObj.name !== '') {
                                    // 克隆物品
                                    const dropItem = itemObj.clone();
                                    // 清空原物品
                                    itemObj.setNull();
                                    // 在玩家位置生成掉落
                                    mc.spawnItem(dropItem, player.feetPos);
                                }
                            }
                        }
                        player.tell('§a已丢弃选中物品！', 0);
                    })
                    break;
                case 12:
                    if (botUseOfItemsMap.has(botname)) {
                        if (stopUseOfItems(botObj, botname)) {
                            pl.tell("§a§l已停止使用物品", 0)
                        } else {
                            pl.tell("§c§l停止交互失败", 0)
                        }
                    } else {
                        if (findBotInMaps(botname) != null) {
                            pl.sendSimpleForm('§l提示', `§l§6请先停止${findBotInMaps(botname)}!!!`, ['OK'], [""], function (pl, id, reason) {
                                if (id == null) {
                                    return;
                                }
                                switch (id) {
                                    case 0:
                                        if (isAdmin) {
                                            BotListGui(pl);
                                        } else {
                                            ManageBot(pl);
                                        }
                                        break;
                                    default:
                                        return;
                                }
                            })
                            return;
                        }
                        const botCt1 = botObj.getInventory();
                        let Ct1Arr = [];
                        for (let id = 0; id < botCt1.size; id++) {
                            const item = botCt1.getItem(id);
                            if (item.name == '') {
                                Ct1Arr.push(`${id}格  空`)
                                continue;
                            }
                            Ct1Arr.push(`${id}格  【${botCt1.getItem(id).name}】  X  ${botCt1.getItem(id).count}`)
                        }
                        let mainfm = mc.newCustomForm();
                        mainfm.addInput(`执行间隔ms`, `最低500ms`, `500`)
                        mainfm.addLabel(`以下两个选项（二选一）`)
                        mainfm.addSwitch(`让假人选择使用对应我手中的物品`, false);
                        mainfm.addDropdown(`选择使用第N格的物品`, Ct1Arr, 0);
                        /*mainfm.addSwitch(`对我所看到的方块坐标使用（默认朝向方块坐标）`, false);
                        mainfm.addDropdown(`方块的面`, [`0`, `1`, `2`, `3`, `4`, `5`], 0);
                        mainfm.addLabel(`相对方块偏移坐标(默认为方块中心)`)
                        mainfm.addSlider(`X`, 0, 10, 1, 5);
                        mainfm.addSlider(`y`, 0, 10, 1, 5);
                        mainfm.addSlider(`z`, 0, 10, 1, 5); */
                        pl.sendForm(mainfm, function (player, data, reason) {
                            if (data == null) {
                                return;
                            }
                            const interval = parseInt(data[0]);
                            if (isNaN(interval) || interval < 500) {
                                pl.sendSimpleForm('提示', '使用间隔必须为大于等于 500 的数字！', ['OK'], [""], function (pl, id, reason) {
                                    if (id == null) {
                                        return;
                                    }
                                    switch (id) {
                                        case 0:
                                            if (isAdmin) {
                                                BotListGui(pl);
                                            } else {
                                                ManageBot(pl);
                                            }
                                            break;
                                        default:
                                            return;
                                    }
                                })
                                return;
                            }
                            const handItem = pl.getHand();
                            startUseOfItems(botObj, data, interval, handItem);
                        })
                    }
                    break;
                case 13:
                    if (botObj.name) {
                        if (SelectName(botname)) {
                            const botData = SelectName(botname)
                            const plUuid = data.name2uuid(botData.boos)
                            let pldt = plData.get(plUuid);
                            pldt.botList[botname].botPos = {
                                x: player.feetPos.x,
                                y: player.feetPos.y,
                                z: player.feetPos.z,
                                dimid: player.feetPos.dimid
                            }
                            plData.set(plUuid, pldt)
                            plData.read();
                            botObj.teleport(player.feetPos, player.direction);
                            player.tell("§a§l传送成功", 0);
                        }
                    } else {
                        player.tell("§c§l传送失败", 0);
                    }
                    break;
                case 14:
                    let botCt1 = botObj.getInventory();
                    let Ct1Arr = [];
                    for (let id = 0; id < botCt1.size; id++) {
                        const item = botCt1.getItem(id);
                        if (item.name == '') {
                            Ct1Arr.push(`${id}格  空`)
                            continue;
                        }
                        Ct1Arr.push(`${id}格  【${botCt1.getItem(id).name}】  X  ${botCt1.getItem(id).count}`)
                    }
                    let mainfm = mc.newCustomForm();
                    mainfm.addDropdown(`请选择要替换主手的物品`, Ct1Arr, 0);
                    pl.sendForm(mainfm, function (player, data, reason) {
                        if (data == null) {
                            return;
                        }
                        botCt1 = botObj.getInventory();
                        let cloneitem = botObj.getHand()?.clone();
                        botObj.getHand()?.set(botCt1.getItem(data[0]));
                        botCt1.getItem(data[0])?.setNull();
                        if (botCt1.hasRoomFor(cloneitem)) {
                            botCt1.addItemToFirstEmptySlot(cloneitem);
                        } else {
                            mc.spawnItem(cloneitem, botObj.feetPos);
                        }
                        botObj.refreshItems();
                    })
                    break;
                case 15:
                    // 传送管理员到假人位置（仅管理员可用）
                    if (isAdmin && botObj.name) {
                        try {
                            const botPos = botObj.feetPos;
                            if (botPos) {
                                player.teleport(botPos, botObj.direction);
                                player.tell("§a§l传送到假人位置成功", 0);
                            } else {
                                player.tell("§c§l无法获取假人位置", 0);
                            }
                        } catch (error) {
                            player.tell("§c§l传送失败: " + error.message, 0);
                        }

                        if (isAdmin) {
                            BotListGui(pl);
                        } else {
                            ManageBot(pl);
                        }
                    }
                    break;
                default:
                    return;
            }
        })
    } else {
        if (isAdmin) {
            return;
        }
        let pldt = plData.get(pl.uuid);
        fm.setTitle("§l管理假人");
        fm.addButton("§l上线假人", `textures/ui/green`);
        fm.addButton("§l删除假人", `textures/ui/icon_trash`);
        pl.sendForm(fm, function (player, id, reason) {
            if (id == null) {
                return;
            }
            switch (id) {
                case 0:
                    // 上线假人
                    try {
                        // 检查计费系统
                        if (config.get('billingEnabled')) {
                            const remainingTime = getPlayerRemainingTime(pl.uuid);
                            if (remainingTime <= 0) {
                                pl.sendSimpleForm('§c§l提示', '§c您的使用时间已用完，请先购买时间！', ['§aOK'], [""], function (pl, id, reason) {
                                    if (id == null) {
                                        return;
                                    }
                                    switch (id) {
                                        case 0:
                                            ManageBot(pl);
                                            break;
                                        default:
                                            return;
                                    }
                                });
                                return;
                            }
                        }

                        const Pos = new FloatPos(
                            pldt.botList[botname].botPos.x,
                            pldt.botList[botname].botPos.y,
                            pldt.botList[botname].botPos.z,
                            pldt.botList[botname].botPos.dimid
                        );
                        const bot = mc.spawnSimulatedPlayer(botname, Pos)
                        if (pldt.botList[botname].invincible) {
                            bot.addEffect(11, -1, 255, false)
                        }
                        if (pldt.botList[botname].preventAndRepel) {
                            bot.setKnockbackResistance(1)
                        }
                        if (pldt.botList[botname].saturation) {
                            bot.addEffect(23, -1, 255, false)
                        }
                        // 启动计费
                        if (config.get('billingEnabled')) {
                            startPlayerBilling(pl.uuid);
                        }
                        // 更新操作时间
                        let currentTime = Date.now();
                        pldt.lastOperation = currentTime;
                        plData.set(player.uuid, pldt);
                        plData.read();
                        pl.tell("§a假人上线成功！", 1);
                        ManageBot(pl);
                    } catch (error) {
                        pl.tell("§c假人上线失败: " + error.message, 1);
                    }
                    break;
                case 1:
                    delete pldt.botList[botname]
                    plData.set(pl.uuid, pldt);
                    plData.read();
                    ManageBot(pl);
                    break;
                default:
                    return;
            }
        })
    }
}


function SelectBot(pl) {
    const arr = Dropdown1();
    let fm = mc.newCustomForm()
    fm.setTitle('§b§l假人信息查询')
    fm.addDropdown('§e§l假人列表', arr.map(name => `§f${name}`), 0)
    pl.sendForm(fm, function (player, dataGui, reason) {
        if (dataGui == null) {
            return;
        }
        if (arr.length == 0) {
            return;
        } else {
            const objdata = SelectName(arr[dataGui[0]])
            const botObj = getBotsByPlayerName(arr[dataGui[0]]);
            let statusInfo = "";
            if (botObj) {
                statusInfo = `§e假人血量：§f${botObj.health}\n§e假人维度：§f${botObj.pos.dim}`;
            } else {
                statusInfo = "§c假人状态：离线";
            }

            // 在计费模式下添加主人的剩余时间信息
            let billingInfo = "";
            if (config.get('billingEnabled') && objdata) {
                const ownerUuid = data.name2uuid(objdata.boos);
                if (ownerUuid) {
                    const formattedTime = getFormattedRemainingTime(ownerUuid);
                    const billingData = playerBillingMap.get(ownerUuid);
                    const isActive = billingData ? billingData.isActive : false;
                    billingInfo = `\n§6§l主人剩余时间：§r§f${formattedTime} ${isActive ? '§a§l(计费中)' : '§7§l(暂停)'}`;
                } else {
                    billingInfo = `\n§6§l主人剩余时间：§c§l未知`;
                }
            }

            pl.sendSimpleForm('§b§l假人信息',
                `§e假人名称：§f${arr[dataGui[0]]}\n` +
                `§e主人：§f${objdata?.boos ? objdata.boos : "§c§l无"}\n` +
                `§e无敌：§a§l${checkInvincible(getBotsByPlayerName(arr[dataGui[0]])) ? "已开启" : "§c§l已关闭"}\n` +
                `§e抗击退：§a§l${checkPreventAndRepel(getBotsByPlayerName(arr[dataGui[0]])) ? "已开启" : "§c§l已关闭"}\n` +
                `§e饱食度：§a§l${checkSaturation(getBotsByPlayerName(arr[dataGui[0]])) ? "已开启" : "§c§l已关闭"}\n` +
                statusInfo +
                billingInfo,
                ['§aOK'], [""], function (pl, id, reason) {
                    if (id == null) {
                        return;
                    }
                    switch (id) {
                        case 0:
                            SelectBot(pl);
                            break;
                        default:
                            return;
                    }
                })
        }
    })
}

function Dropdown1() {
    let arr = [];
    const botlist = getSimulatedPlayers();
    for (let i = 0; i < botlist.length; i++) {
        arr.push(botlist[i].name);
    }
    return arr;
}

/**
 * 购买时间GUI
 * @param {Player} player - 玩家对象
 */
function BuyTimeGui(player) {
    let fm = mc.newCustomForm();
    fm.setTitle("§6§l购买使用时间");

    const currentFormattedTime = getFormattedRemainingTime(player.uuid);
    fm.addLabel(`§e当前剩余时间：§f${currentFormattedTime}`);
    fm.addLabel(`§e费率：§f每分钟${config.get('rateMin')}经济`);
    fm.addInput('§b购买时间(分钟)', '请输入要购买的分钟数', '60');

    player.sendForm(fm, function (player, data) {
        if (data == null) {
            return;
        }

        const minutes = parseInt(data[2]);
        if (isNaN(minutes) || minutes <= 0) {
            player.sendSimpleForm('§c§l提示', '§c请输入有效的分钟数！', ['§aOK'], [""], function () {
                BuyTimeGui(player);
            });
            return;
        }

        const cost = minutes * config.get('rateMin');

        // 计算购买后剩余时间显示
        const currentBillingData = playerBillingMap.get(player.uuid);
        let afterPurchaseTimeMs = minutes * 60 * 1000; // 购买的时间（毫秒）

        if (currentBillingData) {
            // 如果有现有数据，加上当前剩余时间
            let currentRemainingTime = currentBillingData.remainingTime;

            // 如果正在计费且有在线假人，需要扣除从上次更新到现在的时间
            if (currentBillingData.isActive && hasOnlineBots(player.uuid)) {
                const currentTime = Date.now();
                const elapsedTime = currentTime - currentBillingData.lastUpdate;
                currentRemainingTime = currentBillingData.remainingTime - elapsedTime;
            }

            afterPurchaseTimeMs += Math.max(0, currentRemainingTime);
        }

        // 格式化购买后的时间显示（与getFormattedRemainingTime保持一致）
        const totalSeconds = Math.ceil(afterPurchaseTimeMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        let afterTimeStr = "";
        if (hours > 0) {
            afterTimeStr += `${hours}小时`;
        }
        if (mins > 0) {
            afterTimeStr += `${mins}分`;
        }
        if (secs > 0 || afterTimeStr === "") {
            afterTimeStr += `${secs}秒`;
        }

        // 确认购买
        player.sendSimpleForm('§6§l确认购买',
            `§e购买时间：§f${minutes}分钟\n§e费用：§f${cost}经济\n§e购买后剩余：§f${afterTimeStr}\n\n§c确认购买吗？`,
            ['§a§l确认购买', '§c§l取消'], ["textures/ui/check", "textures/ui/redX1"], function (player, id) {
                if (id == null || id === 1) {
                    LkroBotMain(player);
                    return;
                }

                if (id === 0) {
                    // 执行购买
                    if (Economy(player, cost)) {
                        // 购买成功，添加时间
                        const existingData = playerBillingMap.get(player.uuid);
                        if (existingData) {
                            existingData.remainingTime += minutes * 60 * 1000;
                            existingData.totalTime += minutes * 60 * 1000;
                        } else {
                            initPlayerBilling(player.uuid, minutes);
                        }

                        // 清除延迟清理定时器（如果存在）
                        if (playerCleanupTimers.has(player.uuid)) {
                            clearInterval(playerCleanupTimers.get(player.uuid));
                            playerCleanupTimers.delete(player.uuid);
                        }

                        // 保存数据
                        saveAllPlayerData();

                        player.sendText(`§a§l购买成功！获得${minutes}分钟使用时间`, 0);
                        LkroBotMain(player);
                    } else {
                        player.sendSimpleForm('§c§l购买失败', '§c余额不足！', ['§aOK'], [""], function () {
                            LkroBotMain(player);
                        });
                    }
                }
            });
    });
}

/**
 * 购买配额GUI
 * @param {Player} player - 玩家对象
 */
function BuyQuotaGui(player) {
    let pldt = plData.get(player.uuid);
    if (!pldt) {
        player.sendSimpleForm('§c§l提示', '§c请先购买时间后再购买配额！', ['§aOK'], [""], function () {
            LkroBotMain(player);
        });
        return;
    }

    let fm = mc.newCustomForm();
    fm.setTitle("§b§l购买假人配额");

    const currentQuota = pldt.quantity || config.get('default_quantity', 1);
    const maxQuota = config.get('max_quantity');
    const quotaPrice = config.get('quotaMoney');

    fm.addLabel(`§e当前配额：§f${currentQuota}个`);
    fm.addLabel(`§e配额上限：§f${maxQuota}个`);
    fm.addLabel(`§e单价：§f${quotaPrice}经济/个`);

    if (currentQuota >= maxQuota) {
        fm.addLabel(`§c§l您已达到配额上限！`);
        player.sendForm(fm, function (player, data) {
            if (data == null) {
                return;
            }
            LkroBotMain(player);
        });
        return;
    }

    const maxCanBuy = maxQuota - currentQuota;
    fm.addSlider(`§b购买数量`, 1, maxCanBuy, 1, 1);

    player.sendForm(fm, function (player, data) {
        if (data == null) {
            return;
        }

        const buyCount = parseInt(data[3]);
        if (isNaN(buyCount) || buyCount <= 0 || buyCount > maxCanBuy) {
            player.sendSimpleForm('§c§l提示', '§c购买数量无效！', ['§aOK'], [""], function () {
                BuyQuotaGui(player);
            });
            return;
        }

        const totalCost = buyCount * quotaPrice;
        const afterQuota = currentQuota + buyCount;

        // 确认购买
        player.sendSimpleForm('§b§l确认购买配额',
            `§e购买数量：§f${buyCount}个\n§e单价：§f${quotaPrice}经济\n§e总费用：§f${totalCost}经济\n§e购买后配额：§f${afterQuota}个\n\n§c确认购买吗？`,
            ['§a§l确认购买', '§c§l取消'], ["textures/ui/check", "textures/ui/redX1"], function (player, id) {
                if (id == null || id === 1) {
                    LkroBotMain(player);
                    return;
                }

                if (id === 0) {
                    // 读取数据
                    pldt = plData.get(player.uuid);
                    // 检查计费系统
                    if (config.get('billingEnabled')) {
                        const remainingTime = getPlayerRemainingTime(player.uuid);
                        if (remainingTime <= 0) {
                            player.sendSimpleForm('§c§l提示', '§c您的使用时间已用完，请先购买时间！', ['§aOK'], [""], function (player, id, reason) {
                                if (id == null) {
                                    return;
                                }
                                switch (id) {
                                    case 0:
                                        LkroBotMain(player);
                                        break;
                                    default:
                                        return;
                                }
                            });
                            return;
                        }
                    }
                    // 执行购买
                    if (Economy(player, totalCost)) {
                        // 购买成功，增加配额
                        pldt.quantity = afterQuota;
                        plData.set(player.uuid, pldt);
                        plData.read();
                        updatePlayerBilling(player.uuid);
                        player.sendText(`§a§l购买成功！获得${buyCount}个假人配额，当前配额：${afterQuota}个`, 0);
                        LkroBotMain(player);
                    } else {
                        player.sendSimpleForm('§c§l购买失败', '§c余额不足！', ['§aOK'], [""], function () {
                            LkroBotMain(player);
                        });
                    }
                }
            });
    });
}

function AdminOperation(player) {
    let fm = mc.newSimpleForm();
    fm.setTitle(`管理员操作`);
    fm.addButton(`操作在线假人`);
    fm.addButton(`名单管理`);

    // 始终显示计费管理，无论是否开启
    const billingEnabled = config.get('billingEnabled');
    fm.addButton(`计费管理 ${billingEnabled ? "§a(已开启)" : "§c(已关闭)"}`);

    player.sendForm(fm, function (player, id, reason) {
        if (id == null) {
            return;
        }
        let buttonIndex = 0;

        if (id === buttonIndex++) {
            BotListGui(player);
            return;
        }

        if (id === buttonIndex++) {
            ListManageGui(player);
            return;
        }

        if (id === buttonIndex++) {
            BillingManageGui(player);
            return;
        }
    })
}


/**
 * 计费管理主界面（管理员专用）
 * @param {Player} player - 管理员玩家对象
 */
function BillingManageGui(player) {
    let fm = mc.newSimpleForm();
    const billingEnabled = config.get('billingEnabled');

    fm.setTitle(`§d§l计费管理 ${billingEnabled ? "§a(已开启)" : "§c(已关闭)"}`);

    if (billingEnabled) {
        // 计费开启时的完整功能
        fm.addButton("§a§l查看所有玩家计费状态");
        fm.addButton("§6§l查看特定玩家详情");
        fm.addButton("§b§l为玩家添加时间");
        fm.addButton("§c§l删除玩家所有数据");
        fm.addButton("§e§l计费系统设置");
        fm.addButton("§f§l强制保存所有数据");
    } else {
        // 计费关闭时的有限功能
        fm.addButton("§e§l计费系统设置 (开启计费)");
        fm.addButton("§6§l查看玩家数据");
        fm.addButton("§c§l删除玩家所有数据");
    }

    fm.addButton("§7§l返回管理员菜单");

    player.sendForm(fm, function (player, id) {
        if (id == null) {
            return;
        }

        if (billingEnabled) {
            // 计费开启时的按钮处理
            switch (id) {
                case 0:
                    ViewAllPlayerBillingStatus(player);
                    break;
                case 1:
                    ViewPlayerDetailGui(player);
                    break;
                case 2:
                    AddTimeToPlayerGui(player);
                    break;
                case 3:
                    DeletePlayerDataGui(player);
                    break;
                case 4:
                    BillingSettingsGui(player);
                    break;
                case 5:
                    saveAllPlayerData();
                    player.sendText("§a§l已强制保存所有计费数据！", 0);
                    BillingManageGui(player);
                    break;
                case 6:
                    AdminOperation(player);
                    break;
                default:
                    return;
            }
        } else {
            // 计费关闭时的按钮处理
            switch (id) {
                case 0:
                    BillingSettingsGui(player);
                    break;
                case 1:
                    ViewPlayerDetailGui(player);
                    break;
                case 2:
                    DeletePlayerDataGui(player);
                    break;
                case 3:
                    AdminOperation(player);
                    break;
                default:
                    return;
            }
        }
    });
}

/**
 * 查看所有玩家计费状态
 * @param {Player} player - 管理员玩家对象
 */
function ViewAllPlayerBillingStatus(player) {
    let fm = mc.newCustomForm();
    fm.setTitle("§a§l所有玩家计费状态");

    if (playerBillingMap.size === 0) {
        fm.addLabel("§7暂无玩家计费数据");
    } else {
        playerBillingMap.forEach((billingData, playerUuid) => {
            const plName = data.fromUuid(playerUuid)?.name || "未知玩家";
            const formattedTime = getFormattedRemainingTime(playerUuid);
            const status = billingData.isActive ? "§a计费中" : "§7暂停";
            const hasOnline = hasOnlineBots(playerUuid) ? "§a有在线假人" : "§c无在线假人";
            fm.addLabel(`§e${plName}§f: ${formattedTime} ${status} ${hasOnline}`);
        });
    }

    player.sendForm(fm, function () {
        BillingManageGui(player);
    });
}

/**
 * 查看特定玩家详情GUI
 * @param {Player} player - 管理员玩家对象
 */
function ViewPlayerDetailGui(player) {
    let fm = mc.newSimpleForm();
    fm.setTitle("§6§l选择要查看的玩家");

    // 获取所有有计费数据的玩家
    const playersWithData = [];

    // 从计费数据中获取玩家
    playerBillingMap.forEach((billingData, playerUuid) => {
        const playerName = data.fromUuid(playerUuid)?.name || "未知玩家";
        playersWithData.push({ uuid: playerUuid, name: playerName });
    });

    // 从玩家数据中获取玩家（可能有些玩家有数据但没有计费信息）
    const allPlayerData = JSON.parse(plData.read());
    Object.keys(allPlayerData).forEach(playerUuid => {
        const row = allPlayerData[playerUuid];
        const playerName = data.fromUuid(playerUuid)?.name || row?.boos || "未知玩家";
        // 检查是否已经在列表中
        if (!playersWithData.find(p => p.uuid === playerUuid)) {
            playersWithData.push({ uuid: playerUuid, name: playerName });
        }
    });

    if (playersWithData.length === 0) {
        fm.addButton("§7暂无玩家数据");
        player.sendForm(fm, function () {
            BillingManageGui(player);
        });
        return;
    }

    // 添加玩家按钮
    playersWithData.forEach(playerInfo => {
        const billingData = playerBillingMap.get(playerInfo.uuid);
        const status = billingData ? (billingData.isActive ? "§a计费中" : "§7暂停") : "§c无计费数据";
        fm.addButton(`§e${playerInfo.name}\n${status}`);
    });

    fm.addButton("§7§l返回计费管理");

    player.sendForm(fm, function (player, id) {
        if (id == null) {
            return;
        }

        if (id === playersWithData.length) {
            // 返回按钮
            BillingManageGui(player);
            return;
        }

        if (id < playersWithData.length) {
            const selectedPlayer = playersWithData[id];
            ShowPlayerDetailInfo(player, selectedPlayer.uuid, selectedPlayer.name);
        }
    });
}

/**
 * 显示玩家详细信息
 * @param {Player} player - 管理员玩家对象
 * @param {string} playerUuid - 目标玩家UUID
 * @param {string} playerName - 目标玩家名称
 */
function ShowPlayerDetailInfo(player, playerUuid, playerName) {
    let fm = mc.newCustomForm();
    fm.setTitle(`§6§l${playerName} 的详细信息`);

    const pldt = plData.get(playerUuid);
    const billingData = playerBillingMap.get(playerUuid);

    // 基本信息
    fm.addLabel(`§e=== 基本信息 ===`);
    fm.addLabel(`§f玩家名称: §a${playerName}`);
    fm.addLabel(`§f玩家UUID: §7${playerUuid}`);

    if (pldt) {
        fm.addLabel(`§f假人配额: §b${pldt.quantity || 0}`);
        const botCount = pldt.botList ? Object.keys(pldt.botList).length : 0;
        const onlineBotCount = pldt.botList ? Object.keys(pldt.botList).filter(name => getBotsByPlayerName(name)).length : 0;
        fm.addLabel(`§f已创建假人: §e${botCount}个`);
        fm.addLabel(`§f在线假人: §a${onlineBotCount}个`);
    } else {
        fm.addLabel(`§c该玩家暂无数据`);
    }

    // 计费信息
    fm.addLabel(`§e=== 计费信息 ===`);
    if (billingData) {
        const formattedTime = getFormattedRemainingTime(playerUuid);
        const status = billingData.isActive ? "§a计费中" : "§7暂停";
        const hasOnline = hasOnlineBots(playerUuid) ? "§a有在线假人" : "§c无在线假人";

        fm.addLabel(`§f剩余时间: §b${formattedTime}`);
        fm.addLabel(`§f计费状态: ${status}`);
        fm.addLabel(`§f假人状态: ${hasOnline}`);

        const totalMinutes = Math.ceil(billingData.totalTime / (60 * 1000));
        fm.addLabel(`§f总购买时间: §d${totalMinutes}分钟`);

        const lastUpdateTime = new Date(billingData.lastUpdate).toLocaleString();
        fm.addLabel(`§f最后更新: §7${lastUpdateTime}`);
    } else {
        fm.addLabel(`§c该玩家暂无计费数据`);
    }

    // 假人列表
    if (pldt && pldt.botList && Object.keys(pldt.botList).length > 0) {
        fm.addLabel(`§e=== 假人列表 ===`);
        Object.keys(pldt.botList).forEach(botName => {
            const bot = getBotsByPlayerName(botName);
            const status = bot ? (bot.health <= 0 ? "§c死亡" : "§a在线") : "§7离线";
            fm.addLabel(`§f${botName}: ${status}`);
        });
    }

    player.sendForm(fm, function (player, data, reason) {
        ViewPlayerDetailGui(player);
    });
}

/**
 * 为玩家添加时间GUI
 * @param {Player} player - 管理员玩家对象
 */
function AddTimeToPlayerGui(player) {
    let fm = mc.newSimpleForm();
    fm.setTitle("§b§l选择要添加时间的玩家");

    // 获取所有有数据的玩家
    const playersWithData = [];

    // 从计费数据中获取玩家
    playerBillingMap.forEach((billingData, playerUuid) => {
        const playerName = data.fromUuid(playerUuid)?.name || "未知玩家";
        const formattedTime = getFormattedRemainingTime(playerUuid);
        playersWithData.push({
            uuid: playerUuid,
            name: playerName,
            remainingTime: formattedTime,
            isActive: billingData.isActive
        });
    });

    // 从玩家数据中获取玩家（可能有些玩家有数据但没有计费信息）
    const allPlayerData = JSON.parse(plData.read());
    Object.keys(allPlayerData).forEach(playerUuid => {
        const row = allPlayerData[playerUuid];
        const playerName = data.fromUuid(playerUuid)?.name || row?.boos || "未知玩家";
        // 检查是否已经在列表中
        if (!playersWithData.find(p => p.uuid === playerUuid)) {
            playersWithData.push({
                uuid: playerUuid,
                name: playerName,
                remainingTime: "无计费数据",
                isActive: false
            });
        }
    });

    if (playersWithData.length === 0) {
        fm.addButton("§7暂无玩家数据");
        player.sendForm(fm, function () {
            BillingManageGui(player);
        });
        return;
    }

    // 添加玩家按钮
    playersWithData.forEach(playerInfo => {
        const status = playerInfo.isActive ? "§a计费中" : "§7暂停";
        fm.addButton(`§e${playerInfo.name}\n§f剩余: ${playerInfo.remainingTime} ${status}`);
    });

    fm.addButton("§7§l返回计费管理");

    player.sendForm(fm, function (player, id) {
        if (id == null) {
            return;
        }

        if (id === playersWithData.length) {
            // 返回按钮
            BillingManageGui(player);
            return;
        }

        if (id < playersWithData.length) {
            const selectedPlayer = playersWithData[id];
            ShowAddTimeInputGui(player, selectedPlayer.uuid, selectedPlayer.name);
        }
    });
}

/**
 * 显示添加时间输入界面
 * @param {Player} player - 管理员玩家对象
 * @param {string} playerUuid - 目标玩家UUID
 * @param {string} playerName - 目标玩家名称
 */
function ShowAddTimeInputGui(player, playerUuid, playerName) {
    let fm = mc.newCustomForm();
    fm.setTitle(`§b§l为 ${playerName} 添加时间`);

    const currentFormattedTime = getFormattedRemainingTime(playerUuid);
    fm.addLabel(`§e当前剩余时间：§f${currentFormattedTime}`);
    fm.addInput('§b添加时间(分钟)', '请输入要添加的分钟数', '60');

    player.sendForm(fm, function (player, data) {
        if (data == null) {
            return;
        }

        const minutes = parseInt(data[1]);
        if (isNaN(minutes) || minutes <= 0) {
            player.sendSimpleForm('§c§l错误', '§c请输入有效的分钟数！', ['§aOK'], [""], function () {
                ShowAddTimeInputGui(player, playerUuid, playerName);
            });
            return;
        }

        // 确认添加
        player.sendSimpleForm('§b§l确认添加时间',
            `§e玩家：§f${playerName}\n§e当前剩余：§f${currentFormattedTime}\n§e添加时间：§f${minutes}分钟\n\n§a确认为该玩家添加时间吗？`,
            ['§a§l确认添加', '§c§l取消'], ["textures/ui/check", "textures/ui/redX1"], function (player, id) {
                if (id == null || id === 1) {
                    AddTimeToPlayerGui(player);
                    return;
                }

                if (id === 0) {
                    // 执行添加时间
                    const existingData = playerBillingMap.get(playerUuid);
                    if (existingData) {
                        existingData.remainingTime += minutes * 60 * 1000;
                        existingData.totalTime += minutes * 60 * 1000;
                    } else {
                        initPlayerBilling(playerUuid, minutes);
                    }

                    // 清除延迟清理定时器（如果存在）
                    if (playerCleanupTimers.has(playerUuid)) {
                        clearInterval(playerCleanupTimers.get(playerUuid));
                        playerCleanupTimers.delete(playerUuid);
                    }

                    // 保存数据
                    saveAllPlayerData();

                    player.sendText(`§a§l成功为玩家 ${playerName} 添加了 ${minutes} 分钟使用时间！`, 0);
                    BillingManageGui(player);
                }
            });
    });
}

/**
 * 删除玩家数据GUI
 * @param {Player} player - 管理员玩家对象
 */
function DeletePlayerDataGui(player) {
    let fm = mc.newCustomForm();
    fm.setTitle("§c§l删除玩家所有数据");
    fm.addInput('§e玩家名称', '请输入要删除数据的玩家名称', '');
    fm.addLabel("§c§l警告：此操作将删除该玩家的所有数据！");
    fm.addLabel("§c包括：假人数据、计费信息、配额等");
    fm.addLabel("§c此操作不可撤销！");

    player.sendForm(fm, function (player, dataGui) {
        if (dataGui == null) {
            return;
        }

        const playerName = dataGui[0].trim();
        if (!playerName) {
            player.sendSimpleForm('§c§l错误', '§c请输入有效的玩家名称！', ['§aOK'], [""], function () {
                DeletePlayerDataGui(player);
            });
            return;
        }

        const playerUuid = data.name2uuid(playerName);
        if (!playerUuid) {
            player.sendSimpleForm('§c§l错误', '§c找不到该玩家！', ['§aOK'], [""], function () {
                DeletePlayerDataGui(player);
            });
            return;
        }

        // 确认删除
        player.sendSimpleForm('§c§l确认删除',
            `§e确认删除玩家 §f${playerName} §e的所有数据吗？\n§c包括：假人数据、计费信息、配额等\n§c此操作不可撤销！`,
            ['§c§l确认删除', '§a§l取消'], ["textures/ui/check", "textures/ui/redX1"], function (player, id) {
                if (id == null || id === 1) {
                    BillingManageGui(player);
                    return;
                }

                if (id === 0) {
                    // 删除所有玩家数据
                    cleanupPlayerBots(playerUuid);

                    player.sendText(`§a§l成功删除玩家 ${playerName} 的所有数据！`, 0);
                    BillingManageGui(player);
                }
            });
    });
}

/**
 * 计费系统设置GUI（管理员专用）
 * @param {Player} player - 管理员玩家对象
 */
function BillingSettingsGui(player) {
    let fm = mc.newCustomForm();
    fm.setTitle("§d§l计费系统设置");
    fm.addSwitch('§a启用计费系统', config.get('billingEnabled'));
    fm.addInput('§e每分钟费率', '每分钟扣除的经济数量', config.get('rateMin').toString());
    fm.addInput('§b数据保存间隔(毫秒)', '自动保存计费数据的间隔', config.get('saveInterval').toString());

    player.sendForm(fm, function (player, data) {
        if (data == null) {
            return;
        }

        const billingEnabled = data[0];
        const rateMin = parseInt(data[1]);
        const saveInterval = parseInt(data[2]);

        if (isNaN(rateMin) || rateMin < 0) {
            player.sendSimpleForm('§c§l错误', '§c费率必须为非负数！', ['§aOK'], [""], function () {
                BillingSettingsGui(player);
            });
            return;
        }

        if (isNaN(saveInterval) || saveInterval < 10000) {
            player.sendSimpleForm('§c§l错误', '§c保存间隔必须大于等于10秒(10000毫秒)！', ['§aOK'], [""], function () {
                BillingSettingsGui(player);
            });
            return;
        }

        // 保存设置
        config.set('billingEnabled', billingEnabled);
        config.set('rateMin', rateMin);
        config.set('saveInterval', saveInterval);
        config.read();

        player.sendText(`§a§l计费系统设置已保存！`, 0);

        // 如果禁用了计费系统，停止所有计费
        if (!billingEnabled) {
            playerBillingMap.forEach((billingData, playerUuid) => {
                stopPlayerBilling(playerUuid);
            });
        }

        BillingManageGui(player);
    });
}

function BotListGui(player) {
    const botlist = getSimulatedPlayers();
    let fm = mc.newSimpleForm();
    fm.setTitle(`在线假人列表`);
    for (let i = 0; i < botlist.length; i++) {
        fm.addButton(`${botlist[i].name} ${botlist[i].health <= 0 ? "§c死亡" : ""}`)
    }
    player.sendForm(fm, function (player, id, reason) {
        if (id == null) {
            return;
        }
        botControl(player, botlist[id], botlist[id].name, true)
    })
}
/**
 * 名单管理主界面
 * @param {Player} player - 管理员玩家对象
 */
function ListManageGui(player) {
    let fm = mc.newSimpleForm();
    fm.setTitle("§d§l名单管理");
    fm.addButton("§a§l白名单管理");
    fm.addButton("§c§l黑名单管理");
    fm.addButton("§e§l名单设置");
    fm.addButton("§7§l返回管理员菜单");

    player.sendForm(fm, function (player, id) {
        if (id == null) return;
        switch (id) {
            case 0:
                WhitelistManageGui(player);
                break;
            case 1:
                BlacklistManageGui(player);
                break;
            case 2:
                ListSettingsGui(player);
                break;
            case 3:
                AdminOperation(player);
                break;
        }
    });
}

/**
 * 名单设置界面
 * @param {Player} player - 管理员玩家对象
 */
function ListSettingsGui(player) {
    let fm = mc.newSimpleForm();
    fm.setTitle("§e§l名单设置");

    const whitelistEnabled = config.get('whitelist');
    const blacklistEnabled = config.get('blacklist');

    fm.addButton(`白名单：${whitelistEnabled ? "§a开启" : "§c关闭"}`);
    fm.addButton(`黑名单：${blacklistEnabled ? "§a开启" : "§c关闭"}`);

    if (whitelistEnabled && blacklistEnabled) {
        fm.addButton("§c§l修复冲突（关闭黑名单）");
    }

    fm.addButton("§7§l返回名单管理");

    player.sendForm(fm, function (player, id) {
        if (id == null) return;

        let buttonIndex = 0;

        if (id === buttonIndex++) {
            // 切换白名单
            const newWhitelistState = !config.get('whitelist');
            if (newWhitelistState && config.get('blacklist')) {
                // 如果要开启白名单但黑名单已开启，关闭黑名单
                config.set('blacklist', false);
                player.sendText("§e检测到黑名单已开启，已自动关闭黑名单", 0);
            }
            config.set('whitelist', newWhitelistState);
            config.read();
            player.sendText(`§a白名单已${newWhitelistState ? "开启" : "关闭"}`, 0);
            ListSettingsGui(player);
            return;
        }

        if (id === buttonIndex++) {
            // 切换黑名单
            const newBlacklistState = !config.get('blacklist');
            if (newBlacklistState && config.get('whitelist')) {
                // 如果要开启黑名单但白名单已开启，关闭白名单
                config.set('whitelist', false);
                player.sendText("§e检测到白名单已开启，已自动关闭白名单", 0);
            }
            config.set('blacklist', newBlacklistState);
            config.read();
            player.sendText(`§a黑名单已${newBlacklistState ? "开启" : "关闭"}`, 0);
            ListSettingsGui(player);
            return;
        }

        if (whitelistEnabled && blacklistEnabled && id === buttonIndex++) {
            // 修复冲突
            config.set('blacklist', false);
            config.read();
            player.sendText("§a已关闭黑名单，解决冲突", 0);
            ListSettingsGui(player);
            return;
        }

        if (id === buttonIndex++) {
            ListManageGui(player);
            return;
        }
    });
}

function WhitelistManageGui(player) {
    let fm = mc.newSimpleForm();
    fm.setTitle("§a§l白名单管理");
    fm.addButton("添加玩家到白名单");
    fm.addButton("移除白名单玩家");
    fm.addButton("查看白名单");
    fm.addButton("§7§l返回名单管理");
    player.sendForm(fm, function (player, id) {
        if (id == null) return;
        switch (id) {
            case 0:
                AddWhitelistPlayerGui(player);
                break;
            case 1:
                RemoveWhitelistPlayerGui(player);
                break;
            case 2:
                ViewWhitelistGui(player);
                break;
            case 3:
                ListManageGui(player);
                break;
        }
    });
}
/**
 * 黑名单管理界面
 * @param {Player} player - 管理员玩家对象
 */
function BlacklistManageGui(player) {
    let fm = mc.newSimpleForm();
    fm.setTitle("§c§l黑名单管理");
    fm.addButton("添加玩家到黑名单");
    fm.addButton("移除黑名单玩家");
    fm.addButton("查看黑名单");
    fm.addButton("§7§l返回名单管理");
    player.sendForm(fm, function (player, id) {
        if (id == null) return;
        switch (id) {
            case 0:
                AddBlacklistPlayerGui(player);
                break;
            case 1:
                RemoveBlacklistPlayerGui(player);
                break;
            case 2:
                ViewBlacklistGui(player);
                break;
            case 3:
                ListManageGui(player);
                break;
        }
    });
}

/**
 * 查看白名单界面
 * @param {Player} player - 管理员玩家对象
 */
function ViewWhitelistGui(player) {
    let fm = mc.newCustomForm();
    fm.setTitle("§a§l白名单列表");

    const list = whitelistData.get('players') || [];
    if (list.length === 0) {
        fm.addLabel("§7白名单为空");
    } else {
        fm.addLabel(`§e共有 §f${list.length} §e个玩家在白名单中：`);
        list.forEach((p, index) => {
            fm.addLabel(`§f${index + 1}. §a${p.name} §7(${p.uuid})`);
        });
    }

    player.sendForm(fm, function () {
        WhitelistManageGui(player);
    });
}

/**
 * 查看黑名单界面
 * @param {Player} player - 管理员玩家对象
 */
function ViewBlacklistGui(player) {
    let fm = mc.newCustomForm();
    fm.setTitle("§c§l黑名单列表");

    const list = blacklistData.get('players') || [];
    if (list.length === 0) {
        fm.addLabel("§7黑名单为空");
    } else {
        fm.addLabel(`§e共有 §f${list.length} §e个玩家在黑名单中：`);
        list.forEach((p, index) => {
            fm.addLabel(`§f${index + 1}. §c${p.name} §7(${p.uuid})`);
        });
    }

    player.sendForm(fm, function () {
        BlacklistManageGui(player);
    });
}

function AddWhitelistPlayerGui(player) {
    const onlinePlayers = mc.getOnlinePlayers().filter(pl => !pl.isSimulatedPlayer()); // 过滤掉假人
    let fm = mc.newSimpleForm();
    fm.setTitle("添加白名单玩家");

    if (onlinePlayers.length === 0) {
        fm.addButton("§7暂无在线玩家");
        player.sendForm(fm, function () {
            WhitelistManageGui(player);
        });
        return;
    }

    onlinePlayers.forEach(pl => fm.addButton(`${pl.realName}`));
    fm.addButton("§7§l返回白名单管理");

    player.sendForm(fm, function (player, id) {
        if (id == null) return;

        if (id === onlinePlayers.length) {
            WhitelistManageGui(player);
            return;
        }

        const pl = onlinePlayers[id];
        let list = whitelistData.get('players') || [];
        if (list.some(p => p.uuid === pl.uuid)) {
            player.sendText("§c该玩家已在白名单内", 0);
            WhitelistManageGui(player);
            return;
        }
        list.push({ name: pl.realName, uuid: pl.uuid });
        whitelistData.set('players', list);
        whitelistData.read();
        player.sendText("§a添加成功！", 0);
        WhitelistManageGui(player);
    });
}

/**
 * 添加黑名单玩家界面
 * @param {Player} player - 管理员玩家对象
 */
function AddBlacklistPlayerGui(player) {
    let fm = mc.newCustomForm();
    fm.setTitle("§c§l添加黑名单玩家");
    fm.addInput('§e玩家名称', '请输入要添加到黑名单的玩家名称', '');
    fm.addLabel("§c§l注意：OP玩家不会受到黑名单限制");

    player.sendForm(fm, function (player, dataGui) {
        if (dataGui == null) {
            return;
        }

        const playerName = dataGui[0].trim();
        if (!playerName) {
            player.sendSimpleForm('§c§l错误', '§c请输入有效的玩家名称！', ['§aOK'], [""], function () {
                AddBlacklistPlayerGui(player);
            });
            return;
        }

        // 检查玩家是否存在
        const playerUuid = data.fromName(playerName)?.uuid;
        if (!playerUuid) {
            player.sendSimpleForm('§c§l错误', '§c找不到该玩家！请确认玩家名称正确。', ['§aOK'], [""], function () {
                AddBlacklistPlayerGui(player);
            });
            return;
        }

        // 检查是否为OP
        const targetPlayer = mc.getPlayer(playerName);
        if (targetPlayer && targetPlayer.isOP()) {
            player.sendSimpleForm('§c§l错误', '§c不能将OP玩家添加到黑名单！', ['§aOK'], [""], function () {
                AddBlacklistPlayerGui(player);
            });
            return;
        }

        // 检查是否已在黑名单中
        let list = blacklistData.get('players') || [];
        if (list.some(p => p.uuid === playerUuid || p.name === playerName)) {
            player.sendSimpleForm('§c§l提示', '§c该玩家已在黑名单内！', ['§aOK'], [""], function () {
                BlacklistManageGui(player);
            });
            return;
        }

        // 确认添加
        player.sendSimpleForm('§c§l确认添加到黑名单',
            `§e玩家：§f${playerName}\n§e UUID：§f${playerUuid}\n\n§c确认将该玩家添加到黑名单吗？\n§c添加后该玩家将无法使用假人系统。`,
            ['§c§l确认添加', '§a§l取消'], ["textures/ui/check", "textures/ui/redX1"], function (player, id) {
                if (id == null || id === 1) {
                    BlacklistManageGui(player);
                    return;
                }

                if (id === 0) {
                    // 执行添加
                    list.push({ name: playerName, uuid: playerUuid });
                    blacklistData.set('players', list);
                    blacklistData.read();
                    player.sendText(`§a§l成功将玩家 ${playerName} 添加到黑名单！`, 0);
                    BlacklistManageGui(player);
                }
            });
    });
}


function RemoveWhitelistPlayerGui(player) {
    let list = whitelistData.get('players') || [];
    if (list.length === 0) {
        player.sendSimpleForm('§c§l提示', '§c白名单为空', ['§aOK'], [""], function () {
            WhitelistManageGui(player);
        });
        return;
    }
    let fm = mc.newSimpleForm();
    fm.setTitle("移除白名单玩家");
    list.forEach(p => fm.addButton(`Name:${p.name} \nUUID:(${p.uuid})`));
    fm.addButton("§7§l返回白名单管理");

    player.sendForm(fm, function (player, id) {
        if (id == null) return;

        if (id === list.length) {
            WhitelistManageGui(player);
            return;
        }

        const removedPlayer = list[id];
        list.splice(id, 1);
        whitelistData.set('players', list);
        whitelistData.read();
        player.sendText(`§a成功移除玩家 ${removedPlayer.name}`, 0);
        WhitelistManageGui(player);
    });
}

/**
 * 移除黑名单玩家界面
 * @param {Player} player - 管理员玩家对象
 */
function RemoveBlacklistPlayerGui(player) {
    let list = blacklistData.get('players') || [];
    if (list.length === 0) {
        player.sendSimpleForm('§c§l提示', '§c黑名单为空', ['§aOK'], [""], function () {
            BlacklistManageGui(player);
        });
        return;
    }
    let fm = mc.newSimpleForm();
    fm.setTitle("移除黑名单玩家");
    list.forEach(p => fm.addButton(`Name:${p.name} \nUUID:(${p.uuid})`));
    fm.addButton("§7§l返回黑名单管理");

    player.sendForm(fm, function (player, id) {
        if (id == null) return;

        if (id === list.length) {
            BlacklistManageGui(player);
            return;
        }

        const removedPlayer = list[id];
        list.splice(id, 1);
        blacklistData.set('players', list);
        blacklistData.read();
        player.sendText(`§a成功移除玩家 ${removedPlayer.name}`, 0);
        BlacklistManageGui(player);
    });
}


// ============================================================
// 睡觉跳过夜晚自动管理假人功能
// 当所有真实玩家都在床上准备跳过夜晚时，自动下线所有假人
// 夜晚成功跳过后，自动重新上线之前下线的假人
// ============================================================

const SLEEP_CHECK_INTERVAL = 2000; // 每2秒检查一次
let sleepState = {
	sleepingPlayers: new Map(),       // uuid -> 最后一次点击床的时间戳
	autoDisconnectedBots: [],         // [{botName, ownerUuid, pos, invincible, preventAndRepel, saturation}]
	isWaitingForDay: false,
};

function isSleepableTime() {
	const time = mc.getTime(0);
	return time >= 12542; // 玩家可以开始睡觉的时间（黄昏后）
}

function isDayTime() {
	const time = mc.getTime(0);
	return time >= 0 && time < 12542;
}

function getRealPlayers() {
	return mc.getOnlinePlayers().filter(p => !p.isSimulatedPlayer());
}

function disconnectAllBotsForSleep() {
	const bots = getSimulatedPlayers();
	if (bots.length === 0) return;

	sleepState.autoDisconnectedBots = [];

	bots.forEach(bot => {
		try {
			const botData = SelectName(bot.name);
			const ownerUuid = botData ? data.name2uuid(botData.boos) : null;
			const pldt = ownerUuid ? plData.get(ownerUuid) : null;
			const savedBotData = pldt && pldt.botList ? pldt.botList[bot.name] : null;

			const botInfo = {
				botName: bot.name,
				ownerUuid: ownerUuid,
				pos: savedBotData && savedBotData.botPos ? savedBotData.botPos : {
					x: bot.feetPos.x,
					y: bot.feetPos.y,
					z: bot.feetPos.z,
					dimid: bot.feetPos.dimid
				},
				invincible: savedBotData ? savedBotData.invincible : false,
				preventAndRepel: savedBotData ? savedBotData.preventAndRepel : false,
				saturation: savedBotData ? savedBotData.saturation : false
			};

			sleepState.autoDisconnectedBots.push(botInfo);

			// 停止假人的所有操作
			stopAttack(bot, bot.name);
			stopDestroy(bot, bot.name);
			stopInteract(bot, bot.name);
			stopJump(bot, bot.name);
			stopUseOfItems(bot, bot.name);

			// 下线假人
			bot.simulateDisconnect();
		} catch (e) {
			logger.error("[LKroBot] 睡觉自动下线假人 " + bot.name + " 失败: " + e);
		}
	});

	sleepState.isWaitingForDay = true;

	if (sleepState.autoDisconnectedBots.length > 0) {
		logger.info("[LKroBot] 所有真实玩家正在睡觉，已自动下线 " + sleepState.autoDisconnectedBots.length + " 个假人以跳过夜晚");
		mc.broadcast("[LKroBot] 所有玩家已入睡，假人已自动下线，正在跳过夜晚...");
	}
}

function reconnectDisconnectedBots(showBroadcast) {
	if (sleepState.autoDisconnectedBots.length === 0) return;

	let reconnected = 0;
	const botList = [...sleepState.autoDisconnectedBots];

	botList.forEach(botInfo => {
		try {
			// 检查假人是否已经在线（可能被手动重新上线）
			if (getBotsByPlayerName(botInfo.botName)) {
				reconnected++;
				return;
			}

			const pos = new FloatPos(
				botInfo.pos.x,
				botInfo.pos.y,
				botInfo.pos.z,
				botInfo.pos.dimid
			);
			const bot = mc.spawnSimulatedPlayer(botInfo.botName, pos);

			if (bot) {
				if (botInfo.invincible) bot.addEffect(11, -1, 255, false);
				if (botInfo.preventAndRepel) bot.setKnockbackResistance(1);
				if (botInfo.saturation) bot.addEffect(23, -1, 255, false);

				// 更新玩家操作时间
				if (botInfo.ownerUuid) {
					const pldt = plData.get(botInfo.ownerUuid);
					if (pldt) {
						pldt.lastOperation = Date.now();
						plData.set(botInfo.ownerUuid, pldt);
					}
				}

				reconnected++;
			}
		} catch (e) {
			logger.error("[LKroBot] 重新上线假人 " + botInfo.botName + " 失败: " + e);
		}
	});

	sleepState.autoDisconnectedBots = [];
	sleepState.isWaitingForDay = false;
	sleepState.sleepingPlayers.clear();

	if (reconnected > 0 && showBroadcast) {
		logger.info("[LKroBot] 夜晚已跳过，已自动重新上线 " + reconnected + " 个假人");
		mc.broadcast("[LKroBot] 新的一天开始了，假人已自动重新上线！");
	}

	plData.read();
}

function checkAllRealPlayersSleeping() {
	if (!config.get("sleepAutoOffline")) return;
	if (!isSleepableTime()) {
		// 不在可睡觉时间，清理已记录的睡眠状态
		if (sleepState.sleepingPlayers.size > 0 && !sleepState.isWaitingForDay) {
			sleepState.sleepingPlayers.clear();
		}
		return;
	}

	const realPlayers = getRealPlayers();
	if (realPlayers.length === 0) return;

	// 清理已离线的玩家
	const onlineUuids = new Set(realPlayers.map(p => p.uuid));
	for (const uuid of sleepState.sleepingPlayers.keys()) {
		if (!onlineUuids.has(uuid)) {
			sleepState.sleepingPlayers.delete(uuid);
		}
	}

	// 检查是否所有真实玩家都已标记为"睡觉中"
	const allSleeping = realPlayers.every(p => sleepState.sleepingPlayers.has(p.uuid));

	if (allSleeping && !sleepState.isWaitingForDay) {
		// 确认所有玩家至少已在床中停留了3秒（排除误点击）
		const now = Date.now();
		const allSettled = realPlayers.every(p => {
			const timestamp = sleepState.sleepingPlayers.get(p.uuid);
			return timestamp && (now - timestamp) > 3000;
		});

		if (allSettled && getSimulatedPlayers().length > 0) {
			disconnectAllBotsForSleep();
		}
	}
}

// 监听玩家使用物品（检测点击床睡觉）
mc.listen("onUseItemOn", (player, item, block, side, pos) => {
	if (!config.get("sleepAutoOffline")) return true;
	if (!player || player.isSimulatedPlayer()) return true;
	if (!block) return true;

	try {
		const blockName = (block.name || "").toLowerCase();
		const blockType = (block.type || "").toLowerCase();

		// 检查是否点击了床
		if (blockName.includes("bed") || blockType.includes("bed")) {
			if (isSleepableTime()) {
				// 玩家已经记录为"睡觉中" → 再次点击床表示起床
				if (sleepState.sleepingPlayers.has(player.uuid)) {
					sleepState.sleepingPlayers.delete(player.uuid);
				} else {
					sleepState.sleepingPlayers.set(player.uuid, Date.now());
				}
				// 延迟检查，给玩家躺下或起床的时间
				setTimeout(() => checkAllRealPlayersSleeping(), 3500);
			}
		}
	} catch (e) {}

	return true;
});

// 玩家离开时清理追踪状态
mc.listen("onLeft", (player) => {
	if (!config.get("sleepAutoOffline")) return;
	if (!player || player.isSimulatedPlayer()) return;

	sleepState.sleepingPlayers.delete(player.uuid);

	// 如果所有真实玩家都离开了，重连假人
	if (sleepState.isWaitingForDay && getRealPlayers().length === 0) {
		reconnectDisconnectedBots(false);
	}
});

// 定期检查时间变化和睡觉状态
setInterval(() => {
	if (!config.get("sleepAutoOffline")) return;

	try {
		// 检测白天到来（夜晚被跳过或正常天亮）
		if (sleepState.isWaitingForDay && isDayTime()) {
			reconnectDisconnectedBots(true);
			return;
		}

		// 在夜间定期检查所有玩家是否在睡觉
		if (!sleepState.isWaitingForDay && isSleepableTime()) {
			checkAllRealPlayersSleeping();
		}
	} catch (e) {
		logger.error("[LKroBot] 睡觉检测定时器出错: " + e);
	}
}, SLEEP_CHECK_INTERVAL);
