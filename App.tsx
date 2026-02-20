
import React, { useState, useCallback } from 'react';
import { CopyInputs, GeneratedCopy } from './types';
import { generateReelsCaption } from './services/geminiService';

// --- Helper Components ---

const InputField: React.FC<{
  label: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  id: string;
}> = ({ label, placeholder, value, onChange, id }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <input
      id={id}
      type="text"
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
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

  const handleGenerate = async () => {
    if (!inputs.subject || !inputs.attentionQuestion || !inputs.keyword) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    setResult({ ...result, status: 'loading', errorMessage: undefined });
    
    try {
      const text = await generateReelsCaption(inputs);
      setResult({ fullText: text, status: 'success' });
    } catch (err: any) {
      setResult({ ...result, status: 'error', errorMessage: err.message });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result.fullText);
    alert("Copiado para a área de transferência! ✨");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* Sidebar / Inputs */}
        <div className="w-full md:w-1/2 p-8 bg-white border-b md:border-b-0 md:border-r border-gray-100">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Reels Pro Copy</h1>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Gere legendas magnéticas baseadas na metodologia do Daniel Muller. Preencha os detalhes abaixo.
          </p>

          <InputField
            id="subject"
            label="[ ASSUNTO DO REELS ]"
            placeholder="Ex: Como vender mais em 2024"
            value={inputs.subject}
            onChange={(v) => setInputs(prev => ({ ...prev, subject: v }))}
          />

          <InputField
            id="attention"
            label="[ PERGUNTA DE ATENÇÃO ]"
            placeholder="Ex: Você sente que seus resultados estagnaram?"
            value={inputs.attentionQuestion}
            onChange={(v) => setInputs(prev => ({ ...prev, attentionQuestion: v }))}
          />

          <InputField
            id="keyword"
            label="[ PALAVRA CHAVE ]"
            placeholder="Ex: VENDAS"
            value={inputs.keyword}
            onChange={(v) => setInputs(prev => ({ ...prev, keyword: v }))}
          />

          <button
            onClick={handleGenerate}
            disabled={result.status === 'loading'}
            className={`w-full mt-6 py-3 px-6 rounded-xl font-bold text-white transition-all shadow-lg ${
              result.status === 'loading' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'
            }`}
          >
            {result.status === 'loading' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Gerando Copy...
              </span>
            ) : 'Gerar Legenda ✨'}
          </button>
        </div>

        {/* Output Area */}
        <div className="w-full md:w-1/2 p-8 bg-gray-50 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">Preview da Legenda</h2>
            {result.status === 'success' && (
              <button
                onClick={copyToClipboard}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copiar
              </button>
            )}
          </div>

          <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 overflow-y-auto max-h-[500px] whitespace-pre-wrap text-gray-800 leading-relaxed shadow-inner">
            {result.status === 'idle' && (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 italic">
                <svg className="w-12 h-12 mb-2 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
                Sua legenda aparecerá aqui...
              </div>
            )}
            {result.status === 'error' && (
              <div className="text-red-500 font-medium">
                ❌ {result.errorMessage}
              </div>
            )}
            {result.status === 'success' && (
              <div className="animate-in fade-in duration-500">
                {result.fullText}
              </div>
            )}
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-xs text-blue-700">
              💡 <strong>Dica do Pro:</strong> Legendas que geram conversação (comentários com a palavra-chave) aumentam o alcance do seu Reels drasticamente!
            </p>
          </div>
        </div>

      </div>
      
      <footer className="mt-8 text-gray-400 text-sm flex flex-col items-center gap-1">
        <p>© 2024 • Cada vez melhor • Daniel Muller</p>
        <div className="flex gap-4">
          <span className="hover:text-blue-500 cursor-default">#resultados</span>
          <span className="hover:text-blue-500 cursor-default">#vendas</span>
          <span className="hover:text-blue-500 cursor-default">#mentoria</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
