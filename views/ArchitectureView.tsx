
import React from 'react';
import { 
  Database, 
  Server, 
  Shield, 
  Stethoscope, 
  UploadCloud, 
  DownloadCloud, 
  Cpu, 
  Lock, 
  FileJson,
  Building2
} from 'lucide-react';

const ArchitectureView: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Server className="text-slate-700" />
          系统架构
        </h2>
        <p className="text-slate-500 mt-1">
          中心-辐射拓扑结构 (Hub-and-Spoke): 中心化智能，分布式推理。
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm min-h-[800px] relative overflow-hidden">
        
        {/* SVG Layer for connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#cbd5e1" />
            </marker>
            <marker id="arrow-blue" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
            </marker>
            <marker id="arrow-green" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
              <path d="M0,0 L0,6 L9,3 z" fill="#10b981" />
            </marker>
          </defs>
          
          {/* Central -> Edge (Model Updates) */}
          <path d="M 600 220 L 600 350" stroke="#3b82f6" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-blue)" />
          
          {/* Edge -> Central (Federated Feedback) */}
          <path d="M 680 350 L 680 220" stroke="#10b981" strokeWidth="2" strokeDasharray="5,5" markerEnd="url(#arrow-green)" />

          {/* Local Data Flow */}
          <path d="M 200 550 L 320 550" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 500 550 L 580 550" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" />
          <path d="M 780 550 L 880 550" stroke="#cbd5e1" strokeWidth="2" markerEnd="url(#arrow)" />
          
        </svg>

        {/* --- TOP LAYER: CENTRAL HUB --- */}
        <div className="relative z-10 mb-16">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-violet-600 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Building2 className="text-red-600" /> 中心节点 (阜外医院 & 清华大学)
            </h3>
            
            <div className="grid grid-cols-2 gap-8">
                {/* Knowledge Module */}
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2">
                        <Database size={16} /> 金标准知识模块
                    </h4>
                    <ul className="text-xs text-red-700 space-y-1 ml-6 list-disc">
                        <li>临床指南 (2024)</li>
                        <li>专家共识</li>
                        <li>经典教学病例</li>
                        <li>标准诊疗路径</li>
                    </ul>
                </div>

                {/* Training Module */}
                <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-violet-800 mb-2 flex items-center gap-2">
                        <Cpu size={16} /> 联邦训练核心
                    </h4>
                    <ul className="text-xs text-violet-700 space-y-1 ml-6 list-disc">
                        <li>基座模型预训练 (Llama/Qwen)</li>
                        <li>RLHF (人类反馈强化学习)</li>
                        <li>梯度聚合</li>
                        <li>全局模型版本控制</li>
                    </ul>
                </div>
            </div>
        </div>


        {/* --- MIDDLE LAYER: THE GRID --- */}
        <div className="relative z-10 flex justify-center mb-16">
            <div className="bg-slate-100 rounded-full px-8 py-2 border border-slate-200 flex items-center gap-8">
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                    <DownloadCloud size={16} />
                    模型权重 & 知识库更新
                </div>
                <div className="w-px h-6 bg-slate-300"></div>
                <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                    <UploadCloud size={16} />
                    脱敏反馈 (三元组)
                </div>
            </div>
        </div>


        {/* --- BOTTOM LAYER: EDGE NODE --- */}
        <div className="relative z-10">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-blue-500 rounded-full"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Server className="text-blue-600" /> 边缘节点 (地方医院 - 安全内网)
            </h3>

            <div className="bg-slate-50 rounded-2xl p-6 border-2 border-slate-200 border-dashed">
                <div className="flex items-center justify-between gap-4">
                    
                    {/* 1. Source */}
                    <div className="w-48 bg-white border border-slate-300 rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
                        <div className="bg-slate-100 p-3 rounded-full mb-3">
                            <Database className="text-slate-600" />
                        </div>
                        <div className="font-bold text-slate-700">HIS / EMR 系统</div>
                        <div className="text-xs text-slate-500 mt-1">Oracle / SQL Server</div>
                        <div className="mt-2 px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded">原始数据</div>
                    </div>

                    {/* 2. Adaptor */}
                    <div className="w-48 bg-emerald-50 border border-emerald-200 rounded-lg p-4 shadow-sm flex flex-col items-center text-center relative">
                        <div className="absolute -top-3 bg-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                            防火墙
                        </div>
                        <div className="bg-white p-3 rounded-full mb-3">
                            <Shield className="text-emerald-600" />
                        </div>
                        <div className="font-bold text-emerald-800">数据适配器</div>
                        <div className="text-xs text-emerald-600 mt-1 space-y-1">
                            <div>ETL 清洗</div>
                            <div>术语映射</div>
                            <div className="font-bold">PII 隐私移除</div>
                        </div>
                    </div>

                    {/* 3. Inference Engine */}
                    <div className="w-64 bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm flex flex-col relative">
                        <div className="font-bold text-blue-800 mb-3 text-center flex justify-center gap-2">
                            <Cpu size={16} /> RAG 推理引擎
                        </div>
                        
                        <div className="space-y-2">
                            <div className="bg-white p-2 rounded border border-blue-100 text-xs text-blue-700 flex items-center gap-2">
                                <Database size={12} /> 本地向量库
                            </div>
                            <div className="bg-white p-2 rounded border border-blue-100 text-xs text-blue-700 flex items-center gap-2">
                                <Lock size={12} /> 本地大模型 (Qwen-Med)
                            </div>
                        </div>
                        
                        <div className="mt-3 pt-3 border-t border-blue-200/50 text-[10px] text-blue-600 text-center">
                            检索来源: <br/>
                            <span className="font-semibold">1. 本地历史</span> + <span className="font-semibold">2. 金标准</span>
                        </div>
                    </div>

                    {/* 4. User Interface */}
                    <div className="w-48 bg-white border border-slate-300 rounded-lg p-4 shadow-sm flex flex-col items-center text-center">
                        <div className="bg-indigo-50 p-3 rounded-full mb-3">
                            <Stethoscope className="text-indigo-600" />
                        </div>
                        <div className="font-bold text-slate-700">医生工作站</div>
                        <div className="text-xs text-slate-500 mt-1">插件 / API</div>
                        
                        <div className="mt-3 flex gap-1">
                            <div className="w-2 h-2 bg-green-500 rounded-full" title="Adopt"></div>
                            <div className="w-2 h-2 bg-amber-500 rounded-full" title="Modify"></div>
                            <div className="w-2 h-2 bg-red-500 rounded-full" title="Reject"></div>
                        </div>
                        <div className="text-[9px] text-slate-400 mt-1">反馈生成</div>
                    </div>

                </div>
                
                <div className="mt-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-slate-200 px-3 py-1 rounded-full text-xs font-mono text-slate-600">
                        <FileJson size={12} />
                        三元组: {'{ 问题, 答案, 评分 }'}
                    </div>
                </div>

            </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 border border-slate-200 p-3 rounded-lg text-xs shadow-sm">
             <div className="font-bold mb-2 text-slate-700">数据流类型</div>
             <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-0.5 bg-slate-300"></div>
                <span className="text-slate-500">本地敏感数据</span>
             </div>
             <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-0.5 bg-blue-500 border-b border-dashed border-blue-500"></div>
                <span className="text-slate-500">知识下发 / 模型更新</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-8 h-0.5 bg-emerald-500 border-b border-dashed border-emerald-500"></div>
                <span className="text-slate-500">脱敏反馈上报</span>
             </div>
        </div>

      </div>
    </div>
  );
};

export default ArchitectureView;
