
import React from 'react';
import NetworkGraph from '../components/NetworkGraph';
import { RAGMetrics } from '../components/RAGMetrics';
import { ViewState } from '../types';
import { ArrowRight, Zap, Database, Activity, Globe, Stethoscope, Network } from 'lucide-react';

interface DashboardProps {
  onViewChange: (view: ViewState) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">国家心血管医疗智慧分发网络</h1>
        <p className="text-slate-500 mt-2 text-lg">
          "数据不出院，智慧可共享。"
        </p>
      </header>

      {/* Main Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="col-span-1 lg:col-span-2">
          <NetworkGraph />
        </div>
        <div className="col-span-1 space-y-4">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <Globe className="absolute -right-4 -bottom-4 w-32 h-32 text-white opacity-10" />
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-1">网络状态</h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-bold">1,204</span>
                <span className="text-blue-200">已连接节点</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                  <span className="opacity-80">活跃会话</span>
                  <span className="font-mono">45,230</span>
                </div>
                <div className="flex justify-between items-center text-sm border-b border-white/10 pb-2">
                  <span className="opacity-80">知识库版本</span>
                  <span className="font-mono">v2024.05.12</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="opacity-80">联邦学习轮次</span>
                  <span className="font-mono">Round #89</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">分发网络架构</h3>
            <div className="space-y-4">
               <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-lg">
                    <Zap className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">阜外医院 (发电厂)</h4>
                    <p className="text-xs text-slate-500">制定金标准指南、共识与基础模型训练。</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="bg-violet-100 p-2 rounded-lg">
                    <Activity className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">清华大学 (电网建设者)</h4>
                    <p className="text-xs text-slate-500">提供 RAG 技术架构、联邦传输与模型分发。</p>
                  </div>
               </div>
               <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-slate-900">全国医院 (用户)</h4>
                    <p className="text-xs text-slate-500">接入本地数据适配器 + 离线推理引擎。</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* RAG Metrics Section (D3 Charts) */}
      <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="text-blue-600" size={24} /> 实时 RAG 性能监控
          </h2>
          <RAGMetrics />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={() => onViewChange(ViewState.DATA_ADAPTOR)} className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300 text-left">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-emerald-100 p-3 rounded-lg group-hover:bg-emerald-200 transition-colors">
              <Database className="w-6 h-6 text-emerald-700" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
          </div>
          <h3 className="font-bold text-slate-800">1. 数据适配模块</h3>
          <p className="text-sm text-slate-500 mt-2">标准化与隐私清洗的"防火墙"。</p>
        </button>

        <button onClick={() => onViewChange(ViewState.DOCTOR_STATION)} className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300 text-left">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-blue-100 p-3 rounded-lg group-hover:bg-blue-200 transition-colors">
              <Stethoscope className="w-6 h-6 text-blue-700" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
          </div>
          <h3 className="font-bold text-slate-800">2. 医生工作站</h3>
          <p className="text-sm text-slate-500 mt-2">离线 RAG 推理与临床技能包。</p>
        </button>

        <button onClick={() => onViewChange(ViewState.FEDERATED_LEARNING)} className="group bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:border-blue-300 text-left">
          <div className="flex justify-between items-start mb-4">
            <div className="bg-amber-100 p-3 rounded-lg group-hover:bg-amber-200 transition-colors">
              <Network className="w-6 h-6 text-amber-700" />
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-600 transition-colors" />
          </div>
          <h3 className="font-bold text-slate-800">3. 联邦评估与反馈</h3>
          <p className="text-sm text-slate-500 mt-2">三元组回传与模型持续进化。</p>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
