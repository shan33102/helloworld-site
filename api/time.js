'use strict';

/**
 * Vercel 云函数：/api/time
 * ------------------------------------------------------------
 * 部署到 Vercel 后，public 目录是纯静态文件，不会运行 Node 服务器，
 * 所以线上必须用这个文件来提供服务器时间接口。
 * 本地运行时不会用到它（本地由 server.js 提供 /api/time）。
 */

const { getServerTimePayload } = require('../lib/time');

module.exports = function handler(req, res) {
  // 只允许 GET 请求
  if (req.method && req.method !== 'GET') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: '只支持 GET 请求' }));
    return;
  }

  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.end(JSON.stringify(getServerTimePayload()));
};
