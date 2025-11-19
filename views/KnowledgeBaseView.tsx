
import React from 'react';
import { BookOpenCheck, Search, Shield, FileCheck, BookMarked } from 'lucide-react';

const KnowledgeBaseView: React.FC = () => {
  const guidelines = [
    {
      id: 1,
      title: "2024年高血压诊断和治疗指南",
      type: "国家指南",
      date: "2024-01-15",
      status: "现行有效"
    },
    {
      id: 2,
      title: "中国胸痛中心认证标准专家共识",
      type: "专家共识",
      date: "2023-11-20",
      status: "现行有效"
    },
    {
      id: 3,
      title: "急性心肌梗死标准诊疗路径",
      type: "临床路径",
      date: "2023-09-10",
      status: "现行有效"
    }
  ];

  const cases = [
    {
      id: 101,
      title: "高龄患者复杂冠脉病变 PCI 治疗一例",
      category: "介入治疗",
      author: "阜外医院 张医师"
    },
    {
      id: 102,
      title: "爆发性心肌炎经 ECMO 救治成功案例",
      category: "重症监护",
      author: "阜外医院 李医师"
    }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="text-red-600" />
            阜外权威医学知识库
            </h1>
            <p className="text-slate-500 mt-1">
            系统的“只读”权威大脑。本地 RAG 将同时检索本地病例与此金标准库。
            </p>
        </div>
        <div className="bg-red-50 text-red-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border border-red-100">
            <Shield size={16} />
            权威内容认证
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Guidelines List */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">标准指南与专家共识</h3>
                    <span className="text-xs text-slate-500">已从中心枢纽同步</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {guidelines.map(g => (
                        <div key={g.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                            <div className="bg-red-100 p-2 rounded text-red-600">
                                <FileCheck size={20} />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-semibold text-slate-800">{g.title}</h4>
                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded">{g.type}</span>
                                    <span>{g.date}</span>
                                </div>
                            </div>
                            <div className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded font-medium">
                                {g.status}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800">经典教学病例</h3>
                    <span className="text-xs text-slate-500">专家经验传承</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {cases.map(c => (
                        <div key={c.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4">
                            <div className="bg-violet-100 p-2 rounded text-violet-600">
                                <BookMarked size={20} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-slate-800">{c.title}</h4>
                                <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
                                    <span className="bg-slate-100 px-2 py-0.5 rounded">{c.category}</span>
                                    <span>{c.author}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Right: Search Simulation */}
        <div className="space-y-6">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-lg">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Search size={18} /> RAG 检索模拟器
                </h3>
                <div className="relative mb-6">
                    <input 
                        type="text" 
                        disabled 
                        value="查询: 不稳定心绞痛的治疗方案" 
                        className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-2 text-sm text-slate-300" 
                    />
                </div>

                <div className="space-y-4">
                    <div className="border-l-2 border-red-500 pl-4">
                        <div className="text-xs text-red-300 font-semibold uppercase mb-1">来源：阜外金标准库</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            检索到 "2024 指南第 3.1 节": 抗缺血治疗应包含硝酸酯类药物及β受体阻滞剂...
                        </p>
                    </div>
                    <div className="border-l-2 border-blue-500 pl-4">
                        <div className="text-xs text-blue-300 font-semibold uppercase mb-1">来源：本地历史病历</div>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            检索到 "患者 0921": 对美托洛尔 25mg bid 反应良好...
                        </p>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                    <p className="text-xs text-slate-400">
                        双源检索确保医生既能获得标准建议，又能参考本地历史。
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBaseView;
