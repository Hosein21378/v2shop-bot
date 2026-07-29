import { VPNNode, PackagePlan, UserSubscription, Order, DiscountCode, BotSettings } from '../types';

export const initialNodes: VPNNode[] = [
  {
    id: 'node-1',
    name: 'آلمان 01 - فرانکفورت (Marzban)',
    type: 'marzban',
    host: 'de1.v2server-net.com',
    port: 8443,
    status: 'online',
    latencyMs: 42,
    cpuUsage: 28,
    ramUsage: 45,
    activeUsers: 342,
    totalBandwidthGb: 10000,
    usedBandwidthGb: 3840,
    flag: '🇩🇪',
    protocols: ['VLESS', 'VMess', 'Trojan', 'Shadowsocks']
  },
  {
    id: 'node-2',
    name: 'هلند - آمستردام (3X-UI)',
    type: '3xui',
    host: 'nl1.v2server-net.com',
    port: 2053,
    status: 'online',
    latencyMs: 58,
    cpuUsage: 19,
    ramUsage: 38,
    activeUsers: 215,
    totalBandwidthGb: 5000,
    usedBandwidthGb: 1420,
    flag: '🇳🇱',
    protocols: ['VLESS+REALITY', 'Trojan']
  },
  {
    id: 'node-3',
    name: 'فنلاند - هلسینکی (Hiddify)',
    type: 'hiddify',
    host: 'fi1.v2server-net.com',
    port: 443,
    status: 'online',
    latencyMs: 65,
    cpuUsage: 34,
    ramUsage: 52,
    activeUsers: 189,
    totalBandwidthGb: 8000,
    usedBandwidthGb: 2910,
    flag: '🇫🇮',
    protocols: ['VLESS', 'VMess', 'gRPC']
  },
  {
    id: 'node-4',
    name: 'فرانسه - پاریس (Backup Node)',
    type: 'v2ray',
    host: 'fr1.v2server-net.com',
    port: 8080,
    status: 'degraded',
    latencyMs: 140,
    cpuUsage: 88,
    ramUsage: 82,
    activeUsers: 94,
    totalBandwidthGb: 3000,
    usedBandwidthGb: 2450,
    flag: '🇫🇷',
    protocols: ['VLESS', 'Shadowsocks']
  }
];

export const initialPlans: PackagePlan[] = [
  {
    id: 'plan-1',
    titleFa: 'پلن یک‌ماهه اقتصادی (۳۰ گیگ)',
    titleEn: '1 Month Starter (30 GB)',
    trafficGb: 30,
    durationDays: 30,
    priceToman: 110000,
    priceUsdt: 1.8,
    popular: false,
    active: true,
    protocols: ['VLESS', 'VMess', 'Trojan'],
    maxDevices: 2,
    descriptionFa: 'مناسب وب‌گردی و پیام‌رسان‌ها با سرعت تضمینی',
    descriptionEn: 'Ideal for light browsing and messaging apps'
  },
  {
    id: 'plan-2',
    titleFa: 'پلن یک‌ماهه حرفه‌ای (۶۰ گیگ) ⭐ محبوب',
    titleEn: '1 Month Pro (60 GB) ⭐ Popular',
    trafficGb: 60,
    durationDays: 30,
    priceToman: 180000,
    priceUsdt: 2.9,
    popular: true,
    active: true,
    protocols: ['VLESS+REALITY', 'VMess', 'Trojan', 'gRPC'],
    maxDevices: 2,
    descriptionFa: 'مناسب دانلود، اینستاگرام و یوتیوب با پینگ پایین',
    descriptionEn: 'High-speed for streaming, social media and YouTube'
  },
  {
    id: 'plan-3',
    titleFa: 'پلن سه ماهه طلایی (۱۵۰ گیگ)',
    titleEn: '3 Months Gold (150 GB)',
    trafficGb: 150,
    durationDays: 90,
    priceToman: 420000,
    priceUsdt: 6.8,
    popular: false,
    active: true,
    protocols: ['VLESS+REALITY', 'VMess', 'Trojan', 'Shadowsocks'],
    maxDevices: 3,
    descriptionFa: 'با صرفه اقتصادی بالا و IP ثابت اختصاصی برای ترید',
    descriptionEn: 'Great value with stable IP support for trading'
  },
  {
    id: 'plan-4',
    titleFa: 'اشتراک نامحدود حجمی (یک ماهه ۱ کاربره)',
    titleEn: '1 Month Unlimited Speed Pass',
    trafficGb: 200,
    durationDays: 30,
    priceToman: 350000,
    priceUsdt: 5.6,
    popular: false,
    active: true,
    protocols: ['VLESS+REALITY', 'Trojan'],
    maxDevices: 1,
    descriptionFa: 'ویژه کاربران پرمصرف با ترافیک ۲۰۰ گیگابایتی',
    descriptionEn: 'For power users with 200GB limit'
  }
];

