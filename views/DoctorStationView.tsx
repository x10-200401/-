
import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  Search, 
  Zap,
  BrainCircuit,
  Eye,
  EyeOff,
  ThumbsUp,
  ThumbsDown,
  Edit3,
  BriefcaseMedical,
  Pill,
  Activity,
  Sparkles,
  AlertTriangle,
  FileText,
  History,
  Plus,
  X
} from 'lucide-react';

interface DoctorStationProps {
  onFeedbackSubmit?: (type: 'ADOPT' | 'MODIFY' | 'REJECT') => void;
}

// Mock Dictionary for Auto-complete (Chinese)
const MEDICAL_TERMS = [
    "心绞痛", "急性心肌梗死", "阿司匹林", "阿托伐他汀", 
    "β受体阻滞剂", "心动过缓", "氯吡格雷", "呼吸困难", "射血分数", 
    "呋塞米", "高血压", "低血压", "心肌缺血", "美托洛尔", 
    "硝酸甘油", "心悸", "经皮冠状动脉介入治疗 (PCI)", 
    "窦性心律", "心动过速", "肌钙蛋白 I", "心室颤动"
];

const DoctorStationView: React.FC<DoctorStationProps> = ({ onFeedbackSubmit }) => {
  const [noteContent, setNoteContent] = useState('');
  const [silentMode, setSilentMode] = useState(true);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [feedbackLog, setFeedbackLog] = useState<string[]>([]);
  
  // Autocomplete State
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredTerms, setFilteredTerms] = useState<string[]>([]);
  const [cursorTrigger, setCursorTrigger] = useState<{word: string, index: number} | null>(null);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timerRef = useRef<any>(null);

  // 1. AI Simulation Logic
  useEffect(() => {
    if (!noteContent) {
        setAiSuggestions([]);
        return;
    }

    setIsTyping(true);
    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setIsTyping(false);
      generateMockInsights(noteContent);
    }, 800);

    return () => clearTimeout(timerRef.current);
  }, [noteContent]);

  // 2. Autocomplete Logic
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNoteContent(val);

    // Simple logic: check last word (Chinese specific logic could be improved, here we use simple splitting)
    // For Chinese, we usually check the last few characters.
    const lastChars = val.slice(-2); // Check last 2 chars

    if (lastChars.length >= 1) {
        const matches = MEDICAL_TERMS.filter(term => 
            term.includes(lastChars) && term !== lastChars
        );
        if (matches.length > 0) {
            setFilteredTerms(matches.slice(0, 5));
            setShowAutocomplete(true);
            setCursorTrigger({ word: lastChars, index: val.lastIndexOf(lastChars) });
            return;
        }
    }
    setShowAutocomplete(false);
  };

  const insertTerm = (term: string) => {
    if (!cursorTrigger) return;
    const before = noteContent.substring(0, cursorTrigger.index);
    // We don't worry about after text for this simple demo, just appending logic style
    setNoteContent(before + term + " ");
    setShowAutocomplete(false);
    textareaRef.current?.focus();
  };

  const generateMockInsights = (text: string) => {
    const suggestions = [];
    const lowerText = text.toLowerCase();

    // Priority 1: Critical Alerts (Triggered by "血压", "180", "高血压")
    if (lowerText.includes('血压') || lowerText.includes('180') || lowerText.includes('高血压')) {
       suggestions.push({
        id: 'sug_crit_1',
        priority: 'HIGH',
        type: 'alert',
        source: '风险预测模型 v2.1',
        title: '高血压危象风险',
        reasoning: '检测到血压 > 180/120',
        content: '需立即干预。建议评估靶器官损害（视网膜、肾脏）。考虑静脉输注拉贝洛尔。'
      });
    }

    // Priority 2: Protocols (Triggered by "胸痛", "心绞痛", "心梗")
    if (lowerText.includes('胸痛') || lowerText.includes('心绞痛') || lowerText.includes('心梗')) {
      suggestions.push({
        id: 'sug_proto_1',
        priority: 'MEDIUM',
        type: 'protocol',
        source: '阜外医院指南 2024',
        title: '不稳定心绞痛标准路径',
        reasoning: '症状匹配: "胸痛"',
        content: '医嘱建议: 1. 心电图 (10分钟内) 2. 查肌钙蛋白 I 3. 阿司匹林 300mg 负荷剂量。'
      });
    }
    
    // Priority 3: History/Context
    if (lowerText.includes('胸痛') || lowerText.includes('病史')) {
        suggestions.push({
            id: 'sug_hist_1',
            priority: 'LOW',
            type: 'history',
            source: '本地电子病历',
            title: '既往病史匹配',
            reasoning: '相似度搜索: 92%',
            content: '患者2022年有类似发作。冠脉造影显示前降支(LAD)狭窄40%。对硝酸甘油反应良好。'
        });
    }

    setAiSuggestions(suggestions);
  };

  const handleFeedback = (type: 'ADOPT' | 'MODIFY' | 'REJECT', item: any) => {
    const triplet = {
        problem: noteContent,
        answer: item.content,
        rating: type
    };
    setFeedbackLog(prev => [`已记录: [${type === 'ADOPT' ? '采纳' : type === 'MODIFY' ? '修改' : '拒绝'}] ${item.title}`, ...prev]);
    if (onFeedbackSubmit) onFeedbackSubmit(type);

    // If adopted, strictly append to note for demo effect
    if (type === 'ADOPT') {
        setNoteContent(prev => prev + "\n\n[AI 建议]: " + item.content);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-20">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 border border-blue-200">
                    李
                </div>
                <div>
                    <h2 className="font-bold text-slate-800 leading-tight">李明 医师</h2>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <BriefcaseMedical size={12} /> 心内科
                        <span className="text-slate-300">|</span>
                        <span className="text-green-600 font-medium flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div> 在线
                        </span>
                    </div>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                 <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full border border-slate-200 transition-colors hover:bg-white">
                   <button onClick={() => setSilentMode(!silentMode)} className="flex items-center gap-2 outline-none">
                      <div className={`w-2.5 h-2.5 rounded-full transition-colors ${silentMode ? 'bg-amber-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]'}`}></div>
                      <span className="text-xs font-bold text-slate-700">{silentMode ? '静默运行模式' : '主动辅助模式'}</span>
                      <span className="text-slate-300 mx-1">|</span>
                      {silentMode ? <EyeOff size={14} className="text-slate-400"/> : <Eye size={14} className="text-emerald-600"/>}
                   </button>
                </div>
            </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
            {/* Left: Editor */}
            <div className="flex-1 p-6 overflow-y-auto relative bg-slate-50/50">
                <div className="max-w-3xl mx-auto h-full flex flex-col">
                     
                     {/* Paper Container */}
                     <div className="flex-1 bg-white shadow-sm border border-slate-200 rounded-xl p-8 relative flex flex-col">
                         <div className="absolute top-5 right-5 text-slate-300 hover:text-blue-500 cursor-pointer transition-colors">
                            <Mic className="w-5 h-5" />
                         </div>
                         
                         <h3 className="text-lg font-bold text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">
                            <FileText size={20} className="text-slate-400"/> 
                            临床病程记录 <span className="text-xs font-normal text-slate-400 bg-slate-50 px-2 py-1 rounded">#CN-20240514</span>
                         </h3>
                         
                         <div className="flex-1 relative">
                            <textarea 
                                ref={textareaRef}
                                className="w-full h-full p-4 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 outline-none transition-all text-slate-700 leading-relaxed resize-none font-mono text-sm"
                                placeholder="开始输入患者症状 (例如：'胸痛', '高血压')..."
                                value={noteContent}
                                onChange={handleTextChange}
                            />
                            
                            {/* Autocomplete Dropdown */}
                            {showAutocomplete && (
                                <div className="absolute bottom-4 left-4 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden min-w-[200px] animate-in slide-in-from-bottom-2 fade-in duration-200">
                                    <div className="bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-600 uppercase tracking-wider flex justify-between items-center">
                                        <span>智能建议</span>
                                        <kbd className="font-mono bg-white px-1 rounded border border-blue-100">Tab</kbd>
                                    </div>
                                    {filteredTerms.map((term, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => insertTerm(term)}
                                            className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2 transition-colors"
                                        >
                                            <Sparkles size={12} className="text-blue-400 opacity-50" />
                                            {term}
                                        </button>
                                    ))}
                                </div>
                            )}
                         </div>

                         {/* Vitals Quick Bar */}
                         <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">血压 (BP)</label>
                                <div className="text-slate-700 font-mono font-semibold">150/95</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">心率 (HR)</label>
                                <div className="text-slate-700 font-mono font-semibold">88 BPM</div>
                            </div>
                            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <label className="text-[10px] font-bold text-slate-400 uppercase">血氧 (SpO2)</label>
                                <div className="text-slate-700 font-mono font-semibold">98%</div>
                            </div>
                         </div>
                     </div>
                     
                     {/* Toast Log */}
                     <div className="fixed bottom-6 left-6 flex flex-col gap-2 pointer-events-none z-50">
                        {feedbackLog.slice(0,3).map((log, i) => (
                            <div key={i} className="bg-slate-800/90 backdrop-blur text-emerald-400 text-xs px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-in slide-in-from-left-4 fade-in">
                                <Activity size={12} /> {log}
                            </div>
                        ))}
                     </div>
                </div>
            </div>

            {/* Right: AI Sidebar */}
            <div className="w-[400px] bg-white border-l border-slate-200 flex flex-col shadow-xl z-10">
                <div className="p-5 border-b border-slate-100 bg-gradient-to-b from-white to-slate-50/50">
                    <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-slate-800 flex items-center gap-2">
                            <BrainCircuit className={`transition-colors ${silentMode ? 'text-slate-400' : 'text-violet-600'}`} size={20} />
                            临床智能辅助
                        </h3>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${silentMode ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-violet-100 text-violet-700 border-violet-200'}`}>
                            {silentMode ? '观察中' : '活跃'}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500">
                        基于本地 RAG 和阜外知识库推理。
                    </p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/30">
                    {isTyping && (
                        <div className="flex items-center justify-center gap-2 py-8 text-slate-400 text-sm animate-pulse">
                            <Zap size={16} className="text-violet-400" /> 
                            分析上下文中...
                        </div>
                    )}

                    {!isTyping && aiSuggestions.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400 text-center opacity-60">
                            <Search className="w-10 h-10 mb-3 stroke-1" />
                            <p className="text-sm font-medium">正在监听临床输入</p>
                            <p className="text-xs mt-1">请输入诊断、症状或用药</p>
                        </div>
                    )}

                    {/* Suggestions List */}
                    {aiSuggestions.map((item, idx) => (
                        <div 
                            key={idx} 
                            className={`relative bg-white rounded-xl border transition-all duration-500 group overflow-hidden
                                ${item.priority === 'HIGH' ? 'border-red-200 shadow-red-100 shadow-sm' : 
                                  item.priority === 'MEDIUM' ? 'border-blue-200 shadow-blue-100 shadow-sm' : 'border-slate-200 shadow-sm'}
                                ${silentMode ? 'grayscale-[0.8] opacity-70 hover:grayscale-0 hover:opacity-100' : 'opacity-100'}
                            `}
                        >
                            {/* Header Color Bar */}
                            <div className={`h-1 w-full ${item.priority === 'HIGH' ? 'bg-red-500' : item.priority === 'MEDIUM' ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                            
                            <div className="p-4">
                                {/* Source Badge */}
                                <div className="flex justify-between items-start mb-2">
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1
                                        ${item.priority === 'HIGH' ? 'bg-red-50 text-red-700 border border-red-100' : 
                                          item.priority === 'MEDIUM' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-slate-100 text-slate-600 border border-slate-200'}
                                    `}>
                                        {item.priority === 'HIGH' && <AlertTriangle size={10} />}
                                        {item.priority === 'MEDIUM' && <FileText size={10} />}
                                        {item.priority === 'LOW' && <History size={10} />}
                                        {item.source}
                                    </span>
                                    {item.reasoning && (
                                        <span className="text-[9px] text-slate-400 italic">
                                            原因: {item.reasoning}
                                        </span>
                                    )}
                                </div>

                                <h4 className="font-bold text-slate-800 text-sm mb-2 flex items-center gap-2">
                                    {item.title}
                                </h4>
                                
                                <div className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
                                    {item.content}
                                </div>
                                
                                {/* Action Bar */}
                                {!silentMode && (
                                    <div className="flex items-center justify-between pt-2">
                                        <button 
                                            onClick={() => handleFeedback('ADOPT', item)}
                                            className="flex-1 mr-2 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors"
                                        >
                                            <Plus size={14} /> 采纳建议
                                        </button>
                                        
                                        <div className="flex gap-1">
                                            <button onClick={() => handleFeedback('MODIFY', item)} className="p-1.5 hover:bg-amber-50 text-slate-400 hover:text-amber-600 rounded-lg transition-colors" title="修改并学习">
                                                <Edit3 size={16} />
                                            </button>
                                            <button onClick={() => handleFeedback('REJECT', item)} className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors" title="拒绝">
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {/* Silent Mode Overlay Hint */}
                            {silentMode && (
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity pointer-events-none">
                                    <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-sm">
                                        静默评估模式
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                
                {/* Footer Legend */}
                <div className="p-3 bg-slate-50 border-t border-slate-200 text-[10px] text-slate-400 flex justify-center gap-4">
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full"></div> 危急值</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-blue-500 rounded-full"></div> 诊疗规范</span>
                    <span className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-400 rounded-full"></div> 历史记录</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DoctorStationView;
