
import React, { useState } from 'react';
import { CopyInputs, GeneratedCopy } from './types';
import { generateReelsCaption } from './services/geminiService';
import { 
  Copy, 
  Check, 
  Sparkles, 
  Send, 
  Instagram, 
  AlertCircle,
  Loader2,
  MessageSquare,
  Hash
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Helper Components ---

const InputField: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  id: string;
  icon: React.ReactNode;
}> = ({ label, placeholder, value, onChange, id, icon }) => (
  <div className="mb-5">
    <label htmlFor={id} className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
      {icon}
      {label}
    </label>
    <div className="relative group">
      <input
        id={id}
        type="text"
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="absolute inset-0 rounded-xl border border-indigo-500/0 group-focus-within:border-indigo-500/50 pointer-events-none transition-all duration-200" />
    </div>
  </div>
);

const App: React.FC = () => {
  const [inputs, setInputs] = useState<CopyInputs>({
    subject: '',
    attentionQuestion: '',
    keyword: '',
  });

  const [result, setResult] = useState<GeneratedCopy>({
    fullText: '',
    status: 'idle',
  });

  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!inputs.subject || !inputs.attentionQuestion || !inputs.keyword) {
      return;
    }

    setResult({ ...result, status: 'loading', errorMessage: undefined });
    setCopied(false);
    
    try {
      const text = await generateReelsCaption(inputs);
      setResult({ fullText: text, status: 'success' });
    } catch (err: any) {
      setResult({ ...result, status: 'error', errorMessage: err.message });
    }
  };

  const copyToClipboard = () => {
    if (!result.fullText) return;
    navigator.clipboard.writeText(result.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isFormValid = inputs.subject && inputs.attentionQuestion && inputs.keyword;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        
        {/* Header */}
        <header className="mb-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-bold uppercase tracking-widest mb-4"
          >
            <Sparkles className="w-3 h-3" />
            Powered by Gemini 3
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">
            Reels Pro <span className="text-indigo-600">Copy</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Gere legendas magnéticas que convertem seguidores em clientes usando a metodologia do Daniel Muller.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Inputs */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-5 bg-white rounded-3xl shadow-sm border border-slate-200 p-8"
          >
            <div className="space-y-2 mb-8">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Instagram className="w-5 h-5 text-indigo-600" />
                Configuração do Reels
              </h2>
              <p className="text-sm text-slate-400">Preencha os pilares da sua estratégia</p>
            </div>

            <InputField
              id="subject"
              label="Assunto do Reels"
              placeholder="Ex: Como vender mais em 2024"
              value={inputs.subject}
              onChange={(v) => setInputs(prev => ({ ...prev, subject: v }))}
              icon={<MessageSquare className="w-3.5 h-3.5" />}
            />

            <InputField
              id="attention"
              label="Pergunta de Atenção"
              placeholder="Ex: Você sente que seus resultados estagnaram?"
              value={inputs.attentionQuestion}
              onChange={(v) => setInputs(prev => ({ ...prev, attentionQuestion: v }))}
              icon={<AlertCircle className="w-3.5 h-3.5" />}
            />

            <InputField
              id="keyword"
              label="Palavra-Chave (CTA)"
              placeholder="Ex: VENDAS"
              value={inputs.keyword}
              onChange={(v) => setInputs(prev => ({ ...prev, keyword: v }))}
              icon={<Hash className="w-3.5 h-3.5" />}
            />

            <button
              onClick={handleGenerate}
              disabled={result.status === 'loading' || !isFormValid}
              className={`w-full mt-4 py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 ${
                result.status === 'loading' || !isFormValid
                  ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] hover:shadow-indigo-300'
              }`}
            >
              {result.status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Criando sua obra-prima...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Gerar Legenda Persuasiva
                </>
              )}
            </button>
          </motion.div>

          {/* Right Column: Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 flex flex-col h-full min-h-[600px]"
          >
            <div className="bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full border border-slate-800">
              
              {/* Preview Header */}
              <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                  </div>
                  <span className="ml-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Preview da Legenda</span>
                </div>

                <AnimatePresence>
                  {result.status === 'success' && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={copyToClipboard}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                        copied 
                          ? 'bg-emerald-500 text-white' 
                          : 'bg-indigo-600 text-white hover:bg-indigo-700'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          Copiar Legenda
                        </>
                      )}
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>

              {/* Preview Content */}
              <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                  {result.status === 'idle' && (
                    <motion.div 
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center space-y-4"
                    >
                      <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
                        <Send className="w-8 h-8 text-slate-600" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-slate-400 font-medium">Pronto para brilhar?</p>
                        <p className="text-slate-600 text-sm max-w-[240px]">
                          Preencha os campos ao lado e clique em gerar para ver a mágica acontecer.
                        </p>
                      </div>
                    </motion.div>
                  )}

                  {result.status === 'loading' && (
                    <motion.div 
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center space-y-6"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                        <Sparkles className="w-6 h-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <p className="text-slate-400 font-medium animate-pulse">Consultando o mestre Daniel Muller...</p>
                    </motion.div>
                  )}

                  {result.status === 'error' && (
                    <motion.div 
                      key="error"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-bold">Ops! Algo deu errado</span>
                      </div>
                      <p className="text-sm opacity-80">{result.errorMessage}</p>
                    </motion.div>
                  )}

                  {result.status === 'success' && (
                    <motion.div 
                      key="success"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-slate-300 whitespace-pre-wrap leading-relaxed font-medium text-lg"
                    >
                      {result.fullText}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Tip */}
              <div className="p-6 bg-slate-800/30 border-t border-slate-800">
                <div className="flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">Dica do Pro</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Legendas que geram conversação (comentários com a palavra-chave) aumentam o alcance do seu Reels drasticamente pelo algoritmo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Global Footer */}
        <footer className="mt-20 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-400 text-sm">
          <div className="flex items-center gap-2 font-medium">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            © 2024 • Cada vez melhor • Daniel Muller
          </div>
          <div className="flex gap-6 font-bold uppercase tracking-widest text-[10px]">
            <span className="hover:text-indigo-600 transition-colors cursor-default">#resultados</span>
            <span className="hover:text-indigo-600 transition-colors cursor-default">#vendas</span>
            <span className="hover:text-indigo-600 transition-colors cursor-default">#mentoria</span>
          </div>
        </footer>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default App;
