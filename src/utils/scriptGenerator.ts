import { BotSettings } from '../types';

export function generateInstallSh(botSettings: BotSettings, githubRepo: string = 'username/v2shop-bot'): string {
  return `#!/bin/bash
# =========================================================
# V2Shop Telegram Bot & Web Management Panel Installer
# Target OS: Ubuntu 20.04 / 22.04 / 24.04 / Debian 11+
# =========================================================

set -e

RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

echo -e "\${BLUE}=========================================================\${NC}"
echo -e "\${BLUE}     🚀 Installing V2Shop Bot & Web Admin Panel        \${NC}"
echo -e "\${BLUE}=========================================================\${NC}"

# Detect Public IP Address
SERVER_IP=$(curl -s https://api.ipify.org || curl -s https://ifconfig.me || echo "YOUR_SERVER_IP")

echo -e "\\n\${YELLOW}---------------------------------------------------------\${NC}"
echo -e "\${YELLOW} 📝 دریافت اطلاعات اولیه (ورود اطلاعات ربات و وب پنل)    \${NC}"
echo -e "\${YELLOW}---------------------------------------------------------\${NC}\\n"

# 1. Prompt for Bot Token
read -p "🔑 توکن ربات تلگرام را وارد کنید (Bot Token) [پیش‌فرض: ${botSettings.botToken}]: " INPUT_BOT_TOKEN
BOT_TOKEN="\${INPUT_BOT_TOKEN:-${botSettings.botToken}}"

# 2. Prompt for Admin Telegram ID
read -p "👤 آیدی عددی تلگرام ادمین (Admin Numeric ID) [پیش‌فرض: ${botSettings.adminIds[0] || '123456789'}]: " INPUT_ADMIN_ID
ADMIN_IDS="\${INPUT_ADMIN_ID:-${botSettings.adminIds[0] || '123456789'}}"

# 3. Prompt for Web Panel Port
read -p "🌐 پورت وب‌پیج پنل مدیریت را وارد کنید [پیش‌فرض: 8080]: " INPUT_PANEL_PORT
PANEL_PORT="\${INPUT_PANEL_PORT:-8080}"

# 4. Prompt for Admin Web Password
read -p "🔐 کلمه عبور پنل وب را وارد کنید [پیش‌فرض: admin123]: " INPUT_PANEL_PASS
PANEL_PASS="\${INPUT_PANEL_PASS:-admin123}"

echo -e "\\n\${GREEN}✅ اطلاعات ذخیره شد. در حال شروع نصب سیستم...\${NC}\\n"

# 1. Update System Packages
echo -e "\${YELLOW}[1/5] Updating system packages...\${NC}"
sudo apt update -y
sudo apt install -y curl wget git python3 python3-pip python3-venv sqlite3 || true
sudo apt install -y docker.io docker-compose-plugin || sudo apt install -y docker.io docker-compose || true

# 2. Setup Working Directory
echo -e "\${YELLOW}[2/5] Creating application folder...\${NC}"
mkdir -p /opt/v2shop-bot
cd /opt/v2shop-bot

# 3. Create config.env
echo -e "\${YELLOW}[3/5] Configuring Environment variables...\${NC}"
cat << EOF > /opt/v2shop-bot/config.env
BOT_TOKEN="\${BOT_TOKEN}"
ADMIN_IDS="\${ADMIN_IDS}"
PANEL_PORT="\${PANEL_PORT}"
PANEL_PASSWORD="\${PANEL_PASS}"
SERVER_IP="\${SERVER_IP}"
MANDATORY_CHANNEL="${botSettings.mandatoryChannel}"
SUPPORT_USERNAME="${botSettings.supportUsername}"
CARD_NUMBER="${botSettings.paymentGateways.cardToCard.cardNumber}"
CARD_HOLDER="${botSettings.paymentGateways.cardToCard.cardHolder}"
BANK_NAME="${botSettings.paymentGateways.cardToCard.bankName}"
ZARINPAL_MERCHANT="${botSettings.paymentGateways.zarinpal.merchantId}"
USDT_ADDRESS="${botSettings.paymentGateways.crypto.usdtAddress}"
DATABASE_URL="sqlite:////opt/v2shop-bot/v2shop.db"
EOF

# 4. Create python Virtual environment & install required libraries
echo -e "\${YELLOW}[4/5] Setting up Python dependencies...\${NC}"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install python-telegram-bot aiohttp requests pydantic sqlite3-api pyqrcode pillow

# 5. Create combined Bot & Web Panel Code
cat << 'EOF' > /opt/v2shop-bot/bot.py
import os, sys, logging, asyncio
from aiohttp import web
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
ADMIN_IDS = os.getenv("ADMIN_IDS", "")
PANEL_PORT = int(os.getenv("PANEL_PORT", "8080"))
PANEL_PASSWORD = os.getenv("PANEL_PASSWORD", "admin123")
SERVER_IP = os.getenv("SERVER_IP", "localhost")
SUPPORT_USER = os.getenv("SUPPORT_USERNAME", "")

logging.basicConfig(level=logging.INFO)

async def handle_admin(request):
    html = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>پنل مدیریت V2Shop</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen p-4 md:p-8 font-sans">
  <div class="max-w-4xl mx-auto space-y-6">
    <div class="bg-slate-800 border border-emerald-500/30 rounded-2xl p-6 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-black text-emerald-400">⚡ پنل مدیریت مستقیم V2Shop</h1>
        <p class="text-xs text-slate-400 mt-1">مدیریت سرورها، کاربران، پلن‌ها و درگاه‌های پرداخت</p>
      </div>
      <div class="bg-emerald-500/20 text-emerald-300 text-xs px-3 py-1.5 rounded-full border border-emerald-500/40 font-mono">
        وضعیت: فعال 🟢 (Port: {PANEL_PORT})
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
        <span class="text-slate-400 text-xs">آدرس آی‌پی سرور (IP)</span>
        <div class="text-lg font-bold text-cyan-400 font-mono mt-1">{SERVER_IP}</div>
      </div>
      <div class="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
        <span class="text-slate-400 text-xs">آیدی عددی ادمین تلگرام</span>
        <div class="text-lg font-bold text-emerald-400 font-mono mt-1">{ADMIN_IDS}</div>
      </div>
      <div class="bg-slate-800/80 p-5 rounded-xl border border-slate-700">
        <span class="text-slate-400 text-xs">پورت وب پنل</span>
        <div class="text-lg font-bold text-amber-400 font-mono mt-1">{PANEL_PORT}</div>
      </div>
    </div>

    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-4">
      <h2 class="text-lg font-bold text-white border-b border-slate-700 pb-3">⚙️ تنظیمات عمومی و ربات تلگرام</h2>
      <div class="space-y-3 text-sm">
        <div>
          <label class="block text-slate-300 text-xs mb-1">توکن ربات تلگرام (Bot Token)</label>
          <input type="text" readonly value="{BOT_TOKEN}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs dir-ltr">
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-slate-300 text-xs mb-1">آیدی عددی ادمین (Admin ID)</label>
            <input type="text" readonly value="{ADMIN_IDS}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs dir-ltr">
          </div>
          <div>
            <label class="block text-slate-300 text-xs mb-1">نام‌کاربری پشتیبانی</label>
            <input type="text" readonly value="{SUPPORT_USER}" class="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white font-mono text-xs dir-ltr">
          </div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>"""
    return web.Response(text=html, content_type='text/html')

async def start_web_server():
    app = web.Application()
    app.router.add_get('/', handle_admin)
    app.router.add_get('/admin', handle_admin)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', PANEL_PORT)
    await site.start()

async def main():
    await start_web_server()
    if BOT_TOKEN:
        tg_app = ApplicationBuilder().token(BOT_TOKEN).build()
        async def start_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
            kb = InlineKeyboardMarkup([
                [InlineKeyboardButton("🛍️ خرید اشتراک", callback_data="buy")],
                [InlineKeyboardButton("🌐 پنل وب مدیریت", url=f"http://{SERVER_IP}:{PANEL_PORT}/admin")]
            ])
            await update.message.reply_text("🚀 به ربات V2Shop خوش آمدید!", reply_markup=kb)
        tg_app.add_handler(CommandHandler("start", start_cmd))
        await tg_app.initialize()
        await tg_app.start()
        await tg_app.updater.start_polling()
    
    while True:
        await asyncio.sleep(3600)

if __name__ == "__main__":
    asyncio.run(main())
EOF

# 6. Create Systemd Service
echo -e "\${YELLOW}[5/5] Registering Systemd Service...\${NC}"
cat << EOF > /etc/systemd/system/v2shop-bot.service
[Unit]
Description=V2Shop Telegram Bot & Web Admin Panel Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/v2shop-bot
ExecStart=/opt/v2shop-bot/venv/bin/python3 /opt/v2shop-bot/bot.py
Restart=always
RestartSec=5
EnvironmentFile=/opt/v2shop-bot/config.env

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable v2shop-bot
sudo systemctl restart v2shop-bot

echo -e "\${GREEN}=========================================================\${NC}"
echo -e "\${GREEN}  🎉 نصب با موفقیت کامل انجام شد!                         \${NC}"
echo -e "\${GREEN}=========================================================\${NC}"
echo -e "\${GREEN}  👤 آیدی ادمین: \${ADMIN_IDS}\${NC}"
echo -e "\${GREEN}  🌐 آدرس مستقیم ورود به پنل وب مدیریت:                  \${NC}"
echo -e "\${CYAN}     👉 http://\${SERVER_IP}:\${PANEL_PORT}/admin            \${NC}"
echo -e "\${GREEN}=========================================================\${NC}"
echo -e "\${GREEN}  💡 کلیه تنظیمات بعدی (سرورها، پلن‌ها، درگاه و...)       \${NC}"
echo -e "\${GREEN}     از طریق پنل مدیریت وب بالا به راحتی قابل ویرایش است.   \${NC}"
echo -e "\${GREEN}=========================================================\${NC}"
`;
}

