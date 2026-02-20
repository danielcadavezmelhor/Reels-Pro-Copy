
import { GoogleGenAI } from "@google/genai";
import { CopyInputs } from "../types";

export const generateReelsCaption = async (inputs: CopyInputs): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Crie um texto objetivo para a legenda de um Reels no Instagram sobre o assunto: "${inputs.subject}".
    
    A estrutura DEVE seguir exatamente estes 3 passos:

    1. [ PERGUNTA DE ATENÇÃO ] - Use exatamente esta pergunta: "${inputs.attentionQuestion}". 
       Certifique-se de começar a frase com um emoji relacionado.

    2. INTERESSE - Crie dois parágrafos persuasivos:
       - Parágrafo 1: Descreva a dor ou o problema que o assunto "${inputs.subject}" causa na audiência. Desperte o interesse em assistir o conteúdo.
       - Parágrafo 2: Descreva que existe uma solução e que o vídeo apresenta uma estratégia eficaz para vencer o problema.
       
    3. CALL TO ACTION - Use exatamente esta estrutura final:
       👇 Se fez sentido para você, escreva [ ${inputs.keyword} ] aqui embaixo.🔥
       📲 Envie para alguém que precisa destravar resultados.🚀
       👍 E fortaleça com seu LIKE ♥️

       #danielmuller
       #danielmulleroficial
       #cadavezmelhor
       #resultados
       #vendas

    REGRA CRUCIAL: Comece ABSOLUTAMENTE CADA ORAÇÃO/FRASE com um emoji relacionado ao que está sendo dito.
    O tom deve ser profissional, motivador e focado em resultados.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "Erro ao gerar conteúdo.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha na comunicação com a inteligência artificial. Tente novamente.");
  }
};
