#!/bin/bash
# =========================================================
# V2Shop Telegram Bot & VPN Panel Manager Installer
# Target OS: Ubuntu 20.04 / 22.04 / 24.04 / Debian 11+
# =========================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================================${NC}"
echo -e "${BLUE}     🚀 Installing V2Shop Modern Telegram VPN Bot      ${NC}"
echo -e "${BLUE}=========================================================${NC}"

# 1. Update System Packages
echo -e "${YELLOW}[1/5] Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git python3 python3-pip python3-venv docker.io docker-compose-plugin

# 2. Setup Working Directory
echo -e "${YELLOW}[2/5] Creating application folder...${NC}"
mkdir -p /opt/v2shop-bot
cd /opt/v2shop-bot

# 3. Create config.env
echo -e "${YELLOW}[3/5] Configuring Environment variables...${NC}"
cat << 'EOF' > /opt/v2shop-bot/config.env
BOT_TOKEN="7192834012:AAH9f2Xk8qL0mW1n2P3o4Q5r6S7t8U9v0W"
ADMIN_IDS="98765432,12345678"
MANDATORY_CHANNEL="@V2ShopNet_Channel"
SUPPORT_USERNAME="V2Shop_Admin_Support"
CARD_NUMBER="6037 9975 1234 5678"
CARD_HOLDER="محمد امینی"
BANK_NAME="بانک ملی ایران"
ZARINPAL_MERCHANT="xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
USDT_ADDRESS="TY4dK8s9xL2pQ1mN0oR7sT6uV5wX3yZ2aB"
DATABASE_URL="sqlite:///v2shop.db"
MARZBAN_URL="https://your-marzban-panel.com:8443"
MARZBAN_USERNAME="admin"
MARZBAN_PASSWORD="YOUR_PANEL_PASSWORD"
EOF

# 4. Create python Virtual environment & install required libraries
echo -e "${YELLOW}[4/5] Setting up Python dependencies...${NC}"
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install python-telegram-bot requests pydantic sqlite3-api pyqrcode pillow

# 5. Create Systemd Service for Auto-start
echo -e "${YELLOW}[5/5] Registering Systemd Service...${NC}"
cat << 'EOF' > /etc/systemd/system/v2shop-bot.service
[Unit]
Description=V2Shop Telegram VPN Bot Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/v2shop-bot
ExecStart=/opt/v2shop-bot/venv/bin/python3 bot.py
Restart=always
RestartSec=5
EnvironmentFile=/opt/v2shop-bot/config.env

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable v2shop-bot
sudo systemctl restart v2shop-bot

echo -e "${GREEN}=========================================================${NC}"
echo -e "${GREEN}  ✅ V2Shop Telegram Bot successfully installed & started! ${NC}"
echo -e "${GREEN}  Telegram Bot Username: @V2ShopVPNBot${NC}"
echo -e "${GREEN}  Check Bot status: systemctl status v2shop-bot${NC}"
echo -e "${GREEN}  View logs: journalctl -u v2shop-bot -f -n 50${NC}"
echo -e "${GREEN}=========================================================${NC}"
