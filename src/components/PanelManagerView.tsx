import React, { useState } from 'react';
import { VPNNode, PanelType, Language } from '../types';
import { 
  Server, 
  Plus, 
  Zap, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Activity, 
  Cpu, 
  HardDrive, 
  ShieldAlert,
  Globe,
  Radio
} from 'lucide-react';

interface PanelManagerViewProps {
  nodes: VPNNode[];
  onAddNode: (newNode: VPNNode) => void;
  onDeleteNode: (id: string) => void;
  lang: Language;
}

export const PanelManagerView: React.FC<PanelManagerViewProps> = ({
  nodes,
  onAddNode,
  onDeleteNode,
  lang
}) => {
  const isFa = lang === 'fa';

  const [showAddModal, setShowAddModal] = useState(false);
  const [testingId, setTestingId] = useState<string | null>(null);

  // Modal form state
  const [name, setName] = useState('');
  const [panelType, setPanelType] = useState<PanelType>('marzban');
  const [host, setHost] = useState('');
  const [port, setPort] = useState(8443);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [flag, setFlag] = useState('🇩🇪');

  const handleTestConnection = (nodeId: string) => {
    setTestingId(nodeId);
    setTimeout(() => {
      setTestingId(null);
    }, 1200);
  };

  const handleCreateNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !host) return;

    const newNode: VPNNode = {
      id: `node-${Date.now()}`,
      name,
      type: panelType,
      host,
      port: Number(port),
      username,
      password,
      status: 'online',
      latencyMs: Math.floor(Math.random() * 40) + 30,
      cpuUsage: Math.floor(Math.random() * 30) + 15,
      ramUsage: Math.floor(Math.random() * 30) + 25,
      activeUsers: 0,
      totalBandwidthGb: 10000,
      usedBandwidthGb: 0,
      flag: flag || '🌐',
      protocols: ['VLESS', 'VMess', 'Trojan']
    };

    onAddNode(newNode);
    setShowAddModal(false);
    setName('');
    setHost('');
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <span>{isFa ? 'مدیریت پنل‌های VPN و نودهای اتصال' : 'VPN Panels & Nodes Connector'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {isFa 
              ? 'اتصال خودکار به API مرزبان (Marzban)، 3X-UI، هیدیفای و V2Ray جهت صدور کانفیگ' 
              : 'Direct API Hooks for Marzban, 3X-UI, Hiddify & V2Ray server endpoints'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{isFa ? 'افزودن سرور / پنل جدید' : 'Add New Panel Node'}</span>
        </button>
      </div>

      {/* Nodes List Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nodes.map((node) => {
          const isTesting = testingId === node.id;

          return (
            <div 
              key={node.id} 
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 hover:border-slate-700 transition-all relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2 rounded-xl bg-slate-950 border border-slate-800">{node.flag}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{node.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase">
                        {node.type}
                      </span>
                    </h3>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      https://{node.host}:{node.port}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                    node.status === 'online'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${node.status === 'online' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                    {node.status === 'online' ? (isFa ? 'برقرار (API)' : 'Connected') : (isFa ? 'کند' : 'Degraded')}
                  </span>

                  <button
                    onClick={() => onDeleteNode(node.id)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                    title={isFa ? 'حذف سرور' : 'Delete node'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Supported Protocols */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {node.protocols.map((proto, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-950 text-slate-300 font-mono border border-slate-800">
                    {proto}
                  </span>
                ))}
              </div>

              {/* Latency & Hardware Stats Grid */}
              <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-800/80 text-xs">
                <div className="bg-slate-950/60 p-2 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block mb-0.5">{isFa ? 'پینگ API' : 'Latency'}</span>
                  <span className="font-mono font-bold text-emerald-400">{node.latencyMs}ms</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block mb-0.5">{isFa ? 'کاربران' : 'Users'}</span>
                  <span className="font-mono font-bold text-cyan-300">{node.activeUsers}</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block mb-0.5">CPU</span>
                  <span className="font-mono font-bold text-slate-200">{node.cpuUsage}%</span>
                </div>
                <div className="bg-slate-950/60 p-2 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block mb-0.5">RAM</span>
                  <span className="font-mono font-bold text-slate-200">{node.ramUsage}%</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => handleTestConnection(node.id)}
                  disabled={isTesting}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 font-medium transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>
                    {isTesting 
                      ? (isFa ? 'در حال پینگ...' : 'Testing...') 
                      : (isFa ? 'تست اتصال API' : 'Test API Health')}
                  </span>
                </button>

                <div className="text-[11px] text-slate-400">
                  {isFa ? 'ترافیک مصرفی:' : 'Used:'} <span className="font-mono text-slate-200 font-bold">{(node.usedBandwidthGb / 1000).toFixed(1)} GB</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Node Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Server className="w-5 h-5 text-cyan-400" />
                <span>{isFa ? 'افزودن پنل VPN جدید' : 'Add VPN Server Panel'}</span>
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateNode} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">{isFa ? 'نام شناسایی سرور' : 'Node Label'}</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="آلمان 02 - مرزبان فرانکفورت"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'نوع پنل' : 'Panel Type'}</label>
                  <select
                    value={panelType}
                    onChange={e => setPanelType(e.target.value as PanelType)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="marzban">Marzban (مرزبان)</option>
                    <option value="3xui">3X-UI / X-UI</option>
                    <option value="hiddify">Hiddify (هیدیفای)</option>
                    <option value="v2ray">V2Ray Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'پرچم کشور' : 'Flag'}</label>
                  <input
                    type="text"
                    value={flag}
                    onChange={e => setFlag(e.target.value)}
                    placeholder="🇩🇪"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'دامنه / آدرس IP' : 'Host / IP'}</label>
                  <input
                    type="text"
                    required
                    value={host}
                    onChange={e => setHost(e.target.value)}
                    placeholder="de2.v2server-net.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'پورت API' : 'Port'}</label>
                  <input
                    type="number"
                    required
                    value={port}
                    onChange={e => setPort(parseInt(e.target.value) || 8443)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'نام کاربری پنل' : 'Username'}</label>
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">{isFa ? 'رمز عبور پنل' : 'Password'}</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium"
                >
                  {isFa ? 'انصراف' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs"
                >
                  {isFa ? 'ثبت و اتصال به پنل' : 'Save & Hook Panel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
