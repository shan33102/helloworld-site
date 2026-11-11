'use strict';

/**
 * 本地开发用的 HTTP 服务器（只用 Node.js 自带模块，不需要安装任何第三方依赖）
 * ------------------------------------------------------------
 * 作用：
 *   1. 把 public 目录里的网页文件（html/css/js）发给浏览器
 *   2. 提供 /api/time 接口，返回当前服务器时间
 *
 * 启动命令：npm start   （等价于 node server.js）
 * 访问地址：http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { getServerTimePayload } = require('./lib/time');

const PORT = Number(process.env.PORT) || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// 常见文件类型对应的 Content-Type，浏览器靠它正确解析文件
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

/** 返回 JSON 数据 */
function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store', // 时间接口不能被缓存，否则时间会不动
  });
  res.end(body);
}

/** 返回纯文本（用于 404 / 500 错误提示） */
function sendText(res, statusCode, text) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end(text);
}

/** 处理 /api/time 接口 */
function handleApiTime(res) {
  sendJson(res, 200, getServerTimePayload());
}

/** 处理静态文件请求 */
function handleStatic(req, res) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (err) {
    sendText(res, 400, '400 请求地址不合法');
    return;
  }

  // 访问 "/" 时，默认返回 index.html
  const relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
  const filePath = path.resolve(PUBLIC_DIR, relativePath);

  // 安全校验：禁止通过 ../ 访问 public 目录之外的文件
  if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
    sendText(res, 403, '403 禁止访问');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      sendText(res, 404, '404 页面不存在');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
    });

    const stream = fs.createReadStream(filePath);
    stream.on('error', () => sendText(res, 500, '500 读取文件失败'));
    stream.pipe(res);
  });
}

const server = http.createServer((req, res) => {
  const pathname = (req.url || '/').split('?')[0];

  // 1. 接口路由
  if (pathname === '/api/time') {
    handleApiTime(res);
    return;
  }

  // 2. 静态资源路由
  handleStatic(req, res);
});

server.listen(PORT, () => {
  console.log('');
  console.log('  ✅ HelloWorld 网站已启动');
  console.log(`  🌐 本地访问地址：http://localhost:${PORT}`);
  console.log('  ⛔ 停止服务：在当前终端按 Ctrl + C');
  console.log('');
});

// 端口被占用时，给出人话提示，而不是一堆英文报错
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n  ❌ 端口 ${PORT} 已被占用。`);
    console.error(`     解决办法一：关掉占用端口的旧终端窗口后重试。`);
    console.error(`     解决办法二：换一个端口启动，例如（Windows cmd）：set PORT=3001 && npm start\n`);
  } else {
    console.error('\n  ❌ 服务器启动失败：', err.message, '\n');
  }
  process.exit(1);
});