export const initialSubscriptions: UserSubscription[] = [
  {
    id: 'sub-1001',
    telegramId: '98765432',
    username: 'ali_rezaei',
    fullName: 'علی رضایی',
    packageNameFa: 'پلن یک‌ماهه حرفه‌ای (۶۰ گیگ)',
    packageNameEn: '1 Month Pro (60 GB)',
    totalTrafficGb: 60,
    usedTrafficGb: 24.5,
    startDate: '2026-07-10',
    expireDate: '2026-08-10',
    status: 'active',
    subUrl: 'https://sub.v2server-net.com/sub/sub-1001-ali-x9y8z7',
    configLinks: [
      'vless://8a91b2c3-d4e5-4f6a-8b9c-0d1e2f3a4b5c@de1.v2server-net.com:8443?type=tcp&security=reality&pbk=xyz#Ali_DE_VLESS',
      'vmess://eyJ2IjoiMiIsInBzIjoiQWxpX0RFX1ZNZXNzIiwiYWRkIjoiaGVsc2lua2kudjJzZXJ2ZXIubmV0IiwicG9ydCI6NDQzLCJpZCI6IjhhOTFiMmMzLWQ0ZTUtNGY2YS04YjljLTBkMWUyZjNhNGI1YyIsImFpZCI6MCwibmV0Ijoid3MiLCJ0eXBlIjoibm9uZSIsImhvc3QiOiIiLCJwYXRoIjoiL3ZtZXNzIiwidGxzIjoidGxzIn0='
    ],
    balanceToman: 45000,
    nodeId: 'node-1'
  },
  {
    id: 'sub-1002',
    telegramId: '12345678',
    username: 'sara_m',
    fullName: 'سارا محمدی',
    packageNameFa: 'پلن سه ماهه طلایی (۱۵۰ گیگ)',
    packageNameEn: '3 Months Gold (150 GB)',
    totalTrafficGb: 150,
    usedTrafficGb: 112.0,
    startDate: '2026-05-20',
    expireDate: '2026-08-20',
    status: 'active',
    subUrl: 'https://sub.v2server-net.com/sub/sub-1002-sara-a1b2c3',
    configLinks: [
      'vless://3f4e5d6c-7b8a-9f0e-1d2c-3b4a5f6e7d8c@nl1.v2server-net.com:2053?type=grpc&security=reality#Sara_NL_VLESS'
    ],
    balanceToman: 0,
    nodeId: 'node-2'
  },
  {
    id: 'sub-1003',
    telegramId: '55443322',
    username: 'mehdi_dev',
    fullName: 'مهدی احمدی',
    packageNameFa: 'پلن یک‌ماهه اقتصادی (۳۰ گیگ)',
    packageNameEn: '1 Month Starter (30 GB)',
    totalTrafficGb: 30,
    usedTrafficGb: 30.0,
    startDate: '2026-06-01',
    expireDate: '2026-07-01',
    status: 'expired',
    subUrl: 'https://sub.v2server-net.com/sub/sub-1003-mehdi-p9o8i7',
    configLinks: [
      'trojan://pass123456@fi1.v2server-net.com:443?type=ws&path=%2Ftrojan#Mehdi_FI_Trojan'
    ],
    balanceToman: 120000,
    nodeId: 'node-3'
  }
];

