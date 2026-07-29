export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateVlessLink(
  host: string = 'de1.v2server-net.com',
  port: number = 8443,
  remark: string = 'V2Shop_VIP_Germany'
): string {
  const uuid = generateUUID();
  const pbk = 'xP4k9mQ1sN3vR5tW7yZ0aB2cE4fG6hI8';
  const sni = 'www.microsoft.com';
  return `vless://${uuid}@${host}:${port}?type=tcp&security=reality&pbk=${pbk}&fp=chrome&sni=${sni}&sid=1a2b3c4d#${encodeURIComponent(remark)}`;
}

export function generateVmessLink(
  host: string = 'nl1.v2server-net.com',
  port: number = 443,
  remark: string = 'V2Shop_NL_VMess'
): string {
  const uuid = generateUUID();
  const vmessObj = {
    v: "2",
    ps: remark,
    add: host,
    port: port,
    id: uuid,
    aid: 0,
    scy: "auto",
    net: "ws",
    type: "none",
    host: host,
    path: "/vmess",
    tls: "tls"
  };
  const b64 = btoa(JSON.stringify(vmessObj));
  return `vmess://${b64}`;
}

export function generateTrojanLink(
  host: string = 'fi1.v2server-net.com',
  port: number = 443,
  remark: string = 'V2Shop_FI_Trojan'
): string {
  const pass = 'pass_' + Math.random().toString(36).substring(2, 10);
  return `trojan://${pass}@${host}:${port}?type=ws&security=tls&host=${host}&path=%2Ftrojan#${encodeURIComponent(remark)}`;
}

export function generateSubUrl(telegramId: string): string {
  const hash = Math.random().toString(36).substring(2, 8);
  return `https://sub.v2server-net.com/sub/v2shop-${telegramId}-${hash}`;
}
