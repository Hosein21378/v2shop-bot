export type Language = 'fa' | 'en';

export type PanelType = 'marzban' | '3xui' | 'hiddify' | 'v2ray' | 'custom';

export interface VPNNode {
  id: string;
  name: string;
  type: PanelType;
  host: string;
  port: number;
  username?: string;
  password?: string;
  status: 'online' | 'offline' | 'degraded';
  latencyMs: number;
  cpuUsage: number;
  ramUsage: number;
  activeUsers: number;
  totalBandwidthGb: number;
  usedBandwidthGb: number;
  flag: string;
  protocols: string[];
}

export interface PackagePlan {
  id: string;
  titleFa: string;
  titleEn: string;
  trafficGb: number;
  durationDays: number;
  priceToman: number;
  priceUsdt: number;
  popular?: boolean;
  active: boolean;
  protocols: string[];
  maxDevices: number;
  descriptionFa?: string;
  descriptionEn?: string;
}

export interface UserSubscription {
  id: string;
  telegramId: string;
  username: string;
  fullName: string;
  packageNameFa: string;
  packageNameEn: string;
  totalTrafficGb: number;
  usedTrafficGb: number;
  startDate: string;
  expireDate: string;
  status: 'active' | 'expired' | 'disabled' | 'pending';
  subUrl: string;
  configLinks: string[];
  balanceToman: number;
  nodeId: string;
}

export interface Order {
  id: string;
  orderCode: string;
  telegramId: string;
  username: string;
  packageId: string;
  packageName: string;
  amountToman: number;
  amountUsdt: number;
  paymentMethod: 'card_to_card' | 'zarinpal' | 'crypto' | 'wallet';
  status: 'pending' | 'approved' | 'rejected';
  receiptImage?: string;
  createdAt: string;
  refId?: string;
}

export interface DiscountCode {
  id: string;
  code: string;
  discountPercent: number;
  fixedDiscountToman: number;
  maxUses: number;
  usedCount: number;
  expireDate: string;
  active: boolean;
}

export interface PaymentGatewayConfig {
  cardToCard: {
    enabled: boolean;
    cardNumber: string;
    cardHolder: string;
    bankName: string;
  };
  zarinpal: {
    enabled: boolean;
    merchantId: string;
  };
  crypto: {
    enabled: boolean;
    usdtAddress: string;
    network: string;
  };
}

export interface BotSettings {
  botToken: string;
  botUsername: string;
  adminIds: string[];
  mandatoryChannel: string;
  requireChannelJoin: boolean;
  welcomeMessageFa: string;
  welcomeMessageEn: string;
  supportUsername: string;
  trialEnabled: boolean;
  trialTrafficGb: number;
  trialDays: number;
  autoBackup: boolean;
  autoRenewReminder: boolean;
  paymentGateways: PaymentGatewayConfig;
}

export interface TelegramSimMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  inlineKeyboard?: { text: string; callbackData: string; url?: string }[][];
  photo?: string;
}

export type ActiveTab = 
  | 'dashboard' 
  | 'bot-manager' 
  | 'panels' 
  | 'plans' 
  | 'users' 
  | 'orders' 
  | 'bot-simulator' 
  | 'vps-installer';