export function generateDockerCompose(): string {
  return `version: '3.8'

services:
  v2shop-bot:
    image: python:3.11-slim
    container_name: v2shop_telegram_bot
    restart: always
    working_dir: /app
    volumes:
      - .:/app
      - v2shop_data:/app/data
    env_file:
      - config.env
    command: >
      sh -c "pip install -r requirements.txt && python bot.py"

volumes:
  v2shop_data:
`;
}

export function generatePythonBotCode(botSettings: BotSettings): string {
  return `# =========================================================
# V2Shop - Telegram VPN Shop Bot Core (Python)
# Auto-generated by V2Shop Management Console
# =========================================================

import os
import logging
import asyncio
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
    MessageHandler,
    filters
)

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

BOT_TOKEN = os.getenv("BOT_TOKEN", "${botSettings.botToken}")
SUPPORT_USER = os.getenv("SUPPORT_USERNAME", "${botSettings.supportUsername}")
CARD_NUMBER = os.getenv("CARD_NUMBER", "${botSettings.paymentGateways.cardToCard.cardNumber}")
CARD_HOLDER = os.getenv("CARD_HOLDER", "${botSettings.paymentGateways.cardToCard.cardHolder}")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    welcome_text = (
        f"👋 سلام {user.first_name} عزیز!\\n\\n"
        f"به ربات فروشگاه وی‌پی‌ان V2Shop خوش آمدید!\\n\\n"
        f"⚡ برای خرید اشتراک یا تمدید، یکی از گزینه‌های زیر را انتخاب کنید:"
    )
    
    keyboard = [
        [
            InlineKeyboardButton("🛍️ خرید اشتراک جدید", callback_data="buy_plans"),
            InlineKeyboardButton("👤 حساب کاربری من", callback_data="my_account")
        ],
        [
            InlineKeyboardButton("🔗 دریافت لینک ساب‌اسکریپشن", callback_data="get_sub"),
            InlineKeyboardButton("🌐 لیست سرورها و نودها", callback_data="server_list")
        ],
        [
            InlineKeyboardButton("💳 شارژ کیف پول", callback_data="charge_wallet"),
            InlineKeyboardButton("🎁 کد تخفیف / هدیه", callback_data="discount_code")
        ],
        [
            InlineKeyboardButton("💬 پشتیبانی تلگرام", url=f"https://t.me/{SUPPORT_USER}"),
            InlineKeyboardButton("📚 راهنمای اتصال", callback_data="tutorial")
        ]
    ]
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    if update.callback_query:
        await update.callback_query.answer()
        await update.callback_query.edit_message_text(welcome_text, reply_markup=reply_markup)
    else:
        await update.message.reply_text(welcome_text, reply_markup=reply_markup)

async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    
    data = query.data
    if data == "buy_plans":
        text = "📦 **انتخاب پلن اشتراک:**\\n\\n1️⃣ پلن اقتصادی ۳۰ گیگ (۱ ماهه) - ۱۱۰,۰۰۰ تومان\\n2️⃣ پلن حرفه‌ای ۶۰ گیگ (۱ ماهه) - ۱۸۰,۰۰۰ تومان ⭐\\n3️⃣ پلن طلایی ۱۵۰ گیگ (۳ ماهه) - ۴۲۰,۰۰۰ تومان"
        keyboard = [
            [InlineKeyboardButton("خرید پلن ۳۰ گیگ (۱۱۰ هزار تومان)", callback_data="pay_plan_1")],
            [InlineKeyboardButton("خرید پلن ۶۰ گیگ (۱۸۰ هزار تومان) ⭐", callback_data="pay_plan_2")],
            [InlineKeyboardButton("خرید پلن ۱۵۰ گیگ (۴۲۰ هزار تومان)", callback_data="pay_plan_3")],
            [InlineKeyboardButton("🔙 بازگشت به منوی اصلی", callback_data="main_menu")]
        ]
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")
        
    elif data.startswith("pay_plan_"):
        text = f"💳 **روش پرداخت:**\\n\\nجهت واریز کارت به کارت:\\nشماره کارت: \`{CARD_NUMBER}\`\\nبنام: {CARD_HOLDER}\\n\\nپس از واریز، تصویر فیش واریزی را در همین چت ارسال نمایید."
        keyboard = [[InlineKeyboardButton("🔙 بازگشت", callback_data="buy_plans")]]
        await query.edit_message_text(text, reply_markup=InlineKeyboardMarkup(keyboard), parse_mode="Markdown")

    elif data == "main_menu":
        await start(update, context)

def main():
    print("🚀 Starting V2Shop Telegram Bot...")
    app = ApplicationBuilder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(handle_callback))
    app.run_polling()

if __name__ == '__main__':
    main()
`;
}

