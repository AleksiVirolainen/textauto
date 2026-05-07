# 上线部署指南（textauto）

完成后会得到两个固定网址：
- 前端（给别人打开）：`https://textauto.vercel.app`
- 后端 API：`https://textauto-api.onrender.com`

> 你电脑关掉后，对方依然能用。数据存放在 Render 提供的 PostgreSQL 数据库里。

---

## 一、推代码到 GitHub

1. 在 https://github.com/new 创建空仓库：
   - Owner：`AleksiVirolainen`
   - Repository name：`textauto`
   - Public（公开），**不要**勾选 Add README / .gitignore / license（保持空仓库）
   - 点 **Create repository**

2. 在终端执行：

```bash
cd /Users/a1234/Documents/messenger-system
git init
git add .
git commit -m "init textauto"
git branch -M main
git remote add origin https://github.com/AleksiVirolainen/textauto.git
git push -u origin main
```

> 第一次 push 时，GitHub 会让你登录。新版用 Personal Access Token 代替密码：
> 在 https://github.com/settings/tokens 新建 token（勾 `repo` 权限），把它当密码贴进去即可。

---

## 二、部署后端 + 数据库到 Render

1. 打开 https://render.com 用 GitHub 登录。
2. 顶部 **New +** → **Blueprint**。
3. 选择 `AleksiVirolainen/textauto` 仓库 → 它会读取根目录下的 `render.yaml`。
4. 点 **Apply**，Render 会自动创建：
   - 数据库：`textauto-db`（PostgreSQL，免费版）
   - Web 服务：`textauto-api`（Node 服务，免费版）
   - 自动注入 `DATABASE_URL`
5. 等待 3–5 分钟，等到状态变成 **Live**。
6. 进入 `textauto-api` 详情页，复制顶部 URL，例如 `https://textauto-api.onrender.com`。

> 免费版后端在 15 分钟无人访问后会休眠，下次访问首次会延迟约 30 秒，再之后正常。
> 如果你拿到的 URL 不是 `https://textauto-api.onrender.com`，请记下你实际的那一条，下面用得到。

---

## 三、部署前端到 Vercel

1. 打开 https://vercel.com 用 GitHub 登录。
2. **Add New** → **Project** → 选 `textauto` 仓库 → **Import**。
3. 项目设置里：
   - **Root Directory** 改成 `frontend`
   - Framework Preset 选 **Vite**（默认即可）
4. **Environment Variables** 添加一条：
   - Name：`VITE_API_BASE`
   - Value：刚才记下的 Render 后端地址，例如 `https://textauto-api.onrender.com`（不要末尾的斜杠）
5. 点 **Deploy**，等 1–2 分钟到 **Ready**。
6. 顶部得到一个永久网址，例如 `https://textauto.vercel.app`，**这条就是要发给别人的**。

> 如果你把 Render 后端实际域名改了，就回 Vercel → Project → Settings → Environment Variables 把 `VITE_API_BASE` 改成新的，再 Redeploy 一次。

---

## 四、验证

1. 浏览器打开 `https://textauto.vercel.app` → 应该跳到登录页。
2. 用以下任一账号登录：
   - `admin` / `admin123`
   - `13057799720` / `wch20030914`
   - `15058303899` / `123456..`
   - `19157997572` / `pa123456789`
   - `15957736312` / `guhao123`
3. 进入「客户管理」新增一个客户，刷新或换浏览器打开都应该看到这条数据。说明数据已写入 Render 的 PostgreSQL，永久保存。

---

## 五、以后改了代码怎么更新？

```bash
cd /Users/a1234/Documents/messenger-system
git add .
git commit -m "update"
git push
```

- Render 检测到推送，自动重新部署后端。
- Vercel 检测到推送，自动重新部署前端。
- 你不用碰任何后台。

---

## 六、常见问题

- 打开 Vercel 网站显示空白：通常是 `VITE_API_BASE` 没设或设错。改完要重新 **Redeploy**。
- 登录提示「网络错误」：Render 后端正在冷启动，等 30 秒再试。
- Render 部署日志里有 `password authentication failed`：删掉 Web 服务的 `DATABASE_URL`，让它重新从数据库读取一次（render.yaml 已配置自动注入）。
