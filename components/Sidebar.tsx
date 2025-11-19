
import React from 'react';
import { ViewState } from '../types';
import { 
  LayoutDashboard, 
  Database, 
  Stethoscope, 
  Network, 
  Activity,
  ShieldCheck,
  BookOpenCheck,
  Layers
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onViewChange: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange }) => {
  const menuItems = [
    { 
      id: ViewState.DASHBOARD, 
      label: '网络概览', 
      icon: <LayoutDashboard size={20} />,
      desc: '中心-辐射地图'
    },
    { 
      id: ViewState.ARCHITECTURE, 
      label: '系统架构', 
      icon: <Layers size={20} />,
      desc: '技术拓扑图'
    },
    { 
      id: ViewState.DATA_ADAPTOR, 
      label: '数据适配器', 
      icon: <Database size={20} />,
      desc: 'ETL与隐私清洗'
    },
    { 
      id: ViewState.KNOWLEDGE_BASE, 
      label: '阜外金标准库', 
      icon: <BookOpenCheck size={20} />,
      desc: '权威指南与共识'
    },
    { 
      id: ViewState.DOCTOR_STATION, 
      label: '医生工作站', 
      icon: <Stethoscope size={20} />,
      desc: '本地 RAG 推理'
    },
    { 
      id: ViewState.FEDERATED_LEARNING, 
      label: '联邦评估', 
      icon: <Network size={20} />,
      desc: '反馈闭环机制'
    },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2 text-blue-700 font-bold text-xl">
          <Activity className="h-8 w-8" />
          <span>医智网 (MedGrid)</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">国家心血管智慧分发网络</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-left
              ${currentView === item.id 
                ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
          >
            <div className={`${currentView === item.id ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
              {item.icon}
            </div>
            <div>
              <div className="font-medium text-sm">{item.label}</div>
              <div className="text-[10px] opacity-70 uppercase tracking-wider font-semibold mt-0.5">{item.desc}</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-emerald-50 rounded-lg p-3 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-600 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-emerald-800">隐私保护运行中</h4>
            <p className="text-[10px] text-emerald-600 leading-tight mt-1">
              数据驻留本地。仅共享模型梯度与统计反馈。
            </p>
          </div>
        </div>
        <div className="mt-4 text-[10px] text-center text-slate-400">
          由 阜外医院 & 清华大学 提供支持
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
