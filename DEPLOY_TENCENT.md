# 腾讯云轻量服务器部署（Ubuntu 24.04 / 22.04）

这套部署方式会在一台服务器上启动：

- `web`：前端页面，监听 `80` 端口
- `api`：NestJS 后端，内部监听 `3000`
- `db`：PostgreSQL 数据库，数据保存在 Docker volume 中

没有域名时，可以先用服务器公网 IP 访问：`http://你的公网IP`

## 1. 腾讯云安全组 / 防火墙

在轻量服务器控制台放行：

- TCP `22`：SSH 登录
- TCP `80`：HTTP 访问网站
- TCP `443`：以后配置 HTTPS 时用

## 2. SSH 登录服务器

在你电脑终端执行：

```bash
ssh ubuntu@你的公网IP
```

如果腾讯云给的是 `root` 用户，就用：

```bash
ssh root@你的公网IP
```

## 3. 安装 Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

## 4. 拉代码

```bash
cd /opt
sudo git clone https://github.com/AleksiVirolainen/textauto.git
sudo chown -R $USER:$USER /opt/textauto
cd /opt/textauto
```

如果仓库已经存在，以后更新用：

```bash
cd /opt/textauto
git pull
```

## 5. 配置数据库密码

```bash
cat > .env <<'EOF'
POSTGRES_PASSWORD=请改成一个复杂密码
EOF
```

示例密码不要用中文，建议类似：`Textauto_2026_xxx`

## 6. 启动

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

查看状态：

```bash
docker compose -f docker-compose.prod.yml ps
```

查看日志：

```bash
docker compose -f docker-compose.prod.yml logs -f api
```

## 7. 访问

打开：

```text
http://你的公网IP
```

如果登录页能打开，说明前端成功。

测试后端：

```bash
curl http://你的公网IP/api/health
```

应该返回：

```json
{"status":"ok"}
```

## 8. 以后更新代码

本地改完并推送到 GitHub 后，服务器执行：

```bash
cd /opt/textauto
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## 9. 绑定域名和 HTTPS

等域名实名通过后，把域名 A 记录解析到服务器公网 IP。

如果是香港服务器，不需要 ICP 备案即可解析。
解析生效后再配置 HTTPS。
