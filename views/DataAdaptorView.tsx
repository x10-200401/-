
import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Database,
  Eraser,
  Settings,
  Play,
  Lock,
  RefreshCw
} from 'lucide-react';

const DataAdaptorView: React.FC = () => {
  const defaultInput = `<div>姓名: 张伟</div>
<span class="id">身份证号: 110101198001011234??</span>
<p>地址: 北京市朝阳区某街道12号 &nbsp;</p>
<div>主诉: 患者自述胸痹 (Xiong Bi) 3天。</div> 
<div>既往史: 高血压病史。血压: 150/95 mmHg。</div>`;

  const [inputData, setInputData] = useState(defaultInput);
  const [outputData, setOutputData] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Configuration Toggles
  const [config, setConfig] = useState({
    cleanHtml: true,
    standardizeTerms: true,
    anonymizePii: true
  });

  // Pipeline Status
  const [pipelineStep, setPipelineStep] = useState<'IDLE' | 'CLEANING' | 'MAPPING' | 'MASKING' | 'VECTORIZING'>('IDLE');

  const handleProcess = () => {
    setIsProcessing(true);
    setPipelineStep('CLEANING');
    
    // Simulate pipeline latency
    setTimeout(() => {
        let processed = inputData;
        
        if (config.cleanHtml) {
            // Remove HTML tags
            processed = processed.replace(/<[^>]*>/g, '');
            // Fix common entities
            processed = processed.replace(/&nbsp;/g, ' ');
            // Remove non-standard characters (simulated)
            processed = processed.replace(/\?\?/g, '');
        }
        
        setPipelineStep('MAPPING');
        setTimeout(() => {
            if (config.standardizeTerms) {
                processed = processed.replace(/胸痹/gi, '[标准术语: 心绞痛 (Angina)]');
                processed = processed.replace(/Xiong Bi/gi, '');
                processed = processed.replace(/chest tightness/gi, '[标准术语: 胸部不适]');
            }

            setPipelineStep('MASKING');
            setTimeout(() => {
                if (config.anonymizePii) {
                    // Simple Regex for ID cards (18 digits)
                    processed = processed.replace(/\d{18}/g, '[身份证号已脱敏]');
                    // Simple Regex for Names (Assuming format Name: X)
                    processed = processed.replace(/(姓名:\s*)([\u4e00-\u9fa5]{2,4})/g, '$1[姓名已脱敏]');
                    // Address masking
                    processed = processed.replace(/(地址:\s*)(.*)/g, '$1[详细地址已屏蔽]');
                }

                setPipelineStep('VECTORIZING');
                setOutputData(processed);
                
                setTimeout(() => {
                    setPipelineStep('IDLE');
                    setIsProcessing(false);
                }, 1000);
            }, 800);
        }, 800);
    }, 800);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="text-blue-600" />
          标准化数据适配模块
        </h2>
        <p className="text-slate-500 mt-1">
          医疗AI的“防火墙”。用于清洗杂乱的 HIS 数据、标准化医学术语，并在数据进入向量库前强制执行隐私脱敏。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        
        {/* Configuration Panel */}
        <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Settings size={18} /> ETL 配置
                </h3>
                <div className="space-y-4">
                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${config.cleanHtml ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Eraser size={16} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">清洗 HTML/乱码</span>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={config.cleanHtml} 
                            onChange={e => setConfig({...config, cleanHtml: e.target.checked})}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${config.standardizeTerms ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}`}>
                                <RefreshCw size={16} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">术语标准化映射</span>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={config.standardizeTerms} 
                            onChange={e => setConfig({...config, standardizeTerms: e.target.checked})}
                            className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer group">
                        <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded ${config.anonymizePii ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                <Lock size={16} />
                            </div>
                            <span className="text-sm font-medium text-slate-700">隐私脱敏 (PII)</span>
                        </div>
                        <input 
                            type="checkbox" 
                            checked={config.anonymizePii} 
                            onChange={e => setConfig({...config, anonymizePii: e.target.checked})}
                            className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                    </label>
                </div>

                <button 
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all
                        ${isProcessing 
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg active:scale-95'}
                    `}
                >
                    {isProcessing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
                            处理中...
                        </>
                    ) : (
                        <>
                            <Play size={18} /> 运行适配器
                        </>
                    )}
                </button>
            </div>

            {/* Status Indicators */}
            <div className="space-y-2">
                <div className={`text-xs font-mono px-3 py-2 rounded border flex justify-between items-center transition-colors
                    ${pipelineStep === 'CLEANING' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                    <span>1. 格式清洗</span>
                    {pipelineStep === 'CLEANING' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"/>}
                </div>
                <div className={`text-xs font-mono px-3 py-2 rounded border flex justify-between items-center transition-colors
                    ${pipelineStep === 'MAPPING' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                    <span>2. 术语标准化</span>
                    {pipelineStep === 'MAPPING' && <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"/>}
                </div>
                <div className={`text-xs font-mono px-3 py-2 rounded border flex justify-between items-center transition-colors
                    ${pipelineStep === 'MASKING' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                    <span>3. 隐私过滤</span>
                    {pipelineStep === 'MASKING' && <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/>}
                </div>
                <div className={`text-xs font-mono px-3 py-2 rounded border flex justify-between items-center transition-colors
                    ${pipelineStep === 'VECTORIZING' ? 'bg-violet-50 border-violet-200 text-violet-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                    <span>4. 向量化处理</span>
                    {pipelineStep === 'VECTORIZING' && <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"/>}
                </div>
            </div>
        </div>

        {/* I/O Display */}
        <div className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Input Area */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[250px]">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <FileText size={16} /> 原始 HIS/EMR 数据输入
                    </div>
                    <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border">可编辑</span>
                </div>
                <textarea 
                    className="flex-1 p-4 font-mono text-sm text-slate-600 resize-none focus:outline-none focus:bg-blue-50/30 transition-colors"
                    value={inputData}
                    onChange={e => setInputData(e.target.value)}
                    placeholder="在此粘贴脏数据..."
                />
            </div>

            {/* Arrow */}
            <div className="flex justify-center">
                <div className={`p-2 rounded-full transition-all duration-500 ${isProcessing ? 'bg-blue-100 text-blue-600 translate-y-2' : 'bg-slate-100 text-slate-300'}`}>
                    <ArrowRight className={`w-6 h-6 ${isProcessing ? 'rotate-90' : 'rotate-90'}`} />
                </div>
            </div>

            {/* Output Area */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-lg overflow-hidden flex flex-col h-[250px] relative">
                <div className="bg-slate-800 border-b border-slate-700 px-4 py-2 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
                        <ShieldCheck size={16} className="text-emerald-400" /> 合规 RAG 上下文
                    </div>
                    {pipelineStep === 'VECTORIZING' && (
                        <span className="text-xs text-emerald-400 flex items-center gap-1 animate-pulse">
                            <Database size={12} /> 准备嵌入 (Embedding)
                        </span>
                    )}
                </div>
                <div className="flex-1 p-4 font-mono text-sm text-emerald-50 overflow-y-auto">
                    {outputData ? (
                        <div className="whitespace-pre-wrap animate-in fade-in duration-500">
                            {outputData}
                            <div className="mt-4 pt-4 border-t border-slate-700 text-slate-500 text-xs">
                                {'// 生成的元数据:'} <br/>
                                {'{'}<br/>
                                &nbsp;&nbsp;"source_node": "SPOKE_BJ_02",<br/>
                                &nbsp;&nbsp;"compliance_check": "PASS",<br/>
                                &nbsp;&nbsp;"timestamp": "{new Date().toISOString()}"<br/>
                                {'}'}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-600 italic">
                            等待处理...
                        </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default DataAdaptorView;
