# Hello World 网站（Node.js）

我的第一个 AI 开发的网站：中文界面、响应式布局、实时显示服务器时间。

## 功能

- 首页显示 `Hello World！` 与个人介绍
- 实时显示服务器时间（每秒刷新，每 30 秒与服务器重新校准）
- 电脑 / 手机自适应
- 零第三方依赖，只用 Node.js 内置模块
- 可直接部署到 Vercel

## 项目结构

```
helloworld-site/
├── api/
│   └── time.js        # Vercel 云函数：线上环境的 /api/time 接口
├── lib/
│   └── time.js        # 时间格式化公共模块（本地与线上共用）
├── public/
│   ├── index.html     # 页面结构
│   ├── style.css      # 页面样式
│   └── app.js         # 时钟逻辑
├── server.js          # 本地运行用的 Node.js 服务器
├── package.json       # 项目信息与启动命令
├── vercel.json        # Vercel 部署配置
├── .gitignore         # Git 忽略规则
└── README.md
```

## 本地运行

```bash
npm start
```

然后浏览器打开 http://localhost:3000

## 修改名字

打开 `public/index.html`，找到这一行，把「你的名字」替换掉：

```html
我是<span class="name">你的名字</span>，我的第一个 AI 开发的网站。
```

## 接口

| 方法 | 路径 | 说明 |
| --- | --- | --- |
| GET | `/api/time` | 返回服务器时间（JSON） |

返回示例：

```json
{
  "iso": "2026-11-05T14:35:35.000Z",
  "timestamp": 1793889335000,
  "timezone": "Asia/Shanghai",
  "formatted": "2026年11月05日 22:35:35 星期四"
}
```

## 部署到 Vercel

1. 把项目推送到 GitHub
2. 打开 https://vercel.com ，用 GitHub 账号登录
3. 点击 `Add New...` → `Project`，选择该仓库
4. Framework Preset 选择 `Other`，其余保持默认
5. 点击 `Deploy`，等待约 30 秒即可获得线上地址