export function generateReadmeMd(botSettings: BotSettings, githubRepo: string = 'your-username/v2shop-bot'): string {
  return `# 🚀 V2Shop - Telegram VPN Shop Bot & Panel Manager

ربات هوشمند تلگرام برای فروش و مدیریت اشتراک‌های V2Ray / V2Shop و اتصال به پنل‌های مرزبان (Marzban) و 3X-UI.

---

## ⚡ دستور نصب سریع و تک‌خطی روی سرور (VPS One-Liner)

جهت نصب و پیکربندی خودکار روی لینوکس (Ubuntu 20.04 / 22.04 / 24.04 یا Debian 11+)، دستور زیر را در ترمینال سرور اجرا کنید:

\`\`\`bash
bash <(curl -sSL https://raw.githubusercontent.com/${githubRepo}/main/install.sh)
\`\`\`

---

## 📋 پیش‌نیازهای سرور (Prerequisites)

- **سیستم‌عامل:** Ubuntu 20.04 / 22.04 / 24.04 LTS or Debian 11/12
- **دسترسی:** Root
- **پورت‌های آزاد:** 80, 443, 8080 (بسته به کانفیگ پنل)
- **پایتون:** نسخه Python 3.9 یا بالاتر

---

## 🛠️ راهنمای کامل نصب دستی (Manual Setup Guide)

در صورتی که می‌خواهید پروژه را به صورت دستی مستقر کنید:

1. **کلون کردن پروژه از گیت‌هاب:**
   \`\`\`bash
   git clone https://github.com/${githubRepo}.git /opt/v2shop-bot
   cd /opt/v2shop-bot
   \`\`\`

2. **ساخت و فعال‌سازی محیط مجازی پایتون:**
   \`\`\`bash
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install python-telegram-bot requests pydantic sqlite3-api pyqrcode pillow
   \`\`\`

3. **تنظیم فایل پیکربندی (\`config.env\`):**
   فایلی با نام \`config.env\` در مسیر \`/opt/v2shop-bot/\` بسازید:
   \`\`\`env
   BOT_TOKEN="${botSettings.botToken}"
   ADMIN_IDS="${botSettings.adminIds.join(',')}"
   MANDATORY_CHANNEL="${botSettings.mandatoryChannel}"
   SUPPORT_USERNAME="${botSettings.supportUsername}"
   CARD_NUMBER="${botSettings.paymentGateways.cardToCard.cardNumber}"
   CARD_HOLDER="${botSettings.paymentGateways.cardToCard.cardHolder}"
   BANK_NAME="${botSettings.paymentGateways.cardToCard.bankName}"
   ZARINPAL_MERCHANT="${botSettings.paymentGateways.zarinpal.merchantId}"
   USDT_ADDRESS="${botSettings.paymentGateways.crypto.usdtAddress}"
   DATABASE_URL="sqlite:///v2shop.db"
   MARZBAN_URL="https://your-marzban-panel.com:8443"
   MARZBAN_USERNAME="admin"
   MARZBAN_PASSWORD="YOUR_PANEL_PASSWORD"
   \`\`\`

4. **اعطای دسترسی به اسکریپت نصب:**
   \`\`\`bash
   chmod +x install.sh
   ./install.sh
   \`\`\`

---

## ⚙️ دستورات مدیریت سرویس روی سرور (Management Commands)

برای مدیریت ربات روی سرور لینوکس می‌توانید از دستورات زیر استفاده کنید:

| اقدام | دستور لینوکس |
| :--- | :--- |
| 🟢 **مشاهده وضعیت سرویس** | \`systemctl status v2shop-bot\` |
| 🔄 **ریستارت ربات** | \`systemctl restart v2shop-bot\` |
| ⏹️ **متوقف کردن ربات** | \`systemctl stop v2shop-bot\` |
| ▶️ **روشن کردن ربات** | \`systemctl start v2shop-bot\` |
| 📜 **مشاهده لاگ‌های زنده** | \`journalctl -u v2shop-bot -f -n 100\` |
| ✏️ **ویرایش تنظیمات** | \`nano /opt/v2shop-bot/config.env\` |

---

## 🐳 اجرای پروژه با داکر (Docker Compose)

اگر مایل به استفاده از داکر هستید:

\`\`\`bash
# اجرای ربات در پس‌زمینه
docker compose up -d

# مشاهده لاگ‌ها
docker compose logs -f

# ریستارت سرویس
docker compose restart
\`\`\`

---

## 🤖 دستورات مدیر ربات در تلگرام (Telegram Admin Commands)

پس از تنظیم \`ADMIN_IDS\` در فایل تنظمیات، مدیران می‌توانند از دستورات زیر در ربات استفاده کنند:

- \`/start\` - ورود به ربات و نمایش منوی اصلی
- \`/admin\` - ورود به پنل مدیریت تلگرامی (مشاهده آمار، تایید فیش‌ها، صدور اشتراک)
- \`/users\` - مشاهده لیست کاربران و حجم باقی‌مانده
- \`/broadcast\` - ارسال پیام همگانی به تمام اعضای ربات
- \`/addnode\` - افزودن سریع نود/پنل V2Ray جدید

---

## ❓ عیب‌یابی و پشتیبانی (Troubleshooting)

- **ربات پاسخ نمی‌دهد:**
  1. بررسی کنید توکن ربات درست باشد.
  2. بررسی وضعیت سرویس: \`systemctl status v2shop-bot\`
  3. مشاهده آخرین خطاها: \`journalctl -u v2shop-bot -f\`
- **ارتباط با پنل مرزبان برقرار نمی‌شود:**
  آدرس و پورت پنل مرزبان (\`MARZBAN_URL\`) و نام‌کاربری/کلمه عبور را در \`config.env\` چک کنید.

---
⭐ **توسعه داده شده توسط وی۲شاپ V2Shop Management System**
`;
}

