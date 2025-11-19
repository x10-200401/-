
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { RefreshCcw, ArrowUpRight, Trophy, Share2 } from 'lucide-react';

interface FederatedLearningProps {
    stats?: {
        adopted: number;
        modified: number;
        rejected: number;
        totalTriplets: number;
    }
}

const FederatedLearningView: React.FC<FederatedLearningProps> = ({ stats }) => {
  const performanceData = [
    { round: 'R1', base: 65, local: 68, federated: 70 },
    { round: 'R2', base: 65, local: 72, federated: 75 },
    { round: 'R3', base: 66, local: 74, federated: 79 },
    { round: 'R4', base: 66, local: 76, federated: 84 },
    { round: 'R5', base: 67, local: 79, federated: 88 },
    { round: 'R6', base: 67, local: 81, federated: 92 },
  ];

  // Default stats if not provided (fallback)
  const currentStats = stats || {
    adopted: 842,
    modified: 124,
    rejected: 56,
    totalTriplets: 1022
  };

  const feedbackStats = [
    { name: '采纳率', value: Math.round((currentStats.adopted / currentStats.totalTriplets) * 100) || 0, color: '#10b981' },
    { name: '修改率', value: Math.round((currentStats.modified / currentStats.totalTriplets) * 100) || 0, color: '#f59e0b' },
    { name: '拒绝率', value: Math.round((currentStats.rejected / currentStats.totalTriplets) * 100) || 0, color: '#ef4444' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">联邦评估与反馈机制</h2>
            <p className="text-slate-500">实时监控全国网络中的模型进化与表现。</p>
         </div>
         <div className="text-right">
            <div className="text-sm text-slate-500">当前全局模型版本</div>
            <div className="text-2xl font-mono font-bold text-violet-600">v2.4.1-Stable</div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Performance Chart */}
         <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                <ArrowUpRight className="text-blue-500" /> 模型准确率提升 (RLHF)
            </h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="round" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="base" name="基座模型 (Llama/Qwen)" stroke="#94a3b8" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="local" name="本地微调" stroke="#3b82f6" strokeWidth={2} />
                        <Line type="monotone" dataKey="federated" name="联邦全局模型" stroke="#7c3aed" strokeWidth={3} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-slate-400 mt-4 text-center">
                *联邦全局模型聚合了来自 1,000+ 家医院的梯度更新，未共享任何原始数据。
            </p>
         </div>

         {/* Stats Cards */}
         <div className="space-y-6">
            {/* Real-time Tripet Counter */}
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2">
                   <Share2 className="text-blue-500 w-5 h-5" /> 三元组采集
               </h3>
               <div className="text-4xl font-bold text-slate-900 mb-1">{currentStats.totalTriplets.toLocaleString()}</div>
               <p className="text-xs text-slate-500">今日采集的脱敏样本总数</p>
               
               <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                   <div className="bg-emerald-50 rounded p-2">
                       <div className="text-lg font-bold text-emerald-600">{currentStats.adopted}</div>
                       <div className="text-[10px] text-emerald-800 uppercase">采纳</div>
                   </div>
                   <div className="bg-amber-50 rounded p-2">
                       <div className="text-lg font-bold text-amber-600">{currentStats.modified}</div>
                       <div className="text-[10px] text-amber-800 uppercase">修改</div>
                   </div>
                   <div className="bg-red-50 rounded p-2">
                       <div className="text-lg font-bold text-red-600">{currentStats.rejected}</div>
                       <div className="text-[10px] text-red-800 uppercase">拒绝</div>
                   </div>
               </div>
            </div>

            <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-xl p-6 text-white shadow-lg">
               <div className="flex items-center gap-3 mb-2">
                  <Trophy className="w-6 h-6 text-yellow-300" />
                  <h3 className="font-bold">阜外金标准一致性</h3>
               </div>
               <div className="text-4xl font-bold mb-1">92.4%</div>
               <p className="text-violet-200 text-sm">与专家共识的一致程度</p>
               
               <div className="mt-6 pt-6 border-t border-white/10">
                  <div className="text-sm opacity-80 mb-2">下次模型推送</div>
                  <div className="flex justify-between items-center">
                     <span className="font-mono font-bold">2 天后</span>
                     <RefreshCcw className="w-4 h-4 animate-spin-slow" />
                  </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4">反馈分布</h3>
                <div className="space-y-4">
                    {feedbackStats.map((stat) => (
                        <div key={stat.name}>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-slate-600">{stat.name}</span>
                                <span className="font-bold" style={{ color: stat.color }}>{stat.value}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all duration-500" 
                                    style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default FederatedLearningView;
