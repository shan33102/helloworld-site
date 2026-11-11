'use strict';

/**
 * 服务器时间工具模块
 * ------------------------------------------------------------
 * server.js（本地运行）和 api/time.js（Vercel 线上）都会调用这里，
 * 所以时间格式只需要在这一个文件里维护，避免两处代码不一致。
 */

// 统一使用北京时间（东八区）。如果你想换成别的时区，改这一行即可，
// 例如 'Asia/Tokyo'、'Europe/London'、'America/New_York'。
const TIME_ZONE = 'Asia/Shanghai';

const formatter = new Intl.DateTimeFormat('zh-CN', {
  timeZone: TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  weekday: 'long',
  hourCycle: 'h23',
});

/**
 * 把 Date 对象格式化成 "2026年11月05日 22:35:35 星期四"
 * @param {Date} date
 * @returns {string}
 */
function formatDateTime(date) {
  const parts = {};
  for (const item of formatter.formatToParts(date)) {
    parts[item.type] = item.value;
  }
  return (
    `${parts.year}年${parts.month}月${parts.day}日 ` +
    `${parts.hour}:${parts.minute}:${parts.second} ${parts.weekday}`
  );
}

/**
 * 生成返回给前端的标准数据结构
 * @returns {{iso: string, timestamp: number, timezone: string, formatted: string}}
 */
function getServerTimePayload() {
  const now = new Date();
  return {
    iso: now.toISOString(), // 国际标准时间字符串
    timestamp: now.getTime(), // 毫秒时间戳，前端用它来校准时钟
    timezone: TIME_ZONE,
    formatted: formatDateTime(now), // 已经排好版的中文时间
  };
}

module.exports = { TIME_ZONE, formatDateTime, getServerTimePayload };