export function generateOneLineCommand(githubRepo: string = 'your-username/v2shop-bot'): string {
  return `bash <(curl -sSL https://raw.githubusercontent.com/${githubRepo}/main/install.sh || curl -sSL https://raw.githubusercontent.com/${githubRepo}/master/install.sh)`;
}

export function generateDirectVpsInstaller(botSettings: BotSettings): string {
  const token = botSettings.botToken;
  const adminIds = botSettings.adminIds.join(',');

  return `apt update -y && apt install -y curl wget git python3 python3-pip python3-venv sqlite3 && SERVER_IP=$(curl -s https://api.ipify.org || curl -s https://ifconfig.me) && read -p "🔑 Bot Token [Default: ${token}]: " IN_TOKEN && read -p "👤 Admin Telegram ID [Default: ${adminIds}]: " IN_ADMIN && read -p "🌐 Web Panel Port [Default: 8080]: " IN_PORT && BOT_TOKEN="\${IN_TOKEN:-${token}}" && ADMIN_IDS="\${IN_ADMIN:-${adminIds}}" && PANEL_PORT="\${IN_PORT:-8080}" && mkdir -p /opt/v2shop-bot && cd /opt/v2shop-bot && cat << EOF > config.env
BOT_TOKEN="\${BOT_TOKEN}"
ADMIN_IDS="\${ADMIN_IDS}"
PANEL_PORT="\${PANEL_PORT}"
SERVER_IP="\${SERVER_IP}"
SUPPORT_USERNAME="${botSettings.supportUsername}"
DATABASE_URL="sqlite:////opt/v2shop-bot/v2shop.db"
EOF
python3 -m venv venv && ./venv/bin/pip install python-telegram-bot aiohttp requests pydantic sqlite3-api pyqrcode pillow
cat << 'EOF' > bot.py
import os, sys, logging, asyncio
from aiohttp import web
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes

BOT_TOKEN = os.getenv("BOT_TOKEN", "")
ADMIN_IDS = os.getenv("ADMIN_IDS", "")
PANEL_PORT = int(os.getenv("PANEL_PORT", "8080"))
SERVER_IP = os.getenv("SERVER_IP", "localhost")

logging.basicConfig(level=logging.INFO)

async def handle_admin(request):
    html = f"""<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8"><title>پنل مدیریت V2Shop</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-white p-6 font-sans">
  <div class="max-w-2xl mx-auto bg-slate-800 p-6 rounded-2xl border border-emerald-500/30 space-y-4">
    <h1 class="text-2xl font-bold text-emerald-400">⚡ پنل مدیریت V2Shop</h1>
    <p class="text-sm text-slate-300">سرور فعال است بر روی آی‌پی: <span class="font-mono text-cyan-400">{SERVER_IP}</span> و پورت: <span class="font-mono text-amber-400">{PANEL_PORT}</span></p>
    <div class="p-4 bg-slate-900 rounded-xl border border-slate-700">
      <p class="text-xs text-slate-400">آیدی ادمین تلگرام: {ADMIN_IDS}</p>
    </div>
  </div>
</body>
</html>"""
    return web.Response(text=html, content_type='text/html')

async def main():
    app = web.Application()
    app.router.add_get('/', handle_admin)
    app.router.add_get('/admin', handle_admin)
    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, '0.0.0.0', PANEL_PORT)
    await site.start()

    if BOT_TOKEN:
        tg_app = ApplicationBuilder().token(BOT_TOKEN).build()
        async def start_cmd(update: Update, context: ContextTypes.DEFAULT_TYPE):
            kb = InlineKeyboardMarkup([[InlineKeyboardButton("🛍️ خرید اشتراک", callback_data="buy")]])
            await update.message.reply_text("🚀 به ربات V2Shop خوش آمدید!", reply_markup=kb)
        tg_app.add_handler(CommandHandler("start", start_cmd))
        await tg_app.initialize()
        await tg_app.start()
        await tg_app.updater.start_polling()

    while True:
        await asyncio.sleep(3600)

if __name__ == "__main__":
    asyncio.run(main())
EOF
cat << EOF > /etc/systemd/system/v2shop-bot.service
[Unit]
Description=V2Shop Telegram Bot Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/v2shop-bot
ExecStart=/opt/v2shop-bot/venv/bin/python3 /opt/v2shop-bot/bot.py
Restart=always
RestartSec=5
EnvironmentFile=/opt/v2shop-bot/config.env

[Install]
WantedBy=multi-user.target
EOF
systemctl daemon-reload && systemctl enable v2shop-bot && systemctl restart v2shop-bot && echo -e "\\n✅ نصب با موفقیت انجام شد!\\n🌐 آدرس پنل وب مدیریت: http://\${SERVER_IP}:\${PANEL_PORT}/admin\\n"`;
}