export const initialOrders: Order[] = [
  {
    id: 'ord-501',
    orderCode: 'ORD-9821',
    telegramId: '98765432',
    username: 'ali_rezaei',
    packageId: 'plan-2',
    packageName: 'پلن یک‌ماهه حرفه‌ای (۶۰ گیگ)',
    amountToman: 180000,
    amountUsdt: 2.9,
    paymentMethod: 'card_to_card',
    status: 'pending',
    receiptImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=600&auto=format&fit=crop&q=80',
    createdAt: '2026-07-29 10:15'
  },
  {
    id: 'ord-502',
    orderCode: 'ORD-9820',
    telegramId: '12345678',
    username: 'sara_m',
    packageId: 'plan-3',
    packageName: 'پلن سه ماهه طلایی (۱۵۰ گیگ)',
    amountToman: 420000,
    amountUsdt: 6.8,
    paymentMethod: 'zarinpal',
    status: 'approved',
    createdAt: '2026-07-28 16:40',
    refId: 'ZP-884920192'
  },
  {
    id: 'ord-503',
    orderCode: 'ORD-9819',
    telegramId: '55443322',
    username: 'mehdi_dev',
    packageId: 'plan-1',
    packageName: 'پلن یک‌ماهه اقتصادی (۳۰ گیگ)',
    amountToman: 110000,
    amountUsdt: 1.8,
    paymentMethod: 'crypto',
    status: 'approved',
    createdAt: '2026-07-27 12:05',
    refId: '0x8f2a...912c'
  }
];

export const initialDiscounts: DiscountCode[] = [
  {
    id: 'disc-1',
    code: 'OFF20',
    discountPercent: 20,
    fixedDiscountToman: 0,
    maxUses: 100,
    usedCount: 34,
    expireDate: '2026-08-30',
    active: true
  },
  {
    id: 'disc-2',
    code: 'WELCOME50K',
    discountPercent: 0,
    fixedDiscountToman: 50000,
    maxUses: 50,
    usedCount: 12,
    expireDate: '2026-09-15',
    active: true
  }
];

export const initialBotSettings: BotSettings = {
  botToken: '7192834012:AAH9f2Xk8qL0mW1n2P3o4Q5r6S7t8U9v0W',
  botUsername: 'V2ShopVPNBot',
  adminIds: ['98765432', '12345678'],
  mandatoryChannel: '@V2ShopNet_Channel',
  requireChannelJoin: true,
  welcomeMessageFa: '👋 به ربات فروشگاه وی‌پی‌ان V2Shop خوش آمدید!\n\n🚀 ارائه‌دهنده سرورهای پرسرعت اختصاصی آلمان، هلند و فنلاند با پروتکل‌های VLESS Reality و Trojan بدون قطع‌و‌وصلی.',
  welcomeMessageEn: '👋 Welcome to V2Shop VPN Store Bot!\n\n🚀 High speed dedicated servers from Germany, Netherlands & Finland with VLESS Reality & Trojan.',
  supportUsername: 'V2Shop_Admin_Support',
  trialEnabled: true,
  trialTrafficGb: 2,
  trialDays: 1,
  autoBackup: true,
  autoRenewReminder: true,
  paymentGateways: {
    cardToCard: {
      enabled: true,
      cardNumber: '6037 9975 1234 5678',
      cardHolder: 'محمد امینی',
      bankName: 'بانک ملی ایران'
    },
    zarinpal: {
      enabled: true,
      merchantId: 'xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
    },
    crypto: {
      enabled: true,
      usdtAddress: 'TY4dK8s9xL2pQ1mN0oR7sT6uV5wX3yZ2aB',
      network: 'TRC20 (Tron)'
    }
  }
};
