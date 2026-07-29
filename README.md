# 🚀 V2Shop - Telegram VPN Shop Bot & Panel Manager

ربات هوشمند تلگرام برای فروش و مدیریت اشتراک‌های V2Ray / V2Shop و اتصال به پنل‌های مرزبان (Marzban) و 3X-UI.

---

## ⚡ دستور نصب سریع و تک‌خطی روی سرور (VPS One-Liner)

جهت نصب و پیکربندی خودکار روی لینوکس (Ubuntu 20.04 / 22.04 / 24.04 یا Debian 11+)، دستور زیر را در ترمینال سرور اجرا کنید:

```bash
bash <(curl -sSL https://raw.githubusercontent.com/Hosein21378/v2shop-bot/main/install.sh)
```

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
   ```bash
   git clone https://github.com/Hosein21378/v2shop-bot.git /opt/v2shop-bot
   cd /opt/v2shop-bot
   ```

2. **ساخت و فعال‌سازی محیط مجازی پایتون:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install --upgrade pip
   pip install python-telegram-bot requests pydantic sqlite3-api pyqrcode pillow
   ```

3. **تنظیم فایل پیکربندی (`config.env`):**
   فایلی با نام `config.env` در مسیر `/opt/v2shop-bot/` بسازید:
   ```env
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
   ```

4. **اعطای دسترسی به اسکریپت نصب:**
   ```bash
   chmod +x install.sh
   ./install.sh
   ```

---

## ⚙️ دستورات مدیریت سرویس روی سرور (Management Commands)

برای مدیریت ربات روی سرور لینوکس می‌توانید از دستورات زیر استفاده کنید:

| اقدام | دستور لینوکس |
| :--- | :--- |
| 🟢 **مشاهده وضعیت سرویس** | `systemctl status v2shop-bot` |
| 🔄 **ریستارت ربات** | `systemctl restart v2shop-bot` |
| ⏹️ **متوقف کردن ربات** | `systemctl stop v2shop-bot` |
| ▶️ **روشن کردن ربات** | `systemctl start v2shop-bot` |
| 📜 **مشاهده لاگ‌های زنده** | `journalctl -u v2shop-bot -f -n 100` |
| ✏️ **ویرایش تنظیمات** | `nano /opt/v2shop-bot/config.env` |

---

## 🐳 اجرای پروژه با داکر (Docker Compose)

اگر مایل به استفاده از داکر هستید:

```bash
# اجرای ربات در پس‌زمینه
docker compose up -d

# مشاهده لاگ‌ها
docker compose logs -f

# ریستارت سرویس
docker compose restart
```

---

## 🤖 دستورات مدیر ربات در تلگرام (Telegram Admin Commands)

پس از تنظیم `ADMIN_IDS` در فایل تنظمیات، مدیران می‌توانند از دستورات زیر در ربات استفاده کنند:

- `/start` - ورود به ربات و نمایش منوی اصلی
- `/admin` - ورود به پنل مدیریت تلگرامی (مشاهده آمار، تایید فیش‌ها، صدور اشتراک)
- `/users` - مشاهده لیست کاربران و حجم باقی‌مانده
- `/broadcast` - ارسال پیام همگانی به تمام اعضای ربات
- `/addnode` - افزودن سریع نود/پنل V2Ray جدید

---

## ❓ عیب‌یابی و پشتیبانی (Troubleshooting)

- **ربات پاسخ نمی‌دهد:**
  1. بررسی کنید توکن ربات درست باشد.
  2. بررسی وضعیت سرویس: `systemctl status v2shop-bot`
  3. مشاهده آخرین خطاها: `journalctl -u v2shop-bot -f`
- **ارتباط با پنل مرزبان برقرار نمی‌شود:**
  آدرس و پورت پنل مرزبان (`MARZBAN_URL`) و نام‌کاربری/کلمه عبور را در `config.env` چک کنید.

---
⭐ **توسعه داده شده توسط وی۲شاپ V2Shop Management System**
