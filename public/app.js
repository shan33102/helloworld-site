'use strict';

/**
 * 前端时钟逻辑
 * ------------------------------------------------------------
 * 思路（初学者也能看懂）：
 *   1. 先向 /api/time 要一次「服务器当前时间」
 *   2. 算出「服务器时间 - 本机时间」的差值 offset
 *   3. 之后每秒用 本机时间 + offset 显示，就等于服务器时间在走
 *   4. 每 30 秒重新校准一次，防止电脑时钟走偏
 */

(function () {
  var timeEl = document.getElementById('clock-time');
  var dateEl = document.getElementById('clock-date');
  var statusBox = document.querySelector('.status');
  var statusText = document.getElementById('status-text');

  // 时间格式化器：统一按北京时间显示
  var formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    weekday: 'long',
    hourCycle: 'h23',
  });

  var offset = 0; // 服务器时间与本机时间的差值（毫秒）
  var hasSynced = false; // 是否成功连上过服务器

  /** 按指定 Date 渲染时间 */
  function render(date) {
    var parts = {};
    formatter.formatToParts(date).forEach(function (item) {
      parts[item.type] = item.value;
    });

    timeEl.textContent = parts.hour + ':' + parts.minute + ':' + parts.second;
    dateEl.textContent =
      parts.year + '年' + parts.month + '月' + parts.day + '日 ' + parts.weekday;
  }

  /** 用「本机时间 + 差值」渲染当前时间 */
  function tick() {
    render(new Date(Date.now() + offset));
  }

  /** 设置状态小标签 */
  function setStatus(online, text) {
    statusBox.classList.toggle('is-online', online);
    statusText.textContent = text;
  }

  /** 向服务器请求时间并校准 */
  function syncTime() {
    fetch('/api/time', { cache: 'no-store' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.json();
      })
      .then(function (data) {
        offset = data.timestamp - Date.now();
        hasSynced = true;
        setStatus(true, '实时同步中');
        tick();
      })
      .catch(function () {
        // 拿不到服务器时间时，退化成显示本机时间，页面不会白屏
        offset = 0;
        setStatus(false, hasSynced ? '同步中断，显示本机时间' : '未连接服务器，显示本机时间');
        tick();
      });
  }

  // 首次渲染 + 首次同步
  tick();
  syncTime();

  // 每秒刷新显示，每 30 秒重新校准一次
  setInterval(tick, 1000);
  setInterval(syncTime, 30000);
})();
