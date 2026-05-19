/**
 * JustTPS
 *   v1.0.0
 *   计算服务器TPS，仅此而已
 * 
 *   由于 JavaScript 的时间补偿机制和计时器精度问题，无法保证 TPS 绝对精确，且流畅时时间偏移经常会有负值
 * 
 * 1503Dev
 *   https://www.minebbs.com/members/dev.154006/
 * 
 * 许可证
 *   开放源代码根据 Apache 2.0 许可证
 */

(function () {
    const COMMAND = 'tps'
    // 查询命令

    const COMMAND_DESC = '查询 TPS'
    // 命令描述

    const TICK_SIZE = 20
    // 默认计算 Tick 数，代表计算最近 20 个 Tick 的 TPS

    const MAX_HISTORY = 120;
    // 最大记录 Tick 数

    const MSG_RESULT = '_TICKS Ticks 内的 TPS: §l_TPS§r, 时间偏移: _OFFSET ms'
    // 结果提示(_TPS 会被替换为 TPS 值，_OFFSET 会被替换为时间偏移毫秒数，_TICKS 会被替换为计算 Tick 数)

    const MSG_SERVER_STARTED = '使用 /' + COMMAND + ' 查询服务器TPS'
    // 服务器启动提示(为空则不提示，_COMMAND 会被替换为查询命令)

    const MSG_INVALID_TICKS = '无效的 Tick 数 _TICKS, 必须在 2 到 _MAX_HISTORY 之间'
    // 无效 Tick 数提示(_MAX_HISTORY 会被替换为最大记录 Tick 数，_TICKS 会被替换为所填 Tick 数)

    const Plugin = {
        name: "JustTPS",
        version: "1.0.0",
        description: "计算服务器TPS，仅此而已",
    }

    ll.registerPlugin(
        Plugin.name,
        Plugin.description,
        Plugin.version.split('.'),
        {
            author: '1503Dev'
        }
    )
    logger.setTitle(Plugin.name)

    const msg = {
        serverStarted() {
            return MSG_SERVER_STARTED.replace(/_COMMAND/g, COMMAND)
        },
        result(tps, offset, ticks) {
            return MSG_RESULT.replace(/_TPS/g, tps.toFixed(2)).replace(/_OFFSET/g, offset.toFixed(2)).replace(/_TICKS/g, ticks)
        },
        invalidTicks(ticks) {
            return MSG_INVALID_TICKS.replace(/_MAX_HISTORY/g, MAX_HISTORY).replace(/_TICKS/g, ticks)
        },
    }

    const tickHistory = []

    function onTick() {
        tickHistory.push(Date.now());
        if (tickHistory.length > MAX_HISTORY) {
            tickHistory.shift();
        }
    }
    function getTPS(ticks = 20) {
        if (tickHistory.length <= 1) {
            return { tps: 20.00, offset: 0.00, ticks: ticks };
        }
        const actualSize = Math.min(ticks, tickHistory.length);
        const endTime = tickHistory[tickHistory.length - 1];
        const startTime = tickHistory[tickHistory.length - actualSize];
        const actualDuration = endTime - startTime;
        if (actualDuration <= 0) {
            return { tps: 20.00, offset: 0.00, ticks: actualSize };
        }
        const intervals = actualSize - 1;
        let tps = intervals / (actualDuration / 1000);
        tps = Math.min(20.00, tps);
        const idealDuration = intervals * 50;
        const offset = actualDuration - idealDuration;
        return {
            tps: tps,
            offset: offset,
            ticks: actualSize
        };
    }

    mc.listen('onServerStarted', () => {
        const cmd = mc.newCommand(COMMAND, COMMAND_DESC, PermType.Any)
        cmd.optional('ticks', ParamType.Int, 'Tick 数', 'ticks')
        cmd.overload(['ticks'])
        cmd.setCallback((_, trigger, outp, args) => {
            var ticks = args.ticks || TICK_SIZE
            if (ticks <= 1 || ticks > MAX_HISTORY) {
                outp.error(msg.invalidTicks(ticks))
                return
            }
            const res = getTPS(ticks);
            outp.success(msg.result(res.tps, res.offset, res.ticks));
        })
        cmd.setup()

        logger.info(Plugin.name + ' v' + Plugin.version + ', Made by 1503Dev')
        if (MSG_SERVER_STARTED) {
            logger.info(msg.serverStarted())
        }
    })
    mc.listen('onTick', () => {
        onTick()
    })

    if (!ll.hasExported(Plugin.name, 'getTPS')) {
        ll.exports(getTPS, 'JustTPS', 'getTPS')
    }
})()